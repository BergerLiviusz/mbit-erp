# MBIT ERP – CRM Edition (crm-only)

**Verzió:** MBIT ERP v1.0.1f  
**Package ID:** `crm-only`  
**Aliasok:** `ERP_CRM_ONLY`, `ERP_CRM`  
**Release branch:** `release/crm-only`  
**Release dátum:** 2026-07-08

## Csomag moduljai

| Modul | Állapot |
|-------|---------|
| Értékesítés és ügyfélkapcsolatok / CRM | Engedélyezve |
| Auth, Audit, Backup, Beállítások, Rendszer | Engedélyezve |
| DMS / Dokumentumkezelés | **Tiltva** |
| Workflow / Team / Csapat kommunikáció | **Tiltva** |
| HR | **Tiltva** |
| Logisztika / Raktár / Termékek | **Tiltva** |
| Kontrolling | **Tiltva** |
| Gyártás, Webshop, Marketing | **Tiltva** (nincs külön modul – API/route guard) |

## CRM funkciók (GINOP örökség)

- Ügyfél / partner kezelés, kapcsolattartók, élettörténet
- Front office: email, chat / belső üzenet
- Kampányok: létrehozás, célközönség szűrés, export
- Leadek / lehetőségek (opportunity)
- Ajánlatok → rendelések → **CRM bizonylati stub** (számla-meta)
- Kedvezménykezelés
- Reklamációk / ticketek, eszkaláció
- CRM riport / export, audit események

> **Fontos:** A CRM bizonylati stub **nem** NAV Online Számla és **nem** teljes pénzügyi-számviteli számlázó rendszer. Csak CRM folyamat-meta adatokat tárol.

## Örökölt javítások (v1.0.1b–e)

- `@mbit-erp/config` runtime packaging (`ensure-backend-config-package` + packaged ellenőrzés)
- PackageModuleGuard + RBAC package permission szűrés (admin sem bypassol)
- `erp-build-meta.json` → runtime `ERP_PACKAGE` / `APP_VERSION` a backendnek
- Artifact név: verzió + package ID + modul rövidítés (CRM)
- CRM UI/API javítások a release branch örökségéből

## CI artifact név

`mbit-erp-v1.0.1f-{shortsha}-crm-only-CRM-windows.zip`

## Build (lokális)

```bash
npm run build:config
npm run package:crm-only
```

Vagy manuálisan:

```bash
export ERP_PACKAGE=crm-only
export VITE_ACTIVE_PACKAGE=crm-only
export APP_VERSION=1.0.1f
cd apps/server && npm run build
cd ../web && cross-env ELECTRON_BUILD=true npm run build
cd ../desktop && npm run package:win
```

## CI futtatás

- **Automatikus:** push a `release/crm-only` branchre
- **Manuális:** GitHub Actions → Build Desktop App → `workflow_dispatch` → branch: `release/crm-only`, package: `crm-only`

## Telepítési megjegyzések

1. Töltsd le a **portable ZIP** artifactot (ajánlott).
2. Csomagold ki, futtasd a `MBIT ERP.exe` / `Mbit ERP.exe` fájlt.
3. Ellenőrizd: Beállítások → Rendszerinformáció → **MBIT ERP v1.0.1f**, csomag: CRM Edition.

## Smoke-test checklist

- [ ] Login: **MBIT ERP v1.0.1f**
- [ ] Menü: Ügyfélkezelés (Partnerek, Lehetőségek, Árajánlatok, Rendelések, CRM bizonylati stub, Chat), Beállítások
- [ ] Nincs: Dokumentumok, Workflow, Csapat kommunikáció, HR, Logisztika, Kontrolling
- [ ] `/documents`, `/workflows`, `/hr`, `/products`, `/controlling` → redirect / 403, nem crash
- [ ] Ügyfél létrehozás / szerkesztés / import-export
- [ ] Kampány létrehozás, célközönség szűrés, export
- [ ] Front office email és chat
- [ ] Ajánlat → rendelés → CRM bizonylati stub
- [ ] Ticket / reklamáció, eszkaláció
- [ ] Audit események naplózódnak
- [ ] Backend indul; nincs `Cannot find module '@mbit-erp/config'`
- [ ] `GET /system/version` → `1.0.1f`, `packageId: crm-only`
- [ ] `GET /health/detailed` → verzió + edition
- [ ] Packaged: `resources/backend/node_modules/@mbit-erp/config/dist/index.js` létezik
