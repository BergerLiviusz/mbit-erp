# GINOP PLUSZ-2.1.3-24 – DMS / Elektronikus iratkezelés on-premise megfelelőség

**Termék:** MB-IT ERP Windows desktop (Electron + beágyazott NestJS + SQLite)  
**Ellenőrzés:** valós feltöltött dokumentumokkal, seed nélkül is  
**Tárolás:** `MBIT_DATA_DIR` vagy `~/mbit-data` – `files/`, `ocr/`

| # | GINOP követelmény | Implementált funkció | Fájlok / endpoint | Ellenőrzés | Státusz | Megjegyzés |
|---|-------------------|----------------------|-------------------|------------|---------|------------|
| 1 | Elektronikus iktatás | Auto iktatószám `{ORG}/{TIPUS}/{YYYY}/{####}`, manuális adminnal, kereső | `document.service.generateIktatoSzam`, `POST /dms/documents`, `GET lookup/iktato/:sz` | Dokumentumok → iktató kereső | **Teljesítve** | `numbering.document.pattern` beállítás |
| 2 | Metaadatok | Teljes séma + szűrők + szerkesztés | `Document` modell, `Documents.tsx` | Lista + részletek | **Teljesítve** | `felelos`, `typeId` API-ban |
| 3 | Papír dokumentumok | PDF/JPG/PNG feltöltés, lokális tárolás, preview | `StorageService`, `POST upload`, `GET :id/download` | Előnézet gomb | **Teljesítve** | Nincs cloud |
| 4 | OCR + keresés | Szöveges PDF: `pdf-parse`; szkennelt PDF: **első oldal** OCR (sharp→Tesseract); képek: Tesseract | `ocr.service`, `POST :id/ocr` | OCR gomb + keresőmező | **Teljesítve** | Többoldalas szkennelt PDF teljes OCR: **nem támogatott** |
| 5 | Verziózás | Új verzió, lista, korábbi fájl | `DocumentVersion`, `POST :id/versions` | Részletek → Új verzió | **Teljesítve** | |
| 6 | Jogosultság | DocumentAccess READ/EDIT/FULL; update/upload/verzió/OCR route ACL | `document-operations.assertDocumentAccess` | Részletek → Jogosultságok | **Teljesítve** | Archivált doc. user nem módosíthat |
| 6b | Régi fájlútvonal | `uploads/...` fallback → `files/...` | `StorageService.resolveExistingRelativePath` | Hiányzó fájl: 404 UI üzenet | **Teljesítve** | `mbit-data/files` elsődleges |
| 7 | Workflow | 7 állapot + napló | `DocumentWorkflowLog`, `POST :id/workflow` | Állapotváltás select | **Teljesítve** | |
| 8 | Archiválás | `archivalva`, törlés tiltás usernek | `POST :id/archive`, delete guard | Archiválás gomb | **Teljesítve** | |
| 9 | Riport / export | CSV/XLSX lista + riport endpointok | `GET export/:format`, `GET reports/:type` | Export gombok | **Teljesítve** | Aktuális adat |
| 10 | Audit | CRUD, upload, iktatás, OCR, workflow, archive, export | `AuditService` + DMS controller | Audit → DMS szűrő | **Teljesítve** | |
| 11 | Desktop | Electron + Windows CI | `apps/desktop`, `build-desktop.yml` | Portable ZIP | **Teljesítve** | |

## CRM maradék (ugyanazon sprint)

| Pont | Státusz |
|------|---------|
| Ügyfél import UI (`/crm/import`) | **Teljesítve** |
| Kampány célközönség export (CSV/XLSX / kampány) | **Teljesítve** |
| Email/chat rögzítés élettörténetben | **Teljesítve** |
| Audit export + modul szűrő | **Teljesítve** |
| Számla-meta jelölés (nem NAV) | **Teljesítve** |
