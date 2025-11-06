# Disaster Recovery Plan (DRP) Összefoglaló
## Audit Institute ERP Rendszer

**Verzió:** 1.0  
**Hatálybalépés:** 2025. november 6.  
**Következő felülvizsgálat:** 2026. február 6.

---

## 1. Executive Summary

A Disaster Recovery Plan (DRP) célja az Audit Institute ERP rendszer üzemfolytonosságának biztosítása katasztrófa (természeti csapás, technikai meghibásodás, emberi hiba, kibertámadás) esetén.

**Kulcs Metrikák:**
- **RTO (Recovery Time Objective):** 4 óra
- **RPO (Recovery Point Objective):** 24 óra
- **Elérhetőségi cél:** ≥96% (évente maximum 14 nap leállás)

---

## 2. Hatókör

### 2.1 Lefedett Rendszerek

| Komponens | Kritikusság | RTO | RPO |
|-----------|-------------|-----|-----|
| **Adatbázis** | Kritikus | 2 óra | 1 óra |
| **Backend API** | Kritikus | 4 óra | - |
| **Frontend Web** | Magas | 2 óra | - |
| **Desktop App** | Közepes | 8 óra | - |
| **Fájlrendszer** | Magas | 4 óra | 24 óra |

### 2.2 Nem Lefedett

- Harmadik fél szolgáltatások (email, SMS gateway)
- Ügyfél saját hálózata
- Felhasználói végpontok (PC-k, laptopok)

---

## 3. Katasztrófa Típusok és Válaszok

### 3.1 Katasztrófa Osztályozás

| Szint | Leírás | Hatás | RTO |
|-------|--------|-------|-----|
| **Minor** | Egyes komponens kiesés | <10% felhasználó | 1 óra |
| **Major** | Teljes rendszer leállás | Teljes  szolgáltatás | 4 óra |
| **Disaster** | Data center/infrastruktúra vesztés | Katasztrofális | 8 óra |

### 3.2 Forgatókönyvek

#### Scenario 1: Szerver Hardware Meghibásodás
**Hatás:** Backend API nem elérhető  
**Válasz:**
1. Failover másodlagos szerverre (ha elérhető)
2. VM restore legutóbbi snapshotból
3. Szolgáltatás újraindítása

**Várható RTO:** 1-2 óra

#### Scenario 2: Adatbázis Korrupció
**Hatás:** Adatvesztés vagy sérülés  
**Válasz:**
1. Adatbázis leállítása
2. Legutóbbi ép backup restore
3. Transaction log replay (ha elérhető)
4. Adatintegritás ellenőrzés

**Várható RTO:** 2-4 óra  
**Várható RPO:** 1-24 óra (utolsó backup-tól)

#### Scenario 3: Ransomware Támadás
**Hatás:** Fájlok titkosítva, rendszer használhatatlan  
**Válasz:**
1. Érintett rendszerek izolálása (hálózat szétválasztás)
2. Forensics - támadás azonosítása
3. Tiszta rendszer felállítása
4. Backup restore (ransomware előtti állapot)
5. Biztonsági intézkedések megerősítése

**Várható RTO:** 4-8 óra  
**Adatvesztés:** Legfeljebb utolsó backup óta

#### Scenario 4: Természeti Katasztrófa (Tűz, Árvíz)
**Hatás:** Teljes data center/szerver szoba megsemmisülés  
**Válasz:**
1. Aktiválás: DR Site (másodlagos telephely)
2. Off-site backup visszatöltése
3. Szolgáltatás újraindítása DR környezetben
4. DNS átállítás új IP-re

**Várható RTO:** 8-24 óra  
**Várható RPO:** 24 óra

#### Scenario 5: Kibertámadás / DDoS
**Hatás:** Szolgáltatás elérhetetlensége  
**Válasz:**
1. Traffic filtering / rate limiting
2. CDN/DDoS protection aktiválása
3. IP blacklisting
4. Incident response team aktiválása

