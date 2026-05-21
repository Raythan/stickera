import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

import { getContentBaseUrl } from '@/config/contentBase';

export const CONTENT_CACHE_ROOT = `${FileSystem.documentDirectory}stickera/content/`;

/** Bundle roots tried in order (Expo assetBundlePatterns → `content/`; sync script mirror → `assets/content/`). */
export const BUNDLED_CONTENT_PREFIXES = ['content/', 'assets/content/'] as const;

export function albumRevisionDir(albumId: string, revision: number): string {
  return `${CONTENT_CACHE_ROOT}albums/${albumId}/r${revision}/`;
}

export function albumManifestPath(albumId: string, revision: number): string {
  return `${albumRevisionDir(albumId, revision)}album.json`;
}

export function albumFramePath(albumId: string, revision: number, frameFile: string): string {
  return `${albumRevisionDir(albumId, revision)}${frameFile}`;
}

export function albumStickerPath(
  albumId: string,
  revision: number,
  imagePath: string,
): string {
  return `${albumRevisionDir(albumId, revision)}${imagePath}`;
}

export function bundledContentPath(relativePath: string): string {
  const clean = relativePath.replace(/^\//, '');
  return `${FileSystem.bundleDirectory}${BUNDLED_CONTENT_PREFIXES[0]}${clean}`;
}

export function bundledContentCandidateUris(relativePath: string): string[] {
  const clean = relativePath.replace(/^\//, '');
  return BUNDLED_CONTENT_PREFIXES.map(
    (prefix) => `${FileSystem.bundleDirectory}${prefix}${clean}`,
  );
}

export async function resolveBundledContentUri(relativePath: string): Promise<string | null> {
  const clean = relativePath.replace(/^\//, '');

  if (Platform.OS === 'web') {
    const base = getContentBaseUrl();
    if (!base) return null;
    const url = `${base}/${clean}`;
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.ok) return url;
    } catch {
      return null;
    }
    return null;
  }

  for (const uri of bundledContentCandidateUris(relativePath)) {
    const info = await FileSystem.getInfoAsync(uri);
    if (info.exists) return uri;
  }
  return null;
}
