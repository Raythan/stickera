import { useCallback, useEffect, useRef, useState } from 'react';

import { applyGiftAsInitiator } from '@/domain/trade/apply';
import { getInitiatorOfferedIds } from '@/domain/trade/payloadHelpers';
import { validateInitiatorOfferIds } from '@/domain/trade/validate';
import type { TradeLogEntry, TradePayloadAny } from '@/domain/types';
import { CollectionRepository } from '@/services/db/CollectionRepository';
import { EnabledAlbumRepository } from '@/services/db/EnabledAlbumRepository';
import { TradeConsumedRepository } from '@/services/db/TradeConsumedRepository';
import { TradeLogRepository } from '@/services/db/TradeLogRepository';
import { registerPartnerFromPayload } from '@/services/trade/registerTradePartnerFromPayload';
import {
  getOfferStatus,
  isTradeRegistryConfigured,
} from '@/services/trade/TradeRegistryClient';
import { getAlbumManifest } from '@/services/content/AlbumManifestStore';

const POLL_MS = 4000;

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

async function syncOneSentOffer(entry: TradeLogEntry): Promise<boolean> {
  let payload: TradePayloadAny;
  try {
    payload = JSON.parse(entry.payload_json) as TradePayloadAny;
  } catch {
    return false;
  }

  if (payload.v !== 2) return false;

  if (await TradeConsumedRepository.isConsumed(payload.offerId)) {
    await TradeLogRepository.updateStatus(payload.offerId, 'completed');
    return false;
  }

  const statusResult = await getOfferStatus(payload.offerId);
  if (!statusResult.ok || statusResult.status !== 'consumed') {
    return false;
  }

  const offeredIds = getInitiatorOfferedIds(payload);
  const collection = await CollectionRepository.getAllAsRows();
  const catalogIds = await buildCatalogStickerIds();
  const validation = validateInitiatorOfferIds(
    offeredIds,
    collection,
    catalogIds,
    payload.expiresAt,
  );
  if (!validation.valid) {
    return false;
  }

  try {
    const updated = applyGiftAsInitiator(collection, offeredIds);
    await CollectionRepository.saveAll(updated);
    await TradeLogRepository.updateStatus(payload.offerId, 'completed');
    await TradeConsumedRepository.markConsumed(payload.offerId);
    await registerPartnerFromPayload(payload);
    return true;
  } catch {
    return false;
  }
}

export function useTradeInitiatorSync(enabled: boolean, onSynced?: () => void) {
  const [syncing, setSyncing] = useState(false);
  const onSyncedRef = useRef(onSynced);
  onSyncedRef.current = onSynced;

  const runSync = useCallback(async () => {
    if (!isTradeRegistryConfigured()) return;
    setSyncing(true);
    try {
      const sent = await TradeLogRepository.listSentOffers();
      let anyApplied = false;
      for (const entry of sent) {
        const applied = await syncOneSentOffer(entry);
        if (applied) anyApplied = true;
      }
      if (anyApplied) {
        onSyncedRef.current?.();
      }
    } finally {
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled || !isTradeRegistryConfigured()) return;

    void runSync();
    const id = setInterval(() => void runSync(), POLL_MS);
    return () => clearInterval(id);
  }, [enabled, runSync]);

  return { syncing, runSync };
}
