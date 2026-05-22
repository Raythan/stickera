# Stickera trade registry (Cloudflare Worker)

Optional global one-time `offerId` registry. Free tier (Worker + Durable Object).

## Deploy (one-time)

1. Create a [Cloudflare](https://dash.cloudflare.com) account.
2. **Workers subdomain (required once):** Dashboard → **Workers & Pages** → open the landing page (creates `*.workers.dev` automatically).
3. `cd workers/trade-registry && npm install`
4. `npx wrangler login` — only logs in; **no URL yet**. Complete OAuth in the browser (if it times out, run again).
5. `npm run deploy` — prints the URL, e.g. `https://stickera-trade-registry.<subdomain>.workers.dev`
6. GitHub repo → Settings → Secrets:
   - `TRADE_REGISTRY_URL` = Worker URL (no trailing slash) — baked into PWA build
   - `CLOUDFLARE_API_TOKEN` = API token with Workers deploy (optional CI below)
7. Re-run PWA deploy workflow so `EXPO_PUBLIC_TRADE_REGISTRY_URL` is baked into the build.

### CI deploy (optional)

Workflow [`.github/workflows/deploy-trade-registry.yml`](../.github/workflows/deploy-trade-registry.yml) runs on `workflow_dispatch` or push to `main` when `workers/trade-registry/**` changes. Requires secret `CLOUDFLARE_API_TOKEN`. Skipped if the secret is empty (PWA deploy unaffected).

Create token: Cloudflare Dashboard → My Profile → API Tokens → **Edit Cloudflare Workers** template (account + zone as needed).

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
