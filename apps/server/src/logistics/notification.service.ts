import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async getExpiringProducts(days: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);

    // Get items with warranty period set
    const items = await this.prisma.item.findMany({
      where: {
        aktiv: true,
        szavatossagiIdoNap: {
          not: null,
        },
      },
      include: {
        stockLots: true,
      },
    });

    const expiringProducts = [];

    for (const item of items) {
      if (!item.szavatossagiIdoNap) continue;

      // Calculate expiration date based on stock lot creation date + warranty period
      for (const lot of item.stockLots) {
        const expirationDate = new Date(lot.createdAt);
        expirationDate.setDate(expirationDate.getDate() + item.szavatossagiIdoNap);

        if (expirationDate <= cutoffDate && expirationDate >= new Date()) {
          const warehouse = await this.prisma.warehouse.findUnique({
            where: { id: lot.warehouseId },
          });

          expiringProducts.push({
            itemId: item.id,
            itemName: item.nev,
            itemAzonosito: item.azonosito,
            warehouseId: lot.warehouseId,
            warehouseName: warehouse?.nev || 'Ismeretlen raktár',
            expirationDate: expirationDate.toISOString(),
            daysUntilExpiration: Math.ceil((expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
            quantity: lot.mennyiseg,
          });
        }
      }
    }

    return expiringProducts.sort((a, b) => 
      new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime()
    );
  }

  async getLowStockItems() {
    const stockLevels = await this.prisma.stockLevel.findMany({
      where: {
        minimum: {
          not: null,
        },
        item: {
          aktiv: true,
        },
      },
      include: {
        item: true,
        warehouse: true,
      },
    });

    const lowStockItems = stockLevels
      .filter(sl => {
        if (sl.minimum === null) return false;
        return sl.mennyiseg <= sl.minimum;
      })
      .map(sl => ({
        id: sl.id,
        itemId: sl.itemId,
        itemName: sl.item.nev,
        itemAzonosito: sl.item.azonosito,
        warehouseId: sl.warehouseId,
        warehouseName: sl.warehouse.nev,
        currentStock: sl.mennyiseg,
        minimumStock: sl.minimum,
        maximumStock: sl.maximum,
      }));

    return lowStockItems;
  }
}

