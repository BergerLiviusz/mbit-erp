# Mbit ERP - Felhasználói Útmutató

## 📖 Tartalom

1. [Telepítés](#telepítés)
2. [Első indítás és bejelentkezés](#első-indítás-és-bejelentkezés)
3. [Főképernyő áttekintése](#főképernyő-áttekintése)
4. [Alapvető funkciók használata](#alapvető-funkciók-használata)
5. [Gyakori kérdések](#gyakori-kérdések)
6. [Hibaelhárítás](#hibaelhárítás)

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
- **Beállítások** - Rendszerbeállítások és szervezeti adatok

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

### 📦 Termékek kezelése

**Új termék hozzáadása:**

1. Kattintson a **"Logisztika"** → **"Termékek"** menüre
2. Kattintson a **"+ Új termék"** gombra
3. Töltse ki az adatokat:
   - **Név** (kötelező) - Termék neve
   - **Leírás** - Részletes termékleírás
   - **Egységár** (kötelező) - Ár (Ft)
   - **Egység** (kötelező) - Pl. db, kg, m, stb.
   - **Raktár** - Válassza ki a raktárt ahol a termék található
4. Kattintson a **"Létrehozás"** gombra

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

**Rendszer állapot ellenőrzése:**

1. Kattintson a **"Beállítások"** menüre
2. Válassza a **"Rendszer"** fület
3. Itt láthatja:
   - Adatbázis állapot
   - Fájltároló állapot
   - Rendszer verzió
   - Utolsó biztonsági mentés ideje

---

## Gyakori kérdések

### Hogyan változtatom meg a jelszavamat?

1. Kattintson a jobb felső sarokban a felhasználónevére
2. Válassza a **"Profil beállítások"** menüt
3. Írja be az új jelszót kétszer
4. Kattintson a **"Jelszó módosítása"** gombra

### Hol találom a feltöltött dokumentumokat?

Minden feltöltött dokumentum a számítógépén helyben tárolódik:

- **Windows:** `C:\Users\[FELHASZNÁLÓNÉV]\AppData\Roaming\mbit-erp\data\uploads`

### Lehet több felhasználót létrehozni?

Jelenleg a rendszer egyetlen adminisztrátori fiókkal működik. Több felhasználó kezelése egy későbbi verzióban lesz elérhető.

### Hogyan készíthetek biztonsági mentést?

A biztonsági mentések automatikusan készülnek minden éjjel 2 órakor. Kézi mentést is indíthat:

1. **Beállítások** → **Rendszer** fül
2. Kattintson a **"Biztonsági mentés most"** gombra
3. A mentés a `backups` mappába kerül

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
2. Törölje a `C:\Users\[FELHASZNÁLÓNÉV]\AppData\Roaming\mbit-erp` mappát
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

### Kijelentkeztem, de nem emlékszem a jelszóra

Jelenleg nincs "Elfelejtett jelszó" funkció. Ha elfelejtette a jelszót:

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
**Utolsó frissítés:** 2025. november 7.  
**MB-IT Kft.** - Minden jog fenntartva
