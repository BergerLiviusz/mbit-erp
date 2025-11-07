import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface SettingValue {
  kulcs: string;
  ertek: string;
  tipus: string;
  kategoria: string;
  leiras?: string;
}

@Injectable()
export class SystemSettingsService {
  private readonly logger = new Logger(SystemSettingsService.name);

  constructor(private prisma: PrismaService) {}

  async get(kulcs: string): Promise<string | null> {
    const setting = await this.prisma.systemSetting.findUnique({
      where: { kulcs },
    });
    return setting?.ertek || null;
  }

  async set(kulcs: string, ertek: string, kategoria: string = 'general', tipus: string = 'string', leiras?: string): Promise<void> {
    const existing = await this.prisma.systemSetting.findUnique({
      where: { kulcs },
    });

    if (existing) {
      await this.prisma.systemSetting.update({
        where: { kulcs },
        data: { ertek },
      });
    } else {
      await this.prisma.systemSetting.create({
        data: {
          kulcs,
          ertek,
          tipus,
          kategoria,
          leiras,
        },
      });
    }
    this.logger.log(`Setting updated: ${kulcs} = ${ertek}`);
  }

  async getAll(): Promise<any[]> {
    return await this.prisma.systemSetting.findMany({
      orderBy: [{ kategoria: 'asc' }, { kulcs: 'asc' }],
    });
  }

  async getAllByCategory(kategoria: string): Promise<any[]> {
    return await this.prisma.systemSetting.findMany({
      where: { kategoria },
      orderBy: { kulcs: 'asc' },
    });
  }

  async initializeDefaults(): Promise<void> {
    const defaults: SettingValue[] = [
      {
        kulcs: 'organization.name',
        ertek: 'MB-IT Kft.',
        tipus: 'string',
        kategoria: 'organization',
        leiras: 'Szervezet neve',
      },
      {
        kulcs: 'organization.address',
        ertek: '',
        tipus: 'string',
        kategoria: 'organization',
        leiras: 'Szervezet címe',
      },
      {
        kulcs: 'organization.tax_number',
        ertek: '',
        tipus: 'string',
        kategoria: 'organization',
        leiras: 'Adószám',
      },
      {
        kulcs: 'organization.email',
        ertek: 'admin@mbit.hu',
        tipus: 'string',
        kategoria: 'organization',
        leiras: 'Kapcsolattartói email',
      },
      {
        kulcs: 'organization.phone',
        ertek: '',
        tipus: 'string',
        kategoria: 'organization',
        leiras: 'Telefonszám',
      },
      {
        kulcs: 'organization.registration_number',
        ertek: '',
        tipus: 'string',
        kategoria: 'organization',
        leiras: 'Cégjegyzékszám',
      },
      {
        kulcs: 'organization.website',
        ertek: '',
        tipus: 'string',
        kategoria: 'organization',
        leiras: 'Weboldal',
      },
      {
        kulcs: 'numbering.quote.pattern',
        ertek: 'AJ-{YYYY}-{####}',
        tipus: 'string',
        kategoria: 'numbering',
        leiras: 'Árajánlat számozási minta',
      },
      {
        kulcs: 'numbering.order.pattern',
        ertek: 'R-{YYYY}-{####}',
        tipus: 'string',
        kategoria: 'numbering',
        leiras: 'Rendelés számozási minta',
      },
      {
        kulcs: 'numbering.document.pattern',
        ertek: 'MBIT/{YYYY}/{####}',
        tipus: 'string',
        kategoria: 'numbering',
        leiras: 'Dokumentum iktatószám minta',
      },
      {
        kulcs: 'numbering.purchase_order.pattern',
        ertek: 'PO-{YYYY}-{####}',
        tipus: 'string',
        kategoria: 'numbering',
        leiras: 'Beszerzési rendelés számozási minta',
      },
      {
        kulcs: 'logistics.low_stock_threshold',
        ertek: '10',
        tipus: 'number',
        kategoria: 'logistics',
        leiras: 'Alacsony készlet küszöbérték',
      },
      {
        kulcs: 'backup.daily.enabled',
        ertek: 'true',
        tipus: 'boolean',
        kategoria: 'backup',
        leiras: 'Napi mentés engedélyezése',
      },
      {
        kulcs: 'backup.daily.schedule',
        ertek: '0 2 * * *',
        tipus: 'string',
        kategoria: 'backup',
        leiras: 'Napi mentés időpontja (cron)',
      },
      {
        kulcs: 'backup.weekly.enabled',
        ertek: 'false',
        tipus: 'boolean',
        kategoria: 'backup',
        leiras: 'Heti mentés engedélyezése',
      },
      {
        kulcs: 'backup.weekly.schedule',
        ertek: '0 3 * * 0',
        tipus: 'string',
        kategoria: 'backup',
        leiras: 'Heti mentés időpontja (cron)',
      },
      {
        kulcs: 'backup.retention.count',
        ertek: '10',
        tipus: 'number',
        kategoria: 'backup',
        leiras: 'Megőrzendő mentések száma',
      },
      {
        kulcs: 'quote.approval.threshold',
        ertek: '1000000',
        tipus: 'number',
        kategoria: 'crm',
        leiras: 'Árajánlat jóváhagyási küszöb (HUF)',
      },
      {
        kulcs: 'system.lan.enabled',
        ertek: 'false',
        tipus: 'boolean',
        kategoria: 'system',
        leiras: 'LAN együttműködés engedélyezése',
      },
    ];

    for (const setting of defaults) {
      const existing = await this.prisma.systemSetting.findUnique({
        where: { kulcs: setting.kulcs },
      });

      if (!existing) {
        await this.prisma.systemSetting.create({
          data: setting,
        });
      }
    }

    this.logger.log('Default settings initialized');
  }

  async delete(kulcs: string): Promise<void> {
    await this.prisma.systemSetting.delete({
      where: { kulcs },
    });
    this.logger.log(`Setting deleted: ${kulcs}`);
  }

  async updateMany(settings: Array<{ kulcs: string; ertek: string }>): Promise<void> {
    for (const setting of settings) {
      const existing = await this.prisma.systemSetting.findUnique({
        where: { kulcs: setting.kulcs },
      });

      if (existing) {
        await this.prisma.systemSetting.update({
          where: { kulcs: setting.kulcs },
          data: { ertek: setting.ertek },
        });
      }
    }

    this.logger.log(`Updated ${settings.length} settings`);
  }
}
