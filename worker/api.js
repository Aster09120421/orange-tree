const CORS_HEADERS = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow",
};

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function error(message, status) {
  return json({ error: message }, status);
}

function clean(value, limit) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, limit);
}

function isPrivateTreeSeed(value) {
  const seed = Number(value);
  return Number.isInteger(seed) && seed >= 100000 && seed <= 999999;
}

function recoveryHex(value) {
  const compact = String(value || "")
    .toUpperCase()
    .replace(/[^A-F0-9]/g, "");
  return compact.length === 32 ? compact : "";
}

function formatRecoveryCode(hex) {
  return `OT-${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

async function recoveryHash(value) {
  const hex = recoveryHex(value);
  if (!hex) return "";
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`orange-tree-anonymous-account-v1|${hex}`),
  );
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function findAccount(request, env, recoveryCode) {
  const hash = await recoveryHash(recoveryCode);
  if (!hash) return null;
  return env.DB.prepare(
    "SELECT id, created_at FROM anonymous_accounts WHERE recovery_hash = ?",
  )
    .bind(hash)
    .first();
}

async function ownedTreeForAccount(env, accountId) {
  return env.DB.prepare(
    "SELECT t.code, t.tree_name, t.created_at FROM tree_owner_accounts o " +
      "JOIN trees t ON t.code = o.tree_code WHERE o.account_id = ? LIMIT 1",
  )
    .bind(accountId)
    .first();
}

async function readBody(request) {
  const contentLength = Number(request.headers.get("Content-Length") || 0);
  if (contentLength > 8192) {
    return { error: "Request body is too large", status: 413 };
  }
  const contentType = request.headers.get("Content-Type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return { error: "Content-Type must be application/json", status: 415 };
  }
  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > 8192) {
    return { error: "Request body is too large", status: 413 };
  }
  try {
    const payload = JSON.parse(raw);
    return payload && typeof payload === "object"
      ? { payload }
      : { error: "JSON object required", status: 400 };
  } catch {
    return { error: "Invalid JSON", status: 400 };
  }
}

function sameOrigin(request) {
  const origin = request.headers.get("Origin");
  return !origin || origin === new URL(request.url).origin;
}

async function clientKey(request, scope, windowSeconds) {
  const forwarded = request.headers.get("X-Forwarded-For") || "";
  const address =
    request.headers.get("CF-Connecting-IP") ||
    forwarded.split(",")[0].trim() ||
    "unknown";
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${address}|orange-tree|${scope}`),
  );
  const hash = [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 24);
  const bucket = Math.floor(Date.now() / (windowSeconds * 1000));
  return `${scope}:${hash}:${bucket}`;
}

async function rateLimit(request, env, scope, limit, windowSeconds = 60) {
  const key = await clientKey(request, scope, windowSeconds);
  const expiresAt = Math.floor(Date.now() / 1000) + windowSeconds * 3;
  await env.DB.prepare(
    "INSERT INTO rate_limits (key, count, expires_at) VALUES (?, 1, ?) " +
      "ON CONFLICT(key) DO UPDATE SET count = rate_limits.count + 1",
  )
    .bind(key, expiresAt)
    .run();
  const row = await env.DB.prepare("SELECT count FROM rate_limits WHERE key = ?")
    .bind(key)
    .first();
  if (Math.random() < 0.02) {
    await env.DB.prepare("DELETE FROM rate_limits WHERE expires_at < ?")
      .bind(Math.floor(Date.now() / 1000))
      .run();
  }
  return (row?.count || 1) <= limit;
}

function mapOrange(row, replies = []) {
  return {
    id: row.id,
    text: row.text,
    author: row.author || "",
    treeName: row.tree_name || "",
    seed: Number(row.seed) || 0,
    createdAt: row.created_at,
    replies: replies.map((reply) => ({
      id: reply.id,
      text: reply.text,
      author: reply.author || "",
      createdAt: reply.created_at,
    })),
  };
}

async function withReplies(db, rows) {
  const oranges = [];
  for (const row of rows) {
    const replies = await db
      .prepare(
        "SELECT id, text, author, created_at FROM replies WHERE orange_id = ? ORDER BY created_at ASC LIMIT 24",
      )
      .bind(row.id)
      .all();
    oranges.push(mapOrange(row, replies.results || []));
  }
  return oranges;
}

