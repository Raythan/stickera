import type { TradePayload } from '@/domain/types';

let counter = 0;

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  counter += 1;
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 10);
  return `${ts}-${rand}-${counter}`;
}

export function createTradePayload(opts: {
  offeredStickerId: string;
  wantedStickerId: string;
  fromDisplayName?: string;
  ttlMinutes?: number;
  now?: Date;
}): TradePayload {
  const now = opts.now ?? new Date();
  const ttl = (opts.ttlMinutes ?? 15) * 60_000;

  return {
    v: 1,
    offerId: generateUUID(),
    fromDisplayName: opts.fromDisplayName,
    offered: { stickerId: opts.offeredStickerId, quantity: 1 },
    wanted: { stickerId: opts.wantedStickerId, quantity: 1 },
    expiresAt: new Date(now.getTime() + ttl).toISOString(),
  };
}
