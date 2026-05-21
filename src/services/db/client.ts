import * as SQLite from 'expo-sqlite';

import { LATEST_SCHEMA_VERSION, MIGRATIONS } from './migrations';

let database: SQLite.SQLiteDatabase | null = null;
let initPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (database) return database;
  if (!initPromise) {
    initPromise = openAndMigrate();
  }
  database = await initPromise;
  return database;
}

const SCHEMA_BOOTSTRAP = `
CREATE TABLE IF NOT EXISTS schema_version (
  version INTEGER PRIMARY KEY NOT NULL
);
INSERT OR IGNORE INTO schema_version (version) VALUES (0);
`;

async function getSchemaVersion(db: SQLite.SQLiteDatabase): Promise<number> {
  const row = await db.getFirstAsync<{ version: number }>(
    'SELECT version FROM schema_version LIMIT 1',
  );
  return row?.version ?? 0;
}

async function setSchemaVersion(db: SQLite.SQLiteDatabase, version: number): Promise<void> {
  await db.runAsync('UPDATE schema_version SET version = ?', version);
}

export async function openAndMigrate(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync('stickera.db');
  await db.execAsync(SCHEMA_BOOTSTRAP);

  let current = await getSchemaVersion(db);
  for (const migration of MIGRATIONS) {
    if (migration.version <= current) continue;
    await db.execAsync(migration.sql);
    await setSchemaVersion(db, migration.version);
    current = migration.version;
  }

  if (current !== LATEST_SCHEMA_VERSION) {
    throw new Error(
      `SQLite schema version ${current} != expected ${LATEST_SCHEMA_VERSION}`,
    );
  }

  return db;
}
