import { useCallback, useEffect, useState } from 'react';

import type { TradableStickerItem } from '@/domain/types';

import { buildTradableStickerItems } from './tradableStickerItems';

export function useTradableStickerItems() {
  const [items, setItems] = useState<TradableStickerItem[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await buildTradableStickerItems());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { items, loading, reload };
}
