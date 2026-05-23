import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import { CollectionRepository } from '@/services/db/CollectionRepository';

/** Clears is_new flags when the user opens/focuses the album detail screen. */
export function useMarkAlbumViewed(
  albumId: string | null | undefined,
  onCleared?: () => void,
) {
  useFocusEffect(
    useCallback(() => {
      if (!albumId) return;
      let cancelled = false;
      void (async () => {
        await CollectionRepository.clearNewFlagsForAlbum(albumId);
        if (!cancelled) {
          onCleared?.();
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [albumId, onCleared]),
  );
}
