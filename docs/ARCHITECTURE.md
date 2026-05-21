# Architecture

> **SDD:** implementação deve conformar-se a este doc e a [DATA-MODEL.md](DATA-MODEL.md). Processo: [SDD-DEVELOPMENT.md](SDD-DEVELOPMENT.md).

## Principles

1. **Offline-first** — SQLite + file cache are source of truth on device.
2. **Static content** — Albums ship as JSON + images; CDN is read-only.
3. **Thin UI, fat domain** — RNG, trade codec, validation live in `src/domain/` (pure TS).
4. **Feature slices** — `src/features/packs`, `collection`, `trade`, `sync`, etc.
5. **Atomic presentation** — UI only in `src/components/*` per ATOMIC-DESIGN.

## Recommended stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Runtime | Expo SDK 52+ | Installable, OTA for JS, strong RN ecosystem |
| Navigation | Expo Router | File-based routes, deep links for trade |
| Language | TypeScript `strict` | Safer manifests and trade payloads |
| State | Zustand | Simple global UI state (timer, modals) |
| Persistence | expo-sqlite | Collection, cooldown timestamps, settings |
| Assets cache | expo-file-system | Downloaded images keyed by content hash |
| i18n | i18next + react-i18next | Industry standard; JSON locale files |
| Share / QR | expo-camera, expo-sharing, `react-native-qrcode-svg` | P2P trade surfaces |
| Hosting | Netlify or GitHub Pages | Manifest + images only |

Alternatives (only if user requests): Flutter, Capacitor+Vue — not default.

## Layer diagram

```
┌─────────────────────────────────────────────────────────┐
│  app/ (screens) — compose templates, wire features      │
├─────────────────────────────────────────────────────────┤
│  components/templates, organisms, molecules, atoms      │
├─────────────────────────────────────────────────────────┤
│  features/* — hooks orchestrating services + domain     │
├─────────────────────────────────────────────────────────┤
│  services/* — sqlite, sync, filesystem, notifications   │
├─────────────────────────────────────────────────────────┤
│  domain/* — pure logic (pack draw, trade encode/decode) │
├─────────────────────────────────────────────────────────┤
│  content/ + remote CDN manifest                         │
└─────────────────────────────────────────────────────────┘
```

## Data flow: pack opening

1. `PackTimerService` reads last `openedAt` from SQLite; compares to `packCooldown`.
2. User taps Open → `openPack` in domain builds pool from **enabled** albums’ unstuckered or full pools per PRODUCT rules.
3. `drawStickers(pool, N)` — Fisher–Yates sample without replacement.
4. `CollectionRepository` upserts rows, increments quantity, sets `isNew`.
5. UI organism `PackReveal` plays animation; molecules/atoms only display state.

## Data flow: content sync

1. On app start or pull-to-refresh: `GET {CONTENT_BASE_URL}/catalog.json`.
2. Compare `catalog.version` to local `content_meta.version`.
3. For each album with newer `revision`, download `album.json` + listed assets to cache dir.
4. Register albums in SQLite `albums` table (metadata only; images on disk).

See [CONTENT-SYNC.md](CONTENT-SYNC.md).

## Security posture (MVP)

- Treat local DB as untrusted for **your** analytics only — not for monetization.
- Trade payloads signed with optional HMAC in config for tamper-*hint* (not cryptographic trust).
- No secrets in repo; `CONTENT_BASE_URL` is public.

## Deep linking

| Route | Purpose |
|-------|---------|
| `/` | Home / album grid |
| `/album/[id]` | Album detail |
| `/pack` | Open pack |
| `/trade` | Trade hub |
| `/trade/offer` | Create offer |
| `/trade/accept` | Scan / paste payload |
| `/settings` | Language, enabled albums, cooldown display |
| `/about` | Portfolio signature |

Trade accept: `stickera://trade/accept?payload=<base64url>` optional.

## Environment

```env
EXPO_PUBLIC_CONTENT_BASE_URL=https://your-site.netlify.app
EXPO_PUBLIC_DEFAULT_LOCALE=en
```

## Scaffold order

1. `npx create-expo-app@latest` with router template → move into repo root or `mobile/`
2. Folders per AGENTS.md
3. Theme tokens + 3 atoms (Button, Text, Image)
4. SQLite schema from DATA-MODEL
5. Bundled `content/` + sync service
6. Pack timer + open flow
7. Trade codec + screens
8. i18n + About signature

## Testing strategy (lightweight)

- **Domain**: unit tests for `drawStickers`, trade merge, cooldown math
- **Components**: Storybook optional later; snapshot only for stable atoms
- **E2E**: manual checklist in MVP-CHECKLIST

## Performance

- Thumbnail images WebP where possible; full bleed on detail screen
- Lazy-load album grids; prefetch next pack only when timer &lt; 1 min (optional)
