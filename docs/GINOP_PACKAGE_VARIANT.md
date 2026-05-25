# GINOP package változat – ERP_GINOP_CRM_DMS_HR

## Package azonosító

| Mező | Érték |
|------|--------|
| Belső ID | `ginop-crm-dms-hr` |
| Legacy alias | `ERP_GINOP_CRM_DMS_HR` |
| Edition label | GINOP CRM+DMS+HR Edition |
| Verzió | MBIT ERP v1.0.1a |

## Pályázati modulok (ENGEDÉLYEZETT)

1. **Elektronikus iratkezelés (DMS)** – `documents: true`
2. **HR menedzsment** – `hr: true`
3. **Értékesítés és ügyfélkapcsolat (CRM)** – `crm: true`

További kötelező rendszerfunkciók:

- Auth, audit, backup, beállítások
- Dashboard (csak engedélyezett modul widgetekkel)
- Incident / hibajelentés (Settings)

## TILTOTT modulok

| Modul | Frontend | Backend |
|-------|----------|---------|
| Logisztika | Menü + route nincs | `LogisticsModule` nincs regisztrálva |
| Kontrolling | Menü + route nincs | `ControllingModule` nincs regisztrálva |
| Csapatmunka / workflow | Menü + route nincs | `TeamModule` nincs regisztrálva |
| Marketing / webshop / gyártás | Nincs a rendszerben | — |

API védelem: tiltott prefix (`/logistics`, `/controlling`, `/team`) → **403 Forbidden**.

## Build

```bash
npm run package:ginop
```

Env:

```
VITE_ACTIVE_PACKAGE=ginop-crm-dms-hr
ERP_PACKAGE=ginop-crm-dms-hr
APP_VERSION=1.0.1a
```

## Artifact név

```
mbit-erp-v1.0.1a-ginop-crm-dms-hr-windows.zip
mbit-erp-v1.0.1a-ginop-crm-dms-hr-setup.exe
```

## Branch

```
release/ginop-crm-dms-hr
```

Push erre a branchre → GitHub Actions automatikusan `ginop-crm-dms-hr` package build.

## Ellenőrzési folyamat (elfogadás)

1. **Login:** „MBIT ERP v1.0.1a” + „GINOP CRM+DMS+HR Edition”
2. **Menü:** csak Ügyfélkezelés, Dokumentumok, HR, Beállítások (+ Főoldal)
3. **URL:** `/products`, `/controlling/dashboard` → redirect / 403
4. **Beállítások → Rendszerinformáció:** packageId = `ginop-crm-dms-hr`
5. **API:** `GET /logistics/items` → 404 (modul nincs regisztrálva) vagy 403
6. **API:** `GET /team/*` → 403 (package guard)
7. **Artifact:** fájlnév tartalmazza `ginop-crm-dms-hr`

Teljes checklist: [GINOP_RELEASE_CHECKLIST.md](./GINOP_RELEASE_CHECKLIST.md)

## Validált állapot (2026-05-25)

| Terület | Eredmény |
|---------|----------|
| Központi package config | ✅ `ginop-crm-dms-hr` modulflag-ek |
| Lokális API `/system/version` | ✅ v1.0.1a, edition |
| Backend modul regisztráció | ✅ Logistics/Controlling/Team nincs betöltve |
| Frontend GINOP build | ✅ `VITE_ACTIVE_PACKAGE=ginop-crm-dms-hr` |
| Bundle dead code | ⚠️ dokumentálva |
| Windows portable smoke | ⏳ manuális |
| CI artifact | ⏳ `release/ginop-crm-dms-hr` push után |

## Kapcsolódó dokumentumok

- `docs/GINOP_CRM_MEGFELELOSEG.md`
- `docs/GINOP_DMS_MEGFELELOSEG.md`
- `docs/GINOP_HR_MEGFELELOSEG.md`
- `docs/GINOP_ALTALANOS_MEGFELELOSEG.md`
- `docs/PACKAGE_STRATEGY.md`
- `docs/VERSIONING_STRATEGY.md`
