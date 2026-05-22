import type { AlbumRow } from '@/domain/types';

export type AlbumGridItem = {
  album: AlbumRow;
  owned: number;
  total: number;
  packPoolEnabled: boolean;
  onTogglePackPool: (albumId: string, enabled: boolean) => void;
  onPress: () => void;
};

export type AlbumGridProps = {
  items: AlbumGridItem[];
};
