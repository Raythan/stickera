import { useEffect, useMemo, useState } from 'react';

import {
  filterByOwnership,
  matchesSearch,
  paginate,
  type OwnershipFilter,
} from '@/domain/collection/listQuery';

export type UseCollectionListControlsOptions<T> = {
  items: T[];
  getSearchText: (item: T) => string;
  isOwned?: (item: T) => boolean;
  enableOwnershipFilter?: boolean;
  /** When true, slices `visibleItems` by page. Default false (carousel shows all filtered). */
  paginate?: boolean;
  pageSize?: number;
};

export function useCollectionListControls<T>({
  items,
  getSearchText,
  isOwned,
  enableOwnershipFilter = false,
  paginate: usePagination = false,
  pageSize = 24,
}: UseCollectionListControlsOptions<T>) {
  const [search, setSearch] = useState('');
  const [ownershipFilter, setOwnershipFilter] = useState<OwnershipFilter>('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search, ownershipFilter, pageSize, items.length, usePagination]);

  const filtered = useMemo(() => {
    let list = items;
    if (enableOwnershipFilter && isOwned) {
      list = filterByOwnership(list, isOwned, ownershipFilter);
    }
    return list.filter((item) => matchesSearch(getSearchText(item), search));
  }, [items, search, ownershipFilter, enableOwnershipFilter, isOwned, getSearchText]);

  const pagination = useMemo(
    () => (usePagination ? paginate(filtered, page, pageSize) : null),
    [filtered, page, pageSize, usePagination],
  );

  useEffect(() => {
    if (!usePagination || !pagination) return;
    if (page > pagination.totalPages) {
      setPage(pagination.totalPages);
    }
  }, [page, pagination, usePagination]);

  const visibleItems = usePagination && pagination ? pagination.items : filtered;
  const total = usePagination && pagination ? pagination.total : filtered.length;

  return {
    search,
    setSearch,
    ownershipFilter,
    setOwnershipFilter,
    page: pagination?.page ?? 1,
    setPage,
    visibleItems,
    total,
    totalPages: pagination?.totalPages ?? 1,
    hasResults: total > 0,
    paginate: usePagination,
  };
}
