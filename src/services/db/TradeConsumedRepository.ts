import { getOfferIdFromPayloadJson } from '@/domain/trade/tradeLogHelpers';

import { loadStore, saveStore } from './localStore';
import { TradeLogRepository } from './TradeLogRepository';

const KEY = 'consumed_trade_offers';

function readIds(store: ReturnType<typeof loadStore>): string[] {
  const raw = store.settings[KEY];
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function writeIds(store: ReturnType<typeof loadStore>, ids: string[]): void {
  store.settings[KEY] = JSON.stringify(ids);
}

/** Local anti-replay: offerIds already completed on this device. */
export const TradeConsumedRepository = {
  async isConsumed(offerId: string): Promise<boolean> {
    const store = loadStore();
    return readIds(store).includes(offerId);
  },

  async markConsumed(offerId: string): Promise<void> {
    const store = loadStore();
    const ids = readIds(store);
    if (!ids.includes(offerId)) {
      writeIds(store, [...ids, offerId]);
      saveStore(store);
    }
  },

  async clearAll(): Promise<void> {
    const store = loadStore();
    delete store.settings[KEY];
    saveStore(store);
  },

  /** Backfill from completed trade_log entries (e.g. before anti-replay existed). */
  async syncFromTradeLog(): Promise<void> {
    const entries = await TradeLogRepository.listRecent(100);
    for (const entry of entries) {
      if (entry.status !== 'completed') continue;
      const offerId = getOfferIdFromPayloadJson(entry.payload_json);
      if (offerId) await this.markConsumed(offerId);
    }
  },
};
