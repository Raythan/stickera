#!/usr/bin/env node
/**
 * Ensures offline bundle config: app.json patterns + content/catalog.json on disk.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const APP_JSON = path.join(ROOT, 'app.json');
const CATALOG = path.join(ROOT, 'content', 'catalog.json');

function fail(msg) {
  console.error(`validate-bundle: ${msg}`);
  process.exit(1);
}

if (!fs.existsSync(CATALOG)) {
  fail('content/catalog.json não encontrado');
}

const app = JSON.parse(fs.readFileSync(APP_JSON, 'utf8'));
const patterns = app?.expo?.assetBundlePatterns ?? [];

const required = ['content/catalog.json', 'content/app-config.json'];
for (const p of required) {
  if (!patterns.includes(p)) {
    fail(`app.json assetBundlePatterns deve incluir "${p}"`);
  }
}

const hasAlbumAssets = patterns.some(
  (p) => typeof p === 'string' && p.startsWith('content/albums/'),
);
if (!hasAlbumAssets) {
  fail('app.json assetBundlePatterns deve incluir content/albums/**');
}

console.log('✅ validate-bundle: catalog + app.json patterns OK');
