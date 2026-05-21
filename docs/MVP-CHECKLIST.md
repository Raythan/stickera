# MVP checklist

Use phases in order. Check items when done.

## Phase 0 — SDD governance & specs

Normative detail: [docs/PHASES/00-governance.md](PHASES/00-governance.md).

- [x] SDD docs: SDD-DEVELOPMENT, DEVELOPMENT-STANDARDS, SPEC-VALIDATION, SESSION-PROTOCOL
- [x] Product/architecture specs (PRODUCT … TRADING-P2P) + schemas JSON
- [x] PHASES 00–06 + CURSOR-GOVERNANCE + `.cursorrules`
- [x] 8 Cursor rules + 4 skills (`stickera-sdd-session`, …)
- [x] No MCP artifacts in repo (mcp.json, mcp-servers, MCP-* docs removed)

## Phase 1 — Scaffold & design system

Normative detail: [docs/PHASES/01-scaffold.md](PHASES/01-scaffold.md).

- [x] Expo app scaffold (TypeScript, Expo Router)
- [x] Folder structure per ARCHITECTURE.md
- [x] `EXPO_PUBLIC_CONTENT_BASE_URL` in `.env.example`
- [x] `src/theme/*` tokens
- [x] Atoms: `Button`, `Text`, `Image`, `Icon`, `Badge`
- [x] Templates: `ScreenTemplate`, `AboutTemplate`
- [x] i18n wired; EN + PT files with home/pack/settings keys

## Phase 2 — Content & persistence

Normative detail: [docs/PHASES/02-persistence.md](PHASES/02-persistence.md).

- [x] Zod validators for `catalog.json` / `album.json`
- [x] localStorage store + repositories
- [x] Content sync via fetch (HTTP)
- [x] Manual refresh UI
- [x] GitHub Pages PWA deploy ([DEPLOY-CONTENT.md](DEPLOY-CONTENT.md) + `deploy-github-pages.yml` → https://raythan.github.io/stickera/)

## Phase 3 — Collection & albums

Normative detail: [docs/PHASES/03-collection.md](PHASES/03-collection.md).

- [x] Album list / detail screens
- [x] Enable-disable albums for pack pool
- [x] `StickerCard`, `AlbumGrid` organisms
- [x] Collection quantities + "new" badge

## Phase 4 — Packs

Normative detail: [docs/PHASES/04-packs.md](PHASES/04-packs.md).

- [x] Configurable cooldown (`app-config.json`)
- [x] Timer UI + `PackTimerService`
- [x] `drawStickers` domain tests
- [x] Pack open + `PackReveal` organism
- [x] Persist `pack_state`

## Phase 5 — Trading

Normative detail: [docs/PHASES/05-trading.md](PHASES/05-trading.md).

- [x] `TradePayload` codec + validation tests
- [x] Create offer + QR display
- [x] Accept flow + `applyTrade`
- [x] Trade log in localStorage
- [x] Copy/trust disclaimer (i18n)

## Phase 6 — Portfolio & ship

Normative detail: [docs/PHASES/06-release.md](PHASES/06-release.md).

- [x] About / signature screen (links, tagline, avatar)
- [x] App icon + splash with branding
- [x] PWA installable on mobile browsers
- [x] README install instructions for contributors

## Definition of done

All Phase 0–6 items checked; [PRODUCT.md](PRODUCT.md) acceptance criteria met.
