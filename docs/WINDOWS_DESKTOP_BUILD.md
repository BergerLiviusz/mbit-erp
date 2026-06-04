# Windows desktop build – MBIT ERP

## Előfeltételek

- Node.js ≥ 20 (CI: 18.18.2)
- `npm ci` a repo gyökerében
- Windows build: `windows-latest` runner vagy helyi Windows + PowerShell

## Standard build lépések (CI egyező)

```powershell
npm ci
npm run build:config

$env:ERP_PACKAGE = "dms-crm-workflow"
$env:VITE_ACTIVE_PACKAGE = "dms-crm-workflow"
$env:APP_VERSION = "1.0.1d"

cd apps/server
npm run build
cd ../..

cd apps/server
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm install --omit=dev --install-strategy=hoisted --install-links=false --workspaces=false
cd ../..
npm run build:config
node apps/desktop/scripts/ensure-backend-config-package.cjs

cd apps/web
$env:ELECTRON_BUILD = "true"
npm run build

cd ../desktop
npm run package:win
```

Gyors út (root):

```bash
npm run package:dms-crm-workflow
```

## Kritikus ellenőrzések

- `apps/server/node_modules/@mbit-erp/config/dist/index.js` létezik build után
- Csomagolt app: `resources/backend/node_modules/@mbit-erp/config/dist/index.js`
- `resources/erp-build-meta.json` a portable buildben
- Portable ZIP: `mbit-erp-v1.0.1d-*-dms-crm-workflow-DMS-CRM-WF-windows.zip`

## GitHub Actions

- Push: `release/dms-crm-workflow`
- Vagy: Actions → Build Desktop App → `package: dms-crm-workflow`

Részletes release jegyzet: [DMS_CRM_WORKFLOW_PACKAGE_RELEASE_NOTES.md](./DMS_CRM_WORKFLOW_PACKAGE_RELEASE_NOTES.md)
