# GINOP PLUSZ-2.1.3-24 – Kontrolling / Döntéstámogatás on-premise megfelelőség

**Termék:** MB-IT ERP – Windows desktop (Electron + NestJS + SQLite)  
**Ellenőrzés:** Üres DB, offline desktop, `full` vagy `package-1` csomag (controlling engedélyezve)

| # | Követelmény | Implementáció | API | UI | Státusz |
|---|-------------|---------------|-----|-----|---------|
| 1 | Vezetői dashboard | `DashboardAggregationService` | `GET /controlling/dashboard` | Kontrolling → Dashboard | **Teljesítve** |
| 2 | KPI modulok szerint | CRM, DMS, HR, Logisztika, Rendszer aggregáció | ugyanaz | KPI kártyák | **Teljesítve** |
| 3 | Grafikonok | recharts (lokális) | dashboard `charts` | oszlop/vonal/kör | **Teljesítve** |
| 4 | Előre definiált riportok | `ReportCatalogService` + `ReportTemplate` | `GET /controlling/reports/templates` | Riportok | **Teljesítve** |
| 5 | CSV/XLSX export | `ReportExportService` | `GET .../run/:format` | Export gombok | **Teljesítve** |
| 6 | Ad-hoc riport (minimál) | modul + mező + export | `POST /controlling/reports/adhoc/run/:format` | Ad-hoc riport | **Teljesítve** |
| 7 | KPI definíciók | meglévő `KPI` modell + bővítés | `/controlling/kpi` | KPI mutatószámok | **Teljesítve** |
| 8 | Jogosultság | `CONTROLLING_*`, `KPI_MANAGE`, `REPORT_MANAGE` | `RbacGuard` | `usePermissions` | **Teljesítve** |
| 9 | Permission sync | `PermissionSyncService` startup | automatikus | – | **Teljesítve** |
| 10 | Audit | `AuditService` | export, riport futtatás | CRM audit minta | **Teljesítve** |
| 11 | Metric snapshot | `SystemMetricSnapshot` | dashboard refresh | – | **Teljesítve** |

## Szerepkörök

| Szerepkör | Jogosultság |
|-----------|-------------|
| Admin | minden Kontrolling + modul view |
| Controlling Admin | teljes kontrolling |
| Manager | view + export |
| Viewer | view |

## Korlátozások

- Nem teljes BI platform (nincs OLAP, nincs külső DWH).
- Ad-hoc builder: modul + mező választás, nem drag-and-drop designer.
- PDF export opcionális – jelenleg CSV/XLSX (meglévő export service).
- Külső adatbázis kapcsolatok (DatabaseConnections) opcionális kiegészítő – nem kötelező GINOP demóhoz.
