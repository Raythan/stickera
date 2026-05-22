import type { StickerRarity } from '@/theme/rarity';

export type RarityMedalIconProps = {
  rarity: StickerRarity;
  /** Medal glyph size inside the circular badge (default 16). */
  size?: number;
  /** When false, medal appears muted (locked / not owned). */
  owned?: boolean;
  accessibilityLabel?: string;
};
