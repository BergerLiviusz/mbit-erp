import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Permission, PermissionDescriptions } from '../src/common/rbac/permission.enum';

const prisma = new PrismaClient();

async function seedPermissions() {
  console.log('🔑 Jogosultságok létrehozása...');
  
  const permissionEntries = Object.entries(Permission).map(([key, value]) => ({
    kod: value,
    ...PermissionDescriptions[value as Permission],
  }));

  for (const perm of permissionEntries) {
    await prisma.permission.upsert({
      where: { kod: perm.kod },
      update: {
        nev: perm.nev,
        modulo: perm.modulo,
        leiras: perm.leiras,
      },
      create: perm,
    });
  }

  console.log(`✅ ${permissionEntries.length} jogosultság létrehozva`);
  return await prisma.permission.findMany();
}

async function seedSystemSettings() {
  console.log('⚙️ Rendszerbeállítások inicializálása...');
  
  const settings = [
    { kulcs: 'organization.name', ertek: 'MB-IT Kft.', tipus: 'string', kategoria: 'organization', leiras: 'Szervezet neve' },
    { kulcs: 'organization.address', ertek: '', tipus: 'string', kategoria: 'organization', leiras: 'Szervezet címe' },
    { kulcs: 'organization.tax_number', ertek: '', tipus: 'string', kategoria: 'organization', leiras: 'Adószám' },
    { kulcs: 'organization.email', ertek: 'admin@mbit.hu', tipus: 'string', kategoria: 'organization', leiras: 'Kapcsolattartói email' },
    { kulcs: 'organization.phone', ertek: '', tipus: 'string', kategoria: 'organization', leiras: 'Telefonszám' },
    { kulcs: 'numbering.quote.pattern', ertek: 'AJ-{YYYY}-{####}', tipus: 'string', kategoria: 'numbering', leiras: 'Árajánlat számozási minta' },
    { kulcs: 'numbering.order.pattern', ertek: 'R-{YYYY}-{####}', tipus: 'string', kategoria: 'numbering', leiras: 'Rendelés számozási minta' },
    { kulcs: 'numbering.document.pattern', ertek: 'MBIT/{YYYY}/{####}', tipus: 'string', kategoria: 'numbering', leiras: 'Dokumentum iktatószám minta' },
    { kulcs: 'numbering.purchase_order.pattern', ertek: 'BR-{YYYY}-{####}', tipus: 'string', kategoria: 'numbering', leiras: 'Beszerzési rendelés számozási minta' },
    { kulcs: 'numbering.delivery_note.pattern', ertek: 'SZL-{YYYY}-{####}', tipus: 'string', kategoria: 'numbering', leiras: 'Szállítólevél számozási minta' },
    { kulcs: 'backup.daily.enabled', ertek: 'false', tipus: 'boolean', kategoria: 'backup', leiras: 'Napi mentés engedélyezése' },
    { kulcs: 'backup.daily.schedule', ertek: '0 2 * * *', tipus: 'string', kategoria: 'backup', leiras: 'Napi mentés időpontja (cron)' },
    { kulcs: 'backup.weekly.enabled', ertek: 'false', tipus: 'boolean', kategoria: 'backup', leiras: 'Heti mentés engedélyezése' },
    { kulcs: 'backup.weekly.schedule', ertek: '0 3 * * 0', tipus: 'string', kategoria: 'backup', leiras: 'Heti mentés időpontja (cron)' },
    { kulcs: 'backup.retention.count', ertek: '10', tipus: 'number', kategoria: 'backup', leiras: 'Megőrzendő mentések száma' },
    { kulcs: 'quote.approval.threshold', ertek: '1000000', tipus: 'number', kategoria: 'crm', leiras: 'Árajánlat jóváhagyási küszöb (HUF)' },
    { kulcs: 'dms.ocr.enabled', ertek: 'false', tipus: 'boolean', kategoria: 'dms', leiras: 'OCR szövegfelismerés engedélyezése' },
    { kulcs: 'dms.default_retention_years', ertek: '7', tipus: 'number', kategoria: 'dms', leiras: 'Alapértelmezett megőrzési idő (év)' },
    { kulcs: 'dms.auto_archive_enabled', ertek: 'true', tipus: 'boolean', kategoria: 'dms', leiras: 'Automatikus archiválás engedélyezése' },
    { kulcs: 'logistics.low_stock_threshold', ertek: '10', tipus: 'number', kategoria: 'logistics', leiras: 'Alacsony készlet riasztási küszöb (%)' },
    { kulcs: 'logistics.valuation_method', ertek: 'FIFO', tipus: 'string', kategoria: 'logistics', leiras: 'Készlet értékelési módszer (FIFO/AVG)' },
    { kulcs: 'logistics.auto_location_assign', ertek: 'false', tipus: 'boolean', kategoria: 'logistics', leiras: 'Automatikus raktári hely hozzárendelés' },
    { kulcs: 'purchase_order.approval.threshold', ertek: '500000', tipus: 'number', kategoria: 'logistics', leiras: 'Beszerzési rendelés jóváhagyási küszöb (HUF)' },
    { kulcs: 'system.lan.enabled', ertek: 'false', tipus: 'boolean', kategoria: 'system', leiras: 'LAN együttműködés engedélyezése' },
  ];

  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: { kulcs: setting.kulcs },
      update: setting,
      create: setting,
    });
  }

  console.log(`✅ ${settings.length} rendszerbeállítás inicializálva`);
}

