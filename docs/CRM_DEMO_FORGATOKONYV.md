# CRM demo forgatókönyv (GINOP ellenőrzés)

**Előfeltétel:** `npm run db:seed`, Windows desktop app vagy dev: Electron + backend.

## 1. Belépés adminként

- Email: `admin@mbit.hu`, jelszó: `admin123`

## 2. Ügyfél törzsadat

- Menü: **Ügyfélkezelés → Partnerek**
- Nyisson meg egy ügyfelet (pl. `UGY-001` vagy `UGY-004`)
- Ellenőrizze: azonosító, név, kapcsolattartó, számlázási/szállítási cím mezők

## 3. Kampány – célközönség és export

- **Partnerek** → **Kampányok** fül
- Válasszon kampányt → célközönség (API: audience/select már seedelt)
- Export: `GET /crm/campaigns/{id}/audience/export/csv` vagy excel (UI-ból kampány lista)

## 4. Kampány visszajelzés

- Kampány részleteknél / seed: „pozitiv - érdeklődik” visszajelzések
- Riport: `GET /crm/campaigns/report/results`

## 5. Lead → opportunity → quote

- **Lehetőségek** – demo leadek és opportunity-k
- **Árajánlatok** – új vagy meglévő `AJ-2025-D*` ajánlat

## 6. Quote → order → shipment → invoice stub

- **Árajánlatok**: jóváhagyott sor → **→ Rendelés**
- **Rendelések**: **📦** Szállítás, **🧾** Számla-meta gombok
- Ellenőrizze: tétel/ár öröklődik, nincs újrabeírás

## 7. Kedvezménystruktúra

- **Kedvezmények** menü – 4 típusú szabály listája

## 8. Ügyfél élettörténet

- **Partnerek** → **Élettörténet** gomb egy ügyfélnél
- Timeline: interakciók, üzenetek, ticketek

## 9. Reklamáció eszkaláció

- **Reklamációk** fül → **Eszkalálás** (nem eszkalált ticketen)
- Eszkalált ticket: piros **ESZKALÁLT** jelzés

## 10. Front office – email és chat

- Seed: `Message` EMAIL és CHAT csatornával
- Élettörténetben megjelennek
- Új: `POST /crm/messages` body: `{ accountId, channel: "EMAIL"|"CHAT", szoveg, targy }`

## 11. Audit napló

- **Audit napló** menü – utolsó CRM műveletek (create, generate, export, import)

## Sales felhasználó (opcionális)

- `sales@mbit.hu` / `sales123` – operatív CRM, korlátozott rendszerbeállítás
