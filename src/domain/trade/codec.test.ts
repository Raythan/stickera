import { describe, expect, it } from '@jest/globals';

import type { TradePayload } from '@/domain/types';

import { decodeTradePayload, encodeTradePayload } from './codec';

const payload: TradePayload = {
  v: 1,
  offerId: 'abc-123',
  offered: { stickerId: 'album:1', quantity: 1 },
  wanted: { stickerId: 'album:2', quantity: 1 },
  expiresAt: '2026-12-31T23:59:59Z',
};

describe('trade codec', () => {
  it('round-trips encode → decode', () => {
    const encoded = encodeTradePayload(payload);
    const decoded = decodeTradePayload(encoded);
    expect(decoded).toEqual(payload);
  });

  it('produces a URL-safe string', () => {
    const encoded = encodeTradePayload(payload);
    expect(encoded).not.toMatch(/[+/=]/);
  });

  it('rejects invalid version', () => {
    const bad = { ...payload, v: 99 };
    const encoded = encodeTradePayload(bad as never);
    expect(() => decodeTradePayload(encoded)).toThrow('INVALID_TRADE_VERSION');
  });

  it('rejects missing fields', () => {
    const raw = Buffer.from(JSON.stringify({ v: 1 })).toString('base64url');
    expect(() => decodeTradePayload(raw)).toThrow('INVALID_TRADE_PAYLOAD');
  });
});
