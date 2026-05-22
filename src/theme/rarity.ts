/** Sticker rarity tiers — shared by medal icon and frame.css modifiers. */
export type StickerRarity = 'common' | 'uncommon' | 'rare' | 'legendary';

export const STICKER_RARITIES: readonly StickerRarity[] = [
  'common',
  'uncommon',
  'rare',
  'legendary',
] as const;

/** Three-tone palette per tier: fill (badge bg), border, icon (medal). */
export type RarityToneSet = {
  fill: string;
  border: string;
  icon: string;
};

export const RARITY_TONES: Record<StickerRarity, RarityToneSet> = {
  common: { fill: '#ECEEF1', border: '#B4BAC3', icon: '#6E7681' },
  uncommon: { fill: '#E4F2EB', border: '#6FA88A', icon: '#2F7A5C' },
  rare: { fill: '#DFECF1', border: '#5A8F9E', icon: '#1E5568' },
  legendary: { fill: '#FDF4DC', border: '#E5C25A', icon: '#C99218' },
};

/** Medal stroke/fill — same as `RARITY_TONES[*].icon`. */
export const RARITY_COLORS: Record<StickerRarity, string> = {
  common: RARITY_TONES.common.icon,
  uncommon: RARITY_TONES.uncommon.icon,
  rare: RARITY_TONES.rare.icon,
  legendary: RARITY_TONES.legendary.icon,
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
