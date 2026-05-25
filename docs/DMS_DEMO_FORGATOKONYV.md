# DMS demo forgatókönyv (GINOP ellenőrzés, seed nélkül)

**Előfeltétel:** Windows desktop app, bejelentkezés adminnal. Opcionális: `dms.ocr.enabled=true` beállítás.

## 1. Belépés admin felhasználóval

`admin@mbit.hu` / `admin123`

## 2. Dokumentum feltöltése

Menü: **Dokumentumok** → **+ Új dokumentum / iktatás** → PDF vagy JPG feltöltés

## 3. Automatikus iktatószám

Mentés után lista: új sor **iktatószám** oszlopban (pl. `MBIT/SZERZODES/2026/0001`)

## 4. Metaadatok

Részletek → kategória, ügyfél, irány, fizikai hely, érvényesség, felelős

## 5. OCR indítása

Részletek → **OCR indítása** → OCR státusz `kesz` → OCR szöveg blokk

- **Szöveges PDF:** beágyazott szöveg kinyerése (`pdf-parse`)
- **Szkennelt PDF:** első oldal OCR (sharp + Tesseract) – többoldalas teljes OCR nem támogatott
- **Kép (JPG/PNG):** Tesseract OCR

## 6. Keresés OCR szövegben

Lista felső keresőmező: szó a dokumentumból → találat

## 7. Új verzió

Részletek → **Új verzió** → másik PDF választása → verziótörténet

## 8. Jogosultság másik felhasználónak

Részletek → Jogosultság hozzáadása → `sales@mbit.hu` (ha létezik) → Olvasás/Szerkesztés

## 9. Workflow állapotváltás

Részletek → Állapotváltás → pl. **Jóváhagyásra vár** + megjegyzés → idővonal

## 10. Archiválás

**Archiválás** gomb → állapot **Archivált** → normál user nem törölheti

## 11. Export / riport

Lista: **Export CSV** / **Export XLSX**  
API: `GET /dms/documents/reports/expiring`

## 12. Audit

**Audit napló** → modul: **DMS** → Document események (iktatas, upload, workflow, archive)

## CRM kiegészítő (opcionális ugyanazon demo)

- `/crm/import` – CSV ügyfél import előnézettel  
- Kampány → **Célközönség CSV/XLSX**  
- Partnerek → Élettörténet → email/chat rögzítés  
- Rendelések → **🧾 Meta** (CRM számla-meta, nem NAV)
