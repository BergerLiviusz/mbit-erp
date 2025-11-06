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
}
