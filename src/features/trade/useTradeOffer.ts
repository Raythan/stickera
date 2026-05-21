import { useCallback, useState } from 'react';

import { encodeTradePayload } from '@/domain/trade/codec';
import { createTradePayload } from '@/domain/trade/createOffer';
import { validateOfferAsInitiator } from '@/domain/trade/validate';
import type { TradePayload } from '@/domain/types';
import { CollectionRepository } from '@/services/db/CollectionRepository';
import { EnabledAlbumRepository } from '@/services/db/EnabledAlbumRepository';
import { TradeLogRepository } from '@/services/db/TradeLogRepository';
import { getAlbumManifest } from '@/services/content/AlbumManifestStore';

export type TradeOfferResult =
  | { ok: true; payload: TradePayload; encoded: string }
  | { ok: false; reason: string };

async function buildCatalogStickerIds(): Promise<Set<string>> {
  const enabledIds = await EnabledAlbumRepository.listEnabledIds();
  const ids = new Set<string>();
  for (const albumId of enabledIds) {
    const manifest = await getAlbumManifest(albumId);
    if (!manifest) continue;
    for (const s of manifest.stickers) ids.add(s.id);
  }
  return ids;
}

export function useTradeOffer() {
  const [isCreating, setIsCreating] = useState(false);

  const createOffer = useCallback(
    async (opts: {
      offeredStickerId: string;
      wantedStickerId: string;
      fromDisplayName?: string;
    }): Promise<TradeOfferResult> => {
      setIsCreating(true);
      try {
        const payload = createTradePayload({
          offeredStickerId: opts.offeredStickerId,
          wantedStickerId: opts.wantedStickerId,
          fromDisplayName: opts.fromDisplayName,
        });

        const collection = await CollectionRepository.getAllAsRows();
        const catalogIds = await buildCatalogStickerIds();
        const validation = validateOfferAsInitiator(payload, collection, catalogIds);
        if (!validation.valid) {
          return { ok: false, reason: validation.reason };
        }

        const encoded = encodeTradePayload(payload);

        await TradeLogRepository.append({
          id: payload.offerId,
          payload_json: JSON.stringify(payload),
          status: 'sent',
          created_at: new Date().toISOString(),
        });

        return { ok: true, payload, encoded };
      } catch (e) {
        return { ok: false, reason: e instanceof Error ? e.message : 'UNKNOWN' };
      } finally {
        setIsCreating(false);
      }
    },
    [],
  );

  return { createOffer, isCreating };
}
