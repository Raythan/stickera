import { useEffect, useMemo, useState } from 'react';

import {
  filterByOwnership,
  matchesSearch,
  paginate,
  type OwnershipFilter,
} from '@/domain/collection/listQuery';

export type UseCollectionListControlsOptions<T> = {
  items: T[];
  pageSize: number;
  getSearchText: (item: T) => string;
  isOwned?: (item: T) => boolean;
  enableOwnershipFilter?: boolean;
};

export function useCollectionListControls<T>({
  items,
  pageSize,
  getSearchText,
  isOwned,
  enableOwnershipFilter = false,
}: UseCollectionListControlsOptions<T>) {
  const [search, setSearch] = useState('');
  const [ownershipFilter, setOwnershipFilter] = useState<OwnershipFilter>('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search, ownershipFilter, pageSize, items.length]);

  const filtered = useMemo(() => {
    let list = items;
    if (enableOwnershipFilter && isOwned) {
      list = filterByOwnership(list, isOwned, ownershipFilter);
    }
    return list.filter((item) => matchesSearch(getSearchText(item), search));
  }, [items, search, ownershipFilter, enableOwnershipFilter, isOwned, getSearchText]);

  const pagination = useMemo(
    () => paginate(filtered, page, pageSize),
    [filtered, page, pageSize],
  );

  useEffect(() => {
    if (page > pagination.totalPages) {
      setPage(pagination.totalPages);
    }
  }, [page, pagination.totalPages]);

  return {
    search,
    setSearch,
    ownershipFilter,
    setOwnershipFilter,
    page: pagination.page,
    setPage,
    visibleItems: pagination.items,
    total: pagination.total,
    totalPages: pagination.totalPages,
    hasResults: pagination.total > 0,
  };
}
