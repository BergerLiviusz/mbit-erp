import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../common/audit/audit.module';
import { StorageModule } from '../common/storage/storage.module';
import { SystemModule } from '../system/system.module';

import { ItemController, ItemGroupController } from './item.controller';
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
import { InventorySheetController } from './inventory-sheet.controller';
import { InventorySheetService } from './inventory-sheet.service';
import { IntrastatController } from './intrastat.controller';
import { IntrastatService } from './intrastat.service';
import { StockValuationController } from './stock-valuation.controller';
import { StockValuationService } from './stock-valuation.service';
import { StockReservationController } from './stock-reservation.controller';
import { StockReservationService } from './stock-reservation.service';
import { PriceListController } from './price-list.controller';
import { PriceListService } from './price-list.service';

@Module({
  imports: [PrismaModule, AuditModule, StorageModule, SystemModule],
  controllers: [
    ItemController,
    ItemGroupController,
    WarehouseController,
    StockController,
    InventoryController,
    PurchaseOrderController,
    ReturnController,
    SupplierController,
    InventoryReportController,
    NotificationController,
    InventorySheetController,
    IntrastatController,
    StockValuationController,
    StockReservationController,
    PriceListController,
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
    InventorySheetService,
    IntrastatService,
    StockValuationService,
    StockReservationService,
    PriceListService,
  ],
  exports: [WarehouseService, InventoryService, PurchaseOrderService, StockValuationService, StockReservationService],
})
export class LogisticsModule {}
