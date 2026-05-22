import type { TradeAckAny, TradeAckV1, TradeAckV2 } from '@/domain/types';

import { MAX_TRADE_STICKERS_PER_SIDE } from './constants';

function toBase64Url(json: string): string {
  if (typeof btoa === 'function') {
    return btoa(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  return Buffer.from(json).toString('base64url');
}

function fromBase64Url(encoded: string): string {
  const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  if (typeof atob === 'function') {
    return atob(b64);
  }
  return Buffer.from(b64, 'base64').toString('utf-8');
}

export function encodeTradeAck(ack: TradeAckAny): string {
  return toBase64Url(JSON.stringify(ack));
}

export function decodeTradeAck(encoded: string): TradeAckAny {
  const data = JSON.parse(fromBase64Url(encoded.trim())) as Record<string, unknown>;

  if (data.v === 2) {
    if (!data.offerId || typeof data.offerId !== 'string') throw new Error('INVALID_TRADE_ACK');
    if (typeof data.acceptedAt !== 'string') throw new Error('INVALID_TRADE_ACK');
    const acceptorIds = data.acceptorIds;
    if (!Array.isArray(acceptorIds) || acceptorIds.length === 0) throw new Error('INVALID_TRADE_ACK');
    if (acceptorIds.length > MAX_TRADE_STICKERS_PER_SIDE) throw new Error('TRADE_TOO_MANY_STICKERS');
    return data as TradeAckV2;
  }

  if (data.v !== 1) throw new Error('INVALID_ACK_VERSION');
  if (!data.offerId || typeof data.offerId !== 'string') throw new Error('INVALID_TRADE_ACK');
  if (typeof data.acceptedAt !== 'string') throw new Error('INVALID_TRADE_ACK');
  return data as TradeAckV1;
}

export function createTradeAckV1(offerId: string, now = new Date()): TradeAckV1 {
  return { v: 1, offerId, acceptedAt: now.toISOString() };
}

export function createTradeAckV2(
  offerId: string,
  acceptorIds: string[],
  opts?: { acceptorProfileId?: string; now?: Date },
): TradeAckV2 {
  const now = opts?.now ?? new Date();
  return {
    v: 2,
    offerId,
    acceptedAt: now.toISOString(),
    acceptorIds,
    acceptorProfileId: opts?.acceptorProfileId,
  };
}

/** @deprecated Use createTradeAckV1 */
export const createTradeAck = createTradeAckV1;
