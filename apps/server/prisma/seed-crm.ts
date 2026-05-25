import { PrismaClient, User, Account, Item } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedCrmDemo(
  prisma: PrismaClient,
  adminUser: User,
  accounts: Account[],
  catalogItems: Item[],
) {
  console.log('📊 GINOP CRM demo adatok...');

  const salesRole = await prisma.role.upsert({
    where: { nev: 'Sales' },
    update: { leiras: 'Értékesítő - operatív CRM' },
    create: {
      nev: 'Sales',
      leiras: 'Értékesítő - operatív CRM',
      permissions: JSON.stringify(['crm:*', 'customer:*', 'campaign:*', 'quote:*', 'order:*', 'ticket:*', 'opportunity:*']),
    },
  });

  const viewerRole = await prisma.role.upsert({
    where: { nev: 'Viewer' },
    update: { leiras: 'Csak olvasás és riport' },
    create: {
      nev: 'Viewer',
      leiras: 'Csak olvasás és riport',
      permissions: JSON.stringify(['*.read', 'crm:export']),
    },
  });

  const salesPassword = await bcrypt.hash('sales123', 10);
  const salesUser = await prisma.user.upsert({
    where: { email: 'sales@mbit.hu' },
    update: {},
    create: {
      email: 'sales@mbit.hu',
      password: salesPassword,
      nev: 'Értékesítő Demo',
      aktiv: true,
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: salesUser.id, roleId: salesRole.id } },
    update: {},
    create: { userId: salesUser.id, roleId: salesRole.id },
  });

  console.log('✅ Sales felhasználó: sales@mbit.hu / sales123');

  const extraAccounts = [];
  for (let i = 4; i <= 10; i++) {
    const acc = await prisma.account.upsert({
      where: { azonosito: `UGY-${String(i).padStart(3, '0')}` },
      update: {},
      create: {
        azonosito: `UGY-${String(i).padStart(3, '0')}`,
        nev: `Demo Ügyfél ${i} Kft.`,
        tipus: 'vevo',
        szamlazasiCim: `10${i} Budapest, Demo utca ${i}.`,
        szallitasiCim: `20${i} Budapest, Szállítás út ${i}.`,
        cim: `10${i} Budapest, Demo utca ${i}.`,
        email: `ugyfel${i}@demo.hu`,
        telefon: `+36 30 ${1000000 + i}`,
        iparag: i % 2 === 0 ? 'IT' : 'Építőipar',
        regio: i % 3 === 0 ? 'Budapest' : 'Vidék',
        ownerId: salesUser.id,
        contacts: {
          create: {
            nev: `Kapcsolat ${i}`,
            email: `kapcsolat${i}@demo.hu`,
            telefon: `+36 70 ${2000000 + i}`,
            elsodleges: true,
          },
        },
      },
    });
    extraAccounts.push(acc);
  }

  const allAccounts = [...accounts, ...extraAccounts];

  const campaigns = [];
  for (const [idx, spec] of [
    { nev: 'Tavaszi direkt marketing', allapot: 'aktiv', tipus: 'email' },
    { nev: 'Nyári akció', allapot: 'lezart', tipus: 'telefon' },
    { nev: 'Őszi cross-sell', allapot: 'aktiv', tipus: 'posta' },
  ].entries()) {
    const c = await prisma.campaign.create({
      data: {
        nev: spec.nev,
        leiras: `Demo kampány ${idx + 1}`,
        tipus: spec.tipus,
        allapot: spec.allapot,
        kezdetDatum: new Date('2025-01-01'),
        befejezesDatum: spec.allapot === 'lezart' ? new Date('2025-06-30') : null,
        koltsegvetes: 100000 * (idx + 1),
        createdById: adminUser.id,
      },
    });
    campaigns.push(c);
    for (const acc of allAccounts.slice(0, 4 + idx)) {
      await prisma.campaignAccount.create({
        data: {
          campaignId: c.id,
          accountId: acc.id,
          visszajelzes: idx === 0 ? 'pozitiv - érdeklődik' : idx === 1 ? 'semleges' : undefined,
        },
      });
    }
  }

  const discountRules = await Promise.all([
    prisma.discountRule.create({
      data: {
        nev: 'Mennyiségi 10+',
        tipus: 'MENNYISEGI',
        ertek: 5,
        mennyisegiHatar: 10,
        prioritas: 10,
        leiras: '10 db felett 5%',
      },
    }),
    prisma.discountRule.create({
      data: {
        nev: 'Egyedi ár - toll',
        tipus: 'EGYEDI_AR',
        ertek: 65,
        itemId: catalogItems[1]?.id,
        prioritas: 20,
      },
    }),
    prisma.discountRule.create({
      data: {
        nev: 'Értékhatár 1M+',
        tipus: 'ERTEKHATAR',
        ertek: 3,
        ertekHatar: 1000000,
        prioritas: 30,
      },
    }),
    prisma.discountRule.create({
      data: {
        nev: 'Tavaszi időszaki',
        tipus: 'IDOSZAKI',
        ertek: 7,
        kezdetDatum: new Date('2025-03-01'),
        vegesDatum: new Date('2025-05-31'),
        prioritas: 40,
      },
    }),
  ]);

  const leads = [];
  for (let i = 1; i <= 5; i++) {
    leads.push(
      await prisma.lead.create({
        data: {
          forras: 'web',
          allapot: i <= 2 ? 'uj' : 'minosített',
          accountId: allAccounts[i % allAccounts.length].id,
          campaignId: campaigns[0].id,
          minositesScore: 50 + i * 10,
          createdById: salesUser.id,
        },
      }),
    );
  }

  let opps = await prisma.opportunity.findMany();
  if (opps.length < 5) {
    const extra = await Promise.all(
      Array.from({ length: 5 - opps.length }, (_, i) =>
        prisma.opportunity.create({
          data: {
            accountId: allAccounts[(opps.length + i) % allAccounts.length].id,
            nev: `Demo lehetőség ${opps.length + i + 1}`,
            szakasz: ['uj', 'targyalas', 'ajanlatadas'][(opps.length + i) % 3],
            ertek: 5000000 + (opps.length + i) * 1000000,
            valoszinuseg: 30 + (opps.length + i) * 10,
            leadId: leads[(opps.length + i) % leads.length]?.id,
          },
        }),
      ),
    );
    opps = [...opps, ...extra];
  }

  const quotes = [];
  for (let i = 0; i < 5; i++) {
    const item = catalogItems[i % catalogItems.length];
    const osszeg = item.eladasiAr * (10 + i);
    const afa = osszeg * 0.27;
    const q = await prisma.quote.create({
      data: {
        accountId: allAccounts[i % allAccounts.length].id,
        opportunityId: opps[i % opps.length].id,
        azonosito: `AJ-2025-D${String(i + 1).padStart(3, '0')}`,
        ervenyessegDatum: new Date('2025-12-31'),
        osszeg,
        afa,
        vegosszeg: osszeg + afa,
        allapot: i < 3 ? 'jovahagyott' : 'tervezet',
        items: {
          create: {
            itemId: item.id,
            mennyiseg: 10 + i,
            egysegAr: item.eladasiAr,
            kedvezmeny: 0,
            osszeg,
          },
        },
      },
    });
    quotes.push(q);
  }

  const orders = [];
  for (let i = 0; i < 3; i++) {
    const quote = quotes[i];
    const order = await prisma.order.create({
      data: {
        accountId: quote.accountId,
        quoteId: quote.id,
        azonosito: `REND-DEMO-${String(i + 1).padStart(3, '0')}`,
        osszeg: quote.osszeg,
        afa: quote.afa,
        vegosszeg: quote.vegosszeg,
        allapot: i === 0 ? 'NEW' : 'IN_PROCESS',
        items: {
          create: {
            itemId: catalogItems[0].id,
            mennyiseg: 10,
            egysegAr: catalogItems[0].eladasiAr,
            kedvezmeny: 0,
            osszeg: quote.osszeg,
          },
        },
      },
    });
    orders.push(order);
    await prisma.shipment.create({
      data: {
        orderId: order.id,
        szallitasiCim: allAccounts.find((a) => a.id === quote.accountId)?.szallitasiCim || 'Budapest',
        szallitasiMod: 'standard',
        allapot: 'ELKESZULT',
        szallitasiDatum: new Date(),
      },
    });
    await prisma.invoiceStub.create({
      data: {
        accountId: quote.accountId,
        orderId: order.id,
        szamlaSzam: `SZM-DEMO-${String(i + 1).padStart(3, '0')}`,
        teljesitesDatum: new Date(),
        fizetesiHataridoDatum: new Date(Date.now() + 30 * 86400000),
        osszeg: quote.osszeg,
        afa: quote.afa,
        vegosszeg: quote.vegosszeg,
        tipus: 'NORMAL',
        allapot: 'TERVEZET',
      },
    });
  }

  const ticketSpecs = [
    { allapot: 'uj', eszkalalva: false, prioritas: 'kozepes' },
    { allapot: 'folyamatban', eszkalalva: false, prioritas: 'magas', assignedToId: salesUser.id },
    { allapot: 'eszkalalt', eszkalalva: true, prioritas: 'surgos', assignedToId: adminUser.id },
  ];

  for (const [i, spec] of ticketSpecs.entries()) {
    await prisma.ticket.create({
      data: {
        accountId: allAccounts[i].id,
        azonosito: `T-DEMO-${String(i + 1).padStart(3, '0')}`,
        targy: `Reklamáció ${i + 1}`,
        leiras: 'Demo reklamáció leírás',
        tipus: 'reklamacio',
        ...spec,
        createdById: adminUser.id,
      },
    });
  }

  for (let i = 0; i < 10; i++) {
    await prisma.message.create({
      data: {
        accountId: allAccounts[i % allAccounts.length].id,
        channel: i % 2 === 0 ? 'EMAIL' : 'CHAT',
        targy: i % 2 === 0 ? 'Ajánlat küldése' : 'Belső egyeztetés',
        szoveg: `Demo kommunikáció #${i + 1}`,
        tipus: 'KIMENO',
        createdById: i % 2 === 0 ? salesUser.id : adminUser.id,
      },
    });
  }

  for (let i = 0; i < 6; i++) {
    await prisma.customerInteraction.create({
      data: {
        accountId: allAccounts[i % allAccounts.length].id,
        tipus: i % 2 === 0 ? 'KAPCSOLAT' : 'FELADAT',
        targy: `Értékesítői tevékenység ${i + 1}`,
        tartalom: 'Demo kapcsolatfelvétel tartalom',
        felelosId: salesUser.id,
        kovetkezoFeladat: i < 3 ? 'Visszahívás' : undefined,
        kovetkezoHatarido: i < 3 ? new Date(Date.now() + (i + 1) * 86400000) : new Date(Date.now() - 86400000),
        allapot: i < 4 ? 'NYITOTT' : 'LEZART',
      },
    });
  }

  await prisma.systemSetting.upsert({
    where: { kulcs: 'crm.smtp.host' },
    update: {},
    create: {
      kulcs: 'crm.smtp.host',
      ertek: '',
      tipus: 'string',
      kategoria: 'crm',
      leiras: 'CRM e-mail SMTP kiszolgáló (üres = lokális rögzítés only)',
    },
  });

  console.log(
    `✅ CRM demo: ${allAccounts.length} ügyfél, ${campaigns.length} kampány, ${leads.length} lead, ${quotes.length} ajánlat, ${orders.length} rendelés, ${discountRules.length} kedvezmény`,
  );
}
