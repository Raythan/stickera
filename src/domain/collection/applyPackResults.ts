import type { CollectionRow, StickerDef } from '@/domain/types';

/**
 * Merges drawn stickers into existing collection rows.
 * - First obtain: quantity=1, is_new=1, first_obtained_at set.
 * - Subsequent (duplicate): quantity++, is_new=0, updated_at refreshed.
 * Returns a new array (does not mutate input).
 */
export function applyPackResults(
  current: CollectionRow[],
  drawn: StickerDef[],
  now?: Date,
): CollectionRow[] {
  const ts = (now ?? new Date()).toISOString();
  const map = new Map<string, CollectionRow>();
  for (const row of current) {
    map.set(row.sticker_id, { ...row });
  }

  for (const sticker of drawn) {
    const albumId = sticker.id.split(':')[0];
    const existing = map.get(sticker.id);

    if (existing) {
      map.set(sticker.id, {
        ...existing,
        quantity: existing.quantity + 1,
        is_new: 0,
        updated_at: ts,
      });
    } else {
      map.set(sticker.id, {
        sticker_id: sticker.id,
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
