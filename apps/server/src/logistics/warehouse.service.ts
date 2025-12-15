import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateWarehouseDto {
  azonosito: string;
  nev: string;
  cim?: string;
  ertekelesMod?: string;
  aktiv?: boolean;
}

export interface UpdateWarehouseDto {
  azonosito?: string;
  nev?: string;
  cim?: string;
  ertekelesMod?: string;
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
    // If azonosito is not provided or empty, generate one
    let azonosito = dto.azonosito?.trim();
    if (!azonosito) {
      // Generate azonosito based on count
      const count = await this.prisma.warehouse.count();
      azonosito = `RKT-${String(count + 1).padStart(4, '0')}`;
    }
    
    // Check if azonosito already exists
    const existing = await this.prisma.warehouse.findUnique({
      where: { azonosito },
    });
    
    if (existing) {
      // If exists, append a suffix
      let counter = 1;
      let newAzonosito = `${azonosito}-${counter}`;
      while (await this.prisma.warehouse.findUnique({ where: { azonosito: newAzonosito } })) {
        counter++;
        newAzonosito = `${azonosito}-${counter}`;
      }
      azonosito = newAzonosito;
    }
    
    return this.prisma.warehouse.create({
      data: {
        azonosito,
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

  async delete(id: string) {
    // Check if warehouse has stock levels
    const stockLevelsCount = await this.prisma.stockLevel.count({
      where: { warehouseId: id },
    });

    if (stockLevelsCount > 0) {
      throw new Error(`Nem lehet törölni a raktárat, mert ${stockLevelsCount} készletszint tartozik hozzá`);
    }

    // Check if warehouse has stock lots
    const stockLotsCount = await this.prisma.stockLot.count({
      where: { warehouseId: id },
    });

    if (stockLotsCount > 0) {
      throw new Error(`Nem lehet törölni a raktárat, mert ${stockLotsCount} sarzs tartozik hozzá`);
    }

    // Check if warehouse has stock moves
    const stockMovesCount = await this.prisma.stockMove.count({
      where: { warehouseId: id },
    });

    if (stockMovesCount > 0) {
      throw new Error(`Nem lehet törölni a raktárat, mert ${stockMovesCount} készletmozgás tartozik hozzá`);
    }

    // Check if warehouse has stock reservations
    const stockReservationsCount = await this.prisma.stockReservation.count({
      where: { warehouseId: id },
    });

    if (stockReservationsCount > 0) {
      throw new Error(`Nem lehet törölni a raktárat, mert ${stockReservationsCount} készletfoglaltság tartozik hozzá`);
    }

    // Check if warehouse has inventory sheets
    const inventorySheetsCount = await this.prisma.inventorySheet.count({
      where: { warehouseId: id },
    });

    if (inventorySheetsCount > 0) {
      throw new Error(`Nem lehet törölni a raktárat, mert ${inventorySheetsCount} leltárív tartozik hozzá`);
    }

    // Check if warehouse has locations
    const locationsCount = await this.prisma.warehouseLocation.count({
      where: { warehouseId: id },
    });

    if (locationsCount > 0) {
      // Delete locations first (they have onDelete: Cascade)
      await this.prisma.warehouseLocation.deleteMany({
        where: { warehouseId: id },
      });
    }

    return this.prisma.warehouse.delete({
      where: { id },
    });
  }
}
