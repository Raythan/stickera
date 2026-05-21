import { useCallback, useEffect, useState } from 'react';

import type { AlbumRow } from '@/domain/types';
import { AlbumRepository } from '@/services/db/AlbumRepository';
import { EnabledAlbumRepository } from '@/services/db/EnabledAlbumRepository';

export type AlbumEnabledState = {
  album: AlbumRow;
  enabled: boolean;
};

export function useEnabledAlbums() {
  const [items, setItems] = useState<AlbumEnabledState[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const albums = await AlbumRepository.listAll();
      const states = await Promise.all(
        albums.map(async (album) => ({
          album,
          enabled: await EnabledAlbumRepository.isEnabled(album.id),
        })),
      );
      setItems(states);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const toggle = useCallback(
    async (albumId: string, enabled: boolean) => {
      await EnabledAlbumRepository.setEnabled(albumId, enabled);
      setItems((prev) =>
        prev.map((item) =>
          item.album.id === albumId ? { ...item, enabled } : item,
        ),
      );
    },
    [],
  );

  return { items, loading, reload, toggle };
}
