#!/usr/bin/env node
/**
 * Ellenőrzi a csomagolt Windows Electron app mappát (win-unpacked).
 *
 * Használat:
 *   node scripts/verify-windows-artifact.mjs [app-root]
 *   npm run verify:windows-artifact -- apps/desktop/release/win-unpacked
 *
 * Alapértelmezés: apps/desktop/release/win-unpacked
 *
 * Runtime Prisma (kötelező):
 *   <appRoot>/resources/backend/node_modules/.prisma/client/default.js
 *   <appRoot>/resources/backend/node_modules/.prisma/client/query_engine-windows.dll.node
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');

const defaultAppRoot = path.join(repoRoot, 'apps/desktop/release/win-unpacked');
const appRoot = process.argv[2] ? path.resolve(process.argv[2]) : defaultAppRoot;

let failed = 0;

function fail(message) {
  console.error(`❌ ${message}`);
  failed++;
}

function pass(message) {
  console.log(`✅ ${message}`);
}

function warn(message) {
  console.log(`⚠️  ${message}`);
}

function resolveBackendRoot(root) {
  const resourcesBackend = path.join(root, 'resources', 'backend');
  if (fs.existsSync(resourcesBackend)) {
    return {
      dir: resourcesBackend,
      source: 'resources/backend (Electron portable layout – primary)',
    };
  }
  const legacyBackend = path.join(root, 'backend');
  if (fs.existsSync(legacyBackend)) {
    return {
      dir: legacyBackend,
      source: 'backend (legacy fallback – NOT the portable layout)',
    };
  }
  return { dir: null, source: null };
}

function resolveFrontendRoot(root) {
  const electronPath = path.join(root, 'resources', 'frontend');
  if (fs.existsSync(electronPath)) {
    return { dir: electronPath, source: 'resources/frontend (Electron extraResources)' };
  }
  const legacyPath = path.join(root, 'frontend');
  if (fs.existsSync(legacyPath)) {
    return { dir: legacyPath, source: 'frontend (legacy fallback)' };
  }
  return { dir: null, source: null };
}

function checkFile(label, filePath, optional = false) {
  if (fs.existsSync(filePath)) {
    pass(label);
    return true;
  }
  if (optional) {
    warn(`${label} (optional, not found)`);
    return false;
  }
  fail(label);
  console.error(`   Expected: ${filePath}`);
  return false;
}

console.log('=== verify-windows-artifact ===\n');

console.log(`App root: ${appRoot}`);

if (!fs.existsSync(appRoot)) {
  console.error('');
  console.error(
    'A Windows artifact még nem készült el. Futtasd a Windows packaginget vagy töltsd le a CI portable-app artifactot.',
  );
  console.error('');
  console.error('Példa:');
  console.error('  cd apps/desktop && ERP_PACKAGE=ginop-crm-dms-hr npm run package:win');
  console.error('  npm run verify:windows-artifact apps/desktop/release/win-unpacked');
  process.exit(1);
}

const exeFiles = fs
  .readdirSync(appRoot, { withFileTypes: true })
  .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.exe'))
  .map((e) => e.name);

if (exeFiles.length === 0) {
  fail('No .exe launcher in app root (e.g. MBIT ERP.exe)');
} else {
  pass(`Launcher .exe: ${exeFiles.join(', ')}`);
}

const backend = resolveBackendRoot(appRoot);
console.log(`Backend root: ${backend.dir ?? '(not found)'}`);
if (backend.source) {
  console.log(`  → ${backend.source}`);
  if (backend.dir?.includes(`${path.sep}resources${path.sep}backend`)) {
    console.log('  → Using resources/backend as backend root (required for portable artifact)');
  }
} else {
  console.error('  → Expected: <appRoot>/resources/backend');
}

const frontend = resolveFrontendRoot(appRoot);
console.log(`Frontend root: ${frontend.dir ?? '(not found)'}`);
if (frontend.source) {
  console.log(`  → ${frontend.source}`);
}

console.log('');

if (!backend.dir) {
  fail('Backend directory missing – expected win-unpacked/resources/backend');
} else if (!backend.dir.includes(`${path.sep}resources${path.sep}backend`)) {
  fail(
    'Portable artifact must use resources/backend – found legacy backend/ only (afterPack may not have run)',
  );
} else {
  const nodeModules = path.join(backend.dir, 'node_modules');
  const prismaClientDir = path.join(nodeModules, '.prisma/client');

  checkFile('resources/backend/main.js', path.join(backend.dir, 'main.js'));
  checkFile(
    'resources/backend/node_modules/@prisma/client/default.js',
    path.join(nodeModules, '@prisma/client/default.js'),
  );
  checkFile('resources/backend/node_modules/.prisma/client', prismaClientDir);

  const prismaDefault = path.join(prismaClientDir, 'default.js');
  const prismaIndex = path.join(prismaClientDir, 'index.js');
  checkFile('resources/backend/node_modules/.prisma/client/default.js', prismaDefault);
  checkFile('resources/backend/node_modules/.prisma/client/index.js', prismaIndex);

  if (fs.existsSync(prismaClientDir)) {
    const clientFiles = fs.readdirSync(prismaClientDir);
    const engines = clientFiles.filter(
      (f) => f.includes('query_engine') || f.endsWith('.node') || f.endsWith('.dll.node'),
    );
    const winEngine = clientFiles.find((f) => f === 'query_engine-windows.dll.node');
    if (engines.length === 0) {
      fail('No Prisma query engine in .prisma/client');
    } else {
      pass(`Prisma engine file(s): ${engines.join(', ')}`);
    }
    if (!winEngine) {
      fail('query_engine-windows.dll.node missing (required for Windows portable runtime)');
      console.error(`   Expected: ${path.join(prismaClientDir, 'query_engine-windows.dll.node')}`);
    } else {
      pass(`Windows Prisma engine: ${winEngine}`);
    }
  }

  checkFile('resources/backend/prisma/schema.prisma', path.join(backend.dir, 'prisma/schema.prisma'));
}

if (frontend.dir) {
  pass(`Frontend present: ${frontend.dir}`);
} else {
  warn('resources/frontend not found (optional for Prisma check)');
}

console.log('');
if (failed > 0) {
  console.error(`FAILED: ${failed} check(s)`);
  process.exit(1);
}
console.log('PASSED: win-unpacked/resources/backend contains full Prisma client for Windows runtime.');
