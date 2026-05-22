import { StyleSheet, View } from 'react-native';

import { AlbumListCard } from '@/components/molecules/AlbumListCard';
import type { AppTheme } from '@/theme/presets';
import { useThemedStyles } from '@/theme/useThemedStyles';

import type { AlbumGridProps } from './AlbumGrid.types';

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
      justifyContent: 'space-between',
    },
  });
}

export function AlbumGrid({ items }: AlbumGridProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <AlbumListCard
          key={item.album.id}
          album={item.album}
          owned={item.owned}
          total={item.total}
          packPoolEnabled={item.packPoolEnabled}
          onTogglePackPool={item.onTogglePackPool}
          onPress={item.onPress}
        />
      ))}
    </View>
  );
}
