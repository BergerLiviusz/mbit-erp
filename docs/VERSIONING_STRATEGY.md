# Verziókövetés – MBIT ERP

## Központi forrás

| Fájl | Tartalom |
|------|----------|
| `packages/config/src/app-version.ts` | `APP_VERSION = '1.0.1a'`, formázó segédfüggvények |
| `apps/desktop/package.json` | `version` mező (Electron / installer) |
| Gyökér / server / web `package.json` | Szinkron `1.0.1a` |

**Megjelenített címke:** `MBIT ERP v1.0.1a` (+ opcionális edition, SHA, környezet).

## Hol látszik a verzió

| Hely | Forrás |
|------|--------|
| Login képernyő | `getShortVersionLine()` + edition |
| Beállítások → Rendszerinformáció | `GET /health/detailed` |
| Oldal lábléc | `AppVersionFooter` |
| Electron title bar | `resources/erp-build-meta.json` |
| API | `GET /system/version` (public) |

## Build meta

| Env | Leírás |
|-----|--------|
| `APP_VERSION` | Alkalmazás verzió |
| `BUILD_SHA` | Git commit (rövid) |
| `BUILD_DATE` | ISO időbélyeg |
| `ERP_PACKAGE` | Aktív csomag ID |

Desktop csomagoláskor: `apps/desktop/scripts/write-build-meta.mjs` → `resources/erp-build-meta.json` → backend env + title bar.

## Verziószabály (javasolt)

- **Semver alap + build suffix:** `MAJOR.MINOR.PATCH` + opcionális `a|b|rc` (pl. `1.0.1a`)
- GINOP pályázati build: rögzített `1.0.1a` dokumentálva a kiadási jegyzőben
- Tag: `v1.0.1a` → GitHub Release (workflow `v*` trigger)

## Környezetek

| Környezet | Megjelenítés |
|-----------|----------------|
| `development` | `[dev]` suffix |
| `staging` | `[staging]` suffix |
| `production` | nincs suffix (desktop on-premise alapértelmezés) |

## GINOP megfelelőség

A pályázati dokumentációban hivatkozható:

- **Verzió:** MBIT ERP v1.0.1a
- **Változat:** GINOP CRM+DMS+HR Edition (`ginop-crm-dms-hr`)
- **Ellenőrzés:** Beállítások → Rendszerinformáció + artifact fájlnév

## Release policy

1. Verzió bump csak `packages/config/src/app-version.ts` + package.json szinkronnal.
2. CI beégeti `APP_VERSION` és `BUILD_SHA`-t.
3. Artifact név tartalmazza a verziót és package ID-t (auditálható letöltés).

## GINOP release (példa)

| Mező | Érték |
|------|--------|
| Branch | `release/ginop-crm-dms-hr` |
| Verzió | MBIT ERP v1.0.1a |
| Artifact | `mbit-erp-v1.0.1a-{sha}-ginop-crm-dms-hr-windows` |

Részletes checklist: [GINOP_RELEASE_CHECKLIST.md](./GINOP_RELEASE_CHECKLIST.md)