async function listOranges(request, env) {
  const url = new URL(request.url);
  const rawTree = url.searchParams.get("tree");
  let statement;
  if (rawTree) {
    if (!/^\d{6}$/.test(rawTree)) return error("Tree code must contain six digits", 400);
    if (!(await rateLimit(request, env, "tree-read", 18, 60))) {
      return error("Too many requests. Please try again later.", 429);
    }
    statement = env.DB.prepare(
      "SELECT * FROM oranges WHERE seed = ? ORDER BY created_at ASC LIMIT 200",
    ).bind(Number(rawTree));
  } else {
    statement = env.DB.prepare(
      "SELECT * FROM oranges WHERE seed < 100000 OR seed > 999999 ORDER BY created_at ASC LIMIT 200",
    );
  }
  const result = await statement.all();
  return json({ oranges: await withReplies(env.DB, result.results || []) });
}

async function createOrange(request, env) {
  if (!(await rateLimit(request, env, "orange-create", 8, 60))) {
    return error("Too many requests. Please try again later.", 429);
  }
  const body = await readBody(request);
  if (body.error) return error(body.error, body.status);
  const payload = body.payload;

  const text = clean(payload.text, 48);
  const author = clean(payload.author, 16);
  const requestedTreeName = clean(payload.treeName, 20);
  const accountRecoveryCode = String(payload.accountRecoveryCode || "");
  const seed = Number(payload.seed) || 0;
  if (!text) return error("Message is required", 400);
  if (seed && !Number.isInteger(seed)) return error("Invalid seed", 400);

  const privateTree = isPrivateTreeSeed(seed);
  const id = crypto.randomUUID();
  const ownerToken = `${crypto.randomUUID()}${crypto.randomUUID()}`;
  const createdAt = new Date().toISOString();
  let treeName = requestedTreeName;

  try {
    if (privateTree) {
      const existingTree = await env.DB.prepare(
        "SELECT tree_name FROM trees WHERE code = ?",
      )
        .bind(seed)
        .first();
      if (!existingTree) {
        if (!treeName) return error("Tree name is required", 400);
        const account = await findAccount(request, env, accountRecoveryCode);
        if (!account) return error("A valid anonymous account is required", 401);
        const ownedTree = await ownedTreeForAccount(env, account.id);
        if (ownedTree) return error("This anonymous account already owns a tree", 409);
        await env.DB.batch([
          env.DB.prepare(
            "INSERT INTO trees (code, tree_name, created_at) VALUES (?, ?, ?)",
          ).bind(seed, treeName, createdAt),
          env.DB.prepare(
            "INSERT INTO tree_owner_accounts (tree_code, account_id, created_at) VALUES (?, ?, ?)",
          ).bind(seed, account.id, createdAt),
        ]);
      } else {
        treeName = existingTree.tree_name || treeName;
      }
    }

    await env.DB.prepare(
      "INSERT INTO oranges (id, text, author, tree_name, seed, created_at, owner_token) VALUES (?, ?, ?, ?, ?, ?, ?)",
    )
      .bind(id, text, author, treeName, seed, createdAt, ownerToken)
      .run();
  } catch (err) {
    if (String(err).includes("UNIQUE") || String(err).includes("constraint")) {
      return error("Tree code already exists", 409);
    }
    throw err;
  }

  return json(
    {
      id,
      text,
      author,
      treeName,
      seed,
      createdAt,
      replies: [],
      ownerToken,
    },
    201,
  );
}

async function addReply(request, env, orangeId) {
  if (!(await rateLimit(request, env, "reply-create", 16, 60))) {
    return error("Too many requests. Please try again later.", 429);
  }
  const body = await readBody(request);
  if (body.error) return error(body.error, body.status);
  const payload = body.payload;
  const text = clean(payload.text, 64);
  const author = clean(payload.author, 16);
  if (!text) return error("Reply text is required", 400);

  const orange = await env.DB.prepare("SELECT * FROM oranges WHERE id = ?")
    .bind(orangeId)
    .first();
  if (!orange) return error("Orange not found", 404);
  const count = await env.DB.prepare("SELECT COUNT(*) AS count FROM replies WHERE orange_id = ?")
    .bind(orangeId)
    .first();
  if ((count?.count || 0) >= 24) return error("Reply limit reached", 409);

  await env.DB.prepare(
    "INSERT INTO replies (id, orange_id, text, author, created_at) VALUES (?, ?, ?, ?, ?)",
  )
    .bind(crypto.randomUUID(), orangeId, text, author, new Date().toISOString())
    .run();

  const result = await env.DB.prepare("SELECT * FROM oranges WHERE id = ?")
    .bind(orangeId)
    .all();
  const oranges = await withReplies(env.DB, result.results || []);
  return json(oranges[0], 201);
}

