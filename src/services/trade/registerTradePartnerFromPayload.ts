import type { TradeAckAny, TradePayloadAny } from '@/domain/types';

import { TradePartnerService } from './TradePartnerService';

export async function registerPartnerFromPayload(payload: TradePayloadAny): Promise<void> {
  await TradePartnerService.registerPartner(payload.fromProfileId);
}

export async function registerPartnerFromAck(ack: TradeAckAny): Promise<void> {
  if (ack.v === 2) {
    await TradePartnerService.registerPartner(ack.acceptorProfileId);
  }
}
