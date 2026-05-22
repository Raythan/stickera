export type OwnershipFilter = 'all' | 'owned' | 'missing';

export function normalizeSearchQuery(query: string): string {
  return query.trim().toLowerCase();
}

export function matchesSearch(text: string, query: string): boolean {
  const normalized = normalizeSearchQuery(query);
  if (!normalized) return true;
  return text.toLowerCase().includes(normalized);
}

export function filterByOwnership<T>(
  items: T[],
  isOwned: (item: T) => boolean,
  filter: OwnershipFilter,
): T[] {
  if (filter === 'all') return items;
  if (filter === 'owned') return items.filter(isOwned);
  return items.filter((item) => !isOwned(item));
}

function clampPageSize(pageSize: number): number {
  if (!Number.isFinite(pageSize) || pageSize < 1) return 1;
  return Math.floor(pageSize);
}

function clampPage(page: number, totalPages: number): number {
  if (totalPages < 1) return 1;
  if (!Number.isFinite(page) || page < 1) return 1;
  return Math.min(Math.floor(page), totalPages);
}

export type PaginateResult<T> = {
  items: T[];
  total: number;
  totalPages: number;
  page: number;
};

export function paginate<T>(items: T[], page: number, pageSize: number): PaginateResult<T> {
  const size = clampPageSize(pageSize);
  const total = items.length;
  const totalPages = total === 0 ? 1 : Math.ceil(total / size);
  const safePage = clampPage(page, totalPages);
  const start = (safePage - 1) * size;
  return {
    items: items.slice(start, start + size),
    total,
    totalPages,
    page: safePage,
  };
}
