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
exports.HrTimeTrackingController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var time_tracking_service_1 = require("./time-tracking.service");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var permission_enum_1 = require("../common/rbac/permission.enum");
var rbac_guard_1 = require("../common/rbac/rbac.guard");
var HrTimeTrackingController = /** @class */ (function () {
    function HrTimeTrackingController(svc) {
        this.svc = svc;
    }
    HrTimeTrackingController.prototype.listEntries = function (employeeId, from, to) {
        return this.svc.listEntries(employeeId, from, to);
    };
    HrTimeTrackingController.prototype.createEntry = function (body) {
        return this.svc.createEntry(body);
    };
    HrTimeTrackingController.prototype.deleteEntry = function (id) {
        return this.svc.deleteEntry(id);
    };
    HrTimeTrackingController.prototype.listBatches = function () {
        return this.svc.listImportBatches();
    };
    HrTimeTrackingController.prototype.importCsv = function (file) {
        if (!(file === null || file === void 0 ? void 0 : file.buffer))
            throw new common_1.BadRequestException('Fájl szükséges');
        return this.svc.importAccessCsvBuffer(file.buffer, file.originalname);
    };
    __decorate([
        (0, common_1.Get)('entries'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_VIEW),
        __param(0, (0, common_1.Query)('employeeId')),
        __param(1, (0, common_1.Query)('from')),
        __param(2, (0, common_1.Query)('to')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String]),
        __metadata("design:returntype", void 0)
    ], HrTimeTrackingController.prototype, "listEntries", null);
    __decorate([
        (0, common_1.Post)('entries'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_EDIT),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], HrTimeTrackingController.prototype, "createEntry", null);
    __decorate([
        (0, common_1.Delete)('entries/:id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_DELETE),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], HrTimeTrackingController.prototype, "deleteEntry", null);
    __decorate([
        (0, common_1.Get)('import-batches'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_VIEW),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], HrTimeTrackingController.prototype, "listBatches", null);
    __decorate([
        (0, common_1.Post)('import/access-csv'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_EDIT),
        (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
        __param(0, (0, common_1.UploadedFile)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], HrTimeTrackingController.prototype, "importCsv", null);
    HrTimeTrackingController = __decorate([
        (0, common_1.Controller)('hr/time'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [time_tracking_service_1.HrTimeTrackingService])
    ], HrTimeTrackingController);
    return HrTimeTrackingController;
}());
exports.HrTimeTrackingController = HrTimeTrackingController;
