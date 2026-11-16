const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
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

async function readBody(request) {
  try {
    const payload = await request.json();
    return payload && typeof payload === "object" ? payload : null;
  } catch {
    return null;
  }
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
  const payload = await readBody(request);
  if (!payload) return error("Invalid JSON", 400);

  const text = clean(payload.text, 48);
  const author = clean(payload.author, 16);
  const requestedTreeName = clean(payload.treeName, 20);
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
        await env.DB.prepare(
          "INSERT INTO trees (code, tree_name, created_at) VALUES (?, ?, ?)",
        )
          .bind(seed, treeName, createdAt)
          .run();
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
  const payload = await readBody(request);
  if (!payload) return error("Invalid JSON", 400);
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
  const payload = await readBody(request);
  if (!payload) return error("Invalid JSON", 400);
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

export async function onRequest({ request, env }) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (!env.DB) return error("D1 binding DB is not configured", 500);

  const path = new URL(request.url).pathname.replace(/\/+$/, "");
  try {
    if (request.method === "GET" && path === "/api/health") {
      return json({ ok: true });
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
    return error("API route not found", 404);
  } catch (err) {
    return error(`Worker error: ${String(err)}`, 500);
  }
}
