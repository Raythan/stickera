import { useCallback, useEffect, useState } from 'react';

import type { AlbumRow } from '@/domain/types';
import { AlbumRepository } from '@/services/db/AlbumRepository';

export function useAlbums() {
  const [albums, setAlbums] = useState<AlbumRow[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await AlbumRepository.listAll();
      setAlbums(rows);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { albums, loading, reload };
}
