#!/usr/bin/env node
/**
 * Generate SHA-256 hex for admin unlock (EXPO_PUBLIC_ADMIN_CODE_HASH / ADMIN_CODE_HASH secret).
 * Usage: node scripts/hash-admin-code.mjs "your-secret-phrase"
 */
import { createHash } from 'node:crypto';

const phrase = process.argv[2];
if (!phrase) {
  console.error('Usage: node scripts/hash-admin-code.mjs "your-secret-phrase"');
  process.exit(1);
}

const hash = createHash('sha256').update(phrase, 'utf8').digest('hex');
console.log(hash);
console.log('\nAdd to .env: EXPO_PUBLIC_ADMIN_CODE_HASH=' + hash);
console.log('GitHub secret: ADMIN_CODE_HASH=' + hash);
