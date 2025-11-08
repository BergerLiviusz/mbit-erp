import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Permission, PermissionDescriptions } from '../common/rbac/permission.enum';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedDatabaseIfEmpty();
  }

  private async seedDatabaseIfEmpty() {
    try {
      const userCount = await this.prisma.user.count();
      
      if (userCount > 0) {
        this.logger.log('✅ Adatbázis már tartalmaz felhasználókat, seed kihagyva');
        return;
      }

      this.logger.log('🌱 Üres adatbázis észlelve, seed indítása...');
      await this.runSeed();
      this.logger.log('🎉 Adatbázis seed sikeres!');
    } catch (error) {
      this.logger.error('❌ Seed hiba:', error);
    }
  }

  private async runSeed() {
    await this.seedPermissions();
    const roles = await this.seedRoles();
    await this.seedAdminUser(roles[0].id);
    await this.seedSystemSettings();
    
    this.logger.log(`✅ Admin felhasználó létrehozva: admin@mbit.hu / admin123`);
  }

  private async seedPermissions() {
    this.logger.log('🔑 Jogosultságok létrehozása...');
    
    const permissionEntries = Object.entries(Permission).map(([key, value]) => ({
      kod: value,
      ...PermissionDescriptions[value as Permission],
    }));

    for (const perm of permissionEntries) {
      await this.prisma.permission.upsert({
        where: { kod: perm.kod },
        update: {
          nev: perm.nev,
          modulo: perm.modulo,
          leiras: perm.leiras,
        },
        create: perm,
      });
    }

    this.logger.log(`✅ ${permissionEntries.length} jogosultság létrehozva`);
    return await this.prisma.permission.findMany();
  }

  private async seedRoles() {
    this.logger.log('👥 Szerepkörök létrehozása...');
    
    const roles = await Promise.all([
      this.prisma.role.upsert({
        where: { nev: 'Admin' },
        update: {},
        create: {
          nev: 'Admin',
          leiras: 'Rendszergazda - teljes hozzáférés',
          permissions: JSON.stringify(['*']),
        },
      }),
      this.prisma.role.upsert({
        where: { nev: 'PowerUser' },
        update: {},
        create: {
          nev: 'PowerUser',
          leiras: 'Haladó felhasználó - osztott erőforrások',
          permissions: JSON.stringify(['crm.*', 'dms.*', 'logistics.*']),
        },
      }),
      this.prisma.role.upsert({
        where: { nev: 'User' },
        update: {},
        create: {
          nev: 'User',
          leiras: 'Felhasználó - saját hozzáférések',
          permissions: JSON.stringify(['crm.read', 'dms.read']),
        },
      }),
    ]);

    const permissions = await this.prisma.permission.findMany();
    const adminPermissions = permissions.filter(p => 
      p.modulo === 'CRM' || p.modulo === 'DMS' || p.modulo === 'Logisztika' || 
      p.modulo === 'Rendszer' || p.modulo === 'Felhasználók' || p.modulo === 'Szerepkörök' ||
      p.modulo === 'Jelentések'
    );
    
    for (const perm of adminPermissions) {
      await this.prisma.rolePermission.upsert({
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

    this.logger.log('✅ Szerepkörök létrehozva');
    return roles;
  }

  private async seedAdminUser(adminRoleId: string) {
    this.logger.log('👤 Admin felhasználó létrehozása...');
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await this.prisma.user.upsert({
      where: { email: 'admin@mbit.hu' },
      update: {},
      create: {
        email: 'admin@mbit.hu',
        password: hashedPassword,
        nev: 'Rendszergazda',
        aktiv: true,
      },
    });

    await this.prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: adminUser.id,
          roleId: adminRoleId,
        },
      },
      update: {},
      create: {
        userId: adminUser.id,
        roleId: adminRoleId,
      },
    });

    return adminUser;
  }

  private async seedSystemSettings() {
    this.logger.log('⚙️ Rendszerbeállítások inicializálása...');
    
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
      await this.prisma.systemSetting.upsert({
        where: { kulcs: setting.kulcs },
        update: setting,
        create: setting,
      });
    }

    this.logger.log(`✅ ${settings.length} rendszerbeállítás inicializálva`);
  }
}
