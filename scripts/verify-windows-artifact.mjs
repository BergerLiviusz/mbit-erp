#!/usr/bin/env node
/**
 * Ellenőrzi a csomagolt Windows Electron app mappát (win-unpacked vagy telepített resources).
 *
 * Használat:
 *   node scripts/verify-windows-artifact.mjs [path-to-win-unpacked-or-resources]
 *
 * Alapértelmezés: apps/desktop/release/win-unpacked
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const appRoot = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(root, 'apps/desktop/release/win-unpacked');

const resourcesDir = fs.existsSync(path.join(appRoot, 'resources'))
  ? path.join(appRoot, 'resources')
  : appRoot;

const backendDir = path.join(resourcesDir, 'backend');
const nodeModules = path.join(backendDir, 'node_modules');

let failed = 0;

function check(label, filePath, optional = false) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${label}`);
    return true;
  }
  if (optional) {
    console.log(`⚠️  ${label} (optional, not found)`);
    return false;
  }
  console.error(`❌ ${label}`);
  console.error(`   Expected: ${filePath}`);
  failed++;
  return false;
}

console.log('=== verify-windows-artifact ===');
console.log('App root:', appRoot);
console.log('Backend:', backendDir);
console.log('');

// MBIT ERP.exe
const exeFiles = fs.existsSync(appRoot)
  ? fs.readdirSync(appRoot).filter((f) => f.toLowerCase().endsWith('.exe'))
  : [];
if (exeFiles.length === 0) {
  console.error('❌ No .exe launcher in app root');
  failed++;
} else {
  console.log(`✅ Launcher: ${exeFiles.join(', ')}`);
}

check('backend/main.js', path.join(backendDir, 'main.js'));
check('@prisma/client/default.js', path.join(nodeModules, '@prisma/client/default.js'));
check('.prisma/client directory', path.join(nodeModules, '.prisma/client'));

const prismaDefault = path.join(nodeModules, '.prisma/client/default.js');
const prismaIndex = path.join(nodeModules, '.prisma/client/index.js');
if (!fs.existsSync(prismaDefault) && !fs.existsSync(prismaIndex)) {
  console.error('❌ .prisma/client/default.js or index.js');
  failed++;
} else {
  console.log(`✅ .prisma/client entry (${fs.existsSync(prismaDefault) ? 'default.js' : 'index.js'})`);
}

if (fs.existsSync(path.join(nodeModules, '.prisma/client'))) {
  const clientFiles = fs.readdirSync(path.join(nodeModules, '.prisma/client'));
  const engines = clientFiles.filter(
    (f) => f.includes('query_engine') || f.endsWith('.node') || f.endsWith('.dll.node'),
  );
  if (engines.length === 0) {
    console.error('❌ No Prisma query engine binary in .prisma/client');
    failed++;
  } else {
    console.log(`✅ Prisma engine: ${engines.join(', ')}`);
    const hasWindows = engines.some((e) => e.includes('windows') || e.includes('win'));
    if (!hasWindows && process.platform === 'win32') {
      console.error('❌ Windows query engine not found (needed on Windows runtime)');
      failed++;
    }
  }
}

check('prisma/schema.prisma', path.join(backendDir, 'prisma/schema.prisma'));
check('frontend', path.join(resourcesDir, 'frontend'), true);

console.log('');
if (failed > 0) {
  console.error(`FAILED: ${failed} check(s)`);
  process.exit(1);
}
console.log('PASSED: Windows artifact contains Prisma client and launcher.');
