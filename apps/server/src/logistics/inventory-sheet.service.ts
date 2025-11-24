import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateInventorySheetDto {
  warehouseId: string;
  leltarDatum?: string;
  megjegyzesek?: string;
}

export interface UpdateInventorySheetDto {
  allapot?: string;
  megjegyzesek?: string;
}

export interface AddInventorySheetItemDto {
  itemId: string;
  locationId?: string;
  tenylegesKeszlet: number;
  megjegyzesek?: string;
}

export interface UpdateInventorySheetItemDto {
  tenylegesKeszlet?: number;
  megjegyzesek?: string;
}

@Injectable()
export class InventorySheetService {
  constructor(private prisma: PrismaService) {}

  async generateSheetNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.inventorySheet.count({
      where: {
        azonosito: {
          startsWith: `L-${year}-`,
        },
      },
    });
    return `L-${year}-${String(count + 1).padStart(5, '0')}`;
  }

  async findAll(skip = 0, take = 50, filters?: {
    warehouseId?: string;
    allapot?: string;
  }) {
    const where: any = {};

    if (filters?.warehouseId) {
      where.warehouseId = filters.warehouseId;
    }

    if (filters?.allapot) {
      where.allapot = filters.allapot;
    }

    const [total, items] = await Promise.all([
      this.prisma.inventorySheet.count({ where }),
      this.prisma.inventorySheet.findMany({
        where,
        skip,
        take,
        include: {
          warehouse: {
            select: {
              id: true,
              nev: true,
              azonosito: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              nev: true,
              email: true,
            },
          },
          approvedBy: {
            select: {
              id: true,
              nev: true,
              email: true,
            },
          },
          _count: {
            select: {
              items: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    return { total, items };
  }

  async findOne(id: string) {
    const sheet = await this.prisma.inventorySheet.findUnique({
      where: { id },
      include: {
        warehouse: true,
        createdBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
        items: {
          include: {
            item: true,
            location: true,
          },
          orderBy: {
            item: {
              nev: 'asc',
            },
          },
        },
      },
    });

    if (!sheet) {
      throw new NotFoundException('Leltárív nem található');
    }

    return sheet;
  }

  async create(dto: CreateInventorySheetDto, userId?: string) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: dto.warehouseId },
    });

    if (!warehouse) {
      throw new NotFoundException('Raktár nem található');
    }

    const azonosito = await this.generateSheetNumber();

    // Get current stock levels for the warehouse
    const stockLevels = await this.prisma.stockLevel.findMany({
      where: { warehouseId: dto.warehouseId },
      include: {
        item: true,
        location: true,
      },
    });

    // Create inventory sheet with items
    const sheet = await this.prisma.inventorySheet.create({
      data: {
        warehouseId: dto.warehouseId,
        azonosito,
        leltarDatum: dto.leltarDatum ? new Date(dto.leltarDatum) : new Date(),
        megjegyzesek: dto.megjegyzesek,
        createdById: userId,
        allapot: 'NYITOTT',
        items: {
          create: stockLevels.map(stock => ({
            itemId: stock.itemId,
            locationId: stock.locationId,
            konyvKeszlet: stock.mennyiseg,
            tenylegesKeszlet: null,
            kulonbseg: null,
          })),
        },
      },
      include: {
        warehouse: true,
        createdBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
        items: {
          include: {
            item: true,
            location: true,
          },
        },
      },
    });

    return sheet;
  }

  async update(id: string, dto: UpdateInventorySheetDto) {
    const sheet = await this.findOne(id);

    if (sheet.allapot === 'LEZARVA') {
      throw new BadRequestException('Lezárt leltárív nem módosítható');
    }

    return this.prisma.inventorySheet.update({
      where: { id },
      data: dto,
      include: {
        warehouse: true,
        createdBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
        items: {
          include: {
            item: true,
            location: true,
          },
        },
      },
    });
  }

  async addItem(sheetId: string, dto: AddInventorySheetItemDto) {
    const sheet = await this.findOne(sheetId);

    if (sheet.allapot === 'LEZARVA' || sheet.allapot === 'JOVAHAGYVA') {
      throw new BadRequestException('Ez a leltárív már nem módosítható');
    }

    // Get current stock level
    const stockLevel = await this.prisma.stockLevel.findFirst({
      where: {
        itemId: dto.itemId,
        warehouseId: sheet.warehouseId,
        locationId: dto.locationId || null,
      },
    });

    if (!stockLevel) {
      throw new NotFoundException('Készletszint nem található');
    }

    const kulonbseg = dto.tenylegesKeszlet - stockLevel.mennyiseg;

    return this.prisma.inventorySheetItem.create({
      data: {
        inventorySheetId: sheetId,
        itemId: dto.itemId,
        locationId: dto.locationId || null,
        konyvKeszlet: stockLevel.mennyiseg,
        tenylegesKeszlet: dto.tenylegesKeszlet,
        kulonbseg,
        megjegyzesek: dto.megjegyzesek,
      },
      include: {
        item: true,
        location: true,
      },
    });
  }

  async updateItem(sheetId: string, itemId: string, dto: UpdateInventorySheetItemDto) {
    const sheet = await this.findOne(sheetId);

    if (sheet.allapot === 'LEZARVA' || sheet.allapot === 'JOVAHAGYVA') {
      throw new BadRequestException('Ez a leltárív már nem módosítható');
    }

    const sheetItem = await this.prisma.inventorySheetItem.findFirst({
      where: {
        inventorySheetId: sheetId,
        itemId,
      },
    });

    if (!sheetItem) {
      throw new NotFoundException('Leltárív tétel nem található');
    }

    const tenylegesKeszlet = dto.tenylegesKeszlet !== undefined ? dto.tenylegesKeszlet : sheetItem.tenylegesKeszlet;
    const kulonbseg = tenylegesKeszlet !== null ? tenylegesKeszlet - sheetItem.konyvKeszlet : null;

    return this.prisma.inventorySheetItem.update({
      where: { id: sheetItem.id },
      data: {
        tenylegesKeszlet: dto.tenylegesKeszlet !== undefined ? dto.tenylegesKeszlet : undefined,
        kulonbseg,
        megjegyzesek: dto.megjegyzesek !== undefined ? dto.megjegyzesek : undefined,
      },
      include: {
        item: true,
        location: true,
      },
    });
  }

  async approve(sheetId: string, userId: string) {
    const sheet = await this.findOne(sheetId);

    if (sheet.allapot !== 'BEFEJEZETT') {
      throw new BadRequestException('Csak befejezett leltárív jóváhagyható');
    }

    // Update stock levels based on inventory sheet
    for (const item of sheet.items) {
      if (item.tenylegesKeszlet !== null && item.kulonbseg !== null && item.kulonbseg !== 0) {
        // Find or create stock level
        const stockLevel = await this.prisma.stockLevel.findFirst({
          where: {
            itemId: item.itemId,
            warehouseId: sheet.warehouseId,
            locationId: item.locationId || null,
          },
        });

        if (stockLevel) {
          // Update stock level
          await this.prisma.stockLevel.update({
            where: { id: stockLevel.id },
            data: {
              mennyiseg: item.tenylegesKeszlet,
            },
          });

          // Create stock move for audit trail
          await this.prisma.stockMove.create({
            data: {
              itemId: item.itemId,
              warehouseId: sheet.warehouseId,
              tipus: 'LELTAR_KORREKCIO',
              mennyiseg: item.kulonbseg,
              megjegyzesek: `Leltárív korrekció: ${sheet.azonosito}`,
            },
          });
        }
      }
    }

    // Update sheet status
    return this.prisma.inventorySheet.update({
      where: { id: sheetId },
      data: {
        allapot: 'JOVAHAGYVA',
        approvedById: userId,
      },
      include: {
        warehouse: true,
        createdBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
        items: {
          include: {
            item: true,
            location: true,
          },
        },
      },
    });
  }

  async close(sheetId: string) {
    const sheet = await this.findOne(sheetId);

    if (sheet.allapot !== 'JOVAHAGYVA') {
      throw new BadRequestException('Csak jóváhagyott leltárív zárható le');
    }

    return this.prisma.inventorySheet.update({
      where: { id: sheetId },
      data: {
        allapot: 'LEZARVA',
      },
      include: {
        warehouse: true,
        createdBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
        items: {
          include: {
            item: true,
            location: true,
          },
        },
      },
    });
  }

  async revertApproval(sheetId: string) {
    const sheet = await this.findOne(sheetId);

    if (sheet.allapot !== 'JOVAHAGYVA') {
      throw new BadRequestException('Csak jóváhagyott leltárív jóváhagyása vonható vissza');
    }

    // Revert stock levels back to original (konyvKeszlet)
    for (const item of sheet.items) {
      if (item.tenylegesKeszlet !== null && item.kulonbseg !== null && item.kulonbseg !== 0) {
        const stockLevel = await this.prisma.stockLevel.findFirst({
          where: {
            itemId: item.itemId,
            warehouseId: sheet.warehouseId,
            locationId: item.locationId || null,
          },
        });

        if (stockLevel) {
          // Revert to original stock level (konyvKeszlet)
          await this.prisma.stockLevel.update({
            where: { id: stockLevel.id },
            data: {
              mennyiseg: item.konyvKeszlet,
            },
          });

          // Create stock move for audit trail (revert)
          await this.prisma.stockMove.create({
            data: {
              itemId: item.itemId,
              warehouseId: sheet.warehouseId,
              tipus: 'LELTAR_VISSZAVONAS',
              mennyiseg: -item.kulonbseg,
              megjegyzesek: `Leltárív jóváhagyás visszavonása: ${sheet.azonosito}`,
            },
          });
        }
      }
    }

    // Update sheet status to BEFEJEZETT and clear approvedBy
    return this.prisma.inventorySheet.update({
      where: { id: sheetId },
      data: {
        allapot: 'BEFEJEZETT',
        approvedById: null,
      },
      include: {
        warehouse: true,
        createdBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
        items: {
          include: {
            item: true,
            location: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    const sheet = await this.findOne(id);

    if (sheet.allapot === 'JOVAHAGYVA' || sheet.allapot === 'LEZARVA') {
      throw new BadRequestException('Jóváhagyott vagy lezárt leltárív nem törölhető');
    }

    return this.prisma.inventorySheet.delete({
      where: { id },
    });
  }
}

