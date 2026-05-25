# GINOP PLUSZ-2.1.3-24 – HR menedzsment on-premise megfelelőség

**Termék:** MB-IT ERP Windows desktop (Electron + beágyazott NestJS + SQLite)  
**Modul:** HR menedzsment alapmodul – **nem** teljes bérszámfejtő rendszer  
**Ellenőrzés:** üres adatbázissal is (első munkakör / dolgozó / szerződés / riport)

| # | GINOP követelmény | Implementált funkció | Modellek / endpoint / UI | Ellenőrzés | Státusz | Megjegyzés |
|---|-------------------|----------------------|---------------------------|------------|---------|------------|
| 1 | Munkakör nyilvántartások | CRUD, feladatok, hatáskörök, DMS leírás | `JobPosition`, `/hr/job-positions`, `/hr/job-positions/:id/employees` | HR → Munkakörök | **Teljesítve** | |
| 2 | Dolgozói alapadatok | Teljes adatlap + kapcsolódó rekordok | `Employee` + Education, Language, Medical, Disciplinary, StudyContract, PreviousEmployment, Award | HR → Dolgozók | **Teljesítve** | `adoszam`, `allapot`, `besorolas`, `munkaido` |
| 3 | Munkaszerződés-kezelés | Szerződés + módosítás + történet | `EmploymentContract`, `ContractAmendment`, `/hr/contracts` | HR → Szerződések | **Teljesítve** | `documentId` → DMS |
| 4 | Törvényi riportok / analitikák | Strukturált CSV/XLSX exportok | `/hr/reports/ginop/*`, `HrReportService` | HR → Riportok → GINOP blokk | **Teljesítve** | Nem hatósági beküldés |

## NAV/KSH HR alapadat analitika

- **Riport neve:** NAV/KSH HR alapadat analitika  
- **Endpoint:** `POST /hr/reports/ginop/nav-ksh-analytics?format=csv|xlsx`  
- **Mezők:** név, adóazonosító, TAJ, jogviszony kezdete/vége, munkakör, foglalkoztatás típusa, munkaidő, besorolás, szervezeti egység  
- **Korlátozás:** belső analitika; a tényleges NAV/KSH fájlformátum egyeztetése a bérszámfejtővel szükséges

## Egyéb GINOP exportok

| Kulcs | Leírás |
|-------|--------|
| `employee-master` | Dolgozói törzslista |
| `employment-relations` | Jogviszony lista |
| `job-positions` | Munkakör lista |
| `medical-expiry` | Orvosi vizsgálat lejárata (90 nap) |
| `contract-amendments` | Szerződésmódosítások |

## Jogosultság (backend guard)

| Szerepkör | Jogosultság |
|-----------|-------------|
| Admin | Minden HR jog |
| HR Admin | `hr:*` modul jogok (seed) |
| HR User | view, create, edit, export, contract_manage, report |
| Viewer | `hr:view` |

Kódok: `hr:view`, `hr:create`, `hr:edit`, `hr:delete`, `hr:export`, `hr:contract_manage`, `hr:admin`, `hr:report`, `hr:approve`

## DMS integráció (desktop UI)

- **DmsDocumentLinker** komponens: meglévő DMS választás, feltöltés HR kontextusból, megnyitás, leválasztás  
- Javasolt típusok: munkaszerződés, munkaköri leírás, végzettségi dokumentum, orvosi alkalmassági, tanulmányi szerződés  
- Munkaköri leírás: `JobPosition.jobDescriptionDocumentId`  
- Munkaszerződés: `EmploymentContract.documentId`  
- Dolgozói adatlap → **Dokumentumok** tab: DMS keresés / csatolás  
- Nincs párhuzamos HR fájltár – `mbit-data/files` (DMS)

## Dolgozói adatlap tabok (UI)

Alapadatok, Jogviszony, Munkakör/szervezet, Végzettségek, Korábbi munkahelyek, Nyelvtudás, Orvosi vizsgálatok, Fegyelmi/kitüntetés, Tanulmányi szerződések, Munkaszerződések, Dokumentumok, Audit/történet – mindegyiken lista + CRUD + validáció.

## Audit

Employee, Education, Contract, Amendment, HrExportLog események – `AuditService`

## Korlátozások

- Nincs teljes bérszámfejtés, járulék-számítás, NAV Online beküldés  
- Cafeteria / távollét / toborzás kiegészítő funkciók – nem GINOP alapkövetelmény  
- Seed opcionális demo; üzem nem függ tőle
