# Verziókezelési és Karbantartási Stratégia
## Mbit ERP Rendszer

**Verzió:** 1.0  
**Dátum:** 2025. november 6.

---

## 1. Verziókezelési Séma

### 1.1 Semantic Versioning

A rendszer a **Semantic Versioning 2.0.0** szabványt követi:

```
MAJOR.MINOR.PATCH
```

**Példa:** 1.2.3

- **MAJOR** (1): Visszafelé nem kompatibilis változások
- **MINOR** (2): Új funkciók, visszafelé kompatibilis
- **PATCH** (3): Hibajavítások, visszafelé kompatibilis

### 1.2 Verziószámok Jelentése

| Verzió | Típus | Leírás | Gyakoriság |
|--------|-------|--------|------------|
| **X.0.0** | Major | Architektúra változás, API breaking changes | 12-18 hónaponként |
| **1.X.0** | Minor | Új funkciók, fejlesztések | 2-3 hónaponként |
| **1.2.X** | Patch | Hibajavítások, biztonsági frissítések | Szükség szerint |

### 1.3 Pre-release Verziók

**Alpha:** 1.3.0-alpha.1
- Belső teszteléshez
- Nem stabil

**Beta:** 1.3.0-beta.1  
- Külső teszteléshez
- Feature complete, bugok lehetségesek

**Release Candidate:** 1.3.0-rc.1
- Végleges teszt
- Production-ready candidate

---

## 2. Release Ciklus

### 2.1 Release Schedule

**Regular Releases:**
- **Minor Release:** Negyedévente (március, június, szeptember, december)
- **Patch Release:** Szükség szerint (általában havi)
- **Security Patch:** Azonnal (kritikus sebezhetőségek esetén)

**Long Term Support (LTS):**
- Minden 4. minor release (évente 1x)
- Támogatási időszak: 2 év
- Biztonsági frissítések: +1 év

### 2.2 Release Folyamat

```
Fejlesztés → Testing → Staging → Production
    ↓          ↓          ↓           ↓
  Feature   QA Test   UAT Test   Release
  Branch    (2 hét)   (1 hét)    (Go-Live)
```

**Timeline:**
1. **Feature Freeze:** Release előtt 3 héttel
2. **Code Freeze:** Release előtt 1 héttel
3. **Release Candidate:** Release előtt 3 nappal
4. **Go-Live:** Tervezett release dátum

---

## 3. Kód Verziókezelés (Git)

### 3.1 Branch Stratégia (Git Flow)

```
main (production)
  ├── develop
  │    ├── feature/crm-kedvezmeny
  │    ├── feature/dms-ocr-javitas
  │    └── feature/logisztika-arlista
  ├── release/1.3.0
  └── hotfix/1.2.1-security-patch
```

**Branch Típusok:**

| Branch | Leírás | Elnevezés |
|--------|--------|-----------|
| `main` | Production kód | main |
| `develop` | Fejlesztési ág | develop |
| `feature/*` | Új funkciók | feature/modul-funkcio |
| `release/*` | Release előkészítés | release/1.3.0 |
| `hotfix/*` | Sürgős javítások | hotfix/1.2.1-leiras |

### 3.2 Commit Messages

**Formátum:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Típusok:**
- `feat`: Új funkció
- `fix`: Hibajavítás
- `docs`: Dokumentáció
- `style`: Formázás
- `refactor`: Kód átszervezés
- `test`: Tesztek
- `chore`: Egyéb (build, stb.)

**Példa:**
```
feat(crm): mennyiségi kedvezmény kezelés hozzáadva

Új funkció amely lehetővé teszi mennyiségi alapú kedvezmények
beállítását az ajánlatokban.

Refs: #123
```

### 3.3 Merge Politika

- **Feature → Develop:** Squash merge + code review
- **Develop → Release:** Merge commit
- **Release → Main:** Merge commit + tag
- **Hotfix → Main és Develop:** Merge commit

**Code Review:**
- Minimum 1 jóváhagyás szükséges
- Automated tests must pass
- No merge conflicts

---

## 4. Változtatáskezelés (Change Management)

### 4.1 RFC (Request for Change)

**Kisebb változások:**
- Developer döntés
- Code review
- Deploy

