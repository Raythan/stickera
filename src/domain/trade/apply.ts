import type { CollectionRow } from '@/domain/types';

export function applyTradeBundle(
  collection: CollectionRow[],
  giveIds: string[],
  receiveIds: string[],
  now = new Date(),
): CollectionRow[] {
  const ts = now.toISOString();
  const map = new Map<string, CollectionRow>();
  for (const row of collection) {
    map.set(row.sticker_id, { ...row });
  }

  for (const stickerId of giveIds) {
    const row = map.get(stickerId);
    if (!row || row.quantity < 1) {
      throw new Error('TRADE_INSUFFICIENT_QTY');
    }
    map.set(stickerId, { ...row, quantity: row.quantity - 1, updated_at: ts });
  }

  for (const stickerId of receiveIds) {
    const existing = map.get(stickerId);
    if (existing) {
      map.set(stickerId, {
        ...existing,
        quantity: existing.quantity + 1,
        is_new: 0,
        updated_at: ts,
      });
    } else {
      const albumId = stickerId.split(':')[0];
      map.set(stickerId, {
        sticker_id: stickerId,
        album_id: albumId,
        quantity: 1,
        is_new: 1,
        first_obtained_at: ts,
        updated_at: ts,
      });
    }
  }

  return Array.from(map.values());
}

/** v1 single-pair apply */
export function applyTrade(
  collection: CollectionRow[],
  payload: import('@/domain/types').TradePayloadV1,
  role: 'initiator' | 'acceptor',
  now = new Date(),
): CollectionRow[] {
  const give = role === 'initiator' ? payload.offered.stickerId : payload.wanted.stickerId;
  const receive = role === 'initiator' ? payload.wanted.stickerId : payload.offered.stickerId;
  return applyTradeBundle(collection, [give], [receive], now);
}

export function applyTradeV2Acceptor(
  collection: CollectionRow[],
  offeredIds: string[],
  acceptorIds: string[],
  now = new Date(),
): CollectionRow[] {
  return applyTradeBundle(collection, acceptorIds, offeredIds, now);
}

export function applyTradeV2Initiator(
  collection: CollectionRow[],
  offeredIds: string[],
  acceptorIds: string[],
  now = new Date(),
): CollectionRow[] {
  return applyTradeBundle(collection, offeredIds, acceptorIds, now);
}

/** Gift accept: receive offeredIds only (no give). */
export function applyGiftAsAcceptor(
  collection: CollectionRow[],
  offeredIds: string[],
  now = new Date(),
): CollectionRow[] {
  return applyTradeBundle(collection, [], offeredIds, now);
}

/** Gift initiator sync: debit offeredIds only (no receive). */
export function applyGiftAsInitiator(
  collection: CollectionRow[],
  offeredIds: string[],
  now = new Date(),
): CollectionRow[] {
  return applyTradeBundle(collection, offeredIds, [], now);
}
