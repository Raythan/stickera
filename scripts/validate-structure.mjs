#!/usr/bin/env node
/**
 * Validates repo folders required by ARCHITECTURE / AGENTS.
 * mode=strict after Expo scaffold; mode=docs-only before app exists.
 */
import fs from 'node:fs';
import path from 'node:path';

import { ROOT, fail, ok } from './lib/utils.mjs';

const ALWAYS = [
  'docs/ARCHITECTURE.md',
  'docs/ATOMIC-DESIGN.md',
  'docs/SDD-DEVELOPMENT.md',
  'docs/SPEC-VALIDATION.md',
  'docs/DEVELOPMENT-STANDARDS.md',
  'AGENTS.md',
  '.cursor/rules',
  '.cursor/skills',
  'content/catalog.json',
  'scripts/validate-content.mjs',
];

const AFTER_SCAFFOLD = [
  'app',
  'src/components/atoms',
  'src/components/molecules',
  'src/components/organisms',
  'src/components/templates',
  'src/domain',
  'src/domain/validators',
  'src/services/db',
  'src/services/sync',
  'src/features',
  'src/i18n',
  'src/theme',
  'package.json',
];

function main() {
  const strict = process.argv.includes('--strict');
  const missing = [];

  for (const rel of ALWAYS) {
    if (!fs.existsSync(path.join(ROOT, rel))) missing.push(rel);
  }

  if (strict) {
    for (const rel of AFTER_SCAFFOLD) {
      if (!fs.existsSync(path.join(ROOT, rel))) missing.push(rel);
    }
  }

  if (missing.length) {
    fail(strict ? 'Estrutura strict incompleta' : 'Estrutura base incompleta', missing);
  }

  ok(strict ? 'structure OK (strict)' : 'structure OK (base)');
}

main();
