import { describe, expect, it } from '@jest/globals';

import type { CollectionRow, TradePayload } from '@/domain/types';

import { applyTrade, applyTradeBundle } from './apply';

const now = new Date('2026-05-21T14:00:00Z');

const payload: TradePayload = {
  v: 1,
  offerId: 'trade-1',
  offered: { stickerId: 'album:1', quantity: 1 },
  wanted: { stickerId: 'album:2', quantity: 1 },
  expiresAt: '2026-12-31T23:59:59Z',
};

const collection: CollectionRow[] = [
  { sticker_id: 'album:1', album_id: 'album', quantity: 3, is_new: 0, first_obtained_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { sticker_id: 'album:2', album_id: 'album', quantity: 2, is_new: 0, first_obtained_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
];

describe('applyTrade', () => {
  it('initiator gives offered, receives wanted', () => {
    const result = applyTrade(collection, payload, 'initiator', now);
    const s1 = result.find((r) => r.sticker_id === 'album:1');
    const s2 = result.find((r) => r.sticker_id === 'album:2');
    expect(s1?.quantity).toBe(2); // 3 - 1
    expect(s2?.quantity).toBe(3); // 2 + 1
  });

  it('acceptor gives wanted, receives offered', () => {
    const result = applyTrade(collection, payload, 'acceptor', now);
    const s1 = result.find((r) => r.sticker_id === 'album:1');
    const s2 = result.find((r) => r.sticker_id === 'album:2');
    expect(s1?.quantity).toBe(4); // 3 + 1
    expect(s2?.quantity).toBe(1); // 2 - 1
  });

  it('creates new row when receiving sticker not in collection', () => {
    const sparseCollection: CollectionRow[] = [
      { sticker_id: 'album:1', album_id: 'album', quantity: 2, is_new: 0, first_obtained_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
    ];
    const result = applyTrade(sparseCollection, payload, 'initiator', now);
    const s2 = result.find((r) => r.sticker_id === 'album:2');
    expect(s2).toBeDefined();
    expect(s2?.quantity).toBe(1);
    expect(s2?.is_new).toBe(1);
  });

  it('throws when giving sticker with zero quantity', () => {
    const emptyCollection: CollectionRow[] = [
      { sticker_id: 'album:1', album_id: 'album', quantity: 0, is_new: 0, first_obtained_at: null, updated_at: '' },
    ];
    expect(() => applyTrade(emptyCollection, payload, 'initiator', now)).toThrow('TRADE_INSUFFICIENT_QTY');
  });
});

describe('applyTradeBundle', () => {
  it('applies multi give and receive', () => {
    const rich: CollectionRow[] = [
      { sticker_id: 'album:1', album_id: 'album', quantity: 3, is_new: 0, first_obtained_at: null, updated_at: '' },
      { sticker_id: 'album:2', album_id: 'album', quantity: 3, is_new: 0, first_obtained_at: null, updated_at: '' },
      { sticker_id: 'album:3', album_id: 'album', quantity: 2, is_new: 0, first_obtained_at: null, updated_at: '' },
    ];
    const result = applyTradeBundle(rich, ['album:1', 'album:2'], ['album:3'], now);
    expect(result.find((r) => r.sticker_id === 'album:1')?.quantity).toBe(2);
    expect(result.find((r) => r.sticker_id === 'album:2')?.quantity).toBe(2);
    expect(result.find((r) => r.sticker_id === 'album:3')?.quantity).toBe(3);
  });
});
