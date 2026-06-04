import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ItemStockService } from './item-stock.service';

@Injectable()
export class ItemService {
  constructor(
    private prisma: PrismaService,
    private itemStockService: ItemStockService,
  ) {}

  private mapItemDto(item: any, stockInfo?: Awaited<ReturnType<ItemStockService['getCurrentStockForItem']>>) {
    const purchasePrice = item.beszerzesiAr ?? 0;
    return {
      ...item,
      purchasePrice,
      beszerzesiAr: purchasePrice,
      ...(stockInfo
        ? {
            currentStockQuantity: stockInfo.currentStockQuantity,
            stockByWarehouse: stockInfo.stockByWarehouse,
            stockValue: stockInfo.stockValue,
            lastStockUpdateAt: stockInfo.lastStockUpdateAt,
            nearestExpiryDate: stockInfo.nearestExpiryDate,
          }
        : {}),
      stockLots: item.stockLots?.map((lot: any) => ({
        ...lot,
        expiryDate: lot.lejarat ? lot.lejarat.toISOString?.() ?? lot.lejarat : null,
        lejarat: lot.lejarat ? lot.lejarat.toISOString?.() ?? lot.lejarat : null,
      })),
    };
  }

  async findAll(skip = 0, take = 50, search?: string) {
    const where = search
      ? {
          OR: [{ nev: { contains: search } }, { azonosito: { contains: search } }],
        }
      : {};

    const [total, items] = await Promise.all([
      this.prisma.item.count({ where }),
      this.prisma.item.findMany({
        where,
        skip,
        take,
        include: {
          itemGroup: true,
          stockLevels: {
            include: { warehouse: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      total,
      items: items.map((item) => this.mapItemDto(item)),
    };
  }

  async findOne(id: string) {
    const item = await this.prisma.item.findUnique({
      where: { id },
      include: {
        itemGroup: true,
        stockLevels: {
          include: { warehouse: true },
        },
        stockLots: {
          where: { mennyiseg: { gt: 0 } },
          include: { warehouse: true },
          orderBy: { createdAt: 'asc' },
        },
        priceLists: {
          include: {
            priceList: {
              include: { supplier: true },
            },
          },
        },
        itemSuppliers: {
          include: { supplier: true },
          orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }],
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Termék nem található');
    }

    const stockInfo = await this.itemStockService.getCurrentStockForItem(id);
    return this.mapItemDto(item, stockInfo);
  }

  async findItemLots(id: string) {
    const item = await this.prisma.item.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException('Termék nem található');
    }

    const lots = await this.prisma.stockLot.findMany({
      where: { itemId: id },
      include: { warehouse: true },
      orderBy: { createdAt: 'asc' },
    });

    return lots.map((lot) => ({
      id: lot.id,
      sarzsGyartasiSzam: lot.sarzsGyartasiSzam,
      mennyiseg: lot.mennyiseg,
      beszerzesiAr: lot.beszerzesiAr,
      lejarat: lot.lejarat ? lot.lejarat.toISOString() : null,
      expiryDate: lot.lejarat ? lot.lejarat.toISOString() : null,
      warehouseId: lot.warehouseId,
      warehouse: lot.warehouse
        ? { id: lot.warehouse.id, nev: lot.warehouse.nev, azonosito: lot.warehouse.azonosito }
        : null,
      createdAt: lot.createdAt.toISOString(),
    }));
  }

  async create(data: any) {
    if (!data.nev || !data.azonosito) {
      throw new Error('Termék név és azonosító megadása kötelező');
    }

    if (
      data.beszerzesiAr !== undefined &&
      (isNaN(parseFloat(data.beszerzesiAr)) || parseFloat(data.beszerzesiAr) < 0)
    ) {
      throw new Error('Érvénytelen beszerzési ár');
    }

    if (
      data.eladasiAr !== undefined &&
      (isNaN(parseFloat(data.eladasiAr)) || parseFloat(data.eladasiAr) < 0)
    ) {
      throw new Error('Érvénytelen eladási ár');
    }

    if (
      data.afaKulcs !== undefined &&
      (isNaN(parseFloat(data.afaKulcs)) || parseFloat(data.afaKulcs) < 0 || parseFloat(data.afaKulcs) > 100)
    ) {
      throw new Error('Érvénytelen ÁFA kulcs (0-100% között kell lennie)');
    }

    if (data.szavatossagiIdoNap !== undefined && data.szavatossagiIdoNap !== null) {
      const warrantyDays = parseInt(data.szavatossagiIdoNap);
      if (isNaN(warrantyDays) || warrantyDays < 0) {
        throw new Error('Érvénytelen szavatossági idő (pozitív szám kell legyen)');
      }
      data.szavatossagiIdoNap = warrantyDays;
    }

    const existingItem = await this.prisma.item.findUnique({
      where: { azonosito: data.azonosito },
    });

    if (existingItem) {
      throw new Error(`Már létezik termék ezzel az azonosítóval: ${data.azonosito}`);
    }

    try {
      const created = await this.prisma.item.create({
        data,
        include: { itemGroup: true },
      });
      return this.mapItemDto(created);
    } catch (error: any) {
      if (error.message?.includes('no such column') || error.message?.includes('does not exist')) {
        throw new Error('Adatbázis séma hiba: hiányzó oszlop. Kérem futtassa a migrációkat.');
      }
      throw error;
    }
  }

  async update(id: string, data: any) {
    const updated = await this.prisma.item.update({
      where: { id },
      data,
      include: { itemGroup: true },
    });
    return this.mapItemDto(updated);
  }

  async delete(id: string) {
    return this.prisma.item.delete({
      where: { id },
    });
  }

  async findAllItemGroups(skip = 0, take = 100) {
    const [total, data] = await Promise.all([
      this.prisma.itemGroup.count(),
      this.prisma.itemGroup.findMany({
        skip,
        take,
        orderBy: { nev: 'asc' },
        include: {
          _count: { select: { items: true } },
        },
      }),
    ]);

    return { total, data };
  }

  async findOneItemGroup(id: string) {
    return this.prisma.itemGroup.findUnique({
      where: { id },
      include: {
        _count: { select: { items: true } },
      },
    });
  }

  async createItemGroup(data: { nev: string; leiras?: string }) {
    const existing = await this.prisma.itemGroup.findUnique({
      where: { nev: data.nev },
    });

    if (existing) {
      throw new Error(`Már létezik cikkcsoport ezzel a névvel: ${data.nev}`);
    }

    return this.prisma.itemGroup.create({ data });
  }

  async updateItemGroup(id: string, data: { nev?: string; leiras?: string }) {
    if (data.nev) {
      const existing = await this.prisma.itemGroup.findUnique({
        where: { nev: data.nev },
      });

      if (existing && existing.id !== id) {
        throw new Error(`Már létezik cikkcsoport ezzel a névvel: ${data.nev}`);
      }
    }

    return this.prisma.itemGroup.update({
      where: { id },
      data,
    });
  }

  async deleteItemGroup(id: string) {
    const itemCount = await this.prisma.item.count({
      where: { itemGroupId: id },
    });

    if (itemCount > 0) {
      throw new Error(`Nem lehet törölni a cikkcsoportot, mert ${itemCount} termék tartozik hozzá`);
    }

    return this.prisma.itemGroup.delete({
      where: { id },
    });
  }
}
