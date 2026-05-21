import { describe, expect, it } from '@jest/globals';

import type { TradePayloadV1, TradePayloadV2 } from '@/domain/types';

import { decodeTradePayload, encodeTradePayload } from './codec';

const payloadV1: TradePayloadV1 = {
  v: 1,
  offerId: '550e8400-e29b-41d4-a716-446655440000',
  offered: { stickerId: 'album:1', quantity: 1 },
  wanted: { stickerId: 'album:2', quantity: 1 },
  expiresAt: '2026-12-31T23:59:59Z',
};

const payloadV2: TradePayloadV2 = {
  v: 2,
  offerId: '550e8400-e29b-41d4-a716-446655440001',
  offeredIds: ['album:1', 'album:3'],
  expiresAt: '2026-12-31T23:59:59Z',
};

describe('trade payload codec', () => {
  it('round-trips v1 encode → decode', () => {
    const encoded = encodeTradePayload(payloadV1);
    const decoded = decodeTradePayload(encoded);
    expect(decoded).toEqual(payloadV1);
  });

  it('round-trips v2 encode → decode', () => {
    const encoded = encodeTradePayload(payloadV2);
    const decoded = decodeTradePayload(encoded);
    expect(decoded).toEqual(payloadV2);
  });

  it('rejects invalid version', () => {
    const bad = { ...payloadV1, v: 99 };
    const encoded = encodeTradePayload(bad as never);
    expect(() => decodeTradePayload(encoded)).toThrow('INVALID_TRADE_VERSION');
  });

  it('rejects malformed base64', () => {
    const raw = Buffer.from(JSON.stringify({ v: 1 })).toString('base64url');
    expect(() => decodeTradePayload(raw)).toThrow('INVALID_TRADE_PAYLOAD');
  });
});
