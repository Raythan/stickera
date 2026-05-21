import { loadStore, saveStore } from './localStore';

export type PackState = {
  last_opened_at: string | null;
  next_available_at: string | null;
};

export const PackStateRepository = {
  async ensureInitialized(): Promise<void> {
    const store = loadStore();
    if (!store.pack_state) {
      store.pack_state = { last_opened_at: null, next_available_at: null };
      saveStore(store);
    }
  },

  async getState(): Promise<PackState> {
    const store = loadStore();
    return store.pack_state;
  },

  async recordOpen(openedAt: Date, nextAvailableAt: Date): Promise<void> {
    const store = loadStore();
    store.pack_state = {
      last_opened_at: openedAt.toISOString(),
      next_available_at: nextAvailableAt.toISOString(),
    };
    saveStore(store);
  },
};
