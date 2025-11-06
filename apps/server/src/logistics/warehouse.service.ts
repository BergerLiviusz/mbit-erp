import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateWarehouseDto {
  azonosito: string;
  nev: string;
  cim?: string;
  aktiv?: boolean;
}

export interface UpdateWarehouseDto {
  azonosito?: string;
  nev?: string;
  cim?: string;
  aktiv?: boolean;
}

@Injectable()
export class WarehouseService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip = 0, take = 50) {
    const [total, data] = await Promise.all([
      this.prisma.warehouse.count(),
      this.prisma.warehouse.findMany({
        skip,
        take,
        include: {
          locations: true,
        },
        orderBy: { nev: 'asc' },
      }),
    ]);

    const page = Math.floor(skip / take) + 1;
    const pageSize = take;

    return { data, total, page, pageSize };
  }

  async findOne(id: string) {
    return this.prisma.warehouse.findUnique({
      where: { id },
      include: {
        locations: true,
        stockLevels: {
          include: {
            item: true,
          },
        },
      },
    });
  }

  async create(dto: CreateWarehouseDto) {
    return this.prisma.warehouse.create({
      data: {
        azonosito: dto.azonosito,
        nev: dto.nev,
        cim: dto.cim,
        aktiv: dto.aktiv !== undefined ? dto.aktiv : true,
      },
    });
  }

  async update(id: string, dto: UpdateWarehouseDto) {
    return this.prisma.warehouse.update({
      where: { id },
      data: dto,
    });
  }
}
