# IT Biztonsági Szabályzat Kivonat
## Audit Institute ERP Rendszer

**Verzió:** 1.0  
**Hatálybalépés:** 2025. november 6.  
**Érvényesség:** Határozatlan időre, éves felülvizsgálattal

---

## 1. Célja és Hatálya

### 1.1 Cél

Jelen IT Biztonsági Szabályzat célja az Audit Institute ERP rendszer információbiztonságának biztosítása a CIA triád (Confidentiality, Integrity, Availability - Bizalmasság, Sértetlenség, Rendelkezésre állás) alapelvei szerint.

### 1.2 Hatály

A szabályzat kiterjed:
- Minden felhasználóra (alkalmazottak, szerződéses partnerek)
- Minden rendszerkomponensre (szerver, adatbázis, alkalmazások)
- On-premise és cloud telepítésekre egyaránt

---

## 2. Biztons ági Alapelvek

### 2.1 CIA Triád

**Confidentiality (Bizalmasság):**
- Adatok csak jogosultaknak érhetők el
- Titkosítás használata érzékeny adatokhoz
- Hozzáférés-kezelés szerepkörök alapján

**Integrity (Sértetlenség):**
- Adatmódosítások nyomon követése
- Audit naplók védett tárolása
- Változtatások verziókövetése

**Availability (Rendelkezésre állás):**
- ≥96% rendszer elérhetőség
- Redundancia kritikus komponensekben
- Disaster Recovery terv

### 2.2 Defense in Depth (Mélységi védelem)

Többrétegű biztonsági megközelítés:
1. Fizikai biztonság
2. Hálózati biztonság
3. Végpont védelem
4. Alkalmazás biztonság
5. Adat biztonság
6. Felhasználói tudatosság

---

## 3. Hozzáférés-kezelés

### 3.1 Felhasználói Fiókok

**Létrehozás:**
- Egyedi felhasználói azonosítók
- Kezdeti jelszó kötelező módosítása
- Szerepkör hozzárendelés munkakör alapján

**Jelszó Politika:**
- Minimum 12 karakter
- Tartalmazzon: nagybetű, kisbetű, szám, speciális karakter
- Változtatás 90 naponta
- Előző 5 jelszó nem használható újra
- Tiltólista: gyakori jelszavak, cég neve, stb.

**Többfaktoros Hitelesítés (2FA):**
- Admin fiókoknál kötelező
- Más felhasználóknál ajánlott
- Módszerek: TOTP (Google Authenticator), SMS

### 3.2 Szerepkörök és Jogosultságok (RBAC)

| Szerepkör | Jogosultságok | 2FA |
|-----------|---------------|-----|
| **Admin** | Teljes hozzáférés, konfiguráció | Kötelező |
| **PowerUser** | Osztott erőforrások, riportok | Ajánlott |
| **User** | Saját adatok, olvasás | Opcionális |
| **Auditor** | Csak olvasás, exportálás | Ajánlott |

**Least Privilege Elv:**
- Felhasználók csak a szükséges jogokat kapják
- Rendszeres jogosultság felülvizsgálat (negyedévente)

### 3.3 Session Kezelés

- Session timeout: 24 óra inaktivitás után
- Egyidejű bejelentkezések: maximum 3 eszköz
- Távoli kijelentkeztetés lehetősége

---

## 4. Hálózati Biztonság

### 4.1 Tűzfal Konfiguráció

**Engedélyezett portok:**
- 443 (HTTPS) - Web interfész
- 3000 (belső) - Backend API
- 5432 (belső) - PostgreSQL (ha használt)

**Tiltott:**
- Minden más bejövő kapcsolat

### 4.2 Hálózati Szegmentálás

```
[Internet] 
    ↓
[Reverse Proxy / Load Balancer]
    ↓
[Web Tier - DMZ]
    ↓
[Application Tier - Private Network]
    ↓
[Database Tier - Isolated Network]
```

### 4.3 VPN és Távoli Hozzáférés

**Kötelező VPN használat:**
- Távoli adminisztrációhoz
- Support hozzáféréshez
- Home office munkavégzéshez

**VPN Követelmények:**
- OpenVPN vagy IPSec
- Erős titkosítás (AES-256)
- Certificate-based auth

---

## 5. Adatbiztonság

### 5.1 Titkosítás

**Rest Encryption (Nyugvó adat):**
- Adatbázis: AES-256 bit
- Fájlrendszer: LUKS vagy BitLocker
- Backup fájlok: AES-256 + jelszóvédelem

**Transit Encryption (Adatátvitel):**
- HTTPS (TLS 1.3)
- API kommunikáció: TLS
- Belső mikroszervízek: mTLS

**Key Management:**
- Kulcsok hardver HSM-ben vagy Azure Key Vault-ban
- Kulcs rotáció évente
- Master kulcsok külön tárolva

### 5.2 Adatminősítés

