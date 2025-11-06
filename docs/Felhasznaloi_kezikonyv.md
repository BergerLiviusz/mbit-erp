# Felhasználói Kézikönyv
## Mbit ERP Rendszer v1.0

---

## 1. Bevezetés

Üdvözöljük az Mbit ERP rendszerben! Ez a modul vállalati alkalmazás egyesíti a CRM, DMS és Logisztikai funkciókat egy könnyen használható felületen.

### 1.1 A Rendszer Főbb Funkciói

- **CRM (Ügyfélkapcsolat-kezelés):** Ügyfelek, kampányok, értékesítési folyamatok, reklamációk kezelése
- **DMS (Dokumentumkezelés):** Elektronikus ir atkezelés, iktatás, OCR, archiválás
- **Logisztika:** Cikktörzs, raktárkezelés, készletfigyelés, árlisták

---

## 2. Bejelentkezés

### 2.1 Első Bejelentkezés

1. Nyissa meg az alkalmazást böngészőben vagy desktop appként
2. Adja meg email címét és jelszavát
3. Kattintson a "Bejelentkezés" gombra

**Alapértelmezett admin fiók:**
- Email: `admin@mbit.hu`
- Jelszó: `admin123`

⚠️ **Fontos:** Első bejelentkezés után változtassa meg a jelszavát!

### 2.2 Jelszó Visszaállítás

Ha elfelejtette jelszavát:
1. Kattintson az "Elfelejtettem a jelszavam" linkre
2. Adja meg email címét
3. Ellenőrizze postafiókját a visszaállítási linkért

---

## 3. CRM Modul

### 3.1 Ügyféltörzs Kezelése

#### Új Ügyfél Létrehozása:
1. Navigáljon: **CRM > Ügyfelek**
2. Kattintson az **"Új Ügyfél"** gombra
3. Töltse ki a kötelező mezőket:
   - Név
   - Típus (vevő/szállító)
   - Adószám
   - Cím
   - Email és telefon
4. Kattintson **"Mentés"**

#### Ügyfél Szerkesztése:
1. Keresse meg az ügyfelet a listában
2. Kattintson a névre
3. Módosítsa a szükséges adatokat
4. Kattintson **"Mentés"**

#### Kapcsolattartók Hozzáadása:
1. Nyissa meg az ügyfél adatlapját
2. Görgessen a **"Kapcsolattartók"** részhez
3. Kattintson **"Új Kapcsolattartó"**
4. Töltse ki az adatokat
5. Jelölje meg az elsődleges kapcsolattartót

### 3.2 Kampánymenedzsment

#### Új Kampány Indítása:
1. **CRM > Kampányok > Új Kampány**
2. Adja meg:
   - Kampány neve
   - Típus (email, telefon, esemény)
   - Kezdet és vég dátumok
   - Költségvetés
3. Válassza ki a célközönséget
4. Indítsa el a kampányt

#### Visszajelzések Rögzítése:
1. Nyissa meg a kampányt
2. Kattintson egy ügyfélre
3. Rögzítse a visszajelzést (pozitív/negatív/semleges)

### 3.3 Értékesítési Folyamat

Az értékesítési lánc: **Ajánlat → Rendelés → Szállítás → Számlázás**

#### Ajánlat Készítése:
1. **CRM > Ajánlatok > Új Ajánlat**
2. Válasszon ügyfelet
3. Adjon hozzá tételeket a cikktörzsből
4. Állítsa be kedvezményeket:
   - Mennyiségi kedvezmény
   - Egyedi ár
   - Időszaki akció
5. Mentse és küldje el az ügyfélnek

#### Rendelés Létrehozása Ajánlatból:
1. Nyissa meg a jóváhagyott ajánlatot
2. Kattintson **"Rendelés Létrehozása"**
3. A rendszer automatikusan átveszi az adatokat
4. Erősítse meg a rendelést

### 3.4 Reklamációkezelés

