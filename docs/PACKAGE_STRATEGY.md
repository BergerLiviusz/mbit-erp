# Package stratégia – MBIT ERP

## Áttekintés

Az MBIT ERP moduláris **desktop (Electron)** csomagokban értékesíthető. Minden csomag:

- saját modullistával rendelkezik (`packages/config/src/packages.ts`);
- build-time `VITE_ACTIVE_PACKAGE` + runtime `ERP_PACKAGE` env alapján aktiválódik;
- frontend menüt és route-okat szűr;
- backend NestJS modulokat feltételesen regisztrál;
- API szinten `PackageModuleGuard` + RBAC package-szűréssel véd.

## Package lista

| ID | Megjelenítés | CRM | DMS | HR | Logisztika | Kontrolling | Csapat |
|----|--------------|-----|-----|-----|------------|-------------|--------|
| `full` | Teljes ERP | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `ginop-crm-dms-hr` | GINOP CRM+DMS+HR | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| `crm` | CRM Edition | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `dms` | DMS Edition | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ |
| `hr` / `package-hr` | HR Edition | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ |
| `logistics` | Logistics Edition | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ |
| `package-1` … `package-5` | Legacy ügyfélcsomagok | (lásd config) | | | | | |

Központi definíció: `packages/config/src/packages.ts`.

## Build parancsok

```bash
npm run build:config          # @mbit-erp/config fordítás
npm run package:full          # Teljes ERP Windows csomag
npm run package:ginop         # GINOP CRM+DMS+HR Windows csomag
npm run package:crm
npm run package:hr
```

Környezeti változók:

| Változó | Szerep |
|---------|--------|
| `VITE_ACTIVE_PACKAGE` | Frontend build-time modul szűrés |
| `ERP_PACKAGE` | Backend modul regisztráció + API guard |
| `APP_VERSION` | Verzió (alapértelmezés: `1.0.1a`) |
| `BUILD_SHA` / `BUILD_DATE` | Rendszerinformáció / audit |

## Artifact elnevezés

| Típus | Minta |
|-------|--------|
| CI artifact | `mbit-erp-v{ver}-{sha}-{package}-windows` |
| Portable ZIP | `mbit-erp-v{ver}-{package}-windows.zip` |
| NSIS setup | `mbit-erp-v{ver}-{package}-setup.exe` |

Példa GINOP: `mbit-erp-v1.0.1a-ginop-crm-dms-hr-windows.zip`

## Branch stratégia

| Branch | Package |
|--------|---------|
| `main` / `master` | `full` |
| `release/ginop-crm-dms-hr` | `ginop-crm-dms-hr` |
| `release/full` | `full` |
| `release/logistics` | `logistics` |
| `release/hr` | `hr` |
| `release/crm` | `crm` |
| `package-1` … `package-5` | azonos ID |
| `package-hr` | `hr` |

GitHub Actions: `.github/workflows/build-desktop.yml` – branch automatikus felismerés + `workflow_dispatch` választó.

## Mindig elérhető funkciók (minden csomagban)

- Auth / bejelentkezés
- Beállítások, backup, audit
- Incident / hibajelentés (Settings)
- Rendszer health / verzió API

## Seed

A `npm run db:seed` **nem** működési feltétel – csak demo/fejlesztéshez.
