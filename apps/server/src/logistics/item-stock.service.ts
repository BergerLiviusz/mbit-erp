import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface StockByWarehouseEntry {
  warehouseId: string;
  warehouseNev: string;
  warehouseAzonosito: string;
  mennyiseg: number;
  lots: Array<{
    id: string;
    sarzsGyartasiSzam: string | null;
    mennyiseg: number;
    beszerzesiAr: number;
    lejarat: string | null;
    createdAt: string;
  }>;
}

export interface CurrentStockForItem {
  currentStockQuantity: number;
  stockByWarehouse: StockByWarehouseEntry[];
  stockValue: number;
  lastStockUpdateAt: string | null;
  nearestExpiryDate: string | null;
}

@Injectable()
export class ItemStockService {
  constructor(private prisma: PrismaService) {}

  async getCurrentStockForItem(itemId: string): Promise<CurrentStockForItem> {
    const [stockLevels, stockLots, latestMove, item] = await Promise.all([
      this.prisma.stockLevel.findMany({
        where: { itemId },
        include: { warehouse: true },
      }),
      this.prisma.stockLot.findMany({
        where: { itemId, mennyiseg: { gt: 0 } },
        include: { warehouse: true },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.stockMove.findFirst({
        where: { itemId },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
      this.prisma.item.findUnique({
        where: { id: itemId },
        select: { beszerzesiAr: true },
      }),
    ]);

    const warehouseMap = new Map<string, StockByWarehouseEntry>();

    for (const level of stockLevels) {
      warehouseMap.set(level.warehouseId, {
        warehouseId: level.warehouseId,
        warehouseNev: level.warehouse?.nev || '',
        warehouseAzonosito: level.warehouse?.azonosito || '',
        mennyiseg: level.mennyiseg,
        lots: [],
      });
    }

    for (const lot of stockLots) {
      let entry = warehouseMap.get(lot.warehouseId);
      if (!entry) {
        entry = {
          warehouseId: lot.warehouseId,
          warehouseNev: lot.warehouse?.nev || '',
          warehouseAzonosito: lot.warehouse?.azonosito || '',
          mennyiseg: 0,
          lots: [],
        };
        warehouseMap.set(lot.warehouseId, entry);
      }
      entry.lots.push({
        id: lot.id,
        sarzsGyartasiSzam: lot.sarzsGyartasiSzam,
        mennyiseg: lot.mennyiseg,
        beszerzesiAr: lot.beszerzesiAr,
        lejarat: lot.lejarat ? lot.lejarat.toISOString() : null,
        createdAt: lot.createdAt.toISOString(),
      });
    }

    const stockByWarehouse = Array.from(warehouseMap.values());
    const currentStockQuantity = stockLevels.reduce((sum, sl) => sum + sl.mennyiseg, 0);

    const fallbackPrice = item?.beszerzesiAr ?? 0;
    let stockValue = 0;

    if (stockLots.length > 0) {
      stockValue = stockLots.reduce(
        (sum, lot) => sum + lot.mennyiseg * (lot.beszerzesiAr > 0 ? lot.beszerzesiAr : fallbackPrice),
        0,
      );
    } else {
      stockValue = currentStockQuantity * fallbackPrice;
    }

    const expiryDates = stockLots
      .map((lot) => lot.lejarat)
      .filter((d): d is Date => d !== null);
    const nearestExpiryDate =
      expiryDates.length > 0
        ? new Date(Math.min(...expiryDates.map((d) => d.getTime()))).toISOString()
        : null;

    const lastStockUpdateAt =
      stockLevels.length > 0
        ? new Date(
            Math.max(
              ...stockLevels.map((sl) => sl.updatedAt.getTime()),
              latestMove?.createdAt?.getTime() ?? 0,
            ),
          ).toISOString()
        : latestMove?.createdAt?.toISOString() ?? null;

    return {
      currentStockQuantity,
      stockByWarehouse,
      stockValue,
      lastStockUpdateAt,
      nearestExpiryDate,
    };
  }

  resolvePurchasePrice(
    itemBeszerzesiAr: number,
    lots: Array<{ mennyiseg: number; beszerzesiAr: number }>,
  ): { atlagBeszerzesiAr: number; priceSource: 'LOT_COST' | 'ITEM_PURCHASE_PRICE' | 'MISSING_PRICE' } {
    const lotsWithQty = lots.filter((l) => l.mennyiseg > 0);

    if (lotsWithQty.length > 0) {
      const totalQty = lotsWithQty.reduce((s, l) => s + l.mennyiseg, 0);
      const totalValue = lotsWithQty.reduce((s, l) => {
        const price = l.beszerzesiAr > 0 ? l.beszerzesiAr : itemBeszerzesiAr;
        return s + l.mennyiseg * price;
      }, 0);

      if (totalQty > 0 && totalValue > 0) {
        return { atlagBeszerzesiAr: totalValue / totalQty, priceSource: 'LOT_COST' };
      }
    }

    if (itemBeszerzesiAr > 0) {
      return { atlagBeszerzesiAr: itemBeszerzesiAr, priceSource: 'ITEM_PURCHASE_PRICE' };
    }

    return { atlagBeszerzesiAr: 0, priceSource: 'MISSING_PRICE' };
  }
}
