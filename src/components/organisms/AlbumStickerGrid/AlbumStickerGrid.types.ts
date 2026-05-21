import type { AlbumManifest } from '@/domain/types';

export type AlbumStickerGridProps = {
  album: AlbumManifest;
  frameCss: string;
  getStickerName: (nameKey: string) => string;
};
