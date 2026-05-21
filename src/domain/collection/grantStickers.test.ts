import { describe, expect, it } from '@jest/globals';

import type { AlbumManifest, CollectionRow } from '@/domain/types';

import { grantAllStickersQty, setStickerQuantity } from './grantStickers';

const manifest: AlbumManifest = {
  id: 'album',
  revision: 1,
  frameStylePath: 'frame.css',
  totalStickers: 2,
  stickers: [
    { id: 'album:1', number: 1 },
    { id: 'album:2', number: 2 },
  ],
};

describe('grantStickers', () => {
  it('setStickerQuantity adds new row', () => {
    const result = setStickerQuantity([], 'album:1', 2);
    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(2);
  });

  it('grantAllStickersQty sets qty for all stickers in manifests', () => {
    const result = grantAllStickersQty([], [manifest], 2);
    expect(result).toHaveLength(2);
    expect(result.every((r) => r.quantity === 2)).toBe(true);
  });
});
