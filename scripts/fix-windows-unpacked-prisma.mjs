#!/usr/bin/env node
/**
 * Post-package fix: másolja a staging Prisma clientet a win-unpacked resources/backend alá.
 * Az electron-builder extraResources gyakran kihagyja a node_modules/.prisma dot-mappát.
 *
 * Használat:
 *   node scripts/fix-windows-unpacked-prisma.mjs [app-root]
 *   npm run fix:windows-unpacked-prisma -- apps/desktop/release/win-unpacked
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');

const defaultAppRoot = path.join(repoRoot, 'apps/desktop/release/win-unpacked');
const appRoot = process.argv[2] ? path.resolve(process.argv[2]) : defaultAppRoot;

const stagingBackend = path.join(repoRoot, 'apps/server/packaging/backend');
const targetBackend = path.join(appRoot, 'resources', 'backend');
const targetNodeModules = path.join(targetBackend, 'node_modules');

const copies = [
  {
    label: 'node_modules/.prisma',
    src: path.join(stagingBackend, 'node_modules/.prisma'),
    dest: path.join(targetNodeModules, '.prisma'),
  },
  {
    label: 'node_modules/@prisma/client',
    src: path.join(stagingBackend, 'node_modules/@prisma/client'),
    dest: path.join(targetNodeModules, '@prisma/client'),
  },
];

function die(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

function copyDir(label, src, dest) {
  if (!fs.existsSync(src)) {
    die(`Staging source missing (${label}): ${src}\nRun: npm run prepare:backend-bundle`);
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }
  fs.cpSync(src, dest, { recursive: true, force: true });
  console.log(`✅ Copied ${label}`);
  console.log(`   ${src}`);
  console.log(`   → ${dest}`);
}

console.log('=== fix-windows-unpacked-prisma ===\n');
console.log(`App root:        ${appRoot}`);
console.log(`Staging backend: ${stagingBackend}`);
console.log(`Target backend:  ${targetBackend}\n`);

if (!fs.existsSync(appRoot)) {
  die(
    'win-unpacked not found. Run electron-builder first:\n' +
      '  cd apps/desktop && npm run package:win',
  );
}

if (!fs.existsSync(targetBackend)) {
  die(`Target backend missing: ${targetBackend}`);
}

if (!fs.existsSync(stagingBackend)) {
  die(`Staging backend missing: ${stagingBackend}\nRun: npm run prepare:backend-bundle`);
}

for (const { label, src, dest } of copies) {
  copyDir(label, src, dest);
}

const stagingSchema = path.join(stagingBackend, 'prisma/schema.prisma');
const targetSchema = path.join(targetBackend, 'prisma/schema.prisma');
if (fs.existsSync(stagingSchema)) {
  fs.mkdirSync(path.dirname(targetSchema), { recursive: true });
  fs.cpSync(stagingSchema, targetSchema, { force: true });
  console.log('✅ Copied prisma/schema.prisma');
}

const required = [
  ['main.js', path.join(targetBackend, 'main.js')],
  ['@prisma/client/default.js', path.join(targetNodeModules, '@prisma/client/default.js')],
  ['.prisma/client/default.js', path.join(targetNodeModules, '.prisma/client/default.js')],
  ['.prisma/client/index.js', path.join(targetNodeModules, '.prisma/client/index.js')],
  ['prisma/schema.prisma', path.join(targetBackend, 'prisma/schema.prisma')],
];

if (process.platform === 'win32') {
  required.push([
    'query_engine-windows.dll.node',
    path.join(targetNodeModules, '.prisma/client/query_engine-windows.dll.node'),
  ]);
}

console.log('\n=== Post-fix verification ===');
for (const [label, filePath] of required) {
  if (!fs.existsSync(filePath)) {
    die(`Required file missing after fix: ${label}\n  ${filePath}`);
  }
  console.log(`✅ ${label}`);
}

const clientDir = path.join(targetNodeModules, '.prisma/client');
const engines = fs.readdirSync(clientDir).filter((f) => f.includes('query_engine') || f.endsWith('.node'));
console.log(`✅ Prisma engines: ${engines.join(', ') || '(none)'}`);

console.log('\nPASSED: Generated Prisma client copied into win-unpacked/resources/backend/node_modules/.prisma/client');
