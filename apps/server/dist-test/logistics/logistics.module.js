"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogisticsModule = void 0;
var common_1 = require("@nestjs/common");
var prisma_module_1 = require("../prisma/prisma.module");
var audit_module_1 = require("../common/audit/audit.module");
var storage_module_1 = require("../common/storage/storage.module");
var system_module_1 = require("../system/system.module");
var item_controller_1 = require("./item.controller");
var item_service_1 = require("./item.service");
var warehouse_controller_1 = require("./warehouse.controller");
var warehouse_service_1 = require("./warehouse.service");
var stock_controller_1 = require("./stock.controller");
var stock_service_1 = require("./stock.service");
var inventory_controller_1 = require("./inventory.controller");
var inventory_service_1 = require("./inventory.service");
var purchase_order_controller_1 = require("./purchase-order.controller");
var purchase_order_service_1 = require("./purchase-order.service");
var return_controller_1 = require("./return.controller");
var return_service_1 = require("./return.service");
var supplier_controller_1 = require("./supplier.controller");
var supplier_service_1 = require("./supplier.service");
var inventory_report_controller_1 = require("./inventory-report.controller");
var inventory_report_service_1 = require("./inventory-report.service");
var notification_controller_1 = require("./notification.controller");
var notification_service_1 = require("./notification.service");
var inventory_sheet_controller_1 = require("./inventory-sheet.controller");
var inventory_sheet_service_1 = require("./inventory-sheet.service");
var intrastat_controller_1 = require("./intrastat.controller");
var intrastat_service_1 = require("./intrastat.service");
var stock_valuation_controller_1 = require("./stock-valuation.controller");
var stock_valuation_service_1 = require("./stock-valuation.service");
var stock_reservation_controller_1 = require("./stock-reservation.controller");
var stock_reservation_service_1 = require("./stock-reservation.service");
var price_list_controller_1 = require("./price-list.controller");
var price_list_service_1 = require("./price-list.service");
var stock_movement_controller_1 = require("./stock-movement.controller");
var stock_movement_service_1 = require("./stock-movement.service");
var product_category_controller_1 = require("./product-category.controller");
var product_category_service_1 = require("./product-category.service");
var logistics_export_controller_1 = require("./logistics-export.controller");
var logistics_export_service_1 = require("./logistics-export.service");
var LogisticsModule = /** @class */ (function () {
    function LogisticsModule() {
    }
    LogisticsModule = __decorate([
        (0, common_1.Module)({
            imports: [prisma_module_1.PrismaModule, audit_module_1.AuditModule, storage_module_1.StorageModule, system_module_1.SystemModule],
            controllers: [
                item_controller_1.ItemController,
                item_controller_1.ItemGroupController,
                warehouse_controller_1.WarehouseController,
                stock_controller_1.StockController,
                inventory_controller_1.InventoryController,
                purchase_order_controller_1.PurchaseOrderController,
                return_controller_1.ReturnController,
                supplier_controller_1.SupplierController,
                inventory_report_controller_1.InventoryReportController,
                notification_controller_1.NotificationController,
                inventory_sheet_controller_1.InventorySheetController,
                intrastat_controller_1.IntrastatController,
                stock_valuation_controller_1.StockValuationController,
                stock_reservation_controller_1.StockReservationController,
                price_list_controller_1.PriceListController,
                stock_movement_controller_1.StockMovementController,
                product_category_controller_1.ProductCategoryController,
                logistics_export_controller_1.LogisticsExportController,
            ],
            providers: [
                item_service_1.ItemService,
                warehouse_service_1.WarehouseService,
                stock_service_1.StockService,
                inventory_service_1.InventoryService,
                purchase_order_service_1.PurchaseOrderService,
                return_service_1.ReturnService,
                supplier_service_1.SupplierService,
                inventory_report_service_1.InventoryReportService,
                notification_service_1.NotificationService,
                inventory_sheet_service_1.InventorySheetService,
                intrastat_service_1.IntrastatService,
                stock_valuation_service_1.StockValuationService,
                stock_reservation_service_1.StockReservationService,
                price_list_service_1.PriceListService,
                stock_movement_service_1.StockMovementService,
                product_category_service_1.ProductCategoryService,
                logistics_export_service_1.LogisticsExportService,
            ],
            exports: [
                warehouse_service_1.WarehouseService,
                inventory_service_1.InventoryService,
                purchase_order_service_1.PurchaseOrderService,
                stock_valuation_service_1.StockValuationService,
                stock_reservation_service_1.StockReservationService,
                stock_movement_service_1.StockMovementService,
            ],
        })
    ], LogisticsModule);
    return LogisticsModule;
}());
exports.LogisticsModule = LogisticsModule;
