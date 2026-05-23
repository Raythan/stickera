import type { OwnershipFilter } from '@/domain/collection/listQuery';

export type CollectionListToolbarLabels = {
  itemCount: string;
  pageOf?: string;
  prev?: string;
  next?: string;
  filterAll: string;
  filterOwned: string;
  filterMissing: string;
};

export type CollectionListToolbarProps = {
  search: string;
  onSearchChange: (text: string) => void;
  searchPlaceholder: string;
  total: number;
  labels: CollectionListToolbarLabels;
  showOwnershipFilter?: boolean;
  ownershipFilter?: OwnershipFilter;
  onOwnershipFilterChange?: (filter: OwnershipFilter) => void;
  /** When provided, shows page size + prev/next pagination. Omitted for carousel-only lists. */
  pagination?: {
    pageSize: number;
    pageSizeOptions: readonly number[];
    onPageSizeChange: (size: number) => void;
    pageSizeLabel: string;
    page: number;
    totalPages: number;
    onPrevPage: () => void;
    onNextPage: () => void;
  };
};
