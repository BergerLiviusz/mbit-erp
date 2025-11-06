import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SystemSettingsService } from '../system/settings.service';

export interface CreatePurchaseOrderItemDto {
  itemId: string;
  mennyiseg: number;
  egysegAr: number;
  osszeg: number;
}

export interface CreatePurchaseOrderDto {
  supplierId: string;
  rendelesiDatum?: Date;
  szallitasiDatum?: Date;
  osszeg: number;
  afa: number;
  vegosszeg: number;
  allapot: string;
  megjegyzesek?: string;
  items: CreatePurchaseOrderItemDto[];
}

export interface UpdatePurchaseOrderDto {
  supplierId?: string;
  rendelesiDatum?: Date;
  szallitasiDatum?: Date;
  osszeg?: number;
  afa?: number;
  vegosszeg?: number;
  allapot?: string;
  megjegyzesek?: string;
}

export interface PurchaseOrderFilters {
  allapot?: string;
  supplierId?: string;
}

@Injectable()
export class PurchaseOrderService {
  constructor(
    private prisma: PrismaService,
    private settingsService: SystemSettingsService,
  ) {}

  async generateAzonosito(): Promise<string> {
    const pattern = await this.settingsService.get('numbering.purchase_order.pattern');
    const defaultPattern = 'PO-{YYYY}-{####}';
    const template = pattern || defaultPattern;

    const now = new Date();
    const year = now.getFullYear().toString();

    const count = await this.prisma.purchaseOrder.count({
      where: {
        createdAt: {
          gte: new Date(`${year}-01-01`),
          lt: new Date(`${parseInt(year) + 1}-01-01`),
        },
      },
    });

    const nextNumber = (count + 1).toString().padStart(4, '0');

    return template
      .replace('{YYYY}', year)
      .replace('{####}', nextNumber);
  }

  async findAll(skip = 0, take = 50, filters?: PurchaseOrderFilters) {
    const where: any = {};

    if (filters?.allapot) {
      where.allapot = filters.allapot;
    }

    if (filters?.supplierId) {
      where.supplierId = filters.supplierId;
    }

    const [total, data] = await Promise.all([
      this.prisma.purchaseOrder.count({ where }),
      this.prisma.purchaseOrder.findMany({
        where,
        skip,
        take,
        include: {
          supplier: true,
          items: {
            include: {
              item: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const page = Math.floor(skip / take) + 1;
    const pageSize = take;

    return { data, total, page, pageSize };
  }

  async findOne(id: string) {
    return this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        supplier: true,
        items: {
          include: {
            item: true,
          },
        },
        deliveryNotes: true,
      },
    });
  }

  async create(dto: CreatePurchaseOrderDto) {
    const azonosito = await this.generateAzonosito();

    const { items, ...orderData } = dto;

    return this.prisma.purchaseOrder.create({
      data: {
        ...orderData,
        azonosito,
        rendelesiDatum: dto.rendelesiDatum || new Date(),
        items: {
          create: items.map((item) => ({
            itemId: item.itemId,
            mennyiseg: item.mennyiseg,
            egysegAr: item.egysegAr,
            osszeg: item.osszeg,
          })),
        },
      },
      include: {
        supplier: true,
        items: {
          include: {
            item: true,
          },
        },
      },
    });
  }

  async update(id: string, dto: UpdatePurchaseOrderDto) {
    return this.prisma.purchaseOrder.update({
      where: { id },
      data: dto,
      include: {
        supplier: true,
        items: {
          include: {
            item: true,
          },
        },
      },
    });
  }
}
