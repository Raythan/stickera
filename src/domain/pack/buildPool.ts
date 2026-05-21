import type { AlbumManifest, StickerDef } from '@/domain/types';

export type BuildPoolOptions = {
  excludeCompleted?: boolean;
};

/**
 * Builds a weighted pool of stickers from enabled album manifests.
 * packWeight > 1 replicates that album's stickers in the pool to increase draw chance.
 */
export function buildPool(
  enabledManifests: AlbumManifest[],
  ownedBySticker: Map<string, number>,
  options?: BuildPoolOptions,
): StickerDef[] {
  const pool: StickerDef[] = [];

  for (const manifest of enabledManifests) {
    if (manifest.stickers.length === 0) continue;

    const stickers = options?.excludeCompleted
      ? manifest.stickers.filter((s) => (ownedBySticker.get(s.id) ?? 0) === 0)
      : manifest.stickers;

    const weight = Math.max(1, Math.round(manifest.packWeight ?? 1));
    for (let w = 0; w < weight; w++) {
      pool.push(...stickers);
    }
  }

  return pool;
}
