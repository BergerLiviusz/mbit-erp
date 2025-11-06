# Adatkezelési Tájékoztató (GDPR)
## Mbit ERP Rendszer

**Hatálybalépés:** 2025. november 6.  
**Utolsó frissítés:** 2025. november 6.

---

## 1. Bevezetés

Jelen Adatkezelési Tájékoztató az Európai Unió 2016/679 számú általános adatvédelmi rendelete (GDPR) alapján készült, és részletezi, hogyan kezeljük a személyes adatokat az Mbit ERP rendszerben.

---

## 2. Adatkezelő Azonosítása

**Adatkezelő:**
- Név: Mbit Kft.
- Székhely: 1055 Budapest, Példa utca 1.
- Adószám: 12345678-2-41
- Email: adatvedelem@mbit.hu
- Telefon: +36 1 234 5678

**Adatvédelmi tisztviselő:**
- Név: [DPO Neve]
- Email: dpo@mbit.hu

---

## 3. Kezelt Személyes Adatok

### 3.1 Felhasználói Adatok

| Adatkategória | Kezelt adatok | Cél | Jogalap |
|---------------|---------------|-----|---------|
| **Azonosító adatok** | Név, email cím | Felhasználói fiók kezelés | Szerződés teljesítése |
| **Bejelentkezési adatok** | Felhasználónév, hash-elt jelszó | Hitelesítés, biztonság | Szerződés teljesítése |
| **Használati adatok** | Bejelentkezési idők, IP címek | Biztonsági napló, audit | Jogos érdek |
| **Szerepkör adatok** | Jogosultsági szintek | Hozzáférés-kezelés | Szerződés teljesítése |

### 3.2 Ügyfél (CRM) Adatok

| Adatkategória | Kezelt adatok | Cél | Jogalap |
|---------------|---------------|-----|---------|
| **Cégadatok** | Cégnév, adószám, cím | Üzleti kapcsolattartás | Szerződés teljesítése |
| **Kapcsolattartó adatok** | Név, email, telefon, beosztás | Kommunikáció | Szerződés teljesítése |
| **Értékesítési adatok** | Ajánlatok, rendelések, számlák | Üzleti folyamatok | Szerződés teljesítése |
| **Kommunikációs előzmények** | Email-ek, jegyz etek, ticketek | Ügyfélkapcsolat kezelés | Jogos érdek |

### 3.3 Dokumentumokban Tárolt Adatok

- Szerződésekben szereplő személyek adatai
- Iktatott iratok személyes adatai
- Szkennelt dokumentumok OCR-rel kiolvasott adatai

**Jogalap:** Szerződés teljesítése, jogi kötelezettség

---

## 4. Adatkezelés Céljai és Jogalapjai

### 4.1 Szerződés Teljesítése
- Felhasználói fiókok kezelése
- Rendszer működtetése
- Ügyfélkapcsolatok kezelése
- Logisztikai folyamatok támogatása

### 4.2 Jogi Kötelezettség
- Számviteli nyilvántartás (8 év)
- Adózási kötelezettség (8 év)
- Audit követelmények

### 4.3 Jogos Érdek
- Rendszer biztonság monitorozása
- Hibaelhárítás és támogatás
- Statisztikai elemzések (anonimizálva)

### 4.4 Hozzájárulás
- Marketing kommunikáció (opcionális)
- Newsletter küldése (külön hozzájárulással)

---

## 5. Adattárolás és Megőrzés

### 5.1 Tárolási Helyek

**Elsődleges adattároló:**
- Hely: Ügyfél saját infrastruktúrája (on-premise)
- Adatbázis: SQLite vagy PostgreSQL
- Titkosítás: AES-256 bit

**Biztonsági mentések:**
- Helyi szervereken, titkosítva
- Megőrzési idő: 90 nap
- Automatikus törlés lejárat után

### 5.2 Megőrzési Idők

| Adatkategória | Megőrzési idő | Jogalap |
|---------------|---------------|---------|
| **Felhasználói fiókok** | Törlési kérelemig vagy inaktivitástól 3 év | Szerződés |
| **Üzleti dokumentumok** | 8 év | Számviteli törvény |
| **Audit naplók** | 7 év | Compliance |
| **Biztonsági naplók** | 1 év | Biztonság |
| **Törölt adatok** | 30 nap (backup) | Technikai szükség |

---

## 6. Adatbiztonság

### 6.1 Technikai Intézkedések

**Titkosítás:**
- Adatbázis: AES-256 titkosítás
- Kommunikáció: TLS 1.3 (HTTPS)
- Jelszavak: bcrypt hash (10+ rounds)

**Hozzáférés-védelem:**
- Többfaktoros hitelesítés (2FA) elérhető
- Szerepkör-alapú hozzáférés (RBAC)
- IP whitelist lehetőség
- Session timeout: 24 óra

**Rendszer biztonság:**
- Rendszeres biztonsági frissítések
- Penetrációs tesztek évente
- Naplózás minden hozzáférésről

### 6.2 Szervezeti Intézkedések

- Munkatársak titoktartási nyilatkozata
- Rendszeres adatvédelmi képzések
- Incident response plan
- Adatvédelmi hatásvizsgálat

---

## 7. Adatfeldolgozók

### 7.1 Általános Elvek

- Adatfeldolgozókkal írásbeli szerződés
- GDPR megfelelőség ellenőrzése
- Adatfeldolgozás only a szerződés szerint

### 7.2 Felhasznált Szolgáltatók

