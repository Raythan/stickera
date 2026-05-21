import type { AlbumManifest, StickerDef } from '@/domain/types';

export type AlbumStickerGridProps = {
  album: AlbumManifest;
  frameCss: string;
  getStickerName: (sticker: StickerDef) => string;
};
