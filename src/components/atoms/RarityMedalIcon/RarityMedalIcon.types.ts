import type { StickerRarity } from '@/theme/rarity';

export type RarityMedalIconProps = {
  rarity: StickerRarity;
  size?: number;
  /** When false, medal appears muted (locked / not owned). */
  owned?: boolean;
  accessibilityLabel?: string;
};
