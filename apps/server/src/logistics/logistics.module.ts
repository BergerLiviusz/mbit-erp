import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../common/audit/audit.module';
import { StorageModule } from '../common/storage/storage.module';
import { SystemModule } from '../system/system.module';

import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { PurchaseOrderController } from './purchase-order.controller';
import { PurchaseOrderService } from './purchase-order.service';

@Module({
  imports: [PrismaModule, AuditModule, StorageModule, SystemModule],
  controllers: [
    ItemController,
    WarehouseController,
    StockController,
    InventoryController,
    PurchaseOrderController,
  ],
  providers: [
    ItemService,
    WarehouseService,
    StockService,
    InventoryService,
    PurchaseOrderService,
  ],
  exports: [WarehouseService, InventoryService, PurchaseOrderService],
})
export class LogisticsModule {}
