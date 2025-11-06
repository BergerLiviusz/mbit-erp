"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Adatbázis feltöltése kezdődik...');
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
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@audit.hu' },
        update: {},
        create: {
            email: 'admin@audit.hu',
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
    console.log('✅ Admin felhasználó létrehozva (admin@audit.hu / admin123)');
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
//# sourceMappingURL=seed.js.map