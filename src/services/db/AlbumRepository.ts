import type { AlbumManifest, AlbumRow } from '@/domain/types';

import { loadStore, saveStore } from './localStore';

export const AlbumRepository = {
  async upsertFromManifest(manifest: AlbumManifest, coverUri: string | null): Promise<void> {
    const store = loadStore();
    const row: AlbumRow = {
      id: manifest.id,
      revision: manifest.revision,
      total_stickers: manifest.totalStickers,
      name_key: manifest.nameKey ?? manifest.id,
      cover_uri: coverUri,
      pack_weight: manifest.packWeight ?? 1,
    };

    const idx = store.albums.findIndex((a) => a.id === manifest.id);
    if (idx >= 0) {
      store.albums[idx] = row;
    } else {
      store.albums.push(row);
    }

    if (!(manifest.id in store.enabled_albums)) {
      store.enabled_albums[manifest.id] = true;
    }

    saveStore(store);
  },

  async listAll(): Promise<AlbumRow[]> {
    const store = loadStore();
    return store.albums.slice().sort((a, b) => a.id.localeCompare(b.id));
  },

  async getById(id: string): Promise<AlbumRow | null> {
    const store = loadStore();
    return store.albums.find((a) => a.id === id) ?? null;
  },
};
