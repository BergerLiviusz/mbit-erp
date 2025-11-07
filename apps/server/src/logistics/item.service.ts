import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip = 0, take = 50, search?: string) {
    const where = search ? {
      OR: [
        { nev: { contains: search } },
        { azonosito: { contains: search } },
      ],
    } : {};

    const [total, items] = await Promise.all([
      this.prisma.item.count({ where }),
      this.prisma.item.findMany({
        where,
        skip,
        take,
        include: {
          itemGroup: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, items };
  }

  async findOne(id: string) {
    return this.prisma.item.findUnique({
      where: { id },
      include: {
        itemGroup: true,
        stockLots: {
          include: {
            warehouse: true,
          },
        },
        priceLists: {
          include: {
            priceList: {
              include: {
                supplier: true,
              },
            },
          },
        },
      },
    });
  }

  async create(data: any) {
    return this.prisma.item.create({
      data,
      include: { itemGroup: true },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.item.update({
      where: { id },
      data,
      include: { itemGroup: true },
    });
  }

  async delete(id: string) {
    return this.prisma.item.delete({
      where: { id },
    });
  }
}
