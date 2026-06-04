# Package stratégia – MBIT ERP

## Áttekintés

Az MBIT ERP moduláris **desktop (Electron)** csomagokban értékesíthető. Minden csomag:

- saját modullistával rendelkezik (`packages/config/src/packages.ts`);
- build-time `VITE_ACTIVE_PACKAGE` + runtime `ERP_PACKAGE` env alapján aktiválódik;
- frontend menüt és route-okat szűr (`apps/web/src/config/modules.ts`);
- API szinten `PackageModuleGuard` + RBAC package-szűréssel véd.

## Package lista (kiemelt)

| ID | Megjelenítés | DMS | Team/WF | CRM | HR | Logisztika | Kontrolling |
|----|--------------|-----|---------|-----|-----|------------|-------------|
| `full` | Teljes ERP | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `customer-4module` | Ügyfél 4 modul (v1.0.1b) | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ |
| `dms-crm-workflow` | DMS + CRM + Workflow (v1.0.1d) | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| `dms-workflow-hr` | DMS + Workflow + HR (v1.0.1c) | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |
| `ginop-crm-dms-hr` | GINOP CRM+DMS+HR | ✓ | ✗ | ✓ | ✓ | ✗ | ✗ |

Központi definíció: `packages/config/src/packages.ts`.

## Build parancsok

```bash
npm run build:config
npm run package:customer-4module   # v1.0.1b – CRM+DMS+Log+WF
npm run package:dms-crm-workflow   # v1.0.1d – DMS+CRM+WF
```

## Környezeti változók

| Változó | Szerep |
|---------|--------|
| `VITE_ACTIVE_PACKAGE` | Frontend build-time modul szűrés |
| `ERP_PACKAGE` | Backend API guard + runtime csomag |
| `APP_VERSION` | Verzió (pl. `1.0.1d`) |
| `BUILD_SHA` / `BUILD_DATE` | Rendszerinformáció |

Desktop csomagolás: `apps/desktop/scripts/write-build-meta.mjs` → `resources/erp-build-meta.json`.

## Artifact elnevezés

| Csomag | Portable ZIP minta |
|--------|-------------------|
| `customer-4module` | `mbit-erp-v1.0.1b-{sha}-customer-4module-CRM-DMS-LOG-WF-windows.zip` |
| `dms-crm-workflow` | `mbit-erp-v1.0.1d-{sha}-dms-crm-workflow-DMS-CRM-WF-windows.zip` |

## Branch stratégia

| Branch | Package |
|--------|---------|
| `release/customer-crm-dms-logistics-workflow` | `customer-4module` |
| `release/dms-crm-workflow` | `dms-crm-workflow` |
| `main` / `master` | `full` |

GitHub Actions: `.github/workflows/build-desktop.yml`.

## Mindig elérhető

- Auth, Beállítások, Backup, Audit, System/Health, Incident (bug report)
