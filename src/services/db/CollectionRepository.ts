import type { CollectionRow } from '@/domain/types';

import { loadStore } from './localStore';

export const CollectionRepository = {
  async countOwnedForAlbum(albumId: string): Promise<number> {
    const store = loadStore();
    return store.collection.filter((c) => c.album_id === albumId && c.quantity > 0).length;
  },

  async listByAlbum(albumId: string): Promise<CollectionRow[]> {
    const store = loadStore();
    return store.collection.filter((c) => c.album_id === albumId);
  },
};
