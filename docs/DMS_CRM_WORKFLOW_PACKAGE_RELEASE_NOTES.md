# MBIT ERP – DMS + CRM + Workflow Edition

**Verzió:** MBIT ERP v1.0.1d  
**Package ID:** `dms-crm-workflow`  
**Aliasok:** `ERP_DMS_CRM_WORKFLOW`, `ERP_CRM_DMS_WORKFLOW`  
**Release branch:** `release/dms-crm-workflow`  
**Release dátum:** 2026-06-04

## Csomag moduljai

| Modul | Állapot |
|-------|---------|
| DMS / Dokumentumkezelés | Engedélyezve |
| CRM / Ügyfélkezelés | Engedélyezve |
| Workflow / Csapatmunka / Team | Engedélyezve |
| Auth, Audit, Backup, Beállítások, Rendszer | Engedélyezve |
| HR | **Tiltva** |
| Logisztika / Raktár / Termékek | **Tiltva** |
| Kontrolling | **Tiltva** |
| Gyártás, Webshop, Marketing | **Tiltva** (nincs külön modul – API/route guard) |

## Örökölt javítások (v1.0.1b+)

- `@mbit-erp/config` runtime packaging (`ensure-backend-config-package` + packaged ellenőrzés)
- DMS „Irat helye” kompatibilitás (lista + szerkesztés + POST `jelenlegiHely`)
- DMS részletek `j.filter is not a function` javítás
- Workflow duplikált mezők eltávolítva; több személy hozzárendelése
- Team komment szerkesztés + `updatedAt` + audit log
- `erp-build-meta.json` → runtime `ERP_PACKAGE` / `APP_VERSION` a backendnek
- PackageModuleGuard + RBAC package permission szűrés
- CRM legutóbbi javítások a release ágból

## CI artifact név

`mbit-erp-v1.0.1d-{shortsha}-dms-crm-workflow-DMS-CRM-WF-windows.zip`

## Build (lokális)

```bash
npm run build:config
npm run package:dms-crm-workflow
```

Vagy manuálisan:

```bash
export ERP_PACKAGE=dms-crm-workflow
export VITE_ACTIVE_PACKAGE=dms-crm-workflow
export APP_VERSION=1.0.1d
cd apps/server && npm run build
cd ../web && cross-env ELECTRON_BUILD=true npm run build
cd ../desktop && npm run package:win
```

## GitHub Actions

- **Branch:** `release/dms-crm-workflow` (automatikus build push után)
- **Manuális:** workflow_dispatch → Package: `dms-crm-workflow`

## Telepítési megjegyzések

1. Töltsd le a **portable ZIP** artifactot (ajánlott).
2. Csomagold ki, futtasd a `Mbit ERP.exe` fájlt.
3. Első indításkor SQLite DB: `%APPDATA%` alatti userData mappa.
4. Ellenőrizd: Beállítások → Rendszerinformáció → **MBIT ERP v1.0.1d**, csomag: DMS + CRM + Workflow Edition.

## Smoke-test checklist

- [ ] Login: **MBIT ERP v1.0.1d** · DMS + CRM + Workflow Edition
- [ ] Menü: Dokumentumok, CRM/Partnerek, Csapat, Folyamatleltár, Feladatlista, Beállítások
- [ ] Nincs HR / Logisztika / Kontrolling menü
- [ ] `/hr`, `/products`, `/controlling`, `/logistics` → redirect / 403
- [ ] DMS: irat helye lista + szerkesztés; részletek nem omlik össze
- [ ] CRM: partner lista, részletek, interakciók
- [ ] Workflow: több hozzárendelt személy mentése; nincs duplikált mező
- [ ] Team: komment szerkesztés, `updatedAt`
- [ ] Backend indul; nincs `Cannot find module '@mbit-erp/config'`
- [ ] `GET /system/version` → `1.0.1d`, `packageId: dms-crm-workflow`
- [ ] `GET /health/detailed` → verzió + edition