| Szolgáltató | Tevékenység | Adattovábbítás helye |
|-------------|-------------|----------------------|
| Mbit IT | Rendszerfejlesztés, support | Magyarország |
| Hosting Partner* | Szerver tárhelyszolgáltatás | EU (opcionális) |

_* Csak ha ügyfél nem on-premise használja_

---

## 8. Adattovábbítás

### 8.1 Adattovábbítás EU-n Belül

Az adatok alapértelmezetten a felhasználó saját infrastruktúráján maradnak (on-premise). 

Támogatás céljából hozzáférés biztosítható a Szolgáltató részére:
- Szigorúan szükséges mértékben
- Titkosított csatornán
- Naplózva

### 8.2 Adattovábbítás EU-n Kívülre

**Alapértelmezett:** Nincs adattovábbítás EU-n kívülre.

Amennyiben harmadik országba továbbítás szükséges (pl. cloud szolgáltató):
- Megfelelőségi határozat alapján, vagy
- Standard szerződéses záradékok, vagy
- Egyéb megfelelő garanciák

---

## 9. Érintetti Jogok

### 9.1 Hozzáférési Jog

Ön jogosult tájékoztatást kérni az általunk kezelt személyes adatairól.

**Kérvényezés:** adatvedelem@mbit.hu  
**Válaszidő:** 30 nap

### 9.2 Helyesbítési Jog

Ön kérheti pontatlan vagy hiányos adatainak helyesbítését.

**Kérvényezés:** A rendszerben saját maga is módosíthat, vagy adatvedelem@mbit.hu

### 9.3 Törléshez Való Jog ("Elfeledtetéshez való jog")

Ön kérheti adatai törlését, ha:
- Már nem szükségesek
- Hozzájárulását visszavonja
- Jogellenes kezelés esetén

**Kivételek:** Jogi kötelezettség (számviteli, adó)

### 9.4 Korlátozáshoz Való Jog

Kérheti adatkezelés korlátozását, ha:
- Vitatja az adatok pontosságát
- Jogellenes a kezelés, de nem kéri törlést
- Jogi igények érvényesítéséhez szükséges

### 9.5 Adathordozhatósághoz Való Jog

Kérheti adatai géppel olvasható formátumban történő kiadását.

**Formátumok:** JSON, CSV, XML

### 9.6 Tiltakozási Jog

Jogos érdek alapján végzett adatkezeléssel szemben tiltakozhat.

### 9.7 Automatizált Döntéshozatal

A rendszer NEM alkalmaz automatizált döntéshozatalt profilalkotással.

---

## 10. Adatvédelmi Incidens Kezelés

### 10.1 Észlelés és Bejelentés

**Belső határidő:** 24 óra  
**NAIH bejelentés:** 72 órán belül (ha szükséges)  
**Érintett tájékoztatás:** Indokolatlan késedelem nélkül

### 10.2 Incidens Típusok

- **Alacsony kockázat:** Belső napló, intézkedés
- **Közepes kockázat:** Felülvizsgálat, korrekció
- **Magas kockázat:** NAIH bejelentés, érintettek tájékoztatása

### 10.3 Megelőzés

- Rendszeres biztonsági auditok
- Penetrációs tesztek
- Munkatársi képzések
- Folyamatos monitoring

---

## 11. Cookie-k és Nyomkövetés

### 11.1 Használt Cookie-k

| Cookie neve | Típus | Cél | Megőrzés |
|-------------|-------|-----|----------|
| auth_token | Szükséges | Bejelentkezés | Session |
| preferences | Funkcionális | Beállítások | 1 év |
| analytics* | Statisztikai | Használat elemzés | 1 év |

_* Csak hozzájárulással_

### 11.2 Cookie Kezelés

Bármikor törölheti a cookie-kat böngészőjében vagy a rendszer beállításaiban.

---

## 12. Gyermekek Adatainak Védelme

A rendszer használatához minimum 18 év szükséges. Tudatosan nem gyűjtünk 16 év alatti gyermekek adatait.

---

## 13. Panasz és Jogorvoslat

### 13.1 Panasz Adatkezelőnél

Email: adatvedelem@mbit.hu  
Válaszidő: 30 nap

### 13.2 Felügyeleti Hatóság

**Nemzeti Adatvédelmi és Információszabadság Hatóság (NAIH)**
- Cím: 1055 Budapest, Falk Miksa utca 9-11.
- Levelezési cím: 1363 Budapest, Pf. 9.
- Telefon: +36 1 391 1400
- Email: ugyfelszolgalat@naih.hu
- Web: www.naih.hu

### 13.3 Bírósági Jogorvoslat

Ön jogosult bírósághoz fordulni az adatkezeléssel kapcsolatos jogsérelem esetén.

---

## 14. Módosítások

Fenntartjuk a jogot jelen tájékoztató módosítására. Jelentős változásokról email-ben tájékoztatunk.

**Módosítások nyomon követése:**
- Verzió: 1.0
- Hatálybalépés: 2025. november 6.

---

## 15. Kapcsolat

**Adatvédelmi kérdések:**
- Email: adatvedelem@mbit.hu
- Telefon: +36 1 234 5678
- Postai cím: 1055 Budapest, Példa utca 1.

**DPO (Adatvédelmi tisztviselő):**
- Email: dpo@mbit.hu

---

**Jóváhagyva:** Mbit Jogi és Compliance Osztály  
**Következő felülvizsgálat:** 2026. november 6.