async function deleteOrange(request, env, orangeId) {
  if (!(await rateLimit(request, env, "orange-delete", 10, 60))) {
    return error("Too many requests. Please try again later.", 429);
  }
  const body = await readBody(request);
  if (body.error) return error(body.error, body.status);
  const payload = body.payload;
  const ownerToken = String(payload.ownerToken || "");
  const orange = await env.DB.prepare("SELECT owner_token FROM oranges WHERE id = ?")
    .bind(orangeId)
    .first();
  if (!orange) return error("Orange not found", 404);
  if (!ownerToken || ownerToken !== orange.owner_token) {
    return error("Only the grower can harvest this orange", 403);
  }
  await env.DB.prepare("DELETE FROM oranges WHERE id = ?").bind(orangeId).run();
  return json({ ok: true, id: orangeId });
}

async function deletePrivateTree(request, env, treeCode) {
  if (!/^\d{6}$/.test(treeCode)) {
    return error("Tree code must contain six digits", 400);
  }
  if (!(await rateLimit(request, env, "tree-delete", 3, 60))) {
    return error("Too many requests. Please try again later.", 429);
  }
  const body = await readBody(request);
  if (body.error) return error(body.error, body.status);
  const ownerToken = String(body.payload.ownerToken || "");
  const accountRecoveryCode = String(body.payload.accountRecoveryCode || "");

  const tree = await env.DB.prepare("SELECT code FROM trees WHERE code = ?")
    .bind(Number(treeCode))
    .first();
  if (!tree) return error("Tree not found", 404);

  let authorized = false;
  if (accountRecoveryCode) {
    const account = await findAccount(request, env, accountRecoveryCode);
    if (account) {
      const ownedTree = await env.DB.prepare(
        "SELECT tree_code FROM tree_owner_accounts WHERE account_id = ? AND tree_code = ?",
      )
        .bind(account.id, Number(treeCode))
        .first();
      authorized = Boolean(ownedTree);
    }
  }

  const firstOrange = await env.DB.prepare(
    "SELECT owner_token FROM oranges WHERE seed = ? ORDER BY created_at ASC, rowid ASC LIMIT 1",
  )
    .bind(Number(treeCode))
    .first();
  if (!firstOrange && !authorized) return error("Tree owner record not found", 404);
  if (!authorized && (!ownerToken || ownerToken !== firstOrange.owner_token)) {
    return error("Only the tree owner can destroy this tree", 403);
  }

  await env.DB.batch([
    env.DB.prepare(
      "DELETE FROM replies WHERE orange_id IN (SELECT id FROM oranges WHERE seed = ?)",
    ).bind(Number(treeCode)),
    env.DB.prepare("DELETE FROM oranges WHERE seed = ?").bind(Number(treeCode)),
    env.DB.prepare("DELETE FROM tree_owner_accounts WHERE tree_code = ?").bind(Number(treeCode)),
    env.DB.prepare("DELETE FROM trees WHERE code = ?").bind(Number(treeCode)),
  ]);

  return json({ ok: true, code: treeCode });
}

async function createAnonymousAccount(request, env) {
  if (!(await rateLimit(request, env, "account-create", 4, 60))) {
    return error("Too many requests. Please try again later.", 429);
  }
  const id = crypto.randomUUID();
  const recoveryCode = `OT-${crypto.randomUUID().toUpperCase()}`;
  const hash = await recoveryHash(recoveryCode);
  const createdAt = new Date().toISOString();
  await env.DB.prepare(
    "INSERT INTO anonymous_accounts (id, recovery_hash, created_at) VALUES (?, ?, ?)",
  )
    .bind(id, hash, createdAt)
    .run();
  return json({ accountId: id, recoveryCode, createdAt }, 201);
}

