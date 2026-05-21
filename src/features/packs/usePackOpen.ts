import { useCallback, useState } from 'react';

import { applyPackResults } from '@/domain/collection/applyPackResults';
import type { StickerDef } from '@/domain/types';
import { AppConfigService } from '@/services/config/AppConfigService';
import { CollectionRepository } from '@/services/db/CollectionRepository';
import { PackPoolService } from '@/services/pack/PackPoolService';
import { PackTimerService } from '@/services/pack/PackTimerService';

export type PackOpenResult =
  | { ok: true; stickers: StickerDef[] }
  | { ok: false; reason: 'cooldown' | 'poolTooSmall' | 'noEnabledAlbums' | 'error'; message?: string };

export function usePackOpen() {
  const [isOpening, setIsOpening] = useState(false);

  const openPack = useCallback(async (): Promise<PackOpenResult> => {
    setIsOpening(true);
    try {
      const ready = await PackTimerService.canOpen();
      if (!ready) return { ok: false, reason: 'cooldown' };

      const { stickers } = await PackPoolService.buildPoolAndDraw();

      const currentRows = await CollectionRepository.getAllAsRows();
      const updatedRows = applyPackResults(currentRows, stickers);
      await CollectionRepository.saveAll(updatedRows);

      const config = await AppConfigService.getAppConfig();
      await PackTimerService.recordOpen(config.packCooldown);

      return { ok: true, stickers };
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'UNKNOWN_ERROR';
      if (msg === 'PACK_POOL_TOO_SMALL') return { ok: false, reason: 'poolTooSmall' };
      if (msg === 'NO_ENABLED_ALBUMS') return { ok: false, reason: 'noEnabledAlbums' };
      return { ok: false, reason: 'error', message: msg };
    } finally {
      setIsOpening(false);
    }
  }, []);

  return { openPack, isOpening };
}
