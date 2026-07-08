#!/usr/bin/env node
/**
 * Ensure the Electron binary is present. npm's allow-scripts gate can skip
 * electron's postinstall, leaving a partial dist/ (LICENSE only, no path.txt).
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const electronDir = path.join(root, 'node_modules', 'electron');
const pathFile = path.join(electronDir, 'path.txt');
const platformPath = process.platform === 'darwin'
  ? 'Electron.app/Contents/MacOS/Electron'
  : process.platform === 'win32' ? 'electron.exe' : 'electron';

function electronReady() {
  if (!fs.existsSync(pathFile)) return false;
  const rel = fs.readFileSync(pathFile, 'utf8').trim();
  return fs.existsSync(path.join(electronDir, 'dist', rel));
}

if (!electronReady()) {
  console.log('[ensure-electron] Electron binary missing — running install.js…');
  const res = spawnSync(process.execPath, [path.join(electronDir, 'install.js')], {
    cwd: root,
    stdio: 'inherit',
  });
  if (res.status !== 0 || !electronReady()) {
    console.error('[ensure-electron] install failed. Try: npm approve-scripts electron && npm rebuild electron');
    process.exit(res.status || 1);
  }
}

// install.js writes path.txt without trimming; guard against a stray newline.
const rel = fs.readFileSync(pathFile, 'utf8').trim();
if (rel !== fs.readFileSync(pathFile, 'utf8')) {
  fs.writeFileSync(pathFile, rel);
}
