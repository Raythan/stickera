import { tradableStickers } from '@/domain/collection/tradableStickers';
import type { TradableStickerItem } from '@/domain/types';
import { resolveContentLabel } from '@/i18n/resolveContentLabel';
import { CollectionRepository } from '@/services/db/CollectionRepository';
import { EnabledAlbumRepository } from '@/services/db/EnabledAlbumRepository';
import { getAlbumManifest } from '@/services/content/AlbumManifestStore';
import { resolveStickerArtUri } from '@/services/content/AlbumStickerArtUri';
import { loadAlbumFrameCss } from '@/services/content/AlbumFrameStyleLoader';

async function loadFrameCssByAlbum(albumIds: string[]): Promise<Record<string, string | undefined>> {
  const map: Record<string, string | undefined> = {};
  await Promise.all(
    albumIds.map(async (albumId) => {
      try {
        map[albumId] = await loadAlbumFrameCss(albumId);
      } catch {
        map[albumId] = undefined;
      }
    }),
  );
  return map;
}

async function stickerItemFromManifest(
  stickerId: string,
  quantity: number,
  frameCssByAlbum: Record<string, string | undefined>,
): Promise<TradableStickerItem | null> {
  const albumId = stickerId.split(':')[0];
  const manifest = await getAlbumManifest(albumId);
  if (!manifest) return null;
  const sticker = manifest.stickers.find((s) => s.id === stickerId);
  if (!sticker) return null;

  const name = resolveContentLabel(sticker.nameKey ?? sticker.id, sticker.names);
  const imageUri = sticker.image ? await resolveStickerArtUri(albumId, sticker.image) : undefined;

  return {
    stickerId,
    albumId,
    name,
    imageUri: imageUri || undefined,
    frameCss: frameCssByAlbum[albumId],
    quantity,
    rarity: sticker.rarity,
  };
}

export async function buildTradableStickerItems(): Promise<TradableStickerItem[]> {
  const rows = await CollectionRepository.getAllAsRows();
  const ids = tradableStickers(rows);
  const qtyById = new Map(rows.map((r) => [r.sticker_id, r.quantity]));
  const albumIds = [...new Set(ids.map((id) => id.split(':')[0]))];
  const frameCssByAlbum = await loadFrameCssByAlbum(albumIds);

  const items = await Promise.all(
    ids.map((id) => stickerItemFromManifest(id, qtyById.get(id) ?? 0, frameCssByAlbum)),
  );
  return items.filter((x): x is TradableStickerItem => x !== null);
}

export async function resolveStickerItemsByIds(stickerIds: string[]): Promise<TradableStickerItem[]> {
  const rows = await CollectionRepository.getAllAsRows();
  const qtyById = new Map(rows.map((r) => [r.sticker_id, r.quantity]));
  const albumIds = [...new Set(stickerIds.map((id) => id.split(':')[0]))];
  const frameCssByAlbum = await loadFrameCssByAlbum(albumIds);

  const items = await Promise.all(
    stickerIds.map((id) => stickerItemFromManifest(id, qtyById.get(id) ?? 0, frameCssByAlbum)),
  );
  return items.filter((x): x is TradableStickerItem => x !== null);
}
