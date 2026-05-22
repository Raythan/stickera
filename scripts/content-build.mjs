#!/usr/bin/env node
/**
 * Full content pipeline: sync manifests → sync assets → validate.
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function run(script) {
  const r = spawnSync(npmCmd, ['run', script], { cwd: ROOT, stdio: 'inherit', shell: true });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

run('content:sync-manifests');
run('sync:assets');
run('validate:content');

console.log('✅ content:build complete');
