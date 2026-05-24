# PWA audit checklist (manual)

> Portfolio / Phase 6. Run after deploy to [GitHub Pages](https://raythan.github.io/stickera/).

## Build validation (CI / local)

After `npm run build:web`:

```bash
npm run validate:pwa
```

Checks `dist/manifest.webmanifest`, `dist/sw.js`, icons, `start_url`/`scope` `/stickera/`, `display: standalone`.

## Installability

- [ ] Chrome mobile: menu → **Install app** / **Add to Home Screen**
- [ ] Installed icon opens standalone (no browser chrome)
- [ ] `manifest.webmanifest` has `id`, `name`, `short_name`, `start_url`, `scope`, `display`
- [ ] Icons: PNG **192** and **512** with `purpose` **any** (and maskable)
- [ ] DevTools → Application → Manifest: no installability errors

## Offline

- [ ] Airplane mode after first load: home, album grid, pack state readable
- [ ] Service worker registered (`Application` → Service Workers in DevTools)

## Auto-update

- [ ] Bump `version` in `package.json` before deploy
- [ ] `npm run build:web` regenerates `sw.js` with new cache id (`stickera-<version>`)
- [ ] Returning users: tab refocus or hourly check fetches new SW → page reloads with new bundle

## Lighthouse (optional)

```bash
npx lighthouse https://raythan.github.io/stickera/ --view --only-categories=pwa,performance,accessibility
```

Targets (guidance, not CI gates):

| Category | Aim |
|----------|-----|
| PWA | Installable, HTTPS, responsive |
| Performance | Reasonable LCP on mid-tier phone |
| Accessibility | Contrast, tap targets on trade grids |

## Content & trade smoke

- [ ] Settings → sync albums
- [ ] Pack open after cooldown
- [ ] Trade offer → accept → confirm (see [MANUAL-TEST-TRADE.md](MANUAL-TEST-TRADE.md))

## About / portfolio

- [ ] About shows author, tagline, GitHub + LinkedIn from `catalog.json` signature
