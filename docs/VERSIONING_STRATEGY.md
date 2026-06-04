# Verziókezelés – MBIT ERP desktop csomagok

## Alapelv

- **Globális app verzió:** `packages/config/src/app-version.ts` (`APP_VERSION`, alapértelmezés pl. `1.0.1a`).
- **Csomag-specifikus verzió:** `ERP_PACKAGES[id].version` felülírja a customer artifact verzióját.
- **Build-time override:** `APP_VERSION` env (CI, `npm run package:*`).

## Aktív customer / edition verziók

| Package ID | Verzió | Artifact modul suffix |
|------------|--------|------------------------|
| `customer-4module` | `1.0.1b` | `CRM-DMS-LOG-WF` |
| `dms-crm-workflow` | `1.0.1d` | `DMS-CRM-WF` |

## Hol jelenik meg a verzió

| Hely | Forrás |
|------|--------|
| Login footer | `VITE_APP_VERSION` + edition label |
| Electron ablakcím | `erp-build-meta.json` → `getWindowTitle()` |
| `GET /system/version` | `getPackageDefinition` + `APP_VERSION` |
| `GET /health/detailed` | ugyanaz |
| Portable ZIP név | CI: `mbit-erp-v{version}-{sha}-{slug}-{modules}-windows.zip` |

## Új csomag verzió hozzáadása

1. `packages/config/src/packages.ts` → `version` mező.
2. `apps/web/vite.config.ts` → `PACKAGE_VERSIONS` map.
3. `.github/workflows/build-desktop.yml` → `APP_VERSION` és ZIP `switch`.
4. `package.json` → `package:{id}` script `APP_VERSION=...`.
5. `docs/*_RELEASE_NOTES.md`.

Ne regredj a `customer-4module` `1.0.1b` artifact névhez / modul listához.
