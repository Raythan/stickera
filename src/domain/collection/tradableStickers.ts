import type { CollectionRow } from '@/domain/types';

export function tradableStickers(rows: CollectionRow[]): string[] {
  return rows.filter((r) => r.quantity >= 2).map((r) => r.sticker_id);
}