**Közepes változások:**
- RFC dokumentum
- Tech lead jóváhagyás
- Testing + review

**Nagyobb változások:**
- RFC + Architecture Decision Record (ADR)
- CAB (Change Advisory Board) meeting
- Stakeholder buy-in
- Átfogó tesztelés

### 4.2 Breaking Changes

**Kommunikáció:**
1. **Deprecation Notice:** 2 verzióval korábban
2. **Migration Guide:** Release notes-ban
3. **Backward Compatibility:** Átmeneti időszakban
4. **Final Removal:** Major verzióban

**Példa:**
```
v1.2.0: Funkció X deprecated (figyelmeztetés)
v1.3.0: Funkció X deprecated (részletes útmutató)
v2.0.0: Funkció X eltávolítva, új API használata kötelező
```

---

## 5. Tesztelési Stratégia

### 5.1 Tesztszintek

| Szint | Eszköz | Lefedettség cél | Gyakoriság |
|-------|--------|-----------------|------------|
| **Unit Tests** | Vitest/Jest | 80% | Minden commit |
| **Integration Tests** | Vitest | 60% | Pull request |
| **E2E Tests** | Playwright | Kritikus utak | Release előtt |
| **Manual Tests** | Test Cases | UAT | Release előtt |
| **Performance Tests** | k6 | Baseline | Major/Minor release |
| **Security Tests** | OWASP ZAP | Top 10 | Quarterly |

### 5.2 CI/CD Pipeline

```yaml
stages:
  - lint
  - test
  - build
  - deploy

lint:
  - ESLint
  - Prettier
  - TypeScript check

test:
  - Unit tests
  - Integration tests
  - Code coverage

build:
  - TypeScript compile
  - Bundle apps
  - Build Docker images

deploy:
  - Staging (auto)
  - Production (manual approval)
```

---

## 6. Dokumentáció Verziókezelés

### 6.1 Dokumentáció Típusok

**Kód Dokumentáció:**
- Inline comments
- TSDoc/JSDoc
- API Documentation (OpenAPI/Swagger)

**Felhasználói Dokumentáció:**
- Verzióhoz kötött (1.2 docs, 1.3 docs)
- Change log highlighting
- Migration guides

**Technikai Dokumentáció:**
- Architecture Decision Records (ADR)
- API changelog
- Database schema history

### 6.2 Changelog

**Formátum (Keep a Changelog):**

```markdown
# Changelog

## [1.3.0] - 2025-12-15

### Added
- CRM: Mennyiségi kedvezmény rendszer
- DMS: Batch OCR feldolgozás
- Logisztika: Árlista import CSV-ből

### Changed
- Gyorsabb keresés DMS-ben (index optimalizálás)
- UI frissítés: modern designrendszer

### Fixed
- CRM ajánlat duplikálási hiba
- DMS iktatószám generálás átfedés

### Security
- Frissített JWT library (CVE-2024-XXXX)

## [1.2.1] - 2025-11-20

### Fixed
- Kritikus: Jogosultság ellenőrzés hiánya (#234)

### Security
- Patch: SQL injection védelem (#235)
```

---

## 7. Dependency Management

### 7.1 Frissítési Politika

**Production Dependencies:**
- **Security patches:** Azonnal
- **Minor updates:** Havonta (tesztelés után)
- **Major updates:** Negyedévente (alapos tesztelés)

**Dev Dependencies:**
- Rugalmasabb schedule
- Breaking changes figyelése

### 7.2 Deprecated Dependencies

**Monitoring:**
- npm audit / Dependabot
- Ismert sebezhetőségek figyelése
- EOL (End of Life) tracking

**Csere Stratégia:**
1. Alternatíva keresése
2. Migration plan készítése
3. Fokozatos átállás
4. Tesztelés
5. Old dependency eltávolítása

---

## 8. Karbantartási Ablak

### 8.1 Tervezett Karbantartás

**Standard Ablak:**
- **Időpont:** Vasárnap 02:00 - 06:00 (magyar idő)
- **Gyakoriság:** Havonta (2. vasárnap)
- **Értesítés:** 7 nappal korábban

**Emergency Maintenance:**
- Kritikus biztonsági hibák
- Production leállás
- Minimális értesítési idő (1-4 óra)

### 8.2 Zero-Downtime Deployment

