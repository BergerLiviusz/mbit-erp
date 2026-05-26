# GINOP CRM+DMS+HR – Release checklist

**Státusz:** Release-kész (validáció folyamatban – CI + Windows smoke)  
**Utolsó frissítés:** 2026-05-25

---

## Release azonosítók

| Mező | Érték |
|------|--------|
| Branch | `release/ginop-crm-dms-hr` |
| Package ID | `ginop-crm-dms-hr` |
| APP_VERSION | `1.0.1a` |
| Edition | GINOP CRM+DMS+HR Edition |
| Commit SHA | `facce6a` (release branch HEAD) |
| Aktív CI run | https://github.com/BergerLiviusz/mbit-erp/actions/runs/26401673136 |
| Workflow runs | https://github.com/BergerLiviusz/mbit-erp/actions?query=branch%3Arelease%2Fginop-crm-dms-hr |
| Első run (hiba) | https://github.com/BergerLiviusz/mbit-erp/actions/runs/26400886300 – config build npm ci előtt |
| Javítás után | https://github.com/BergerLiviusz/mbit-erp/actions/runs/26401213125 – @mbit-erp/config hoisted install |
| Artifact név (CI) | `mbit-erp-v1.0.1a-{sha}-ginop-crm-dms-hr-windows` |
| Portable app artifact (CI) | `…-ginop-crm-dms-hr-portable-app` → `win-unpacked/MBIT ERP.exe` |
| Portable ZIP artifact (CI) | `…-ginop-crm-dms-hr-portable-zip` |
| Installer artifact (CI) | `…-ginop-crm-dms-hr-installer` (opcionális) |

---

## CI / artifact validáció

| Ellenőrzés | Elvárt | Státusz |
|------------|--------|---------|
| Workflow trigger `release/ginop-crm-dms-hr` | Igen | ⏳ push után |
| `PACKAGE=ginop-crm-dms-hr` | Igen | ✅ lokális env |
| `write-build-meta.mjs` CI lépés | `erp-build-meta.json` | ✅ lokális script |
| Artifact név minta | `mbit-erp-v1.0.1a-*-ginop-crm-dms-hr-windows*` | ⏳ CI |
| NSIS / portable ZIP feltöltés | Igen | ⏳ CI |

---

## Verzió megjelenítés (MBIT ERP v1.0.1a)

| Hely | Elvárt | Státusz |
|------|--------|---------|
| Login | MBIT ERP v1.0.1a + edition | ✅ implementálva |
| Settings → Rendszer | versionLabel + packageId | ✅ implementálva |
| Footer / Electron overlay | verzió + edition | ✅ implementálva |
| Title bar | MBIT ERP – GINOP CRM+DMS+HR Edition | ✅ build-meta |
| `GET /system/version` | 1.0.1a, ginop-crm-dms-hr | ✅ lokális API |
| `GET /health/detailed` | ugyanaz | ✅ lokális API |

---

## Modul izoláció

### Látható (UI)

| Modul | Státusz |
|-------|---------|
| CRM (Ügyfélkezelés) | ✅ |
| DMS (Dokumentumok) | ✅ |
| HR | ✅ |
| Beállítások | ✅ |
| Főoldal (CRM/DMS/HR widgetek) | ✅ |

### Nem látható (UI)

| Modul | Státusz |
|-------|---------|
| Logisztika | ✅ menü/route kikapcsolva |
| Kontrolling | ✅ menü/route kikapcsolva |
| Csapat / workflow | ✅ menü/route kikapcsolva |

### API / backend (lokális `ERP_PACKAGE=ginop-crm-dms-hr`)

| Endpoint | Elvárt | Mért |
|----------|--------|------|
| `/logistics/items` | 404 vagy 403 | ✅ 404 (modul nincs regisztrálva) |
| `/controlling/dashboard` | 404 vagy 403 | ✅ 404 |
| `/team/boards` | 403 | ✅ 403 (package guard) |
| `/crm/*`, `/dms/*`, `/hr/*` | elérhető (DB után) | ⏳ Windows smoke |

---

## Smoke-test checklist (Windows portable ZIP)

> **Környezet:** Windows 10/11, tiszta userData, portable ZIP kicsomagolva.

### Indítás

- [ ] App elindul, nincs crash
- [ ] Embedded backend elindul (`/health` OK)
- [ ] `%APPDATA%/mbit-erp/data/mbit-erp.db` létrejön
- [ ] `mbit-data` / uploads mappa létrejön

### Verzió

- [ ] Login: MBIT ERP v1.0.1a
- [ ] Login: GINOP CRM+DMS+HR Edition
- [ ] Beállítások → Rendszerinformáció egyezik

### Modul izoláció (manuális)

- [ ] Nincs Logisztika / Kontrolling / Csapat menü
- [ ] `/products`, `/controlling/dashboard`, `/team` → redirect vagy üres/403

### CRM

- [ ] Ügyfél létrehozás
- [ ] Árajánlat / rendelés (ha engedélyezett)
- [ ] Audit esemény naplózódik

### DMS

- [ ] PDF feltöltés + iktatás
- [ ] OCR (ha bekapcsolva)
- [ ] Keresés, archiválás

### HR

- [ ] Dolgozó + munkakör + szerződés
- [ ] HR export (CSV)

### Rendszer

- [ ] Backup indítás + lista + fájl a backups mappában
- [ ] Incident létrehozás + státusz + audit

### Üres DB (seed nélkül)

- [ ] Első indítás után admin login működik
- [ ] Első CRM / DMS / HR rekord menthető

---

## Static bundle audit

| Megállapítás | Státusz |
|--------------|---------|
| GINOP build egyetlen fő chunk (~1.4 MB) | ✅ |
| Tiltott modul UI szövegek a bundle-ben (dead code) | ⚠️ ismert |
| Route/API szintű izoláció | ✅ |
| UI menü/route nem elérhető | ✅ |
| Package-aware lazy import | ❌ nincs (következő sprint opció) |

**Következtetés:** A pályázati elfogadáshoz elegendő a route + API + menü izoláció. A bundle dead code nem funkcionális kockázat.

---

## Ismert korlátok

1. **Windows smoke-test** – macOS CI agenten nem futtatható az `.exe`; manuális Windows validáció szükséges.
2. **NSIS installer** – kisebb méret esetén használja a **portable ZIP**-et (lásd `WINDOWS_DESKTOP_BUILD.md`).
3. **Üres DB** – első indításkor Prisma schema szinkron szükséges (Electron bootstrap); seed nem kötelező.
4. **Bundle dead code** – logisztika/kontrolling komponensek a JS bundle-ben maradhatnak.

---

## Elfogadási státusz

| Kritérium | Állapot |
|-----------|---------|
| Release branch létezik | ⏳ push |
| CI sikeres | ⏳ |
| Windows artifact | ⏳ |
| Verzió mindenhol | ✅ kód + lokális API |
| Csak CRM/DMS/HR UI | ✅ |
| Tiltott API/route | ✅ lokális |
| Dokumentáció | ✅ |
| Windows smoke teljes | ⏳ manuális |

**Összesített release readiness:** 🟡 **CI + Windows smoke függő** (kód és lokális backend validáció kész)
