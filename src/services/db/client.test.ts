import { loadStore, saveStore, resetStore } from './localStore';

const mockStorage: Record<string, string> = {};

beforeEach(() => {
  Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (key: string) => mockStorage[key] ?? null,
      setItem: (key: string, val: string) => { mockStorage[key] = val; },
      removeItem: (key: string) => { delete mockStorage[key]; },
    },
    writable: true,
  });
});

describe('localStore', () => {
  it('returns default store when nothing is persisted', () => {
    const store = loadStore();
    expect(store.schemaVersion).toBe(1);
    expect(store.albums).toEqual([]);
    expect(store.settings).toEqual({});
  });

  it('persists and loads data', () => {
    const store = loadStore();
    store.settings['locale'] = 'pt';
    saveStore(store);

    const loaded = loadStore();
    expect(loaded.settings['locale']).toBe('pt');
  });

  it('resetStore clears storage', () => {
    const store = loadStore();
    store.settings['foo'] = 'bar';
    saveStore(store);
    resetStore();
    const fresh = loadStore();
    expect(fresh.settings).toEqual({});
  });
});
