# PWA audit checklist (manual)

> Portfolio / Phase 6. Run after deploy to [GitHub Pages](https://raythan.github.io/stickera/).

## Installability

- [ ] Chrome mobile: menu → **Install app** / **Add to Home Screen**
- [ ] Installed icon opens standalone (no browser chrome)
- [ ] `manifest.webmanifest` has `name`, `short_name`, `icons` 192 + 512

## Offline

- [ ] Airplane mode after first load: home, album grid, pack state readable
- [ ] Service worker registered (`Application` → Service Workers in DevTools)

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
