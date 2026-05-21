# Deploy Stickera PWA (GitHub Pages)

The **mobile web app** is a static PWA built with Expo and hosted on GitHub Pages. Album manifests and stickers ship in the **same** deploy (`dist/`), so no laptop or same Wi‑Fi is required to test on a phone.

## Live URL

**https://raythan.github.io/stickera/**

Open in Chrome/Safari on your phone → browser menu → **Add to Home screen** / **Install app**.

## How it works

| Piece | Detail |
|-------|--------|
| Build | `npm run build:web` → `dist/` (Expo static export + `content/` copied in) |
| Base path | `experiments.baseUrl: "/stickera"` in `app.json` |
| Content sync | `EXPO_PUBLIC_CONTENT_BASE_URL` = same site (`https://raythan.github.io/stickera`) |
| PWA | `public/manifest.webmanifest`, `public/sw.js`, `app/+html.tsx` |
| CI | [`.github/workflows/deploy-github-pages.yml`](../.github/workflows/deploy-github-pages.yml) |

## One-time GitHub setup

1. Push `main` (workflow included).
2. **Settings → Pages → Build and deployment → Source:** **GitHub Actions**.
3. After the first successful run, open the deployment URL.

## Local preview (production build)

```bash
npm install
npm run build:web
npx expo serve dist
```

Open the URL shown (paths are under `/stickera/` when served with a static server that respects subpaths).

## Netlify (content-only CDN, optional)

If you later split app and CDN, use [netlify.toml](../netlify.toml) and [deploy-content.yml](../.github/workflows/deploy-content.yml). For the portfolio MVP, **GitHub Pages PWA is the default.**

## Verify

```bash
curl -sS https://raythan.github.io/stickera/catalog.json
curl -sS https://raythan.github.io/stickera/manifest.webmanifest
```

In the app: Settings → **Sync now** — content version should match `content/catalog.json`.
