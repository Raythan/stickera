import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { OwnershipFilter } from '@/components/molecules/OwnershipFilter';
import { PageSizeSelect } from '@/components/molecules/PageSizeSelect';
import { PaginationControls } from '@/components/molecules/PaginationControls';
import { SearchField } from '@/components/molecules/SearchField';
import type { AppTheme } from '@/theme/presets';
import { useTheme } from '@/theme/ThemeContext';
import { useIsNarrowLayout } from '@/theme/useLayoutBreakpoint';

import type { CollectionListToolbarProps } from './CollectionListToolbar.types';

function createStyles(theme: AppTheme, narrow: boolean) {
  return StyleSheet.create({
    wrap: {
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    row: {
      flexDirection: narrow ? 'column' : 'row',
      alignItems: narrow ? 'stretch' : 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
      flexWrap: 'wrap',
    },
  });
}

export function CollectionListToolbar({
  search,
  onSearchChange,
  searchPlaceholder,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  pageSizeLabel,
  page,
  totalPages,
  total,
  onPrevPage,
  onNextPage,
  labels,
  showOwnershipFilter = false,
  ownershipFilter = 'all',
  onOwnershipFilterChange,
}: CollectionListToolbarProps) {
  const theme = useTheme();
  const narrow = useIsNarrowLayout();
  const styles = useMemo(() => createStyles(theme, narrow), [theme, narrow]);

  return (
    <View style={styles.wrap}>
      <SearchField
        value={search}
        onChangeText={onSearchChange}
        placeholder={searchPlaceholder}
      />
      {showOwnershipFilter && onOwnershipFilterChange ? (
        <OwnershipFilter
          value={ownershipFilter}
          onChange={onOwnershipFilterChange}
          labels={{
            all: labels.filterAll,
            owned: labels.filterOwned,
            missing: labels.filterMissing,
          }}
        />
      ) : null}
      <View style={styles.row}>
        <PageSizeSelect
          label={pageSizeLabel}
          value={pageSize}
          options={pageSizeOptions}
          onChange={onPageSizeChange}
        />
      </View>
      <PaginationControls
        page={page}
        totalPages={totalPages}
        total={total}
        itemCountLabel={labels.itemCount}
        pageOfLabel={labels.pageOf}
        prevLabel={labels.prev}
        nextLabel={labels.next}
        onPrev={onPrevPage}
        onNext={onNextPage}
      />
    </View>
  );
}
