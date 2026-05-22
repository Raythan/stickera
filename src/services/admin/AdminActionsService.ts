import { grantAllStickersQty, setStickerQuantity } from '@/domain/collection/grantStickers';
import { CollectionRepository } from '@/services/db/CollectionRepository';
import { EnabledAlbumRepository } from '@/services/db/EnabledAlbumRepository';
import { AppConfigService } from '@/services/config/AppConfigService';
import { PackAccumulationService } from '@/services/pack/PackAccumulationService';
import { TradeConsumedRepository } from '@/services/db/TradeConsumedRepository';
import { TradeLogRepository } from '@/services/db/TradeLogRepository';
import { getAlbumManifest } from '@/services/content/AlbumManifestStore';

export const AdminActionsService = {
  async grantSticker(stickerId: string, quantity: number): Promise<void> {
    const rows = await CollectionRepository.getAllAsRows();
    const updated = setStickerQuantity(rows, stickerId, quantity);
    await CollectionRepository.saveAll(updated);
  },

  async grantTradeTestKit(quantity = 2): Promise<number> {
    const enabledIds = await EnabledAlbumRepository.listEnabledIds();
    const manifests = (
      await Promise.all(enabledIds.map((id) => getAlbumManifest(id)))
    ).filter((m): m is NonNullable<typeof m> => m !== null);

    const rows = await CollectionRepository.getAllAsRows();
    const updated = grantAllStickersQty(rows, manifests, quantity);
    await CollectionRepository.saveAll(updated);

    return manifests.reduce((n, m) => n + m.stickers.length, 0);
  },

  async resetPackCooldown(): Promise<void> {
    const config = await AppConfigService.getAppConfig();
    await PackAccumulationService.fillToCapacity(config);
  },

  async clearTradeLog(): Promise<void> {
    await TradeLogRepository.clearAll();
    await TradeConsumedRepository.clearAll();
  },
};
