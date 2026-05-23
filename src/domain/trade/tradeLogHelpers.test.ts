import { describe, expect, it } from '@jest/globals';

import type { TradeLogEntry } from '@/domain/types';

import {
  encodedPayloadFromEntry,
  getTradeSidesFromEntry,
  isTradePayloadExpired,
} from './tradeLogHelpers';
import { encodeTradePayload } from './codec';

describe('tradeLogHelpers', () => {
  it('detects expired payload', () => {
    const json = JSON.stringify({
      v: 2,
      offerId: 'x',
      offeredIds: ['a:1'],
      expiresAt: '2020-01-01T00:00:00Z',
      contentVersion: '2026.05.22.5',
    });
    expect(isTradePayloadExpired(json, new Date('2026-01-01'))).toBe(true);
  });

  it('re-encodes payload when encoded_payload missing', () => {
    const payload = {
      v: 2 as const,
      offerId: '550e8400-e29b-41d4-a716-446655440099',
      offeredIds: ['album:1'],
      expiresAt: '2099-01-01T00:00:00Z',
      contentVersion: '2026.05.22.5',
    };
    const entry: TradeLogEntry = {
      id: payload.offerId,
      payload_json: JSON.stringify(payload),
      status: 'sent',
      created_at: '2026-01-01T00:00:00Z',
    };
    expect(encodedPayloadFromEntry(entry)).toBe(encodeTradePayload(payload));
  });

  it('getTradeSidesFromEntry for acceptor role (legacy counter)', () => {
    const entry = {
      id: 'x',
      payload_json: JSON.stringify({
        v: 2,
        offerId: 'o1',
        offeredIds: ['album:1', 'album:2'],
        expiresAt: '2099-01-01T00:00:00Z',
        contentVersion: '2026.05.22.5',
      }),
      counter_ids_json: JSON.stringify(['album:3']),
      role: 'acceptor' as const,
      status: 'completed' as const,
      created_at: '2026-01-01T00:00:00Z',
    };
    expect(getTradeSidesFromEntry(entry)).toEqual({
      gaveIds: ['album:3'],
      receivedIds: ['album:1', 'album:2'],
    });
  });

  it('getTradeSidesFromEntry for v2 gift acceptor (no counter)', () => {
    const entry = {
      id: 'x',
      payload_json: JSON.stringify({
        v: 2,
        offerId: 'o2',
        offeredIds: ['album:1'],
        expiresAt: '2099-01-01T00:00:00Z',
        contentVersion: '2026.05.22.5',
      }),
      role: 'acceptor' as const,
      status: 'completed' as const,
      created_at: '2026-01-01T00:00:00Z',
    };
    expect(getTradeSidesFromEntry(entry)).toEqual({
      gaveIds: [],
      receivedIds: ['album:1'],
    });
  });
});
