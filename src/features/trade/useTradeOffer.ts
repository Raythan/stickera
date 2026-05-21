import { useCallback, useState } from 'react';

import { encodeTradePayload } from '@/domain/trade/codec';
import { createTradePayload } from '@/domain/trade/createOffer';
import type { TradePayload } from '@/domain/types';
import { TradeLogRepository } from '@/services/db/TradeLogRepository';

export type TradeOfferResult =
  | { ok: true; payload: TradePayload; encoded: string }
  | { ok: false; reason: string };

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
        const payload = createTradePayload(opts);
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
