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
exports.HrLeaveController = void 0;
var common_1 = require("@nestjs/common");
var leave_service_1 = require("./leave.service");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var permission_enum_1 = require("../common/rbac/permission.enum");
var rbac_guard_1 = require("../common/rbac/rbac.guard");
var HrLeaveController = /** @class */ (function () {
    function HrLeaveController(svc) {
        this.svc = svc;
    }
    HrLeaveController.prototype.listAll = function (allapot, employeeId) {
        return this.svc.listAll({ allapot: allapot, employeeId: employeeId });
    };
    HrLeaveController.prototype.forEmployee = function (employeeId) {
        return this.svc.listForEmployee(employeeId);
    };
    HrLeaveController.prototype.pendingForMe = function (req) {
        var _a, _b;
        var uid = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId);
        return this.svc.listPendingForApprover(uid);
    };
    HrLeaveController.prototype.summary = function (ev) {
        return this.svc.summaryByStatus(ev ? parseInt(ev, 10) : undefined);
    };
    HrLeaveController.prototype.create = function (body, req) {
        var _a, _b;
        var uid = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId);
        return this.svc.createRequest(body, uid || undefined);
    };
    HrLeaveController.prototype.decide = function (id, body, req) {
        var _a, _b;
        var uid = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId);
        return this.svc.decide(id, uid, body);
    };
    __decorate([
        (0, common_1.Get)('requests'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_VIEW),
        __param(0, (0, common_1.Query)('allapot')),
        __param(1, (0, common_1.Query)('employeeId')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", void 0)
    ], HrLeaveController.prototype, "listAll", null);
    __decorate([
        (0, common_1.Get)('employees/:employeeId/requests'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_VIEW),
        __param(0, (0, common_1.Param)('employeeId')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], HrLeaveController.prototype, "forEmployee", null);
    __decorate([
        (0, common_1.Get)('pending/my'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_APPROVE),
        __param(0, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], HrLeaveController.prototype, "pendingForMe", null);
    __decorate([
        (0, common_1.Get)('analytics/summary'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_VIEW),
        __param(0, (0, common_1.Query)('ev')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], HrLeaveController.prototype, "summary", null);
    __decorate([
        (0, common_1.Post)('requests'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_CREATE),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], HrLeaveController.prototype, "create", null);
    __decorate([
        (0, common_1.Post)('requests/:id/decide'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_APPROVE),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", void 0)
    ], HrLeaveController.prototype, "decide", null);
    HrLeaveController = __decorate([
        (0, common_1.Controller)('hr/leave'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [leave_service_1.HrLeaveService])
    ], HrLeaveController);
    return HrLeaveController;
}());
exports.HrLeaveController = HrLeaveController;
