import type { TradePayloadAny, TradePayloadV1, TradePayloadV2 } from '@/domain/types';

export function isPayloadV2(payload: TradePayloadAny): payload is TradePayloadV2 {
  return payload.v === 2;
}

export function getInitiatorOfferedIds(payload: TradePayloadAny): string[] {
  if (payload.v === 2) return payload.offeredIds;
  return [payload.offered.stickerId];
}

export function getAcceptorGiveIdsV1(payload: TradePayloadV1): string[] {
  return [payload.wanted.stickerId];
}
