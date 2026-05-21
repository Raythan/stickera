#!/usr/bin/env node
/**
 * Rasterize assets/icon.svg → PNGs for Expo + PWA (requires sharp).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SVG_PATH = path.join(ROOT, 'assets', 'icon.svg');
const ASSETS = path.join(ROOT, 'assets');
const BG = '#F7F3ED';

async function main() {
  if (!fs.existsSync(SVG_PATH)) {
    console.error('create-assets: assets/icon.svg não encontrado');
    process.exit(1);
  }

  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.error('create-assets: instale sharp — npm install');
    process.exit(1);
  }

  fs.mkdirSync(ASSETS, { recursive: true });
  const svg = fs.readFileSync(SVG_PATH);

  const icon1024 = await sharp(svg).resize(1024, 1024).png().toBuffer();
  fs.writeFileSync(path.join(ASSETS, 'icon.png'), icon1024);
  fs.writeFileSync(path.join(ASSETS, 'adaptive-icon.png'), icon1024);

  const splashIcon = await sharp(svg).resize(420, 420).png().toBuffer();
  await sharp({
    create: { width: 1024, height: 1024, channels: 4, background: BG },
  })
    .composite([{ input: splashIcon, gravity: 'center' }])
    .png()
    .toFile(path.join(ASSETS, 'splash-icon.png'));

  await sharp(svg).resize(48, 48).png().toFile(path.join(ASSETS, 'favicon.png'));

  console.log('✅ assets/icon.svg → icon, splash-icon, adaptive-icon, favicon');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
