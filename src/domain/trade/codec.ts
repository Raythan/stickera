import type { TradePayloadAny, TradePayloadV1, TradePayloadV2 } from '@/domain/types';

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

function parsePayloadV1(data: Record<string, unknown>): TradePayloadV1 {
  if (data.v !== 1) throw new Error('INVALID_TRADE_VERSION');
  const offered = data.offered as { stickerId?: string };
  const wanted = data.wanted as { stickerId?: string };
  if (!data.offerId || typeof data.offerId !== 'string') throw new Error('INVALID_TRADE_PAYLOAD');
  if (!offered?.stickerId || !wanted?.stickerId) throw new Error('INVALID_TRADE_PAYLOAD');
  if (typeof data.expiresAt !== 'string') throw new Error('INVALID_TRADE_PAYLOAD');
  return data as TradePayloadV1;
}

function parsePayloadV2(data: Record<string, unknown>): TradePayloadV2 {
  if (data.v !== 2) throw new Error('INVALID_TRADE_VERSION');
  if (!data.offerId || typeof data.offerId !== 'string') throw new Error('INVALID_TRADE_PAYLOAD');
  if (typeof data.expiresAt !== 'string') throw new Error('INVALID_TRADE_PAYLOAD');
  const offeredIds = data.offeredIds;
  if (!Array.isArray(offeredIds) || offeredIds.length === 0) throw new Error('INVALID_TRADE_PAYLOAD');
  if (offeredIds.length > MAX_TRADE_STICKERS_PER_SIDE) throw new Error('TRADE_TOO_MANY_STICKERS');
  const unique = new Set(offeredIds);
  if (unique.size !== offeredIds.length) throw new Error('INVALID_TRADE_PAYLOAD');
  for (const id of offeredIds) {
    if (typeof id !== 'string' || id.length < 3) throw new Error('INVALID_TRADE_PAYLOAD');
  }
  const contentVersion = data.contentVersion;
  if (typeof contentVersion !== 'string' || contentVersion.length < 1) {
    throw new Error('INVALID_TRADE_PAYLOAD');
  }
  return data as TradePayloadV2;
}

export function encodeTradePayload(payload: TradePayloadAny): string {
  return toBase64Url(JSON.stringify(payload));
}

export function decodeTradePayload(encoded: string): TradePayloadAny {
  const data = JSON.parse(fromBase64Url(encoded.trim())) as Record<string, unknown>;
  if (data.v === 2) return parsePayloadV2(data);
  if (data.v === 1) return parsePayloadV1(data);
  throw new Error('INVALID_TRADE_VERSION');
}
