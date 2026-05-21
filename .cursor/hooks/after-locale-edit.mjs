#!/usr/bin/env node
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

process.stdin.resume();
process.stdin.on('end', () => {
  const child = spawn(process.execPath, ['scripts/validate-i18n.mjs'], { cwd: ROOT });
  let out = '';
  child.stdout.on('data', (d) => (out += d));
  child.stderr.on('data', (d) => (out += d));
  child.on('close', (code) => {
    const suffix = code === 0 ? '✅ i18n valid' : '❌ i18n validation failed';
    console.log(JSON.stringify({ continue: true, agentMessage: `${suffix}\n${out.trim()}` }));
  });
});
