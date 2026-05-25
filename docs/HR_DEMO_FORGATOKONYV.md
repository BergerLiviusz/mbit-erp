# HR modul – demo forgatókönyv (Windows desktop)

**Előfeltétel:** HR modul engedélyezett csomag (`package-hr` vagy `full`), bejelentkezés Admin vagy HR Admin felhasználóval.

## 1. HR menü megnyitása

1. Indítsa az MB-IT ERP desktop alkalmazást.
2. A felső menüben válassza: **HR → Dolgozók** (vagy Munkakörök / Szerződések / Riportok).

## 2. Munkakör létrehozása

1. **HR → Munkakörök**
2. **Új munkakör** – azonosító, név, osztály, részleg
3. Feladatok és hatáskörök szöveges kitöltése
4. Mentés

## 3. Munkaköri leírás csatolása (DMS)

1. Nyissa meg a munkakört szerkesztésre
2. **Munkaköri leírás dokumentum** mezőben adja meg a DMS dokumentum azonosítóját (előzőleg iktatott PDF)
3. Mentés

## 4. Dolgozó létrehozása

1. **HR → Dolgozók** → **Új dolgozó**
2. Egyedi azonosító, név, opcionális TAJ, email
3. Mentés

## 5. Dolgozói alapadatok kitöltése

1. Dolgozó megnyitása → szerkesztés
2. Jogviszony kezdete, típus, besorolás, munkaidő, osztály/részleg
3. Adóazonosító (adoszam) kitöltése riporthoz
4. Mentés

## 6. Végzettség / nyelvtudás / orvosi vizsgálat

1. Dolgozó → **Részletek** → tab: Végzettségek, Nyelvtudás, Orvosi vizsgálatok
2. **Új elem** űrlap → Hozzáadás; törlés a listában

## 7. Munkaszerződés rögzítése

1. **HR → Szerződések** → új szerződés
2. Dolgozó, szerződésszám, típus, kezdet, fizetés
3. Opcionális DMS `documentId` a szerződés PDF-hez

## 8. Szerződésmódosítás rögzítése

1. Szerződés kiválasztása → **Módosítás hozzáadása**
2. Dátum, típus, leírás, új fizetés (ha van)
3. Mentés – a módosítások listában megjelenik

## 9. Munkakör dolgozói listája

1. **HR → Munkakörök** → munkakör megnyitása
2. A kapcsolódó dolgozók a részleteknél / API: `GET /hr/job-positions/:id/employees`

## 10. NAV/KSH HR alapadat analitika export

1. **HR → Riportok**
2. **GINOP HR alapriportok** → **NAV/KSH HR alapadat analitika**
3. **CSV** vagy **XLSX** letöltés
4. Ellenőrizze a fejlécet és a dolgozói sorokat

## 11. Audit napló

1. **CRM → Audit napló** (vagy rendszer audit, ha elérhető)
2. Szűrés: entitás `Employee`, `EmploymentContract`, `HrExportLog`
3. Export / szerződés módosítás események ellenőrzése

---

**Megjegyzés:** A riportok nem küldenek adatot hatósági portálra; belső analitika és bérszámfejtő előkészítés céljára használhatók.
