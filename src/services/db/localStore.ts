import type { AlbumRow, CollectionRow } from '@/domain/types';

const STORAGE_KEY = 'stickera_db_v1';
const SCHEMA_VERSION = 1;

export type StoreData = {
  schemaVersion: number;
  settings: Record<string, string>;
  albums: AlbumRow[];
  enabled_albums: Record<string, boolean>;
  collection: CollectionRow[];
  pack_state: { last_opened_at: string | null; next_available_at: string | null };
  trade_log: Array<{
    id: string;
    payload_json: string;
    status: string;
    created_at: string;
  }>;
};

function defaultStore(): StoreData {
  return {
    schemaVersion: SCHEMA_VERSION,
    settings: {},
    albums: [],
    enabled_albums: {},
    collection: [],
    pack_state: { last_opened_at: null, next_available_at: null },
    trade_log: [],
  };
}

export function loadStore(): StoreData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStore();
    const data = JSON.parse(raw) as StoreData;
    if (!data.schemaVersion) return defaultStore();
    return data;
  } catch {
    return defaultStore();
  }
}

export function saveStore(data: StoreData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetStore(): void {
  localStorage.removeItem(STORAGE_KEY);
}
