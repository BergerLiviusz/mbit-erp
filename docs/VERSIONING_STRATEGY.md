# Verziókövetés – MBIT ERP

## Központi forrás

| Fájl | Tartalom |
|------|----------|
| `packages/config/src/app-version.ts` | `APP_VERSION` (release branch: pl. `1.0.1c`) |
| `apps/desktop/package.json` | Electron `version` mező |
| Package definíció | `version` mező csomagonként (`packages/config/src/packages.ts`) |

**Megjelenített címke:** `MBIT ERP v{version}` (+ edition a beállításokban).

## Hol látszik

| Hely | Forrás |
|------|--------|
| Login | `VITE_APP_VERSION` |
| Navigáció (desktop) | `VITE_APP_VERSION` |
| Beállítások → Rendszerinformáció | `GET /health/detailed` |
| Electron title bar | `erp-build-meta.json` |
| API | `GET /system/version` |

## Build meta (`erp-build-meta.json`)

| Mező | Leírás |
|------|--------|
| `packageId` | pl. `dms-workflow-hr` |
| `version` | pl. `1.0.1c` |
| `editionLabel` | pl. DMS + Workflow + HR Edition |
| `buildSha` | Git commit (rövid) |

Generálás: `apps/desktop/scripts/write-build-meta.mjs` (`prepackage:win`).

## Release példa – DMS + Workflow + HR

| Mező | Érték |
|------|--------|
| Branch | `release/dms-workflow-hr` |
| Verzió | MBIT ERP v1.0.1c |
| Package ID | `dms-workflow-hr` |
| Artifact | `mbit-erp-v1.0.1c-{sha}-dms-workflow-hr-DMS-WF-HR-windows.zip` |

Részletek: [DMS_WORKFLOW_HR_PACKAGE_RELEASE_NOTES.md](./DMS_WORKFLOW_HR_PACKAGE_RELEASE_NOTES.md)

## Release példa – Workflow only

| Mező | Érték |
|------|--------|
| Branch | `release/workflow-only` |
| Verzió | MBIT ERP v1.0.1e |
| Package ID | `workflow-only` |
| Artifact | `mbit-erp-v1.0.1e-{sha}-workflow-only-WF-windows.zip` |

Részletek: [WORKFLOW_ONLY_PACKAGE_RELEASE_NOTES.md](./WORKFLOW_ONLY_PACKAGE_RELEASE_NOTES.md)

## Release példa – CRM only

| Mező | Érték |
|------|--------|
| Branch | `release/crm-only` |
| Verzió | MBIT ERP v1.0.1f |
| Package ID | `crm-only` |
| Artifact | `mbit-erp-v1.0.1f-{sha}-crm-only-CRM-windows.zip` |

Részletek: [CRM_ONLY_PACKAGE_RELEASE_NOTES.md](./CRM_ONLY_PACKAGE_RELEASE_NOTES.md)

## Release példa – HR only

| Mező | Érték |
|------|--------|
| Branch | `release/hr-only` |
| Verzió | MBIT ERP v1.0.1g |
| Package ID | `hr-only` |
| Artifact | `mbit-erp-v1.0.1g-{sha}-hr-only-HR-windows.zip` |

Részletek: [HR_ONLY_PACKAGE_RELEASE_NOTES.md](./HR_ONLY_PACKAGE_RELEASE_NOTES.md)

## Policy

1. Package-specifikus verzió: a `ERP_PACKAGES[id].version` és `APP_VERSION` env egyezzen.
2. CI beégeti `ERP_PACKAGE`, `VITE_ACTIVE_PACKAGE`, `APP_VERSION`-t.
3. Artifact név tartalmazza a verziót, package ID-t és modul rövidítést.
