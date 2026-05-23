import { catalogVersionsMatch } from '@/domain/catalog/compareCatalogVersion';
import type { CollectionRow, TradePayloadAny } from '@/domain/types';

import { MAX_TRADE_STICKERS_PER_SIDE } from './constants';
import { getInitiatorOfferedIds } from './payloadHelpers';

export type TradeValidationResult =
  | { valid: true }
  | {
      valid: false;
      reason:
        | 'expired'
        | 'insufficientDuplicate'
        | 'insufficientWanted'
        | 'wantedNotInCatalog'
        | 'offeredNotInCatalog'
        | 'tooManyStickers'
        | 'emptySelection'
        | 'contentVersionMismatch'
        | 'legacyOffer';
    };

export function validateTradeContentVersion(
  payload: TradePayloadAny,
  localContentVersion: string | null,
): TradeValidationResult {
  if (payload.v !== 2) return { valid: true };
  const remote = payload.contentVersion;
  if (!remote || !localContentVersion) {
    return { valid: false, reason: 'contentVersionMismatch' };
  }
  if (!catalogVersionsMatch(remote, localContentVersion)) {
    return { valid: false, reason: 'contentVersionMismatch' };
  }
  return { valid: true };
}

function checkExpiryAndCatalog(
  stickerIds: string[],
  catalogStickerIds: Set<string>,
  expiresAt: string,
  now: Date,
): TradeValidationResult | null {
  if (new Date(expiresAt) <= now) {
    return { valid: false, reason: 'expired' };
  }
  for (const id of stickerIds) {
    if (!catalogStickerIds.has(id)) {
      return { valid: false, reason: 'offeredNotInCatalog' };
    }
  }
  return null;
}

function qtyFor(collection: CollectionRow[], stickerId: string): number {
  return collection.find((r) => r.sticker_id === stickerId)?.quantity ?? 0;
}

export function validateInitiatorOfferIds(
  offeredIds: string[],
  collection: CollectionRow[],
  catalogStickerIds: Set<string>,
  expiresAt: string,
  now = new Date(),
): TradeValidationResult {
  const unique = [...new Set(offeredIds)];
  if (unique.length === 0) return { valid: false, reason: 'emptySelection' };
  if (unique.length > MAX_TRADE_STICKERS_PER_SIDE) return { valid: false, reason: 'tooManyStickers' };

  const base = checkExpiryAndCatalog(unique, catalogStickerIds, expiresAt, now);
  if (base) return base;

  for (const id of unique) {
    if (qtyFor(collection, id) < 2) {
      return { valid: false, reason: 'insufficientDuplicate' };
    }
  }

  return { valid: true };
}

export function validateAcceptorCounterIds(
  payload: TradePayloadAny,
  acceptorIds: string[],
  collection: CollectionRow[],
  catalogStickerIds: Set<string>,
  localContentVersion: string | null = null,
  now = new Date(),
): TradeValidationResult {
  const versionCheck = validateTradeContentVersion(payload, localContentVersion);
  if (!versionCheck.valid) return versionCheck;

  const unique = [...new Set(acceptorIds)];
  if (unique.length === 0) return { valid: false, reason: 'emptySelection' };
  if (unique.length > MAX_TRADE_STICKERS_PER_SIDE) return { valid: false, reason: 'tooManyStickers' };

  const offeredIds = getInitiatorOfferedIds(payload);
  const base = checkExpiryAndCatalog(
    [...offeredIds, ...unique],
    catalogStickerIds,
    payload.expiresAt,
    now,
  );
  if (base) {
    if (!base.valid && base.reason === 'offeredNotInCatalog') {
      return { valid: false, reason: 'wantedNotInCatalog' };
    }
    return base;
  }

  for (const id of unique) {
    if (qtyFor(collection, id) < 2) {
      return { valid: false, reason: 'insufficientDuplicate' };
    }
  }

  return { valid: true };
}

/** v1: initiator offered duplicate */
export function validateOfferAsInitiator(
  payload: TradePayloadAny,
  collection: CollectionRow[],
  catalogStickerIds: Set<string>,
  now = new Date(),
): TradeValidationResult {
  if (payload.v === 2) {
    return validateInitiatorOfferIds(
      payload.offeredIds,
      collection,
      catalogStickerIds,
      payload.expiresAt,
      now,
    );
  }
  const offeredIds = [payload.offered.stickerId];
  const base = validateInitiatorOfferIds(
    offeredIds,
    collection,
    catalogStickerIds,
    payload.expiresAt,
    now,
  );
  if (!base.valid) return base;
  if (!catalogStickerIds.has(payload.wanted.stickerId)) {
    return { valid: false, reason: 'wantedNotInCatalog' };
  }
  return { valid: true };
}

/** v2 gift accept: receive only — no inventory check on acceptor. */
export function validateGiftAccept(
  payload: TradePayloadAny,
  catalogStickerIds: Set<string>,
  localContentVersion: string | null = null,
  now = new Date(),
): TradeValidationResult {
  if (payload.v === 1) {
    return { valid: false, reason: 'legacyOffer' };
  }

  const versionCheck = validateTradeContentVersion(payload, localContentVersion);
  if (!versionCheck.valid) return versionCheck;

  const offeredIds = getInitiatorOfferedIds(payload);
  if (offeredIds.length === 0) return { valid: false, reason: 'emptySelection' };
  if (offeredIds.length > MAX_TRADE_STICKERS_PER_SIDE) {
    return { valid: false, reason: 'tooManyStickers' };
  }

  return (
    checkExpiryAndCatalog(offeredIds, catalogStickerIds, payload.expiresAt, now) ?? {
      valid: true,
    }
  );
}

/** v1 legacy: acceptor gives wanted */
export function validateOfferAsAcceptor(
  payload: TradePayloadAny,
  collection: CollectionRow[],
  catalogStickerIds: Set<string>,
  localContentVersion: string | null = null,
  now = new Date(),
): TradeValidationResult {
  if (payload.v === 2) {
    return validateGiftAccept(payload, catalogStickerIds, localContentVersion, now);
  }

  const versionCheck = validateTradeContentVersion(payload, localContentVersion);
  if (!versionCheck.valid) return versionCheck;
  const offeredIds = getInitiatorOfferedIds(payload);
  const base = checkExpiryAndCatalog(offeredIds, catalogStickerIds, payload.expiresAt, now);
  if (base) return base;

  if (qtyFor(collection, payload.wanted.stickerId) < 1) {
    return { valid: false, reason: 'insufficientWanted' };
  }

  return { valid: true };
}

export function validateTradePayload(
  payload: TradePayloadAny,
  collection: CollectionRow[],
  catalogStickerIds: Set<string>,
  now = new Date(),
): TradeValidationResult {
  return validateOfferAsInitiator(payload, collection, catalogStickerIds, now);
}
