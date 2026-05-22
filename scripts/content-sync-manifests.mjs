#!/usr/bin/env node
/**
 * Merge sticker files into album.json manifests; sync catalog revisions.
 * Usage: node scripts/content-sync-manifests.mjs [--album <id>] [--dry-run] [--bump-revision]
 */
import fs from 'node:fs';
import path from 'node:path';

import {
  ALBUMS_DIR,
  CATALOG_PATH,
  bumpCatalogVersion,
  copyDefaultFrame,
  ensureCatalogEntry,
  parseArgs,
  readCatalog,
  syncAlbumManifest,
  writeJson,
} from './lib/content-album.mjs';
import { readJson } from './lib/utils.mjs';

const { flags, opts } = parseArgs(process.argv.slice(2));
const dryRun = flags.has('dry-run');
const bumpRevision = flags.has('bump-revision');

function listAlbumIds() {
  if (!fs.existsSync(ALBUMS_DIR)) return [];
  return fs
    .readdirSync(ALBUMS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

const ids = opts.album ? [opts.album] : listAlbumIds();
if (ids.length === 0) {
  console.warn('Nenhum álbum em content/albums/');
  process.exit(0);
}

let anyChanged = false;
const catalog = readCatalog();

for (const albumId of ids) {
  const albumDir = path.join(ALBUMS_DIR, albumId);
  const framePath = path.join(albumDir, 'frame.css');
  if (fs.existsSync(albumDir) && !fs.existsSync(framePath)) {
    copyDefaultFrame(framePath, false, dryRun);
  }

  const { album, changed } = syncAlbumManifest(albumId, { dryRun, bumpRevision });
  if (changed) anyChanged = true;
  ensureCatalogEntry(catalog, albumId, album.revision, dryRun);
}

for (const albumId of listAlbumIds()) {
  const albumPath = path.join(ALBUMS_DIR, albumId, 'album.json');
  if (!fs.existsSync(albumPath)) continue;
  const album = readJson(albumPath);
  if (!catalog.albums.some((a) => a.id === albumId)) {
    catalog.albums.push({
      id: albumId,
      revision: album.revision ?? 1,
      manifestPath: `/albums/${albumId}/album.json`,
    });
    anyChanged = true;
  }
}

if (anyChanged) {
  catalog.version = bumpCatalogVersion(catalog.version);
  writeJson(CATALOG_PATH, catalog, dryRun);
}

console.log('✅ content:sync-manifests done');
