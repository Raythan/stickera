import { useCallback, useState } from 'react';

import { AdminActionsService } from '@/services/admin/AdminActionsService';

export function useAdminActions() {
  const [busy, setBusy] = useState(false);

  const run = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    setBusy(true);
    try {
      return await fn();
    } finally {
      setBusy(false);
    }
  }, []);

  return {
    busy,
    grantTradeTestKit: () => run(() => AdminActionsService.grantTradeTestKit(2)),
    resetPackCooldown: () => run(() => AdminActionsService.resetPackCooldown()),
    clearTradeLog: () => run(() => AdminActionsService.clearTradeLog()),
    grantSticker: (stickerId: string, qty: number) =>
      run(() => AdminActionsService.grantSticker(stickerId, qty)),
  };
}
