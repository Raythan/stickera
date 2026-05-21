import { useCallback, useState } from 'react';

import { applyTrade } from '@/domain/trade/apply';
import { decodeTradePayload } from '@/domain/trade/codec';
import { validateTradePayload } from '@/domain/trade/validate';
import type { TradePayload } from '@/domain/types';
import { CollectionRepository } from '@/services/db/CollectionRepository';
import { EnabledAlbumRepository } from '@/services/db/EnabledAlbumRepository';
import { TradeLogRepository } from '@/services/db/TradeLogRepository';
import { getAlbumManifest } from '@/services/content/AlbumManifestStore';

export type AcceptResult =
  | { ok: true; payload: TradePayload }
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
  const [preview, setPreview] = useState<TradePayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const decode = useCallback((encoded: string) => {
    setError(null);
    try {
      const payload = decodeTradePayload(encoded.trim());
      setPreview(payload);
      return payload;
    } catch {
      setError('INVALID_TRADE_PAYLOAD');
      setPreview(null);
      return null;
    }
  }, []);

  const confirm = useCallback(async (): Promise<AcceptResult> => {
    if (!preview) return { ok: false, reason: 'NO_PREVIEW' };
    setIsAccepting(true);
    setError(null);
    try {
      const collection = await CollectionRepository.getAllAsRows();
      const catalogIds = await buildCatalogStickerIds();

      const validation = validateTradePayload(preview, collection, catalogIds);
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

      const result = { ok: true as const, payload: preview };
      setPreview(null);
      return result;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'TRADE_ERROR';
      setError(msg);
      return { ok: false, reason: msg };
    } finally {
      setIsAccepting(false);
    }
  }, [preview]);

  return { decode, confirm, preview, isAccepting, error, clearPreview: () => setPreview(null) };
}
