import type { AlbumManifest, StickerDef } from '@/domain/types';
import type { StickerCollectionEntry } from '@/services/db/CollectionRepository';

export type AlbumStickerGridProps = {
  album: AlbumManifest;
  frameCss: string;
  getStickerName: (sticker: StickerDef) => string;
  getCollectionEntry: (stickerId: string) => StickerCollectionEntry;
};
