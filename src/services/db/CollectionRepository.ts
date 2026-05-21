import type { CollectionRow } from '@/domain/types';

import { loadStore } from './localStore';

export type StickerCollectionEntry = {
  quantity: number;
  isNew: boolean;
};

export const CollectionRepository = {
  async countOwnedForAlbum(albumId: string): Promise<number> {
    const store = loadStore();
    return store.collection.filter((c) => c.album_id === albumId && c.quantity > 0).length;
  },

  async listByAlbum(albumId: string): Promise<CollectionRow[]> {
    const store = loadStore();
    return store.collection.filter((c) => c.album_id === albumId);
  },

  async getQuantity(albumId: string, stickerId: string): Promise<number> {
    const store = loadStore();
    const row = store.collection.find(
      (c) => c.album_id === albumId && c.sticker_id === stickerId,
    );
    return row?.quantity ?? 0;
  },

  async getByAlbumMap(albumId: string): Promise<Map<string, StickerCollectionEntry>> {
    const store = loadStore();
    const map = new Map<string, StickerCollectionEntry>();
    for (const row of store.collection) {
      if (row.album_id !== albumId) continue;
      map.set(row.sticker_id, {
        quantity: row.quantity,
        isNew: row.is_new === 1,
      });
    }
    return map;
  },
};
