import { MIGRATION_001 } from './001_initial';

export type Migration = {
  version: number;
  sql: string;
};

/** Ordered migrations; each version runs once. */
export const MIGRATIONS: Migration[] = [{ version: 1, sql: MIGRATION_001 }];

export const LATEST_SCHEMA_VERSION = MIGRATIONS[MIGRATIONS.length - 1]?.version ?? 0;
