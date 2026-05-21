import { albumFrameUrl } from '@/services/content/paths';
import { AlbumRepository } from '@/services/db/AlbumRepository';

const memoryCache = new Map<string, string>();

export async function loadAlbumFrameCss(
  albumId: string,
  frameStylePath = 'frame.css',
  revision?: number,
): Promise<string> {
  const row = await AlbumRepository.getById(albumId);
  const rev = revision ?? row?.revision ?? 1;
  const cacheKey = `${albumId}:${rev}:${frameStylePath}`;
  const hit = memoryCache.get(cacheKey);
  if (hit) return hit;

  const url = albumFrameUrl(albumId, frameStylePath);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`FRAME_CSS_FETCH_FAILED:${albumId}`);
  const css = await res.text();
  memoryCache.set(cacheKey, css);
  return css;
}
