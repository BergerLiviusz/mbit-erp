# Package stratégia – MBIT ERP

## Áttekintés

Az MBIT ERP moduláris **desktop (Electron)** csomagokban értékesíthető. Minden csomag:

- saját modullistával rendelkezik (`packages/config/src/packages.ts`);
- build-time `VITE_ACTIVE_PACKAGE` + runtime `ERP_PACKAGE` env alapján aktiválódik;
- frontend menüt és route-okat szűr (`apps/web/src/config/modules.ts`);
- API szinten `PackageModuleGuard` + RBAC package-szűréssel véd.

## Package lista (kiemelt)

| ID | Megjelenítés | DMS | Team/WF | HR | CRM | Logisztika | Kontrolling |
|----|--------------|-----|---------|-----|-----|------------|-------------|
| `full` | Teljes ERP | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `customer-4module` | Ügyfél 4 modul (v1.0.1b) | ✓ | ✓ | ✗ | ✓ | ✓ | ✗ |
| `dms-workflow-hr` | DMS + Workflow + HR (v1.0.1c) | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| `workflow-only` | Workflow Edition (v1.0.1e) | ✗ | WF* | ✗ | ✗ | ✗ | ✗ |
| `crm-only` | CRM Edition (v1.0.1f) | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ |
| `crm-dms-logistics` | CRM + DMS + Logistics (v1.0.1g) | ✓ | ✗ | ✗ | ✓ | ✓ | ✗ |
| `crm-dms-workflow` | CRM + DMS + Workflow (v1.0.1h) | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |
| `ginop-crm-dms-hr` | GINOP CRM+DMS+HR | ✓ | ✗ | ✓ | ✓ | ✗ | ✗ |

\* `workflow-only`: team API engedélyezett (workflow route-ok), csapat kommunikáció UI tiltva.

Központi definíció: `packages/config/src/packages.ts`.

## Build parancsok

```bash
npm run build:config
npm run package:customer-4module   # v1.0.1b – CRM+DMS+Log+WF
npm run package:dms-workflow-hr    # v1.0.1c – DMS+WF+HR
npm run package:workflow-only      # v1.0.1e – csak Workflow
npm run package:crm-only           # v1.0.1f – csak CRM
npm run package:crm-dms-logistics    # v1.0.1g – CRM + DMS + Logisztika
npm run package:crm-dms-workflow:mac # v1.0.1h – CRM + DMS + Workflow (macOS arm64)
```

## Környezeti változók

| Változó | Szerep |
|---------|--------|
| `VITE_ACTIVE_PACKAGE` | Frontend build-time modul szűrés |
| `ERP_PACKAGE` | Backend API guard + runtime csomag |
| `APP_VERSION` | Verzió (pl. `1.0.1c`) |
| `BUILD_SHA` / `BUILD_DATE` | Rendszerinformáció |

Desktop csomagolás: `apps/desktop/scripts/write-build-meta.mjs` → `resources/erp-build-meta.json`.

## Artifact elnevezés

| Csomag | Portable ZIP minta |
|--------|-------------------|
| `customer-4module` | `mbit-erp-v1.0.1b-{sha}-customer-4module-CRM-DMS-LOG-WF-windows.zip` |
| `dms-workflow-hr` | `mbit-erp-v1.0.1c-{sha}-dms-workflow-hr-DMS-WF-HR-windows.zip` |
| `workflow-only` | `mbit-erp-v1.0.1e-{sha}-workflow-only-WF-windows.zip` |
| `crm-only` | `mbit-erp-v1.0.1f-{sha}-crm-only-CRM-windows.zip` |
| `crm-dms-logistics` | `mbit-erp-v1.0.1g-{sha}-crm-dms-logistics-CRM-DMS-LOG-windows.zip` |
| `crm-dms-workflow` | `mbit-erp-v1.0.1h-{sha}-crm-dms-workflow-CRM-DMS-WF-macos-arm64.zip` |

## Branch stratégia

| Branch | Package |
|--------|---------|
| `release/customer-crm-dms-logistics-workflow` | `customer-4module` |
| `release/dms-workflow-hr` | `dms-workflow-hr` |
| `release/workflow-only` | `workflow-only` |
| `release/crm-only` | `crm-only` |
| `release/crm-dms-logistics` | `crm-dms-logistics` |
| `release/crm-dms-workflow` | `crm-dms-workflow` |
| `main` / `master` | `full` |

GitHub Actions: `.github/workflows/build-desktop.yml`.

## Mindig elérhető

- Auth, Beállítások, Backup, Audit, System/Health, Incident (bug report)
