#!/usr/bin/env node
/**
 * Validates content/catalog.json, app-config.json, and album manifests + image paths.
 * Exit 0 = pass, 1 = fail. Optional helper for SPEC-VALIDATION.md §1.
 */
import fs from 'node:fs';
import path from 'node:path';

import { ROOT, readJson, fail, ok, walkDir } from './lib/utils.mjs';

const CONTENT = path.join(ROOT, 'content');
const CATALOG = path.join(CONTENT, 'catalog.json');
const APP_CONFIG = path.join(CONTENT, 'app-config.json');

const DURATION_UNITS = new Set(['seconds', 'minutes', 'hours']);

function assertDuration(label, d) {
  if (!d || typeof d.value !== 'number' || d.value <= 0 || !DURATION_UNITS.has(d.unit)) {
    fail(`${label}: packCooldown inválido`, [`Esperado { value: number>0, unit: seconds|minutes|hours }`]);
  }
}

function validateCatalog(catalog) {
  if (!catalog.version) fail('catalog.json: falta version');
  if (!Array.isArray(catalog.albums)) fail('catalog.json: albums deve ser array');
  assertDuration('catalog.appConfig', catalog.appConfig?.packCooldown);
  if (typeof catalog.appConfig?.stickersPerPack !== 'number' || catalog.appConfig.stickersPerPack < 1) {
    fail('catalog.json: stickersPerPack deve ser >= 1');
  }
  for (const ref of catalog.albums) {
    if (!ref.id || !ref.revision || !ref.manifestPath) {
      fail('catalog.json: cada album precisa id, revision, manifestPath');
    }
    const manifestFs = path.join(CONTENT, ref.manifestPath.replace(/^\//, ''));
    if (!fs.existsSync(manifestFs)) {
      fail(`catalog.json: manifest não encontrado`, [manifestFs]);
    }
  }
}

const IMAGE_EXT = /\.(png|jpg|jpeg|gif|webp)$/i;

function hasNames(obj) {
  return obj?.names && (obj.names.en || obj.names.pt);
}

function validateAlbum(albumPath, album) {
  const albumDir = path.dirname(albumPath);
  const errors = [];

  const albumLabeled = album.nameKey?.startsWith('albums.') || hasNames(album);
  if (!album.id || !album.revision || !albumLabeled) {
    errors.push(`${albumPath}: id, revision, nameKey (albums.*) ou names.en/pt obrigatórios`);
  }
  const framePath = path.join(albumDir, album.frameStylePath ?? 'frame.css');
  if (!fs.existsSync(framePath)) {
    errors.push(`frame.css ausente: ${path.relative(ROOT, framePath)}`);
  }
  if (!Array.isArray(album.stickers)) {
    errors.push(`${albumPath}: stickers deve ser array (pode ser vazio se só CSS)`);
  }
  const ids = new Set();
  for (const s of album.stickers ?? []) {
    const stickerLabeled = s.nameKey?.startsWith('albums.') || hasNames(s);
    if (!s.id || !stickerLabeled) {
      errors.push(`${albumPath}: sticker ${s.id ?? '?'} precisa id e nameKey ou names.en/pt`);
    }
    if (s.image && !IMAGE_EXT.test(s.image)) {
      errors.push(`${albumPath}: image deve ser stickers/*.(png|jpg|jpeg|gif)`);
    }
    if (ids.has(s.id)) errors.push(`${albumPath}: id duplicado ${s.id}`);
    ids.add(s.id);
    if (s.image) {
      const imgPath = path.join(albumDir, s.image);
      if (!fs.existsSync(imgPath)) {
        errors.push(`Imagem ausente: ${path.relative(ROOT, imgPath)}`);
      }
    }
  }
  if (album.coverImage) {
    const cover = path.join(albumDir, album.coverImage);
    if (!fs.existsSync(cover)) errors.push(`Cover ausente: ${path.relative(ROOT, cover)}`);
  }
  if (errors.length) fail('album.json inválido', errors);
}

function main() {
  if (!fs.existsSync(CATALOG)) fail('content/catalog.json não encontrado');
  const catalog = readJson(CATALOG);
  validateCatalog(catalog);

  if (fs.existsSync(APP_CONFIG)) {
    const appConfig = readJson(APP_CONFIG);
    assertDuration('app-config.json', appConfig.packCooldown);
  }

  const albumJsonFiles = walkDir(path.join(CONTENT, 'albums')).filter((f) => f.endsWith('album.json'));
  for (const albumPath of albumJsonFiles) {
    validateAlbum(albumPath, readJson(albumPath));
  }

  ok(`content OK (${catalog.albums.length} álbum(ns) no catálogo, ${albumJsonFiles.length} manifest(s))`);
}

main();
