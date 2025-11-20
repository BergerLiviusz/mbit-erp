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
import { ReturnController } from './return.controller';
import { ReturnService } from './return.service';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';
import { InventoryReportController } from './inventory-report.controller';
import { InventoryReportService } from './inventory-report.service';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [PrismaModule, AuditModule, StorageModule, SystemModule],
  controllers: [
    ItemController,
    WarehouseController,
    StockController,
    InventoryController,
    PurchaseOrderController,
    ReturnController,
    SupplierController,
    InventoryReportController,
    NotificationController,
  ],
  providers: [
    ItemService,
    WarehouseService,
    StockService,
    InventoryService,
    PurchaseOrderService,
    ReturnService,
    SupplierService,
    InventoryReportService,
    NotificationService,
  ],
  exports: [WarehouseService, InventoryService, PurchaseOrderService],
})
export class LogisticsModule {}
