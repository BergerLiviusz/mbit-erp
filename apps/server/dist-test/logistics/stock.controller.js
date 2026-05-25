"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockController = void 0;
var common_1 = require("@nestjs/common");
var stock_service_1 = require("./stock.service");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var permission_enum_1 = require("../common/rbac/permission.enum");
var rbac_guard_1 = require("../common/rbac/rbac.guard");
/** @deprecated Használja a /logistics/stock-movements végpontokat */
var StockController = /** @class */ (function () {
    function StockController(stockService) {
        this.stockService = stockService;
    }
    StockController.prototype.findAll = function (skip, take) {
        return this.stockService.findAll(skip ? parseInt(skip, 10) : 0, take ? parseInt(take, 10) : 100);
    };
    StockController.prototype.getLowStock = function () {
        return this.stockService.getLowStock();
    };
    StockController.prototype.getStockMovements = function (itemId, warehouseId, skip, take) {
        return this.stockService.getStockMovements({
            itemId: itemId,
            warehouseId: warehouseId,
            skip: skip ? parseInt(skip, 10) : undefined,
            take: take ? parseInt(take, 10) : undefined,
        });
    };
    __decorate([
        (0, common_1.Get)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.STOCK_VIEW, permission_enum_1.Permission.LOGISTICS_VIEW),
        __param(0, (0, common_1.Query)('skip')),
        __param(1, (0, common_1.Query)('take')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", void 0)
    ], StockController.prototype, "findAll", null);
    __decorate([
        (0, common_1.Get)('low-stock'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.STOCK_VIEW, permission_enum_1.Permission.LOGISTICS_VIEW),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], StockController.prototype, "getLowStock", null);
    __decorate([
        (0, common_1.Get)('movements'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.STOCK_VIEW, permission_enum_1.Permission.LOGISTICS_VIEW),
        __param(0, (0, common_1.Query)('itemId')),
        __param(1, (0, common_1.Query)('warehouseId')),
        __param(2, (0, common_1.Query)('skip')),
        __param(3, (0, common_1.Query)('take')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String, String]),
        __metadata("design:returntype", void 0)
    ], StockController.prototype, "getStockMovements", null);
    StockController = __decorate([
        (0, common_1.Controller)('logistics/stock'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [stock_service_1.StockService])
    ], StockController);
    return StockController;
}());
exports.StockController = StockController;
