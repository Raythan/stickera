#!/usr/bin/env node
/** Copies app icon into public/ for PWA manifest (served at /stickera/icon-*.png). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(ROOT, 'assets', 'icon.png');
const publicDir = path.join(ROOT, 'public');

if (!fs.existsSync(src)) {
  console.warn('sync-pwa-icons: assets/icon.png missing, skip');
  process.exit(0);
}

fs.mkdirSync(publicDir, { recursive: true });
for (const name of ['icon-192.png', 'icon-512.png']) {
  fs.copyFileSync(src, path.join(publicDir, name));
}
console.log('✅ PWA icons → public/icon-192.png, icon-512.png');
