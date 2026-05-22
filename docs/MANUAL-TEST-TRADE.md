# Manual E2E — P2P trade

> Spec: [TRADING-P2P.md](TRADING-P2P.md). Registry: [workers/trade-registry/README.md](../workers/trade-registry/README.md).

## Prerequisites

- Two browsers or devices (or one normal + one private window).
- Both with Stickera PWA open and content synced (Settings).
- Each side has **duplicate** stickers (quantity ≥ 2) in at least one enabled album.
- Optional: `EXPO_PUBLIC_TRADE_REGISTRY_URL` set in production build for global one-accept.

## Happy path (v2 bundle)

| Step | Actor | Action | Expected |
|------|-------|--------|----------|
| 1 | A | Trade hub → **Create offer** → select 1+ duplicates → create | Payload + QR (if ≤ 8 stickers) |
| 2 | A | Copy payload or show QR | — |
| 3 | B | Trade hub → **Paste trade payload** (or **Scan QR** on web) | Partner preview visible |
| 4 | B | Select counter-offer duplicates → **Confirm trade** | Success + ack string |
| 5 | B | Copy ack to A (clipboard / message) | — |
| 6 | A | Trade hub → paste ack → **Confirm incoming trade** | Trade moves to **Completed trades** |
| 7 | Both | Album / collection | Quantities updated; no duplicate IDs lost |

## Hub UX checks

- **Your offers:** visual preview of offered stickers; **Copy payload again** while not expired.
- **Imported offers:** preview + **Continue** to accept screen.
- **Completed trades:** `TradeCompletedSummary` only — no copy payload/ack buttons.

## Scanner (web)

1. On accept screen, choose **Scan QR**.
2. Allow camera when prompted.
3. Scan A's QR → payload decodes and preview loads.
4. If camera denied: switch to **Paste** and paste manually.

## Registry scenarios

| Case | Setup | Expected |
|------|-------|----------|
| Registry online | Production build with `TRADE_REGISTRY_URL` secret | Badge “global protection: online”; second device cannot claim same `offerId` after B confirms |
| Registry offline / unset | Local dev or missing secret | Local anti-replay only; same payload could be tried on another phone until expiry |

## Negative cases

| Case | Steps | Expected |
|------|-------|----------|
| Expired offer | Wait past `expiresAt` or use old saved payload | “Expired” / decode error |
| Local replay | Complete trade on B, paste same payload again on B | `OFFER_ALREADY_USED` |
| Own offer | A pastes own sent payload on A | `OWN_OFFER` |
| No duplicates | B confirms without enough counter duplicates | Validation error |

## v1 legacy (optional)

If testing a v1 payload (single offered + wanted): initiator can **Confirm incoming** from hub by `offerId` without ack paste.
