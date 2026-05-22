import fs from 'node:fs';
import path from 'node:path';

import { ROOT, readJson } from './utils.mjs';

export const CONTENT = path.join(ROOT, 'content');
export const ALBUMS_DIR = path.join(CONTENT, 'albums');
export const CATALOG_PATH = path.join(CONTENT, 'catalog.json');
export const DEFAULT_FRAME = path.join(CONTENT, 'templates', 'default-frame.css');
export const RARITY_MODIFIERS = path.join(CONTENT, 'templates', 'rarity-modifiers.css');

const IMAGE_EXT = /\.(png|jpe?g|gif|webp)$/i;
const ALBUM_ID_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function parseArgs(argv) {
  const flags = new Set();
  const positional = [];
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') flags.add('dry-run');
    else if (a === '--force') flags.add('force');
    else if (a === '--bump-revision') flags.add('bump-revision');
    else if (a === '--album' && argv[i + 1]) {
      opts.album = argv[++i];
    } else if (a === '--title-en' && argv[i + 1]) {
      opts.titleEn = argv[++i];
    } else if (a === '--title-pt' && argv[i + 1]) {
      opts.titlePt = argv[++i];
    } else if (!a.startsWith('-')) positional.push(a);
  }
  return { flags, positional, opts };
}

export function assertAlbumId(id) {
  if (!id || !ALBUM_ID_RE.test(id)) {
    console.error('Album id inválido: use slug a-z, 0-9, hífens (ex.: meu-album)');
    process.exit(1);
  }
}

/** Natural sort for sticker filenames (01-foo before 02-bar). */
export function naturalCompare(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

export function listStickerFiles(stickersDir) {
  if (!fs.existsSync(stickersDir)) return [];
  return fs
    .readdirSync(stickersDir)
    .filter((name) => IMAGE_EXT.test(name))
    .sort(naturalCompare);
}

export function slugToTitle(slug) {
  const base = slug.replace(/\.[^.]+$/, '').replace(/^\d+[-_]?/, '');
  const words = base.split(/[-_]+/).filter(Boolean);
  if (words.length === 0) return 'Sticker';
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

export function bumpCatalogVersion(version) {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const prefix = `${y}.${m}.${d}`;
  if (!version || !version.startsWith(prefix)) return `${prefix}.1`;
  const parts = version.split('.');
  const n = parseInt(parts[3] ?? '0', 10);
  return `${prefix}.${Number.isFinite(n) ? n + 1 : 1}`;
}

export function readCatalog() {
  if (!fs.existsSync(CATALOG_PATH)) {
    return {
      version: bumpCatalogVersion(null),
      baseUrl: '',
      albums: [],
      appConfig: {
        packCooldown: { value: 4, unit: 'hours' },
        stickersPerPack: 4,
        tradeRequiresConfirmation: true,
      },
    };
  }
  return readJson(CATALOG_PATH);
}

export function writeJson(filePath, data, dryRun) {
  const text = `${JSON.stringify(data, null, 2)}\n`;
  if (dryRun) {
    console.log(`[dry-run] would write ${path.relative(ROOT, filePath)}`);
    return;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text, 'utf8');
}

export function stickerEntriesFromFiles(albumId, files, existingByImage) {
  return files.map((filename, index) => {
    const image = `stickers/${filename}`;
    const number = index + 1;
    const id = `${albumId}:${String(number).padStart(2, '0')}`;
    const prev = existingByImage.get(image);
    if (prev) {
      return {
        ...prev,
        id,
        number,
        image,
      };
    }
    const title = slugToTitle(filename);
    return {
      id,
      number,
      names: { en: title, pt: title },
      image,
    };
  });
}

export function stickersFingerprint(stickers) {
  return JSON.stringify(
    (stickers ?? []).map((s) => ({ id: s.id, image: s.image, number: s.number })),
  );
}

export function syncAlbumManifest(albumId, { dryRun = false, bumpRevision = false } = {}) {
  const albumDir = path.join(ALBUMS_DIR, albumId);
  const albumPath = path.join(albumDir, 'album.json');
  if (!fs.existsSync(albumDir)) {
    console.error(`Álbum não encontrado: ${albumDir}`);
    process.exit(1);
  }

  const files = listStickerFiles(path.join(albumDir, 'stickers'));
  let album = fs.existsSync(albumPath)
    ? readJson(albumPath)
    : {
        id: albumId,
        revision: 1,
        frameStylePath: 'frame.css',
        totalStickers: 0,
        names: { en: albumId, pt: albumId },
        stickers: [],
      };

  const existingByImage = new Map();
  for (const s of album.stickers ?? []) {
    if (s.image) existingByImage.set(s.image, s);
  }

  const before = stickersFingerprint(album.stickers);
  const stickers = stickerEntriesFromFiles(albumId, files, existingByImage);
  const after = stickersFingerprint(stickers);
  const changed = before !== after;

  album.id = albumId;
  album.frameStylePath = album.frameStylePath ?? 'frame.css';
  album.stickers = stickers;
  album.totalStickers = stickers.length;
  if (!album.coverImage && stickers[0]?.image) {
    album.coverImage = stickers[0].image;
  }
  if (!album.names?.en && !album.names?.pt && !album.nameKey) {
    album.names = { en: slugToTitle(albumId), pt: slugToTitle(albumId) };
  }
  if (changed || bumpRevision) {
    album.revision = (album.revision ?? 0) + 1;
  }

  writeJson(albumPath, album, dryRun);
  console.log(
    `✅ ${albumId}: ${stickers.length} sticker(s)${changed ? ' (manifest updated)' : ''}`,
  );
  return { album, changed };
}

export function ensureCatalogEntry(catalog, albumId, revision, dryRun) {
  const manifestPath = `/albums/${albumId}/album.json`;
  const idx = catalog.albums.findIndex((a) => a.id === albumId);
  let catalogChanged = false;
  if (idx < 0) {
    catalog.albums.push({ id: albumId, revision, manifestPath });
    catalogChanged = true;
  } else if (catalog.albums[idx].revision !== revision) {
    catalog.albums[idx].revision = revision;
    catalogChanged = true;
  }
  if (catalogChanged) {
    catalog.version = bumpCatalogVersion(catalog.version);
    writeJson(CATALOG_PATH, catalog, dryRun);
    console.log(`✅ catalog.json → version ${catalog.version}`);
  }
}

export function copyDefaultFrame(destPath, force, dryRun) {
  if (fs.existsSync(destPath) && !force) return false;
  if (!fs.existsSync(DEFAULT_FRAME)) {
    console.error('Template ausente:', DEFAULT_FRAME);
    process.exit(1);
  }
  if (dryRun) {
    console.log(`[dry-run] would copy frame.css → ${path.relative(ROOT, destPath)}`);
    return true;
  }
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  const base = fs.readFileSync(DEFAULT_FRAME, 'utf8');
  const modifiers = fs.existsSync(RARITY_MODIFIERS)
    ? `\n${fs.readFileSync(RARITY_MODIFIERS, 'utf8')}`
    : '';
  fs.writeFileSync(destPath, base.includes('sticker-frame--common') ? base : `${base}${modifiers}`);
  console.log(`✅ frame.css → ${path.relative(ROOT, destPath)}`);
  return true;
}
