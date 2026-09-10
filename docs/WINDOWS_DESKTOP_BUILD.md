# Windows desktop build (on-premise)

## Végtermék

- Windows desktop (Electron): beágyazott NestJS + SQLite
- Portable ZIP (ajánlott) + opcionális NSIS setup
- Offline működés – nincs kötelező internet runtime alatt

## Verzió (release branch)

| Branch | Verzió | Package |
|--------|--------|---------|
| `release/dms-workflow-hr` | **1.0.1c** | `dms-workflow-hr` |
| `release/workflow-only` | **1.0.1e** | `workflow-only` |
| `release/crm-only` | **1.0.1f** | `crm-only` |
| `release/hr-only` | **1.0.1g** | `hr-only` |
| `release/customer-crm-dms-logistics-workflow` | 1.0.1b | `customer-4module` |

Központi forrás: `packages/config/src/app-version.ts`

## Lokális build – CRM only

```bash
npm install
npm run build:config
npm run package:crm-only
```

## Lokális build – HR only

```bash
npm install
npm run build:config
npm run package:hr-only
```

## Lokális build – Workflow only

```bash
npm install
npm run build:config
npm run package:workflow-only
```

## Lokális build – DMS + Workflow + HR

```bash
npm install
npm run build:config
npm run package:dms-workflow-hr
```

Kimenet: `apps/desktop/release/`

- `win-unpacked/` – futtatható mappa
- `mbit-erp-v1.0.1c-{sha}-dms-workflow-hr-DMS-WF-HR-windows.zip` – portable (CI)

## Kötelező runtime ellenőrzés

Packaged backend:

- `resources/backend/node_modules/@mbit-erp/config/package.json`
- `resources/backend/node_modules/@mbit-erp/config/dist/index.js`
- `resources/erp-build-meta.json` → `ERP_PACKAGE` / `APP_VERSION`

```bash
# CI és lokális package után (Windows path példa)
Test-Path apps/desktop/release/win-unpacked/resources/backend/node_modules/@mbit-erp/config/dist/index.js
```

## GitHub Actions

Workflow: `.github/workflows/build-desktop.yml`

- Push: `release/dms-workflow-hr` → automatikus `dms-workflow-hr` build
- Push: `release/workflow-only` → automatikus `workflow-only` build
- Push: `release/crm-only` → automatikus `crm-only` build
- Push: `release/hr-only` → automatikus `hr-only` build
- `workflow_dispatch` → package: `dms-workflow-hr`, `workflow-only`, `crm-only` vagy `hr-only`

## Ismert korlát

NSIS setup.exe méret < 180 MB esetén hiányozhatnak a resource fájlok – használd a **portable ZIP**-et.
