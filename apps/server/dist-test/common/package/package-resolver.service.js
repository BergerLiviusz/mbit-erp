"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageResolverService = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@mbit-erp/config");
var PackageResolverService = /** @class */ (function () {
    function PackageResolverService() {
    }
    PackageResolverService.prototype.getActivePackageId = function () {
        return (0, config_1.getActivePackageIdFromEnv)();
    };
    PackageResolverService.prototype.getActivePackage = function () {
        return (0, config_1.getPackageDefinition)(this.getActivePackageId());
    };
    PackageResolverService.prototype.isModuleEnabled = function (module) {
        return (0, config_1.isPackageModuleEnabled)(module, this.getActivePackageId());
    };
    PackageResolverService.prototype.isPermissionAllowed = function (permissionCode) {
        return (0, config_1.isPermissionAllowedInPackage)(permissionCode, this.getActivePackageId());
    };
    PackageResolverService.prototype.getVersionInfo = function () {
        var info = (0, config_1.getVersionInfoFromEnv)();
        var pkg = this.getActivePackage();
        return {
            appName: 'MBIT ERP',
            version: info.version || config_1.APP_VERSION,
            buildSha: info.buildSha,
            buildDate: info.buildDate,
            packageId: pkg.id,
            packageDisplayName: pkg.displayName,
            editionLabel: pkg.editionLabel,
            environment: info.environment,
            versionLabel: (0, config_1.formatVersionLabel)({
                version: info.version || config_1.APP_VERSION,
                packageEdition: pkg.editionLabel,
                environment: info.environment,
                buildSha: info.buildSha,
            }),
            enabledModules: pkg.modules,
        };
    };
    PackageResolverService = __decorate([
        (0, common_1.Injectable)()
    ], PackageResolverService);
    return PackageResolverService;
}());
exports.PackageResolverService = PackageResolverService;
