# Mbit ERP - Felhasználói Útmutató

## 📖 Tartalom

1. [Telepítés](#telepítés)
2. [Első indítás és bejelentkezés](#első-indítás-és-bejelentkezés)
3. [Főképernyő áttekintése](#főképernyő-áttekintése)
4. [Modulok és funkciók](#modulok-és-funkciók)
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
- **Jelszó:** `1234`

⚠️ **FONTOS:** Első bejelentkezés után azonnal változtassa meg a jelszót a biztonság érdekében!

**Bejelentkezés lépései:**

1. Írja be az email címet: `admin@mbit.hu`
2. Írja be a jelszót: `1234`
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
  - Rendelések - Rendelések kezelése
  - Számlák - Számlák létrehozása és kezelése
  - Chat - Ügyfél kommunikáció chat rendszerrel
- **Dokumentumok** - Dokumentumok feltöltése és kezelése (OCR támogatással)
- **Csapat kommunikáció** - Feladatkezelés és csapatmunka
- **Logisztika** ⏷
  - Raktárak - Raktárak kezelése
  - Termékek - Termékkatalógus kezelése
  - Visszárúk - Visszárúk kezelése
  - Szállítók - Beszállítók kezelése
  - Rendelések - Beszerzési rendelések kezelése
  - Leltárívek - Készletleltár kezelése
  - INTRASTAT - INTRASTAT adatszolgáltatás
  - Készletérték értékelés - FIFO/LIFO/AVG értékelési módszerek
  - Foglaltság és konszignáció - Készletfoglalás és konszignációs raktárak
- **HR** ⏷
  - Munkakörök - Munkakörök és munkaköri leírások kezelése
  - Dolgozók - Dolgozói adatok kezelése
  - Munkaszerződések - Szerződések és módosítások kezelése
  - Riportok - NAV és KSH riportok generálása
- **Kontrolling** ⏷
  - Adatbázis kapcsolatok - Külső adatbázisokhoz való kapcsolatok
  - KPI mutatószámok - Kulcs teljesítmény mutatók definiálása
  - Lekérdezések - Előre definiált és ad-hoc lekérdezések
- **Beállítások** - Rendszerbeállítások, felhasználók, hibabejelentés, kijelentkezés

### 🔔 Értesítési panel

A képernyő jobb alsó sarkában található egy harang ikon (🔔), amely az értesítési panelt nyitja meg. További információ: [Értesítési rendszer](#értesítési-rendszer)

---

## Modulok és funkciók

### 📞 CRM Modul (Ügyfélkezelés)

#### Partnerek kezelése

**Új partner hozzáadása:**

1. Kattintson az **"Ügyfélkezelés"** menüre
2. Válassza a **"Partnerek"** lehetőséget
3. Kattintson a **"+ Új partner"** gombra
4. Töltse ki a következő mezőket:
   - **Név** (kötelező) - Partner/ügyfél neve
   - **Azonosító** - Automatikusan generált egyedi azonosító
   - **Típus** - Ügyfél vagy Partner
   - **Iparág** - Pl. IT, Kereskedelem, Gyártás, stb.
   - **Régió** - Földrajzi régió
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

#### Kampánymenedzsment

**Kampányok szűrése és exportálása:**

1. Kattintson az **"Ügyfélkezelés"** → **"Partnerek"** menüre
2. A kampányok listájában használja a szűrőket:
   - **Név** - Keresés név alapján
   - **Típus** - Kampány típusa
   - **Állapot** - Kampány állapota
   - **Dátum tartomány** - Kezdő és befejező dátum
   - **Költségvetés** - Költségvetés tartomány
3. Kattintson az **"Export Excel"** gombra a szűrt kampányok exportálásához

#### Lehetőségek (üzleti esélyek)

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

#### Árajánlatok készítése

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

**Árajánlat jóváhagyása:**

1. Nyissa meg az árajánlatot
2. Kattintson a **"Jóváhagyás"** gombra (ha az érték meghaladja a küszöböt, jóváhagyás szükséges)

#### Rendelések kezelése

**Új rendelés létrehozása:**

1. Kattintson az **"Ügyfélkezelés"** → **"Rendelések"** menüre
2. Kattintson a **"+ Új rendelés"** gombra
3. Válassza ki a partnert és töltse ki a rendelés adatait
4. Adjon hozzá tételeket
5. Kattintson a **"Létrehozás"** gombra

**Rendelés státusz kezelése:**

- **Vázlat** - Még nem véglegesített rendelés
- **Megkötve** - Véglegesített rendelés
- **Folyamatban** - Szállítás alatt
- **Teljesítve** - Szállítás befejezve
- **Törölve** - Törölt rendelés

#### Számlák kezelése

**Új számla létrehozása:**

1. Kattintson az **"Ügyfélkezelés"** → **"Számlák"** menüre
2. Kattintson a **"+ Új számla"** gombra
3. Töltse ki az adatokat:
   - **Ügyfél** (kötelező) - Válassza ki az ügyfelet
   - **Rendelés** (opcionális) - Válassza ki a kapcsolódó rendelést
   - **Kiállítás dátuma** - Számla kiállítási dátuma
   - **Teljesítés dátuma** - Szolgáltatás/teljesítés dátuma
   - **Fizetési határidő** - Fizetési határidő
   - **Típus** - Normál, Előszámla, Szállítási számla, Stornó
4. Adjon hozzá számla tételeket:
   - Kattintson a **"+ Tétel hozzáadása"** gombra
   - Válassza ki a terméket vagy adja meg manuálisan
   - Adja meg a mennyiséget és árat
5. Az összegek automatikusan számolódnak (netto, ÁFA, brutto)
6. Kattintson a **"Létrehozás"** gombra

**Számla fizetés rögzítése:**

1. Nyissa meg a számlát
2. Kattintson a **"Fizetés rögzítése"** gombra
3. Adja meg:
   - **Fizetés dátuma**
   - **Összeg**
   - **Fizetési mód** (Készpénz, Banki átutalás, Kártya, stb.)
   - **Tranzakció szám** (opcionális)
4. Kattintson a **"Mentés"** gombra

**Számla státuszok:**

- **Vázlat** - Még nem kiállított számla
- **Kiállítva** - Kiállított számla
- **Küldve** - Ügyfélnek elküldve
- **Fizetve** - Teljesítve fizetve
- **Részben fizetve** - Részleges fizetés
- **Stornózva** - Törölt számla

#### Chat rendszer

**Új chat szoba létrehozása:**

1. Kattintson az **"Ügyfélkezelés"** → **"Chat"** menüre
2. Kattintson a **"+ Új chat szoba"** gombra
3. Válassza ki az ügyfelet
4. Adjon meg egy nevet a chat szobának (opcionális)
5. Válassza ki a résztvevőket (belső felhasználók vagy külső résztvevők)
6. Kattintson a **"Létrehozás"** gombra

**Üzenet küldése:**

1. Válassza ki a chat szobát a bal oldali listából
2. Írja be az üzenetet az alsó mezőbe
3. Kattintson az **"Küldés"** gombra vagy nyomja meg az Enter billentyűt

**Chat szoba lezárása:**

1. Nyissa meg a chat szobát
2. Kattintson a **"Lezárás"** gombra
3. A lezárt chat szobák továbbra is megtekinthetők, de nem küldhetők új üzenetek

### 📄 Dokumentumok modul

**Új dokumentum feltöltése:**

1. Kattintson a **"Dokumentumok"** menüre
2. Kattintson a **"+ Új dokumentum"** gombra
3. Töltse ki az adatokat:
   - **Név** (kötelező) - Dokumentum neve
   - **Típus** - Válasszon típust (Szerződés, Számla, Jelentés, Egyéb)
   - **Kategória** - Válasszon kategóriát vagy hozzon létre újat
   - **Ügyfél** (opcionális) - Kapcsolódó ügyfél
   - **Érvényesség kezdete** (opcionális) - Dokumentum érvényességének kezdete
   - **Érvényesség vége** (opcionális) - Dokumentum érvényességének vége
   - **Fájl feltöltése** (kötelező) - Kattintson a **"Fájl kiválasztása"** gombra
4. Kattintson a **"Feltöltés"** gombra

**Dokumentum mappa megnyitása:**

1. Keresse meg a dokumentumot a listában
2. Kattintson a **"Mappa megnyitása"** gombra (mappa ikon)
3. A Windows Explorer megnyílik a dokumentum tárolási helyével

**OCR (szövegfelismerés) használata:**

Az OCR funkció automatikusan aktív új telepítéseknél.

1. Nyissa meg a dokumentumot (kattintson a **"Szerkesztés"** gombra)
2. Kattintson az **"OCR Futtatása"** gombra
3. Várja meg a feldolgozást (5-15 másodperc)
4. Az felismert szöveg megjelenik az **"OCR Eredmény"** panelen
5. Letöltheti az OCR eredményt szöveges fájlként

**Dokumentum keresése:**

1. Használja a keresőmezőt a dokumentumok között
2. Szűrhet típus, kategória, állapot vagy ügyfél alapján
3. Az OCR-ral feldolgozott dokumentumokban a szöveges tartalom is kereshető

### 💼 Csapat kommunikáció

**Feladat létrehozása:**

1. Kattintson a **"Csapat kommunikáció"** menüre
2. Válassza ki vagy hozza létre a Board-ot (projekt táblát)
3. Kattintson a **"+ Új feladat"** gombra
4. Töltse ki az adatokat:
   - **Cím** (kötelező) - Feladat címe
   - **Leírás** - Részletes leírás
   - **Prioritás** - Alacsony, Közepes, Magas
   - **Határidő** - Feladat határideje
   - **Felelős** - Hozzárendelt felhasználó
   - **Státusz** - Teendő, Folyamatban, Áttekintés alatt, Kész, Blokkolva, Törölve
5. Kattintson a **"Létrehozás"** gombra

**Feladat szerkesztése:**

1. Kattintson a feladatra a board-on
2. Módosítsa a szükséges adatokat
3. Kattintson a **"Mentés"** gombra

**Komment hozzáadása:**

1. Nyissa meg a feladatot
2. Görgessen le a kommentek részhez
3. Írja be a kommentet
4. Kattintson a **"Hozzáadás"** gombra

**Board (projekt tábla) létrehozása:**

1. Kattintson a **"+ Új Board"** gombra
2. Adja meg a board nevét és leírását
3. Válasszon színt
4. Kattintson a **"Létrehozás"** gombra

### 🏭 Logisztika modul

#### Raktárak kezelése

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
   - **Konszignációs** - Jelölje be, ha konszignációs raktár
   - **Értékelési módszer** - FIFO, LIFO vagy AVG
4. Kattintson a **"Létrehozás"** gombra

**Raktár nevének szerkesztése:**

1. Keresse meg a raktárt a listában
2. Kattintson a **"Szerkesztés"** gombra (ceruza ikon)
3. Módosítsa a raktár nevét vagy egyéb adatait
4. Kattintson a **"Mentés"** gombra

**Raktár részletek megtekintése:**

1. Keresse meg a raktárt a listában
2. Kattintson a **"Részletek"** gombra
3. Itt láthatja:
   - A raktárban lévő termékeket
   - Készletszinteket
   - Készletmozgásokat
   - Leltáríveket

**Leltárív nyomtatása:**

1. Nyissa meg a raktár részleteit
2. Kattintson a **"Leltárív nyomtatása"** gombra
3. Válassza ki a formátumot (PDF vagy Excel)
4. A leltárív tartalmazza: terméknév, azonosító, készlet, hely és egyéb adatokat

#### Termékek kezelése

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

- **Szavatossági idő**: Ha megadja, a rendszer automatikusan figyelmeztetést küld, amikor a termék lejárati dátuma közeledik (30 napon belül)
- **Minimum készlet**: Ha a készlet ezen érték alá csökken, a rendszer automatikusan értesítést küld
- **Maximum készlet**: A rendszer figyelmeztetést küld, ha a készlet ezen érték fölé emelkedik

#### Visszárúk kezelése

**Új visszárú létrehozása:**

1. Kattintson a **"Logisztika"** → **"Visszárúk"** menüre
2. Kattintson a **"+ Új visszárú"** gombra
3. Válassza ki a típust (Beszerzési vagy Értékesítési visszárú)
4. Töltse ki az adatokat és tételeket
5. Kattintson a **"Létrehozás"** gombra

**Visszárú jóváhagyása:**

1. Nyissa meg a visszárút
2. Kattintson a **"Jóváhagyás"** gombra
3. A jóváhagyott visszárúk automatikusan módosítják a készletet

#### Szállítók kezelése

**Új szállító hozzáadása:**

1. Kattintson a **"Logisztika"** → **"Szállítók"** menüre
2. Kattintson a **"+ Új szállító"** gombra
3. Töltse ki a szállító adatait
4. Kattintson a **"Létrehozás"** gombra

**Termékek hozzárendelése szállítóhoz:**

1. Nyissa meg a szállító részleteit
2. Kattintson a **"Termékek"** fülre
3. Kattintson a **"Termék hozzárendelése"** gombra
4. Válassza ki a terméket és adja meg a szállítói árat
5. Kattintson a **"Mentés"** gombra

#### Beszerzési rendelések

**Új beszerzési rendelés létrehozása:**

1. Kattintson a **"Logisztika"** → **"Rendelések"** menüre
2. Kattintson a **"+ Új rendelés"** gombra
3. Válassza ki a szállítót
4. Adjon hozzá tételeket
5. Kattintson a **"Létrehozás"** gombra

#### Leltárívek kezelése

**Új leltárív létrehozása:**

1. Kattintson a **"Logisztika"** → **"Leltárívek"** menüre
2. Kattintson a **"+ Új leltárív"** gombra
3. Válassza ki a raktárt
4. A rendszer automatikusan generálja a leltárívet a könyv szerinti készlet alapján
5. Kattintson a **"Létrehozás"** gombra

**Tényleges készlet rögzítése:**

1. Nyissa meg a leltárívet
2. Minden tételnél adja meg a tényleges készletet
3. A rendszer automatikusan számolja a különbséget
4. Kattintson a **"Mentés"** gombra

**Leltárív jóváhagyása:**

1. Ellenőrizze a tényleges készletet
2. Kattintson a **"Jóváhagyás"** gombra
3. A jóváhagyott leltárív automatikusan módosítja a készletet

**Leltárív státuszok:**

- **Vázlat** - Létrehozva, de még nem kezdődött el a leltározás
- **Folyamatban** - Leltározás alatt
- **Jóváhagyva** - Jóváhagyva, készlet módosítva
- **Lezárva** - Lezárt leltárív

**Leltárív nyomtatása:**

1. Nyissa meg a leltárívet
2. Kattintson a **"Nyomtatás"** gombra
3. Válassza ki a formátumot (PDF vagy Excel)

#### INTRASTAT adatszolgáltatás

**Új INTRASTAT nyilatkozat létrehozása:**

1. Kattintson a **"Logisztika"** → **"INTRASTAT"** menüre
2. Kattintson a **"+ Új nyilatkozat"** gombra
3. Adja meg az év és hónapot
4. Kattintson a **"Létrehozás"** gombra

**INTRASTAT tétel hozzáadása:**

1. Nyissa meg a nyilatkozatot
2. Kattintson a **"+ Tétel hozzáadása"** gombra
3. Töltse ki az adatokat:
   - **Árucikk azonosító**
   - **Partner ország kódja**
   - **Árucikk jellemzői**
   - **Mennyiség**
   - **Nettó súly**
   - **Statisztikai érték**
   - **Kiegészítő egység** (pl. db, m2)
   - **Kiegészítő mennyiség**
4. Kattintson a **"Mentés"** gombra

**INTRASTAT exportálása:**

1. Nyissa meg a nyilatkozatot
2. Kattintson a **"NAV formátum export"** vagy **"XML export"** gombra
3. A fájl letöltődik

#### Készletérték értékelés

**Készletérték számítása:**

1. Kattintson a **"Logisztika"** → **"Készletérték értékelés"** menüre
2. Válassza ki a raktárt
3. A rendszer megjeleníti a készletértéket az aktuális értékelési módszer szerint

**Értékelési módszer beállítása:**

1. Válassza ki a raktárt
2. Válassza ki az értékelési módszert:
   - **FIFO** (First In First Out) - Első be, első ki
   - **LIFO** (Last In First Out) - Utolsó be, első ki
   - **AVG** (Átlag) - Átlagos beszerzési ár
3. Kattintson a **"Mentés"** gombra

**Készletérték jelentés:**

A jelentés tartalmazza:
- Terméknév és azonosító
- Raktár
- Készlet mennyiség
- Beszerzési ár
- Értékelési módszer
- Számított készletérték

#### Foglaltság és konszignáció

**Készletfoglalás létrehozása:**

1. Kattintson a **"Logisztika"** → **"Foglaltság és konszignáció"** menüre
2. Válassza a **"Foglaltságok"** fület
3. Kattintson a **"+ Új foglalás"** gombra
4. Töltse ki az adatokat:
   - **Termék** - Válassza ki a terméket
   - **Raktár** - Válassza ki a raktárt
   - **Mennyiség** - Foglalni kívánt mennyiség
   - **Ok** - Foglalás oka
   - **Várható felszabadítás dátuma** - Mikor várható a felszabadítás
5. Kattintson a **"Létrehozás"** gombra

**Várható beérkezés létrehozása:**

1. Válassza a **"Várható beérkezések"** fület
2. Kattintson a **"+ Új várható beérkezés"** gombra
3. Töltse ki az adatokat:
   - **Szállító**
   - **Várható beérkezés dátuma**
   - **Tételek** - Termékek és mennyiségek
4. Kattintson a **"Létrehozás"** gombra

**Beérkezés rögzítése:**

1. Nyissa meg a várható beérkezést
2. Kattintson a **"Beérkezés rögzítése"** gombra
3. A készlet automatikusan frissül

**Konszignációs raktárak:**

- Konszignációs raktárak esetén a készlet a szállító tulajdonában van
- A konszignációs készlet külön kezelve van
- A rendelés teljesítésekor történik az átvétel

### 👥 HR Modul

#### Munkakörök kezelése

**Új munkakör létrehozása:**

1. Kattintson a **"HR"** → **"Munkakörök"** menüre
2. Kattintson a **"+ Új munkakör"** gombra
3. Töltse ki az adatokat:
   - **Név** (kötelező) - Munkakör neve
   - **Osztály/Részleg** - Osztály vagy részleg
   - **Leírás** - Munkaköri leírás
   - **Feladatok és hatáskörök** - Részletes feladatlista
   - **Státusz** - Aktív vagy Inaktív
4. Kattintson a **"Létrehozás"** gombra

**Munkakör szerkesztése:**

1. Keresse meg a munkakört a listában
2. Kattintson a **"Szerkesztés"** gombra
3. Módosítsa a szükséges adatokat
4. Kattintson a **"Mentés"** gombra

#### Dolgozók kezelése

**Új dolgozó hozzáadása:**

1. Kattintson a **"HR"** → **"Dolgozók"** menüre
2. Kattintson a **"+ Új dolgozó"** gombra
3. Töltse ki az adatokat:

   **Személyes adatok:**
   - **Név** (kötelező)
   - **Születési dátum**
   - **Születési hely**
   - **TAJ szám**
   - **Adóazonosító**
   - **Lakcím**

   **Iskolai végzettség:**
   - **Iskola neve**
   - **Szak**
   - **Végzés éve**
   - **Végzettségi szint**

   **Nyelvtudás:**
   - **Nyelv**
   - **Szint** (Alap, Közép, Felsőfokú)

   **Munkaviszony adatok:**
   - **Munkakör** - Válassza ki a munkakört
   - **Belépés dátuma**
   - **Szervezeti besorolás**
   - **Munkaviszony típusa** (Határozott idejű, Határozatlan idejű, stb.)

4. Kattintson a **"Létrehozás"** gombra

**Dolgozó szerkesztése:**

1. Keresse meg a dolgozót a listában
2. Kattintson a **"Szerkesztés"** gombra
3. Módosítsa a szükséges adatokat
4. Kattintson a **"Mentés"** gombra

#### Munkaszerződések kezelése

**Új munkaszerződés létrehozása:**

1. Kattintson a **"HR"** → **"Munkaszerződések"** menüre
2. Kattintson a **"+ Új szerződés"** gombra
3. Töltse ki az adatokat:
   - **Dolgozó** (kötelező) - Válassza ki a dolgozót
   - **Szerződés szám** - Automatikusan generált vagy manuális
   - **Kezdő dátum** (kötelező)
   - **Vég dátum** - Határozott idejű szerződés esetén
   - **Munkakör** - Válassza ki a munkakört
   - **Bér** - Bruttó bér
   - **Munkaviszony típusa** - Határozott idejű, Határozatlan idejű, stb.
   - **Munkaviszony jellege** - Teljes munkaidő, Részmunkaidő, stb.
4. Kattintson a **"Létrehozás"** gombra

**Szerződés módosítás létrehozása:**

1. Nyissa meg a szerződést
2. Kattintson a **"Módosítás hozzáadása"** gombra
3. Töltse ki a módosítás adatait:
   - **Módosítás dátuma**
   - **Módosítás típusa** (Bérváltozás, Munkakör változás, stb.)
   - **Leírás** - Részletes leírás
4. Kattintson a **"Mentés"** gombra

**Lejáró szerződések:**

A rendszer automatikusan értesítést küld, ha egy szerződés lejárati dátuma közeledik (30 napon belül).

#### HR Riportok

**NAV bérjegyzékes riport:**

1. Kattintson a **"HR"** → **"Riportok"** menüre
2. Válassza a **"NAV Bérjegyzékes"** opciót
3. Adja meg az időszakot (hónap és év)
4. Kattintson a **"Generálás"** gombra
5. A riport letöltődik

**NAV Adóbevallási riport:**

1. Válassza a **"NAV Adóbevallás"** opciót
2. Adja meg az időszakot
3. Kattintson a **"Generálás"** gombra

**KSH riportok:**

- **Foglalkoztatási riport**
- **Bérriport**
- **Szerződés riport**

Minden KSH riport esetén:
1. Válassza ki a riport típusát
2. Adja meg az időszakot
3. Kattintson a **"Generálás"** gombra
4. A riport letöltődik

### 📊 Kontrolling modul

#### Adatbázis kapcsolatok

**Új adatbázis kapcsolat létrehozása:**

1. Kattintson a **"Kontrolling"** → **"Adatbázis kapcsolatok"** menüre
2. Kattintson a **"+ Új kapcsolat"** gombra
3. Töltse ki az adatokat:
   - **Név** (kötelező) - Kapcsolat neve
   - **Típus** - MySQL, PostgreSQL, SQL Server, Oracle, stb.
   - **Szerver** - Adatbázis szerver címe
   - **Port** - Port szám
   - **Adatbázis neve** - Adatbázis neve
   - **Felhasználónév** - Adatbázis felhasználó
   - **Jelszó** - Adatbázis jelszó
4. Kattintson a **"Kapcsolat tesztelése"** gombra
5. Ha sikeres, kattintson a **"Létrehozás"** gombra

**Kapcsolat tesztelése:**

1. Nyissa meg a kapcsolatot
2. Kattintson a **"Kapcsolat tesztelése"** gombra
3. A rendszer jelzi, hogy a kapcsolat működik-e

#### KPI mutatószámok

**Új KPI létrehozása:**

1. Kattintson a **"Kontrolling"** → **"KPI mutatószámok"** menüre
2. Kattintson a **"+ Új KPI"** gombra
3. Töltse ki az adatokat:
   - **Azonosító** (kötelező) - KPI azonosító
   - **Név** (kötelező) - KPI neve
   - **Típus** - Szám, Százalék, Pénznem, stb.
   - **Cél érték** - Cél érték
   - **Számítási képlet** - SQL lekérdezés vagy képlet
   - **Frissítési gyakoriság** - Napi, Heti, Havi
4. Kattintson a **"Létrehozás"** gombra

**KPI érték számítása:**

1. Nyissa meg a KPI-t
2. Kattintson a **"Számítás"** gombra
3. A rendszer kiszámolja és megjeleníti az aktuális értéket

**KPI jelentés:**

A jelentés tartalmazza:
- KPI azonosító és név
- Típus
- Cél érték
- Aktuális érték
- Teljesítmény (célhoz viszonyítva)

#### Lekérdezések

**Előre definiált lekérdezés sablon létrehozása:**

1. Kattintson a **"Kontrolling"** → **"Lekérdezések"** menüre
2. Válassza a **"Sablonok"** fület
3. Kattintson a **"+ Új sablon"** gombra
4. Töltse ki az adatokat:
   - **Név** (kötelező) - Sablon neve
   - **Lekérdezés** (kötelező) - SQL lekérdezés
   - **Paraméterek** - Paraméterek definiálása
   - **Leírás** - Sablon leírása
5. Kattintson a **"Létrehozás"** gombra

**Ad-hoc lekérdezés futtatása:**

1. Válassza a **"Ad-hoc lekérdezések"** fület
2. Kattintson a **"+ Új lekérdezés"** gombra
3. Írja be a SQL lekérdezést
4. Kattintson a **"Futtatás"** gombra
5. Az eredmények megjelennek táblázatban

**Lekérdezés exportálása:**

1. Futtassa a lekérdezést
2. Kattintson az **"Export"** gombra
3. Válassza ki a formátumot (Excel, CSV, TXT, XML)
4. A fájl letöltődik

### ⚙️ Beállítások

A Beállítások menüben 5 fő fül található:

#### Szervezet fül

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

#### Biztonsági mentések fül

**Azonnali mentés indítása:**

1. Kattintson a **"Beállítások"** menüre
2. Válassza a **"Biztonsági mentések"** fület
3. Kattintson a **"Azonnali mentés létrehozása"** gombra
4. Várja meg a mentés befejezését

**Ütemezett mentések beállítása:**

1. **Napi mentés engedélyezése**: Jelölje be a checkbox-ot
2. **Napi mentés időpontja**: Válassza ki az időpontot (pl. 02:00) - 24 órás formátumban
3. **Heti mentés engedélyezése**: Jelölje be a checkbox-ot
4. **Heti mentés időpontja**: Válassza ki az időpontot (pl. 03:00) - 24 órás formátumban

**Mentések helye:**

- **Windows:** `C:\Users\[FELHASZNÁLÓNÉV]\AppData\Roaming\@mbit-erp\desktop\data\backups`

#### Rendszer fül

**Rendszer állapot ellenőrzése:**

1. Kattintson a **"Beállítások"** menüre
2. Válassza a **"Rendszer"** fület
3. Itt láthatja:
   - **Verzió** - Alkalmazás verziószáma
   - **Állapot** - Rendszer állapota (Működik/Hiba)
   - **Adatbázis** - Adatbázis állapota és késleltetés
   - **Tárhely** - Fájltároló állapota és elérési út

**Frissítés:**

Kattintson a **"↻ Frissítés"** gombra az információk frissítéséhez.

#### Felhasználók fül

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
3. Kattintson a **"Admin Jelszó"** gombra
4. Írja be az új jelszót kétszer
5. Kattintson a **"Mentés"** gombra

⚠️ **Megjegyzés:** Csak adminisztrátorok módosíthatnak más felhasználók jelszavát. A felhasználók saját jelszavukat a profil beállításokban módosíthatják.

**Felhasználó szerkesztése:**

1. Keresse meg a felhasználót a listában
2. Kattintson a **"Szerkesztés"** gombra
3. Módosítsa a szükséges adatokat
4. Kattintson a **"Mentés"** gombra

#### Hibabejelentés fül

**Hibabejelentés küldése:**

1. Kattintson a **"Beállítások"** menüre
2. Válassza a **"Hibabejelentés"** fület
3. Kattintson a **"📧 Hibabejelentés küldése"** gombra
4. Az email kliens automatikusan megnyílik előre kitöltött adatokkal:
   - **Címzett:** contact@mbit.hu
   - **Tárgy:** Mbit ERP hibajelentés
   - **Törzs:** Sablon a hibaleírásához
5. Írja le részletesen a hibát az emailben
6. Küldje el az emailt

**Kijelentkezés:**

1. Kattintson a **"Beállítások"** menüre
2. Válassza a **"Hibabejelentés"** fület
3. Görgessen le a kijelentkezés részhez
4. Kattintson a **"Kijelentkezés"** gombra
5. Az alkalmazás visszairányít a bejelentkezési oldalra

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

A rendszer értesítést küld a Csapat kommunikáció modulból, ha egy feladat határideje közeledik (alapértelmezett: 7 napon belül).

- **Megjelenítés**: Feladat címe, határidő, felelős személy
- **Frissítés**: Automatikusan 5 percenként

**4. Lejáró munkaszerződések**

A rendszer értesítést küld, ha egy munkaszerződés lejárati dátuma közeledik (30 napon belül).

- **Megjelenítés**: Dolgozó neve, szerződés szám, lejárati dátum
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
3. Kattintson a **"Admin Jelszó"** gombra
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

1. **Beállítások** → **Biztonsági mentések** fül
2. Kattintson a **"Azonnali mentés létrehozása"** gombra
3. Várja meg a mentés befejezését

**Automatikus mentés beállítása:**

1. **Beállítások** → **Biztonsági mentések** fül
2. Jelölje be a **"Napi mentés engedélyezése"** checkbox-ot
3. Válassza ki a mentés időpontját (pl. 02:00) - 24 órás formátumban
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

### Hogyan hozhatok létre számlát egy rendelésből?

1. Kattintson az **"Ügyfélkezelés"** → **"Rendelések"** menüre
2. Nyissa meg a rendelést
3. Kattintson a **"Számla létrehozása"** gombra
4. A rendszer automatikusan kitölti a számla adatait a rendelés alapján
5. Ellenőrizze és módosítsa szükség esetén
6. Kattintson a **"Létrehozás"** gombra

### Hogyan működik a leltárív folyamat?

1. **Leltárív létrehozása**: A rendszer automatikusan generálja a könyv szerinti készlet alapján
2. **Tényleges készlet rögzítése**: Minden tételnél adja meg a tényleges készletet
3. **Különbség számítása**: A rendszer automatikusan számolja a különbséget
4. **Jóváhagyás**: A jóváhagyott leltárív automatikusan módosítja a készletet
5. **Lezárás**: A lezárt leltárív továbbra is megtekinthető, de nem módosítható

### Az adataim biztonságban vannak?

Igen! Az Mbit ERP **100% helyi alkalmazás** - minden adat a saját számítógépén tárolódik, nem kerül fel internetre vagy felhőbe.

### Működik internet nélkül?

Igen, az alkalmazás teljesen internet nélkül is használható. Az összes funkció elérhető offline módban.

### Hol találom a hibabejelentés funkciót?

A hibabejelentés a **Beállítások** menüben található, a **Hibabejelentés** fülön. A header menüből eltávolítottuk, hogy logikusabb helyen legyen.

### Hogyan jelentkezek ki?

A kijelentkezés gomb a **Beállítások** → **Hibabejelentés** fül alján található. Kattintson a **"Kijelentkezés"** gombra.

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

### Számla létrehozásakor nem jelennek meg a rendelések

**Megoldás:**
1. Először válassza ki az ügyfelet
2. Ezután a rendelések automatikusan betöltődnek
3. Válassza ki a kapcsolódó rendelést

### Név mezők nem kattinthatók (dokumentumok, feladatok)

Ez egy ismert probléma volt, amelyet javítottunk. Ha még mindig tapasztalja:

**Megoldás:**
1. Frissítse az oldalt (F5)
2. Ha továbbra sem működik, indítsa újra az alkalmazást

---

## 📞 Kapcsolat és támogatás

Ha további segítségre van szüksége vagy hibát talált:

- **Hibabejelentés**: Beállítások → Hibabejelentés fül → 📧 Hibabejelentés küldése gomb
- **Email:** contact@mbit.hu
- **Weboldal:** https://mb-it.hu

---

**Verzió:** 1.0.0  
**Utolsó frissítés:** 2025. november 23.  
**MB-IT Kft.** - Minden jog fenntartva