| Minősítés | Példa | Védelmi szint |
|-----------|-------|---------------|
| **Nyilvános** | Marketing anyagok | Nincs különleges |
| **Belső** | Céges dokumentumok | Hozzáférés-korlátozás |
| **Bizalmas** | Ügyfél adatok | Titkosítás + Jogosultság |
| **Szigorúan bizalmas** | Pénzügyi adatok | Titkosítás + Audit |

### 5.3 Data Loss Prevention (DLP)

- Email szűrés érzékeny adatokra
- USB/külső eszköz korlátozás
- Képernyőfotó watermarking (opcionális)

---

## 6. Alkalmazás Biztonság

### 6.1 Secure Development Lifecycle (SDLC)

**Fejlesztési Fázis:**
- Kód review minden commit előtt
- Static Code Analysis (SAST) eszközökkel
- Dependency scanning (ismert sebezhetőségek)

**Tesztelési Fázis:**
- Penetration testing évente
- Vulnerability scanning havonta
- OWASP Top 10 ellenőrzés

**Deployment:**
- Immutable infrastructure
- Configuration as Code
- Automated security testing CI/CD-ben

### 6.2 Input Validation

- SQL injection védelem (Parameterized Queries)
- XSS védelem (Content Security Policy)
- CSRF védelem (Token-based)
- File upload validation (típus, méret, tartalom)

### 6.3 API Biztonság

- JWT token használat
- Rate limiting (DDoS védelem)
- API gateway használata
- OpenAPI specifikáció

---

## 7. Naplózás és Monitoring

### 7.1 Audit Naplók

**Naplózandó események:**
- Bejelentkezések (sikeres és sikertelen)
- Jogosultság változások
- Adatmódosítások (CRM, DMS, Logisztika)
- Konfiguráció változások
- Fájl hozzáférések
- Rendszer hibák

**Napló formátum:**
```json
{
  "timestamp": "2025-11-06T14:30:00Z",
  "user_id": "user123",
  "ip_address": "192.168.1.100",
  "action": "document_access",
  "resource": "IK-2025-000123",
  "result": "success"
}
```

**Megőrzés:**
- Működési naplók: 1 év
- Biztonsági naplók: 7 év
- Compliance naplók: Törvény szerint (8 év)

### 7.2 Security Information and Event Management (SIEM)

**Valós idejű monitoring:**
- Gyanús bejelentkezési próbálkozások
- Privilege escalation
- Szokatlan adathozzáférési minták
- Rendszer teljesítmény anomáliák

**Riasztások:**
- Email értesítések kritikus eseményekről
- SMS admin számra (P1 incidensek)
- Dashboard megjelenítés

---

## 8. Incidenskezelés

### 8.1 Incident Response Plan (IRP)

**Fázisok:**
1. **Azonosítás** - Incidens felismerése
2. **Elszigetelés** - Terjedés megállítása
3. **Eltávolítás** - Fenyegetés eliminálása
4. **Helyreállítás** - Normál üzem visszaállítása
5. **Utólagos értékelés** - Tanulságok levonása

**Incident Kategóriák:**
- **P1 (Kritikus):** Adatvesztés, teljes leállás - Reakció 1 órán belül
- **P2 (Magas):** Biztonsági rés kihasználása - Reakció 4 órán belül
- **P3 (Közepes):** Részleges funkció kiesés - Reakció 8 órán belül
- **P4 (Alacsony):** Kisebb problémák - Reakció 24 órán belül

### 8.2 Kommunikációs Terv

**Belső:**
- IT csapat azonnali értesítése
- Vezetőség tájékoztatása 2 órán belül

**Külső:**
- Érintett felhasználók (ha szükséges)
- NAIH bejelentés (72 órán belül, GDPR szerint)
- Sajtó (csak vezetői jóváhagyással)

### 8.3 Forensics

- Naplók biztonsági mentése
- Érintett rendszerek izolálása
- Bizonyítékok gyűjtése (chain of custody)

---

## 9. Backup és Disaster Recovery

### 9.1 Backup Stratégia (3-2-1 Szabály)

- **3** példány az adatból
- **2** különböző médiumon
- **1** off-site helyen

**Backup Ütemezés:**
- Teljes backup: Hetente vasárnap éjjel
- Inkrementális backup: Naponta éjjel
- Tranzakció log backup: Óránként (kritikus rendszereknél)

**Titkosítás:**
- Minden backup AES-256 titkosítva
- Jelszavak hardened key store-ban

### 9.2 Disaster Recovery Plan (DRP)

**Recovery Time Objective (RTO):** 4 óra  
**Recovery Point Objective (RPO):** 24 óra

**DR Típusok:**
- **Adatbázis korrupció:** Restore legutóbbi backupból - RTO 2 óra
- **Szerver meghibásodás:** Failover másodlagos szerverre - RTO 1 óra
- **Teljes site leállás:** Restore DR site-ra - RTO 4 óra
- **Ransomware támadás:** Tiszta backup restore - RTO 6 óra