#### Új Reklamáció/Ticket:
1. **CRM > Reklamációk > Új Ticket**
2. Töltse ki:
   - Tárgy
   - Leírás
   - Prioritás (alacsony/közepes/magas)
   - Típus (reklamáció/kérdés/hiba)
3. Rendelje hozzá felelőshöz
4. Mentse

#### Ticket Feldolgozása:
1. Nyissa meg a ticketet
2. Adjon hozzá megjegyzéseket
3. Változtassa az állapotot (nyitott/folyamatban/lezárt)
4. Eszkalálás szükség esetén

---

## 4. DMS Modul (Dokumentumkezelés)

### 4.1 Dokumentum Feltöltése

#### Új Dokumentum Iktatása:
1. **DMS > Dokumentumok > Új Dokumentum**
2. Adja meg:
   - Dokumentum neve
   - Típus (szerződés, számla, levelezés, stb.)
   - Felelős személy
3. Töltse fel a fájlt (PDF, DOCX, JPG, PNG)
4. A rendszer automatikusan generál iktatószámot (pl. IK-2025-000123)

#### Metaadatok Megadása:
- Érvényesség kezdete/vége
- Lejárat dátuma
- Kapcsolódó ügyfél
- Címkék (több címke is választható)

### 4.2 OCR Feldolgozás

Az OCR (Optical Character Recognition) automatikusan szöveggé alakítja a beolvasott dokumentumokat.

#### OCR Indítása:
1. Töltse fel a szkennelt dokumentumot
2. Kattintson **"OCR Feldolgozás"**
3. Válassza ki a nyelvet (magyar/angol)
4. A feldolgozás 1-5 percet vesz igénybe

#### OCR Eredmény Ellenőrzése:
1. **DMS > OCR Feladatok**
2. Nyissa meg a befejezett feladatot
3. Ellenőrizze és javítsa ki a felismert szöveget
4. Mentse a végleges változatot

### 4.3 Dokumentum Keresése

#### Egyszerű Keresés:
- Írja be a keresőmezőbe a kulcsszót
- A rendszer keres:
  - Dokumentum nevében
  - Iktatószámban
  - OCR szövegben
  - Metaadatokban

#### Részletes Keresés:
1. Kattintson **"Részletes Keresés"**
2. Állítson be szűrőket:
   - Dátum tartomány
   - Dokumentum típus
   - Felelős
   - Ügyfél
   - Címkék
3. Kattintson **"Keresés"**

### 4.4 Jogosultságkezelés

#### Hozzáférés Beállítása:
1. Nyissa meg a dokumentumot
2. **Műveletek > Jogosultságok**
3. Adjon hozzá felhasználókat vagy szerepköröket
4. Állítsa be a jogokat:
   - Olvasás
   - Szerkesztés
   - Törlés
5. Mentse

---

## 5. Logisztika Modul

### 5.1 Cikktörzs Kezelése

#### Új Cikk Felvétele:
1. **Logisztika > Cikkek > Új Cikk**
2. Kötelező mezők:
   - Cikk azonosító
   - Név
   - Egység (db, kg, m, stb.)
   - Beszerzési ár
   - Eladási ár
   - ÁFA kulcs
3. Opcionális:
   - Cikkcsoport
   - Leírás
   - Beszerzési adatok

#### Cikkcsoport Kezelése:
- Hozzon létre kategóriákat (pl. Irodaszerek, Alkatrészek)
- Rendelje hozzá a cikkeket csoportokhoz
- Könnyebb szűrés és riportok

### 5.2 Raktárkezelés

#### Új Raktár Létrehozása:
1. **Logisztika > Raktárak > Új Raktár**
2. Adja meg:
   - Raktár azonosító
   - Név
   - Cím
3. Aktiválja a raktárt

#### Készletszint Beállítása:
1. Válasszon ki egy cikket
2. Adja meg raktáranként:
   - Aktuális mennyiség
   - **Min. készlet** (riasztási szint)
   - **Max. készlet** (optimális felső határ)

⚠️ Ha a készlet a min. szint alá esik, automatikus figyelmeztetést kap!

