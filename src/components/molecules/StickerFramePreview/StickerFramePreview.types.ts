import type { StickerRarity } from '@/theme/rarity';

export type StickerFramePreviewProps = {
  frameCss: string;
  artUri?: string | null;
  accessibilityLabel?: string;
  rarity?: StickerRarity;
  /** When false, applies sticker-frame--locked in iframe. Default true. */
  owned?: boolean;
  width?: number;
  height?: number;
};
