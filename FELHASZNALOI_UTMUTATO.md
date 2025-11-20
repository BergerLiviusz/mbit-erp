# Mbit ERP - Felhasználói Útmutató

## 📖 Tartalom

1. [Telepítés](#telepítés)
2. [Első indítás és bejelentkezés](#első-indítás-és-bejelentkezés)
3. [Főképernyő áttekintése](#főképernyő-áttekintése)
4. [Alapvető funkciók használata](#alapvető-funkciók-használata)
5. [Értesítési rendszer](#értesítési-rendszer)
6. [Gyakori kérdések](#gyakori-kérdések)
7. [Hibaelhárítás](#hibaelhárítás)

---

## Telepítés

### 1. lépés: Installer letöltése

Az Mbit ERP telepítőfájlját a GitHub oldalról töltheti le:

1. Látogasson el a következő címre: [github.com/BergerLiviusz/mbit-erp/releases](https://github.com/BergerLiviusz/mbit-erp/releases)
2. Kattintson a legfrissebb verzióra (pl. **v1.0.0**)
3. Töltse le a **Mbit ERP-Setup-1.0.0.exe** fájlt

### 2. lépés: Telepítés indítása

1. **Nyissa meg** a letöltött `Mbit ERP-Setup-1.0.0.exe` fájlt
2. **Windows SmartScreen figyelmeztetés** fog megjelenni:
   
   ```
   Windows protected your PC
   Microsoft Defender SmartScreen prevented an unrecognized app from starting.
   ```
   
   **Ez normális!** Az alkalmazás nincs aláírva, de teljesen biztonságos.
   
3. Kattintson a **"More info"** linkre
4. Kattintson a **"Run anyway"** gombra

### 3. lépés: Telepítés folyamata

1. A telepítő elindítása után válassza ki a telepítés helyét (alapértelmezett: `C:\Program Files\Mbit ERP`)
2. Hagyja bejelölve a **"Create a desktop shortcut"** opciót
3. Kattintson a **"Next"** gombra
4. Kattintson az **"Install"** gombra
5. Várja meg amíg a telepítés befejeződik (kb. 30-60 másodperc)
6. Kattintson a **"Finish"** gombra

✅ **Készen van!** Az Mbit ERP telepítve van a számítógépére.

---

## Első indítás és bejelentkezés

### Alkalmazás indítása

1. **Asztali ikonra kattintás**: Dupla kattintás az "Mbit ERP" ikonra az asztalon
   
   **VAGY**
   
2. **Start menüből**: Start menü → Mbit ERP

### Első bejelentkezés

Az alkalmazás elindítása után a bejelentkezési képernyő jelenik meg.

**Alapértelmezett adminisztrátori fiók:**

- **Email:** `admin@mbit.hu`
- **Jelszó:** `admin123`

⚠️ **FONTOS:** Első bejelentkezés után azonnal változtassa meg a jelszót a biztonság érdekében!

**Bejelentkezés lépései:**

1. Írja be az email címet: `admin@mbit.hu`
2. Írja be a jelszót: `admin123`
3. Kattintson a **"Bejelentkezés"** gombra

---

## Főképernyő áttekintése

Bejelentkezés után a **főoldal** jelenik meg, amely négy fő területből áll:

### 📊 Összefoglaló kártyák

A képernyő tetején 4 információs kártya található:

- **Partnerek száma** - Összes ügyfél/partner a rendszerben
- **Nyitott lehetőségek** - Folyamatban lévő üzleti lehetőségek
- **Aktív raktárak** - Működő raktárak száma
- **Dokumentumok száma** - Feltöltött dokumentumok mennyisége

### 🧭 Navigációs menü

A képernyő tetején található menüsorban érheti el a fő funkciókat:

- **Főoldal** - Áttekintő képernyő (összesítések)
- **Ügyfélkezelés** ⏷
  - Partnerek - Ügyfelek/partnerek kezelése
  - Lehetőségek - Üzleti lehetőségek nyomon követése
  - Árajánlatok - Árajánlatok készítése és kezelése
- **Dokumentumok** - Dokumentumok feltöltése és kezelése (OCR támogatással)
- **Logisztika** ⏷
  - Raktárak - Raktárak kezelése
  - Termékek - Termékkatalógus kezelése
- **Csoportmunka** ⏷
  - Feladatok - Task kezelés és követés
  - Boardok - Kanban táblák projektmenedzsmenthez
- **Beállítások** - Rendszerbeállítások és szervezeti adatok

### 🔔 Értesítési panel

A képernyő jobb alsó sarkában található egy harang ikon (🔔), amely az értesítési panelt nyitja meg. További információ: [Értesítési rendszer](#értesítési-rendszer)

---

## Alapvető funkciók használata

### 👥 Partnerek kezelése

**Új partner hozzáadása:**

1. Kattintson az **"Ügyfélkezelés"** menüre
2. Válassza a **"Partnerek"** lehetőséget
3. Kattintson a **"+ Új partner"** gombra
4. Töltse ki a következő mezőket:
   - **Név** (kötelező) - Partner/ügyfél neve
   - **Azonosító** - Automatikusan generált egyedi azonosító
   - **Típus** - Ügyfél vagy Partner
   - **Iparág** - Pl. IT, Kereskedelem, Gyártás, stb.
   - **Email** - Kapcsolattartó email cím
   - **Telefon** - Telefonszám
5. Kattintson a **"Létrehozás"** gombra

**Partner szerkesztése:**

1. Keresse meg a partnert a listában
2. Kattintson a **"Szerkesztés"** gombra (ceruza ikon)
3. Módosítsa a szükséges adatokat
4. Kattintson a **"Mentés"** gombra

**Partner törlése:**

1. Keresse meg a partnert a listában
2. Kattintson a **"Törlés"** gombra (kuka ikon)
3. Erősítse meg a törlést

### 📄 Dokumentumok kezelése

**Új dokumentum feltöltése:**

1. Kattintson a **"Dokumentumok"** menüre
2. Kattintson a **"+ Új dokumentum"** gombra
3. Töltse ki az adatokat:
   - **Cím** (kötelező) - Dokumentum neve
   - **Kategória** - Válasszon kategóriát (Számla, Szerződés, Egyéb)
     - Ha nincs megfelelő kategória, kattintson a **"+ Új kategória"** gombra
   - **Fájl feltöltése** (kötelező) - Kattintson a **"Fájl kiválasztása"** gombra
4. Kattintson a **"Feltöltés"** gombra

**Dokumentum mappa megnyitása:**

1. Keresse meg a dokumentumot a listában
2. Kattintson a **"Mappa megnyitása"** gombra (mappa ikon)
3. A Windows Explorer megnyílik a dokumentum tárolási helyével

**OCR (szövegfelismerés) használata:**

Az OCR funkció automatikusan felismeri a feltöltött dokumentumok szövegét.

1. Nyissa meg a dokumentumot (kattintson a **"Szerkesztés"** gombra)
2. Kattintson az **"OCR Futtatása"** gombra
3. Várja meg a feldolgozást (5-15 másodperc)
4. Az felismert szöveg megjelenik az **"OCR Eredmény"** panelen

### 🏭 Raktárak kezelése

**Új raktár létrehozása:**

1. Kattintson a **"Logisztika"** → **"Raktárak"** menüre
2. Kattintson a **"+ Új raktár"** gombra
3. Töltse ki az adatokat:
   - **Azonosító** (kötelező) - Pl. RAK001
   - **Név** (kötelező) - Raktár neve
   - **Irányítószám** - Pl. 1117
   - **Település** - Pl. Budapest
   - **Utca, házszám** - Teljes cím
   - **Aktív** - Jelölje be, ha a raktár használatban van
4. Kattintson a **"Létrehozás"** gombra

**Raktár nevének szerkesztése:**

1. Keresse meg a raktárt a listában
2. Kattintson az **"Edit"** gombra (ceruza ikon)
3. Módosítsa a raktár nevét
4. Kattintson a **"Mentés"** gombra

### 📦 Termékek kezelése

**Új termék hozzáadása:**

1. Kattintson a **"Logisztika"** → **"Termékek"** menüre
2. Kattintson a **"+ Új termék"** gombra
3. Töltse ki az adatokat:
   - **Név** (kötelező) - Termék neve
   - **Azonosító** - Egyedi termékazonosító
   - **Leírás** - Részletes termékleírás
   - **Egység** (kötelező) - Pl. db, kg, m, stb.
   - **Beszerzési ár (Ft)** (kötelező) - Vételár
   - **Eladási ár (Ft)** (kötelező) - Eladási ár
   - **ÁFA kulcs (%)** (kötelező) - ÁFA százalék (pl. 27)
   - **Szavatossági idő (nap)** - A termék szavatossági ideje napokban
   - **Raktárak és készlet** - Adja meg a raktárakat és készletadatokat:
     - Válassza ki a raktárt
     - **Mennyiség** - Jelenlegi készlet
     - **Minimum készlet** - Minimum készletszint (riasztás küszöb)
     - **Maximum készlet** - Maximum készletszint
4. Kattintson a **"Létrehozás"** gombra

**Termék szerkesztése:**

1. Keresse meg a terméket a listában
2. Kattintson a **"Szerkesztés"** gombra
3. Módosítsa a szükséges adatokat (név, ár, szavatossági idő, készlet szintek)
4. Kattintson a **"Mentés"** gombra

**Szavatossági idő és készlet szintek:**

- **Szavatossági idő**: Ha megadja, a rendszer automatikusan figyelmeztetést küld, amikor a termék lejárási dátuma közeledik
- **Minimum készlet**: Ha a készlet ezen érték alá csökken, a rendszer automatikusan értesítést küld
- **Maximum készlet**: A rendszer figyelmeztetést küld, ha a készlet ezen érték fölé emelkedik

### 💼 Lehetőségek (üzleti esélyek)

**Új lehetőség létrehozása:**

1. Kattintson az **"Ügyfélkezelés"** → **"Lehetőségek"** menüre
2. Kattintson a **"+ Új lehetőség"** gombra
3. Töltse ki az adatokat:
   - **Név** (kötelező) - Lehetőség neve
   - **Partner** - Válassza ki a partnereket
   - **Szakasz** - Kapcsolatfelvétel, Tárgyalás, Ajánlat, Megkötve, Elveszett
   - **Érték (Ft)** - Várható üzlet értéke
   - **Valószínűség (%)** - Megkötés valószínűsége (0-100%)
   - **Várható zárás dátuma** - Mikor zárulhat le az üzlet
4. Kattintson a **"Létrehozás"** gombra

### 📋 Árajánlatok készítése

**Új árajánlat létrehozása:**

1. Kattintson az **"Ügyfélkezelés"** → **"Árajánlatok"** menüre
2. Kattintson a **"+ Új árajánlat"** gombra
3. Töltse ki az alapadatokat:
   - **Partner** - Válassza ki a partnert
   - **Lehetőség** (opcionális) - Kapcsolódó üzleti lehetőség
   - **Érvényesség** - Ajánlat lejárati dátuma
4. Adjon hozzá tételeket:
   - Kattintson a **"+ Új tétel"** gombra
   - Válassza ki a **Terméket**
   - Adja meg a **Mennyiséget**
   - Az egységár automatikusan kitöltődik
   - Adhat **Kedvezményt** (%)
5. Az összegek automatikusan számolódnak
6. Kattintson a **"Létrehozás"** gombra

### 👤 Felhasználók kezelése (Admin)

**Új felhasználó létrehozása:**

1. Kattintson a **"Beállítások"** menüre
2. Válassza a **"Felhasználók"** fület
3. Kattintson a **"+ Új felhasználó"** gombra
4. Töltse ki az adatokat:
   - **Név** (kötelező) - Felhasználó teljes neve
   - **Email** (kötelező) - Bejelentkezési email cím
   - **Jelszó** (kötelező) - Kezdeti jelszó
   - **Aktív** - Jelölje be, ha a felhasználó aktív
5. Kattintson a **"Létrehozás"** gombra

**Felhasználó jelszavának módosítása (Admin):**

1. Kattintson a **"Beállítások"** → **"Felhasználók"** menüre
2. Keresse meg a felhasználót a listában
3. Kattintson a **"Jelszó módosítása (Admin)"** gombra
4. Írja be az új jelszót kétszer
5. Kattintson a **"Mentés"** gombra

⚠️ **Megjegyzés:** Csak adminisztrátorok módosíthatnak más felhasználók jelszavát. A felhasználók saját jelszavukat a profil beállításokban módosíthatják.

### ⚙️ Rendszerbeállítások

**Szervezeti adatok módosítása:**

1. Kattintson a **"Beállítások"** menüre
2. Válassza a **"Szervezet"** fület
3. Módosítsa a szükséges adatokat:
   - Cégnév
   - Cím
   - Adószám
   - Cégjegyzékszám
   - Email
   - Telefon
   - Weboldal
4. Kattintson a **"Mentés"** gombra

**Biztonsági mentések beállítása:**

1. Kattintson a **"Beállítások"** menüre
2. Válassza a **"Biztonsági mentés"** fület
3. **Azonnali mentés indítása:**
   - Kattintson a **"Azonnali mentés létrehozása"** gombra
   - Várja meg a mentés befejezését
4. **Ütemezett mentések beállítása:**
   - **Napi mentés engedélyezése**: Jelölje be a checkbox-ot
   - **Napi mentés időpontja**: Válassza ki az időpontot (pl. 02:00)
   - **Heti mentés engedélyezése**: Jelölje be a checkbox-ot
   - **Heti mentés időpontja**: Válassza ki az időpontot (pl. 03:00)

**Rendszer állapot ellenőrzése:**

1. Kattintson a **"Beállítások"** menüre
2. Válassza a **"Rendszer"** fület
3. Itt láthatja:
   - Adatbázis állapot
   - Fájltároló állapot
   - Rendszer verzió
   - Utolsó biztonsági mentés ideje

---

## Értesítési rendszer

Az Mbit ERP automatikus értesítési rendszert tartalmaz, amely figyelmezteti Önt fontos eseményekre.

### Értesítési panel megnyitása

A képernyő jobb alsó sarkában található egy harang ikon (🔔). Kattintson rá az értesítések megtekintéséhez.

### Értesítés típusok

**1. Lejáró termékek**

A rendszer automatikusan értesítést küld, ha egy termék szavatossági ideje lejáróban van (alapértelmezett: 30 napon belül).

- **Megjelenítés**: Termék neve, raktár, lejárati dátum, hátralévő napok száma
- **Frissítés**: Automatikusan 5 percenként

**2. Alacsony készlet**

A rendszer értesítést küld, ha egy termék készlete a minimum szint alá csökken.

- **Megjelenítés**: Termék neve, raktár, jelenlegi készlet, minimum készlet
- **Frissítés**: Automatikusan 5 percenként

**3. Közelgő feladat határidők**

A rendszer értesítést küld a Csoportmunka modulból, ha egy feladat határideje közeledik (alapértelmezett: 7 napon belül).

- **Megjelenítés**: Feladat címe, határidő, felelős személy
- **Frissítés**: Automatikusan 5 percenként

### Értesítések kezelése

- **Összes értesítés száma**: A harang ikon mellett látható egy szám, amely az aktív értesítések számát mutatja
- **Részletek megtekintése**: Kattintson az értesítési panelre a részletes információk megtekintéséhez
- **Panel bezárása**: Kattintson újra a harang ikonra vagy a panelen kívülre a bezáráshoz

---

## Gyakori kérdések

### Hogyan változtatom meg a jelszavamat?

**Saját jelszó módosítása:**

1. Kattintson a jobb felső sarokban a felhasználónevére
2. Válassza a **"Profil beállítások"** menüt
3. Írja be a jelenlegi jelszót
4. Írja be az új jelszót kétszer
5. Kattintson a **"Jelszó módosítása"** gombra

**Más felhasználó jelszavának módosítása (Admin):**

1. Kattintson a **"Beállítások"** → **"Felhasználók"** menüre
2. Keresse meg a felhasználót
3. Kattintson a **"Jelszó módosítása (Admin)"** gombra
4. Írja be az új jelszót kétszer
5. Kattintson a **"Mentés"** gombra

### Hol találom a feltöltött dokumentumokat?

Minden feltöltött dokumentum a számítógépén helyben tárolódik:

- **Windows:** `C:\Users\[FELHASZNÁLÓNÉV]\AppData\Roaming\@mbit-erp\desktop\data\uploads`

**Gyors hozzáférés:**

1. Nyissa meg a dokumentumot a **"Dokumentumok"** menüben
2. Kattintson a **"Mappa megnyitása"** gombra
3. A Windows Explorer automatikusan megnyílik a dokumentum mappájával

### Lehet több felhasználót létrehozni?

Igen! Az adminisztrátorok létrehozhatnak új felhasználókat és kezelhetik a meglévőket.

**Új felhasználó létrehozása:**

1. **Beállítások** → **Felhasználók** fül
2. Kattintson a **"+ Új felhasználó"** gombra
3. Töltse ki az adatokat és kattintson a **"Létrehozás"** gombra

### Hogyan készíthetek biztonsági mentést?

**Azonnali mentés:**

1. **Beállítások** → **Biztonsági mentés** fül
2. Kattintson a **"Azonnali mentés létrehozása"** gombra
3. Várja meg a mentés befejezését

**Automatikus mentés beállítása:**

1. **Beállítások** → **Biztonsági mentés** fül
2. Jelölje be a **"Napi mentés engedélyezése"** checkbox-ot
3. Válassza ki a mentés időpontját (pl. 02:00)
4. A mentések automatikusan készülnek a megadott időpontban

**Mentések helye:**

- **Windows:** `C:\Users\[FELHASZNÁLÓNÉV]\AppData\Roaming\@mbit-erp\desktop\data\backups`

### Mi a szavatossági idő mező a termékeknél?

A szavatossági idő mező lehetővé teszi, hogy megadja egy termék szavatossági idejét napokban. A rendszer automatikusan értesítést küld, amikor a termék lejárati dátuma közeledik (30 napon belül).

**Használat:**

1. Termék létrehozásakor vagy szerkesztésekor adja meg a **"Szavatossági idő (nap)"** mezőt
2. A rendszer kiszámolja a lejárati dátumot a készlet létrehozásának dátumából
3. Az értesítési panelben láthatja a lejáró termékeket

### Mi a minimum és maximum készlet?

A minimum és maximum készlet értékek lehetővé teszik a készlet szintjének automatikus figyelését.

- **Minimum készlet**: Ha a készlet ezen érték alá csökken, a rendszer automatikusan értesítést küld
- **Maximum készlet**: Ha a készlet ezen érték fölé emelkedik, a rendszer értesítést küld

**Beállítás:**

1. Termék létrehozásakor vagy szerkesztésekor válassza ki a raktárt
2. Adja meg a **"Minimum készlet"** értéket
3. Adja meg a **"Maximum készlet"** értéket (opcionális)
4. Az értesítési panelben láthatja az alacsony készletű termékeket

### Az adataim biztonságban vannak?

Igen! Az Mbit ERP **100% helyi alkalmazás** - minden adat a saját számítógépén tárolódik, nem kerül fel internetre vagy felhőbe.

### Működik internet nélkül?

Igen, az alkalmazás teljesen internet nélkül is használható. Az összes funkció elérhető offline módban.

---

## Hibaelhárítás

### Az alkalmazás nem indul el

**Megoldás 1:** Indítsa újra a számítógépet

**Megoldás 2:** 
1. Távolítsa el az alkalmazást (Vezérlőpult → Programok eltávolítása)
2. Törölje a `C:\Users\[FELHASZNÁLÓNÉV]\AppData\Roaming\@mbit-erp` mappát
3. Telepítse újra az alkalmazást

### "Nem lehet kapcsolódni az adatbázishoz" hibaüzenet

Ez általában azt jelenti, hogy az alkalmazás háttérszolgáltatása nem indult el rendesen.

**Megoldás:**
1. Zárja be az alkalmazást teljesen
2. Várjon 10 másodpercet
3. Indítsa újra az alkalmazást

### A feltöltött dokumentum nem jelenik meg

**Ellenőrizze:**
1. A fájlméret nem haladja-e meg az 50 MB-ot
2. A fájltípus támogatott-e (PDF, JPG, PNG, DOCX, XLSX)

**Megoldás:**
1. Próbálja újra feltölteni a dokumentumot
2. Ha továbbra sem működik, indítsa újra az alkalmazást

### Az OCR nem dolgozza fel a dokumentumot

**Ellenőrizze:**
1. A dokumentum jó minőségű-e (ne legyen homályos)
2. A szöveg olvasható-e (ne legyen kézzel írva)
3. A dokumentum magyar vagy angol nyelvű-e

**Tipp:** A legjobb eredmény érdekében használjon szkennelt vagy elektronikus dokumentumokat.

### Új termék létrehozásakor szerver hiba

**Lehetséges okok:**
1. A szavatossági idő mező formátuma hibás (csak szám lehet)
2. A készlet értékek formátuma hibás (csak szám lehet)
3. Az adatbázis migráció még nem futott le

**Megoldás:**
1. Ellenőrizze, hogy minden szám mező helyesen van kitöltve
2. Indítsa újra az alkalmazást (ez automatikusan futtatja a migrációkat)
3. Ha a probléma továbbra is fennáll, lépjen kapcsolatba a támogatással

### Biztonsági mentés során hibaüzenet

**Megoldás:**
1. Ellenőrizze, hogy van-e elegendő hely a lemezen
2. Indítsa újra az alkalmazást
3. Próbálja újra a mentést

### Kijelentkeztem, de nem emlékszem a jelszóra

Ha adminisztrátor vagy, más adminisztrátor segítségével módosíthatja a jelszót:

1. Kérje meg egy másik adminisztrátort, hogy jelentkezzen be
2. Az adminisztrátor módosíthatja a jelszót a **"Beállítások"** → **"Felhasználók"** menüben

Ha nincs más adminisztrátor:
1. Lépjen kapcsolatba a rendszer adminisztrátorával (MB-IT Kft.)
2. Vagy távolítsa el és telepítse újra az alkalmazást (ez törli az összes adatot!)

---

## 📞 Kapcsolat és támogatás

Ha további segítségre van szüksége:

- **Email:** info@mb-it.hu
- **Telefon:** +36 XX XXX XXXX
- **Weboldal:** https://mb-it.hu

---

**Verzió:** 1.0.0  
**Utolsó frissítés:** 2025. november 20.  
**MB-IT Kft.** - Minden jog fenntartva
