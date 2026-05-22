import { StyleSheet, View } from 'react-native';

import { AlbumListCard } from '@/components/molecules/AlbumListCard';
import type { AppTheme } from '@/theme/presets';
import { useIsNarrowLayout } from '@/theme/useLayoutBreakpoint';
import { useThemedStyles } from '@/theme/useThemedStyles';

import type { AlbumGridProps } from './AlbumGrid.types';

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },
    cellFull: {
      width: '100%',
    },
    cellHalf: {
      width: '48%',
      flexGrow: 0,
      flexShrink: 0,
    },
  });
}

export function AlbumGrid({ items }: AlbumGridProps) {
  const styles = useThemedStyles(createStyles);
  const narrow = useIsNarrowLayout();
  const cellStyle = narrow ? styles.cellFull : styles.cellHalf;

  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <View key={item.album.id} style={cellStyle}>
          <AlbumListCard
            album={item.album}
            owned={item.owned}
            total={item.total}
            packPoolEnabled={item.packPoolEnabled}
            onTogglePackPool={item.onTogglePackPool}
            onPress={item.onPress}
          />
        </View>
      ))}
    </View>
  );
}
