import { useCallback, useState } from 'react';

import {
  applyTrade,
  applyTradeV2Acceptor,
} from '@/domain/trade/apply';
import { createTradeAck, createTradeAckV2, encodeTradeAck } from '@/domain/trade/ackCodec';
import { decodeTradePayload } from '@/domain/trade/codec';
import { getInitiatorOfferedIds } from '@/domain/trade/payloadHelpers';
import {
  validateAcceptorCounterIds,
  validateOfferAsAcceptor,
} from '@/domain/trade/validate';
import type { TradePayloadAny } from '@/domain/types';
import { AppConfigService } from '@/services/config/AppConfigService';
import { CollectionRepository } from '@/services/db/CollectionRepository';
import { EnabledAlbumRepository } from '@/services/db/EnabledAlbumRepository';
import { TradeLogRepository } from '@/services/db/TradeLogRepository';
import { getAlbumManifest } from '@/services/content/AlbumManifestStore';

export type AcceptResult =
  | { ok: true; payload: TradePayloadAny; encodedAck: string }
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

export function useTradeAccept() {
  const [isAccepting, setIsAccepting] = useState(false);
  const [preview, setPreview] = useState<TradePayloadAny | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [requiresConfirmation, setRequiresConfirmation] = useState(true);

  const loadConfig = useCallback(async () => {
    const config = await AppConfigService.getAppConfig();
    setRequiresConfirmation(config.tradeRequiresConfirmation !== false);
  }, []);

  const decode = useCallback((encoded: string) => {
    setError(null);
    void loadConfig();
    try {
      const payload = decodeTradePayload(encoded.trim());
      setPreview(payload);
      return payload;
    } catch {
      setError('INVALID_TRADE_PAYLOAD');
      setPreview(null);
      return null;
    }
  }, [loadConfig]);

  const confirm = useCallback(
    async (acceptorIds: string[] = []): Promise<AcceptResult> => {
      if (!preview) return { ok: false, reason: 'NO_PREVIEW' };
      setIsAccepting(true);
      setError(null);
      try {
        const collection = await CollectionRepository.getAllAsRows();
        const catalogIds = await buildCatalogStickerIds();

        if (preview.v === 2) {
          const validation = validateAcceptorCounterIds(
            preview,
            acceptorIds,
            collection,
            catalogIds,
          );
          if (!validation.valid) {
            setError(validation.reason);
            return { ok: false, reason: validation.reason };
          }

          const updated = applyTradeV2Acceptor(
            collection,
            preview.offeredIds,
            acceptorIds,
          );
          await CollectionRepository.saveAll(updated);

          const encodedAck = encodeTradeAck(
            createTradeAckV2(preview.offerId, acceptorIds),
          );
          await TradeLogRepository.append({
            id: preview.offerId,
            payload_json: JSON.stringify(preview),
            status: 'completed',
            created_at: new Date().toISOString(),
          });

          const result = { ok: true as const, payload: preview, encodedAck };
          setPreview(null);
          return result;
        }

        const validation = validateOfferAsAcceptor(preview, collection, catalogIds);
        if (!validation.valid) {
          setError(validation.reason);
          return { ok: false, reason: validation.reason };
        }

        const updated = applyTrade(collection, preview, 'acceptor');
        await CollectionRepository.saveAll(updated);

        await TradeLogRepository.append({
          id: preview.offerId,
          payload_json: JSON.stringify(preview),
          status: 'completed',
          created_at: new Date().toISOString(),
        });

        const encodedAck = encodeTradeAck(createTradeAck(preview.offerId));
        const result = { ok: true as const, payload: preview, encodedAck };
        setPreview(null);
        return result;
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'TRADE_ERROR';
        setError(msg);
        return { ok: false, reason: msg };
      } finally {
        setIsAccepting(false);
      }
    },
    [preview],
  );

  const offeredIds = preview ? getInitiatorOfferedIds(preview) : [];

  return {
    decode,
    confirm,
    preview,
    offeredIds,
    isAccepting,
    error,
    requiresConfirmation,
    clearPreview: () => setPreview(null),
  };
}