async function recoverAnonymousAccount(request, env) {
  if (!(await rateLimit(request, env, "account-recover", 5, 60))) {
    return error("Too many requests. Please try again later.", 429);
  }
  const body = await readBody(request);
  if (body.error) return error(body.error, body.status);
  const recoveryCode = String(body.payload.recoveryCode || "");
  if (!recoveryHex(recoveryCode)) return error("Recovery code is invalid", 400);
  const account = await findAccount(request, env, recoveryCode);
  if (!account) return error("Recovery code is invalid", 401);
  const tree = await ownedTreeForAccount(env, account.id);
  return json({
    accountId: account.id,
    recoveryCode: formatRecoveryCode(recoveryHex(recoveryCode)),
    tree: tree
      ? {
          code: String(tree.code),
          treeName: tree.tree_name || "",
          createdAt: tree.created_at,
        }
      : null,
  });
}

async function claimAnonymousTree(request, env) {
  if (!(await rateLimit(request, env, "account-claim", 5, 60))) {
    return error("Too many requests. Please try again later.", 429);
  }
  const body = await readBody(request);
  if (body.error) return error(body.error, body.status);
  const recoveryCode = String(body.payload.recoveryCode || "");
  const treeCode = String(body.payload.treeCode || "");
  const legacyOwnerToken = String(body.payload.legacyOwnerToken || "");
  if (!/^\d{6}$/.test(treeCode) || !legacyOwnerToken) {
    return error("Tree code and owner token are required", 400);
  }
  const account = await findAccount(request, env, recoveryCode);
  if (!account) return error("Recovery code is invalid", 401);
  const tree = await env.DB.prepare("SELECT code, tree_name FROM trees WHERE code = ?")
    .bind(Number(treeCode))
    .first();
  if (!tree) return error("Tree not found", 404);
  const firstOrange = await env.DB.prepare(
    "SELECT owner_token FROM oranges WHERE seed = ? ORDER BY created_at ASC, rowid ASC LIMIT 1",
  )
    .bind(Number(treeCode))
    .first();
  if (!firstOrange || firstOrange.owner_token !== legacyOwnerToken) {
    return error("Only the tree owner can claim this tree", 403);
  }
  const existingOwnership = await env.DB.prepare(
    "SELECT account_id FROM tree_owner_accounts WHERE tree_code = ?",
  )
    .bind(Number(treeCode))
    .first();
  if (existingOwnership && existingOwnership.account_id !== account.id) {
    return error("This tree is already linked to another account", 409);
  }
  const ownedTree = await ownedTreeForAccount(env, account.id);
  if (ownedTree && String(ownedTree.code) !== treeCode) {
    return error("This anonymous account already owns a tree", 409);
  }
  if (!existingOwnership) {
    await env.DB.prepare(
      "INSERT INTO tree_owner_accounts (tree_code, account_id, created_at) VALUES (?, ?, ?)",
    )
      .bind(Number(treeCode), account.id, new Date().toISOString())
      .run();
  }
  return json({
    ok: true,
    tree: { code: treeCode, treeName: tree.tree_name || "" },
  });
}

export async function handleApi({ request, env }) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (!env.DB) return error("D1 binding DB is not configured", 500);

  const path = new URL(request.url).pathname.replace(/\/+$/, "");
  try {
    if (request.method !== "GET" && !sameOrigin(request)) {
      return error("Cross-origin write blocked", 403);
    }
    if (request.method === "GET" && path === "/api/health") {
      return json({ ok: true });
    }
    if (path === "/api/accounts" && request.method === "POST") {
      return createAnonymousAccount(request, env);
    }
    if (path === "/api/accounts/recover" && request.method === "POST") {
      return recoverAnonymousAccount(request, env);
    }
    if (path === "/api/accounts/claim-tree" && request.method === "POST") {
      return claimAnonymousTree(request, env);
    }
    if (path === "/api/oranges") {
      if (request.method === "GET") return listOranges(request, env);
      if (request.method === "POST") return createOrange(request, env);
    }

    const replyMatch = path.match(/^\/api\/oranges\/([A-Za-z0-9-]+)\/replies$/);
    if (request.method === "POST" && replyMatch) {
      return addReply(request, env, replyMatch[1]);
    }

    const itemMatch = path.match(/^\/api\/oranges\/([A-Za-z0-9-]+)$/);
    if (request.method === "DELETE" && itemMatch) {
      return deleteOrange(request, env, itemMatch[1]);
    }

    const treeMatch = path.match(/^\/api\/trees\/(\d{6})$/);
    if (request.method === "DELETE" && treeMatch) {
      return deletePrivateTree(request, env, treeMatch[1]);
    }
    return error("API route not found", 404);
  } catch (err) {
    return error(`Worker error: ${String(err)}`, 500);
  }
}
