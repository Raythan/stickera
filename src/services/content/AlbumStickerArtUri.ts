import { albumStickerUrl } from '@/services/content/paths';

export async function resolveStickerArtUri(
  albumId: string,
  imagePath: string,
): Promise<string> {
  return albumStickerUrl(albumId, imagePath);
}
