# MBIT ERP – DMS + Workflow + HR Edition

**Verzió:** MBIT ERP v1.0.1c  
**Package ID:** `dms-workflow-hr`  
**Aliasok:** `ERP_DMS_WORKFLOW_HR`, `ERP_DMS_TEAM_HR`  
**Release branch:** `release/dms-workflow-hr`  
**Release dátum:** 2026-06-01

## Csomag moduljai

| Modul | Állapot |
|-------|---------|
| DMS / Dokumentumkezelés | Engedélyezve |
| Workflow / Csapatmunka / Team | Engedélyezve |
| HR | Engedélyezve |
| Auth, Audit, Backup, Beállítások, Rendszer | Engedélyezve |
| CRM | **Tiltva** |
| Logisztika / Raktár / Termékek | **Tiltva** |
| Kontrolling | **Tiltva** |
| Gyártás, Webshop, Marketing | **Tiltva** (nincs külön modul – API/route guard) |

## Örökölt v1.0.1b javítások

- `@mbit-erp/config` runtime packaging (`ensure-backend-config-package` + packaged ellenőrzés)
- DMS „Irat helye” kompatibilitás (lista + szerkesztés + POST `jelenlegiHely`)
- DMS részletek `j.filter is not a function` javítás
- Workflow duplikált mezők eltávolítva; több személy hozzárendelése
- Team komment szerkesztés + `updatedAt` + audit log
- `erp-build-meta.json` → runtime `ERP_PACKAGE` / `APP_VERSION` a backendnek
- PackageModuleGuard + RBAC package permission szűrés

## CI artifact név

`mbit-erp-v1.0.1c-{shortsha}-dms-workflow-hr-DMS-WF-HR-windows.zip`

## Build (lokális)

```bash
npm run build:config
npm run package:dms-workflow-hr
```

Vagy manuálisan:

```bash
export ERP_PACKAGE=dms-workflow-hr
export VITE_ACTIVE_PACKAGE=dms-workflow-hr
export APP_VERSION=1.0.1c
cd apps/server && npm run build
cd ../web && cross-env ELECTRON_BUILD=true npm run build
cd ../desktop && npm run package:win
```

## Telepítési megjegyzések

1. Töltsd le a **portable ZIP** artifactot (ajánlott; NSIS setup csak opcionális).
2. Csomagold ki a mappát, futtasd a `MBIT ERP.exe` / `Mbit ERP.exe` fájlt.
3. Első indításkor SQLite DB: `%APPDATA%` alatti `mbit-erp` / `Mbit ERP` userData.
4. Ellenőrizd: Beállítások → Rendszerinformáció → **MBIT ERP v1.0.1c**, csomag: DMS + Workflow + HR Edition.

## Smoke-test checklist

- [ ] Login: **MBIT ERP v1.0.1c**
- [ ] Menü: Dokumentumok, Csapat, Folyamatleltár, Feladatlista, HR, Beállítások
- [ ] Nincs CRM / Logisztika / Kontrolling menü
- [ ] `/crm`, `/products`, `/controlling` → redirect / 403, nem crash
- [ ] DMS: irat helye lista + szerkesztés; részletek nem omlik össze
- [ ] Workflow: több hozzárendelt személy mentése
- [ ] Team: komment szerkesztés, `updatedAt`
- [ ] HR: dolgozók, szerződés, DMS csatolás, riport export
- [ ] Backend indul; nincs `Cannot find module '@mbit-erp/config'`
- [ ] `GET /system/version` → `1.0.1c`, `packageId: dms-workflow-hr`
- [ ] `GET /health/detailed` → verzió + edition
