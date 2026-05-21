import { useCallback, useState } from 'react';

import type { SyncResult } from '@/domain/types';
import { clearAlbumManifestCache } from '@/services/content/AlbumManifestStore';
import { ContentSyncService } from '@/services/sync/ContentSyncService';

export function useContentSync() {
  const [syncing, setSyncing] = useState(false);
  const [lastResult, setLastResult] = useState<SyncResult | null>(null);

  const sync = useCallback(async () => {
    setSyncing(true);
    try {
      const result = await ContentSyncService.syncFromRemote();
      clearAlbumManifestCache();
      setLastResult(result);
      return result;
    } finally {
      setSyncing(false);
    }
  }, []);

  return { sync, syncing, lastResult };
}
