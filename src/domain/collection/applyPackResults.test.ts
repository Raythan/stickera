import { describe, expect, it } from '@jest/globals';

import type { CollectionRow, StickerDef } from '@/domain/types';

import { applyPackResults } from './applyPackResults';

const now = new Date('2026-05-21T14:00:00Z');

const sticker = (id: string): StickerDef => ({ id, number: 1 });

describe('applyPackResults', () => {
  it('adds new stickers with quantity 1 and is_new 1', () => {
    const result = applyPackResults([], [sticker('album:1')], now);
    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(1);
    expect(result[0].is_new).toBe(1);
    expect(result[0].album_id).toBe('album');
    expect(result[0].first_obtained_at).toBe(now.toISOString());
  });

  it('increments quantity for already-owned stickers', () => {
    const existing: CollectionRow[] = [
      {
        sticker_id: 'album:1',
        album_id: 'album',
        quantity: 2,
        is_new: 0,
        first_obtained_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      },
    ];
    const result = applyPackResults(existing, [sticker('album:1')], now);
    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(3);
    expect(result[0].first_obtained_at).toBe('2026-01-01T00:00:00Z');
    expect(result[0].updated_at).toBe(now.toISOString());
  });

  it('preserves is_new on existing rows', () => {
    const existing: CollectionRow[] = [
      {
        sticker_id: 'album:1',
        album_id: 'album',
        quantity: 1,
        is_new: 1,
        first_obtained_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      },
    ];
    const result = applyPackResults(existing, [sticker('album:1')], now);
    expect(result[0].is_new).toBe(1);
  });

  it('handles mix of new and existing stickers', () => {
    const existing: CollectionRow[] = [
      {
        sticker_id: 'album:1',
        album_id: 'album',
        quantity: 1,
        is_new: 0,
        first_obtained_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      },
    ];
    const result = applyPackResults(
      existing,
      [sticker('album:1'), sticker('album:2')],
      now,
    );
    expect(result).toHaveLength(2);
    expect(result.find((r) => r.sticker_id === 'album:1')?.quantity).toBe(2);
    expect(result.find((r) => r.sticker_id === 'album:2')?.quantity).toBe(1);
  });
});
