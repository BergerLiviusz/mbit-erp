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

  async receive(id: string, warehouseId: string, receivedItems: Array<{ itemId: string; mennyiseg: number; sarzsGyartasiSzam?: string; beszerzesiAr?: number }>) {
    const purchaseOrder = await this.findOne(id);

    if (!purchaseOrder) {
      throw new Error('Beszerzési rendelés nem található');
    }

    if (purchaseOrder.allapot === 'BEEERKEZETT' || purchaseOrder.allapot === 'LEZARVA') {
      throw new Error('A beszerzési rendelés már beérkezett vagy lezárva');
    }

    // Update stock levels for each received item
    for (const receivedItem of receivedItems) {
      const orderItem = purchaseOrder.items.find(item => item.itemId === receivedItem.itemId);
      if (!orderItem) {
        throw new BadRequestException(`Termék nem található a rendelésben: ${receivedItem.itemId}`);
      }

      // Find or create stock level
      const stockLevel = await this.prisma.stockLevel.findFirst({
        where: {
          itemId: receivedItem.itemId,
          warehouseId: warehouseId,
          locationId: null,
        },
      });

      if (stockLevel) {
        // Update existing stock level
        await this.prisma.stockLevel.update({
          where: { id: stockLevel.id },
          data: {
            mennyiseg: {
              increment: receivedItem.mennyiseg,
            },
          },
        });
      } else {
        // Create new stock level
        await this.prisma.stockLevel.create({
          data: {
            itemId: receivedItem.itemId,
            warehouseId: warehouseId,
            mennyiseg: receivedItem.mennyiseg,
          },
        });
      }

      // Create stock lot if batch/serial number or purchase price is provided
      if (receivedItem.sarzsGyartasiSzam || receivedItem.beszerzesiAr) {
        await this.prisma.stockLot.create({
          data: {
            itemId: receivedItem.itemId,
            warehouseId: warehouseId,
            sarzsGyartasiSzam: receivedItem.sarzsGyartasiSzam || null,
            mennyiseg: receivedItem.mennyiseg,
            beszerzesiAr: receivedItem.beszerzesiAr || orderItem.egysegAr,
          },
        });
      }

      // Create stock move for audit trail
      await this.prisma.stockMove.create({
        data: {
          itemId: receivedItem.itemId,
          warehouseId: warehouseId,
          tipus: 'BESZERZES',
          mennyiseg: receivedItem.mennyiseg,
          sarzsGyartasiSzam: receivedItem.sarzsGyartasiSzam || null,
          referenciaId: purchaseOrder.id,
          megjegyzesek: `Beszerzési rendelés: ${purchaseOrder.azonosito}`,
        },
      });
    }

    // Update purchase order status
    return this.prisma.purchaseOrder.update({
      where: { id },
      data: {
        allapot: 'BEEERKEZETT',
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
}
