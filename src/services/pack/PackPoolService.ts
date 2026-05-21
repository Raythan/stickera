import { buildPool } from '@/domain/pack/buildPool';
import { drawStickers } from '@/domain/pack/drawStickers';
import type { StickerDef } from '@/domain/types';
import { getAlbumManifest } from '@/services/content/AlbumManifestStore';
import { AppConfigService } from '@/services/config/AppConfigService';
import { CollectionRepository } from '@/services/db/CollectionRepository';
import { EnabledAlbumRepository } from '@/services/db/EnabledAlbumRepository';

export type DrawResult = {
  stickers: StickerDef[];
  stickersPerPack: number;
};

export const PackPoolService = {
  async buildPoolAndDraw(): Promise<DrawResult> {
    const config = await AppConfigService.getAppConfig();
    const enabledIds = await EnabledAlbumRepository.listEnabledIds();

    if (enabledIds.length === 0) {
      throw new Error('NO_ENABLED_ALBUMS');
    }

    const manifests = (
      await Promise.all(enabledIds.map((id) => getAlbumManifest(id)))
    ).filter((m): m is NonNullable<typeof m> => m !== null);

    const allRows = await CollectionRepository.getAllAsRows();
    const ownedBySticker = new Map<string, number>();
    for (const row of allRows) {
      ownedBySticker.set(row.sticker_id, row.quantity);
    }

    const pool = buildPool(manifests, ownedBySticker);
    const stickers = drawStickers(pool, config.stickersPerPack);

    return { stickers, stickersPerPack: config.stickersPerPack };
  },
};
