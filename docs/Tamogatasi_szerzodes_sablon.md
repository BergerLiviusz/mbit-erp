# Támogatási Szerződés Sablon
## Mbit ERP Rendszer

---

## SZOFTVERMEGÁLLAPODÁS ÉS TÁMOGATÁSI SZERZŐDÉS

**Szerződés azonosító:** MBIT-ERP-SUPP-2025-XXX  
**Kelt:** 2025. november 6.

---

### 1. SZERZŐDŐ FELEK

**Szolgáltató:**
- Név: Mbit Kft.
- Székhely: 1055 Budapest, Példa utca 1.
- Adószám: 12345678-2-41
- Képviseli: [Ügyvezető neve]

**Ügyfél:**
- Név: [Ügyfél cég neve]
- Székhely: [Cím]
- Adószám: [Adószám]
- Képviseli: [Kapcsolattartó neve és beosztása]

---

### 2. SZERZŐDÉS TÁRGYA

A Szolgáltató vállalja az Mbit ERP rendszer üzemeltetési támogatását és karbantartását az alábbi feltételek szerint.

#### 2.1 Szoftver Komponensek
- CRM (Ügyfélkapcsolat-kezelés) modul
- DMS (Dokumentumkezelés és Iratkezelés) modul
- Logisztika (Raktár és Készletkezelés) modul
- Backend API szerver
- Web és Desktop alkalmazások

---

### 3. SZOLGÁLTATÁSI SZINT MEGÁLLAPODÁS (SLA)

#### 3.1 Rendszer Elérhetőség

**Garantált elérhetőség:** ≥96% havi szinten

**Kiszámítás módja:**
```
Elérhetőség % = (Teljes idő - Leállási idő) / Teljes idő × 100
```

**Nem számít leállásnak:**
- Tervezett karbantartás (előre bejelentve, munkaidőn kívül)
- Force majeure események
- Ügyfél oldaláról származó hibák

#### 3.2 Válaszidők

| Prioritás | Leírás | Első válasz | Megoldási cél |
|-----------|--------|-------------|---------------|
| **Kritikus (P1)** | Teljes rendszerleállás | 1 óra | 4 óra |
| **Sürgős (P2)** | Jelentős funkció kiesés | 4 óra | 8 óra |
| **Normál (P3)** | Kisebb funkció hiba | 8 óra | 24 óra |
| **Alacsony (P4)** | Kozmetikai hiba, kérdés | 24 óra | 5 munkanap |

#### 3.3 Támogatási Időszak

**Standard támogatás:**
- **Időszak:** Hétfő - Péntek, 9:00 - 17:00 (magyar idő)
- **Csatornák:** Email, telefon, online ticketing rendszer

**Kiterjesztett támogatás (opcionális):**
- **7×24 támogatás** (külön díj ellenében)
- **Készenléti szolgálat:** Hétvégén és ünnepnapokon

---

### 4. SZOLGÁLTATÁSOK RÉSZLETEI

#### 4.1 Rendszerkarbantartás

**Havonta:**
- Biztonsági frissítések telepítése
- Teljesítmény monitoring és optimalizálás
- Naplók elemzése és archiválása
- Biztonsági mentések ellenőrzése

**Negyedévente:**
- Rendszer audit
- Kapacitástervezés felülvizsgálata
- Teljesítmény riport
- Disaster Recovery teszt

**Évente:**
- Teljes rendszer átvilágítás
- Biztonsági audit
- Compliance ellenőrzés
- Upgrade tervezés

#### 4.2 Helpdesk Szolgáltatások

**Tartalma:**
- Hibaelhárítás
- Konfigurációs segítség
- Felhasználói support
- Oktatási anyagok biztosítása

**Elérhetőségek:**
- **Email:** support@mbit.hu
- **Telefon:** +36 1 234 5678
- **Online:** Ticketing rendszer a felületen

#### 4.3 Biztonsági Mentés és Helyreállítás

**Mentési Ütemterv:**
- **Adatbázis:** Naponta, éjszaka
- **Fájlok:** Naponta, éjszaka
- **Teljes rendszer:** Hetente

**Megőrzési Idő:**
- Napi mentések: 7 nap
- Heti mentések: 4 hét
- Havi mentések: 12 hónap

**Helyreállítás:**
- RTO (Recovery Time Objective): 4 óra
- RPO (Recovery Point Objective): 24 óra

#### 4.4 Verziófrissítések

**Kisebb frissítések (patch):**
- Automatikus telepítés (biztonsági javítások)
- Előzetes értesítés 48 órával

**Nagyobb frissítések (minor/major):**
- Előzetes tesztelés tesztkörnyezetben
- Ügyfél jóváhagyása szükséges
- Telepítés egyeztetett időpontban

---

### 5. ÜGYFÉL KÖTELEZETTSÉGEI

#### 5.1 Együttműködés
- Időben jelzi a hibákat és problémákat
- Teljes és pontos hibajelentéseket ad
- Teszteli az új verziókat tesztkörnyezetben

