# MBIT ERP – HR Edition (hr-only)

**Verzió:** MBIT ERP v1.0.1g  
**Package ID:** `hr-only`  
**Aliasok:** `ERP_HR_ONLY`, `ERP_HR`, `package-hr`  
**Release branch:** `release/hr-only`  
**Release dátum:** 2026-09-10  
**Előd:** `package-hr` (legacy HR-only csomag)

## Csomag moduljai

| Modul | Állapot |
|-------|---------|
| HR | Engedélyezve |
| Auth, Audit, Backup, Beállítások, Rendszer | Engedélyezve |
| DMS / Dokumentumkezelés | **Tiltva** |
| Workflow / Team / Csapat kommunikáció | **Tiltva** |
| CRM / Ügyfélkezelés | **Tiltva** |
| Logisztika / Raktár / Termékek | **Tiltva** |
| Kontrolling | **Tiltva** |

## HR funkciók (aktuális main / GINOP 1.5)

- Dolgozók és munkakörök
- Munkaszerződések és módosítások
- Cafeteria
- Toborzás / pályázatok
- Beléptetés
- Teljesítménycélok
- Időgazdálkodás
- Távollétek
- HR riportok

## Javítás (v1.0.1g)

A korábbi HR-only csomagban az **Új dolgozó** mentés üres `jobPositionId` (`""`) mezőt küldött. Prisma SQLite-on ezt idegen kulcsként értelmezte, és elhasalt:

`Invalid prisma.employee.create() invocation: Foreign key constraint violated: foreign key.`

Most az üres opcionális mezők (munkakör, TAJ, dátumok) `null`/`undefined` értékként mennek a backendre, ezért dolgozó munkakör nélkül is létrehozható.

## CI artifact név

`mbit-erp-v1.0.1g-{shortsha}-hr-only-HR-windows.zip`

## Build (lokális)

```bash
npm run build:config
npm run package:hr-only
```

Vagy manuálisan:

```bash
export ERP_PACKAGE=hr-only
export VITE_ACTIVE_PACKAGE=hr-only
export APP_VERSION=1.0.1g
cd apps/server && npm run build
cd ../web && cross-env ELECTRON_BUILD=true npm run build
cd ../desktop && npm run package:win
```

## CI futtatás

- **Automatikus:** push a `release/hr-only` branchre
- **Manuális:** GitHub Actions → Build Desktop App → `workflow_dispatch` → branch: `release/hr-only`, package: `hr-only`

A legacy `package-hr` branch továbbra is a régi `hr` package ID-t építi; az új artifact a `release/hr-only` ágon készül.

## Telepítési megjegyzések

1. Töltsd le a **portable ZIP** artifactot (ajánlott).
2. Csomagold ki, futtasd a `MBIT ERP.exe` / `Mbit ERP.exe` fájlt.
3. Ellenőrizd: Beállítások → Rendszerinformáció → **MBIT ERP v1.0.1g**, csomag: HR Edition.

## Smoke-test checklist

- [ ] Login: **MBIT ERP v1.0.1g**
- [ ] Menü: HR (Dolgozók, Munkakörök, Szerződések, Cafeteria, Toborzás, Beléptetés, Teljesítmény, Idő, Távollétek, Riportok), Beállítások
- [ ] Nincs: Főoldal, Dokumentumok, Workflow, Ügyfélkezelés, Logisztika, Kontrolling
- [ ] `/documents`, `/workflows`, `/crm`, `/products` → redirect / 403, nem crash
- [ ] **Új dolgozó** munkakör nélkül menthető (nincs Prisma FK hiba)
- [ ] Dolgozó szerkesztés, munkakör hozzárendelés
- [ ] Munkakör, szerződés, cafeteria, toborzás alapfolyamat
- [ ] Backend indul; nincs `Cannot find module '@mbit-erp/config'`
- [ ] `GET /system/version` → `1.0.1g`, `packageId: hr-only`
- [ ] Packaged: `resources/backend/node_modules/@mbit-erp/config/dist/index.js` létezik
