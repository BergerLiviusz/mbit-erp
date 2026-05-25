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
exports.DashboardController = void 0;
var common_1 = require("@nestjs/common");
var dashboard_aggregation_service_1 = require("./dashboard-aggregation.service");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var permission_enum_1 = require("../common/rbac/permission.enum");
var rbac_guard_1 = require("../common/rbac/rbac.guard");
var DashboardController = /** @class */ (function () {
    function DashboardController(dashboardService) {
        this.dashboardService = dashboardService;
    }
    DashboardController.prototype.getDashboard = function (module, dateFrom, dateTo) {
        return this.dashboardService.getDashboard({ module: module, dateFrom: dateFrom, dateTo: dateTo });
    };
    DashboardController.prototype.refresh = function (module, dateFrom, dateTo) {
        return this.dashboardService.getDashboard({ module: module, dateFrom: dateFrom, dateTo: dateTo });
    };
    __decorate([
        (0, common_1.Get)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.CONTROLLING_VIEW, permission_enum_1.Permission.REPORT_VIEW),
        __param(0, (0, common_1.Query)('module')),
        __param(1, (0, common_1.Query)('dateFrom')),
        __param(2, (0, common_1.Query)('dateTo')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String]),
        __metadata("design:returntype", void 0)
    ], DashboardController.prototype, "getDashboard", null);
    __decorate([
        (0, common_1.Get)('refresh'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.CONTROLLING_VIEW, permission_enum_1.Permission.REPORT_VIEW),
        __param(0, (0, common_1.Query)('module')),
        __param(1, (0, common_1.Query)('dateFrom')),
        __param(2, (0, common_1.Query)('dateTo')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String]),
        __metadata("design:returntype", void 0)
    ], DashboardController.prototype, "refresh", null);
    DashboardController = __decorate([
        (0, common_1.Controller)('controlling/dashboard'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [dashboard_aggregation_service_1.DashboardAggregationService])
    ], DashboardController);
    return DashboardController;
}());
exports.DashboardController = DashboardController;
