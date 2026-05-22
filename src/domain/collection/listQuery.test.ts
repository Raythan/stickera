import {
  filterByOwnership,
  matchesSearch,
  normalizeSearchQuery,
  paginate,
} from './listQuery';

describe('listQuery', () => {
  describe('normalizeSearchQuery', () => {
    it('trims and lowercases', () => {
      expect(normalizeSearchQuery('  Foo ')).toBe('foo');
    });
  });

  describe('matchesSearch', () => {
    it('matches case-insensitively', () => {
      expect(matchesSearch('Neymar Jr', 'neym')).toBe(true);
    });

    it('empty query matches all', () => {
      expect(matchesSearch('anything', '')).toBe(true);
      expect(matchesSearch('anything', '   ')).toBe(true);
    });

    it('returns false when no substring', () => {
      expect(matchesSearch('Raphinha', 'neymar')).toBe(false);
    });
  });

  describe('filterByOwnership', () => {
    const items = ['a', 'b', 'c'];
    const owned = (x: string) => x === 'a' || x === 'b';

    it('returns all for all filter', () => {
      expect(filterByOwnership(items, owned, 'all')).toEqual(items);
    });

    it('filters owned', () => {
      expect(filterByOwnership(items, owned, 'owned')).toEqual(['a', 'b']);
    });

    it('filters missing', () => {
      expect(filterByOwnership(items, owned, 'missing')).toEqual(['c']);
    });
  });

  describe('paginate', () => {
    const items = [1, 2, 3, 4, 5];

    it('returns first page slice', () => {
      const result = paginate(items, 1, 2);
      expect(result.items).toEqual([1, 2]);
      expect(result.total).toBe(5);
      expect(result.totalPages).toBe(3);
      expect(result.page).toBe(1);
    });

    it('clamps page beyond total', () => {
      const result = paginate(items, 99, 2);
      expect(result.page).toBe(3);
      expect(result.items).toEqual([5]);
    });

    it('clamps invalid page size to 1', () => {
      const result = paginate(items, 1, 0);
      expect(result.items).toHaveLength(1);
      expect(result.totalPages).toBe(5);
    });

    it('empty list returns page 1', () => {
      const result = paginate([], 5, 10);
      expect(result.items).toEqual([]);
      expect(result.totalPages).toBe(1);
      expect(result.page).toBe(1);
    });
  });
});
