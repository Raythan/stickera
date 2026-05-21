import type { CollectionRow, TradePayload } from '@/domain/types';

export type TradeValidationResult =
  | { valid: true }
  | {
      valid: false;
      reason:
        | 'expired'
        | 'insufficientDuplicate'
        | 'insufficientWanted'
        | 'wantedNotInCatalog'
        | 'offeredNotInCatalog';
    };

function checkCatalogAndExpiry(
  payload: TradePayload,
  catalogStickerIds: Set<string>,
  now: Date,
): TradeValidationResult | null {
  if (new Date(payload.expiresAt) <= now) {
    return { valid: false, reason: 'expired' };
  }
  if (!catalogStickerIds.has(payload.offered.stickerId)) {
    return { valid: false, reason: 'offeredNotInCatalog' };
  }
  if (!catalogStickerIds.has(payload.wanted.stickerId)) {
    return { valid: false, reason: 'wantedNotInCatalog' };
  }
  return null;
}

export function validateOfferAsInitiator(
  payload: TradePayload,
  collection: CollectionRow[],
  catalogStickerIds: Set<string>,
  now = new Date(),
): TradeValidationResult {
  const base = checkCatalogAndExpiry(payload, catalogStickerIds, now);
  if (base) return base;

  const offeredRow = collection.find((r) => r.sticker_id === payload.offered.stickerId);
  if (!offeredRow || offeredRow.quantity < 2) {
    return { valid: false, reason: 'insufficientDuplicate' };
  }

  return { valid: true };
}

export function validateOfferAsAcceptor(
  payload: TradePayload,
  collection: CollectionRow[],
  catalogStickerIds: Set<string>,
  now = new Date(),
): TradeValidationResult {
  const base = checkCatalogAndExpiry(payload, catalogStickerIds, now);
  if (base) return base;

  const wantedRow = collection.find((r) => r.sticker_id === payload.wanted.stickerId);
  if (!wantedRow || wantedRow.quantity < 1) {
    return { valid: false, reason: 'insufficientWanted' };
  }

  return { valid: true };
}

/** @deprecated Use validateOfferAsInitiator or validateOfferAsAcceptor */
export function validateTradePayload(
  payload: TradePayload,
  collection: CollectionRow[],
  catalogStickerIds: Set<string>,
  now = new Date(),
): TradeValidationResult {
  return validateOfferAsInitiator(payload, collection, catalogStickerIds, now);
}
