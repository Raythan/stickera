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

- [ ] Expo app scaffold (TypeScript, Expo Router)
- [ ] Folder structure per ARCHITECTURE.md
- [ ] `EXPO_PUBLIC_CONTENT_BASE_URL` in `.env.example`
- [ ] `src/theme/*` tokens
- [ ] Atoms: `Button`, `Text`, `Image`, `Icon`, `Badge`
- [ ] Templates: `ScreenTemplate`, `AboutTemplate`
- [ ] i18n wired; EN + PT files with home/pack/settings keys

## Phase 2 — Content & persistence

Normative detail: [docs/PHASES/02-persistence.md](PHASES/02-persistence.md).

- [ ] Zod validators for `catalog.json` / `album.json`
- [ ] SQLite migrations + repositories
- [ ] Bundled album in `content/`
- [ ] Sync service + manual refresh UI
- [ ] Netlify/GitHub deploy of `content/`

## Phase 3 — Collection & albums

Normative detail: [docs/PHASES/03-collection.md](PHASES/03-collection.md).

- [ ] Album list / detail screens
- [ ] Enable-disable albums for pack pool
- [ ] `StickerCard`, `AlbumGrid` organisms
- [ ] Collection quantities + “new” badge

## Phase 4 — Packs

Normative detail: [docs/PHASES/04-packs.md](PHASES/04-packs.md).

- [ ] Configurable cooldown (`app-config.json`)
- [ ] Timer UI + `PackTimerService`
- [ ] `drawStickers` domain tests
- [ ] Pack open + `PackReveal` organism
- [ ] Persist `pack_state`

## Phase 5 — Trading

Normative detail: [docs/PHASES/05-trading.md](PHASES/05-trading.md).

- [ ] `TradePayload` codec + validation tests
- [ ] Create offer + QR display
- [ ] Accept flow + `applyTrade`
- [ ] Trade log in SQLite
- [ ] Copy/trust disclaimer (i18n)

## Phase 6 — Portfolio & ship

Normative detail: [docs/PHASES/06-release.md](PHASES/06-release.md).

- [ ] About / signature screen (links, tagline, avatar)
- [ ] App icon + splash with branding
- [ ] Android dev build / iOS simulator verified
- [ ] README install instructions for contributors
- [ ] Store-ready optional: EAS build profiles

## Definition of done

All Phase 0–6 items checked; [PRODUCT.md](PRODUCT.md) acceptance criteria met.
