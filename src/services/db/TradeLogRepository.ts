import { encodeTradePayload } from '@/domain/trade/codec';
import {
  getOfferIdFromPayloadJson,
  isTradePayloadExpired,
} from '@/domain/trade/tradeLogHelpers';
import type { TradeLogEntry } from '@/domain/types';

import { loadStore, saveStore, type StoreData } from './localStore';
import { TradeConsumedRepository } from './TradeConsumedRepository';

function normalizeEntry(e: StoreData['trade_log'][number]): TradeLogEntry {
  return {
    id: e.id,
    payload_json: e.payload_json,
    encoded_payload: e.encoded_payload,
    ack_encoded: e.ack_encoded,
    counter_ids_json: e.counter_ids_json,
    role: e.role as TradeLogEntry['role'],
    status: e.status as TradeLogEntry['status'],
    created_at: e.created_at,
  };
}

function findIndexByOfferId(
  log: ReturnType<typeof loadStore>['trade_log'],
  offerId: string,
): number {
  return log.findIndex((e) => getOfferIdFromPayloadJson(e.payload_json) === offerId);
}

export const TradeLogRepository = {
  async append(entry: TradeLogEntry): Promise<void> {
    const store = loadStore();
    store.trade_log.push({
      id: entry.id,
      payload_json: entry.payload_json,
      encoded_payload: entry.encoded_payload,
      ack_encoded: entry.ack_encoded,
      counter_ids_json: entry.counter_ids_json,
      role: entry.role,
      status: entry.status,
      created_at: entry.created_at,
    });
    saveStore(store);
  },

  async upsertByOfferId(entry: TradeLogEntry): Promise<void> {
    const store = loadStore();
    const offerId = getOfferIdFromPayloadJson(entry.payload_json);
    if (!offerId) {
      await this.append(entry);
      return;
    }
    const idx = findIndexByOfferId(store.trade_log, offerId);
    const row = {
      id: entry.id,
      payload_json: entry.payload_json,
      encoded_payload: entry.encoded_payload,
      ack_encoded: entry.ack_encoded,
      counter_ids_json: entry.counter_ids_json,
      role: entry.role,
      status: entry.status,
      created_at: entry.created_at,
    };
    if (idx >= 0) {
      const prev = store.trade_log[idx];
      store.trade_log[idx] = {
        ...row,
        created_at: prev.created_at,
        ack_encoded: row.ack_encoded ?? prev.ack_encoded,
        encoded_payload: row.encoded_payload ?? prev.encoded_payload,
        counter_ids_json: row.counter_ids_json ?? prev.counter_ids_json,
      };
    } else {
      store.trade_log.push(row);
    }
    saveStore(store);
  },

  async listRecent(limit = 20): Promise<TradeLogEntry[]> {
    const store = loadStore();
    return store.trade_log
      .slice()
      .reverse()
      .slice(0, limit)
      .map(normalizeEntry);
  },

  /** Move consumed/expired initiator offers out of the pending sent list. */
  async archiveStaleSentOffers(): Promise<boolean> {
    const store = loadStore();
    let changed = false;

    for (const row of store.trade_log) {
      if (row.status !== 'sent' || row.role !== 'initiator') continue;
      const offerId = getOfferIdFromPayloadJson(row.payload_json);
      if (!offerId) continue;

      if (await TradeConsumedRepository.isConsumed(offerId)) {
        row.status = 'completed';
        changed = true;
        continue;
      }

      if (isTradePayloadExpired(row.payload_json)) {
        row.status = 'cancelled';
        changed = true;
      }
    }

    if (changed) saveStore(store);
    return changed;
  },

  async listSentOffers(): Promise<TradeLogEntry[]> {
    const store = loadStore();
    return store.trade_log
      .filter(
        (e) =>
          e.status === 'sent' &&
          e.role === 'initiator' &&
          !isTradePayloadExpired(e.payload_json),
      )
      .slice()
      .reverse()
      .map(normalizeEntry);
  },

  async listImportedDrafts(): Promise<TradeLogEntry[]> {
    const store = loadStore();
    return store.trade_log
      .filter((e) => e.status === 'draft')
      .slice()
      .reverse()
      .map(normalizeEntry);
  },

  async findByOfferId(offerId: string): Promise<TradeLogEntry | null> {
    const store = loadStore();
    const idx = findIndexByOfferId(store.trade_log, offerId);
    if (idx < 0) return null;
    return normalizeEntry(store.trade_log[idx]);
  },

  async isOwnSentOffer(offerId: string): Promise<boolean> {
    const store = loadStore();
    return store.trade_log.some(
      (e) =>
        e.status === 'sent' &&
        e.role === 'initiator' &&
        getOfferIdFromPayloadJson(e.payload_json) === offerId,
    );
  },

  async updateStatus(offerId: string, status: TradeLogEntry['status']): Promise<void> {
    const store = loadStore();
    const idx = findIndexByOfferId(store.trade_log, offerId);
    if (idx >= 0) store.trade_log[idx].status = status;
    saveStore(store);
  },

  async saveAck(offerId: string, ackEncoded: string): Promise<void> {
    const store = loadStore();
    const idx = findIndexByOfferId(store.trade_log, offerId);
    if (idx >= 0) store.trade_log[idx].ack_encoded = ackEncoded;
    saveStore(store);
  },

  async saveInitiatorAck(offerId: string, ackEncoded: string): Promise<void> {
    await this.saveAck(offerId, ackEncoded);
  },

  async saveCounterIds(offerId: string, counterIds: string[]): Promise<void> {
    const store = loadStore();
    const idx = findIndexByOfferId(store.trade_log, offerId);
    if (idx >= 0) {
      store.trade_log[idx].counter_ids_json = JSON.stringify(counterIds);
      saveStore(store);
    }
  },

  async listCompleted(): Promise<TradeLogEntry[]> {
    const store = loadStore();
    return store.trade_log
      .filter((e) => e.status === 'completed')
      .slice()
      .reverse()
      .map(normalizeEntry);
  },

  async reencodePayload(offerId: string): Promise<string | null> {
    const entry = await this.findByOfferId(offerId);
    if (!entry) return null;
    if (entry.encoded_payload) return entry.encoded_payload;
    try {
      const encoded = encodeTradePayload(JSON.parse(entry.payload_json));
      const store = loadStore();
      const idx = findIndexByOfferId(store.trade_log, offerId);
      if (idx >= 0) store.trade_log[idx].encoded_payload = encoded;
      saveStore(store);
      return encoded;
    } catch {
      return null;
    }
  },

  async clearAll(): Promise<void> {
    const store = loadStore();
    store.trade_log = [];
    saveStore(store);
  },
};
