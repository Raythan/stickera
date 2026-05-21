import { describe, expect, it } from '@jest/globals';

import type { CollectionRow, TradePayload } from '@/domain/types';

import { validateOfferAsAcceptor, validateOfferAsInitiator } from './validate';

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

describe('validateOfferAsInitiator', () => {
  it('accepts valid offer', () => {
    expect(validateOfferAsInitiator(makePayload(), collection, catalogIds, now).valid).toBe(true);
  });

  it('rejects insufficient duplicate on offered', () => {
    const payload = makePayload({ offered: { stickerId: 'album:2', quantity: 1 } });
    expect(validateOfferAsInitiator(payload, collection, catalogIds, now)).toEqual({
      valid: false,
      reason: 'insufficientDuplicate',
    });
  });
});

describe('validateOfferAsAcceptor', () => {
  it('accepts when acceptor has wanted qty >= 1', () => {
    const payload = makePayload({ wanted: { stickerId: 'album:2', quantity: 1 } });
    expect(validateOfferAsAcceptor(payload, collection, catalogIds, now).valid).toBe(true);
  });

  it('rejects when acceptor lacks wanted sticker', () => {
    const payload = makePayload({ wanted: { stickerId: 'album:3', quantity: 1 } });
    expect(validateOfferAsAcceptor(payload, collection, catalogIds, now)).toEqual({
      valid: false,
      reason: 'insufficientWanted',
    });
  });

  it('rejects expired offer', () => {
    expect(validateOfferAsAcceptor(makePayload({ expiresAt: past }), collection, catalogIds, now)).toEqual({
      valid: false,
      reason: 'expired',
    });
  });
});
