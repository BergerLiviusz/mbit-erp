"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@mbit-erp/config");
var app_controller_1 = require("./app.controller");
var app_service_1 = require("./app.service");
var prisma_module_1 = require("./prisma/prisma.module");
var auth_module_1 = require("./auth/auth.module");
var crm_module_1 = require("./crm/crm.module");
var dms_module_1 = require("./dms/dms.module");
var logistics_module_1 = require("./logistics/logistics.module");
var audit_module_1 = require("./audit/audit.module");
var storage_module_1 = require("./common/storage/storage.module");
var rbac_module_1 = require("./common/rbac/rbac.module");
var audit_module_2 = require("./common/audit/audit.module");
var backup_module_1 = require("./common/backup/backup.module");
var package_module_1 = require("./common/package/package.module");
var system_module_1 = require("./system/system.module");
var seed_module_1 = require("./seed/seed.module");
var team_module_1 = require("./team/team.module");
var hr_module_1 = require("./hr/hr.module");
var controlling_module_1 = require("./controlling/controlling.module");
var activePackageId = (0, config_1.getActivePackageIdFromEnv)();
function moduleIfEnabled(moduleKey, nestModule) {
    return (0, config_1.isPackageModuleEnabled)(moduleKey, activePackageId) ? [nestModule] : [];
}
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        (0, common_1.Module)({
            imports: __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([
                prisma_module_1.PrismaModule,
                package_module_1.PackageModule,
                seed_module_1.SeedModule,
                storage_module_1.StorageModule,
                rbac_module_1.RbacModule,
                audit_module_2.AuditModule,
                backup_module_1.BackupModule,
                auth_module_1.AuthModule
            ], moduleIfEnabled('crm', crm_module_1.CrmModule), true), moduleIfEnabled('documents', dms_module_1.DmsModule), true), moduleIfEnabled('logistics', logistics_module_1.LogisticsModule), true), [
                audit_module_1.AuditModule,
                system_module_1.SystemModule
            ], false), moduleIfEnabled('team', team_module_1.TeamModule), true), moduleIfEnabled('hr', hr_module_1.HrModule), true), moduleIfEnabled('controlling', controlling_module_1.ControllingModule), true),
            controllers: [app_controller_1.AppController],
            providers: [app_service_1.AppService],
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