### 5.3 Készletmozgások

#### Készlet Növelése (Beérkeztetés):
1. **Logisztika > Készlet > Mozgás**
2. Típus: **Beérkeztetés**
3. Válasszon cikket és raktárt
4. Adja meg a mennyiséget
5. Opcionális: sarzs/gyártási szám

#### Készlet Csökkentése (Kiadás):
1. Típus: **Kiadás**
2. Kapcsolja össze rendeléssel
3. Rendszer automatikusan csökkenti a készletet

### 5.4 Árlista Kezelés

#### Szállítói Árlista Feltöltése:
1. **Logisztika > Árlisták > Új Árlista**
2. Válasszon szállítót
3. Állítsa be érvényességi időszakot
4. Importáljon vagy vigyen fel árakat:
   - CSV/Excel import
   - Manuális felvitel

#### Több Szállító Árai:
- Ugyanahhoz a cikkhez több szállító is megadható
- Legkedvezőbb ár automatikusan kijelölhető
- Ár előzmények megtekinthetők

---

## 6. Riportok és Kimutatások

### 6.1 Előre Definiált Riportok

#### CRM Riportok:
- Ügyfél lista
- Kampány teljesítmény
- Értékesítési áttekintés
- Reklamáció statisztika

#### DMS Riportok:
- Iktatási jegyzék
- Lejáró dokumentumok
- OCR feldolgozás státusz

#### Logisztika Riportok:
- Készlet áttekintés
- Alacsony készletű cikkek
- Raktárkészlet érték
- Mozgási előzmények

### 6.2 Egyedi Riportok

1. **Riportok > Új Riport**
2. Válassza ki a forrást (CRM/DMS/Logisztika)
3. Állítsa be a szűrőket
4. Válassza ki a megjelenítendő mezőket
5. Exportálás: PDF, Excel, CSV

---

## 7. Beállítások és Személyre Szabás

### 7.1 Profil Beállítások

1. Kattintson nevére jobb felül
2. **"Profil Beállítások"**
3. Módosíthatja:
   - Név
   - Email
   - Jelszó
   - Időzóna
   - Nyelv

### 7.2 Értesítések

Beállíthatja, hogy milyen eseményekről kapjon értesítést:
- Email értesítések
- Rendszeren belüli üzenetek
- Készlet riasztások
- Lejáró dokumentumok

---

## 8. Mobilhasználat

Az alkalmazás teljesen reszponzív, mobilon is használható:
- **PWA mód:** Telepítse a telefonjára mint app
- **Offline mód:** Alapvető funkciók internetkapcsolat nélkül is
- **Tudásbázis:** Mobilról is elérhető a súgó

---

## 9. Gyakori Kérdések (GYIK)

**K: Hogyan változtatom meg a jelszavam?**
V: Profil > Biztonság > Jelszó módosítása

**K: Nem találom egy dokumentumot, mit tegyek?**
V: Használja a részletes keresést, vagy ellenőrizze a jogosultságait

**K: Hogyan állíthatok be készlet riasztást?**
V: Cikk szerkesztése > Min./Max. készlet megadása

**K: Elveszett egy dokumentum, van biztonsági mentés?**
V: Igen, napi automatikus mentések 90 napig megőrizve

**K: Több raktáram van, hogyan látom az összesített készletet?**
V: Logisztika > Készlet Áttekintés > "Összes raktár" nézet

---

## 10. Támogatás

Ha további segítségre van szüksége:

- **Email:** support@mbit.hu
- **Telefon:** +36 1 234 5678
- **Munkaidő:** Hétfő-Péntek, 9:00-17:00
- **Hibabejelentés:** Rendszeren belül a "Hiba Bejelentése" menüpont

**SLA:**
- Válaszidő: 4 óra
- Megoldási idő: Prioritástól függően 4-24 óra
- Elérhetőség: ≥96%

---

**Verzió:** 1.0  
**Utolsó frissítés:** 2025. november 6.  
**Készítette:** Mbit IT Csapat
