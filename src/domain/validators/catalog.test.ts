import { parseCatalog, safeParseCatalog } from './catalog';

const validCatalog = {
  version: '2026.05.21',
  albums: [{ id: 'retro-games', revision: 1, manifestPath: '/albums/retro-games/album.json' }],
  appConfig: {
    packCooldown: { value: 4, unit: 'hours' as const },
    stickersPerPack: 5,
  },
};

describe('catalogSchema', () => {
  it('accepts valid catalog', () => {
    expect(parseCatalog(validCatalog).version).toBe('2026.05.21');
  });

  it('rejects missing version', () => {
    const result = safeParseCatalog({ ...validCatalog, version: '' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid packCooldown unit', () => {
    const result = safeParseCatalog({
      ...validCatalog,
      appConfig: {
        packCooldown: { value: 1, unit: 'days' },
        stickersPerPack: 5,
      },
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid album id slug', () => {
    const result = safeParseCatalog({
      ...validCatalog,
      albums: [{ id: 'Bad_ID', revision: 1, manifestPath: '/x.json' }],
    });
    expect(result.success).toBe(false);
  });
});
