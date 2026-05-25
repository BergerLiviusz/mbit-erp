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
exports.HrOnboardingController = void 0;
var common_1 = require("@nestjs/common");
var onboarding_service_1 = require("./onboarding.service");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var permission_enum_1 = require("../common/rbac/permission.enum");
var rbac_guard_1 = require("../common/rbac/rbac.guard");
var HrOnboardingController = /** @class */ (function () {
    function HrOnboardingController(svc) {
        this.svc = svc;
    }
    HrOnboardingController.prototype.listTemplates = function (aktiv) {
        return this.svc.listTemplates(aktiv === undefined ? undefined : aktiv === 'true');
    };
    HrOnboardingController.prototype.createTemplate = function (body) {
        return this.svc.createTemplate(body);
    };
    HrOnboardingController.prototype.updateTemplate = function (id, body) {
        return this.svc.updateTemplate(id, body);
    };
    HrOnboardingController.prototype.deleteTemplate = function (id) {
        return this.svc.deleteTemplate(id);
    };
    HrOnboardingController.prototype.start = function (body, req) {
        var _a, _b;
        var uid = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId);
        return this.svc.startInstance(body, uid || undefined);
    };
    HrOnboardingController.prototype.listInstances = function (employeeId, allapot) {
        return this.svc.listInstances({ employeeId: employeeId, allapot: allapot });
    };
    HrOnboardingController.prototype.complete = function (id) {
        return this.svc.completeInstance(id);
    };
    HrOnboardingController.prototype.analytics = function () {
        return this.svc.analytics();
    };
    __decorate([
        (0, common_1.Get)('templates'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_VIEW),
        __param(0, (0, common_1.Query)('aktiv')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], HrOnboardingController.prototype, "listTemplates", null);
    __decorate([
        (0, common_1.Post)('templates'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_CREATE),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], HrOnboardingController.prototype, "createTemplate", null);
    __decorate([
        (0, common_1.Put)('templates/:id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], HrOnboardingController.prototype, "updateTemplate", null);
    __decorate([
        (0, common_1.Delete)('templates/:id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_DELETE),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], HrOnboardingController.prototype, "deleteTemplate", null);
    __decorate([
        (0, common_1.Post)('instances'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_CREATE),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], HrOnboardingController.prototype, "start", null);
    __decorate([
        (0, common_1.Get)('instances'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_VIEW),
        __param(0, (0, common_1.Query)('employeeId')),
        __param(1, (0, common_1.Query)('allapot')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", void 0)
    ], HrOnboardingController.prototype, "listInstances", null);
    __decorate([
        (0, common_1.Post)('instances/:id/complete'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], HrOnboardingController.prototype, "complete", null);
    __decorate([
        (0, common_1.Get)('analytics'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_VIEW),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], HrOnboardingController.prototype, "analytics", null);
    HrOnboardingController = __decorate([
        (0, common_1.Controller)('hr/onboarding'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [onboarding_service_1.HrOnboardingService])
    ], HrOnboardingController);
    return HrOnboardingController;
}());
exports.HrOnboardingController = HrOnboardingController;
