import { useCallback, useEffect, useState } from 'react';

import { isRemoteCatalogNewer } from '@/domain/catalog/compareCatalogVersion';
import { parseCatalog } from '@/domain/validators/catalog';
import { getContentBaseUrl } from '@/config/contentBase';
import { clearAlbumManifestCache } from '@/services/content/AlbumManifestStore';
import { SettingsRepository } from '@/services/db/SettingsRepository';
import { ContentSyncService } from '@/services/sync/ContentSyncService';

async function fetchRemoteCatalogVersion(): Promise<string | null> {
  const base = getContentBaseUrl();
  if (!base) return null;
  try {
    const res = await fetch(`${base}/catalog.json`);
    if (!res.ok) return null;
    const catalog = parseCatalog(await res.json());
    return catalog.version;
  } catch {
    return null;
  }
}

export function useCatalogUpdateAvailable() {
  const [localVersion, setLocalVersion] = useState<string | null>(null);
  const [remoteVersion, setRemoteVersion] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const refresh = useCallback(async () => {
    const local = await SettingsRepository.getContentVersion();
    const remote = await fetchRemoteCatalogVersion();
    setLocalVersion(local);
    setRemoteVersion(remote);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const updateAvailable =
    remoteVersion !== null && isRemoteCatalogNewer(remoteVersion, localVersion);

  const sync = useCallback(async () => {
    setSyncing(true);
    try {
      const result = await ContentSyncService.syncFromRemote();
      clearAlbumManifestCache();
      await refresh();
      return result;
    } finally {
      setSyncing(false);
    }
  }, [refresh]);

  return {
    localVersion,
    remoteVersion,
    updateAvailable,
    syncing,
    refresh,
    sync,
  };
}
