#!/usr/bin/env node
'use strict';

/**
 * Copies built @mbit-erp/config into apps/server/node_modules as real files.
 * Required for Electron packaging (workspaces=false install omits or breaks file: links).
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '../../..');
const configRoot = path.join(repoRoot, 'packages', 'config');
const distIndex = path.join(configRoot, 'dist', 'index.js');
const targetRoot = path.join(repoRoot, 'apps', 'server', 'node_modules', '@mbit-erp', 'config');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to);
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

if (!fs.existsSync(distIndex)) {
  console.error('[ensure-backend-config] Missing packages/config/dist/index.js — run: npm run build:config');
  process.exit(1);
}

fs.mkdirSync(path.dirname(targetRoot), { recursive: true });
if (fs.existsSync(targetRoot)) {
  fs.rmSync(targetRoot, { recursive: true, force: true });
}

fs.mkdirSync(targetRoot, { recursive: true });
fs.copyFileSync(path.join(configRoot, 'package.json'), path.join(targetRoot, 'package.json'));
copyDir(path.join(configRoot, 'dist'), path.join(targetRoot, 'dist'));

if (!fs.existsSync(path.join(targetRoot, 'dist', 'index.js'))) {
  console.error('[ensure-backend-config] Copy failed: dist/index.js missing in target');
  process.exit(1);
}

console.log(`[ensure-backend-config] Installed @mbit-erp/config → ${targetRoot}`);
