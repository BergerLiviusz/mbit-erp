#!/usr/bin/env node
/**
 * Ellenőrzi a csomagolt Windows Electron app mappát (win-unpacked).
 * Futtasd a fix:windows-unpacked-prisma UTÁN (CI és lokális package után).
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
    return { dir: resourcesBackend, source: 'resources/backend' };
  }
  const legacyBackend = path.join(root, 'backend');
  if (fs.existsSync(legacyBackend)) {
    return { dir: legacyBackend, source: 'backend (legacy – invalid for portable)' };
  }
  return { dir: null, source: null };
}

function checkFile(label, filePath) {
  if (fs.existsSync(filePath)) {
    pass(label);
    return true;
  }
  fail(label);
  console.error(`   Expected: ${filePath}`);
  return false;
}

console.log('=== verify-windows-artifact ===\n');
console.log(`App root: ${appRoot}`);

if (!fs.existsSync(appRoot)) {
  console.error(
    '\nA Windows artifact még nem készült el. Futtasd a packaginget vagy töltsd le a CI portable-app artifactot.',
  );
  process.exit(1);
}

const exeFiles = fs
  .readdirSync(appRoot, { withFileTypes: true })
  .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.exe'))
  .map((e) => e.name);

if (exeFiles.length === 0) {
  fail('No .exe launcher in app root');
} else {
  pass(`Launcher .exe: ${exeFiles.join(', ')}`);
}

const backend = resolveBackendRoot(appRoot);
console.log(`Backend root: ${backend.dir ?? '(not found)'}`);
if (backend.dir?.includes(`${path.sep}resources${path.sep}backend`)) {
  console.log('  → Using resources/backend (portable layout)');
}

console.log('');

if (!backend.dir?.includes(`${path.sep}resources${path.sep}backend`)) {
  fail('Expected win-unpacked/resources/backend');
} else {
  const nodeModules = path.join(backend.dir, 'node_modules');
  const prismaClientDir = path.join(nodeModules, '.prisma/client');
  const schemaPath = path.join(backend.dir, 'prisma/schema.prisma');

  // schema.prisma alone is NOT sufficient for runtime
  if (fs.existsSync(schemaPath)) {
    pass('resources/backend/prisma/schema.prisma (present – NOT sufficient alone for runtime)');
  } else {
    fail('resources/backend/prisma/schema.prisma');
  }

  if (fs.existsSync(path.join(backend.dir, 'prisma/prisma.service.js'))) {
    pass('resources/backend/prisma/prisma.service.js (Nest wrapper – still requires generated client)');
  }

  console.log('');
  console.log('--- Required generated Prisma client (runtime) ---');

  checkFile('resources/backend/main.js', path.join(backend.dir, 'main.js'));
  checkFile(
    'resources/backend/node_modules/@prisma/client/default.js',
    path.join(nodeModules, '@prisma/client/default.js'),
  );
  checkFile('resources/backend/node_modules/.prisma/client', prismaClientDir);
  checkFile(
    'resources/backend/node_modules/.prisma/client/default.js (REQUIRED)',
    path.join(prismaClientDir, 'default.js'),
  );
  checkFile(
    'resources/backend/node_modules/.prisma/client/index.js',
    path.join(prismaClientDir, 'index.js'),
  );

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
      fail('query_engine-windows.dll.node missing (Windows portable runtime)');
    } else {
      pass(`Windows Prisma engine: ${winEngine}`);
    }
  } else {
    fail(
      'node_modules/.prisma/client missing – run: npm run fix:windows-unpacked-prisma apps/desktop/release/win-unpacked',
    );
    console.error(
      '   Runtime error without this: Cannot find module \'.prisma/client/default\'',
    );
  }
}

console.log('');
if (failed > 0) {
  console.error(`FAILED: ${failed} check(s)`);
  process.exit(1);
}
console.log('PASSED: Generated Prisma client present under resources/backend/node_modules/.prisma/client');
