-- CreateTable
CREATE TABLE "felhasznalok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nev" TEXT NOT NULL,
    "aktiv" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "szerepkorok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nev" TEXT NOT NULL,
    "leiras" TEXT,
    "permissions" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "jogosultsagok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kod" TEXT NOT NULL,
    "nev" TEXT NOT NULL,
    "modulo" TEXT NOT NULL,
    "leiras" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "szerepkor_jogosultsagok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "szerepkor_jogosultsagok_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "szerepkorok" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "szerepkor_jogosultsagok_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "jogosultsagok" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "felhasznalo_szerepkorok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "felhasznalo_szerepkorok_userId_fkey" FOREIGN KEY ("userId") REFERENCES "felhasznalok" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "felhasznalo_szerepkorok_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "szerepkorok" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "felhasznalok" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "audit_naplo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "esemeny" TEXT NOT NULL,
    "entitas" TEXT NOT NULL,
    "entitasId" TEXT,
    "regi" TEXT,
    "uj" TEXT,
    "ipCim" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_naplo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "felhasznalok" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ugyfelek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "azonosito" TEXT NOT NULL,
    "nev" TEXT NOT NULL,
    "tipus" TEXT NOT NULL,
    "adoszam" TEXT,
    "cim" TEXT,
    "email" TEXT,
    "telefon" TEXT,
    "megjegyzesek" TEXT,
    "aktiv" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT,
    CONSTRAINT "ugyfelek_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "felhasznalok" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ugyfel_egyedi_mezo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "kulcs" TEXT NOT NULL,
    "ertek" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ugyfel_egyedi_mezo_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ugyfelek" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "kapcsolattartok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "nev" TEXT NOT NULL,
    "email" TEXT,
    "telefon" TEXT,
    "pozicio" TEXT,
    "elsodleges" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "kapcsolattartok_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ugyfelek" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "kampanyok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nev" TEXT NOT NULL,
    "leiras" TEXT,
    "tipus" TEXT NOT NULL,
    "allapot" TEXT NOT NULL,
    "kezdetDatum" DATETIME NOT NULL,
    "befejezesDatum" DATETIME,
    "koltsegvetes" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT,
    CONSTRAINT "kampanyok_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "felhasznalok" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "kampany_ugyfel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "visszajelzes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "kampany_ugyfel_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "kampanyok" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "kampany_ugyfel_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ugyfelek" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "leadek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT,
    "campaignId" TEXT,
    "forras" TEXT NOT NULL,
    "allapot" TEXT NOT NULL,
    "minositesScore" INTEGER,
    "megjegyzesek" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT,
    CONSTRAINT "leadek_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ugyfelek" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "leadek_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "kampanyok" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "leadek_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "felhasznalok" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "lehetosegek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "leadId" TEXT,
    "nev" TEXT NOT NULL,
    "szakasz" TEXT NOT NULL,
    "ertek" REAL NOT NULL,
    "valoszinuseg" INTEGER NOT NULL,
    "zarvasDatum" DATETIME,
    "lezartDatum" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "lehetosegek_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ugyfelek" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "lehetosegek_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leadek" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ajanlatok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "opportunityId" TEXT,
    "azonosito" TEXT NOT NULL,
    "ervenyessegDatum" DATETIME NOT NULL,
    "osszeg" REAL NOT NULL,
    "afa" REAL NOT NULL,
    "vegosszeg" REAL NOT NULL,
    "allapot" TEXT NOT NULL,
    "megjegyzesek" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ajanlatok_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ugyfelek" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ajanlatok_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "lehetosegek" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ajanlat_tetelek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quoteId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "mennyiseg" REAL NOT NULL,
    "egysegAr" REAL NOT NULL,
    "kedvezmeny" REAL NOT NULL DEFAULT 0,
    "osszeg" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ajanlat_tetelek_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "ajanlatok" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ajanlat_tetelek_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "cikkek" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "kedvezmenyek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quoteId" TEXT,
    "orderId" TEXT,
    "tipus" TEXT NOT NULL,
    "ertek" REAL NOT NULL,
    "mennyisegiHatar" REAL,
    "ertekHatar" REAL,
    "kezdetDatum" DATETIME,
    "vegesDatum" DATETIME,
    "leiras" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "kedvezmenyek_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "ajanlatok" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "kedvezmenyek_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "rendelesek" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "rendelesek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "quoteId" TEXT,
    "azonosito" TEXT NOT NULL,
    "rendelesiDatum" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "szallitasiDatum" DATETIME,
    "teljesitesiDatum" DATETIME,
    "osszeg" REAL NOT NULL,
    "afa" REAL NOT NULL,
    "vegosszeg" REAL NOT NULL,
    "allapot" TEXT NOT NULL,
    "megjegyzesek" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "rendelesek_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ugyfelek" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "rendelesek_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "ajanlatok" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "rendeles_tetelek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "mennyiseg" REAL NOT NULL,
    "egysegAr" REAL NOT NULL,
    "kedvezmeny" REAL NOT NULL DEFAULT 0,
    "osszeg" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "rendeles_tetelek_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "rendelesek" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "rendeles_tetelek_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "cikkek" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "szallitasok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "szallitasiCim" TEXT NOT NULL,
    "szallitasiMod" TEXT NOT NULL,
    "szallitasiDatum" DATETIME,
    "allapot" TEXT NOT NULL,
    "megjegyzesek" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "szallitasok_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "rendelesek" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "szamla_meta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "orderId" TEXT,
    "szamlaSzam" TEXT NOT NULL,
    "kiallitasDatum" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "teljesitesDatum" DATETIME NOT NULL,
    "fizetesiHataridoDatum" DATETIME NOT NULL,
    "osszeg" REAL NOT NULL,
    "afa" REAL NOT NULL,
    "vegosszeg" REAL NOT NULL,
    "tipus" TEXT NOT NULL,
    "allapot" TEXT NOT NULL,
    "megjegyzesek" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "szamla_meta_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ugyfelek" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "szamla_meta_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "rendelesek" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cikkek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "azonosito" TEXT NOT NULL,
    "nev" TEXT NOT NULL,
    "leiras" TEXT,
    "itemGroupId" TEXT,
    "egyseg" TEXT NOT NULL,
    "beszerzesiAr" REAL NOT NULL,
    "eladasiAr" REAL NOT NULL,
    "afaKulcs" REAL NOT NULL,
    "aktiv" BOOLEAN NOT NULL DEFAULT true,
    "beszerzesiAdatok" TEXT,
    "suly" REAL,
    "mertekEgyseg" TEXT,
    "vonalkod" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "cikkek_itemGroupId_fkey" FOREIGN KEY ("itemGroupId") REFERENCES "cikkcsoportok" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cikkcsoportok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nev" TEXT NOT NULL,
    "leiras" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "raktarak" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "azonosito" TEXT NOT NULL,
    "nev" TEXT NOT NULL,
    "cim" TEXT,
    "aktiv" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "raktari_helyek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "warehouseId" TEXT NOT NULL,
    "azonosito" TEXT NOT NULL,
    "nev" TEXT NOT NULL,
    "zona" TEXT,
    "folyoso" TEXT,
    "polc" TEXT,
    "tipus" TEXT,
    "aktiv" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "raktari_helyek_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "raktarak" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "keszletszintek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "locationId" TEXT,
    "mennyiseg" REAL NOT NULL DEFAULT 0,
    "minimum" REAL,
    "maximum" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "keszletszintek_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "cikkek" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "keszletszintek_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "raktarak" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "keszletszintek_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "raktari_helyek" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "keszlet_tetelek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "sarzsGyartasiSzam" TEXT,
    "mennyiseg" REAL NOT NULL,
    "minKeszlet" REAL NOT NULL DEFAULT 0,
    "maxKeszlet" REAL,
    "lejarat" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "keszlet_tetelek_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "cikkek" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "keszlet_tetelek_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "raktarak" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "keszlet_mozgasok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "tipus" TEXT NOT NULL,
    "mennyiseg" REAL NOT NULL,
    "referenciaId" TEXT,
    "megjegyzesek" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "keszlet_mozgasok_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "cikkek" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "keszlet_mozgasok_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "raktarak" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "szallitok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nev" TEXT NOT NULL,
    "adoszam" TEXT,
    "cim" TEXT,
    "email" TEXT,
    "telefon" TEXT,
    "aktiv" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "arlistak" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "supplierId" TEXT NOT NULL,
    "nev" TEXT NOT NULL,
    "ervenyessegKezdet" DATETIME NOT NULL,
    "ervenyessegVeg" DATETIME,
    "aktiv" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "arlistak_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "szallitok" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "arlista_tetelek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "priceListId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "ar" REAL NOT NULL,
    "valuta" TEXT NOT NULL DEFAULT 'HUF',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "arlista_tetelek_priceListId_fkey" FOREIGN KEY ("priceListId") REFERENCES "arlistak" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "arlista_tetelek_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "cikkek" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ticketek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT,
    "azonosito" TEXT NOT NULL,
    "targy" TEXT NOT NULL,
    "leiras" TEXT NOT NULL,
    "tipus" TEXT NOT NULL,
    "prioritas" TEXT NOT NULL,
    "allapot" TEXT NOT NULL,
    "eszkalalva" BOOLEAN NOT NULL DEFAULT false,
    "megnyitasDatum" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lezarasDatum" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT,
    "assignedToId" TEXT,
    CONSTRAINT "ticketek_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ugyfelek" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ticketek_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "felhasznalok" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "uzenetek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ticketId" TEXT,
    "felhaszCsak" TEXT,
    "targy" TEXT,
    "szoveg" TEXT NOT NULL,
    "tipus" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "uzenetek_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "ticketek" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "feladatok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cim" TEXT NOT NULL,
    "leiras" TEXT,
    "allapot" TEXT NOT NULL,
    "prioritas" TEXT NOT NULL,
    "hataridoDatum" DATETIME,
    "assignedToId" TEXT,
    "createdById" TEXT,
    "boardId" TEXT,
    "position" INTEGER,
    "tags" TEXT,
    "completedAt" DATETIME,
    "accountId" TEXT,
    "opportunityId" TEXT,
    "leadId" TEXT,
    "quoteId" TEXT,
    "orderId" TEXT,
    "ticketId" TEXT,
    "documentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "feladatok_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "felhasznalok" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "feladatok_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "felhasznalok" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "feladatok_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "task_boardok" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "feladatok_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ugyfelek" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "feladatok_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "lehetosegek" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "feladatok_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leadek" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "feladatok_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "ajanlatok" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "feladatok_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "rendelesek" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "feladatok_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "ticketek" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "feladatok_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "dokumentumok" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "dokumentum_kategoriak" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nev" TEXT NOT NULL,
    "leiras" TEXT,
    "szulo" TEXT,
    "aktiv" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "dokumentum_tipusok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nev" TEXT NOT NULL,
    "leiras" TEXT,
    "kotelezo" BOOLEAN NOT NULL DEFAULT false,
    "ervenyessegKell" BOOLEAN NOT NULL DEFAULT false,
    "jovalagasKell" BOOLEAN NOT NULL DEFAULT false,
    "aktiv" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "dokumentumok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT,
    "categoryId" TEXT,
    "typeId" TEXT,
    "opportunityId" TEXT,
    "quoteId" TEXT,
    "iktatoSzam" TEXT,
    "nev" TEXT NOT NULL,
    "tipus" TEXT NOT NULL,
    "fajlNev" TEXT NOT NULL,
    "fajlMeret" INTEGER NOT NULL,
    "fajlUtvonal" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "tartalom" TEXT,
    "allapot" TEXT NOT NULL,
    "ervenyessegKezdet" DATETIME,
    "ervenyessegVeg" DATETIME,
    "lejarat" DATETIME,
    "felelos" TEXT,
    "megjegyzesek" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT,
    CONSTRAINT "dokumentumok_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ugyfelek" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "dokumentumok_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "dokumentum_kategoriak" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "dokumentumok_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "dokumentum_tipusok" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "dokumentumok_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "lehetosegek" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "dokumentumok_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "ajanlatok" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "dokumentumok_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "felhasznalok" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "dokumentum_verziok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "verzioSzam" INTEGER NOT NULL,
    "fajlUtvonal" TEXT NOT NULL,
    "valtoztatasLeiras" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,
    CONSTRAINT "dokumentum_verziok_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "dokumentumok" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "dokumentum_jogosultsagok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jogosultsag" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "dokumentum_jogosultsagok_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "dokumentumok" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "dokumentum_jogosultsagok_userId_fkey" FOREIGN KEY ("userId") REFERENCES "felhasznalok" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "dokumentum_workflow_naplo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "regiAllapot" TEXT NOT NULL,
    "ujAllapot" TEXT NOT NULL,
    "megjegyzes" TEXT,
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "dokumentum_workflow_naplo_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "dokumentumok" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ocr_feladatok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "allapot" TEXT NOT NULL,
    "eredmeny" TEXT,
    "txtFajlUtvonal" TEXT,
    "pontossag" REAL,
    "nyelv" TEXT NOT NULL DEFAULT 'hun',
    "hibalista" TEXT,
    "feldolgozasKezdet" DATETIME,
    "feldolgozasVeg" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ocr_feladatok_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "dokumentumok" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cimkek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nev" TEXT NOT NULL,
    "szin" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "dokumentum_cimkek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "dokumentum_cimkek_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "dokumentumok" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "dokumentum_cimkek_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "cimkek" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "biztonsagi_mentest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipus" TEXT NOT NULL,
    "allapot" TEXT NOT NULL,
    "fajlUtvonal" TEXT,
    "fajlNev" TEXT,
    "meret" INTEGER,
    "hibaUzenet" TEXT,
    "tartalomManifeszt" TEXT,
    "jellel" BOOLEAN NOT NULL DEFAULT false,
    "inditas" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "befejezes" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "rendszer_beallitasok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kulcs" TEXT NOT NULL,
    "ertek" TEXT NOT NULL,
    "tipus" TEXT NOT NULL,
    "kategoria" TEXT NOT NULL,
    "leiras" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "riport_feladatok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nev" TEXT NOT NULL,
    "tipus" TEXT NOT NULL,
    "parameterek" TEXT,
    "allapot" TEXT NOT NULL,
    "eredmeny" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "export_feladatok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipus" TEXT NOT NULL,
    "formatum" TEXT NOT NULL,
    "parameterek" TEXT,
    "allapot" TEXT NOT NULL,
    "fajlUtvonal" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "tudasbazis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cim" TEXT NOT NULL,
    "tartalom" TEXT NOT NULL,
    "kategoria" TEXT NOT NULL,
    "szulo" TEXT,
    "aktiv" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "beszerzesi_rendelesek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "supplierId" TEXT NOT NULL,
    "azonosito" TEXT NOT NULL,
    "rendelesiDatum" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "szallitasiDatum" DATETIME,
    "osszeg" REAL NOT NULL,
    "afa" REAL NOT NULL,
    "vegosszeg" REAL NOT NULL,
    "allapot" TEXT NOT NULL,
    "megjegyzesek" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "beszerzesi_rendelesek_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "szallitok" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "beszerzesi_rendeles_tetelek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "purchaseOrderId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "mennyiseg" REAL NOT NULL,
    "egysegAr" REAL NOT NULL,
    "osszeg" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "beszerzesi_rendeles_tetelek_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "beszerzesi_rendelesek" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "beszerzesi_rendeles_tetelek_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "cikkek" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "szallitolevelek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "purchaseOrderId" TEXT,
    "shipmentId" TEXT,
    "azonosito" TEXT NOT NULL,
    "tipus" TEXT NOT NULL,
    "kiallitasDatum" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "szallitasiDatum" DATETIME,
    "feladoCim" TEXT,
    "cimzettCim" TEXT,
    "megjegyzesek" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "szallitolevelek_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "beszerzesi_rendelesek" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "szallitolevelek_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "szallitasok" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "task_boardok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nev" TEXT NOT NULL,
    "leiras" TEXT,
    "szin" TEXT,
    "aktiv" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "task_boardok_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "felhasznalok" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "task_oszlopok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardId" TEXT NOT NULL,
    "nev" TEXT NOT NULL,
    "allapot" TEXT NOT NULL,
    "pozicio" INTEGER NOT NULL,
    "limit" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "task_oszlopok_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "task_boardok" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "task_board_tagok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jogosultsag" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "task_board_tagok_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "task_boardok" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "task_board_tagok_userId_fkey" FOREIGN KEY ("userId") REFERENCES "felhasznalok" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "task_kommentek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "szoveg" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "task_kommentek_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "feladatok" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "task_kommentek_userId_fkey" FOREIGN KEY ("userId") REFERENCES "felhasznalok" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "task_tevekenysegek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL,
    "userId" TEXT,
    "tipus" TEXT NOT NULL,
    "leiras" TEXT,
    "regiErtek" TEXT,
    "ujErtek" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "task_tevekenysegek_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "feladatok" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "task_tevekenysegek_userId_fkey" FOREIGN KEY ("userId") REFERENCES "felhasznalok" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "task_mellekletek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL,
    "fajlNev" TEXT NOT NULL,
    "fajlUtvonal" TEXT NOT NULL,
    "fajlMeret" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "task_mellekletek_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "feladatok" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "task_mellekletek_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "felhasznalok" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "task_figyelok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "task_figyelok_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "feladatok" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "task_figyelok_userId_fkey" FOREIGN KEY ("userId") REFERENCES "felhasznalok" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "visszaru" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT,
    "itemId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "mennyiseg" REAL NOT NULL,
    "ok" TEXT NOT NULL,
    "allapot" TEXT NOT NULL DEFAULT 'PENDING',
    "visszaruDatum" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "megjegyzesek" TEXT,
    "createdById" TEXT,
    "approvedById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "visszaru_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "rendelesek" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "visszaru_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "cikkek" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "visszaru_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "raktarak" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "visszaru_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "felhasznalok" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "visszaru_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "felhasznalok" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "aru_szallito" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "beszerzesiAr" REAL,
    "minMennyiseg" REAL,
    "szallitasiIdo" INTEGER,
    "megjegyzesek" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "aru_szallito_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "cikkek" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "aru_szallito_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "szallitok" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "felhasznalok_email_key" ON "felhasznalok"("email");

