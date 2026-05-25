"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupModule = void 0;
var common_1 = require("@nestjs/common");
var backup_service_1 = require("./backup.service");
var prisma_module_1 = require("../../prisma/prisma.module");
var storage_module_1 = require("../storage/storage.module");
var BackupModule = /** @class */ (function () {
    function BackupModule() {
    }
    BackupModule = __decorate([
        (0, common_1.Global)(),
        (0, common_1.Module)({
            imports: [prisma_module_1.PrismaModule, storage_module_1.StorageModule],
            providers: [backup_service_1.BackupService],
            exports: [backup_service_1.BackupService],
        })
    ], BackupModule);
    return BackupModule;
}());
exports.BackupModule = BackupModule;
