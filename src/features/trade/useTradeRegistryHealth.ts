import { useCallback, useEffect, useState } from 'react';

import {
  isTradeRegistryConfigured,
  pingRegistry,
} from '@/services/trade/TradeRegistryClient';

export function useTradeRegistryHealth() {
  const configured = isTradeRegistryConfigured();
  const [online, setOnline] = useState<boolean | null>(null);

  const check = useCallback(async () => {
    if (!configured) {
      setOnline(null);
      return;
    }
    setOnline(await pingRegistry());
  }, [configured]);

  useEffect(() => {
    void check();
  }, [check]);

  return { configured, online, recheck: check };
}
