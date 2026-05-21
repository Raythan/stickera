import type { AlbumRow } from '@/domain/types';

export type AlbumListCardProps = {
  album: AlbumRow;
  owned: number;
  total: number;
  onPress: () => void;
};
