import { getContentBaseUrl } from '@/config/contentBase';

export function albumManifestUrl(albumId: string, _revision: number): string {
  return `${getContentBaseUrl()}/albums/${albumId}/album.json`;
}

export function albumFrameUrl(albumId: string, frameFile: string): string {
  return `${getContentBaseUrl()}/albums/${albumId}/${frameFile}`;
}

export function albumStickerUrl(albumId: string, imagePath: string): string {
  return `${getContentBaseUrl()}/albums/${albumId}/${imagePath}`;
}
