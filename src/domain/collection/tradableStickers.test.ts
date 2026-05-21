import { describe, expect, it } from '@jest/globals';

import type { CollectionRow } from '@/domain/types';

import { tradableStickers } from './tradableStickers';

describe('tradableStickers', () => {
  it('returns only stickers with quantity >= 2', () => {
    const rows: CollectionRow[] = [
      { sticker_id: 'a:1', album_id: 'a', quantity: 1, is_new: 0, first_obtained_at: null, updated_at: '' },
      { sticker_id: 'a:2', album_id: 'a', quantity: 2, is_new: 0, first_obtained_at: null, updated_at: '' },
      { sticker_id: 'a:3', album_id: 'a', quantity: 5, is_new: 0, first_obtained_at: null, updated_at: '' },
    ];
    expect(tradableStickers(rows)).toEqual(['a:2', 'a:3']);
  });

  it('returns empty array when no duplicates', () => {
    const rows: CollectionRow[] = [
      { sticker_id: 'a:1', album_id: 'a', quantity: 1, is_new: 0, first_obtained_at: null, updated_at: '' },
    ];
    expect(tradableStickers(rows)).toEqual([]);
  });

  it('returns empty array for empty collection', () => {
    expect(tradableStickers([])).toEqual([]);
  });
});
