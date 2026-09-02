/**
 * Build-time meta: package azonosító + verzió a csomagolt resources mappába.
 * Futtatás: ERP_PACKAGE=dms-workflow-hr APP_VERSION=1.0.1c node scripts/write-build-meta.mjs
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../../..');
const configDist = path.join(root, 'packages/config/dist/packages.js');

const packageId = process.env.ERP_PACKAGE || process.env.VITE_ACTIVE_PACKAGE || 'full';
const version = process.env.APP_VERSION || '1.0.1c';
let buildSha = process.env.BUILD_SHA || process.env.GITHUB_SHA || '';
if (!buildSha) {
  try {
    buildSha = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  } catch {
    buildSha = '';
  }
}
const buildDate = process.env.BUILD_DATE || new Date().toISOString();

let editionLabel = packageId;
let displayName = packageId;
let productName = 'MBIT ERP';

try {
  const { getPackageDefinition, resolvePackageId } = await import(configDist);
  const def = getPackageDefinition(resolvePackageId(packageId));
  editionLabel = def.editionLabel;
  displayName = def.displayName;
  productName = `MBIT ERP v${version}`;
} catch (e) {
  console.warn('[write-build-meta] Could not load @mbit-erp/config, using defaults:', e.message);
}

const outDir = path.join(__dirname, '../resources');
fs.mkdirSync(outDir, { recursive: true });

const meta = {
  packageId,
  version,
  buildSha: buildSha ? String(buildSha).slice(0, 7) : null,
  buildDate,
  editionLabel,
  displayName,
  productName,
};

fs.writeFileSync(path.join(outDir, 'erp-build-meta.json'), JSON.stringify(meta, null, 2));
console.log('[write-build-meta] Written erp-build-meta.json:', meta);