#### 5.2 Hozzáférés
- Biztosítja a szükséges hozzáféréseket a támogatási feladatokhoz
- VPN vagy távoli hozzáférés engedélyezése

#### 5.3 Backup Együttműködés
- Rendszeres ellenőrzi a mentések sikerességét
- Teszteli a visszaállítási folyamatokat

---

### 6. DÍJAZÁS

#### 6.1 Támogatási Díjak

**Alapcsomag (Standard Support):**
- Havi díj: [Összeg] HUF + ÁFA
- Éves díj (10% kedvezmény): [Összeg] HUF + ÁFA

**Benne foglalt:**
- Standard munkaidőben támogatás
- Rendszerkarbantartás
- Biztonsági mentések
- Verziófrissítések (minor)

**Premium csomag (Extended Support):**
- Havi díj: [Összeg] HUF + ÁFA
- 7×24 támogatás
- Gyorsabb válaszidők
- Dedikált support mérnök

#### 6.2 Külön Számlázandó Tételek

- Major verziófrissítés: [Összeg] HUF + ÁFA
- Testreszabás: óradíj alapján [Összeg] HUF/óra + ÁFA
- Helyszíni támogatás: óradíj + utazási költség
- Oktatás: [Összeg] HUF/fő + ÁFA

#### 6.3 Fizetési Feltételek

- Előre fizetendő havonta/évente
- Fizetési határidő: számla kiállításától 8 nap
- Késedelmi kamat: jegybanki alapkamat + 8%

---

### 7. FELELŐSSÉG ÉS SZANKCIÓK

#### 7.1 Szolgáltatói Felelősség

**SLA nem teljesítés esetén:**

| Elérhetőség | Kompenzáció |
|-------------|-------------|
| 95.00% - 95.99% | 10% havi díj visszatérítés |
| 94.00% - 94.99% | 25% havi díj visszatérítés |
| < 94.00% | 50% havi díj visszatérítés |

**Maximum kompenzáció:** Az adott havi díj 100%-a

**Felelősség kizárása:**
- Force majeure események
- Ügyfél általi módosítások
- Harmadik fél szoftver/hardver hibái
- Ügyfél hálózati problémái

#### 7.2 Ügyfél Felelősség

- Fizetési kötelezettség elmulasztása: szolgáltatás felfüggesztése
- Biztonsági előírások be nem tartása: szerződés felmondása

---

### 8. ADATVÉDELEM ÉS BIZTONSÁG

#### 8.1 GDPR Megfelelés

- A Szolgáltató adatfeldolgozóként jár el
- Adatfeldolgozási megállapodás mellékletként
- Személyes adatok védelme

#### 8.2 Titoktartás

- Mindkét fél 5 év titoktartási kötelezettséget vállal
- Üzleti titkok védelme
- Technikai dokumentáció védelme

#### 8.3 Biztonsági Intézkedések

- Rendszeres biztonsági auditok
- Titkosított adattárolás és kommunikáció
- Hozzáférési jogok kezelése
- Incidenskezelési protokoll

---

### 9. SZERZŐDÉS IDŐTARTAMA ÉS MEGSZÜNTETÉSE

#### 9.1 Időtartam

- **Kezdő dátum:** [Dátum]
- **Időtartam:** 12 hónap (automatikus meghosszabbítás)
- **Felmondási idő:** 60 nap a lejárat előtt

#### 9.2 Rendkívüli Felmondás

**Szolgáltató részéről:**
- 90 napos fizetési késedelem
- Szerződésszegés ügyfél részéről

**Ügyfél részéről:**
- SLA többszöri súlyos megsértése
- Szolgáltatás minősége csökken

#### 9.3 Lezárási Folyamat

- Adatok átadása 30 napon belül
- Dokumentáció átadása
- Hozzáférések megszüntetése

---

### 10. EGYÉB RENDELKEZÉSEK

#### 10.1 Vis Major

Force majeure esetén egyik fél sem felel a szerződés nem teljesítéséért.

#### 10.2 Átruházás

A szerződés csak mindkét fél előzetes írásbeli hozzájárulásával ruházható át.

#### 10.3 Módosítások

Szerződésmódosítás csak írásos formában, mindkét fél aláírásával érvényes.

#### 10.4 Irányadó Jog

Jelen szerződésre a magyar jog az irányadó.

#### 10.5 Jogviták

Vitás kérdésekben a felek a békés megoldást részesítik előnyben. Ennek sikertelensége esetén a Budapesti Törvényszék az illetékes.

---

### 11. ALÁÍRÁSOK

**Szolgáltató:**

Mbit Kft.

_______________________  
Név:  
Beosztás:  
Dátum:


**Ügyfél:**

[Ügyfél Cég Neve]

_______________________  
Név:  
Beosztás:  
Dátum:


---

### MELLÉKLETEK

1. Adatfeldolgozási Megállapodás (GDPR)
2. Rendszer Specifikáció
3. Kapcsolattartói Lista
4. Eszkalációs Mátrix
5. Változáskezelési Folyamat

---

**Verzió:** 1.0  
**Készült:** 2025. november 6.  
**Jóváhagyta:** Mbit Jogi Osztály
