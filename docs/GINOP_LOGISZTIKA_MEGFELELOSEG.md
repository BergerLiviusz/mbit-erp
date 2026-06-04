# GINOP logisztika megfelelőség – Customer 4-module v1.0.1b

## Leltárív nyomtatása a rendszerből

| Követelmény | Implementáció | Állapot |
|-------------|---------------|---------|
| Leltárív generálás rendszerből | `GET /logistics/inventory-sheets/:id/export/pdf` | ✅ v1.0.1b |
| Excel export | `GET /logistics/inventory-sheets/:id/export/xlsx` | ✅ v1.0.1b |
| Nyomtatás | PDF generálás + `apiPrintPdf` (Electron-kompatibilis) | ✅ v1.0.1b |
| Minden leltár állapot | NYITOTT, FOLYAMATBAN, BEFEJEZETT, JOVAHAGYVA, LEZARVA | ✅ |
| Audit | export esemény naplózva (`InventorySheet` entitás) | ✅ |

## Készletnyilvántartás

| Követelmény | Implementáció | Állapot |
|-------------|---------------|---------|
| Aktuális készlet megjelenítés | StockLevel aggregáció termék részletekben | ✅ v1.0.1b |
| Sarzs/gyártási szám nyomon követés | StockLot modell + UI | ✅ v1.0.1b |
| Készletérték számítás | Lot ár + Item.beszerzesiAr fallback | ✅ v1.0.1b |

## Ismert korlátok

- Üres leltárív (0 tétel) esetén is sablon export készül, de üres táblázattal.
- Beszerzési rendelés tételek csak DRAFT állapotban módosíthatók teljes körűen.
