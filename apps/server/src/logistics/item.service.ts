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
          stockLevels: {
            include: {
              warehouse: true,
            },
          },
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
        itemSuppliers: {
          include: {
            supplier: true,
          },
          orderBy: [
            { isPrimary: 'desc' },
            { createdAt: 'asc' },
          ],
        },
      },
    });
  }

  async create(data: any) {
    // Validate required fields
    if (!data.nev || !data.azonosito) {
      throw new Error('Termék név és azonosító megadása kötelező');
    }

    // Validate numeric fields
    if (data.beszerzesiAr !== undefined && (isNaN(parseFloat(data.beszerzesiAr)) || parseFloat(data.beszerzesiAr) < 0)) {
      throw new Error('Érvénytelen beszerzési ár');
    }

    if (data.eladasiAr !== undefined && (isNaN(parseFloat(data.eladasiAr)) || parseFloat(data.eladasiAr) < 0)) {
      throw new Error('Érvénytelen eladási ár');
    }

    if (data.afaKulcs !== undefined && (isNaN(parseFloat(data.afaKulcs)) || parseFloat(data.afaKulcs) < 0 || parseFloat(data.afaKulcs) > 100)) {
      throw new Error('Érvénytelen ÁFA kulcs (0-100% között kell lennie)');
    }

    // Validate szavatossagiIdoNap if provided
    if (data.szavatossagiIdoNap !== undefined && data.szavatossagiIdoNap !== null) {
      const warrantyDays = parseInt(data.szavatossagiIdoNap);
      if (isNaN(warrantyDays) || warrantyDays < 0) {
        throw new Error('Érvénytelen szavatossági idő (pozitív szám kell legyen)');
      }
      data.szavatossagiIdoNap = warrantyDays;
    }

    // Ensure azonosito is unique
    const existingItem = await this.prisma.item.findUnique({
      where: { azonosito: data.azonosito },
    });

    if (existingItem) {
      throw new Error(`Már létezik termék ezzel az azonosítóval: ${data.azonosito}`);
    }

    try {
      return await this.prisma.item.create({
        data,
        include: { itemGroup: true },
      });
    } catch (error: any) {
      // Check for database schema errors
      if (error.message?.includes('no such column') || error.message?.includes('does not exist')) {
        throw new Error('Adatbázis séma hiba: hiányzó oszlop. Kérem futtassa a migrációkat.');
      }
      throw error;
    }
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
