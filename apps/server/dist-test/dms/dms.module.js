"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DmsModule = void 0;
var common_1 = require("@nestjs/common");
var prisma_module_1 = require("../prisma/prisma.module");
var audit_module_1 = require("../common/audit/audit.module");
var storage_module_1 = require("../common/storage/storage.module");
var system_module_1 = require("../system/system.module");
var document_controller_1 = require("./document.controller");
var document_service_1 = require("./document.service");
var document_operations_service_1 = require("./document-operations.service");
var document_category_controller_1 = require("./document-category.controller");
var document_category_service_1 = require("./document-category.service");
var ocr_service_1 = require("./ocr.service");
var document_notification_controller_1 = require("./document-notification.controller");
var document_notification_service_1 = require("./document-notification.service");
var tag_controller_1 = require("./tag.controller");
var DmsModule = /** @class */ (function () {
    function DmsModule() {
    }
    DmsModule = __decorate([
        (0, common_1.Module)({
            imports: [
                prisma_module_1.PrismaModule,
                audit_module_1.AuditModule,
                storage_module_1.StorageModule,
                system_module_1.SystemModule,
            ],
            controllers: [
                document_controller_1.DocumentController,
                document_category_controller_1.DocumentCategoryController,
                document_notification_controller_1.DocumentNotificationController,
                tag_controller_1.TagController,
            ],
            providers: [
                document_service_1.DocumentService,
                document_operations_service_1.DocumentOperationsService,
                document_category_service_1.DocumentCategoryService,
                ocr_service_1.OcrService,
                document_notification_service_1.DocumentNotificationService,
            ],
            exports: [
                document_service_1.DocumentService,
                document_category_service_1.DocumentCategoryService,
            ],
        })
    ], DmsModule);
    return DmsModule;
}());
exports.DmsModule = DmsModule;
