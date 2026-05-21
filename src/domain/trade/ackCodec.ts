import type { TradeAck } from '@/domain/types';

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

export function encodeTradeAck(ack: TradeAck): string {
  return toBase64Url(JSON.stringify(ack));
}

export function decodeTradeAck(encoded: string): TradeAck {
  const data = JSON.parse(fromBase64Url(encoded.trim()));

  if (data.v !== 1) throw new Error('INVALID_ACK_VERSION');
  if (!data.offerId || typeof data.offerId !== 'string') throw new Error('INVALID_TRADE_ACK');
  if (typeof data.acceptedAt !== 'string') throw new Error('INVALID_TRADE_ACK');

  return data as TradeAck;
}

export function createTradeAck(offerId: string, now = new Date()): TradeAck {
  return { v: 1, offerId, acceptedAt: now.toISOString() };
}
