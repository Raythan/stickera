import type { AlbumManifest } from '@/domain/types';
import { ContentSyncService } from '@/services/sync/ContentSyncService';

const memory = new Map<string, AlbumManifest>();

export async function getAlbumManifest(albumId: string): Promise<AlbumManifest | null> {
  const cached = memory.get(albumId);
  if (cached) return cached;

  const manifest = await ContentSyncService.loadAlbumManifest(albumId);
  if (manifest) memory.set(albumId, manifest);
  return manifest;
}

export function clearAlbumManifestCache(): void {
  memory.clear();
}
