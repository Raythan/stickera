import { AlbumListCard } from '@/components/molecules/AlbumListCard';
import { PeekCarousel } from '@/components/molecules/PeekCarousel';

import type { AlbumGridProps } from './AlbumGrid.types';

export function AlbumGrid({ items }: AlbumGridProps) {
  return (
    <PeekCarousel
      data={items}
      keyExtractor={(item) => item.album.id}
      renderItem={(item) => (
        <AlbumListCard
          album={item.album}
          owned={item.owned}
          total={item.total}
          packPoolEnabled={item.packPoolEnabled}
          onTogglePackPool={item.onTogglePackPool}
          onPress={item.onPress}
        />
      )}
    />
  );
}
