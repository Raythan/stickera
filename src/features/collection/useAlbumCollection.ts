import { useCallback, useEffect, useState } from 'react';

import type { StickerCollectionEntry } from '@/services/db/CollectionRepository';
import { CollectionRepository } from '@/services/db/CollectionRepository';

export function useAlbumCollection(albumId: string | null | undefined) {
  const [bySticker, setBySticker] = useState<Map<string, StickerCollectionEntry>>(new Map());
  const [ownedCount, setOwnedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!albumId) {
      setBySticker(new Map());
      setOwnedCount(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [map, owned] = await Promise.all([
        CollectionRepository.getByAlbumMap(albumId),
        CollectionRepository.countOwnedForAlbum(albumId),
      ]);
      setBySticker(map);
      setOwnedCount(owned);
    } finally {
      setLoading(false);
    }
  }, [albumId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const getEntry = useCallback(
    (stickerId: string): StickerCollectionEntry => {
      return bySticker.get(stickerId) ?? { quantity: 0, isNew: false };
    },
    [bySticker],
  );

  return { bySticker, ownedCount, loading, reload, getEntry };
}
