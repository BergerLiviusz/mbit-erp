#!/usr/bin/env node
/**
 * Összeállítja az Electron resources/backend staging mappát.
 * Explicit másolás – a .prisma (dot-folder) biztosan benne legyen.
 *
 * Futtatás: node scripts/prepare-backend-bundle.mjs
 * Előfeltétel: apps/server/dist létezik, apps/server/node_modules telepítve.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const serverDir = path.join(root, 'apps/server');
const stagingDir = path.join(serverDir, 'packaging/backend');

function assertExists(p, label) {
  if (!fs.existsSync(p)) {
    console.error(`❌ Missing ${label}: ${p}`);
    process.exit(1);
  }
}

console.log('=== prepare-backend-bundle ===');

assertExists(path.join(serverDir, 'dist'), 'server dist');
assertExists(path.join(serverDir, 'prisma/schema.prisma'), 'prisma schema');

console.log('Running prisma generate...');
execSync('npx prisma generate', {
  cwd: serverDir,
  stdio: 'inherit',
  env: {
    ...process.env,
    DATABASE_URL: process.env.DATABASE_URL || 'file:./prisma/dev.db',
  },
});

assertExists(path.join(serverDir, 'node_modules/@prisma/client'), '@prisma/client');

const prismaClientDir = path.join(serverDir, 'node_modules/.prisma/client');
assertExists(prismaClientDir, 'generated .prisma/client');
assertExists(path.join(prismaClientDir, 'default.js'), '.prisma/client/default.js');

console.log('Cleaning staging:', stagingDir);
fs.rmSync(stagingDir, { recursive: true, force: true });
fs.mkdirSync(stagingDir, { recursive: true });

console.log('Copying dist/ ...');
fs.cpSync(path.join(serverDir, 'dist'), stagingDir, { recursive: true });

console.log('Copying prisma/schema.prisma ...');
fs.mkdirSync(path.join(stagingDir, 'prisma'), { recursive: true });
fs.copyFileSync(
  path.join(serverDir, 'prisma/schema.prisma'),
  path.join(stagingDir, 'prisma/schema.prisma'),
);

console.log('Copying node_modules/ (including .prisma) ...');
fs.cpSync(path.join(serverDir, 'node_modules'), path.join(stagingDir, 'node_modules'), {
  recursive: true,
  filter: (src) => {
    const rel = path.relative(path.join(serverDir, 'node_modules'), src);
    const base = path.basename(src);
    if (base === '.bin') return false;
    if (rel.includes(`${path.sep}test${path.sep}`) || rel.endsWith(`${path.sep}test`)) return false;
    if (rel.includes(`${path.sep}tests${path.sep}`) || rel.endsWith(`${path.sep}tests`)) return false;
    if (rel.includes('__tests__')) return false;
    return true;
  },
});

// Verify staging
const checks = [
  ['main.js', path.join(stagingDir, 'main.js')],
  ['@prisma/client/default.js', path.join(stagingDir, 'node_modules/@prisma/client/default.js')],
  ['.prisma/client/default.js', path.join(stagingDir, 'node_modules/.prisma/client/default.js')],
  ['.prisma/client/index.js', path.join(stagingDir, 'node_modules/.prisma/client/index.js')],
];

for (const [label, p] of checks) {
  if (!fs.existsSync(p)) {
    console.error(`❌ Staging verify failed: ${label} -> ${p}`);
    process.exit(1);
  }
  console.log(`✅ ${label}`);
}

// Engine files (platform-specific name)
const clientFiles = fs.readdirSync(path.join(stagingDir, 'node_modules/.prisma/client'));
const engines = clientFiles.filter(
  (f) => f.includes('query_engine') || f.endsWith('.node') || f.endsWith('.dylib.node'),
);
if (engines.length === 0) {
  console.error('❌ No Prisma query engine binary found in .prisma/client');
  process.exit(1);
}
console.log(`✅ Prisma engine(s): ${engines.join(', ')}`);

console.log('✅ Backend bundle staging ready at apps/server/packaging/backend');