-- CreateIndex
CREATE UNIQUE INDEX "szerepkorok_nev_key" ON "szerepkorok"("nev");

-- CreateIndex
CREATE UNIQUE INDEX "jogosultsagok_kod_key" ON "jogosultsagok"("kod");

-- CreateIndex
CREATE INDEX "jogosultsagok_modulo_idx" ON "jogosultsagok"("modulo");

-- CreateIndex
CREATE UNIQUE INDEX "szerepkor_jogosultsagok_roleId_permissionId_key" ON "szerepkor_jogosultsagok"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "felhasznalo_szerepkorok_userId_roleId_key" ON "felhasznalo_szerepkorok"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "audit_naplo_entitas_entitasId_idx" ON "audit_naplo"("entitas", "entitasId");

-- CreateIndex
CREATE INDEX "audit_naplo_userId_idx" ON "audit_naplo"("userId");

-- CreateIndex
CREATE INDEX "audit_naplo_createdAt_idx" ON "audit_naplo"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ugyfelek_azonosito_key" ON "ugyfelek"("azonosito");

-- CreateIndex
CREATE INDEX "ugyfelek_ownerId_idx" ON "ugyfelek"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "ugyfel_egyedi_mezo_accountId_kulcs_key" ON "ugyfel_egyedi_mezo"("accountId", "kulcs");

