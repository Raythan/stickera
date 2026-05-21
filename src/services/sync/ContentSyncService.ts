import * as FileSystem from 'expo-file-system';

import type { AlbumManifest, Catalog, CatalogAlbumRef, SyncResult } from '@/domain/types';
import { parseAlbum } from '@/domain/validators/album';
import { parseCatalog } from '@/domain/validators/catalog';
import { AlbumRepository } from '@/services/db/AlbumRepository';
import { PackStateRepository } from '@/services/db/PackStateRepository';
import { SettingsRepository } from '@/services/db/SettingsRepository';
import { getContentBaseUrl } from '@/config/contentBase';
import {
  albumFramePath,
  albumManifestPath,
  albumRevisionDir,
  albumStickerPath,
  CONTENT_CACHE_ROOT,
  resolveBundledContentUri,
} from '@/services/content/paths';

async function ensureDir(dir: string): Promise<void> {
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
}

async function readBundledText(relativePath: string): Promise<string | null> {
  const uri = await resolveBundledContentUri(relativePath);
  if (!uri) return null;
  return FileSystem.readAsStringAsync(uri);
}

async function copyBundledFile(relativePath: string, destPath: string): Promise<boolean> {
  const src = await resolveBundledContentUri(relativePath);
  if (!src) return false;
  await ensureDir(destPath.substring(0, destPath.lastIndexOf('/') + 1));
  await FileSystem.copyAsync({ from: src, to: destPath });
  return true;
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.text();
  } catch {
    return null;
  }
}

async function downloadFile(url: string, destPath: string): Promise<boolean> {
  try {
    await ensureDir(destPath.substring(0, destPath.lastIndexOf('/') + 1));
    const result = await FileSystem.downloadAsync(url, destPath);
    return result.status === 200;
  } catch {
    return false;
  }
}

function toFileUri(path: string): string {
  if (path.startsWith('file://')) return path;
  return `file://${path}`;
}

async function persistAlbumAssets(
  manifest: AlbumManifest,
  baseUrl: string | null,
  fromBundled: boolean,
): Promise<void> {
  const dir = albumRevisionDir(manifest.id, manifest.revision);
  await ensureDir(dir);

  const manifestDest = albumManifestPath(manifest.id, manifest.revision);
  await FileSystem.writeAsStringAsync(manifestDest, JSON.stringify(manifest));

  const frameFile = manifest.frameStylePath;
  const frameDest = albumFramePath(manifest.id, manifest.revision, frameFile);

  if (fromBundled) {
    await copyBundledFile(
      `albums/${manifest.id}/${frameFile}`,
      frameDest,
    );
  } else if (baseUrl) {
    await downloadFile(`${baseUrl}/albums/${manifest.id}/${frameFile}`, frameDest);
  }

  for (const sticker of manifest.stickers) {
    if (!sticker.image) continue;
    const dest = albumStickerPath(manifest.id, manifest.revision, sticker.image);
    if (fromBundled) {
      await copyBundledFile(`albums/${manifest.id}/${sticker.image}`, dest);
    } else if (baseUrl) {
      await downloadFile(`${baseUrl}/albums/${manifest.id}/${sticker.image}`, dest);
    }
  }

  let coverUri: string | null = null;
  if (manifest.coverImage) {
    const coverDest = albumStickerPath(
      manifest.id,
      manifest.revision,
      manifest.coverImage,
    );
    if (fromBundled) {
      const ok = await copyBundledFile(
        `albums/${manifest.id}/${manifest.coverImage}`,
        coverDest,
      );
      if (ok) coverUri = toFileUri(coverDest);
    } else if (baseUrl) {
      const ok = await downloadFile(
        `${baseUrl}/albums/${manifest.id}/${manifest.coverImage}`,
        coverDest,
      );
      if (ok) coverUri = toFileUri(coverDest);
    }
  }

  await AlbumRepository.upsertFromManifest(manifest, coverUri);
}

