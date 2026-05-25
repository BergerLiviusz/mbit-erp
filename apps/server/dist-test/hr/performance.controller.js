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
exports.HrPerformanceController = void 0;
var common_1 = require("@nestjs/common");
var performance_service_1 = require("./performance.service");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var permission_enum_1 = require("../common/rbac/permission.enum");
var rbac_guard_1 = require("../common/rbac/rbac.guard");
var HrPerformanceController = /** @class */ (function () {
    function HrPerformanceController(svc) {
        this.svc = svc;
    }
    HrPerformanceController.prototype.listGoals = function (employeeId) {
        return this.svc.listGoals(employeeId);
    };
    HrPerformanceController.prototype.analytics = function () {
        return this.svc.summaryByGoalStatus();
    };
    HrPerformanceController.prototype.createGoal = function (body, req) {
        var _a, _b;
        var uid = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId);
        return this.svc.createGoal(body, uid || undefined);
    };
    HrPerformanceController.prototype.updateGoal = function (id, body) {
        return this.svc.updateGoal(id, body);
    };
    HrPerformanceController.prototype.addActivity = function (id, body) {
        return this.svc.addActivity(id, body.megjegyzes);
    };
    HrPerformanceController.prototype.deleteGoal = function (id) {
        return this.svc.deleteGoal(id);
    };
    __decorate([
        (0, common_1.Get)('goals'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_VIEW),
        __param(0, (0, common_1.Query)('employeeId')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], HrPerformanceController.prototype, "listGoals", null);
    __decorate([
        (0, common_1.Get)('analytics/goals'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_VIEW),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], HrPerformanceController.prototype, "analytics", null);
    __decorate([
        (0, common_1.Post)('goals'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_CREATE),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], HrPerformanceController.prototype, "createGoal", null);
    __decorate([
        (0, common_1.Put)('goals/:id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], HrPerformanceController.prototype, "updateGoal", null);
    __decorate([
        (0, common_1.Post)('goals/:id/activities'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], HrPerformanceController.prototype, "addActivity", null);
    __decorate([
        (0, common_1.Delete)('goals/:id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_DELETE),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], HrPerformanceController.prototype, "deleteGoal", null);
    HrPerformanceController = __decorate([
        (0, common_1.Controller)('hr/performance'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [performance_service_1.HrPerformanceService])
    ], HrPerformanceController);
    return HrPerformanceController;
}());
exports.HrPerformanceController = HrPerformanceController;
