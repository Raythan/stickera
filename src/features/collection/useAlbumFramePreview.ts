import { useCallback, useEffect, useState } from 'react';

import { loadAlbumFrameCss } from '@/services/content/AlbumFrameStyleLoader';

export function useAlbumFramePreview(
  albumId: string | null,
  frameStylePath = 'frame.css',
) {
  const [css, setCss] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!albumId) return;
    setLoading(true);
    setError(null);
    try {
      const text = await loadAlbumFrameCss(albumId, frameStylePath);
      setCss(text);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'FRAME_LOAD_ERROR');
      setCss(null);
    } finally {
      setLoading(false);
    }
  }, [albumId, frameStylePath]);

  useEffect(() => {
    void load();
  }, [load]);

  return { css, loading, error, reload: load };
}
