import { loadStore, saveStore } from './localStore';

export const PackStateRepository = {
  async ensureInitialized(): Promise<void> {
    const store = loadStore();
    if (!store.pack_state) {
      store.pack_state = { last_opened_at: null, next_available_at: null };
      saveStore(store);
    }
  },
};
