#!/usr/bin/env python3
"""Serve the orange tree with a small persistent, shared notes API."""

from __future__ import annotations

import argparse
import hmac
import json
import os
import re
import secrets
import threading
import uuid
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parent
ORANGE_PATH = re.compile(r"^/api/oranges/([A-Za-z0-9-]+)/replies$")
ORANGE_ITEM_PATH = re.compile(r"^/api/oranges/([A-Za-z0-9-]+)$")
STORE_LOCK = threading.Lock()


def normalized_text(value: object, limit: int) -> str:
    return " ".join(str(value or "").split())[:limit]


def public_orange(orange: dict) -> dict:
    result = json.loads(json.dumps(orange, ensure_ascii=False))
    result.pop("_ownerToken", None)
    return result


def is_private_tree_seed(value: object) -> bool:
    try:
        seed = int(value)
    except (TypeError, ValueError):
        return False
    return 100000 <= seed <= 999999


class Store:
    def __init__(self, path: Path) -> None:
        self.path = path
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.oranges = self._load()

    def _load(self) -> list[dict]:
        if not self.path.exists():
            return []
        try:
            payload = json.loads(self.path.read_text(encoding="utf-8"))
            oranges = payload.get("oranges", []) if isinstance(payload, dict) else []
            return oranges if isinstance(oranges, list) else []
        except (json.JSONDecodeError, OSError):
            return []

    def save(self) -> None:
        temporary = self.path.with_suffix(".tmp")
        temporary.write_text(
            json.dumps({"oranges": self.oranges}, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        temporary.replace(self.path)

    def list(self, tree_code: int | None = None) -> list[dict]:
        with STORE_LOCK:
            if tree_code is None:
                return [
                    public_orange(orange)
                    for orange in self.oranges
                    if not is_private_tree_seed(orange.get("seed"))
                ]
            return [
                public_orange(orange)
                for orange in self.oranges
                if int(orange.get("seed", 0)) == tree_code
            ]

    def add_orange(self, text: str, author: str, seed: int, tree_name: str = "") -> dict:
        owner_token = secrets.token_urlsafe(24)
        orange = {
            "id": uuid.uuid4().hex,
            "text": text,
            "author": author,
            "treeName": tree_name,
            "seed": seed,
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "replies": [],
            "_ownerToken": owner_token,
        }
        with STORE_LOCK:
            if is_private_tree_seed(seed) and any(
                int(item.get("seed", 0)) == seed for item in self.oranges
            ):
                raise ValueError("tree code already exists")
            self.oranges.append(orange)
            self.oranges = self.oranges[-200:]
            self.save()
            return {**public_orange(orange), "ownerToken": owner_token}

    def add_reply(self, orange_id: str, text: str, author: str) -> dict | None:
        with STORE_LOCK:
            orange = next((item for item in self.oranges if item.get("id") == orange_id), None)
            if not orange:
                return None
            replies = orange.setdefault("replies", [])
            if len(replies) >= 24:
                raise ValueError("reply limit reached")
            replies.append(
                {
                    "id": uuid.uuid4().hex,
                    "text": text,
                    "author": author,
                    "createdAt": datetime.now(timezone.utc).isoformat(),
                }
            )
            self.save()
            return public_orange(orange)

    def remove_orange(self, orange_id: str, owner_token: str) -> str:
        with STORE_LOCK:
            index = next(
                (i for i, item in enumerate(self.oranges) if item.get("id") == orange_id),
                -1,
            )
            if index < 0:
                return "not_found"
            stored_token = self.oranges[index].get("_ownerToken", "")
            if not owner_token or not hmac.compare_digest(stored_token, owner_token):
                return "forbidden"
            self.oranges.pop(index)
            self.save()
            return "removed"


class OrangeRequestHandler(SimpleHTTPRequestHandler):
    store: Store

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self) -> None:
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        if self.path.startswith("/api/"):
            self.send_header("Cache-Control", "no-store")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def send_json(self, payload: object, status: int = 200) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def send_error_json(self, status: int, message: str) -> None:
        self.send_json({"error": message}, status)

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.end_headers()

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path
        if path == "/api/health":
            self.send_json({"ok": True})
            return
        if path == "/api/oranges":
            tree_values = urlparse(self.path).query
            tree_code = None
            if tree_values:
                params = dict(
                    item.split("=", 1) for item in tree_values.split("&") if "=" in item
                )
                raw_tree = params.get("tree", "")
                if raw_tree:
                    if not re.fullmatch(r"\d{6}", raw_tree):
                        self.send_error_json(400, "Tree code must contain six digits")
                        return
                    tree_code = int(raw_tree)
            self.send_json({"oranges": self.store.list(tree_code)})
            return
        if path.startswith("/api/"):
            self.send_error_json(404, "API route not found")
            return
        if path not in {"/", "/index.html", "/orange-tree-standalone.html"}:
            self.send_error(404, "File not found")
            return
        super().do_GET()

    def do_HEAD(self) -> None:
        path = urlparse(self.path).path
        if path not in {"/", "/index.html", "/orange-tree-standalone.html"}:
            self.send_error(404, "File not found")
            return
        super().do_HEAD()

    def do_POST(self) -> None:
        path = urlparse(self.path).path
        try:
            content_length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            self.send_error_json(400, "Invalid content length")
            return
        if content_length <= 0 or content_length > 8192:
            self.send_error_json(413, "Request body is empty or too large")
            return

        try:
            payload = json.loads(self.rfile.read(content_length).decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            self.send_error_json(400, "Invalid JSON")
            return

        if not isinstance(payload, dict):
            self.send_error_json(400, "JSON object required")
            return

        if path == "/api/oranges":
            text = normalized_text(payload.get("text"), 48)
            author = normalized_text(payload.get("author"), 16)
            tree_name = normalized_text(payload.get("treeName"), 20)
            try:
                seed = int(payload.get("seed", 0))
            except (TypeError, ValueError):
                seed = 0
            if not text:
                self.send_error_json(400, "Message is required")
                return
            try:
                orange = self.store.add_orange(text, author, seed, tree_name)
            except ValueError:
                self.send_error_json(409, "Tree code already exists")
                return
            self.send_json(orange, 201)
            return

        reply_match = ORANGE_PATH.match(path)
        if reply_match:
            text = normalized_text(payload.get("text"), 64)
            author = normalized_text(payload.get("author"), 16)
            if not text:
                self.send_error_json(400, "Reply text is required")
                return
            try:
                orange = self.store.add_reply(reply_match.group(1), text, author)
            except ValueError:
                self.send_error_json(409, "This orange already has 24 replies")
                return
            if orange is None:
                self.send_error_json(404, "Orange not found")
                return
            self.send_json(orange, 201)
            return

        self.send_error_json(404, "API route not found")

    def do_DELETE(self) -> None:
        path = urlparse(self.path).path
        item_match = ORANGE_ITEM_PATH.match(path)
        if not item_match:
            self.send_error_json(404, "API route not found")
            return
        try:
            content_length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(content_length).decode("utf-8"))
        except (ValueError, UnicodeDecodeError, json.JSONDecodeError):
            self.send_error_json(400, "Invalid JSON")
            return
        token = str(payload.get("ownerToken", "")) if isinstance(payload, dict) else ""
        result = self.store.remove_orange(item_match.group(1), token)
        if result == "not_found":
            self.send_error_json(404, "Orange not found")
            return
        if result == "forbidden":
            self.send_error_json(403, "Only the grower can harvest this orange")
            return
        self.send_json({"ok": True, "id": item_match.group(1)})


def main() -> None:
    parser = argparse.ArgumentParser(description="Run the shared Orange Tree app")
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--port", default=int(os.environ.get("PORT", "8080")), type=int)
    parser.add_argument("--data", default=os.environ.get("ORANGE_DATA_PATH", str(ROOT / "orange-data.json")))
    args = parser.parse_args()

    OrangeRequestHandler.store = Store(Path(args.data))
    server = ThreadingHTTPServer((args.host, args.port), OrangeRequestHandler)
    print(f"Orange Tree running at http://127.0.0.1:{args.port}")
    print("Use this computer's LAN IP on other devices for shared notes and replies.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping Orange Tree server.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
