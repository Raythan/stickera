import type { TFunction } from 'i18next';

export function tradeErrorKey(error: string): string | null {
  const known = [
    'expired',
    'insufficientDuplicate',
    'insufficientWanted',
    'invalidPayload',
    'wantedNotInCatalog',
    'offeredNotInCatalog',
    'tooManyStickers',
    'emptySelection',
  ];
  if (error === 'INVALID_TRADE_PAYLOAD') return 'errors.trade.invalidPayload';
  if (error === 'OFFER_ALREADY_USED') return 'errors.trade.alreadyUsedLocally';
  if (error === 'OWN_OFFER') return 'errors.trade.ownOffer';
  if (error === 'OFFER_ALREADY_CLAIMED_GLOBALLY') return 'errors.trade.alreadyClaimedGlobally';
  if (error === 'REGISTRY_ERROR') return 'errors.trade.registryError';
  if (error === 'contentVersionMismatch') return 'errors.trade.contentVersionMismatch';
  if (error === 'CONTENT_VERSION_REQUIRED') return 'errors.trade.contentVersionRequired';
  if (known.includes(error)) return `errors.trade.${error}`;
  return null;
}

export function formatTradeError(t: TFunction, reason: string): string {
  const key = tradeErrorKey(reason);
  return key ? t(key) : reason;
}
