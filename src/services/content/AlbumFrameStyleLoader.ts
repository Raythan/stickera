import * as FileSystem from 'expo-file-system';

import {
  albumFramePath,
  albumRevisionDir,
  resolveBundledContentUri,
} from '@/services/content/paths';
import { getContentBaseUrl } from '@/config/contentBase';
import { AlbumRepository } from '@/services/db/AlbumRepository';

const memoryCache = new Map<string, string>();

function pathDir(filePath: string): string {
  const i = filePath.lastIndexOf('/');
  return i >= 0 ? filePath.slice(0, i + 1) : filePath;
}

/**
 * Lazy async: device cache (post-sync) → CDN → bundled assets.
 */
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

  const syncedPath = albumFramePath(albumId, rev, frameStylePath);
  const syncedInfo = await FileSystem.getInfoAsync(syncedPath);
  if (syncedInfo.exists) {
    const css = await FileSystem.readAsStringAsync(syncedPath);
    memoryCache.set(cacheKey, css);
    return css;
  }

  const contentBase = getContentBaseUrl();
  if (contentBase) {
    const url = `${contentBase}/albums/${albumId}/${frameStylePath}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`FRAME_CSS_FETCH_FAILED:${albumId}`);
    const css = await res.text();
    await FileSystem.makeDirectoryAsync(albumRevisionDir(albumId, rev), {
      intermediates: true,
    });
    await FileSystem.writeAsStringAsync(syncedPath, css);
    memoryCache.set(cacheKey, css);
    return css;
  }

  const bundled = await resolveBundledContentUri(`albums/${albumId}/${frameStylePath}`);
  if (!bundled) {
    throw new Error(`FRAME_CSS_NOT_FOUND:${albumId}`);
  }
  const css = await FileSystem.readAsStringAsync(bundled);
  memoryCache.set(cacheKey, css);
  return css;
}
