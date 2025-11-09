import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SystemSettingsService } from '../system/settings.service';

export interface StockLevelDto {
  id: string;
  itemId: string;
  warehouseId: string;
  locationId: string | null;
  mennyiseg: number;
  minimum: number | null;
  maximum: number | null;
  createdAt: Date;
  updatedAt: Date;
  lowStockFlag: boolean;
  item?: any;
  warehouse?: any;
  location?: any;
}

export interface StockFilters {
  warehouseId?: string;
  itemId?: string;
  lowStockOnly?: boolean;
}

@Injectable()
export class InventoryService {
  constructor(
    private prisma: PrismaService,
    private settingsService: SystemSettingsService,
  ) {}

  private async getLowStockThreshold(): Promise<number> {
    const threshold = await this.settingsService.get('logistics.low_stock_threshold');
    return threshold ? parseFloat(threshold) : 10;
  }

  private async addLowStockFlag(stockLevel: any): Promise<StockLevelDto> {
    const threshold = await this.getLowStockThreshold();
    const lowStockFlag = stockLevel.minimum
      ? stockLevel.mennyiseg <= stockLevel.minimum
      : stockLevel.mennyiseg <= threshold;

    return {
      ...stockLevel,
      lowStockFlag,
    };
  }

  async findAllStockLevels(skip = 0, take = 50, filters?: StockFilters) {
    const where: any = {};

    if (filters?.warehouseId) {
      where.warehouseId = filters.warehouseId;
    }

    if (filters?.itemId) {
      where.itemId = filters.itemId;
    }

    const [total, items] = await Promise.all([
      this.prisma.stockLevel.count({ where }),
      this.prisma.stockLevel.findMany({
        where,
        skip,
        take,
        include: {
          item: true,
          warehouse: true,
          location: true,
        },
        orderBy: { updatedAt: 'desc' },
      }),
    ]);

    const data = await Promise.all(
      items.map((item) => this.addLowStockFlag(item)),
    );

    const page = Math.floor(skip / take) + 1;
    const pageSize = take;

    return { data, total, page, pageSize };
  }

  async getStockByWarehouse(warehouseId: string) {
    const stockLevels = await this.prisma.stockLevel.findMany({
      where: { warehouseId },
      include: {
        item: true,
        warehouse: true,
        location: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return await Promise.all(
      stockLevels.map((item) => this.addLowStockFlag(item)),
    );
  }

  async checkLowStock() {
    const threshold = await this.getLowStockThreshold();

    const allStockLevels = await this.prisma.stockLevel.findMany({
      include: {
        item: true,
        warehouse: true,
        location: true,
      },
    });

    const lowStockItems = allStockLevels.filter((stockLevel) => {
      return stockLevel.minimum
        ? stockLevel.mennyiseg <= stockLevel.minimum
        : stockLevel.mennyiseg <= threshold;
    });

    return await Promise.all(
      lowStockItems.map((item) => this.addLowStockFlag(item)),
    );
  }

  async createStockLevel(data: {
    itemId: string;
    warehouseId: string;
    locationId?: string | null;
    mennyiseg?: number;
    minimum?: number | null;
    maximum?: number | null;
  }) {
    // Check if stock level already exists
    const existing = await this.prisma.stockLevel.findUnique({
      where: {
        itemId_warehouseId_locationId: {
          itemId: data.itemId,
          warehouseId: data.warehouseId,
          locationId: data.locationId || null,
        },
      },
    });

    if (existing) {
      // Update existing stock level
      return await this.prisma.stockLevel.update({
        where: { id: existing.id },
        data: {
          mennyiseg: data.mennyiseg !== undefined ? data.mennyiseg : existing.mennyiseg,
          minimum: data.minimum !== undefined ? data.minimum : existing.minimum,
          maximum: data.maximum !== undefined ? data.maximum : existing.maximum,
        },
        include: {
          item: true,
          warehouse: true,
          location: true,
        },
      });
    }

    // Create new stock level
    return await this.prisma.stockLevel.create({
      data: {
        itemId: data.itemId,
        warehouseId: data.warehouseId,
        locationId: data.locationId || null,
        mennyiseg: data.mennyiseg || 0,
        minimum: data.minimum || null,
        maximum: data.maximum || null,
      },
      include: {
        item: true,
        warehouse: true,
        location: true,
      },
    });
  }

  async updateStockLevel(
    id: string,
    data: {
      mennyiseg?: number;
      minimum?: number | null;
      maximum?: number | null;
    },
  ) {
    return await this.prisma.stockLevel.update({
      where: { id },
      data,
      include: {
        item: true,
        warehouse: true,
        location: true,
      },
    });
  }

  async deleteStockLevel(id: string) {
    return await this.prisma.stockLevel.delete({
      where: { id },
    });
  }
}