**Stratégiák:**
- Blue-Green Deployment
- Rolling Updates
- Feature Flags (Canary Release)

**Database Migrations:**
- Backward compatible changes először
- Adatmigrációk előre/hátra kompatibilisek
- Rollback terv

---

## 9. Support Lifecycle

### 9.1 Támogatási Fázisok

| Verzió | Fázis | Időtartam | Támogatás |
|--------|-------|-----------|-----------|
| **1.3.x** | Active | 6 hónap | Teljes support + új funkciók |
| **1.2.x (LTS)** | Maintenance | 24 hónap | Bugfix + security |
| **1.1.x** | End of Life | - | Nincs |

**LTS Verzió Támogatás:**
- Regular support: 2 év
- Extended security support: +1 év (opcionális)

### 9.2 Upgrade Path

**Ajánlott Útvonal:**
```
1.0.x → 1.2.x (LTS) → 2.0.x (következő LTS)
```

**Nem támogatott:**
- 1.0.x → 2.0.x (major skip)
- Patch szint ugrálás (mindig legfrissebb patch)

---

## 10. Rollback Stratégia

### 10.1 Rollback Trigger

**Automatikus rollback:**
- Health check fail
- Error rate >5%
- Performance degradation >50%

**Manuális rollback:**
- Kritikus funkció hiba
- Data integrity issue
- Business impact

### 10.2 Rollback Folyamat

1. **Azonosítás:** Problem detection
2. **Döntés:** Rollback vs. hotfix
3. **Végrehajtás:** Automated rollback script
4. **Verificat ion:** Health checks
5. **Post-Mortem:** Root cause analysis

**Rollback SLA:** 30 perc

---

## 11. Kommunikáció

### 11.1 Release Notes

**Tartalmaznia kell:**
- Új funkciók (user-facing)
- Hibajavítások
- Breaking changes + migration guide
- Biztonsági frissítések
- Ismert problémák
- Upgrade instructions

**Csatornák:**
- Email felhasználóknak
- In-app notification
- Website changelog
- Release blog post

### 11.2 Verzió Status Page

**Elérhető információk:**
- Aktuális production verzió
- Támogatott verziók listája
- EOL dátumok
- Security advisories
- Planned maintenance

---

## 12. Metrics & KPIs

### 12.1 Release Metrics

- **Deployment Frequency:** Havi/negyedéves
- **Lead Time:** Commit → Production (cél: <2 hét)
- **Mean Time to Recovery (MTTR):** <30 perc
- **Change Failure Rate:** <5%

### 12.2 Quality Metrics

- **Code Coverage:** >80%
- **Bug Escape Rate:** Bugs in production / Total bugs
- **Customer Satisfaction:** NPS score verzió után

---

## 13. Tools & Automation

### 13.1 Eszközök

- **Version Control:** Git + GitHub/GitLab
- **CI/CD:** GitHub Actions / GitLab CI
- **Dependency Scanning:** Dependabot, Snyk
- **Release Management:** Semantic Release
- **Changelog:** conventional-changelog
- **Documentation:** Docusaurus, Swagger

### 13.2 Automatizációk

```yaml
# Automated Tasks
- Dependency updates (weekly)
- Security scanning (daily)
- Changelog generation (release)
- Version tagging (release)
- Deploy to staging (auto)
- Deploy to production (approval)
```

---

## 14. Compliance és Audit

### 14.1 Auditálható Elemek

- Minden kódváltozás Git-ben
- Release approval nyomon követhető
- Deployment history
- Rollback események
- Change requests dokumentálva

### 14.2 Retention

- **Git History:** Végtelen
- **Build Artifacts:** 6 hónap
- **Logs:** 1-7 év (típustól függően)
- **Documentation:** Verzióhoz kötve

---

## 15. Continuous Improvement

### 15.1 Retrospektív

**Minden release után:**
- Mi ment jól?
- Mi okozott problémát?
- Hogyan javíthatunk?
- Action items

### 15.2 Process Updates

- **Review:** Negyedévente
- **Major Changes:** Évente
- **Documentation:** Folyamatosan

---

**Jóváhagyva:** Mbit CTO  
**Következő felülvizsgálat:** 2026. május 6.  
**Verzió:** 1.0
