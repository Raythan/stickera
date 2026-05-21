import { describe, expect, it } from '@jest/globals';

import type { CollectionRow, TradePayload } from '@/domain/types';

import { validateTradePayload } from './validate';

const now = new Date('2026-05-21T14:00:00Z');
const future = '2026-05-21T14:15:00Z';
const past = '2026-05-21T13:00:00Z';

const catalogIds = new Set(['album:1', 'album:2', 'album:3']);

const collection: CollectionRow[] = [
  { sticker_id: 'album:1', album_id: 'album', quantity: 3, is_new: 0, first_obtained_at: null, updated_at: '' },
  { sticker_id: 'album:2', album_id: 'album', quantity: 1, is_new: 0, first_obtained_at: null, updated_at: '' },
];

function makePayload(overrides?: Partial<TradePayload>): TradePayload {
  return {
    v: 1,
    offerId: 'test-offer',
    offered: { stickerId: 'album:1', quantity: 1 },
    wanted: { stickerId: 'album:3', quantity: 1 },
    expiresAt: future,
    ...overrides,
  };
}

describe('validateTradePayload', () => {
  it('accepts valid offer', () => {
    const result = validateTradePayload(makePayload(), collection, catalogIds, now);
    expect(result.valid).toBe(true);
  });

  it('rejects expired offer', () => {
    const result = validateTradePayload(makePayload({ expiresAt: past }), collection, catalogIds, now);
    expect(result).toEqual({ valid: false, reason: 'expired' });
  });

  it('rejects insufficient duplicate (qty < 2)', () => {
    const payload = makePayload({ offered: { stickerId: 'album:2', quantity: 1 } });
    const result = validateTradePayload(payload, collection, catalogIds, now);
    expect(result).toEqual({ valid: false, reason: 'insufficientDuplicate' });
  });

  it('rejects wanted sticker not in catalog', () => {
    const payload = makePayload({ wanted: { stickerId: 'unknown:99', quantity: 1 } });
    const result = validateTradePayload(payload, collection, catalogIds, now);
    expect(result).toEqual({ valid: false, reason: 'wantedNotInCatalog' });
  });

  it('rejects offered sticker not in catalog', () => {
    const payload = makePayload({ offered: { stickerId: 'unknown:99', quantity: 1 } });
    const result = validateTradePayload(payload, collection, catalogIds, now);
    expect(result).toEqual({ valid: false, reason: 'offeredNotInCatalog' });
  });
});