-- CreateIndex
CREATE INDEX "kapcsolattartok_accountId_idx" ON "kapcsolattartok"("accountId");

-- CreateIndex
CREATE INDEX "kampanyok_createdById_idx" ON "kampanyok"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "kampany_ugyfel_campaignId_accountId_key" ON "kampany_ugyfel"("campaignId", "accountId");

-- CreateIndex
CREATE INDEX "leadek_accountId_idx" ON "leadek"("accountId");

-- CreateIndex
CREATE INDEX "leadek_campaignId_idx" ON "leadek"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "lehetosegek_leadId_key" ON "lehetosegek"("leadId");

-- CreateIndex
CREATE INDEX "lehetosegek_accountId_idx" ON "lehetosegek"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "ajanlatok_azonosito_key" ON "ajanlatok"("azonosito");

-- CreateIndex
CREATE INDEX "ajanlatok_accountId_idx" ON "ajanlatok"("accountId");

-- CreateIndex
CREATE INDEX "ajanlatok_opportunityId_idx" ON "ajanlatok"("opportunityId");

-- CreateIndex
CREATE UNIQUE INDEX "rendelesek_quoteId_key" ON "rendelesek"("quoteId");

-- CreateIndex
CREATE UNIQUE INDEX "rendelesek_azonosito_key" ON "rendelesek"("azonosito");

