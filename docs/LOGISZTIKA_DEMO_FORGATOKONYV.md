# Logisztika modul – GINOP demo forgatókönyv

**Környezet:** Windows desktop MB-IT ERP, logisztika modul engedélyezve (`package-2` / `package-4` / `full`)  
**Előfeltétel:** Backend fut; üres DB esetén admin felhasználó + `npx prisma db push`

## 1. Új cikk létrehozása

1. Menü: **Logisztika → Cikkek**
2. **Új termék** – azonosító, név, egység, árak, opcionális vonalkód
3. Mentés → lista frissül

## 2. Kategória hozzárendelés

1. **Logisztika → Kategóriák** – új kategória (opcionális szülő)
2. **Cikkek** – szerkesztés → `categoryId` mező (API-n keresztül; UI bővítés: kategória select a termék űrlapon)

## 3. Raktár létrehozása

1. **Logisztika → Raktárak** – új raktár: azonosító, név, cím, felelős

## 4. Készlet bevételezés

1. **Logisztika → Készletmozgások → Új mozgás**
2. Típus: **Bevételezés**, cikk, raktár, mennyiség, opcionális sarzs

## 5. Sarzs létrehozás

1. Bevételezésnél **sarzs/gyártási szám** megadása
2. **Logisztika → Sarzsok** – lista, lejárati riport export

## 6. Raktárközi átmozgatás

1. Készletmozgások → **Raktárközi átmozgatás**
2. Forrás + cél raktár, mennyiség

## 7. Beszerzési rendelés

1. **Logisztika → Beszerzések → Rendelés létrehozása**
2. Szállító, tételek → állapot: draft
3. **Jóváhagyás** → **Megrendelés**

## 8. Beérkezés

1. **Beérkezés rögzítése** – raktár, tételek mennyisége
2. **Készletre vétel** – automatikus készlet és `StockMove`

## 9. Leltár

1. **Logisztika → Leltár** – új leltárív, tényleges mennyiségek
2. Eltérések → korrekció alkalmazása (meglévő inventory-sheet flow)

## 10. Visszáru

1. **Logisztika → Visszáru** – új, ok, jóváhagyás, feldolgozás

## 11. Készlet riport export

1. **Logisztika → Riportok** – pl. „Aktuális készlet”, XLSX export
2. Fájl letöltése lokálisan

## 12. Audit napló

1. **Logisztika → Audit napló**
2. Export CSV/XLSX – cikk, mozgás, beszerzés események

---

**Ellenőrző lista:** minden lépés seed nélkül is működik üres adatbázison (törzsadatok manuális felvitelével).
