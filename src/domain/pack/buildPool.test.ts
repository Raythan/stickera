import { describe, expect, it } from '@jest/globals';

import type { AlbumManifest } from '@/domain/types';

import { buildPool } from './buildPool';

function makeManifest(id: string, stickerCount: number, packWeight = 1): AlbumManifest {
  return {
    id,
    revision: 1,
    frameStylePath: 'frame.css',
    totalStickers: stickerCount,
    packWeight,
    stickers: Array.from({ length: stickerCount }, (_, i) => ({
      id: `${id}:${i + 1}`,
      number: i + 1,
    })),
  };
}

describe('buildPool', () => {
  it('includes stickers only from passed manifests', () => {
    const m1 = makeManifest('a', 3);
    const pool = buildPool([m1], new Map());
    expect(pool).toHaveLength(3);
    expect(pool.every((s) => s.id.startsWith('a:'))).toBe(true);
  });

  it('skips albums with no stickers', () => {
    const empty = makeManifest('empty', 0);
    const filled = makeManifest('filled', 2);
    const pool = buildPool([empty, filled], new Map());
    expect(pool).toHaveLength(2);
  });

  it('applies packWeight by replicating stickers', () => {
    const m = makeManifest('w', 2, 3);
    const pool = buildPool([m], new Map());
    expect(pool).toHaveLength(6); // 2 stickers * weight 3
  });

  it('excludeCompleted removes fully owned stickers', () => {
    const m = makeManifest('x', 3);
    const owned = new Map([['x:1', 1], ['x:2', 1]]);
    const pool = buildPool([m], owned, { excludeCompleted: true });
    expect(pool).toHaveLength(1);
    expect(pool[0].id).toBe('x:3');
  });
});
