import type { StickerDef } from '@/domain/types';

/**
 * Fisher-Yates shuffle sample without replacement on sticker ID.
 * Guarantees no duplicate sticker IDs in the returned array.
 * Throws if count > number of unique stickers in pool.
 */
export function drawStickers(pool: StickerDef[], count: number): StickerDef[] {
  const uniqueById = new Map<string, StickerDef>();
  for (const s of pool) {
    if (!uniqueById.has(s.id)) uniqueById.set(s.id, s);
  }

  const unique = Array.from(uniqueById.values());
  if (count > unique.length) {
    throw new Error('PACK_POOL_TOO_SMALL');
  }

  // Fisher-Yates on the unique array
  for (let i = unique.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [unique[i], unique[j]] = [unique[j], unique[i]];
  }

  return unique.slice(0, count);
}
