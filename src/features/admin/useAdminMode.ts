import { useCallback, useEffect, useState } from 'react';

import { AdminService } from '@/services/admin/AdminService';

export function useAdminMode() {
  const [enabled, setEnabled] = useState(false);
  const [configured, setConfigured] = useState(false);
  const [unlockError, setUnlockError] = useState(false);

  const refresh = useCallback(async () => {
    setEnabled(await AdminService.isEnabled());
    setConfigured(AdminService.hasUnlockConfigured());
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const unlock = useCallback(
    async (code: string) => {
      setUnlockError(false);
      const ok = await AdminService.unlock(code);
      if (!ok) setUnlockError(true);
      await refresh();
      return ok;
    },
    [refresh],
  );

  const lock = useCallback(async () => {
    await AdminService.lock();
    await refresh();
  }, [refresh]);

  return { enabled, configured, unlockError, unlock, lock, refresh };
}
