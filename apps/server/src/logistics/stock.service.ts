import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip = 0, take = 100) {
    const [total, items] = await Promise.all([
      this.prisma.stockLot.count(),
      this.prisma.stockLot.findMany({
        skip,
        take,
        include: {
          item: true,
          warehouse: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, items };
  }

  async getLowStock() {
    return this.prisma.stockLot.findMany({
      where: {
        OR: [
          {
            mennyiseg: {
              lte: this.prisma.stockLot.fields.minKeszlet,
            },
          },
        ],
      },
      include: {
        item: true,
        warehouse: true,
      },
    });
  }

  async createStockMove(data: any) {
    return this.prisma.stockMove.create({
      data,
    });
  }

  async getStockMovements(filters?: {
    itemId?: string;
    warehouseId?: string;
    skip?: number;
    take?: number;
  }) {
    const where: any = {};
    if (filters?.itemId) where.itemId = filters.itemId;
    if (filters?.warehouseId) where.warehouseId = filters.warehouseId;

    const skip = filters?.skip || 0;
    const take = filters?.take || 100;

    const [total, movements] = await Promise.all([
      this.prisma.stockMove.count({ where }),
      this.prisma.stockMove.findMany({
        where,
        skip,
        take,
        include: {
          item: true,
          warehouse: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, movements };
  }
}