-- CreateIndex
CREATE INDEX "rendelesek_accountId_idx" ON "rendelesek"("accountId");

-- CreateIndex
CREATE INDEX "szallitasok_orderId_idx" ON "szallitasok"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "szamla_meta_orderId_key" ON "szamla_meta"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "szamla_meta_szamlaSzam_key" ON "szamla_meta"("szamlaSzam");

-- CreateIndex
CREATE INDEX "szamla_meta_accountId_idx" ON "szamla_meta"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "cikkek_azonosito_key" ON "cikkek"("azonosito");

-- CreateIndex
CREATE INDEX "cikkek_itemGroupId_idx" ON "cikkek"("itemGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "cikkcsoportok_nev_key" ON "cikkcsoportok"("nev");

-- CreateIndex
CREATE UNIQUE INDEX "raktarak_azonosito_key" ON "raktarak"("azonosito");

-- CreateIndex
CREATE INDEX "raktari_helyek_warehouseId_idx" ON "raktari_helyek"("warehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "raktari_helyek_warehouseId_azonosito_key" ON "raktari_helyek"("warehouseId", "azonosito");

-- CreateIndex
CREATE INDEX "keszletszintek_itemId_idx" ON "keszletszintek"("itemId");

-- CreateIndex
CREATE INDEX "keszletszintek_warehouseId_idx" ON "keszletszintek"("warehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "keszletszintek_itemId_warehouseId_locationId_key" ON "keszletszintek"("itemId", "warehouseId", "locationId");

-- CreateIndex
CREATE INDEX "keszlet_tetelek_itemId_warehouseId_idx" ON "keszlet_tetelek"("itemId", "warehouseId");

-- CreateIndex
CREATE INDEX "keszlet_tetelek_sarzsGyartasiSzam_idx" ON "keszlet_tetelek"("sarzsGyartasiSzam");

-- CreateIndex
CREATE INDEX "keszlet_mozgasok_itemId_idx" ON "keszlet_mozgasok"("itemId");

-- CreateIndex
CREATE INDEX "keszlet_mozgasok_warehouseId_idx" ON "keszlet_mozgasok"("warehouseId");

-- CreateIndex
CREATE INDEX "keszlet_mozgasok_createdAt_idx" ON "keszlet_mozgasok"("createdAt");

-- CreateIndex
CREATE INDEX "arlistak_supplierId_idx" ON "arlistak"("supplierId");

-- CreateIndex
CREATE UNIQUE INDEX "arlista_tetelek_priceListId_itemId_key" ON "arlista_tetelek"("priceListId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "ticketek_azonosito_key" ON "ticketek"("azonosito");

-- CreateIndex
CREATE INDEX "ticketek_accountId_idx" ON "ticketek"("accountId");

-- CreateIndex
CREATE INDEX "ticketek_allapot_idx" ON "ticketek"("allapot");

-- CreateIndex
CREATE INDEX "uzenetek_ticketId_idx" ON "uzenetek"("ticketId");

-- CreateIndex
CREATE INDEX "feladatok_assignedToId_idx" ON "feladatok"("assignedToId");

-- CreateIndex
CREATE INDEX "feladatok_createdById_idx" ON "feladatok"("createdById");

-- CreateIndex
CREATE INDEX "feladatok_boardId_idx" ON "feladatok"("boardId");

-- CreateIndex
CREATE INDEX "feladatok_allapot_idx" ON "feladatok"("allapot");

-- CreateIndex
CREATE INDEX "feladatok_accountId_idx" ON "feladatok"("accountId");

-- CreateIndex
CREATE INDEX "feladatok_opportunityId_idx" ON "feladatok"("opportunityId");

-- CreateIndex
CREATE UNIQUE INDEX "dokumentum_kategoriak_nev_key" ON "dokumentum_kategoriak"("nev");

-- CreateIndex
CREATE UNIQUE INDEX "dokumentum_tipusok_nev_key" ON "dokumentum_tipusok"("nev");

-- CreateIndex
CREATE UNIQUE INDEX "dokumentumok_iktatoSzam_key" ON "dokumentumok"("iktatoSzam");

-- CreateIndex
CREATE INDEX "dokumentumok_accountId_idx" ON "dokumentumok"("accountId");

-- CreateIndex
CREATE INDEX "dokumentumok_categoryId_idx" ON "dokumentumok"("categoryId");

-- CreateIndex
CREATE INDEX "dokumentumok_typeId_idx" ON "dokumentumok"("typeId");

-- CreateIndex
CREATE INDEX "dokumentumok_iktatoSzam_idx" ON "dokumentumok"("iktatoSzam");

-- CreateIndex
CREATE INDEX "dokumentumok_tipus_idx" ON "dokumentumok"("tipus");

-- CreateIndex
CREATE INDEX "dokumentumok_allapot_idx" ON "dokumentumok"("allapot");

-- CreateIndex
CREATE INDEX "dokumentum_verziok_documentId_idx" ON "dokumentum_verziok"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "dokumentum_jogosultsagok_documentId_userId_key" ON "dokumentum_jogosultsagok"("documentId", "userId");

-- CreateIndex
CREATE INDEX "dokumentum_workflow_naplo_documentId_idx" ON "dokumentum_workflow_naplo"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "ocr_feladatok_documentId_key" ON "ocr_feladatok"("documentId");

-- CreateIndex
CREATE INDEX "ocr_feladatok_allapot_idx" ON "ocr_feladatok"("allapot");

-- CreateIndex
CREATE UNIQUE INDEX "cimkek_nev_key" ON "cimkek"("nev");

-- CreateIndex
CREATE UNIQUE INDEX "dokumentum_cimkek_documentId_tagId_key" ON "dokumentum_cimkek"("documentId", "tagId");

-- CreateIndex
CREATE INDEX "biztonsagi_mentest_allapot_idx" ON "biztonsagi_mentest"("allapot");

-- CreateIndex
CREATE INDEX "biztonsagi_mentest_inditas_idx" ON "biztonsagi_mentest"("inditas");

-- CreateIndex
CREATE UNIQUE INDEX "rendszer_beallitasok_kulcs_key" ON "rendszer_beallitasok"("kulcs");

-- CreateIndex
CREATE INDEX "rendszer_beallitasok_kategoria_idx" ON "rendszer_beallitasok"("kategoria");

-- CreateIndex
CREATE INDEX "tudasbazis_kategoria_idx" ON "tudasbazis"("kategoria");

-- CreateIndex
CREATE UNIQUE INDEX "beszerzesi_rendelesek_azonosito_key" ON "beszerzesi_rendelesek"("azonosito");

-- CreateIndex
CREATE INDEX "beszerzesi_rendelesek_supplierId_idx" ON "beszerzesi_rendelesek"("supplierId");

-- CreateIndex
CREATE INDEX "beszerzesi_rendelesek_allapot_idx" ON "beszerzesi_rendelesek"("allapot");

-- CreateIndex
CREATE INDEX "beszerzesi_rendeles_tetelek_purchaseOrderId_idx" ON "beszerzesi_rendeles_tetelek"("purchaseOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "szallitolevelek_azonosito_key" ON "szallitolevelek"("azonosito");

-- CreateIndex
CREATE INDEX "szallitolevelek_purchaseOrderId_idx" ON "szallitolevelek"("purchaseOrderId");

-- CreateIndex
CREATE INDEX "szallitolevelek_shipmentId_idx" ON "szallitolevelek"("shipmentId");

-- CreateIndex
CREATE INDEX "task_boardok_createdById_idx" ON "task_boardok"("createdById");

-- CreateIndex
CREATE INDEX "task_oszlopok_boardId_idx" ON "task_oszlopok"("boardId");

-- CreateIndex
CREATE UNIQUE INDEX "task_oszlopok_boardId_allapot_key" ON "task_oszlopok"("boardId", "allapot");

-- CreateIndex
CREATE UNIQUE INDEX "task_board_tagok_boardId_userId_key" ON "task_board_tagok"("boardId", "userId");

-- CreateIndex
CREATE INDEX "task_kommentek_taskId_idx" ON "task_kommentek"("taskId");

-- CreateIndex
CREATE INDEX "task_tevekenysegek_taskId_idx" ON "task_tevekenysegek"("taskId");

-- CreateIndex
CREATE INDEX "task_tevekenysegek_createdAt_idx" ON "task_tevekenysegek"("createdAt");

-- CreateIndex
CREATE INDEX "task_mellekletek_taskId_idx" ON "task_mellekletek"("taskId");

-- CreateIndex
CREATE UNIQUE INDEX "task_figyelok_taskId_userId_key" ON "task_figyelok"("taskId", "userId");

-- CreateIndex
CREATE INDEX "visszaru_orderId_idx" ON "visszaru"("orderId");

-- CreateIndex
CREATE INDEX "visszaru_itemId_idx" ON "visszaru"("itemId");

-- CreateIndex
CREATE INDEX "visszaru_warehouseId_idx" ON "visszaru"("warehouseId");

-- CreateIndex
CREATE INDEX "visszaru_allapot_idx" ON "visszaru"("allapot");

-- CreateIndex
CREATE INDEX "visszaru_createdAt_idx" ON "visszaru"("createdAt");

-- CreateIndex
CREATE INDEX "aru_szallito_itemId_idx" ON "aru_szallito"("itemId");

-- CreateIndex
CREATE INDEX "aru_szallito_supplierId_idx" ON "aru_szallito"("supplierId");

-- CreateIndex
CREATE INDEX "aru_szallito_isPrimary_idx" ON "aru_szallito"("isPrimary");

-- CreateIndex
CREATE UNIQUE INDEX "aru_szallito_itemId_supplierId_key" ON "aru_szallito"("itemId", "supplierId");
