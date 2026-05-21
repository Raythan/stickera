import type { AlbumRow } from '@/domain/types';

export type AlbumGridItem = {
  album: AlbumRow;
  owned: number;
  total: number;
  onPress: () => void;
};

export type AlbumGridProps = {
  items: AlbumGridItem[];
};