**Várható RTO:** 1-4 óra

---

## 4. Backup Stratégia

### 4.1 Backup Típusok

| Típus | Gyakoriság | Megőrzés | Hely |
|-------|------------|----------|------|
| **Teljes (Full)** | Hetente (vasárnap) | 4 hét | On-site + Off-site |
| **Inkrementális** | Naponta (éjjel) | 7 nap | On-site |
| **Tranzakció log** | Óránként | 24 óra | On-site |
| **Kritikus fájlok** | Real-time sync | 30 nap | Off-site |

### 4.2 Backup Lokációk

**On-site (Helyi):**
- NAS eszköz a szerver szobában
- Gyors restore (RTO <2 óra)
- Rizikó: Fizikai katasztrófa

**Off-site (Távoli):**
- Másik földrajzi helyen (minimum 50 km)
- Cloud storage (titkosítva)
- Lassabb restore, de katasztrófa-biztos

### 4.3 Backup Tesztelés

**Rendszeres restore teszt:**
- Havonta: Egy véletlenszerű backup visszatöltése test környezetbe
- Negyedévente: Teljes DR drill
- Évente: Disaster scenario szimuláció

**Tesztelési checklist:**
- [ ] Backup fájlok integritása (checksum)
- [ ] Visszatöltési idő mérése
- [ ] Adatintegritás ellenőrzés
- [ ] Alkalmazás működőképesség
- [ ] Dokumentáció frissítése

---

## 5. Recovery Folyamat

### 5.1 Aktiválási Kritériumok

**DR aktiválása ha:**
- Várható leállás >4 óra
- Kritikus adatvesztés
- Biztonsági incidens (ransomware)
- Természeti katasztrófa
- Infrastruktúra teljes elvesztése

**Döntési jogkör:**
- IT Manager (Minor/Major)
- CIO/CTO (Disaster)

### 5.2 Recovery Fázisok

#### Fázis 1: Értékelés (0-30 perc)
- Probléma azonosítása és osztályozása
- Hatáselemzés
- DR aktiválási döntés
- Csapat értesítése

#### Fázis 2: Izolálás (30-60 perc)
- Érintett rendszerek leválasztása
- További károk megakadályozása
- Backup integritásának ellenőrzése

#### Fázis 3: Helyreállítás (1-4 óra)
- Backup restore
- Konfiguráció visszaállítása
- Függőségek ellenőrzése
- Tesztelés

#### Fázis 4: Verifikáció (30 perc-1 óra)
- Funkcionalitás ellenőrzése
- Adatintegritás teszt
- Teljesítmény mérés
- Biztonsági ellenőrzés

#### Fázis 5: Szolgáltatás Visszaállítása
- Felhasználók értesítése
- Fokozatos visszakapcsolás
- Monitoring erősítése

#### Fázis 6: Post-Recovery
- Incident dokumentálás
- Root cause analysis
- Korrekciós akciók
- DRP frissítése

---

## 6. Szerepkörök és Felelősségek

### 6.1 DR Csapat

| Szerepkör | Felelősség | Kontakt |
|-----------|------------|---------|
| **DR Manager** (IT Manager) | Koordináció, döntéshozatal | +36 30 123 4567 |
| **System Admin** | Rendszer helyreállítás | +36 30 234 5678 |
| **Database Admin** | Adatbázis restore | +36 30 345 6789 |
| **Network Admin** | Hálózat konfiguráció | +36 30 456 7890 |
| **Security Officer** | Biztonsági elemzés | +36 30 567 8901 |
| **Communications Manager** | Stakeholder kommunikáció | +36 30 678 9012 |

### 6.2 Eszkalációs Lépcsőzet

