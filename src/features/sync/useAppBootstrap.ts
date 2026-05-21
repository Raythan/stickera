import { useCallback, useEffect, useState } from 'react';

import { clearAlbumManifestCache } from '@/services/content/AlbumManifestStore';
import { ContentSyncService } from '@/services/sync/ContentSyncService';

type BootstrapState = {
  ready: boolean;
  error: string | null;
  catalogVersion: string | null;
};

export function useAppBootstrap() {
  const [state, setState] = useState<BootstrapState>({
    ready: false,
    error: null,
    catalogVersion: null,
  });

  const run = useCallback(async () => {
    try {
      const result = await ContentSyncService.seedBundledIfNeeded();
      clearAlbumManifestCache();
      setState({
        ready: true,
        error: result.ok ? null : (result.message ?? 'BOOTSTRAP_FAILED'),
        catalogVersion: result.catalogVersion,
      });
    } catch (e) {
      setState({
        ready: true,
        error: e instanceof Error ? e.message : 'BOOTSTRAP_ERROR',
        catalogVersion: null,
      });
    }
  }, []);

  useEffect(() => {
    void run();
  }, [run]);

  return { ...state, retry: run };
}
