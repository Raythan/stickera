import type { AlbumManifest, Catalog, CatalogAlbumRef, SyncResult } from '@/domain/types';
import { parseAlbum } from '@/domain/validators/album';
import { parseCatalog } from '@/domain/validators/catalog';
import { AlbumRepository } from '@/services/db/AlbumRepository';
import { PackStateRepository } from '@/services/db/PackStateRepository';
import { SettingsRepository, SETTINGS_KEYS } from '@/services/db/SettingsRepository';
import { getContentBaseUrl } from '@/config/contentBase';
import { albumStickerUrl } from '@/services/content/paths';

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.text();
  } catch {
    return null;
  }
}

async function persistAlbumMetadata(manifest: AlbumManifest): Promise<void> {
  let coverUri: string | null = null;
  if (manifest.coverImage) {
    coverUri = albumStickerUrl(manifest.id, manifest.coverImage);
  }
  await AlbumRepository.upsertFromManifest(manifest, coverUri);
}

async function syncAlbumRef(
  ref: CatalogAlbumRef,
  baseUrl: string,
  force: boolean,
): Promise<boolean> {
  const existing = await AlbumRepository.getById(ref.id);
  if (!force && existing && existing.revision >= ref.revision) {
    return false;
  }

  const manifestRel = ref.manifestPath.replace(/^\//, '');
  const manifestJson = await fetchText(`${baseUrl}/${manifestRel}`);
  if (!manifestJson) return false;

  const manifest = parseAlbum(JSON.parse(manifestJson));
  await persistAlbumMetadata(manifest);
  return true;
}

async function applyCatalog(
  catalog: Catalog,
  force: boolean,
): Promise<number> {
  const baseUrl = catalog.baseUrl || getContentBaseUrl() || '';
  let updated = 0;

  for (const ref of catalog.albums) {
    const changed = await syncAlbumRef(ref, baseUrl, force);
    if (changed) updated += 1;
  }

  await SettingsRepository.setContentVersion(catalog.version);
  await SettingsRepository.set(SETTINGS_KEYS.appConfig, JSON.stringify(catalog.appConfig));
  return updated;
}

export const ContentSyncService = {
  async seedBundledIfNeeded(): Promise<SyncResult> {
    await PackStateRepository.ensureInitialized();

    const localVersion = await SettingsRepository.getContentVersion();
    const contentBase = getContentBaseUrl();
    if (!contentBase) {
      return {
        ok: false,
        source: 'bundled',
        catalogVersion: localVersion ?? '',
        albumsUpdated: 0,
        message: 'NO_CONTENT_BASE',
      };
    }

    const catalogText = await fetchText(`${contentBase}/catalog.json`);
    if (!catalogText) {
      return {
        ok: localVersion !== null,
        source: 'cache',
        catalogVersion: localVersion ?? '',
        albumsUpdated: 0,
        message: localVersion ? undefined : 'CATALOG_FETCH_FAILED',
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

    const albumsUpdated = await applyCatalog(catalog, true);
    return {
      ok: true,
      source: 'bundled',
      catalogVersion: catalog.version,
      albumsUpdated,
    };
  },

  async syncFromRemote(): Promise<SyncResult> {
    await PackStateRepository.ensureInitialized();

    const contentBase = getContentBaseUrl();
    if (!contentBase) {
      return ContentSyncService.seedBundledIfNeeded();
    }

    const localVersion = await SettingsRepository.getContentVersion();
    const catalogText = await fetchText(`${contentBase}/catalog.json`);

    if (!catalogText) {
      return {
        ok: localVersion !== null,
        source: 'cache',
        catalogVersion: localVersion ?? '',
        albumsUpdated: 0,
        message: 'REMOTE_UNAVAILABLE',
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

    const albumsUpdated = await applyCatalog(catalog, false);
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

    const contentBase = getContentBaseUrl();
    if (!contentBase) return null;

    const url = `${contentBase}/albums/${albumId}/album.json`;
    const json = await fetchText(url);
    if (!json) return null;
    return parseAlbum(JSON.parse(json));
  },
};
