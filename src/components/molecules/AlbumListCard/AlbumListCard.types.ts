import type { AlbumRow } from '@/domain/types';

export type AlbumListCardProps = {
  album: AlbumRow;
  owned: number;
  total: number;
  packPoolEnabled: boolean;
  onTogglePackPool: (albumId: string, enabled: boolean) => void;
  onPress: () => void;
};
