import type { OwnershipFilter } from '@/domain/collection/listQuery';

export type OwnershipFilterProps = {
  value: OwnershipFilter;
  onChange: (value: OwnershipFilter) => void;
  labels: { all: string; owned: string; missing: string };
};
