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
import { TradeConsumedRepository } from '@/services/db/TradeConsumedRepository';
import { TradeLogRepository } from '@/services/db/TradeLogRepository';
import { ProfileService } from '@/services/profile/ProfileService';
import {
  registerPartnerFromAck,
  registerPartnerFromPayload,
} from '@/services/trade/registerTradePartnerFromPayload';
import { claimOffer, getOfferStatus } from '@/services/trade/TradeRegistryClient';
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
  const [lastEncodedPayload, setLastEncodedPayload] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [requiresConfirmation, setRequiresConfirmation] = useState(true);

  const loadConfig = useCallback(async () => {
    const config = await AppConfigService.getAppConfig();
    setRequiresConfirmation(config.tradeRequiresConfirmation !== false);
  }, []);

  const decode = useCallback((encoded: string) => {
    setError(null);
    void (async () => {
      await loadConfig();
      try {
        const trimmed = encoded.trim();
        const payload = decodeTradePayload(trimmed);

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
        }

        await TradeLogRepository.upsertByOfferId({
          id: payload.offerId,
          payload_json: JSON.stringify(payload),
          encoded_payload: trimmed,
          role: 'acceptor',
          status: 'draft',
          created_at: new Date().toISOString(),
        });

        setPreview(payload);
        setLastEncodedPayload(trimmed);
      } catch {
        setError('INVALID_TRADE_PAYLOAD');
        setPreview(null);
        setLastEncodedPayload(null);
      }
    })();
  }, [loadConfig]);

  const confirm = useCallback(
    async (acceptorIds: string[] = []): Promise<AcceptResult> => {
      if (!preview) return { ok: false, reason: 'NO_PREVIEW' };
      if (await TradeConsumedRepository.isConsumed(preview.offerId)) {
        setError('OFFER_ALREADY_USED');
        return { ok: false, reason: 'OFFER_ALREADY_USED' };
      }

      setIsAccepting(true);
      setError(null);
      try {
        const claimResult = await claimOffer(preview.offerId);
        if (claimResult.ok === false) {
          if (claimResult.reason === 'already_consumed') {
            setError('OFFER_ALREADY_CLAIMED_GLOBALLY');
            return { ok: false, reason: 'OFFER_ALREADY_CLAIMED_GLOBALLY' };
          }
          if (claimResult.reason === 'expired') {
            setError('expired');
            return { ok: false, reason: 'expired' };
          }
          if (claimResult.reason === 'not_registered') {
            // Initiator did not register (offline create) — allow local-only trade
          } else if (claimResult.reason !== 'unavailable') {
            setError('REGISTRY_ERROR');
            return { ok: false, reason: 'REGISTRY_ERROR' };
          }
        }

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

          const acceptorProfileId = await ProfileService.getOrCreateProfileId();
          const encodedAck = encodeTradeAck(
            createTradeAckV2(preview.offerId, acceptorIds, { acceptorProfileId }),
          );

          await registerPartnerFromPayload(preview);

          await TradeLogRepository.upsertByOfferId({
            id: preview.offerId,
            payload_json: JSON.stringify(preview),
            encoded_payload: lastEncodedPayload ?? undefined,
            ack_encoded: encodedAck,
            counter_ids_json: JSON.stringify(acceptorIds),
            role: 'acceptor',
            status: 'completed',
            created_at: new Date().toISOString(),
          });
          await TradeConsumedRepository.markConsumed(preview.offerId);

          const result = { ok: true as const, payload: preview, encodedAck };
          setPreview(null);
          setLastEncodedPayload(null);
          return result;
        }

        const validation = validateOfferAsAcceptor(preview, collection, catalogIds);
        if (!validation.valid) {
          setError(validation.reason);
          return { ok: false, reason: validation.reason };
        }

        const updated = applyTrade(collection, preview, 'acceptor');
        await CollectionRepository.saveAll(updated);

        const encodedAck = encodeTradeAck(createTradeAck(preview.offerId));

        await registerPartnerFromPayload(preview);

        const counterIds = [preview.wanted.stickerId];
        await TradeLogRepository.upsertByOfferId({
          id: preview.offerId,
          payload_json: JSON.stringify(preview),
          encoded_payload: lastEncodedPayload ?? undefined,
          ack_encoded: encodedAck,
          counter_ids_json: JSON.stringify(counterIds),
          role: 'acceptor',
          status: 'completed',
          created_at: new Date().toISOString(),
        });
        await TradeConsumedRepository.markConsumed(preview.offerId);

        const result = { ok: true as const, payload: preview, encodedAck };
        setPreview(null);
        setLastEncodedPayload(null);
        return result;
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'TRADE_ERROR';
        setError(msg);
        return { ok: false, reason: msg };
      } finally {
        setIsAccepting(false);
      }
    },
    [preview, lastEncodedPayload],
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
    clearPreview: () => {
      setPreview(null);
      setLastEncodedPayload(null);
    },
  };
}
