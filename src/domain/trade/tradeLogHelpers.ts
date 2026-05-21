import { encodeTradePayload } from '@/domain/trade/codec';
import type { TradeLogEntry, TradePayloadAny } from '@/domain/types';

export function parsePayloadFromLog(payloadJson: string): TradePayloadAny | null {
  try {
    return JSON.parse(payloadJson) as TradePayloadAny;
  } catch {
    return null;
  }
}

export function getOfferIdFromPayloadJson(payloadJson: string): string | null {
  const payload = parsePayloadFromLog(payloadJson);
  return payload?.offerId ?? null;
}

export function isTradePayloadExpired(payloadJson: string, now = new Date()): boolean {
  const payload = parsePayloadFromLog(payloadJson);
  if (!payload?.expiresAt) return true;
  return new Date(payload.expiresAt) <= now;
}

export function encodedPayloadFromEntry(entry: TradeLogEntry): string {
  if (entry.encoded_payload) return entry.encoded_payload;
  const payload = parsePayloadFromLog(entry.payload_json);
  if (!payload) throw new Error('INVALID_TRADE_PAYLOAD');
  return encodeTradePayload(payload);
}
