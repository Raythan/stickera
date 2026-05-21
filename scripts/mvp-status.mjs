#!/usr/bin/env node
/**
 * Parses docs/MVP-CHECKLIST.md and prints pending items.
 */
import fs from 'node:fs';
import path from 'node:path';

import { ROOT, ok } from './lib/utils.mjs';

const CHECKLIST = path.join(ROOT, 'docs/MVP-CHECKLIST.md');

function main() {
  const md = fs.readFileSync(CHECKLIST, 'utf8');
  const lines = md.split('\n');
  let phase = '';
  const pending = [];
  const done = [];

  for (const line of lines) {
    const phaseMatch = line.match(/^## Phase (\d+)/);
    if (phaseMatch) phase = `Phase ${phaseMatch[1]}`;
    const itemMatch = line.match(/^- \[([ x])\] (.+)$/);
    if (itemMatch) {
      const entry = `${phase}: ${itemMatch[2]}`;
      if (itemMatch[1] === ' ') pending.push(entry);
      else done.push(entry);
    }
  }

  console.log('\n📋 Stickera MVP status\n');
  console.log(`Done: ${done.length} | Pending: ${pending.length}\n`);
  if (pending.length) {
    console.log('Pending:');
    pending.slice(0, 15).forEach((p) => console.log(`  - ${p}`));
    if (pending.length > 15) console.log(`  ... +${pending.length - 15} more`);
  } else {
    console.log('All checklist items marked done.');
  }
  ok('mvp-status');
}

main();
