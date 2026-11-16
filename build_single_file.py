#!/usr/bin/env python3
"""Bundle the modular source files into a portable, self-contained HTML app."""

from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parent
SOURCE_DIR = ROOT / "src"
TEMPLATE_FILE = SOURCE_DIR / "index.template.tpl"
INDEX_FILE = ROOT / "index.html"


def replace_once(html: str, pattern: str, replacement: str, label: str) -> str:
    result, count = re.subn(pattern, lambda _match: replacement, html, count=1, flags=re.DOTALL)
    if count != 1:
        raise RuntimeError(f"Could not inline {label}; expected exactly one match, found {count}")
    return result


def main() -> None:
    SOURCE_DIR.mkdir(exist_ok=True)

    # Keep the first modular version as the editable template before replacing index.html.
    if TEMPLATE_FILE.exists():
        html = TEMPLATE_FILE.read_text(encoding="utf-8")
    else:
        html = INDEX_FILE.read_text(encoding="utf-8")
        TEMPLATE_FILE.write_text(html, encoding="utf-8")

    css = (ROOT / "styles.css").read_text(encoding="utf-8")
    i18n_js = (ROOT / "i18n.js").read_text(encoding="utf-8")
    poetry_db = (ROOT / "poetry-db.js").read_text(encoding="utf-8")
    app_js = (ROOT / "app.js").read_text(encoding="utf-8")

    html = replace_once(
        html,
        r'\s*<link\s+rel="stylesheet"\s+href="\./styles\.css(?:\?[^"]*)?"\s*/?>',
        f'\n    <!-- Bundle: styles.css -->\n    <style>\n{css}\n    </style>',
        "styles.css",
    )
    html = replace_once(
        html,
        r'\s*<script\s+src="\./i18n\.js(?:\?[^"]*)?"\s*></script>',
        f'\n    <!-- Bundle: i18n.js -->\n    <script>\n{i18n_js}\n    </script>',
        "i18n.js",
    )
    html = replace_once(
        html,
        r'\s*<script\s+src="\./poetry-db\.js(?:\?[^"]*)?"\s*></script>',
        f'\n    <!-- Bundle: poetry-db.js -->\n    <script>\n{poetry_db}\n    </script>',
        "poetry-db.js",
    )
    html = replace_once(
        html,
        r'\s*<script\s+src="\./app\.js(?:\?[^"]*)?"\s*></script>',
        f'\n    <!-- Bundle: app.js -->\n    <script>\n{app_js}\n    </script>',
        "app.js",
    )

    external_assets = re.findall(r'(?:src|href)="\./[^"]+"', html)
    if external_assets:
        raise RuntimeError(f"Standalone build still references local assets: {external_assets}")

    INDEX_FILE.write_text(html, encoding="utf-8")
    (ROOT / "orange-tree-standalone.html").write_text(html, encoding="utf-8")
    print(f"Built standalone app: {INDEX_FILE} ({len(html):,} characters)")


if __name__ == "__main__":
    main()
