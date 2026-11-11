# MBIT ERP – CRM + DMS + Workflow Edition (crm-dms-workflow)

**Verzió:** MBIT ERP v1.0.1i  
**Package ID:** `crm-dms-workflow`  
**Alias:** `ERP_CRM_DMS_WORKFLOW`  
**Release branch:** `release/crm-dms-workflow`

## Üzleti modulok (a kért három)

| Modul | Leírás | Állapot |
|-------|--------|---------|
| CRM | Értékesítés és ügyfélkapcsolati folyamatok fejlesztése | Engedélyezve |
| DMS | Elektronikus iratkezelés | Engedélyezve |
| Team / Workflow | Munkafolyamat irányítás (+ csapat kommunikáció) | Engedélyezve |
| Auth, Audit, Backup, Beállítások | Alapmodulok | Engedélyezve |

## Tiltott modulok

Logisztika, HR, Kontrolling, Gyártás / Webshop / Marketing (API guard)

## Előre feltöltött iratok

Friss első indításkor (üres adatbázis) az elektronikus iratkezelés listájában megjelennek:

- Adatlapok.pdf
- Adatlapok listája 2026.xlsx
- Munkalap - Anker köz klíma karbantartás.pdf
- Munkalap.pdf

Kategória: **Előtöltött iratok**. A fájlok a telepített alkalmazás `seed-documents` resource mappájából másolódnak a dokumentumtárba.

## CI artifact név

`mbit-erp-v1.0.1i-{sha}-crm-dms-workflow-CRM-DMS-WF-windows.zip`

## Build

```bash
npm run build:config
npm run package:crm-dms-workflow
```

## CI futtatás

- **Automatikus:** push a `release/crm-dms-workflow` branchre
- **Manuális:** GitHub Actions → Build Desktop App → branch: `release/crm-dms-workflow`, package: `crm-dms-workflow`

## Smoke-test checklist

- [ ] Login: **MBIT ERP v1.0.1i**
- [ ] Menü: Ügyfélkezelés, Dokumentumok, Folyamatleltár / Feladatlista / Workflow példányok, Csapat kommunikáció, Beállítások
- [ ] Nincs: Logisztika, HR, Kontrolling
- [ ] Dokumentumok lista: a 4 előre feltöltött irat látható friss első indítás után
- [ ] `GET /system/version` → `1.0.1i`, `packageId: crm-dms-workflow`
- [ ] Packaged: `resources/seed-documents/manifest.json` létezik
