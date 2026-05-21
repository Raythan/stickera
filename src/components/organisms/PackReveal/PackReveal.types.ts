import type { StickerDef } from '@/domain/types';

export type PackRevealProps = {
  stickers: StickerDef[];
  onDismiss: () => void;
};
