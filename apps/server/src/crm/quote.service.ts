import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SystemSettingsService } from '../system/settings.service';

export interface CreateQuoteDto {
  accountId: string;
  opportunityId?: string;
  ervenyessegDatum: Date;
  megjegyzesek?: string;
  items: Array<{
    itemId: string;
    mennyiseg: number;
    egysegAr: number;
    kedvezmeny?: number;
  }>;
}

export interface UpdateQuoteDto {
  ervenyessegDatum?: Date;
  allapot?: string;
  megjegyzesek?: string;
}

@Injectable()
export class QuoteService {
  constructor(
    private prisma: PrismaService,
    private settingsService: SystemSettingsService,
  ) {}

  async findAll(skip: number = 0, take: number = 10, allapot?: string) {
    const where = allapot ? { allapot } : {};
    
    const [data, total] = await Promise.all([
      this.prisma.quote.findMany({
        where,
        skip,
        take,
        include: {
          account: {
            select: {
              id: true,
              nev: true,
              azonosito: true,
            },
          },
          opportunity: {
            select: {
              id: true,
              nev: true,
            },
          },
          items: {
            include: {
              item: {
                select: {
                  id: true,
                  nev: true,
                  azonosito: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.quote.count({ where }),
    ]);

    return { data, total, page: Math.floor(skip / take) + 1, pageSize: take };
  }

  async findOne(id: string) {
    return await this.prisma.quote.findUnique({
      where: { id },
      include: {
        account: {
          include: {
            contacts: true,
          },
        },
        opportunity: true,
        items: {
          include: {
            item: true,
          },
        },
        discounts: true,
      },
    });
  }

  async findByAccount(accountId: string) {
    return await this.prisma.quote.findMany({
      where: { accountId },
      include: {
        opportunity: {
          select: {
            id: true,
            nev: true,
          },
        },
        items: {
          select: {
            id: true,
            mennyiseg: true,
            osszeg: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: CreateQuoteDto) {
    const azonosito = await this.generateQuoteNumber();

    let osszeg = 0;
    const quoteItems = [];

    for (const item of data.items) {
      const kedvezmeny = item.kedvezmeny || 0;
      const itemOsszeg = item.mennyiseg * item.egysegAr * (1 - kedvezmeny / 100);
      osszeg += itemOsszeg;

      quoteItems.push({
        itemId: item.itemId,
        mennyiseg: item.mennyiseg,
        egysegAr: item.egysegAr,
        kedvezmeny,
        osszeg: itemOsszeg,
      });
    }

    const afa = osszeg * 0.27;
    const vegosszeg = osszeg + afa;

    return await this.prisma.quote.create({
      data: {
        azonosito,
        ervenyessegDatum: data.ervenyessegDatum,
        osszeg,
        afa,
        vegosszeg,
        allapot: 'tervezet',
        megjegyzesek: data.megjegyzesek,
        account: {
          connect: { id: data.accountId },
        },
        ...(data.opportunityId && {
          opportunity: {
            connect: { id: data.opportunityId },
          },
        }),
        items: {
          create: quoteItems,
        },
      },
      include: {
        account: true,
        opportunity: true,
        items: {
          include: {
            item: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateQuoteDto) {
    return await this.prisma.quote.update({
      where: { id },
      data,
      include: {
        account: true,
        opportunity: true,
        items: {
          include: {
            item: true,
          },
        },
      },
    });
  }

  async approve(id: string) {
    const quote = await this.findOne(id);
    if (!quote) {
      throw new BadRequestException('Árajánlat nem található');
    }

    const threshold = await this.settingsService.get('quote.approval.threshold');
    const thresholdValue = threshold ? parseFloat(threshold) : 1000000;

    if (quote.vegosszeg > thresholdValue) {
      return await this.update(id, { allapot: 'jovahagyasra_var' });
    }

    return await this.update(id, { allapot: 'jovahagyott' });
  }

  async reject(id: string) {
    return await this.update(id, { allapot: 'elutasitott' });
  }

  async delete(id: string) {
    return await this.prisma.quote.delete({
      where: { id },
    });
  }

  private async generateQuoteNumber(): Promise<string> {
    const pattern = await this.settingsService.get('numbering.quote.pattern');
    const template = pattern || 'AJ-{YYYY}-{####}';

    const now = new Date();
    const year = now.getFullYear().toString();

    const count = await this.prisma.quote.count({
      where: {
        createdAt: {
          gte: new Date(parseInt(year), 0, 1),
          lt: new Date(parseInt(year) + 1, 0, 1),
        },
      },
    });

    const number = (count + 1).toString().padStart(4, '0');

    return template
      .replace('{YYYY}', year)
      .replace('{####}', number);
  }
}
