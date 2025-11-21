import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateStockReservationDto {
  itemId: string;
  warehouseId: string;
  locationId?: string;
  orderId?: string;
  purchaseOrderId?: string;
  mennyiseg: number;
  megjegyzesek?: string;
}

export interface UpdateStockReservationDto {
  mennyiseg?: number;
  allapot?: string;
  megjegyzesek?: string;
}

export interface CreateExpectedReceiptDto {
  warehouseId: string;
  purchaseOrderId?: string;
  vartBeerkezes: string;
  megjegyzesek?: string;
  items: Array<{
    itemId: string;
    mennyiseg: number;
    egysegAr?: number;
    megjegyzesek?: string;
  }>;
}

@Injectable()
export class StockReservationService {
  constructor(private prisma: PrismaService) {}

  async findAllReservations(skip = 0, take = 50, filters?: {
    itemId?: string;
    warehouseId?: string;
    orderId?: string;
    allapot?: string;
  }) {
    const where: any = {};

    if (filters?.itemId) {
      where.itemId = filters.itemId;
    }

    if (filters?.warehouseId) {
      where.warehouseId = filters.warehouseId;
    }

    if (filters?.orderId) {
      where.orderId = filters.orderId;
    }

    if (filters?.allapot) {
      where.allapot = filters.allapot;
    }

    const [total, items] = await Promise.all([
      this.prisma.stockReservation.count({ where }),
      this.prisma.stockReservation.findMany({
        where,
        skip,
        take,
        include: {
          item: {
            select: {
              id: true,
              nev: true,
              azonosito: true,
              egyseg: true,
            },
          },
          warehouse: {
            select: {
              id: true,
              nev: true,
              azonosito: true,
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

  async findOneReservation(id: string) {
    const reservation = await this.prisma.stockReservation.findUnique({
      where: { id },
      include: {
        item: true,
        warehouse: true,
      },
    });

    if (!reservation) {
      throw new NotFoundException('Készletfoglalás nem található');
    }

    return reservation;
  }

  async createReservation(dto: CreateStockReservationDto) {
    // Validate item
    const item = await this.prisma.item.findUnique({
      where: { id: dto.itemId },
    });

    if (!item) {
      throw new NotFoundException('Termék nem található');
    }

    // Validate warehouse
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: dto.warehouseId },
    });

    if (!warehouse) {
      throw new NotFoundException('Raktár nem található');
    }

    // Check available stock
    const stockLevel = await this.prisma.stockLevel.findFirst({
      where: {
        itemId: dto.itemId,
        warehouseId: dto.warehouseId,
        locationId: dto.locationId || null,
      },
    });

    const availableStock = (stockLevel?.mennyiseg || 0) - (stockLevel?.foglaltMennyiseg || 0);

    if (dto.mennyiseg > availableStock) {
      throw new BadRequestException(
        `Nincs elég szabad készlet. Elérhető: ${availableStock}, Kért: ${dto.mennyiseg}`
      );
    }

    // Create reservation
    const reservation = await this.prisma.stockReservation.create({
      data: {
        itemId: dto.itemId,
        warehouseId: dto.warehouseId,
        locationId: dto.locationId || null,
        orderId: dto.orderId,
        purchaseOrderId: dto.purchaseOrderId,
        mennyiseg: dto.mennyiseg,
        megjegyzesek: dto.megjegyzesek,
      },
      include: {
        item: true,
        warehouse: true,
      },
    });

    // Update stock level reserved quantity
    if (stockLevel) {
      await this.prisma.stockLevel.update({
        where: { id: stockLevel.id },
        data: {
          foglaltMennyiseg: (stockLevel.foglaltMennyiseg || 0) + dto.mennyiseg,
        },
      });
    }

    return reservation;
  }

  async updateReservation(id: string, dto: UpdateStockReservationDto) {
    const reservation = await this.findOneReservation(id);

    const updateData: any = {};

    if (dto.mennyiseg !== undefined) {
      // Update reserved quantity
      const stockLevel = await this.prisma.stockLevel.findFirst({
        where: {
          itemId: reservation.itemId,
          warehouseId: reservation.warehouseId,
          locationId: reservation.locationId || null,
        },
      });

      if (stockLevel) {
        const oldReserved = reservation.mennyiseg;
        const newReserved = dto.mennyiseg;
        const availableStock = (stockLevel.mennyiseg || 0) - (stockLevel.foglaltMennyiseg || 0) + oldReserved;

        if (newReserved > availableStock) {
          throw new BadRequestException(
            `Nincs elég szabad készlet. Elérhető: ${availableStock}, Kért: ${newReserved}`
          );
        }

        await this.prisma.stockLevel.update({
          where: { id: stockLevel.id },
          data: {
            foglaltMennyiseg: (stockLevel.foglaltMennyiseg || 0) - oldReserved + newReserved,
          },
        });
      }

      updateData.mennyiseg = dto.mennyiseg;
    }

    if (dto.allapot !== undefined) {
      updateData.allapot = dto.allapot;

      // If shipped or cancelled, release reserved quantity
      if (dto.allapot === 'KISZALLITVA' || dto.allapot === 'TOROLVE') {
        const stockLevel = await this.prisma.stockLevel.findFirst({
          where: {
            itemId: reservation.itemId,
            warehouseId: reservation.warehouseId,
            locationId: reservation.locationId || null,
          },
        });

        if (stockLevel) {
          await this.prisma.stockLevel.update({
            where: { id: stockLevel.id },
            data: {
              foglaltMennyiseg: Math.max(0, (stockLevel.foglaltMennyiseg || 0) - reservation.mennyiseg),
            },
          });
        }
      }
    }

    if (dto.megjegyzesek !== undefined) {
      updateData.megjegyzesek = dto.megjegyzesek;
    }

    return this.prisma.stockReservation.update({
      where: { id },
      data: updateData,
      include: {
        item: true,
        warehouse: true,
      },
    });
  }

  async deleteReservation(id: string) {
    const reservation = await this.findOneReservation(id);

    // Release reserved quantity
    const stockLevel = await this.prisma.stockLevel.findFirst({
      where: {
        itemId: reservation.itemId,
        warehouseId: reservation.warehouseId,
        locationId: reservation.locationId || null,
      },
    });

    if (stockLevel) {
      await this.prisma.stockLevel.update({
        where: { id: stockLevel.id },
        data: {
          foglaltMennyiseg: Math.max(0, (stockLevel.foglaltMennyiseg || 0) - reservation.mennyiseg),
        },
      });
    }

    return this.prisma.stockReservation.delete({
      where: { id },
    });
  }

  // Expected Receipts
  async findAllExpectedReceipts(skip = 0, take = 50, filters?: {
    warehouseId?: string;
    purchaseOrderId?: string;
    allapot?: string;
    vartBeerkezesFrom?: string;
    vartBeerkezesTo?: string;
  }) {
    const where: any = {};

    if (filters?.warehouseId) {
      where.warehouseId = filters.warehouseId;
    }

    if (filters?.purchaseOrderId) {
      where.purchaseOrderId = filters.purchaseOrderId;
    }

    if (filters?.allapot) {
      where.allapot = filters.allapot;
    }

    if (filters?.vartBeerkezesFrom || filters?.vartBeerkezesTo) {
      where.vartBeerkezes = {};
      if (filters.vartBeerkezesFrom) {
        where.vartBeerkezes.gte = new Date(filters.vartBeerkezesFrom);
      }
      if (filters.vartBeerkezesTo) {
        where.vartBeerkezes.lte = new Date(filters.vartBeerkezesTo);
      }
    }

    const [total, items] = await Promise.all([
      this.prisma.expectedReceipt.count({ where }),
      this.prisma.expectedReceipt.findMany({
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
          _count: {
            select: {
              items: true,
            },
          },
        },
        orderBy: {
          vartBeerkezes: 'asc',
        },
      }),
    ]);

    return { total, items };
  }

  async findOneExpectedReceipt(id: string) {
    const receipt = await this.prisma.expectedReceipt.findUnique({
      where: { id },
      include: {
        warehouse: true,
        items: {
          include: {
            item: true,
          },
        },
      },
    });

    if (!receipt) {
      throw new NotFoundException('Várható beérkezés nem található');
    }

    return receipt;
  }

  async createExpectedReceipt(dto: CreateExpectedReceiptDto) {
    // Validate warehouse
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: dto.warehouseId },
    });

    if (!warehouse) {
      throw new NotFoundException('Raktár nem található');
    }

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Legalább egy tétel szükséges');
    }

    // Validate items
    for (const itemDto of dto.items) {
      const item = await this.prisma.item.findUnique({
        where: { id: itemDto.itemId },
      });

      if (!item) {
        throw new NotFoundException(`Termék nem található: ${itemDto.itemId}`);
      }
    }

    return this.prisma.expectedReceipt.create({
      data: {
        warehouseId: dto.warehouseId,
        purchaseOrderId: dto.purchaseOrderId,
        vartBeerkezes: new Date(dto.vartBeerkezes),
        megjegyzesek: dto.megjegyzesek,
        items: {
          create: dto.items.map(itemDto => ({
            itemId: itemDto.itemId,
            mennyiseg: itemDto.mennyiseg,
            egysegAr: itemDto.egysegAr,
            megjegyzesek: itemDto.megjegyzesek,
          })),
        },
      },
      include: {
        warehouse: true,
        items: {
          include: {
            item: true,
          },
        },
      },
    });
  }

  async markExpectedReceiptAsReceived(id: string) {
    const receipt = await this.findOneExpectedReceipt(id);

    if (receipt.allapot === 'ERKEZETT') {
      throw new BadRequestException('A beérkezés már rögzítve van');
    }

    return this.prisma.expectedReceipt.update({
      where: { id },
      data: {
        allapot: 'ERKEZETT',
      },
      include: {
        warehouse: true,
        items: {
          include: {
            item: true,
          },
        },
      },
    });
  }

  async deleteExpectedReceipt(id: string) {
    const receipt = await this.findOneExpectedReceipt(id);
    return this.prisma.expectedReceipt.delete({
      where: { id },
    });
  }

  async getAvailableStock(itemId: string, warehouseId: string, locationId?: string) {
    const stockLevel = await this.prisma.stockLevel.findFirst({
      where: {
        itemId,
        warehouseId,
        locationId: locationId || null,
      },
    });

    const totalStock = stockLevel?.mennyiseg || 0;
    const reservedStock = stockLevel?.foglaltMennyiseg || 0;
    const availableStock = totalStock - reservedStock;

    return {
      totalStock,
      reservedStock,
      availableStock,
    };
  }
}

