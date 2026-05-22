import { decodeTradeAck } from '@/domain/trade/ackCodec';
import { encodeTradePayload } from '@/domain/trade/codec';
import { getInitiatorOfferedIds } from '@/domain/trade/payloadHelpers';
import type { TradeLogEntry, TradePayloadAny, TradePayloadV1 } from '@/domain/types';

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

function parseCounterIds(entry: TradeLogEntry): string[] {
  if (entry.counter_ids_json) {
    try {
      const ids = JSON.parse(entry.counter_ids_json) as unknown;
      return Array.isArray(ids) ? ids.filter((x) => typeof x === 'string') : [];
    } catch {
      return [];
    }
  }
  if (entry.ack_encoded) {
    try {
      const ack = decodeTradeAck(entry.ack_encoded);
      if (ack.v === 2) return ack.acceptorIds;
    } catch {
      return [];
    }
  }
  return [];
}

/** Stickers this user gave vs received for a completed trade log entry. */
export function getTradeSidesFromEntry(entry: TradeLogEntry): {
  gaveIds: string[];
  receivedIds: string[];
} {
  const payload = parsePayloadFromLog(entry.payload_json);
  if (!payload) return { gaveIds: [], receivedIds: [] };

  const offeredIds = getInitiatorOfferedIds(payload);
  const counterIds = parseCounterIds(entry);

  if (entry.role === 'acceptor') {
    return {
      gaveIds: counterIds,
      receivedIds: offeredIds,
    };
  }

  if (payload.v === 1) {
    const v1 = payload as TradePayloadV1;
    return {
      gaveIds: offeredIds,
      receivedIds: counterIds.length > 0 ? counterIds : [v1.wanted.stickerId],
    };
  }

  return {
    gaveIds: offeredIds,
    receivedIds: counterIds,
  };
}

export function encodedPayloadFromEntry(entry: TradeLogEntry): string {
  if (entry.encoded_payload) return entry.encoded_payload;
  const payload = parsePayloadFromLog(entry.payload_json);
  if (!payload) throw new Error('INVALID_TRADE_PAYLOAD');
  return encodeTradePayload(payload);
}
