import { useCallback, useEffect, useState } from 'react';

import { tradableStickers } from '@/domain/collection/tradableStickers';
import { CollectionRepository } from '@/services/db/CollectionRepository';

export function useTradableStickers() {
  const [stickerIds, setStickerIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await CollectionRepository.getAllAsRows();
      setStickerIds(tradableStickers(rows));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { stickerIds, loading, reload };
}
