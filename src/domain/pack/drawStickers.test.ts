import { describe, expect, it } from '@jest/globals';

import type { StickerDef } from '@/domain/types';

import { drawStickers } from './drawStickers';

function makePool(count: number): StickerDef[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `album:${i + 1}`,
    number: i + 1,
  }));
}

describe('drawStickers', () => {
  it('returns the requested number of stickers', () => {
    const result = drawStickers(makePool(10), 3);
    expect(result).toHaveLength(3);
  });

  it('returns unique IDs (no duplicates in one draw)', () => {
    const result = drawStickers(makePool(10), 5);
    const ids = result.map((s) => s.id);
    expect(new Set(ids).size).toBe(5);
  });

  it('deduplicates weighted pool entries before drawing', () => {
    const base = makePool(4);
    const weighted = [...base, ...base, ...base]; // 12 entries, 4 unique
    const result = drawStickers(weighted, 4);
    const ids = result.map((s) => s.id);
    expect(new Set(ids).size).toBe(4);
  });

  it('throws PACK_POOL_TOO_SMALL when count > unique stickers', () => {
    expect(() => drawStickers(makePool(3), 5)).toThrow('PACK_POOL_TOO_SMALL');
  });

  it('throws PACK_POOL_TOO_SMALL for empty pool', () => {
    expect(() => drawStickers([], 1)).toThrow('PACK_POOL_TOO_SMALL');
  });
});
