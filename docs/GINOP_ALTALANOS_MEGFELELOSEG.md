# GINOP PLUSZ-2.1.3-24 – Általános on-premise megfelelőség

**Termék:** MB-IT ERP – kizárólag **Windows desktop** (Electron + beágyazott NestJS + SQLite), lokális `mbit-data` tároló.

| # | Követelmény | Implementáció | Ellenőrzés | Státusz |
|---|-------------|---------------|------------|---------|
| 1 | Jogosultságkezelés | RBAC guard minden modul route-on; `hr:*`, `dms:*`, `crm:*`, `system:*` | Bejelentkezés szerepkörrel; tiltott API 403 | **Teljesítve** |
| 2 | Audit napló | `AuditService` – entitás, esemény, userId, időbélyeg | Beállítások / CRM audit; dolgozói adatlap Audit tab | **Teljesítve** |
| 3 | Backup | `POST /system/diagnostics/backup/now`, lista, `mbit-data/backups` | Beállítások → Biztonsági mentések | **Teljesítve** |
| 4 | Restore | Manuális ZIP visszaállítás dokumentálva (admin, megerősítés) | `docs/WINDOWS_DESKTOP_BUILD.md` | **Dokumentált** |
| 5 | Hibabejelentés | `BugReport` modell + `IncidentReports` UI, kategóriák | Beállítások → Hibabejelentés | **Teljesítve** |
| 6 | Rendszerinformáció | `GET /health/detailed`, `GET /system/version` + Beállítások → Rendszer | **MBIT ERP v1.0.1a**, package edition, DB, tároló, OCR, backup | **Teljesítve** |
| 8 | Moduláris package (GINOP) | `ginop-crm-dms-hr` – csak CRM+DMS+HR; backend modul + API guard | Menü, route, `/logistics` 403 | **Teljesítve** |
| 7 | Nincs cloud függés | Lokális fájlok, SQLite, opcionális SMTP | Offline desktop indítás | **Teljesítve** |

## Jogosultság szerepkörök (példa)

| Szerepkör | HR | DMS | Export |
|-----------|----|----|--------|
| Admin | teljes | teljes | igen |
| HR Admin | teljes | olvasás | igen |
| HR User | szerkesztés | olvasás | igen |
| Viewer | olvasás | olvasás | nem |
| Logistics Admin | teljes | olvasás/szerkesztés | igen |
| Warehouse User | készlet, leltár | olvasás | részleges |

Package és verzió: [PACKAGE_STRATEGY.md](./PACKAGE_STRATEGY.md) · [VERSIONING_STRATEGY.md](./VERSIONING_STRATEGY.md) · [GINOP_PACKAGE_VARIANT.md](./GINOP_PACKAGE_VARIANT.md)  
Részletes logisztika megfelelőség: [GINOP_LOGISZTIKA_MEGFELELOSEG.md](./GINOP_LOGISZTIKA_MEGFELELOSEG.md)  
Részletes kontrolling megfelelőség: [GINOP_CONTROLLING_MEGFELELOSEG.md](./GINOP_CONTROLLING_MEGFELELOSEG.md)  
**Permission sync:** `PermissionSyncService` – minden induláskor hiányzó jogosultságok és szerepkör-kapcsolatok pótlása (reseed nélkül).

## Korlátozások

- Electron desktop módban (`ELECTRON_RUN_AS_NODE`) a backend admin kontextussal fut – szándékos egyszerűsítés.
- Restore nincs egy kattintásos UI-ból – adatvesztés kockázat miatt dokumentált manuális folyamat.
