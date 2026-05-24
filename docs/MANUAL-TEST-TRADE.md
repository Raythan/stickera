# Manual E2E — P2P trade

> Spec: [TRADING-P2P.md](TRADING-P2P.md). Registry: [workers/trade-registry/README.md](../workers/trade-registry/README.md).

## Prerequisites

- Two browsers or devices (or one normal + one private window).
- Both with Stickera PWA open and content synced (Settings).
- Initiator (A) has **duplicate** stickers (quantity ≥ 2) to offer.
- **`EXPO_PUBLIC_TRADE_REGISTRY_URL`** set (production secret or local `http://localhost:8787` with `wrangler dev`).

## Happy path (v2 gift)

| Step | Actor | Action | Expected |
|------|-------|--------|----------|
| 1 | A | Trade hub → **Create offer** (top) → select duplicates → generate | Payload + QR (if ≤ 8 stickers); registry register OK |
| 2 | A | Copy payload or show QR | Sent offer in hub |
| 3 | B | Trade hub → **Accept offer** (top) → **Scan QR** or paste | Partner preview (what B receives) |
| 4a | B | **Scan QR** | Auto-accept; success message |
| 4b | B | **Paste** → **Accept** | Success (or **Cancel** clears preview only) |
| 5 | A | Wait on hub / reopen trade tab | Sent offer completes; stickers debited |
| 6 | Both | Album / collection | A lost offered qty; B gained stickers |

## Hub UX checks

- **Create offer** and **Accept offer** buttons at **top** of trade tab.
- **Your offers:** only **pending** sent offers (not expired, not completed); preview + **Copy payload again**.
- After partner accepts or offer expires: row leaves **Your offers**; completed trades appear under **Completed trades** (expand history).
- Bundle labels: **Enviado** / **Recebido** (not "You give/receive").
- Create offer: tap anywhere on sticker cell (including art) toggles selection.
- No **Finish my offer** / ack paste section.
- **Completed trades:** `TradeCompletedSummary` in collapsed history.

## Scanner (web)

1. Accept panel → **Scan QR**.
2. Allow camera.
3. Scan A's QR → trade completes without Confirm button.
4. Camera denied → use **Paste** + Accept.

## Registry scenarios

| Case | Setup | Expected |
|------|-------|----------|
| Registry online | URL in build + worker running | Create/accept work; second claim on same `offerId` fails |
| Registry missing / down | No URL or worker stopped | Hub blocks trade with registry error |

## Negative cases

| Case | Steps | Expected |
|------|-------|----------|
| Expired offer | Old payload past `expiresAt` | Expired error |
| Local replay | B accepts twice same payload on B | `OFFER_ALREADY_USED` |
| Own offer | A accepts own payload on A | `OWN_OFFER` |
| v1 payload | Paste legacy v1 code | Legacy offer error — ask for new code |
| Initiator spent duplicates | A trades away stickers before poll | Initiator sync error on debit |
