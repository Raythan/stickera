import * as FileSystem from 'expo-file-system';

import { getContentBaseUrl } from '@/config/contentBase';
import { albumStickerPath, resolveBundledContentUri } from '@/services/content/paths';
import { AlbumRepository } from '@/services/db/AlbumRepository';

function toFileUri(path: string): string {
  if (path.startsWith('file://')) return path;
  return `file://${path}`;
}

/**
 * URI for sticker art — synced cache first, then CDN, then bundle.
 */
export async function resolveStickerArtUri(
  albumId: string,
  imagePath: string,
): Promise<string> {
  const row = await AlbumRepository.getById(albumId);
  const revision = row?.revision ?? 1;

  const cached = albumStickerPath(albumId, revision, imagePath);
  const cachedInfo = await FileSystem.getInfoAsync(cached);
  if (cachedInfo.exists) {
    return toFileUri(cached);
  }

  const contentBase = getContentBaseUrl();
  if (contentBase) {
    return `${contentBase}/albums/${albumId}/${imagePath}`;
  }

  const bundled = await resolveBundledContentUri(`albums/${albumId}/${imagePath}`);
  if (bundled) {
    return bundled.startsWith('http') ? bundled : toFileUri(bundled);
  }

  return toFileUri(cached);
}
