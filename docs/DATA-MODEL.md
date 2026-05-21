# Data model

> **SDD:** contrato para `src/domain/types.ts`, SQLite migrations e `docs/schemas/`. Processo: [SDD-DEVELOPMENT.md](SDD-DEVELOPMENT.md). Validação domain: [SPEC-VALIDATION.md](SPEC-VALIDATION.md) §5.

All persistent data lives on-device (SQLite + filesystem). Types below are the contract for `src/domain/types.ts` and migrations.

## IDs

- `albumId`: slug `space-explorers`
- `stickerId`: `{albumId}:{number}` e.g. `space-explorers:07`
- `tradeOfferId`: UUID v4 generated client-side

## Static content (read-only after download)

### `catalog.json` (remote root)

```json
{
  "version": "2026.05.21",
  "baseUrl": "https://cdn.example.com/stickera",
  "albums": [
    { "id": "space-explorers", "revision": 3, "manifestPath": "/albums/space-explorers/album.json" }
  ],
  "appConfig": { "packCooldown": { "value": 4, "unit": "hours" }, "stickersPerPack": 5 }
}
```

### `album.json`

```json
{
  "id": "space-explorers",
  "revision": 3,
  "totalStickers": 50,
  "nameKey": "albums.spaceExplorers.name",
  "coverImage": "cover.webp",
  "stickers": [
    {
      "id": "space-explorers:01",
      "number": 1,
      "rarity": "common",
      "nameKey": "albums.spaceExplorers.stickers.01.name",
      "image": "stickers/01.webp"
    }
  ],
  "packWeight": 1
}
```

`nameKey` points to i18n; fallback `name` optional for editor preview only.

## SQLite schema (MVP)

```sql
-- User settings
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Enabled albums for pack pool
CREATE TABLE enabled_albums (
  album_id TEXT PRIMARY KEY,
  enabled INTEGER NOT NULL DEFAULT 1
);

-- Cached album metadata (from manifest)
CREATE TABLE albums (
  id TEXT PRIMARY KEY,
  revision INTEGER NOT NULL,
  total_stickers INTEGER NOT NULL,
  name_key TEXT NOT NULL,
  cover_uri TEXT,
  pack_weight REAL DEFAULT 1
);

-- User collection
CREATE TABLE collection (
  sticker_id TEXT PRIMARY KEY,
  album_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  is_new INTEGER NOT NULL DEFAULT 0,
  first_obtained_at TEXT,
  updated_at TEXT NOT NULL
);

-- Pack cooldown
CREATE TABLE pack_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  last_opened_at TEXT,
  next_available_at TEXT
);

-- Pending / history trades (local log)
CREATE TABLE trade_log (
  id TEXT PRIMARY KEY,
  payload_json TEXT NOT NULL,
  status TEXT NOT NULL, -- draft | sent | completed | cancelled
  created_at TEXT NOT NULL
);
```

## Domain: pack draw

```typescript
type PackCooldown = { value: number; unit: 'seconds' | 'minutes' | 'hours' };

function nextAvailableAt(lastOpened: Date, cooldown: PackCooldown): Date;

function buildPool(
  enabledAlbums: Album[],
  collection: Map<StickerId, number>,
  options?: { excludeCompleted?: boolean }
): StickerDef[];

function drawStickers(pool: StickerDef[], count: number): StickerDef[];
// Fisher–Yates; throws if count > pool.length
```

**Within-pack rule:** no duplicate sticker IDs in one draw.

**Across collection:** duplicates allowed; increment `quantity`.

## Domain: collection helpers

```typescript
function applyPackResults(
  current: CollectionRow[],
  drawn: StickerDef[]
): CollectionRow[];

function tradableStickers(collection: CollectionRow[]): StickerId[];
// quantity >= 2
```

## Zustand (ephemeral UI)

```typescript
type UiStore = {
  packRevealQueue: StickerDef[] | null;
  clearPackReveal: () => void;
  activeTradeDraft: TradePayload | null;
};
```

## Settings keys

| Key | Example |
|-----|---------|
| `locale` | `en` |
| `contentVersion` | `2026.05.21` |
| `onboardingDone` | `true` |

## Migration policy

- Version table `schema_version`
- Forward-only SQL in `src/services/db/migrations/`
