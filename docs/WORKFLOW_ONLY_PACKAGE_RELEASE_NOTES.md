# MBIT ERP – Workflow Edition (workflow-only)

**Verzió:** MBIT ERP v1.0.1e  
**Package ID:** `workflow-only`  
**Aliasok:** `ERP_WORKFLOW_ONLY`, `ERP_WORKFLOW`  
**Release branch:** `release/workflow-only`  
**Release dátum:** 2026-06-05

## Csomag moduljai

| Modul | Állapot |
|-------|---------|
| Munkafolyamat irányítás / Workflow | Engedélyezve |
| Auth, Audit, Backup, Beállítások, Rendszer | Engedélyezve |
| Team (csak workflow API/route – kanban kommunikáció rejtve) | Részleges |
| DMS / Dokumentumkezelés | **Tiltva** |
| CRM | **Tiltva** |
| HR | **Tiltva** |
| Logisztika / Raktár / Termékek | **Tiltva** |
| Kontrolling | **Tiltva** |
| Gyártás, Webshop, Marketing | **Tiltva** (nincs külön modul – API/route guard) |

## Örökölt javítások (v1.0.1b/c)

- `@mbit-erp/config` runtime packaging (`ensure-backend-config-package` + packaged ellenőrzés)
- PackageModuleGuard + RBAC package permission szűrés
- Workflow duplikált mezők eltávolítva; több személy hozzárendelése
- Workflow assignment mentés és visszatöltés
- Team komment / feladat szerkesztés + `updatedAt` + audit log
- `erp-build-meta.json` → runtime `ERP_PACKAGE` / `APP_VERSION` a backendnek
- Artifact név: verzió + package ID + modul rövidítés (WF)

## CI artifact név

`mbit-erp-v1.0.1e-{shortsha}-workflow-only-WF-windows.zip`

## Build (lokális)

```bash
npm run build:config
npm run package:workflow-only
```

Vagy manuálisan:

```bash
export ERP_PACKAGE=workflow-only
export VITE_ACTIVE_PACKAGE=workflow-only
export APP_VERSION=1.0.1e
cd apps/server && npm run build
cd ../web && cross-env ELECTRON_BUILD=true npm run build
cd ../desktop && npm run package:win
```

## CI futtatás

- **Automatikus:** push a `release/workflow-only` branchre
- **Manuális:** GitHub Actions → Build Desktop App → `workflow_dispatch` → branch: `release/workflow-only`, package: `workflow-only`

## Telepítési megjegyzések

1. Töltsd le a **portable ZIP** artifactot (ajánlott).
2. Csomagold ki, futtasd a `MBIT ERP.exe` / `Mbit ERP.exe` fájlt.
3. Ellenőrizd: Beállítások → Rendszerinformáció → **MBIT ERP v1.0.1e**, csomag: Workflow Edition.

## Smoke-test checklist

- [ ] Login: **MBIT ERP v1.0.1e**
- [ ] Menü: Folyamatleltár, Feladatlista, Workflow példányok, Beállítások
- [ ] Nincs: Dokumentumok, CRM, HR, Logisztika, Kontrolling, Csapat kommunikáció
- [ ] `/crm`, `/documents`, `/hr`, `/products`, `/controlling` → redirect / 403, nem crash
- [ ] Workflow: új folyamat létrehozása, szerkesztés, státusz módosítás
- [ ] Workflow: több hozzárendelt személy mentése és visszatöltése
- [ ] Workflow: duplikált „Hozzárendelt személy” / „Szerepkör” mezők nem jelennek meg
- [ ] Komment / feladat utólagos szerkesztés (ha elérhető)
- [ ] Audit események naplózódnak
- [ ] Backend indul; nincs `Cannot find module '@mbit-erp/config'`
- [ ] `GET /system/version` → `1.0.1e`, `packageId: workflow-only`
- [ ] `GET /health/detailed` → verzió + edition
- [ ] Packaged: `resources/backend/node_modules/@mbit-erp/config/dist/index.js` létezik
