"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemModule = void 0;
var common_1 = require("@nestjs/common");
var settings_controller_1 = require("./settings.controller");
var settings_service_1 = require("./settings.service");
var health_controller_1 = require("./health.controller");
var diagnostics_controller_1 = require("./diagnostics.controller");
var user_controller_1 = require("./user.controller");
var user_service_1 = require("./user.service");
var role_controller_1 = require("./role.controller");
var role_service_1 = require("./role.service");
var bug_report_controller_1 = require("./bug-report.controller");
var bug_report_service_1 = require("./bug-report.service");
var version_controller_1 = require("./version.controller");
var prisma_module_1 = require("../prisma/prisma.module");
var backup_module_1 = require("../common/backup/backup.module");
var audit_module_1 = require("../common/audit/audit.module");
var storage_module_1 = require("../common/storage/storage.module");
var rbac_module_1 = require("../common/rbac/rbac.module");
var SystemModule = /** @class */ (function () {
    function SystemModule() {
    }
    SystemModule = __decorate([
        (0, common_1.Module)({
            imports: [prisma_module_1.PrismaModule, backup_module_1.BackupModule, audit_module_1.AuditModule, storage_module_1.StorageModule, rbac_module_1.RbacModule],
            controllers: [settings_controller_1.SystemSettingsController, health_controller_1.HealthController, diagnostics_controller_1.DiagnosticsController, version_controller_1.VersionController, user_controller_1.UserController, role_controller_1.RoleController, bug_report_controller_1.BugReportController],
            providers: [settings_service_1.SystemSettingsService, user_service_1.UserService, role_service_1.RoleService, bug_report_service_1.BugReportService],
            exports: [settings_service_1.SystemSettingsService, user_service_1.UserService, role_service_1.RoleService, bug_report_service_1.BugReportService],
        })
    ], SystemModule);
    return SystemModule;
}());
exports.SystemModule = SystemModule;
