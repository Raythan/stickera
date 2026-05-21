import { useCallback, useState } from 'react';

import {
  applyTrade,
  applyTradeV2Initiator,
} from '@/domain/trade/apply';
import { decodeTradeAck } from '@/domain/trade/ackCodec';
import type { TradePayloadAny, TradePayloadV1 } from '@/domain/types';
import { CollectionRepository } from '@/services/db/CollectionRepository';
import { TradeConsumedRepository } from '@/services/db/TradeConsumedRepository';
import { TradeLogRepository } from '@/services/db/TradeLogRepository';

export type ConfirmResult =
  | { ok: true }
  | { ok: false; reason: string };

async function applyInitiatorTrade(
  offerId: string,
  ackEncoded?: string,
): Promise<ConfirmResult> {
  const entry = await TradeLogRepository.findByOfferId(offerId);
  if (!entry) return { ok: false, reason: 'OFFER_NOT_FOUND' };
  if (entry.status === 'completed') return { ok: false, reason: 'ALREADY_COMPLETED' };

  const payload = JSON.parse(entry.payload_json) as TradePayloadAny;
  const collection = await CollectionRepository.getAllAsRows();

  if (payload.v === 2) {
    if (!ackEncoded) return { ok: false, reason: 'NEEDS_V2_ACK' };
    const ack = decodeTradeAck(ackEncoded);
    if (ack.v !== 2 || ack.offerId !== offerId) {
      return { ok: false, reason: 'INVALID_TRADE_ACK' };
    }
    const updated = applyTradeV2Initiator(
      collection,
      payload.offeredIds,
      ack.acceptorIds,
    );
    await CollectionRepository.saveAll(updated);
    await TradeLogRepository.updateStatus(offerId, 'completed');
    if (ackEncoded) await TradeLogRepository.saveInitiatorAck(offerId, ackEncoded);
    await TradeConsumedRepository.markConsumed(offerId);
    return { ok: true };
  }

  const updated = applyTrade(collection, payload as TradePayloadV1, 'initiator');
  await CollectionRepository.saveAll(updated);
  await TradeLogRepository.updateStatus(offerId, 'completed');
  if (ackEncoded) await TradeLogRepository.saveInitiatorAck(offerId, ackEncoded);
  await TradeConsumedRepository.markConsumed(offerId);
  return { ok: true };
}

export function useTradeConfirm() {
  const [isConfirming, setIsConfirming] = useState(false);

  const confirmByOfferId = useCallback(async (offerId: string): Promise<ConfirmResult> => {
    setIsConfirming(true);
    try {
      return await applyInitiatorTrade(offerId);
    } catch (e) {
      return { ok: false, reason: e instanceof Error ? e.message : 'CONFIRM_ERROR' };
    } finally {
      setIsConfirming(false);
    }
  }, []);

  const confirmByAck = useCallback(async (encodedAck: string): Promise<ConfirmResult> => {
    setIsConfirming(true);
    try {
      const ack = decodeTradeAck(encodedAck);
      return await applyInitiatorTrade(ack.offerId, encodedAck);
    } catch {
      return { ok: false, reason: 'INVALID_TRADE_ACK' };
    } finally {
      setIsConfirming(false);
    }
  }, []);

  return { confirmByOfferId, confirmByAck, isConfirming };
}