async function main() {
  console.log('🌱 Adatbázis feltöltése kezdődik...');

  const permissions = await seedPermissions();

  const roles = await Promise.all([
    prisma.role.upsert({
      where: { nev: 'Admin' },
      update: {},
      create: {
        nev: 'Admin',
        leiras: 'Rendszergazda - teljes hozzáférés',
        permissions: JSON.stringify(['*']),
      },
    }),
    prisma.role.upsert({
      where: { nev: 'PowerUser' },
      update: {},
      create: {
        nev: 'PowerUser',
        leiras: 'Haladó felhasználó - osztott erőforrások',
        permissions: JSON.stringify(['crm.*', 'dms.*', 'logistics.*']),
      },
    }),
    prisma.role.upsert({
      where: { nev: 'User' },
      update: {},
      create: {
        nev: 'User',
        leiras: 'Felhasználó - saját hozzáférések',
        permissions: JSON.stringify(['crm.read', 'dms.read']),
      },
    }),
    prisma.role.upsert({
      where: { nev: 'Auditor' },
      update: {},
      create: {
        nev: 'Auditor',
        leiras: 'Auditor - csak olvasás és export',
        permissions: JSON.stringify(['*.read', '*.export']),
      },
    }),
  ]);

  console.log('✅ Szerepkörök létrehozva');

  const adminPermissions = permissions.filter(p => 
    p.modulo === 'CRM' || p.modulo === 'DMS' || p.modulo === 'Logisztika' || 
    p.modulo === 'Rendszer' || p.modulo === 'Felhasználók' || p.modulo === 'Szerepkörök' ||
    p.modulo === 'Jelentések'
  );
  
  for (const perm of adminPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: roles[0].id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: roles[0].id,
        permissionId: perm.id,
      },
    });
  }

  console.log('✅ Admin szerepkörhöz jogosultságok hozzárendelve');

  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@mbit.hu' },
    update: {},
    create: {
      email: 'admin@mbit.hu',
      password: hashedPassword,
      nev: 'Rendszergazda',
      aktiv: true,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: roles[0].id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: roles[0].id,
    },
  });

  console.log('✅ Admin felhasználó létrehozva (admin@mbit.hu / admin123)');

  const accounts = await Promise.all([
    prisma.account.create({
      data: {
        azonosito: 'UGY-001',
        nev: 'Kovács és Társa Kft.',
        tipus: 'vevo',
        adoszam: '12345678-2-42',
        cim: '1055 Budapest, Kossuth Lajos tér 1.',
        email: 'info@kovacs.hu',
        telefon: '+36 1 234 5678',
        ownerId: adminUser.id,
        contacts: {
          create: [
            {
              nev: 'Kovács János',
              email: 'janos@kovacs.hu',
              telefon: '+36 30 123 4567',
              pozicio: 'Ügyvezető',
              elsodleges: true,
            },
          ],
        },
      },
    }),
    prisma.account.create({
      data: {
        azonosito: 'UGY-002',
        nev: 'Magyar Építők Zrt.',
        tipus: 'vevo',
        adoszam: '87654321-2-41',
        cim: '1027 Budapest, Fő utca 50.',
        email: 'kapcsolat@epitok.hu',
        telefon: '+36 1 987 6543',
        ownerId: adminUser.id,
        contacts: {
          create: [
            {
              nev: 'Nagy Éva',
              email: 'eva.nagy@epitok.hu',
              telefon: '+36 30 987 6543',
              pozicio: 'Beszerzési vezető',
              elsodleges: true,
            },
          ],
        },
      },
    }),
    prisma.account.create({
      data: {
        azonosito: 'UGY-003',
        nev: 'TechSoft Hungary Kft.',
        tipus: 'vevo',
        adoszam: '11223344-2-43',
        cim: '1132 Budapest, Váci út 76.',
        email: 'info@techsoft.hu',
        telefon: '+36 1 456 7890',
        ownerId: adminUser.id,
      },
    }),
  ]);

  console.log('✅ Ügyfelek létrehozva');

  const itemGroup = await prisma.itemGroup.create({
    data: {
      nev: 'Irodaszerek',
      leiras: 'Általános irodai kellékek',
    },
  });

  const items = await Promise.all([
    prisma.item.create({
      data: {
        azonosito: 'CIKK-001',
        nev: 'A4 fénymásoló papír (500 lap)',
        itemGroupId: itemGroup.id,
        egyseg: 'csomag',
        beszerzesiAr: 1200,
        eladasiAr: 1500,
        afaKulcs: 27,
        aktiv: true,
      },
    }),
    prisma.item.create({
      data: {
        azonosito: 'CIKK-002',
        nev: 'Golyóstoll, kék',
        itemGroupId: itemGroup.id,
        egyseg: 'darab',
        beszerzesiAr: 50,
        eladasiAr: 80,
        afaKulcs: 27,
        aktiv: true,
      },
    }),
    prisma.item.create({
      data: {
        azonosito: 'CIKK-003',
        nev: 'Jelölőcímke, vegyes színek',
        itemGroupId: itemGroup.id,
        egyseg: 'csomag',
        beszerzesiAr: 300,
        eladasiAr: 450,
        afaKulcs: 27,
        aktiv: true,
      },
    }),
  ]);

  console.log('✅ Cikkek létrehozva');

  const warehouses = await Promise.all([
    prisma.warehouse.create({
      data: {
        azonosito: 'RAK-01',
        nev: 'Központi raktár',
        cim: '1239 Budapest, Fő út 120.',
        aktiv: true,
      },
    }),
    prisma.warehouse.create({
      data: {
        azonosito: 'RAK-02',
        nev: 'Regionális raktár - Debrecen',
        cim: '4032 Debrecen, Ipari út 45.',
        aktiv: true,
      },
    }),
  ]);

  console.log('✅ Raktárak létrehozva');

  for (const item of items) {
    await prisma.stockLot.create({
      data: {
        itemId: item.id,
        warehouseId: warehouses[0].id,
        mennyiseg: Math.floor(Math.random() * 100) + 50,
        minKeszlet: 10,
        maxKeszlet: 200,
      },
    });
  }

  console.log('✅ Készletek létrehozva');

  const supplier = await prisma.supplier.create({
    data: {
      nev: 'Országos Papír Nagyker Kft.',
      adoszam: '99887766-2-44',
      cim: '1117 Budapest, Neumann János u. 1.',
      email: 'rendeles@papir.hu',
      telefon: '+36 1 222 3333',
      aktiv: true,
    },
  });

  const priceList = await prisma.priceList.create({
    data: {
      supplierId: supplier.id,
      nev: '2025 Q1 Árlista',
      ervenyessegKezdet: new Date('2025-01-01'),
      ervenyessegVeg: new Date('2025-03-31'),
      aktiv: true,
      items: {
        create: items.map(item => ({
          itemId: item.id,
          ar: item.beszerzesiAr * 0.9,
          valuta: 'HUF',
        })),
      },
    },
  });

  console.log('✅ Szállító és árlista létrehozva');

  const campaign = await prisma.campaign.create({
    data: {
      nev: 'Tavaszi promóció 2025',
      leiras: 'Irodaszer kedvezmények üzleti ügyfeleinknek',
      tipus: 'email',
      allapot: 'aktiv',
      kezdetDatum: new Date('2025-03-01'),
      befejezesDatum: new Date('2025-03-31'),
      koltsegvetes: 500000,
      createdById: adminUser.id,
    },
  });

  console.log('✅ Kampány létrehozva');

  const documents = await Promise.all([
    prisma.document.create({
      data: {
        accountId: accounts[0].id,
        iktatoSzam: 'IK-2025-000001',
        nev: 'Szerződés - Kovács és Társa',
        tipus: 'szerzodes',
        fajlNev: 'kovacs_szerzodes_2025.pdf',
        fajlMeret: 245678,
        fajlUtvonal: '/uploads/documents/kovacs_szerzodes_2025.pdf',
        mimeType: 'application/pdf',
        allapot: 'aktiv',
        ervenyessegKezdet: new Date('2025-01-01'),
        ervenyessegVeg: new Date('2025-12-31'),
        felelos: adminUser.nev,
        createdById: adminUser.id,
      },
    }),
    prisma.document.create({
      data: {
        accountId: accounts[1].id,
        iktatoSzam: 'IK-2025-000002',
        nev: 'Ajánlatkérés - Magyar Építők',
        tipus: 'ajanlat',
        fajlNev: 'epitok_ajanlat_2025.pdf',
        fajlMeret: 189234,
        fajlUtvonal: '/uploads/documents/epitok_ajanlat_2025.pdf',
        mimeType: 'application/pdf',
        allapot: 'folyamatban',
        createdById: adminUser.id,
      },
    }),
  ]);

  console.log('✅ Dokumentumok létrehozva');

  await prisma.ticket.create({
    data: {
      accountId: accounts[0].id,
      azonosito: 'T-2025-00001',
      targy: 'Szállítási késedelem',
      leiras: 'A megrendelt irodaszerek nem érkeztek meg a megadott határidőre.',
      tipus: 'reklamacio',
      prioritas: 'magas',
      allapot: 'nyitott',
      createdById: adminUser.id,
    },
  });

  console.log('✅ Ticket létrehozva');

  const opportunities = await Promise.all([
    prisma.opportunity.create({
      data: {
        accountId: accounts[0].id,
        nev: 'Irodaszerek éves szerződés megújítása',
        szakasz: 'targyalas',
        ertek: 15000000,
        valoszinuseg: 70,
        zarvasDatum: new Date('2025-12-31'),
      },
    }),
    prisma.opportunity.create({
      data: {
        accountId: accounts[1].id,
        nev: 'IT infrastruktúra bővítés',
        szakasz: 'ajanlatadas',
        ertek: 25000000,
        valoszinuseg: 50,
        zarvasDatum: new Date('2026-01-15'),
      },
    }),
    prisma.opportunity.create({
      data: {
        accountId: accounts[2].id,
        nev: 'Szoftver licenc csomag',
        szakasz: 'uj',
        ertek: 8000000,
        valoszinuseg: 30,
        zarvasDatum: new Date('2025-11-30'),
      },
    }),
  ]);

  console.log('✅ Lehetőségek létrehozva');

  const items = await prisma.item.findMany({ take: 3 });

  if (items.length > 0) {
    await prisma.quote.create({
      data: {
        accountId: accounts[0].id,
        opportunityId: opportunities[0].id,
        azonosito: 'AJ-2025-0001',
        ervenyessegDatum: new Date('2025-12-31'),
        osszeg: 15000000,
        afa: 4050000,
        vegosszeg: 19050000,
        allapot: 'jovahagyott',
        megjegyzesek: 'Éves szerződés megújítása kedvezményes feltételekkel',
        items: {
          create: [
            {
              itemId: items[0].id,
              mennyiseg: 500,
              egysegAr: 30000,
              kedvezmeny: 0,
              osszeg: 15000000,
            },
          ],
        },
      },
    });

    console.log('✅ Árajánlatok létrehozva');
  }

  const documentCategories = await Promise.all([
    prisma.documentCategory.create({
      data: {
        nev: 'Szerződések',
        leiras: 'Üzleti szerződések és megállapodások',
        aktiv: true,
      },
    }),
    prisma.documentCategory.create({
      data: {
        nev: 'Számlák',
        leiras: 'Bejövő és kimenő számlák',
        aktiv: true,
      },
    }),
    prisma.documentCategory.create({
      data: {
        nev: 'Adminisztratív',
        leiras: 'Hivatalos iratok és adminisztratív dokumentumok',
        aktiv: true,
      },
    }),
  ]);

  console.log('✅ Dokumentum kategóriák létrehozva');

  const documentTypes = await Promise.all([
    prisma.documentType.create({
      data: {
        nev: 'Vállalkozási szerződés',
        leiras: 'Vállalkozási szerződés dokumentum típus',
        kotelezo: true,
        ervenyessegKell: true,
        jovalagasKell: true,
        aktiv: true,
      },
    }),
    prisma.documentType.create({
      data: {
        nev: 'Számla',
        leiras: 'Bejövő vagy kimenő számla',
        kotelezo: false,
        ervenyessegKell: false,
        jovalagasKell: false,
        aktiv: true,
      },
    }),
  ]);

  console.log('✅ Dokumentum típusok létrehozva');

  await Promise.all([
    prisma.document.create({
      data: {
        accountId: accounts[0].id,
        categoryId: documentCategories[0].id,
        typeId: documentTypes[0].id,
        iktatoSzam: 'MBIT/2025/0001',
        nev: 'Irodaszer szállítási szerződés 2025',
        tipus: 'szerzodes',
        fajlNev: 'szerzodes_irodaszer_2025.pdf',
        fajlMeret: 245678,
        fajlUtvonal: '/uploads/documents/szerzodes_irodaszer_2025.pdf',
        mimeType: 'application/pdf',
        allapot: 'approved',
        ervenyessegKezdet: new Date('2025-01-01'),
        ervenyessegVeg: new Date('2025-12-31'),
        createdById: adminUser.id,
      },
    }),
    prisma.document.create({
      data: {
        accountId: accounts[1].id,
        categoryId: documentCategories[1].id,
        typeId: documentTypes[1].id,
        iktatoSzam: 'MBIT/2025/0002',
        nev: 'Beérkező számla - Tech Solutions',
        tipus: 'szamla',
        fajlNev: 'szamla_techsol_202501.pdf',
        fajlMeret: 125000,
        fajlUtvonal: '/uploads/documents/szamla_techsol_202501.pdf',
        mimeType: 'application/pdf',
        allapot: 'registered',
        createdById: adminUser.id,
      },
    }),
  ]);

  console.log('✅ Dokumentumok létrehozva');

  const logisticsWarehouses = await Promise.all([
    prisma.warehouse.create({
      data: {
        azonosito: 'R-01',
        nev: 'Központi raktár',
        cim: '1111 Budapest, Fő utca 1.',
        aktiv: true,
      },
    }),
    prisma.warehouse.create({
      data: {
        azonosito: 'R-02',
        nev: 'Vidéki raktár',
        cim: '6000 Kecskemét, Raktár út 5.',
        aktiv: true,
      },
    }),
  ]);

  console.log('✅ Raktárak létrehozva');

  const locations = await Promise.all([
    prisma.warehouseLocation.create({
      data: {
        warehouseId: logisticsWarehouses[0].id,
        azonosito: 'A-01-01',
        nev: 'A zóna, 1. folyosó, 1. polc',
        zona: 'A',
        folyoso: '01',
        polc: '01',
        tipus: 'palettás',
        aktiv: true,
      },
    }),
    prisma.warehouseLocation.create({
      data: {
        warehouseId: logisticsWarehouses[0].id,
        azonosito: 'A-01-02',
        nev: 'A zóna, 1. folyosó, 2. polc',
        zona: 'A',
        folyoso: '01',
        polc: '02',
        tipus: 'polcos',
        aktiv: true,
      },
    }),
  ]);

  console.log('✅ Raktári helyek létrehozva');

  const stockItems = await prisma.item.findMany({ take: 3 });
  if (stockItems.length > 0) {
    await Promise.all([
      prisma.stockLevel.create({
        data: {
          itemId: stockItems[0].id,
          warehouseId: logisticsWarehouses[0].id,
          locationId: locations[0].id,
          mennyiseg: 150,
          minimum: 50,
          maximum: 500,
        },
      }),
      prisma.stockLevel.create({
        data: {
          itemId: stockItems[1].id,
          warehouseId: logisticsWarehouses[0].id,
          locationId: locations[1].id,
          mennyiseg: 25,
          minimum: 100,
          maximum: 300,
        },
      }),
      prisma.stockLevel.create({
        data: {
          itemId: stockItems[2].id,
          warehouseId: logisticsWarehouses[1].id,
          mennyiseg: 200,
          minimum: 80,
          maximum: 400,
        },
      }),
    ]);

    console.log('✅ Készletszintek létrehozva');
  }

  const suppliers = await prisma.supplier.findMany();
  if (suppliers.length > 0 && stockItems.length > 0) {
    await prisma.purchaseOrder.create({
      data: {
        supplierId: suppliers[0].id,
        azonosito: 'BR-2025-0001',
        rendelesiDatum: new Date('2025-11-01'),
        szallitasiDatum: new Date('2025-11-15'),
        osszeg: 500000,
        afa: 135000,
        vegosszeg: 635000,
        allapot: 'piszkozat',
        megjegyzesek: 'Irodaszerek utánrendelése',
        items: {
          create: [
            {
              itemId: stockItems[0].id,
              mennyiseg: 100,
              egysegAr: 5000,
              osszeg: 500000,
            },
          ],
        },
      },
    });

    console.log('✅ Beszerzési rendelések létrehozva');
  }

  await prisma.knowledgeBase.createMany({
    data: [
      {
        cim: 'Hogyan készítsek új ügyfelet?',
        tartalom: 'CRM > Ügyfelek > Új ügyfél gomb...',
        kategoria: 'CRM',
        aktiv: true,
      },
      {
        cim: 'Dokumentum iktatása',
        tartalom: 'DMS > Új dokumentum > Iktatószám automatikus...',
        kategoria: 'DMS',
        aktiv: true,
      },
      {
        cim: 'Készletriasztás beállítása',
        tartalom: 'Logisztika > Cikk szerkesztése > Min/Max készlet...',
        kategoria: 'Logisztika',
        aktiv: true,
      },
    ],
  });

  console.log('✅ Tudásbázis elemek létrehozva');

  await seedSystemSettings();

  console.log('🎉 Adatbázis feltöltése sikeres!');
}

main()
  .catch((e) => {
    console.error('❌ Hiba történt:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