```
Level 1: System Administrator (0-30 perc)
           ↓ (ha nem megoldható)
Level 2: IT Manager (30-60 perc)
           ↓ (ha DR aktiválás szükséges)
Level 3: CTO/CIO (60-120 perc)
           ↓ (ha teljes infrastruktúra vesztés)
Level 4: CEO + External Support
```

---

## 7. Kommunikációs Terv

### 7.1 Belső Kommunikáció

**Értesítési sorrend:**
1. DR Csapat (Azonnali - SMS/hívás)
2. IT Osztály (15 perc - Email/Chat)
3. Vezetőség (30 perc - Email + Telefonhívás)
4. Alkalmazottak (1 óra - Intranetes közlemény)

**Kommunikációs csatornák:**
- Primary: Telefon/SMS
- Secondary: Email
- Backup: WhatsApp/Teams

### 7.2 Külső Kommunikáció

**Érintett felek:**
- Ügyfelek / Felhasználók
- Partnerek
- Szabályozó hatóságok (ha szükséges)

**Üzenet sablon:**
```
Tárgy: [SÜRGŐS] Audit Institute ERP - Szolgáltatási Zavar

Tisztelt Ügyfeleink,

Tájékoztatjuk Önöket, hogy [IDŐPONT]-től kezdődően az Audit 
Institute ERP rendszer átmenetileg nem elérhető [OK] miatt.

IT csapatunk teljes erővel dolgozik a probléma megoldásán.
Várható helyreállítás: [IDŐPONT]

A helyreállítás során adatvesztés NEM várható.

Frissítéseket a [URL] címen találnak.

Megértésüket köszönjük!

Audit Institute IT Csapat
```

---

## 8. DR Infrastruktúra

### 8.1 Elsődleges Hely (Primary Site)

**Helyszín:** Ügyfél saját infrastruktúra vagy Partner datacenter  
**Komponensek:**
- Production szerverek
- Adatbázis (primary)
- Fájl storage
- Backup NAS

### 8.2 Másodlagos Hely (DR Site)

**Helyszín:** Különálló földrajzi lokáció (minimum 50km)  
**Konfiguráció:**
- **Hot Standby:** Adatbázis folyamatos replikáció
- **Warm Standby:** Szerverek készen, de inaktívak
- **Cold Standby:** Backup tárhely + restore capability

**Választás típustól függ:**
- Kritikus rendszer: Hot Standby (RTO <1 óra)
- Standard: Warm Standby (RTO <4 óra)
- Nem kritikus: Cold Standby (RTO <24 óra)

### 8.3 Cloud Backup

**Szolgáltató:** Azure / AWS / Google Cloud  
**Titkosítás:** AES-256  
**Replikáció:** Több régió  
**Költség vs. Biztonság:** Opcionális, de ajánlott

---

## 9. DR Testing

### 9.1 Teszt Típusok

| Teszt Típus | Gyakoriság | Scope | Leállás |
|-------------|------------|-------|---------|
| **Tabletop Exercise** | Negyedévente | Elméleti átvonulás | Nincs |
| **Partial DR Test** | Félévente | Egy komponens restore | Minimális |
| **Full DR Drill** | Évente | Teljes rendszer failover | Tervezett leállás |

### 9.2 Teszt Forgatókönyv (Példa)

**Scenario:** Adatbázis szerver teljes meghibásodás

**Lépések:**
1. **T+0:** Hiba szimuláció - DB szerver leállítása
2. **T+5 perc:** Probléma észlelése, DR aktiválás döntés
3. **T+15 perc:** Backup azonosítása, restore indítása
4. **T+60 perc:** Adatbázis visszatöltve
5. **T+90 perc:** Backend összekapcsolása, tesztelés
6. **T+120 perc:** Szolgáltatás visszaállítva

**Mért Metrikák:**
- Tényleges RTO
- Adatintegritás (RPO)
- Csapat válaszideje
- Kommunikáció hatékonysága

**Post-Test:**
- Tanulságok dokumentálása
- DRP frissítése
- Azonosított hiányosságok pótlása

