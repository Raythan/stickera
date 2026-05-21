import { describe, expect, it } from '@jest/globals';

import type { TradeLogEntry } from '@/domain/types';

import { encodedPayloadFromEntry, isTradePayloadExpired } from './tradeLogHelpers';
import { encodeTradePayload } from './codec';

describe('tradeLogHelpers', () => {
  it('detects expired payload', () => {
    const json = JSON.stringify({
      v: 2,
      offerId: 'x',
      offeredIds: ['a:1'],
      expiresAt: '2020-01-01T00:00:00Z',
    });
    expect(isTradePayloadExpired(json, new Date('2026-01-01'))).toBe(true);
  });

  it('re-encodes payload when encoded_payload missing', () => {
    const payload = {
      v: 2 as const,
      offerId: '550e8400-e29b-41d4-a716-446655440099',
      offeredIds: ['album:1'],
      expiresAt: '2099-01-01T00:00:00Z',
    };
    const entry: TradeLogEntry = {
      id: payload.offerId,
      payload_json: JSON.stringify(payload),
      status: 'sent',
      created_at: '2026-01-01T00:00:00Z',
    };
    expect(encodedPayloadFromEntry(entry)).toBe(encodeTradePayload(payload));
  });
});
