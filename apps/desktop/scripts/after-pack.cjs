/**
 * electron-builder afterPack – a staging backend teljes másolása resources/backend alá.
 * Az extraResources gyakran kihagyja a dot-mappákat (pl. node_modules/.prisma).
 *
 * Előfeltétel: apps/server/packaging/backend (prepare-backend-bundle.mjs)
 */
const fs = require('fs');
const path = require('path');

function assertExists(filePath, label) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`afterPack verify failed: ${label}\n  Missing: ${filePath}`);
  }
}

function verifyPackagedBackend(backendDir, platform) {
  const checks = [
    ['main.js', path.join(backendDir, 'main.js')],
    ['@prisma/client/default.js', path.join(backendDir, 'node_modules/@prisma/client/default.js')],
    ['.prisma/client/default.js', path.join(backendDir, 'node_modules/.prisma/client/default.js')],
    ['.prisma/client/index.js', path.join(backendDir, 'node_modules/.prisma/client/index.js')],
    ['prisma/schema.prisma', path.join(backendDir, 'prisma/schema.prisma')],
  ];

  for (const [label, p] of checks) {
    assertExists(p, label);
  }

  const prismaClientDir = path.join(backendDir, 'node_modules/.prisma/client');
  const clientFiles = fs.readdirSync(prismaClientDir);
  const engines = clientFiles.filter(
    (f) => f.includes('query_engine') || f.endsWith('.node') || f.endsWith('.dll.node'),
  );
  if (engines.length === 0) {
    throw new Error('afterPack verify failed: no Prisma query engine in .prisma/client');
  }

  if (platform === 'win32') {
    const winEngine = clientFiles.find((f) => f === 'query_engine-windows.dll.node');
    if (!winEngine) {
      throw new Error(
        `afterPack verify failed: query_engine-windows.dll.node missing\n` +
          `  Found engines: ${engines.join(', ')}`,
      );
    }
    console.log(`[afterPack]    node_modules/.prisma/client/${winEngine}`);
  } else {
    console.log(`[afterPack]    node_modules/.prisma/client/${engines.join(', ')}`);
  }

  console.log('[afterPack] ✅ Packaged backend Prisma layout OK');
  console.log('[afterPack]    main.js');
  console.log('[afterPack]    node_modules/@prisma/client/default.js');
  console.log('[afterPack]    node_modules/.prisma/client/default.js');
  console.log('[afterPack]    prisma/schema.prisma');
}

/**
 * @param {import('electron-builder').AfterPackContext} context
 */
module.exports = async function afterPack(context) {
  const projectDir = context.packager.projectDir;
  const appOutDir = context.appOutDir;
  const stagingDir = path.resolve(projectDir, '../server/packaging/backend');
  const resourcesDir = path.join(appOutDir, 'resources');
  const targetDir = path.join(resourcesDir, 'backend');

  console.log('[afterPack] === copy staging backend → resources/backend ===');
  console.log(`[afterPack] appOutDir:   ${appOutDir}`);
  console.log(`[afterPack] staging:     ${stagingDir}`);
  console.log(`[afterPack] target:      ${targetDir}`);
  console.log(`[afterPack] platform:    ${context.electronPlatformName}`);

  if (!fs.existsSync(stagingDir)) {
    throw new Error(
      `Staging backend not found: ${stagingDir}\n` +
        'Run: node scripts/prepare-backend-bundle.mjs (or npm run build:backend in apps/desktop)',
    );
  }

  assertExists(path.join(stagingDir, 'node_modules/.prisma/client/default.js'), 'staging .prisma/client/default.js');

  fs.mkdirSync(resourcesDir, { recursive: true });
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }

  fs.cpSync(stagingDir, targetDir, {
    recursive: true,
    force: true,
    dereference: true,
    errorOnExist: false,
  });

  verifyPackagedBackend(targetDir, context.electronPlatformName);
  console.log('[afterPack] ✅ Backend copied from staging (includes node_modules/.prisma)');
};
