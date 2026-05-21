import type { CollectionRow, TradePayload } from '@/domain/types';

export type TradeValidationResult =
  | { valid: true }
  | { valid: false; reason: 'expired' | 'insufficientDuplicate' | 'wantedNotInCatalog' | 'offeredNotInCatalog' };

export function validateTradePayload(
  payload: TradePayload,
  collection: CollectionRow[],
  catalogStickerIds: Set<string>,
  now = new Date(),
): TradeValidationResult {
  if (new Date(payload.expiresAt) <= now) {
    return { valid: false, reason: 'expired' };
  }

  if (!catalogStickerIds.has(payload.offered.stickerId)) {
    return { valid: false, reason: 'offeredNotInCatalog' };
  }

  if (!catalogStickerIds.has(payload.wanted.stickerId)) {
    return { valid: false, reason: 'wantedNotInCatalog' };
  }

  const offeredRow = collection.find((r) => r.sticker_id === payload.offered.stickerId);
  if (!offeredRow || offeredRow.quantity < 2) {
    return { valid: false, reason: 'insufficientDuplicate' };
  }

  return { valid: true };
}
