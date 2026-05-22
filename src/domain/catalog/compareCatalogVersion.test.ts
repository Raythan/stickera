import {
  catalogVersionsMatch,
  compareCatalogVersion,
  isRemoteCatalogNewer,
} from './compareCatalogVersion';

describe('compareCatalogVersion', () => {
  it('orders by date and build number', () => {
    expect(compareCatalogVersion('2026.05.22.4', '2026.05.22.5')).toBe(-1);
    expect(compareCatalogVersion('2026.05.22.5', '2026.05.22.4')).toBe(1);
    expect(compareCatalogVersion('2026.05.22.5', '2026.05.22.5')).toBe(0);
  });

  it('detects remote newer', () => {
    expect(isRemoteCatalogNewer('2026.05.22.6', '2026.05.22.5')).toBe(true);
    expect(isRemoteCatalogNewer('2026.05.22.5', '2026.05.22.5')).toBe(false);
    expect(isRemoteCatalogNewer('2026.05.22.5', null)).toBe(true);
  });

  it('matches versions', () => {
    expect(catalogVersionsMatch('2026.05.22.5', '2026.05.22.5')).toBe(true);
    expect(catalogVersionsMatch('2026.05.22.4', '2026.05.22.5')).toBe(false);
    expect(catalogVersionsMatch(undefined, '2026.05.22.5')).toBe(false);
  });
});
