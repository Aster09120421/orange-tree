CREATE TABLE IF NOT EXISTS trees (
  code INTEGER PRIMARY KEY,
  tree_name TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS oranges (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT '',
  tree_name TEXT NOT NULL DEFAULT '',
  seed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  owner_token TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS replies (
  id TEXT PRIMARY KEY,
  orange_id TEXT NOT NULL,
  text TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  FOREIGN KEY (orange_id) REFERENCES oranges(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 1,
  expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_oranges_seed_created
  ON oranges(seed, created_at);

CREATE INDEX IF NOT EXISTS idx_replies_orange_created
  ON replies(orange_id, created_at);

CREATE INDEX IF NOT EXISTS idx_rate_limits_expires
  ON rate_limits(expires_at);
