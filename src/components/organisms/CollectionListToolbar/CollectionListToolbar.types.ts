import type { OwnershipFilter } from '@/domain/collection/listQuery';

export type CollectionListToolbarProps = {
  search: string;
  onSearchChange: (text: string) => void;
  searchPlaceholder: string;
  pageSize: number;
  pageSizeOptions: readonly number[];
  onPageSizeChange: (size: number) => void;
  pageSizeLabel: string;
  page: number;
  totalPages: number;
  total: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  labels: {
    itemCount: string;
    pageOf: string;
    prev: string;
    next: string;
    filterAll: string;
    filterOwned: string;
    filterMissing: string;
  };
  showOwnershipFilter?: boolean;
  ownershipFilter?: OwnershipFilter;
  onOwnershipFilterChange?: (filter: OwnershipFilter) => void;
};
