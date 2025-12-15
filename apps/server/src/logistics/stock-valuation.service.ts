import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface StockValuationResult {
  itemId: string;
  itemNev: string;
  warehouseId: string;
  warehouseNev: string;
  mennyiseg: number;
  ertekelesMod: string;
  készletérték: number;
  atlagBeszerzesiAr: number;
  lotDetails: Array<{
    lotId: string;
    sarzsGyartasiSzam?: string | null;
    mennyiseg: number;
    beszerzesiAr: number;
    ertek: number;
    createdAt: string;
  }>;
}

@Injectable()
export class StockValuationService {
  constructor(private prisma: PrismaService) {}

  async calculateStockValue(
    itemId: string,
    warehouseId: string,
    ertekelesMod?: string,
  ): Promise<StockValuationResult> {
    // Get item
    const item = await this.prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('Termék nem található');
    }

    // Get warehouse
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });

    if (!warehouse) {
      throw new NotFoundException('Raktár nem található');
    }

    // Use warehouse's valuation method or provided one
    const valuationMethod = ertekelesMod || warehouse.ertekelesMod || 'FIFO';

    // Get all stock lots for this item in this warehouse
    const stockLots = await this.prisma.stockLot.findMany({
      where: {
        itemId,
        warehouseId,
        mennyiseg: {
          gt: 0,
        },
      },
      orderBy: {
        createdAt: valuationMethod === 'LIFO' ? 'desc' : 'asc', // LIFO: newest first, FIFO: oldest first
      },
    });

    if (stockLots.length === 0) {
      return {
        itemId,
        itemNev: item.nev,
        warehouseId,
        warehouseNev: warehouse.nev,
        mennyiseg: 0,
        ertekelesMod: valuationMethod,
        készletérték: 0,
        atlagBeszerzesiAr: 0,
        lotDetails: [],
      };
    }

    let készletérték = 0;
    const lotDetails: StockValuationResult['lotDetails'] = [];

    if (valuationMethod === 'AVG') {
      // Average method: calculate weighted average
      let totalValue = 0;
      let totalQuantity = 0;

      for (const lot of stockLots) {
        totalValue += lot.mennyiseg * lot.beszerzesiAr;
        totalQuantity += lot.mennyiseg;
        lotDetails.push({
          lotId: lot.id,
          sarzsGyartasiSzam: lot.sarzsGyartasiSzam,
          mennyiseg: lot.mennyiseg,
          beszerzesiAr: lot.beszerzesiAr,
          ertek: lot.mennyiseg * lot.beszerzesiAr,
          createdAt: lot.createdAt.toISOString(),
        });
      }

      const atlagBeszerzesiAr = totalQuantity > 0 ? totalValue / totalQuantity : 0;
      készletérték = totalValue;

      return {
        itemId,
        itemNev: item.nev,
        warehouseId,
        warehouseNev: warehouse.nev,
        mennyiseg: totalQuantity,
        ertekelesMod: valuationMethod,
        készletérték,
        atlagBeszerzesiAr,
        lotDetails,
      };
    } else {
      // FIFO or LIFO: use lot prices directly
      for (const lot of stockLots) {
        const lotValue = lot.mennyiseg * lot.beszerzesiAr;
        készletérték += lotValue;
        lotDetails.push({
          lotId: lot.id,
          sarzsGyartasiSzam: lot.sarzsGyartasiSzam,
          mennyiseg: lot.mennyiseg,
          beszerzesiAr: lot.beszerzesiAr,
          ertek: lotValue,
          createdAt: lot.createdAt.toISOString(),
        });
      }

      const totalQuantity = stockLots.reduce((sum, lot) => sum + lot.mennyiseg, 0);
      const atlagBeszerzesiAr = totalQuantity > 0 ? készletérték / totalQuantity : 0;

      return {
        itemId,
        itemNev: item.nev,
        warehouseId,
        warehouseNev: warehouse.nev,
        mennyiseg: totalQuantity,
        ertekelesMod: valuationMethod,
        készletérték,
        atlagBeszerzesiAr,
        lotDetails,
      };
    }
  }

  async calculateStockValueForSale(
    itemId: string,
    warehouseId: string,
    mennyiseg: number,
    ertekelesMod?: string,
  ): Promise<{
    koltseg: number;
    usedLots: Array<{
      lotId: string;
      mennyiseg: number;
      beszerzesiAr: number;
      koltseg: number;
    }>;
  }> {
    if (mennyiseg <= 0) {
      throw new BadRequestException('A mennyiségnek pozitívnak kell lennie');
    }

    // Get warehouse
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });

    if (!warehouse) {
      throw new NotFoundException('Raktár nem található');
    }

    const valuationMethod = ertekelesMod || warehouse.ertekelesMod || 'FIFO';

    // Get stock lots ordered by valuation method
    const stockLots = await this.prisma.stockLot.findMany({
      where: {
        itemId,
        warehouseId,
        mennyiseg: {
          gt: 0,
        },
      },
      orderBy: {
        createdAt: valuationMethod === 'LIFO' ? 'desc' : 'asc',
      },
    });

    let remainingQuantity = mennyiseg;
    let totalCost = 0;
    const usedLots: Array<{
      lotId: string;
      mennyiseg: number;
      beszerzesiAr: number;
      koltseg: number;
    }> = [];

    if (valuationMethod === 'AVG') {
      // Calculate average cost
      const totalValue = stockLots.reduce((sum, lot) => sum + lot.mennyiseg * lot.beszerzesiAr, 0);
      const totalQuantity = stockLots.reduce((sum, lot) => sum + lot.mennyiseg, 0);
      const avgCost = totalQuantity > 0 ? totalValue / totalQuantity : 0;

      totalCost = mennyiseg * avgCost;

      // Distribute across lots proportionally
      for (const lot of stockLots) {
        if (remainingQuantity <= 0) break;

        const proportion = lot.mennyiseg / totalQuantity;
        const usedFromLot = Math.min(lot.mennyiseg, remainingQuantity * proportion);
        const lotCost = usedFromLot * avgCost;

        usedLots.push({
          lotId: lot.id,
          mennyiseg: usedFromLot,
          beszerzesiAr: avgCost,
          koltseg: lotCost,
        });

        remainingQuantity -= usedFromLot;
      }
    } else {
      // FIFO or LIFO: use lot prices in order
      for (const lot of stockLots) {
        if (remainingQuantity <= 0) break;

        const usedFromLot = Math.min(lot.mennyiseg, remainingQuantity);
        const lotCost = usedFromLot * lot.beszerzesiAr;

        usedLots.push({
          lotId: lot.id,
          mennyiseg: usedFromLot,
          beszerzesiAr: lot.beszerzesiAr,
          koltseg: lotCost,
        });

        totalCost += lotCost;
        remainingQuantity -= usedFromLot;
      }
    }

    if (remainingQuantity > 0) {
      throw new BadRequestException(`Nincs elég készlet. Hiányzik: ${remainingQuantity}`);
    }

    return {
      koltseg: totalCost,
      usedLots,
    };
  }

  async getStockValuationReport(
    warehouseId?: string,
    ertekelesMod?: string,
    itemGroupId?: string,
  ): Promise<StockValuationResult[]> {
    const where: any = {};
    if (warehouseId) {
      where.warehouseId = warehouseId;
    }

    // Build item filter for itemGroupId
    const itemWhere: any = {};
    if (itemGroupId) {
      itemWhere.itemGroupId = itemGroupId;
    }

    // Get all items with stock - use StockLevel instead of StockLot to catch all items
    const stockLevels = await this.prisma.stockLevel.findMany({
      where: {
        ...where,
        mennyiseg: {
          gt: 0,
        },
        item: itemWhere,
      },
      include: {
        item: {
          include: {
            itemGroup: true,
          },
        },
        warehouse: true,
      },
      distinct: ['itemId', 'warehouseId'],
    });

    const results: StockValuationResult[] = [];

    for (const stockLevel of stockLevels) {
      // Check if there are stock lots for this item/warehouse
      const stockLots = await this.prisma.stockLot.findMany({
        where: {
          itemId: stockLevel.itemId,
          warehouseId: stockLevel.warehouseId,
          mennyiseg: {
            gt: 0,
          },
        },
      });

      // If there are stock lots, use the existing calculation
      if (stockLots.length > 0) {
        const valuation = await this.calculateStockValue(
          stockLevel.itemId,
          stockLevel.warehouseId,
          ertekelesMod,
        );
        results.push(valuation);
      } else {
        // If no stock lots but there is stock level, calculate based on stock level
        // Use average purchase price from item or default to 0
        const item = stockLevel.item;
        const warehouse = stockLevel.warehouse;
        
        // Try to get average purchase price from recent stock lots (any warehouse)
        const recentLots = await this.prisma.stockLot.findMany({
          where: {
            itemId: stockLevel.itemId,
            mennyiseg: {
              gt: 0,
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        });

        let avgPrice = 0;
        if (recentLots.length > 0) {
          const totalValue = recentLots.reduce((sum, lot) => sum + (lot.mennyiseg * lot.beszerzesiAr), 0);
          const totalQty = recentLots.reduce((sum, lot) => sum + lot.mennyiseg, 0);
          avgPrice = totalQty > 0 ? totalValue / totalQty : 0;
        }

        const készletérték = stockLevel.mennyiseg * avgPrice;

        results.push({
          itemId: stockLevel.itemId,
          itemNev: item.nev,
          warehouseId: stockLevel.warehouseId,
          warehouseNev: warehouse.nev,
          mennyiseg: stockLevel.mennyiseg,
          ertekelesMod: ertekelesMod || warehouse.ertekelesMod || 'FIFO',
          készletérték: készletérték,
          atlagBeszerzesiAr: avgPrice,
          lotDetails: [],
        });
      }
    }

    return results;
  }

  async updateWarehouseValuationMethod(
    warehouseId: string,
    ertekelesMod: string,
  ) {
    const validMethods = ['FIFO', 'LIFO', 'AVG'];
    if (!validMethods.includes(ertekelesMod)) {
      throw new BadRequestException('Érvénytelen értékelési módszer');
    }

    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });

    if (!warehouse) {
      throw new NotFoundException('Raktár nem található');
    }

    return this.prisma.warehouse.update({
      where: { id: warehouseId },
      data: {
        ertekelesMod,
      },
    });
  }
}

