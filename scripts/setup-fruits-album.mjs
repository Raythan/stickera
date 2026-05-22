#!/usr/bin/env node
/**
 * Rebuild fruits album from _source/ (all imgdl variants per fruit).
 * Usage: node scripts/setup-fruits-album.mjs [--from-root]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  ALBUMS_DIR,
  CATALOG_PATH,
  bumpCatalogVersion,
  readCatalog,
  writeJson,
} from './lib/content-album.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const ALBUM_ID = 'fruits';
const ALBUM_DIR = path.join(ALBUMS_DIR, ALBUM_ID);
const STICKERS_DIR = path.join(ALBUM_DIR, 'stickers');
const SOURCE_DIR = path.join(ALBUM_DIR, '_source');

const FRUITS = [
  ['Abacate', 'abacate', 'Avocado', 'Abacate'],
  ['Abacaxi', 'abacaxi', 'Pineapple', 'Abacaxi'],
  ['Açaí', 'acai', 'Açaí', 'Açaí'],
  ['Acerola', 'acerola', 'Barbados cherry', 'Acerola'],
  ['Ameixa', 'ameixa', 'Plum', 'Ameixa'],
  ['Amora', 'amora', 'Blackberry', 'Amora'],
  ['Araticum', 'araticum', 'Araticum', 'Araticum'],
  ['Atemoia', 'atemoia', 'Atemoya', 'Atemoia'],
  ['Bacuri', 'bacuri', 'Bacuri', 'Bacuri'],
  ['Banana', 'banana', 'Banana', 'Banana'],
  ['Buriti', 'buriti', 'Buriti', 'Buriti'],
  ['Cacau', 'cacau', 'Cacao fruit', 'Cacau'],
  ['Cagaita', 'cagaita', 'Cagaita', 'Cagaita'],
  ['Caju', 'caju', 'Cashew fruit', 'Caju'],
  ['Caqui', 'caqui', 'Persimmon', 'Caqui'],
  ['Carambola', 'carambola', 'Star fruit', 'Carambola'],
  ['Cereja', 'cereja', 'Cherry', 'Cereja'],
  ['Cidra', 'cidra', 'Citron', 'Cidra'],
  ['Coco', 'coco', 'Coconut', 'Coco'],
  ['Cupuaçu', 'cupuacu', 'Cupuaçu', 'Cupuaçu'],
  ['Damasco', 'damasco', 'Apricot', 'Damasco'],
  ['Figo', 'figo', 'Fig', 'Figo'],
  ['Framboesa', 'framboesa', 'Raspberry', 'Framboesa'],
  ['Fruta-pão', 'fruta-pao', 'Breadfruit', 'Fruta-pão'],
  ['Goiaba', 'goiaba', 'Guava', 'Goiaba'],
  ['Graviola', 'graviola', 'Soursop', 'Graviola'],
  ['Groselha', 'groselha', 'Gooseberry', 'Groselha'],
  ['Guaraná', 'guarana', 'Guaraná', 'Guaraná'],
  ['Jabuticaba', 'jabuticaba', 'Jabuticaba', 'Jabuticaba'],
  ['Jaca', 'jaca', 'Jackfruit', 'Jaca'],
  ['Jambo', 'jambo', 'Rose apple', 'Jambo'],
  ['Jambolão', 'jambolao', 'Jambolan', 'Jambolão'],
  ['Jaracatiá', 'jaracatia', 'Jaracatiá', 'Jaracatiá'],
  ['Kiwi', 'kiwi', 'Kiwi', 'Kiwi'],
  ['Laranja', 'laranja', 'Orange', 'Laranja'],
  ['Lichia', 'lichia', 'Lychee', 'Lichia'],
  ['Limão', 'limao', 'Lime', 'Limão'],
  ['Maçã', 'maca', 'Apple', 'Maçã'],
  ['Mamão', 'mamao', 'Papaya', 'Mamão'],
  ['Manga', 'manga', 'Mango', 'Manga'],
  ['Mangaba', 'mangaba', 'Mangaba', 'Mangaba'],
  ['Maracujá', 'maracuja', 'Passion fruit', 'Maracujá'],
  ['Melancia', 'melancia', 'Watermelon', 'Melancia'],
  ['Melão', 'melao', 'Melon', 'Melão'],
  ['Mirtilo', 'mirtilo', 'Blueberry', 'Mirtilo'],
  ['Morango', 'morango', 'Strawberry', 'Morango'],
  ['Nectarina', 'nectarina', 'Nectarine', 'Nectarina'],
  ['Nêspera', 'nespera', 'Loquat', 'Nêspera'],
  ['Pequi', 'pequi', 'Pequi', 'Pequi'],
  ['Pêra', 'pera', 'Pear', 'Pêra'],
];

const IMAGE_RE = /\.(jpg|jpeg|png|gif|webp)$/i;

function listSourceFiles(includeRoot) {
  const files = [];
  const dirs = [SOURCE_DIR];
  if (includeRoot) dirs.push(ALBUM_DIR);
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      if (!fs.statSync(full).isFile() || !IMAGE_RE.test(f)) continue;
      if (dir === ALBUM_DIR && (f === 'imgdl.py' || f.endsWith('.css') || f.endsWith('.json'))) continue;
      files.push({ name: f, dir });
    }
  }
  return files;
}

function sortVariants(files) {
  return files.slice().sort((a, b) => {
    const na = parseInt(a.match(/_(\d+)\./i)?.[1] ?? '0', 10);
    const nb = parseInt(b.match(/_(\d+)\./i)?.[1] ?? '0', 10);
    return na - nb || a.localeCompare(b, undefined, { numeric: true });
  });
}

function groupByFruit(entries) {
  const map = new Map();
  for (const { name } of entries) {
    const m = name.match(/^(.+)_(\d+)\.([^.]+)$/i);
    if (!m) continue;
    const key = m[1];
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(name);
  }
  return map;
}

function rarityFor(index, total) {
  const t = index / total;
  if (t < 0.04) return 'legendary';
  if (t < 0.12) return 'rare';
  if (t < 0.35) return 'uncommon';
  return 'common';
}

function wipeStickers() {
  if (fs.existsSync(STICKERS_DIR)) {
    for (const f of fs.readdirSync(STICKERS_DIR)) {
      fs.unlinkSync(path.join(STICKERS_DIR, f));
    }
  } else {
    fs.mkdirSync(STICKERS_DIR, { recursive: true });
  }
}

function main() {
  const includeRoot = process.argv.includes('--from-root');
  fs.mkdirSync(SOURCE_DIR, { recursive: true });

  const entries = listSourceFiles(includeRoot);
  if (entries.length === 0) {
    console.error('Nenhuma imagem em _source/ (ou na raiz do álbum).');
    process.exit(1);
  }

  for (const { name, dir } of entries) {
    if (dir === ALBUM_DIR) {
      const dest = path.join(SOURCE_DIR, name);
      if (!fs.existsSync(dest)) fs.renameSync(path.join(ALBUM_DIR, name), dest);
    }
  }

  const groups = groupByFruit(listSourceFiles(false));
  wipeStickers();

  const stickers = [];
  const missing = [];
  let globalNum = 0;
  const pad = (n) => String(n).padStart(3, '0');

  for (const [key, slug, en, pt] of FRUITS) {
    const files = groups.get(key);
    if (!files?.length) {
      missing.push(key);
      continue;
    }
    for (const srcName of sortVariants(files)) {
      globalNum += 1;
      const variant = srcName.match(/_(\d+)\./i)?.[1] ?? '0';
      const ext = path.extname(srcName).toLowerCase();
      const filename = `${pad(globalNum)}-${slug}-${variant}${ext}`;
      fs.copyFileSync(path.join(SOURCE_DIR, srcName), path.join(STICKERS_DIR, filename));

      const label = files.length > 1 ? ` ${variant}` : '';
      stickers.push({
        id: `${ALBUM_ID}:${pad(globalNum)}`,
        number: globalNum,
        names: { en: `${en}${label}`, pt: `${pt}${label}` },
        image: `stickers/${filename}`,
      });
    }
  }

  for (let i = 0; i < stickers.length; i++) {
    stickers[i].rarity = rarityFor(i, stickers.length);
  }

  if (missing.length) {
    console.warn('Sem imagem para:', missing.join(', '));
  }

  const prevRevision = fs.existsSync(path.join(ALBUM_DIR, 'album.json'))
    ? (JSON.parse(fs.readFileSync(path.join(ALBUM_DIR, 'album.json'), 'utf8')).revision ?? 0)
    : 0;

  const album = {
    id: ALBUM_ID,
    revision: prevRevision + 1,
    frameStylePath: 'frame.css',
    totalStickers: stickers.length,
    names: { en: 'Brazilian Fruits', pt: 'Frutas Brasileiras' },
    coverImage: stickers[0]?.image,
    packWeight: 1,
    stickers,
  };

  writeJson(path.join(ALBUM_DIR, 'album.json'), album, false);

  const catalog = readCatalog();
  catalog.albums = catalog.albums.filter((a) => a.id !== ALBUM_ID);
  catalog.albums.push({
    id: ALBUM_ID,
    revision: album.revision,
    manifestPath: `/albums/${ALBUM_ID}/album.json`,
  });
  catalog.version = bumpCatalogVersion(catalog.version);
  writeJson(CATALOG_PATH, catalog, false);

  console.log(`✅ fruits: ${stickers.length} figurinhas (todas as variantes em _source/)`);
  console.log(`✅ revision ${album.revision} | catalog ${catalog.version}`);
}

main();
