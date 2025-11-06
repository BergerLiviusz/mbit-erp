import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WarehouseService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.warehouse.findMany({
      include: {
        stockLots: {
          include: {
            item: true,
          },
        },
      },
      orderBy: { nev: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.warehouse.findUnique({
      where: { id },
      include: {
        stockLots: {
          include: {
            item: true,
          },
        },
      },
    });
  }

  async create(data: any) {
    return this.prisma.warehouse.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return this.prisma.warehouse.update({
      where: { id },
      data,
    });
  }
}
