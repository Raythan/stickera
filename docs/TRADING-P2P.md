# P2P trading (no backend)

> **SDD:** spec de trade P2P. Schemas: [trade-payload.schema.json](schemas/trade-payload.schema.json), [trade-ack.schema.json](schemas/trade-ack.schema.json). Validação: [SPEC-VALIDATION.md](SPEC-VALIDATION.md) §4. Phase 5: [PHASES/05-trading.md](PHASES/05-trading.md).

Trading is **opt-in**, **local-trust**, and **duplicate-only**. No server mediates; payloads move via QR, copy/paste, or OS share.

## Goals

- User A offers one or more duplicate stickers from enabled albums (no `wanted` in the offer — in-person counter-offer on accept)
- User B imports payload, previews visually, selects duplicates to return
- Both confirm on device; localStorage updated independently via `TradeAck`

## Trade payload

JSON → base64url for QR / deep link. **New offers use v2.** v1 remains decodable for legacy offers.

### v2 (current)

```typescript
type TradePayloadV2 = {
  v: 2;
  offerId: string;
  fromDisplayName?: string;
  offeredIds: string[]; // 1..100, unique
  expiresAt: string; // ISO, +15 min default
};
```

### v1 (legacy 1:1)

```typescript
type TradePayloadV1 = {
  v: 1;
  offerId: string;
  fromDisplayName?: string;
  offered: { stickerId: string; quantity: 1 };
  wanted: { stickerId: string; quantity: 1 };
  expiresAt: string;
};
```

## Trade acknowledgment

```typescript
type TradeAckV2 = {
  v: 2;
  offerId: string;
  acceptedAt: string;
  acceptorIds: string[]; // 1..100, what acceptor gave
};

type TradeAckV1 = { v: 1; offerId: string; acceptedAt: string };
```

Initiator confirms by pasting **v2 ack** (includes `acceptorIds`) so their collection applies the bundle.

## Flow (v2, in-person)

```mermaid
sequenceDiagram
  participant A as Initiator
  participant B as Acceptor

  A->>A: Multi-select duplicates to offer
  A->>B: Copy payload or QR (small bundles only)
  B->>B: Visual preview of A's offer
  B->>B: Multi-select duplicates to return
  B->>B: Confirm — apply on B, encode TradeAckV2
  B->>A: Copy ack
  A->>A: Paste ack — apply bundle on A
```

## Validation

| Role | Rule |
|------|------|
| Initiator (create) | Each `offeredIds` entry: `quantity >= 2`; IDs in enabled catalog; not expired |
| Acceptor (confirm) | Each `acceptorIds` entry: `quantity >= 2`; offer not expired; IDs in catalog |

```typescript
function validateInitiatorOfferIds(offeredIds, collection, catalogIds, expiresAt): ValidationResult;
function validateAcceptorCounterIds(payload, acceptorIds, collection, catalogIds): ValidationResult;
```

```typescript
function applyTradeBundle(collection, giveIds, receiveIds): Collection;
// initiator: give offeredIds, receive acceptorIds
// acceptor: give acceptorIds, receive offeredIds
```

## UX surfaces

| Screen | Components |
|--------|------------|
| Trade hub | Pending sent + ack confirm |
| Create offer | `TradeStickerSelectGrid` — offer only |
| Accept | `TradeBundlePreview` (partner) + grid (counter-offer) |

**QR:** recommended when `offeredIds.length <= 8`; larger bundles — copy payload (QR/deep link may fail).

## Deep link

`stickera://trade/accept?p=<base64url>`

## Abuse / expectations

- Trades are between people you trust.
- Editing local saves is possible; not a competitive game.

## Future (out of MVP)

- Camera scanner
- Backend / async negotiation
- Bluetooth proximity
