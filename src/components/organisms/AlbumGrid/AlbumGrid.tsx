import { StyleSheet, View } from 'react-native';

import { AlbumListCard } from '@/components/molecules/AlbumListCard';
import { theme } from '@/theme';

import type { AlbumGridProps } from './AlbumGrid.types';

export function AlbumGrid({ items }: AlbumGridProps) {
  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <AlbumListCard
          key={item.album.id}
          album={item.album}
          owned={item.owned}
          total={item.total}
          onPress={item.onPress}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
  },
});
