#!/usr/bin/env node
/**
 * Validates PWA artifacts in dist/ (run after build:web).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const distArg = process.argv[2];
const DIST = distArg ? path.resolve(ROOT, distArg) : path.join(ROOT, 'dist');

function fail(msg) {
  console.error(`validate-pwa: ${msg}`);
  process.exit(1);
}

if (!fs.existsSync(DIST)) {
  fail(`dist not found at ${DIST} — run npm run build:web first`);
}

const requiredFiles = [
  'manifest.webmanifest',
  'sw.js',
  'icon-192.png',
  'icon-512.png',
];

for (const file of requiredFiles) {
  const full = path.join(DIST, file);
  if (!fs.existsSync(full)) {
    fail(`missing ${file} in dist/`);
  }
}

const manifestPath = path.join(DIST, 'manifest.webmanifest');
let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
} catch {
  fail('manifest.webmanifest is not valid JSON');
}

if (manifest.display !== 'standalone') {
  fail('manifest.display must be "standalone"');
}
if (manifest.start_url !== '/stickera/') {
  fail(`manifest.start_url must be "/stickera/" (got ${manifest.start_url})`);
}
if (manifest.scope !== '/stickera/') {
  fail(`manifest.scope must be "/stickera/" (got ${manifest.scope})`);
}

const icons = manifest.icons ?? [];
const has192 = icons.some((i) => i.sizes === '192x192' && i.type === 'image/png');
const has512 = icons.some((i) => i.sizes === '512x512' && i.type === 'image/png');
if (!has192 || !has512) {
  fail('manifest.icons must include 192x192 and 512x512 PNG entries');
}

const sw = fs.readFileSync(path.join(DIST, 'sw.js'), 'utf8');
if (!sw.includes("const BASE = '/stickera/'")) {
  fail('sw.js must scope cache to /stickera/');
}

console.log('✅ validate-pwa: dist PWA artifacts OK');
