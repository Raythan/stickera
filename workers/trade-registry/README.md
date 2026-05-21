# Stickera trade registry (Cloudflare Worker)

Optional global one-time `offerId` registry. Free tier (Worker + Durable Object).

## Deploy (one-time)

1. Create a [Cloudflare](https://dash.cloudflare.com) account.
2. **Workers subdomain (required once):** Dashboard → **Workers & Pages** → open the landing page (creates `*.workers.dev` automatically).
3. `cd workers/trade-registry && npm install`
4. `npx wrangler login` — only logs in; **no URL yet**. Complete OAuth in the browser (if it times out, run again).
5. `npm run deploy` — prints the URL, e.g. `https://stickera-trade-registry.<subdomain>.workers.dev`
5. Note the URL, e.g. `https://stickera-trade-registry.<account>.workers.dev`
6. GitHub repo → Settings → Secrets → `TRADE_REGISTRY_URL` = that URL (no trailing slash)
7. Re-run PWA deploy workflow so `EXPO_PUBLIC_TRADE_REGISTRY_URL` is baked into the build.

## Local dev

```bash
npm run dev
# Worker on http://localhost:8787
```

Set in `.env`:

```
EXPO_PUBLIC_TRADE_REGISTRY_URL=http://localhost:8787
```

## API

| Method | Path | Body |
|--------|------|------|
| GET | `/v1/health` | — |
| POST | `/v1/offers/register` | `{ offerId, expiresAt }` |
| POST | `/v1/offers/claim` | `{ offerId }` |
| GET | `/v1/offers/:offerId` | — |

CORS: `ALLOWED_ORIGINS` in `wrangler.toml` (default includes `https://raythan.github.io`).
