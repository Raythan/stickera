import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

export function fail(message, details = []) {
  console.error(`\n❌ ${message}`);
  for (const d of details) console.error(`   - ${d}`);
  process.exit(1);
}

export function ok(message) {
  console.log(`✅ ${message}`);
}

export function walkDir(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkDir(full, acc);
    else acc.push(full);
  }
  return acc;
}

/** Flatten nested object keys for i18n parity checks */
export function flattenKeys(obj, prefix = '') {
  const keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      keys.push(...flattenKeys(v, key));
    } else {
      keys.push(key);
    }
  }
  return keys;
}

export function getByPath(obj, dotPath) {
  return dotPath.split('.').reduce((acc, part) => (acc == null ? undefined : acc[part]), obj);
}
