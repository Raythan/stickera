import { useCallback, useState } from 'react';

import { applyTrade } from '@/domain/trade/apply';
import { decodeTradeAck } from '@/domain/trade/ackCodec';
import type { TradePayload } from '@/domain/types';
import { CollectionRepository } from '@/services/db/CollectionRepository';
import { TradeLogRepository } from '@/services/db/TradeLogRepository';

export type ConfirmResult =
  | { ok: true }
  | { ok: false; reason: string };

async function applyInitiatorTrade(offerId: string): Promise<ConfirmResult> {
  const entry = await TradeLogRepository.findByOfferId(offerId);
  if (!entry) return { ok: false, reason: 'OFFER_NOT_FOUND' };
  if (entry.status === 'completed') return { ok: false, reason: 'ALREADY_COMPLETED' };

  const payload: TradePayload = JSON.parse(entry.payload_json);
  const collection = await CollectionRepository.getAllAsRows();
  const updated = applyTrade(collection, payload, 'initiator');
  await CollectionRepository.saveAll(updated);
  await TradeLogRepository.updateStatus(offerId, 'completed');

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
      return await applyInitiatorTrade(ack.offerId);
    } catch {
      return { ok: false, reason: 'INVALID_TRADE_ACK' };
    } finally {
      setIsConfirming(false);
    }
  }, []);

  return { confirmByOfferId, confirmByAck, isConfirming };
}
