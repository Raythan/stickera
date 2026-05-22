export type PaginationControlsProps = {
  page: number;
  totalPages: number;
  total: number;
  itemCountLabel: string;
  pageOfLabel: string;
  prevLabel: string;
  nextLabel: string;
  onPrev: () => void;
  onNext: () => void;
};
