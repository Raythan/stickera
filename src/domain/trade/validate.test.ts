import { describe, expect, it } from '@jest/globals';

import type { CollectionRow, TradePayload } from '@/domain/types';

import {
  validateAcceptorCounterIds,
  validateGiftAccept,
  validateInitiatorOfferIds,
  validateOfferAsAcceptor,
  validateOfferAsInitiator,
  validateTradeContentVersion,
} from './validate';

const now = new Date('2026-05-21T14:00:00Z');
const future = '2026-05-21T14:15:00Z';
const past = '2026-05-21T13:00:00Z';

const catalogIds = new Set(['album:1', 'album:2', 'album:3', 'album:4']);

const collection: CollectionRow[] = [
  { sticker_id: 'album:1', album_id: 'album', quantity: 3, is_new: 0, first_obtained_at: null, updated_at: '' },
  { sticker_id: 'album:2', album_id: 'album', quantity: 1, is_new: 0, first_obtained_at: null, updated_at: '' },
  { sticker_id: 'album:3', album_id: 'album', quantity: 2, is_new: 0, first_obtained_at: null, updated_at: '' },
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
    expect(validateOfferAsAcceptor(payload, collection, catalogIds, null, now).valid).toBe(true);
  });

  it('rejects when acceptor lacks wanted sticker', () => {
    const payload = makePayload({ wanted: { stickerId: 'album:4', quantity: 1 } });
    expect(validateOfferAsAcceptor(payload, collection, catalogIds, null, now)).toEqual({
      valid: false,
      reason: 'insufficientWanted',
    });
  });

  it('rejects expired offer', () => {
    expect(validateOfferAsAcceptor(makePayload({ expiresAt: past }), collection, catalogIds, null, now)).toEqual({
      valid: false,
      reason: 'expired',
    });
  });
});

describe('validateInitiatorOfferIds (v2)', () => {
  it('accepts multiple duplicates', () => {
    expect(
      validateInitiatorOfferIds(['album:1', 'album:3'], collection, catalogIds, future, now).valid,
    ).toBe(true);
  });

  it('rejects when one id is not a duplicate', () => {
    expect(validateInitiatorOfferIds(['album:1', 'album:2'], collection, catalogIds, future, now)).toEqual({
      valid: false,
      reason: 'insufficientDuplicate',
    });
  });

  it('rejects empty selection', () => {
    expect(validateInitiatorOfferIds([], collection, catalogIds, future, now)).toEqual({
      valid: false,
      reason: 'emptySelection',
    });
  });
});

describe('validateGiftAccept (v2)', () => {
  const payloadV2 = {
    v: 2 as const,
    offerId: 'v2-offer',
    offeredIds: ['album:1', 'album:3'],
    expiresAt: future,
    contentVersion: '2026.05.22.5',
  };

  it('accepts when acceptor has no duplicates of offered', () => {
    const sparse: CollectionRow[] = [
      { sticker_id: 'album:4', album_id: 'album', quantity: 1, is_new: 0, first_obtained_at: null, updated_at: '' },
    ];
    expect(
      validateGiftAccept(payloadV2, catalogIds, '2026.05.22.5', now).valid,
    ).toBe(true);
    expect(validateOfferAsAcceptor(payloadV2, sparse, catalogIds, '2026.05.22.5', now).valid).toBe(
      true,
    );
  });

  it('rejects v1 as legacy', () => {
    expect(validateGiftAccept(makePayload(), catalogIds, null, now)).toEqual({
      valid: false,
      reason: 'legacyOffer',
    });
  });

  it('rejects expired', () => {
    expect(
      validateGiftAccept({ ...payloadV2, expiresAt: past }, catalogIds, '2026.05.22.5', now),
    ).toEqual({
      valid: false,
      reason: 'expired',
    });
  });
});

describe('validateAcceptorCounterIds (v2)', () => {
  const payloadV2 = {
    v: 2 as const,
    offerId: 'v2-offer',
    offeredIds: ['album:1'],
    expiresAt: future,
    contentVersion: '2026.05.22.5',
  };

  it('accepts valid counter-offer', () => {
    expect(
      validateAcceptorCounterIds(
        payloadV2,
        ['album:3'],
        collection,
        catalogIds,
        '2026.05.22.5',
        now,
      ).valid,
    ).toBe(true);
  });

  it('rejects when acceptor lacks duplicate', () => {
    expect(
      validateAcceptorCounterIds(payloadV2, ['album:2'], collection, catalogIds, '2026.05.22.5', now),
    ).toEqual({
      valid: false,
      reason: 'insufficientDuplicate',
    });
  });
});

describe('validateTradeContentVersion', () => {
  const payloadV2 = {
    v: 2 as const,
    offerId: 'v2-offer',
    offeredIds: ['album:1'],
    expiresAt: future,
    contentVersion: '2026.05.22.5',
  };

  it('accepts matching versions', () => {
    expect(validateTradeContentVersion(payloadV2, '2026.05.22.5').valid).toBe(true);
  });

  it('rejects mismatch', () => {
    expect(validateTradeContentVersion(payloadV2, '2026.05.22.4')).toEqual({
      valid: false,
      reason: 'contentVersionMismatch',
    });
  });

  it('rejects missing contentVersion on v2', () => {
    const legacy = { ...payloadV2, contentVersion: undefined as unknown as string };
    expect(validateTradeContentVersion(legacy, '2026.05.22.5')).toEqual({
      valid: false,
      reason: 'contentVersionMismatch',
    });
  });
});