async function syncAlbumRef(
  ref: CatalogAlbumRef,
  baseUrl: string | null,
  fromBundled: boolean,
  force: boolean,
): Promise<boolean> {
  const existing = await AlbumRepository.getById(ref.id);
  if (!force && existing && existing.revision >= ref.revision) {
    return false;
  }

  let manifestJson: string | null = null;
  const manifestRel = ref.manifestPath.replace(/^\//, '');

  if (fromBundled) {
    manifestJson = await readBundledText(manifestRel);
  } else if (baseUrl) {
    manifestJson = await fetchText(`${baseUrl}/${manifestRel}`);
  }

  if (!manifestJson) return false;

  const manifest = parseAlbum(JSON.parse(manifestJson));
  await persistAlbumAssets(manifest, baseUrl, fromBundled);
  return true;
}

async function applyCatalog(
  catalog: Catalog,
  fromBundled: boolean,
  force: boolean,
): Promise<number> {
  const baseUrl = catalog.baseUrl || getContentBaseUrl() || null;
  let updated = 0;

  for (const ref of catalog.albums) {
    const changed = await syncAlbumRef(ref, baseUrl, fromBundled, force);
    if (changed) updated += 1;
  }

  await SettingsRepository.setContentVersion(catalog.version);
  return updated;
}

export const ContentSyncService = {
  async ensureCacheRoot(): Promise<void> {
    await ensureDir(CONTENT_CACHE_ROOT);
  },

  async seedBundledIfNeeded(): Promise<SyncResult> {
    await ContentSyncService.ensureCacheRoot();
    await PackStateRepository.ensureInitialized();

    const localVersion = await SettingsRepository.getContentVersion();
    const catalogText = await readBundledText('catalog.json');
    if (!catalogText) {
      return {
        ok: false,
        source: 'bundled',
        catalogVersion: localVersion ?? '',
        albumsUpdated: 0,
        message: 'BUNDLED_CATALOG_MISSING',
      };
    }

    const catalog = parseCatalog(JSON.parse(catalogText));
    if (localVersion === catalog.version) {
      return {
        ok: true,
        source: 'cache',
        catalogVersion: catalog.version,
        albumsUpdated: 0,
      };
    }

    const albumsUpdated = await applyCatalog(catalog, true, true);
    return {
      ok: true,
      source: 'bundled',
      catalogVersion: catalog.version,
      albumsUpdated,
    };
  },

  async syncFromRemote(): Promise<SyncResult> {
    await ContentSyncService.ensureCacheRoot();
    await PackStateRepository.ensureInitialized();

    const contentBase = getContentBaseUrl();
    if (!contentBase) {
      return ContentSyncService.seedBundledIfNeeded();
    }

    const localVersion = await SettingsRepository.getContentVersion();
    const catalogText = await fetchText(`${contentBase}/catalog.json`);

    if (!catalogText) {
      const fallback = await ContentSyncService.seedBundledIfNeeded();
      return {
        ...fallback,
        message: fallback.message ?? 'REMOTE_UNAVAILABLE_USING_BUNDLED',
      };
    }

    const catalog = parseCatalog(JSON.parse(catalogText));
    if (localVersion === catalog.version) {
      return {
        ok: true,
        source: 'cache',
        catalogVersion: catalog.version,
        albumsUpdated: 0,
      };
    }

    const albumsUpdated = await applyCatalog(catalog, false, false);
    return {
      ok: true,
      source: 'remote',
      catalogVersion: catalog.version,
      albumsUpdated,
    };
  },

  async loadAlbumManifest(albumId: string): Promise<AlbumManifest | null> {
    const row = await AlbumRepository.getById(albumId);
    if (!row) return null;

    const path = albumManifestPath(albumId, row.revision);
    const info = await FileSystem.getInfoAsync(path);
    if (!info.exists) return null;

    const json = await FileSystem.readAsStringAsync(path);
    return parseAlbum(JSON.parse(json));
  },
};
