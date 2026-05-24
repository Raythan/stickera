#!/usr/bin/env node
/**
 * Production static PWA for GitHub Pages (project site: /stickera/).
 * Output: dist/ — upload as Pages artifact (app + content/catalog on same origin).
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = 'stickera';
const BASE = `/${REPO}`;
const SITE = `https://raythan.github.io${BASE}`;

const env = {
  ...process.env,
  EXPO_PUBLIC_BASE_URL: BASE,
  EXPO_PUBLIC_CONTENT_BASE_URL: SITE,
  EXPO_PUBLIC_ADMIN_CODE_HASH: process.env.EXPO_PUBLIC_ADMIN_CODE_HASH ?? process.env.ADMIN_CODE_HASH ?? '',
  EXPO_PUBLIC_TRADE_REGISTRY_URL:
    process.env.EXPO_PUBLIC_TRADE_REGISTRY_URL ?? process.env.TRADE_REGISTRY_URL ?? '',
};

console.log(`Building PWA for ${SITE} …`);
execSync('node scripts/write-sw.mjs', { cwd: ROOT, stdio: 'inherit' });
execSync('npx expo export -p web', { cwd: ROOT, stdio: 'inherit', env });

const dist = path.join(ROOT, 'dist');
const content = path.join(ROOT, 'content');

function copyDir(src, dest, skipNames = new Set()) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    if (skipNames.has(name)) continue;
    const s = path.join(src, name);
    const d = path.join(dest, name);
    if (fs.statSync(s).isDirectory()) {
      copyDir(s, d, skipNames);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

// Merge album manifests + art into dist (do not overwrite app index.html)
for (const name of ['catalog.json', 'app-config.json']) {
  const src = path.join(content, name);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(dist, name));
  }
}
const albumsSrc = path.join(content, 'albums');
const albumsDest = path.join(dist, 'albums');
if (fs.existsSync(albumsSrc)) {
  copyDir(albumsSrc, albumsDest);
}

const iconSrc = path.join(ROOT, 'assets', 'icon.png');
const assetsDist = path.join(dist, 'assets');
if (fs.existsSync(iconSrc)) {
  fs.mkdirSync(assetsDist, { recursive: true });
  fs.copyFileSync(iconSrc, path.join(assetsDist, 'icon.png'));
}

execSync('node scripts/write-sw.mjs dist/sw.js', { cwd: ROOT, stdio: 'inherit' });

const publicDir = path.join(ROOT, 'public');
const pwaFiles = [
  'manifest.webmanifest',
  'sw.js',
  'icon-192.png',
  'icon-512.png',
  'icon.svg',
];
for (const name of pwaFiles) {
  const src = path.join(publicDir, name);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(dist, name));
  }
}

const pkgVersion = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version;
const manifestPath = path.join(dist, 'manifest.webmanifest');
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  manifest.version = pkgVersion;
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

fs.writeFileSync(path.join(dist, '.nojekyll'), '');

const indexHtml = path.join(dist, 'index.html');
if (fs.existsSync(indexHtml)) {
  fs.copyFileSync(indexHtml, path.join(dist, '404.html'));
}

execSync('node scripts/validate-pwa.mjs dist', { cwd: ROOT, stdio: 'inherit' });

console.log('✅ dist/ ready for GitHub Pages (PWA + content)');
