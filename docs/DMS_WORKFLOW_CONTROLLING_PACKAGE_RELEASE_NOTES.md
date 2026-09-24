# MBIT ERP – DMS + Workflow + Controlling Edition (dms-workflow-controlling)

**Verzió:** MBIT ERP v1.0.1h  
**Package ID:** `dms-workflow-controlling`  
**Alias:** `ERP_DMS_WORKFLOW_CONTROLLING`  
**Release branch:** `release/dms-workflow-controlling`

## Üzleti modulok (a kért három)

| Modul | Leírás | Állapot |
|-------|--------|---------|
| DMS | Elektronikus iratkezelés | Engedélyezve |
| Team / Workflow | Munkafolyamat irányítás (+ csapat kommunikáció) | Engedélyezve |
| Kontrolling | Kontrolling és döntéstámogatás | Engedélyezve |
| Auth, Audit, Backup, Beállítások | Alapmodulok | Engedélyezve |

## Tiltott modulok

CRM, Logisztika, HR, Gyártás / Webshop / Marketing (API guard)

## Artifact

`mbit-erp-v1.0.1h-{sha}-dms-workflow-controlling-DMS-WF-CTRL-windows.zip`

## Build

```bash
npm run build:config
npm run package:dms-workflow-controlling
```
