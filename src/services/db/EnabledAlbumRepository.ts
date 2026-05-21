import { loadStore, saveStore } from './localStore';

export const EnabledAlbumRepository = {
  async isEnabled(albumId: string): Promise<boolean> {
    const store = loadStore();
    const value = store.enabled_albums[albumId];
    return value === undefined ? true : value;
  },

  async setEnabled(albumId: string, enabled: boolean): Promise<void> {
    const store = loadStore();
    store.enabled_albums[albumId] = enabled;
    saveStore(store);
  },

  async listEnabledIds(): Promise<string[]> {
    const store = loadStore();
    return store.albums
      .filter((a) => {
        const value = store.enabled_albums[a.id];
        return value === undefined ? true : value;
      })
      .map((a) => a.id);
  },
};
