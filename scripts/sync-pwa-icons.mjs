#!/usr/bin/env node
/** Resizes app icon into public/ for PWA manifest (192 and 512 px). */
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

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error('sync-pwa-icons: sharp not installed — npm install');
  process.exit(1);
}

fs.mkdirSync(publicDir, { recursive: true });

await sharp(src).resize(192, 192).png().toFile(path.join(publicDir, 'icon-192.png'));
await sharp(src).resize(512, 512).png().toFile(path.join(publicDir, 'icon-512.png'));

console.log('✅ PWA icons → public/icon-192.png (192×192), icon-512.png (512×512)');