**Tesztelés:**
- DR drill negyedévente
- Backup restore teszt havonta
- Dokumentáció frissítése minden teszt után

---

## 10. Fizikai Biztonság

### 10.1 Szerver Szoba / Data Center

**Hozzáférés:**
- Biometrikus beléptetés vagy kártyás rendszer
- Látogatók kísérése kötelező
- Belépési napló vezetése

**Környezeti Védelem:**
- UPS (Szünetmentes tápellátás)
- Klímaberendezés redundanciával
- Tűzjelző és oltórendszer
- Vízszivárgás érzékelő

### 10.2 Munkaállomások

- Képernyőzár automatikusan 10 perc után
- Clean desk policy (ír otok bezárása)
- Látogatók jelenlétében képernyővédő

---

## 11. Harmadik Féltől Származó Szoftverek

### 11.1 Vendor Management

**Értékelési Kritériumok:**
- Biztonsági tanúsítványok (ISO 27001, SOC 2)
- Sebezhetőség kezelési folyamat
- Incident response képesség
- GDPR megfelelés

**Szerződéses Követelmények:**
- Security addendum
- Adatfeldolgozási megállapodás
- Incidensek bejelentési kötelezettsége

### 11.2 Dependency Management

- Rendszeres frissítések (npm audit, Dependabot)
- Ismert sebezhetőségek monitorozása
- License compliance ellenőrzés

---

## 12. Felhasználói Tudatosság

### 12.1 Biztonsági Képzés

**Kötelező éves képzés minden felhasználónak:**
- Jelszó biztonság
- Phishing felismerés
- Social engineering
- Adatvédelem (GDPR)
- Incidensek jelentése

**Teszt:**
- Képzés végén kvíz (80% szükséges)
- Phishing szimuláció negyedévente

### 12.2 Elfogadható Használati Politika (AUP)

**Tiltott tevékenységek:**
- Jelszó megosztása
- Jogosulatlan szoftver telepítése
- Céges adatok személyes eszközökre másolása (DLP engedély nélkül)
- Biztonsági kontrollok megkerülése

**Következmények:**
- Első alkalom: Figyelmeztetés
- Ismételt: Fegyelmi
- Súlyos: Azonnali felmondás + jogi lépések

---

## 13. Compliance és Auditálás

### 13.1 Szabályozási Megfelelés

- **GDPR** - Adatvédelem
- **Számviteli törvény** - Adatmegőrzés 8 év
- **eIDAS** - Elektronikus aláírások (ha használt)
- **NIS irányelv** - Hálózati és információs rendszerek biztonsága

### 13.2 Audit

**Belső audit:** Évente  
**Külső audit:** Kétévente  
**Penetration test:** Évente

**Audit Scope:**
- Hozzáférés-kezelés
- Naplózás hatékonysága
- Backup & DR tesztek
- Változtatáskezelés
- Patch management

---

## 14. Változtatáskezelés (Change Management)

### 14.1 Változtatási Folyamat

1. **Kérelem:** Change Request benyújtása
2. **Értékelés:** Kockázatelemzés, hatásvizsgálat
3. **Jóváhagyás:** Change Advisory Board (CAB)
4. **Implementáció:** Tervezett időpontban
5. **Ellenőrzés:** Post-implementation review
6. **Dokumentálás:** Konfigurációs adatbázis frissítése

**Emergency Changes:**
- Kritikus biztonsági javítások
- Gyorsított jóváhagyási folyamat
- Post-change review kötelező

---

## 15. Felelősségek

| Szerepkör | Felelősség |
|-----------|------------|
| **CISO (Chief Information Security Officer)** | Teljes IT biztonság felügyelete |
| **IT Manager** | Napi biztonsági műveletek |
| **System Administrators** | Rendszerek karbantartása, patching |
| **Developers** | Secure coding practices |
| **Minden felhasználó** | Szabályzat betartása, incidensek jelentése |

---

## 16. Szankciók és Kivételek

### 16.1 Szabálysértések

- Írásb eli figyelmeztetés
- Jogosultságok visszavonása
- Fegyelmi eljárás
- Jogi lépések

### 16.2 Kivételkezelés

Kivétel kérvényezhető megalapozott indokkal:
- Risk Assessment szükséges
- CISO jóváhagyása
- Határozott időre (max 90 nap)
- Kompenzáló kontrollok

---

## 17. Kapcsolattartás

**IT Security Team:**
- Email: security@auditinstitute.hu
- Incidens bejelentés: security-incident@auditinstitute.hu
- Telefon: +36 1 234 5678 (7×24)

**Sürgős biztonsági incidens:**
- Riasztás: **AZONNAL** hívja az IT biztonsági ügyeletet

---

**Jóváhagyva:** Audit Institute Vezetősége  
**Következő felülvizsgálat:** 2026. november 6.  
**Verzió:** 1.0
