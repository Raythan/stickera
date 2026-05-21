import { useCallback, useEffect, useState } from 'react';

import type { AlbumManifest } from '@/domain/types';
import { getAlbumManifest } from '@/services/content/AlbumManifestStore';

export function useAlbumManifest(albumId: string | undefined) {
  const [manifest, setManifest] = useState<AlbumManifest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!albumId) {
      setManifest(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const m = await getAlbumManifest(albumId);
      setManifest(m);
      if (!m) setError('ALBUM_NOT_FOUND');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'MANIFEST_ERROR');
      setManifest(null);
    } finally {
      setLoading(false);
    }
  }, [albumId]);

  useEffect(() => {
    void load();
  }, [load]);

  return { manifest, loading, error, reload: load };
}
