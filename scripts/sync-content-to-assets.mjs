#!/usr/bin/env node
/**
 * Copies content/albums (frame.css + album.json) into assets/content for Expo bundle.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_ALBUMS = path.join(ROOT, 'content', 'albums');
const DEST_ROOT = path.join(ROOT, 'assets', 'content');
const DEST_ALBUMS = path.join(DEST_ROOT, 'albums');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const s = path.join(src, name);
    const d = path.join(dest, name);
    if (fs.statSync(s).isDirectory()) {
      if (name === '_source') continue;
      copyDir(s, d);
    } else if (/\.(css|json|png|jpe?g|gif|webp)$/i.test(name)) {
      fs.copyFileSync(s, d);
    }
  }
}

fs.mkdirSync(DEST_ROOT, { recursive: true });
for (const f of ['catalog.json', 'app-config.json']) {
  const src = path.join(ROOT, 'content', f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(DEST_ROOT, f));
  }
}

if (fs.existsSync(SRC_ALBUMS)) {
  copyDir(SRC_ALBUMS, DEST_ALBUMS);
  console.log('✅ content/albums → assets/content/albums');
} else {
  console.warn('sync-content-to-assets: no content/albums');
}
console.log('✅ content/catalog.json → assets/content/');
