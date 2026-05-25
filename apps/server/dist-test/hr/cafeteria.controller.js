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
exports.CafeteriaController = void 0;
var common_1 = require("@nestjs/common");
var cafeteria_service_1 = require("./cafeteria.service");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var permission_enum_1 = require("../common/rbac/permission.enum");
var rbac_guard_1 = require("../common/rbac/rbac.guard");
var CafeteriaController = /** @class */ (function () {
    function CafeteriaController(svc) {
        this.svc = svc;
    }
    CafeteriaController.prototype.listGroups = function (aktiv) {
        return this.svc.listGroups(aktiv === undefined ? undefined : aktiv === 'true');
    };
    CafeteriaController.prototype.createGroup = function (body) {
        return this.svc.createGroup(body);
    };
    CafeteriaController.prototype.updateGroup = function (id, body) {
        return this.svc.updateGroup(id, body);
    };
    CafeteriaController.prototype.deleteGroup = function (id) {
        return this.svc.deleteGroup(id);
    };
    CafeteriaController.prototype.createItem = function (groupId, body) {
        return this.svc.createItem(groupId, body);
    };
    CafeteriaController.prototype.updateItem = function (id, body) {
        return this.svc.updateItem(id, body);
    };
    CafeteriaController.prototype.deleteItem = function (id) {
        return this.svc.deleteItem(id);
    };
    CafeteriaController.prototype.listSelections = function (employeeId, ev) {
        return this.svc.listSelections(employeeId, ev ? parseInt(ev, 10) : undefined);
    };
    CafeteriaController.prototype.upsertSelection = function (body) {
        return this.svc.upsertSelection(body);
    };
    __decorate([
        (0, common_1.Get)('groups'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_VIEW),
        __param(0, (0, common_1.Query)('aktiv')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], CafeteriaController.prototype, "listGroups", null);
    __decorate([
        (0, common_1.Post)('groups'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_CREATE),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], CafeteriaController.prototype, "createGroup", null);
    __decorate([
        (0, common_1.Put)('groups/:id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], CafeteriaController.prototype, "updateGroup", null);
    __decorate([
        (0, common_1.Delete)('groups/:id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_DELETE),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], CafeteriaController.prototype, "deleteGroup", null);
    __decorate([
        (0, common_1.Post)('groups/:groupId/items'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_CREATE),
        __param(0, (0, common_1.Param)('groupId')),
        __param(1, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], CafeteriaController.prototype, "createItem", null);
    __decorate([
        (0, common_1.Put)('items/:id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], CafeteriaController.prototype, "updateItem", null);
    __decorate([
        (0, common_1.Delete)('items/:id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_DELETE),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], CafeteriaController.prototype, "deleteItem", null);
    __decorate([
        (0, common_1.Get)('employees/:employeeId/selections'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_VIEW),
        __param(0, (0, common_1.Param)('employeeId')),
        __param(1, (0, common_1.Query)('ev')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", void 0)
    ], CafeteriaController.prototype, "listSelections", null);
    __decorate([
        (0, common_1.Post)('selections'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_EDIT),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], CafeteriaController.prototype, "upsertSelection", null);
    CafeteriaController = __decorate([
        (0, common_1.Controller)('hr/cafeteria'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [cafeteria_service_1.CafeteriaService])
    ], CafeteriaController);
    return CafeteriaController;
}());
exports.CafeteriaController = CafeteriaController;
