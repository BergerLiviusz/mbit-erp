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
exports.NotificationController = void 0;
var common_1 = require("@nestjs/common");
var notification_service_1 = require("./notification.service");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var permission_enum_1 = require("../common/rbac/permission.enum");
var rbac_guard_1 = require("../common/rbac/rbac.guard");
var NotificationController = /** @class */ (function () {
    function NotificationController(notificationService) {
        this.notificationService = notificationService;
    }
    NotificationController.prototype.getExpiringProducts = function (days) {
        var daysNumber = days ? parseInt(days) : 30;
        return this.notificationService.getExpiringProducts(daysNumber);
    };
    NotificationController.prototype.getLowStockItems = function () {
        return this.notificationService.getLowStockItems();
    };
    __decorate([
        (0, common_1.Get)('products'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.PRODUCT_VIEW),
        __param(0, (0, common_1.Query)('days')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], NotificationController.prototype, "getExpiringProducts", null);
    __decorate([
        (0, common_1.Get)('stock'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.STOCK_VIEW),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], NotificationController.prototype, "getLowStockItems", null);
    NotificationController = __decorate([
        (0, common_1.Controller)('logistics/notifications'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [notification_service_1.NotificationService])
    ], NotificationController);
    return NotificationController;
}());
exports.NotificationController = NotificationController;