---

## 10. Költségek és Erőforrások

### 10.1 DR Infrastruktúra Költségek

| Tétel | Becsült Költség (éves) |
|-------|-------------------------|
| Off-site Backup Storage | 500.000 HUF |
| DR Site (Warm Standby) | 2.000.000 HUF |
| Backup Szoftver Licencek | 300.000 HUF |
| Network Redundancia | 400.000 HUF |
| Tesztelés / Karbantartás | 800.000 HUF |
| **Összesen** | **4.000.000 HUF** |

### 10.2 ROI Kalkuláció

**Átlagos leállási költség:**
- Óránkénti veszteség: 500.000 HUF
- 4 órás leállás: 2.000.000 HUF
- Évente 1 incidens várható: 2.000.000 HUF veszteség

**DR befektetés megtérülése:**
- Költség: 4.000.000 HUF/év
- Elkerült veszteség: 2.000.000 HUF (minimum)
- **ROI:** 2 év (konzervatív becslés)

---

## 11. Compliance és Audit

### 11.1 Szabályozási Megfelelés

- **ISO 22301:** Üzletfolytonossági menedzsment
- **GDPR:** Adatbiztonság és adatvédelem
- **Számviteli törvény:** Adatmegőrzés

### 11.2 Audit Követelmények

**Dokumentálandó:**
- DR Plan naprakészsége
- Backup sikeressége (napi naplók)
- Teszt eredmények
- Valós incidensek és helyreállítások

**Audit Gyakoriság:**
- Belső: Félévente
- Külső: Évente

---

## 12. Folyamatos Fejlesztés

### 12.1 DRP Felülvizsgálat

**Trigger Events:**
- Major infrastruktúra változás
- Új rendszerkomponens
- Sikeres/sikertelen DR teszt
- Valós incidens tapasztalatok

**Scheduled Review:**
- **Negyedévente:** Quick review
- **Évente:** Comprehensive update

### 12.2 Lessons Learned

Minden DR esemény (teszt vagy valós) után:
1. Post-Mortem meeting (48 órán belül)
2. What Went Well / What Went Wrong
3. Action Items meghatározása
4. DRP dokumentáció frissítése
5. Csapat képzése hiányosságokról

---

## 13. Függelékek

### 13.1 Kontakt Lista

**24/7 Elérhetőségek**
_(Részletes lista külön titkosított dokumentumban)_

### 13.2 Rendszer Diagramok

**Hálózati topológia**  
**Adatfolyam térképek**  
**Backup folyamat**

_(Mellékletben vagy biztonságos helyen tárolva)_

### 13.3 Backup Restore Útmutatók

**Step-by-step utasítások:**
- Database restore (PostgreSQL/SQLite)
- Application restore
- File system restore
- Full system recovery

### 13.4 Vendor Kontaktok

| Vendor | Szolgáltatás | Support Contact | SLA |
|--------|--------------|-----------------|-----|
| Hardware Vendor | Szerver / Storage | +36 1 XXX XXXX | 4 óra |
| Cloud Provider | Backup Storage | support@provider.com | 1 óra |
| Network ISP | Internet / VPN | +36 1 YYY YYYY | 2 óra |

---

## 14. Lezárás

A Disaster Recovery Plan élő dokumentum, amely folyamatosan fejlődik a szervezet és technológia változásaival. Rendszeres tesztelés és frissítés elengedhetetlen az üzletfolytonosság biztosításához.

**Következő lépések:**
- [ ] DR csapat felállítása
- [ ] Off-site backup beállítása
- [ ] Első DR drill tervezése (Q1 2026)
- [ ] Kommunikációs sablonok véglegesítése

---

**Jóváhagyva:**  
_Aláírás:_ ________________  
_Név:_ CTO / CIO  
_Dátum:_ 2025. november 6.

**Következő felülvizsgálat:** 2026. február 6.  
**Verzió:** 1.0
