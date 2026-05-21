export const MIGRATION_001 = `
CREATE TABLE IF NOT EXISTS schema_version (
  version INTEGER PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS enabled_albums (
  album_id TEXT PRIMARY KEY,
  enabled INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS albums (
  id TEXT PRIMARY KEY,
  revision INTEGER NOT NULL,
  total_stickers INTEGER NOT NULL,
  name_key TEXT NOT NULL,
  cover_uri TEXT,
  pack_weight REAL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS collection (
  sticker_id TEXT PRIMARY KEY,
  album_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  is_new INTEGER NOT NULL DEFAULT 0,
  first_obtained_at TEXT,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS pack_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  last_opened_at TEXT,
  next_available_at TEXT
);

CREATE TABLE IF NOT EXISTS trade_log (
  id TEXT PRIMARY KEY,
  payload_json TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);

INSERT OR IGNORE INTO pack_state (id) VALUES (1);
`;
