#!/usr/bin/env node
/**
 * Scaffold a new album under content/albums/<id>/.
 * Usage: node scripts/content-scaffold.mjs <album-id> [--title-en "..."] [--title-pt "..."] [--force]
 */
import fs from 'node:fs';
import path from 'node:path';

import {
  ALBUMS_DIR,
  assertAlbumId,
  bumpCatalogVersion,
  copyDefaultFrame,
  ensureCatalogEntry,
  parseArgs,
  readCatalog,
  writeJson,
} from './lib/content-album.mjs';
import { ROOT } from './lib/utils.mjs';

const { flags, positional, opts } = parseArgs(process.argv.slice(2));
const dryRun = flags.has('dry-run');
const force = flags.has('force');
const albumId = positional[0];

if (!albumId) {
  console.error('Uso: npm run content:scaffold -- <album-id> [--title-en "..."] [--title-pt "..."]');
  process.exit(1);
}

assertAlbumId(albumId);

const albumDir = path.join(ALBUMS_DIR, albumId);
const stickersDir = path.join(albumDir, 'stickers');
const albumPath = path.join(albumDir, 'album.json');
const framePath = path.join(albumDir, 'frame.css');

if (fs.existsSync(albumDir) && !force) {
  console.error(`Álbum já existe: ${path.relative(ROOT, albumDir)} (use --force para sobrescrever manifest/frame)`);
  process.exit(1);
}

const titleEn = opts.titleEn ?? albumId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const titlePt = opts.titlePt ?? titleEn;

if (!dryRun) {
  fs.mkdirSync(stickersDir, { recursive: true });
}

copyDefaultFrame(framePath, force, dryRun);

const album = {
  id: albumId,
  revision: 1,
  frameStylePath: 'frame.css',
  totalStickers: 0,
  names: { en: titleEn, pt: titlePt },
  stickers: [],
};

writeJson(albumPath, album, dryRun);

const catalog = readCatalog();
if (!catalog.albums.some((a) => a.id === albumId)) {
  catalog.albums.push({
    id: albumId,
    revision: 1,
    manifestPath: `/albums/${albumId}/album.json`,
  });
  catalog.version = bumpCatalogVersion(catalog.version);
  writeJson(path.join(ROOT, 'content', 'catalog.json'), catalog, dryRun);
} else {
  ensureCatalogEntry(catalog, albumId, 1, dryRun);
}

console.log(`\nPróximo: coloque imagens em content/albums/${albumId}/stickers/`);
console.log(`Depois: npm run content:build`);
