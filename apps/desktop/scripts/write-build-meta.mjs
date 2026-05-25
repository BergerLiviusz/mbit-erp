/**
 * Build-time meta: package azonosító + verzió a csomagolt resources mappába.
 * Futtatás: ERP_PACKAGE=ginop-crm-dms-hr APP_VERSION=1.0.1a node scripts/write-build-meta.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../../..');
const configDist = path.join(root, 'packages/config/dist/packages.js');

const packageId = process.env.ERP_PACKAGE || process.env.VITE_ACTIVE_PACKAGE || 'full';
const version = process.env.APP_VERSION || '1.0.1a';
const buildSha = process.env.BUILD_SHA || process.env.GITHUB_SHA || '';
const buildDate = process.env.BUILD_DATE || new Date().toISOString();

let editionLabel = packageId;
let displayName = packageId;
let productName = 'MBIT ERP';

try {
  const { getPackageDefinition, resolvePackageId } = await import(configDist);
  const def = getPackageDefinition(resolvePackageId(packageId));
  editionLabel = def.editionLabel;
  displayName = def.displayName;
  productName = `MBIT ERP – ${def.editionLabel}`;
} catch (e) {
  console.warn('[write-build-meta] Could not load @mbit-erp/config, using defaults:', e.message);
}

const outDir = path.join(__dirname, '../resources');
fs.mkdirSync(outDir, { recursive: true });

const meta = {
  packageId: packageId,
  version,
  buildSha: buildSha ? String(buildSha).slice(0, 7) : null,
  buildDate,
  editionLabel,
  displayName,
  productName,
};

fs.writeFileSync(path.join(outDir, 'erp-build-meta.json'), JSON.stringify(meta, null, 2));
console.log('[write-build-meta] Written erp-build-meta.json:', meta);
