import type { PackBankState } from '@/domain/types';

import { loadStore, saveStore } from './localStore';

export const PackStateRepository = {
  async ensureInitialized(): Promise<void> {
    await PackStateRepository.getState();
  },

  async getState(): Promise<PackBankState> {
    const store = loadStore();
    return store.pack_state;
  },

  async saveState(state: PackBankState): Promise<void> {
    const store = loadStore();
    store.pack_state = state;
    saveStore(store);
  },

  async resetCooldown(now = new Date()): Promise<void> {
    const store = loadStore();
    const capacity = 5 + (store.trade_partners?.length ?? 0);
    store.pack_state = {
      pending_packs: capacity,
      last_accrued_at: now.toISOString(),
      last_opened_at: null,
    };
    saveStore(store);
  },
};
