import type { TradeLogEntry } from '@/domain/types';

import { loadStore, saveStore } from './localStore';

export const TradeLogRepository = {
  async append(entry: TradeLogEntry): Promise<void> {
    const store = loadStore();
    store.trade_log.push({
      id: entry.id,
      payload_json: entry.payload_json,
      status: entry.status,
      created_at: entry.created_at,
    });
    saveStore(store);
  },

  async listRecent(limit = 20): Promise<TradeLogEntry[]> {
    const store = loadStore();
    return store.trade_log
      .slice()
      .reverse()
      .slice(0, limit)
      .map((e) => ({ ...e, status: e.status as TradeLogEntry['status'] }));
  },

  async findByOfferId(offerId: string): Promise<TradeLogEntry | null> {
    const store = loadStore();
    const entry = store.trade_log.find((e) => {
      try {
        const payload = JSON.parse(e.payload_json);
        return payload.offerId === offerId;
      } catch {
        return false;
      }
    });
    return entry
      ? { ...entry, status: entry.status as TradeLogEntry['status'] }
      : null;
  },

  async updateStatus(offerId: string, status: TradeLogEntry['status']): Promise<void> {
    const store = loadStore();
    for (const entry of store.trade_log) {
      try {
        const payload = JSON.parse(entry.payload_json);
        if (payload.offerId === offerId) {
          entry.status = status;
          break;
        }
      } catch {
        // skip malformed
      }
    }
    saveStore(store);
  },

  async clearAll(): Promise<void> {
    const store = loadStore();
    store.trade_log = [];
    saveStore(store);
  },
};
