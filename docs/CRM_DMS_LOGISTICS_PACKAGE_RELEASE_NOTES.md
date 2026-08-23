# MBIT ERP – CRM + DMS + Logistics Edition (crm-dms-logistics)

**Verzió:** MBIT ERP v1.0.1g  
**Package ID:** `crm-dms-logistics`  
**Alias:** `ERP_CRM_DMS_LOGISTICS`  
**Release branch:** `release/crm-dms-logistics`  
**Release dátum:** 2026-08-23

## Üzleti modulok

| Modul | Leírás | Állapot |
|-------|--------|---------|
| CRM | Értékesítés és ügyfélkapcsolati folyamatok | Engedélyezve |
| DMS | Elektronikus iratkezelés | Engedélyezve |
| Logisztika | Beszerzés és készletgazdálkodás | Engedélyezve |
| Auth, Audit, Backup, Beállítások, Rendszer | Alapmodulok | Engedélyezve |

## Tiltott modulok

| Modul | Állapot |
|-------|---------|
| Workflow / Team / Csapat kommunikáció | **Tiltva** |
| HR | **Tiltva** |
| Kontrolling | **Tiltva** |
| Gyártás, Webshop, Marketing | **Tiltva** (API/route guard) |

## Örökölt javítások

- `@mbit-erp/config` runtime packaging
- PackageModuleGuard + RBAC package permission szűrés
- CRM GINOP funkciók (kampány, ticket, front office, bizonylati stub)
- `erp-build-meta.json` → runtime `ERP_PACKAGE` / `APP_VERSION`

## CI artifact név

`mbit-erp-v1.0.1g-{shortsha}-crm-dms-logistics-CRM-DMS-LOG-windows.zip`

## Build (lokális)

```bash
npm run build:config
npm run package:crm-dms-logistics
```

## CI futtatás

- **Automatikus:** push a `release/crm-dms-logistics` branchre
- **Manuális:** GitHub Actions → Build Desktop App → branch: `release/crm-dms-logistics`, package: `crm-dms-logistics`

## Smoke-test checklist

- [ ] Login: **MBIT ERP v1.0.1g**
- [ ] Menü: Ügyfélkezelés, Dokumentumok, Logisztika, Beállítások
- [ ] Nincs: Workflow, HR, Kontrolling
- [ ] `/workflows`, `/hr`, `/controlling` → redirect / 403
- [ ] CRM, DMS, Logisztika alapfolyamatok működnek
- [ ] `GET /system/version` → `1.0.1g`, `packageId: crm-dms-logistics`
- [ ] Packaged: `@mbit-erp/config` elérhető runtime alatt
