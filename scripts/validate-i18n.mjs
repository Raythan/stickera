#!/usr/bin/env node
/**
 * Ensures en.json and pt.json have the same keys; warns on orphan nameKeys in content.
 */
import fs from 'node:fs';
import path from 'node:path';

import { ROOT, readJson, fail, ok, flattenKeys, getByPath, walkDir } from './lib/utils.mjs';

const LOCALES_DIR = path.join(ROOT, 'src/i18n/locales');
const EN = path.join(LOCALES_DIR, 'en.json');
const PT = path.join(LOCALES_DIR, 'pt.json');

function hasNames(obj) {
  return obj?.names && (obj.names.en || obj.names.pt);
}

function collectNameKeysFromContent() {
  const keys = new Set();
  const contentDir = path.join(ROOT, 'content');
  const files = walkDir(path.join(contentDir, 'albums')).filter((f) => f.endsWith('.json'));
  for (const file of files) {
    const data = readJson(file);
    if (data.nameKey && !hasNames(data)) keys.add(data.nameKey);
    for (const s of data.stickers ?? []) {
      if (s.nameKey && !hasNames(s)) keys.add(s.nameKey);
    }
  }
  const appConfig = path.join(contentDir, 'app-config.json');
  if (fs.existsSync(appConfig)) {
    const cfg = readJson(appConfig);
    if (cfg.signature?.taglineKey) keys.add(cfg.signature.taglineKey);
  }
  return keys;
}

function main() {
  if (!fs.existsSync(EN) || !fs.existsSync(PT)) {
    console.warn('⚠️  validate:i18n — locales ainda não existem (ok antes do scaffold).');
    process.exit(0);
  }

  const en = readJson(EN);
  const pt = readJson(PT);
  const enKeys = new Set(flattenKeys(en));
  const ptKeys = new Set(flattenKeys(pt));

  const missingInPt = [...enKeys].filter((k) => !ptKeys.has(k));
  const missingInEn = [...ptKeys].filter((k) => !enKeys.has(k));

  const details = [];
  if (missingInPt.length) details.push(...missingInPt.map((k) => `pt.json falta: ${k}`));
  if (missingInEn.length) details.push(...missingInEn.map((k) => `en.json falta: ${k}`));
  if (details.length) fail('Paridade en/pt quebrada', details);

  const nameKeys = collectNameKeysFromContent();
  const missingContent = [];
  for (const nk of nameKeys) {
    if (getByPath(en, nk) === undefined) missingContent.push(`en.json sem nameKey do content: ${nk}`);
    if (getByPath(pt, nk) === undefined) missingContent.push(`pt.json sem nameKey do content: ${nk}`);
  }
  if (missingContent.length) fail('nameKeys do content sem tradução', missingContent);

  ok(`i18n OK (${enKeys.size} chaves en/pt)`);
}

main();
