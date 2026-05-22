import { useCallback, useEffect, useState } from 'react';

import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  SETTINGS_KEYS,
  SettingsRepository,
} from '@/services/db/SettingsRepository';

export type PageSizeScope = 'albums' | 'stickers';

const KEY_BY_SCOPE = {
  albums: SETTINGS_KEYS.albumListPageSize,
  stickers: SETTINGS_KEYS.stickerGridPageSize,
} as const;

const OPTIONS_BY_SCOPE = {
  albums: PAGE_SIZE_OPTIONS.albums,
  stickers: PAGE_SIZE_OPTIONS.stickers,
} as const;

function parseStored(value: string | null, scope: PageSizeScope): number {
  const options = OPTIONS_BY_SCOPE[scope];
  const fallback = DEFAULT_PAGE_SIZE[scope];
  const n = value ? parseInt(value, 10) : NaN;
  if (!Number.isFinite(n)) return fallback;
  return (options as readonly number[]).includes(n) ? n : fallback;
}

export function usePageSizePreference(scope: PageSizeScope) {
  const options = OPTIONS_BY_SCOPE[scope];
  const [pageSize, setPageSizeState] = useState(DEFAULT_PAGE_SIZE[scope]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void SettingsRepository.get(KEY_BY_SCOPE[scope]).then((stored) => {
      if (!cancelled) {
        setPageSizeState(parseStored(stored, scope));
        setReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [scope]);

  const setPageSize = useCallback(
    (next: number) => {
      const clamped = parseStored(String(next), scope);
      setPageSizeState(clamped);
      void SettingsRepository.set(KEY_BY_SCOPE[scope], String(clamped));
    },
    [scope],
  );

  return { pageSize, setPageSize, options, ready };
}
