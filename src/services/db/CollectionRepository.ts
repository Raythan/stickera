import type { CollectionRow } from '@/domain/types';

import { getDatabase } from './client';

export const CollectionRepository = {
  async countOwnedForAlbum(albumId: string): Promise<number> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM collection WHERE album_id = ? AND quantity > 0',
      [albumId],
    );
    return row?.count ?? 0;
  },

  async listByAlbum(albumId: string): Promise<CollectionRow[]> {
    const db = await getDatabase();
    return db.getAllAsync<CollectionRow>(
      'SELECT sticker_id, album_id, quantity, is_new, first_obtained_at, updated_at FROM collection WHERE album_id = ?',
      [albumId],
    );
  },
};
