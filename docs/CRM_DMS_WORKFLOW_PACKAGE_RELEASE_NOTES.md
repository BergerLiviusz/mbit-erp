# MBIT ERP – CRM + DMS + Workflow Edition (crm-dms-workflow)

**Verzió:** MBIT ERP v1.0.1h  
**Package ID:** `crm-dms-workflow`  
**Alias:** `ERP_CRM_DMS_WORKFLOW`  
**Release branch:** `release/crm-dms-workflow`  
**Release dátum:** 2026-09-02  
**Elsődleges platform:** macOS Apple Silicon (arm64)

## Üzleti modulok

| Modul | Leírás | Állapot |
|-------|--------|---------|
| CRM | Értékesítés és ügyfélkapcsolati folyamatok | Engedélyezve |
| DMS | Elektronikus iratkezelés | Engedélyezve |
| Workflow | Munkafolyamat irányítás (folyamatleltár, feladatok, példányok) | Engedélyezve |
| Auth, Audit, Backup, Beállítások, Rendszer | Alapmodulok | Engedélyezve |

## Tiltott modulok

| Modul | Állapot |
|-------|---------|
| Logisztika | **Tiltva** |
| HR | **Tiltva** |
| Kontrolling | **Tiltva** |
| Gyártás, Webshop, Marketing | **Tiltva** (API/route guard) |

## macOS artifact

A csomag **lokálisan, Apple Silicon Macen** készül (nem GitHub Actions Windows runneren):

- Küldhető DMG: `MBIT-ERP-CRM-DMS-Workflow-v1.0.1h-macOS-Apple-Silicon.dmg` (húzd a MBIT ERP ikont az Applications mappába)
- Portable ZIP: `mbit-erp-v1.0.1h-{shortsha}-crm-dms-workflow-CRM-DMS-WF-macos-arm64.zip`
- electron-builder nyers DMG: `MBIT ERP-1.0.1-h-arm64.dmg` (a `1.0.1h` semver-ként `1.0.1-h`)

Native backend modulok (Prisma, bcrypt, sharp) `darwin-arm64` + Node 18 (Electron 28 ABI) szerint buildelődnek.

## Build (lokális Mac, M-series)

Node 18 szükséges a natív addonokhoz (Electron 28 = Node 18):

```bash
export PATH="/opt/homebrew/opt/node@18/bin:$PATH"
npm run build:config
npm run package:crm-dms-workflow:mac
```

Kimenet: `apps/desktop/release/`

Aláírás nélkül a Gatekeeper figyelmeztetést ad; első indítás: jobb klikk → Megnyitás.

## Smoke-test checklist

- [ ] Login: **MBIT ERP v1.0.1h · CRM + DMS + Workflow**
- [ ] Menü: Ügyfélkezelés, Dokumentumok, Folyamatleltár / Feladatlista, Beállítások
- [ ] Nincs: Logisztika, HR, Kontrolling
- [ ] `/products`, `/hr`, `/controlling` → redirect / 403
- [ ] CRM, DMS, Workflow alapfolyamatok működnek
- [ ] `GET /system/version` → `1.0.1h`, `packageId: crm-dms-workflow`
- [ ] `file` a `.app` binárison: `arm64`
- [ ] Packaged: `@mbit-erp/config` elérhető runtime alatt
