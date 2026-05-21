import { useCallback, useEffect, useState } from 'react';

import type { AlbumRow } from '@/domain/types';
import { CollectionRepository } from '@/services/db/CollectionRepository';

export type AlbumProgress = {
  albumId: string;
  owned: number;
};

export function useAlbumProgress(albums: AlbumRow[]) {
  const [progressById, setProgressById] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  const reload = useCallback(async () => {
    if (albums.length === 0) {
      setProgressById({});
      return;
    }
    setLoading(true);
    try {
      const entries = await Promise.all(
        albums.map(async (album) => {
          const owned = await CollectionRepository.countOwnedForAlbum(album.id);
          return [album.id, owned] as const;
        }),
      );
      setProgressById(Object.fromEntries(entries));
    } finally {
      setLoading(false);
    }
  }, [albums]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const getOwned = useCallback(
    (albumId: string) => progressById[albumId] ?? 0,
    [progressById],
  );

  return { progressById, loading, reload, getOwned };
}
