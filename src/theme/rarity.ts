/** Sticker rarity tiers — shared by medal icon and frame.css modifiers. */
export type StickerRarity = 'common' | 'uncommon' | 'rare' | 'legendary';

export const STICKER_RARITIES: readonly StickerRarity[] = [
  'common',
  'uncommon',
  'rare',
  'legendary',
] as const;

export const RARITY_COLORS: Record<StickerRarity, string> = {
  common: '#8B9199',
  uncommon: '#3D8B6E',
  rare: '#2A6B7D',
  legendary: '#F4B942',
};

export function isStickerRarity(value: string | undefined): value is StickerRarity {
  return value !== undefined && (STICKER_RARITIES as readonly string[]).includes(value);
}

export const RARITY_I18N_KEY: Record<StickerRarity, string> = {
  common: 'collection.rarity.common',
  uncommon: 'collection.rarity.uncommon',
  rare: 'collection.rarity.rare',
  legendary: 'collection.rarity.legendary',
};
