import type { AlbumManifest, AlbumRow } from '@/domain/types';

import { getDatabase } from './client';

export const AlbumRepository = {
  async upsertFromManifest(manifest: AlbumManifest, coverUri: string | null): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO albums (id, revision, total_stickers, name_key, cover_uri, pack_weight)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         revision = excluded.revision,
         total_stickers = excluded.total_stickers,
         name_key = excluded.name_key,
         cover_uri = excluded.cover_uri,
         pack_weight = excluded.pack_weight`,
      [
        manifest.id,
        manifest.revision,
        manifest.totalStickers,
        manifest.nameKey ?? manifest.id,
        coverUri,
        manifest.packWeight ?? 1,
      ],
    );
    await db.runAsync(
      `INSERT INTO enabled_albums (album_id, enabled) VALUES (?, 1)
       ON CONFLICT(album_id) DO NOTHING`,
      [manifest.id],
    );
  },

  async listAll(): Promise<AlbumRow[]> {
    const db = await getDatabase();
    return db.getAllAsync<AlbumRow>(
      'SELECT id, revision, total_stickers, name_key, cover_uri, pack_weight FROM albums ORDER BY id',
    );
  },

  async getById(id: string): Promise<AlbumRow | null> {
    const db = await getDatabase();
    return db.getFirstAsync<AlbumRow>(
      'SELECT id, revision, total_stickers, name_key, cover_uri, pack_weight FROM albums WHERE id = ?',
      [id],
    );
  },
};
