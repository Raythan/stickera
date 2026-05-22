import type { AlbumRow, CollectionRow, PackBankState } from '@/domain/types';

const STORAGE_KEY = 'stickera_db_v1';
const SCHEMA_VERSION = 2;

export type StoreData = {
  schemaVersion: number;
  settings: Record<string, string>;
  albums: AlbumRow[];
  enabled_albums: Record<string, boolean>;
  collection: CollectionRow[];
  pack_state: PackBankState;
  trade_partners: string[];
  trade_log: Array<{
    id: string;
    payload_json: string;
    encoded_payload?: string;
    ack_encoded?: string;
    counter_ids_json?: string;
    role?: string;
    status: string;
    created_at: string;
  }>;
};

type LegacyPackState = {
  last_opened_at: string | null;
  next_available_at: string | null;
};

function isLegacyPackState(ps: unknown): ps is LegacyPackState {
  return (
    typeof ps === 'object' &&
    ps !== null &&
    'next_available_at' in ps &&
    !('pending_packs' in ps)
  );
}

function migratePackState(legacy: LegacyPackState, now: Date): PackBankState {
  const ready =
    !legacy.next_available_at || now >= new Date(legacy.next_available_at);
  return {
    pending_packs: ready ? 1 : 0,
    last_accrued_at: now.toISOString(),
    last_opened_at: legacy.last_opened_at,
  };
}

function defaultStore(): StoreData {
  const now = new Date();
  return {
    schemaVersion: SCHEMA_VERSION,
    settings: {},
    albums: [],
    enabled_albums: {},
    collection: [],
    pack_state: {
      pending_packs: 5,
      last_accrued_at: now.toISOString(),
      last_opened_at: null,
    },
    trade_partners: [],
    trade_log: [],
  };
}

function migrateStore(data: StoreData): StoreData {
  const now = new Date();
  if (isLegacyPackState(data.pack_state)) {
    data.pack_state = migratePackState(data.pack_state, now);
  }
  if (!Array.isArray(data.trade_partners)) {
    data.trade_partners = [];
  }
  if (typeof data.pack_state.pending_packs !== 'number') {
    data.pack_state = defaultStore().pack_state;
  }
  data.schemaVersion = SCHEMA_VERSION;
  return data;
}

export function loadStore(): StoreData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStore();
    const data = JSON.parse(raw) as StoreData;
    if (!data.schemaVersion) return defaultStore();
    const needsMigrate =
      data.schemaVersion < SCHEMA_VERSION ||
      isLegacyPackState(data.pack_state) ||
      !Array.isArray(data.trade_partners);
    const migrated = migrateStore(data);
    if (needsMigrate) saveStore(migrated);
    return migrated;
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
