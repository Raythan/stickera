import { useCallback, useState } from 'react';

import { applyGiftAsAcceptor } from '@/domain/trade/apply';
import { decodeTradePayload } from '@/domain/trade/codec';
import { getInitiatorOfferedIds } from '@/domain/trade/payloadHelpers';
import { validateGiftAccept } from '@/domain/trade/validate';
import type { TradePayloadAny } from '@/domain/types';
import { CollectionRepository } from '@/services/db/CollectionRepository';
import { EnabledAlbumRepository } from '@/services/db/EnabledAlbumRepository';
import { TradeConsumedRepository } from '@/services/db/TradeConsumedRepository';
import { SettingsRepository } from '@/services/db/SettingsRepository';
import { TradeLogRepository } from '@/services/db/TradeLogRepository';
import { registerPartnerFromPayload } from '@/services/trade/registerTradePartnerFromPayload';
import {
  assertRegistryAvailable,
  claimOffer,
  getOfferStatus,
} from '@/services/trade/TradeRegistryClient';
import { getAlbumManifest } from '@/services/content/AlbumManifestStore';

export type AcceptResult =
  | { ok: true; payload: TradePayloadAny }
  | { ok: false; reason: string };

export type DecodeVia = 'paste' | 'scan';

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

function mapClaimError(reason: string): string {
  if (reason === 'already_consumed') return 'OFFER_ALREADY_CLAIMED_GLOBALLY';
  if (reason === 'expired') return 'expired';
  if (reason === 'not_registered') return 'REGISTRY_NOT_REGISTERED';
  if (reason === 'not_configured') return 'REGISTRY_NOT_CONFIGURED';
  return 'REGISTRY_UNAVAILABLE';
}

export function useTradeAccept() {
  const [isAccepting, setIsAccepting] = useState(false);
  const [preview, setPreview] = useState<TradePayloadAny | null>(null);
  const [lastEncodedPayload, setLastEncodedPayload] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [acceptSuccess, setAcceptSuccess] = useState(false);

  const applyAccepted = useCallback(
    async (payload: TradePayloadAny, encodedPayload: string | null): Promise<AcceptResult> => {
      const registryCheck = await assertRegistryAvailable(true);
      if (!registryCheck.ok) {
        const reason =
          registryCheck.reason === 'not_configured'
            ? 'REGISTRY_NOT_CONFIGURED'
            : 'REGISTRY_UNAVAILABLE';
        setError(reason);
        return { ok: false, reason };
      }

      const claimResult = await claimOffer(payload.offerId);
      if (!claimResult.ok) {
        const reason = mapClaimError(claimResult.reason);
        setError(reason);
        return { ok: false, reason };
      }

      const catalogIds = await buildCatalogStickerIds();
      const localContentVersion = await SettingsRepository.getContentVersion();
      const validation = validateGiftAccept(payload, catalogIds, localContentVersion);
      if (!validation.valid) {
        setError(validation.reason);
        return { ok: false, reason: validation.reason };
      }

      const offeredIds = getInitiatorOfferedIds(payload);
      const collection = await CollectionRepository.getAllAsRows();
      const updated = applyGiftAsAcceptor(collection, offeredIds);
      await CollectionRepository.saveAll(updated);

      await registerPartnerFromPayload(payload);

      await TradeLogRepository.upsertByOfferId({
        id: payload.offerId,
        payload_json: JSON.stringify(payload),
        encoded_payload: encodedPayload ?? undefined,
        role: 'acceptor',
        status: 'completed',
        created_at: new Date().toISOString(),
      });
      await TradeConsumedRepository.markConsumed(payload.offerId);

      setPreview(null);
      setLastEncodedPayload(null);
      setAcceptSuccess(true);
      return { ok: true, payload };
    },
    [],
  );

  const decode = useCallback(
    (encoded: string, opts?: { via?: DecodeVia }) => {
      setError(null);
      setAcceptSuccess(false);
      void (async () => {
        const registryCheck = await assertRegistryAvailable(true);
        if (!registryCheck.ok) {
          setError(
            registryCheck.reason === 'not_configured'
              ? 'REGISTRY_NOT_CONFIGURED'
              : 'REGISTRY_UNAVAILABLE',
          );
          setPreview(null);
          setLastEncodedPayload(null);
          return;
        }

        try {
          const trimmed = encoded.trim();
          const payload = decodeTradePayload(trimmed);
          const localContentVersion = await SettingsRepository.getContentVersion();
          const catalogIds = await buildCatalogStickerIds();

          const validation = validateGiftAccept(payload, catalogIds, localContentVersion);
          if (!validation.valid) {
            setError(validation.reason);
            setPreview(null);
            setLastEncodedPayload(null);
            return;
          }

          if (await TradeConsumedRepository.isConsumed(payload.offerId)) {
            setError('OFFER_ALREADY_USED');
            setPreview(null);
            setLastEncodedPayload(null);
            return;
          }
          if (await TradeLogRepository.isOwnSentOffer(payload.offerId)) {
            setError('OWN_OFFER');
            setPreview(null);
            setLastEncodedPayload(null);
            return;
          }

          const remoteStatus = await getOfferStatus(payload.offerId);
          if (remoteStatus.ok) {
            if (remoteStatus.status === 'consumed') {
              setError('OFFER_ALREADY_CLAIMED_GLOBALLY');
              setPreview(null);
              setLastEncodedPayload(null);
              return;
            }
            if (remoteStatus.status === 'expired') {
              setError('expired');
              setPreview(null);
              setLastEncodedPayload(null);
              return;
            }
          } else if (remoteStatus.reason === 'not_configured') {
            setError('REGISTRY_NOT_CONFIGURED');
            setPreview(null);
            setLastEncodedPayload(null);
            return;
          } else if (remoteStatus.reason === 'unavailable') {
            setError('REGISTRY_UNAVAILABLE');
            setPreview(null);
            setLastEncodedPayload(null);
            return;
          }

          if (opts?.via === 'scan') {
            setIsAccepting(true);
            try {
              await applyAccepted(payload, trimmed);
            } finally {
              setIsAccepting(false);
            }
            return;
          }

          setPreview(payload);
          setLastEncodedPayload(trimmed);
        } catch {
          setError('INVALID_TRADE_PAYLOAD');
          setPreview(null);
          setLastEncodedPayload(null);
        }
      })();
    },
    [applyAccepted],
  );

  const confirm = useCallback(async (): Promise<AcceptResult> => {
    if (!preview) return { ok: false, reason: 'NO_PREVIEW' };
    if (await TradeConsumedRepository.isConsumed(preview.offerId)) {
      setError('OFFER_ALREADY_USED');
      return { ok: false, reason: 'OFFER_ALREADY_USED' };
    }

    setIsAccepting(true);
    setError(null);
    setAcceptSuccess(false);
    try {
      return await applyAccepted(preview, lastEncodedPayload);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'TRADE_ERROR';
      setError(msg);
      return { ok: false, reason: msg };
    } finally {
      setIsAccepting(false);
    }
  }, [preview, lastEncodedPayload, applyAccepted]);

  const offeredIds = preview ? getInitiatorOfferedIds(preview) : [];

  const clearPreview = useCallback(() => {
    setPreview(null);
    setLastEncodedPayload(null);
    setError(null);
    setAcceptSuccess(false);
  }, []);

  const resetSuccess = useCallback(() => setAcceptSuccess(false), []);

  return {
    decode,
    confirm,
    preview,
    offeredIds,
    isAccepting,
    error,
    acceptSuccess,
    clearPreview,
    resetSuccess,
  };
}
