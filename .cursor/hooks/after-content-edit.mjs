#!/usr/bin/env node
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

let input = '';
process.stdin.on('data', (c) => (input += c));
process.stdin.on('end', () => {
  const child = spawn(process.execPath, ['scripts/validate-content.mjs'], { cwd: ROOT, shell: false });
  let out = '';
  child.stdout.on('data', (d) => (out += d));
  child.stderr.on('data', (d) => (out += d));
  child.on('close', (code) => {
    const suffix = code === 0 ? '✅ content valid' : '❌ content validation failed — run npm run validate:content';
    console.log(JSON.stringify({ continue: true, agentMessage: `${suffix}\n${out.trim()}` }));
  });
});
