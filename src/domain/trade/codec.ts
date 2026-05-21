import type { TradePayload } from '@/domain/types';

export function encodeTradePayload(payload: TradePayload): string {
  const json = JSON.stringify(payload);
  if (typeof btoa === 'function') {
    return btoa(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  return Buffer.from(json).toString('base64url');
}

export function decodeTradePayload(encoded: string): TradePayload {
  let json: string;
  const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  if (typeof atob === 'function') {
    json = atob(b64);
  } else {
    json = Buffer.from(b64, 'base64').toString('utf-8');
  }

  const data = JSON.parse(json);

  if (data.v !== 1) throw new Error('INVALID_TRADE_VERSION');
  if (!data.offerId || typeof data.offerId !== 'string') throw new Error('INVALID_TRADE_PAYLOAD');
  if (!data.offered?.stickerId || !data.wanted?.stickerId) throw new Error('INVALID_TRADE_PAYLOAD');
  if (typeof data.expiresAt !== 'string') throw new Error('INVALID_TRADE_PAYLOAD');

  return data as TradePayload;
}
