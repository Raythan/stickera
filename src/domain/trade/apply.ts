import type { CollectionRow, TradePayload } from '@/domain/types';

/**
 * Applies a trade to a collection.
 * - initiator: gives offered (-1), receives wanted (+1)
 * - acceptor: gives wanted (-1), receives offered (+1)
 * Returns a new array; does not mutate input.
 */
export function applyTrade(
  collection: CollectionRow[],
  payload: TradePayload,
  role: 'initiator' | 'acceptor',
  now = new Date(),
): CollectionRow[] {
  const give = role === 'initiator' ? payload.offered.stickerId : payload.wanted.stickerId;
  const receive = role === 'initiator' ? payload.wanted.stickerId : payload.offered.stickerId;
  const ts = now.toISOString();

  const map = new Map<string, CollectionRow>();
  for (const row of collection) {
    map.set(row.sticker_id, { ...row });
  }

  const giveRow = map.get(give);
  if (!giveRow || giveRow.quantity < 1) {
    throw new Error('TRADE_INSUFFICIENT_QTY');
  }
  map.set(give, { ...giveRow, quantity: giveRow.quantity - 1, updated_at: ts });

  const receiveRow = map.get(receive);
  if (receiveRow) {
    map.set(receive, { ...receiveRow, quantity: receiveRow.quantity + 1, updated_at: ts });
  } else {
    const albumId = receive.split(':')[0];
    map.set(receive, {
      sticker_id: receive,
      album_id: albumId,
      quantity: 1,
      is_new: 1,
      first_obtained_at: ts,
      updated_at: ts,
    });
  }

  return Array.from(map.values());
}
