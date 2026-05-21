import type { AlbumManifest, CollectionRow } from '@/domain/types';

export function setStickerQuantity(
  current: CollectionRow[],
  stickerId: string,
  quantity: number,
  now = new Date(),
): CollectionRow[] {
  const ts = now.toISOString();
  const albumId = stickerId.split(':')[0];
  const map = new Map<string, CollectionRow>();
  for (const row of current) {
    map.set(row.sticker_id, { ...row });
  }

  const existing = map.get(stickerId);
  if (existing) {
    map.set(stickerId, {
      ...existing,
      quantity: Math.max(0, quantity),
      updated_at: ts,
    });
  } else if (quantity > 0) {
    map.set(stickerId, {
      sticker_id: stickerId,
      album_id: albumId,
      quantity,
      is_new: 0,
      first_obtained_at: ts,
      updated_at: ts,
    });
  }

  return Array.from(map.values()).filter((r) => r.quantity > 0);
}

export function grantAllStickersQty(
  current: CollectionRow[],
  manifests: AlbumManifest[],
  quantity: number,
  now = new Date(),
): CollectionRow[] {
  let rows = current;
  for (const manifest of manifests) {
    for (const sticker of manifest.stickers) {
      rows = setStickerQuantity(rows, sticker.id, quantity, now);
    }
  }
  return rows;
}
