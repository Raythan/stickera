import { parseAlbum, safeParseAlbum } from './album';

const validAlbum = {
  id: 'world-cup-2026',
  revision: 1,
  frameStylePath: 'frame.css',
  totalStickers: 4,
  nameKey: 'albums.worldCup2026.name',
  stickers: [
    {
      id: 'world-cup-2026:01',
      number: 1,
      nameKey: 'albums.worldCup2026.stickers.01.name',
      image: 'stickers/01-neymar.jpeg',
    },
  ],
};

describe('albumSchema', () => {
  it('accepts valid album with stickers', () => {
    expect(parseAlbum(validAlbum).id).toBe('world-cup-2026');
  });

  it('accepts empty stickers array (CSS-only album)', () => {
    expect(parseAlbum({ ...validAlbum, stickers: [] }).stickers).toEqual([]);
  });

  it('accepts inline names without nameKey', () => {
    const album = parseAlbum({
      id: 'ocean-life',
      revision: 1,
      frameStylePath: 'frame.css',
      totalStickers: 1,
      names: { en: 'Ocean Life', pt: 'Vida Marinha' },
      stickers: [
        {
          id: 'ocean-life:01',
          number: 1,
          names: { en: 'Dolphin', pt: 'Golfinho' },
          image: 'stickers/01.png',
        },
      ],
    });
    expect(album.names?.en).toBe('Ocean Life');
  });

  it('rejects missing frameStylePath', () => {
    const { frameStylePath: _, ...rest } = validAlbum;
    expect(safeParseAlbum(rest).success).toBe(false);
  });

  it('accepts webp sticker image path', () => {
    const album = parseAlbum({
      ...validAlbum,
      stickers: [
        {
          id: 'fruits:040',
          number: 40,
          names: { en: 'Atemoya 05', pt: 'Atemoia 05' },
          image: 'stickers/040-atemoia-05.webp',
        },
      ],
    });
    expect(album.stickers[0]?.image).toBe('stickers/040-atemoia-05.webp');
  });

  it('rejects invalid image path', () => {
    const result = safeParseAlbum({
      ...validAlbum,
      stickers: [
        {
          id: 'world-cup-2026:01',
          number: 1,
          nameKey: 'albums.worldCup2026.stickers.01.name',
          image: 'bad/path.bmp',
        },
      ],
    });
    expect(result.success).toBe(false);
  });
});
