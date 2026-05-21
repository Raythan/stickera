# Data model

> **SDD:** contrato para `src/domain/types.ts`, repositórios localStorage e `docs/schemas/`. Processo: [SDD-DEVELOPMENT.md](SDD-DEVELOPMENT.md). Validação domain: [SPEC-VALIDATION.md](SPEC-VALIDATION.md) §5.

All persistent data lives in the browser's localStorage (key: `stickera_db_v1`). Types below are the contract for `src/domain/types.ts` and the localStore schema.

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
  "frameStylePath": "frame.css",
  "totalStickers": 50,
  "nameKey": "albums.spaceExplorers.name",
  "coverImage": "cover.webp",
  "stickers": [
    {
      "id": "space-explorers:01",
      "number": 1,
      "rarity": "common",
      "nameKey": "albums.spaceExplorers.stickers.01.name",
      "image": "stickers/01.png"
    }
  ],
  "packWeight": 1
}
```

- `frameStylePath`: CSS do molde (`.sticker-frame` + `.sticker-art`) — ver [STICKER-FRAMES.md](STICKER-FRAMES.md).
- `image`: opcional até a arte existir no repo; formatos `png|jpg|jpeg|gif`.
- `nameKey` points to i18n; fallback `name` optional for editor preview only.

## localStorage schema (MVP)

The store is a single JSON object under the key `stickera_db_v1`:

```typescript
type StoreData = {
  schemaVersion: number;                     // current: 1
  settings: Record<string, string>;          // key-value pairs
  albums: AlbumRow[];                        // cached album metadata
  enabled_albums: Record<string, boolean>;   // album_id → enabled
  collection: CollectionRow[];               // user sticker collection
  pack_state: {
    last_opened_at: string | null;
    next_available_at: string | null;
  };
  trade_log: Array<{
    id: string;
    payload_json: string;
    status: string;                          // draft | sent | completed | cancelled
    created_at: string;
  }>;
};
```

Logical tables (equivalent to previous SQL schema):

| Table | Fields |
|-------|--------|
| settings | key (PK), value |
| enabled_albums | album_id (PK), enabled |
| albums | id (PK), revision, total_stickers, name_key, cover_uri, pack_weight |
| collection | sticker_id (PK), album_id, quantity, is_new, first_obtained_at, updated_at |
| pack_state | last_opened_at, next_available_at |
| trade_log | id (PK), payload_json, status, created_at |

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
| `adminEnabled` | `1` (dev admin mode; see [DEV-ADMIN.md](DEV-ADMIN.md)) |

## Migration policy

- `schemaVersion` field in the stored JSON
- Forward-only migrations in `src/services/db/migrations/` (pure JS transforms)
- Access only via `src/services/db/` repositories
