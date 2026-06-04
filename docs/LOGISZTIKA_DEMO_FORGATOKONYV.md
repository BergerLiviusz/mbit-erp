# Logisztika demo forgatókönyv – Customer 4-module v1.0.1b

**Package:** `customer-4module` (CRM, DMS, Logisztika, Workflow)

## 1. Termék és készlet

1. Logisztika → Termékek → új termék rögzítése raktárral és opcionális sarzssal.
2. Termék **Részletek**: ellenőrizd az **Aktuális készlet** és **Készletérték** mezőket.
3. Raktárban módosíts készletmennyiséget → Termék részletek újranyitása → mennyiség frissül.
4. **Szerkesztés**: sarzs mező visszatölt; több sarzs esetén „Sarzsok kezelése”.

## 2. Leltárív export (GINOP)

1. Logisztika → Leltárívek → nyitott/folyamatban/befejezett/jóváhagyott/lezárt ív.
2. Részletek → **PDF letöltés**, **Excel letöltés**, **Nyomtatás**.
3. Ellenőrizd: fájl megnyitható, auth hiba nélkül (Electron + web).

## 3. Készletérték

1. Logisztika → Készletérték értékelés.
2. Termék lot ár nélkül, de termék beszerzési árral → nem 0 Ft, „termék ár” forrás.
3. Ár nélküli termék → ⚠ figyelmeztetés.

## 4. Beszerzési rendelések

1. Logisztika → Beszerzési rendelések → új DRAFT rendelés.
2. **Szerkesztés** és **Törlés** működik DRAFT állapotban.
3. Beérkezett/lezárt rendelésnél törlés tiltott; **Archiválás** elérhető.

## Regresszió ellenőrzés

- HR menü nem látszik; `/hr/*` → 403.
- Csak CRM / DMS / Logisztika / Workflow modulok aktívak.
