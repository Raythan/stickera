import type { TradePayloadV2 } from '@/domain/types';

import { MAX_TRADE_STICKERS_PER_SIDE } from './constants';

let counter = 0;

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  counter += 1;
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 10);
  return `${ts}-${rand}-${counter}`;
}

export function createTradePayloadV2(opts: {
  offeredIds: string[];
  fromDisplayName?: string;
  ttlMinutes?: number;
  now?: Date;
}): TradePayloadV2 {
  const unique = [...new Set(opts.offeredIds)];
  if (unique.length === 0) throw new Error('TRADE_EMPTY_OFFER');
  if (unique.length > MAX_TRADE_STICKERS_PER_SIDE) throw new Error('TRADE_TOO_MANY_STICKERS');

  const now = opts.now ?? new Date();
  const ttl = (opts.ttlMinutes ?? 15) * 60_000;

  return {
    v: 2,
    offerId: generateUUID(),
    fromDisplayName: opts.fromDisplayName,
    offeredIds: unique,
    expiresAt: new Date(now.getTime() + ttl).toISOString(),
  };
}

/** @deprecated v1 single-pair offer */
export function createTradePayload(opts: {
  offeredStickerId: string;
  wantedStickerId: string;
  fromDisplayName?: string;
  ttlMinutes?: number;
  now?: Date;
}) {
  const now = opts.now ?? new Date();
  const ttl = (opts.ttlMinutes ?? 15) * 60_000;

  return {
    v: 1 as const,
    offerId: generateUUID(),
    fromDisplayName: opts.fromDisplayName,
    offered: { stickerId: opts.offeredStickerId, quantity: 1 as const },
    wanted: { stickerId: opts.wantedStickerId, quantity: 1 as const },
    expiresAt: new Date(now.getTime() + ttl).toISOString(),
  };
}
