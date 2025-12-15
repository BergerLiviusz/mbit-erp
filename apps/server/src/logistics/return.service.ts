import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';
import { StockService } from './stock.service';

export interface ReturnFilters {
  orderId?: string;
  itemId?: string;
  warehouseId?: string;
  allapot?: string;
}

@Injectable()
export class ReturnService {
  constructor(
    private prisma: PrismaService,
    private stockService: StockService,
  ) {}

  async findAll(skip = 0, take = 50, filters?: ReturnFilters) {
    const where: any = {};

    if (filters?.orderId) {
      where.orderId = filters.orderId;
    }

    if (filters?.purchaseOrderId) {
      where.purchaseOrderId = filters.purchaseOrderId;
    }

    if (filters?.itemId) {
      where.itemId = filters.itemId;
    }

    if (filters?.warehouseId) {
      where.warehouseId = filters.warehouseId;
    }

    if (filters?.allapot) {
      where.allapot = filters.allapot;
    }

    const [total, items] = await Promise.all([
      this.prisma.return.count({ where }),
      this.prisma.return.findMany({
        where,
        skip,
        take,
        include: {
          order: {
            select: {
              id: true,
              azonosito: true,
            },
          },
          purchaseOrder: {
            select: {
              id: true,
              azonosito: true,
            },
          },
          item: {
            select: {
              id: true,
              azonosito: true,
              nev: true,
            },
          },
          warehouse: {
            select: {
              id: true,
              azonosito: true,
              nev: true,
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
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, items };
  }

  async findOne(id: string) {
    const returnItem = await this.prisma.return.findUnique({
      where: { id },
      include: {
        order: true,
        purchaseOrder: true,
        item: true,
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
      },
    });

    if (!returnItem) {
      throw new NotFoundException('Visszárú nem található');
    }

    return returnItem;
  }

  async create(dto: CreateReturnDto, userId?: string) {
    // Validate item exists
    const item = await this.prisma.item.findUnique({
      where: { id: dto.itemId },
    });

    if (!item) {
      throw new NotFoundException('Áru nem található');
    }

    // Validate warehouse exists
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: dto.warehouseId },
    });

    if (!warehouse) {
      throw new NotFoundException('Raktár nem található');
    }

    // Validate order if provided
    if (dto.orderId) {
      const order = await this.prisma.order.findUnique({
        where: { id: dto.orderId },
      });

      if (!order) {
        throw new NotFoundException('Rendelés nem található');
      }
    }

    // Validate purchase order if provided
    if (dto.purchaseOrderId) {
      const purchaseOrder = await this.prisma.purchaseOrder.findUnique({
        where: { id: dto.purchaseOrderId },
      });

      if (!purchaseOrder) {
        throw new NotFoundException('Beszerzési rendelés nem található');
      }
    }

    // Ensure only one of orderId or purchaseOrderId is provided
    if (dto.orderId && dto.purchaseOrderId) {
      throw new BadRequestException('Csak egy rendelés (order vagy purchaseOrder) adható meg');
    }

    return this.prisma.return.create({
      data: {
        orderId: dto.orderId || null,
        purchaseOrderId: dto.purchaseOrderId || null,
        itemId: dto.itemId,
        warehouseId: dto.warehouseId,
        mennyiseg: dto.mennyiseg,
        ok: dto.ok,
        visszaruDatum: dto.visszaruDatum ? new Date(dto.visszaruDatum) : new Date(),
        megjegyzesek: dto.megjegyzesek || null,
        createdById: userId || null,
        allapot: 'PENDING',
      },
      include: {
        order: true,
        purchaseOrder: true,
        item: true,
        warehouse: true,
        createdBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
      },
    });
  }

  async update(id: string, dto: UpdateReturnDto, userId?: string) {
    const returnItem = await this.findOne(id);

    // Only allow updates if status is PENDING
    if (returnItem.allapot !== 'PENDING') {
      throw new BadRequestException('Csak PENDING állapotú visszárú módosítható');
    }

    const updateData: any = {};

    if (dto.itemId !== undefined) {
      const item = await this.prisma.item.findUnique({
        where: { id: dto.itemId },
      });
      if (!item) {
        throw new NotFoundException('Áru nem található');
      }
      updateData.itemId = dto.itemId;
    }

    if (dto.warehouseId !== undefined) {
      const warehouse = await this.prisma.warehouse.findUnique({
        where: { id: dto.warehouseId },
      });
      if (!warehouse) {
        throw new NotFoundException('Raktár nem található');
      }
      updateData.warehouseId = dto.warehouseId;
    }

    if (dto.mennyiseg !== undefined) {
      updateData.mennyiseg = dto.mennyiseg;
    }

    if (dto.ok !== undefined) {
      updateData.ok = dto.ok;
    }

    if (dto.visszaruDatum !== undefined) {
      updateData.visszaruDatum = new Date(dto.visszaruDatum);
    }

    if (dto.megjegyzesek !== undefined) {
      updateData.megjegyzesek = dto.megjegyzesek;
    }

    // Validate purchase order if provided
    if (dto.purchaseOrderId !== undefined) {
      if (dto.purchaseOrderId) {
        const purchaseOrder = await this.prisma.purchaseOrder.findUnique({
          where: { id: dto.purchaseOrderId },
        });
        if (!purchaseOrder) {
          throw new NotFoundException('Beszerzési rendelés nem található');
        }
      }
      updateData.purchaseOrderId = dto.purchaseOrderId || null;
    }

    return this.prisma.return.update({
      where: { id },
      data: updateData,
      include: {
        order: true,
        purchaseOrder: true,
        item: true,
        warehouse: true,
        createdBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
      },
    });
  }

  async approve(id: string, userId: string, megjegyzesek?: string) {
    const returnItem = await this.findOne(id);

    if (returnItem.allapot !== 'PENDING') {
      throw new BadRequestException('Csak PENDING állapotú visszárú jóváhagyható');
    }

    // Update return status
    const updatedReturn = await this.prisma.return.update({
      where: { id },
      data: {
        allapot: 'APPROVED',
        approvedById: userId,
        megjegyzesek: megjegyzesek || returnItem.megjegyzesek,
      },
      include: {
        order: true,
        purchaseOrder: true,
        item: true,
        warehouse: true,
        approvedBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
      },
    });

    // Create StockMove for return
    await this.stockService.createStockMove({
      itemId: returnItem.itemId,
      warehouseId: returnItem.warehouseId,
      tipus: 'RETURN',
      mennyiseg: returnItem.mennyiseg,
      referenciaId: id,
      megjegyzesek: `Visszárú jóváhagyva: ${megjegyzesek || ''}`,
    });

    return updatedReturn;
  }

  async reject(id: string, userId: string, reason?: string) {
    const returnItem = await this.findOne(id);

    if (returnItem.allapot !== 'PENDING') {
      throw new BadRequestException('Csak PENDING állapotú visszárú elutasítható');
    }

    return this.prisma.return.update({
      where: { id },
      data: {
        allapot: 'REJECTED',
        approvedById: userId,
        megjegyzesek: reason || returnItem.megjegyzesek || 'Elutasítva',
      },
      include: {
        order: true,
        purchaseOrder: true,
        item: true,
        warehouse: true,
        approvedBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
      },
    });
  }

  async complete(id: string, userId: string) {
    const returnItem = await this.findOne(id);

    if (returnItem.allapot !== 'APPROVED') {
      throw new BadRequestException('Csak APPROVED állapotú visszárú feldolgozható');
    }

    // Find stock level
    const stockLevel = await this.prisma.stockLevel.findFirst({
      where: {
        itemId: returnItem.itemId,
        warehouseId: returnItem.warehouseId,
      },
    });

    // Different logic for Order vs PurchaseOrder returns
    if (returnItem.purchaseOrderId) {
      // Purchase return: decrease stock (returning goods to supplier)
      if (stockLevel) {
        const availableStock = stockLevel.mennyiseg - (stockLevel.foglaltMennyiseg || 0);
        if (availableStock < returnItem.mennyiseg) {
          throw new BadRequestException(
            `Nincs elég készlet a visszárúhoz. Elérhető: ${availableStock}, Kért: ${returnItem.mennyiseg}`
          );
        }

        await this.prisma.stockLevel.update({
          where: { id: stockLevel.id },
          data: {
            mennyiseg: {
              decrement: returnItem.mennyiseg,
            },
          },
        });
      } else {
        throw new BadRequestException('Nincs készlet a visszárúhoz');
      }

      // Create stock move for audit trail
      await this.prisma.stockMove.create({
        data: {
          itemId: returnItem.itemId,
          warehouseId: returnItem.warehouseId,
          tipus: 'BESZERZES_VISSZARU',
          mennyiseg: -returnItem.mennyiseg,
          referenciaId: returnItem.purchaseOrderId,
          megjegyzesek: `Beszerzési visszárú: ${returnItem.purchaseOrder?.azonosito || returnItem.purchaseOrderId}`,
        },
      });
    } else {
      // Order return: increase stock (customer returning goods)
      if (stockLevel) {
        await this.prisma.stockLevel.update({
          where: { id: stockLevel.id },
          data: {
            mennyiseg: {
              increment: returnItem.mennyiseg,
            },
          },
        });
      } else {
        // Create new stock level if it doesn't exist
        await this.prisma.stockLevel.create({
          data: {
            itemId: returnItem.itemId,
            warehouseId: returnItem.warehouseId,
            mennyiseg: returnItem.mennyiseg,
          },
        });
      }

      // Create stock move for audit trail
      await this.prisma.stockMove.create({
        data: {
          itemId: returnItem.itemId,
          warehouseId: returnItem.warehouseId,
          tipus: 'ELADAS_VISSZARU',
          mennyiseg: returnItem.mennyiseg,
          referenciaId: returnItem.orderId || id,
          megjegyzesek: `Eladási visszárú: ${returnItem.order?.azonosito || returnItem.orderId || id}`,
        },
      });
    }

    // Update return status to COMPLETED
    return this.prisma.return.update({
      where: { id },
      data: {
        allapot: 'COMPLETED',
      },
      include: {
        order: true,
        purchaseOrder: true,
        item: true,
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
      },
    });
  }

  async getByOrder(orderId: string) {
    return this.prisma.return.findMany({
      where: { orderId },
      include: {
        purchaseOrder: true,
        item: true,
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
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getByPurchaseOrder(purchaseOrderId: string) {
    return this.prisma.return.findMany({
      where: { purchaseOrderId },
      include: {
        order: true,
        item: true,
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
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

