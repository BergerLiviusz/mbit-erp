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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageModuleGuard = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@mbit-erp/config");
var package_resolver_service_1 = require("./package-resolver.service");
var PackageModuleGuard = /** @class */ (function () {
    function PackageModuleGuard(packages) {
        this.packages = packages;
    }
    PackageModuleGuard.prototype.canActivate = function (context) {
        var request = context.switchToHttp().getRequest();
        var path = (request.path || request.url || '').replace(/^\//, '');
        var segments = path.split('/').filter(Boolean);
        var prefix = segments[0];
        if (!prefix || config_1.API_ALWAYS_ALLOWED_PREFIXES.includes(prefix)) {
            return true;
        }
        var moduleKey = config_1.API_ROUTE_MODULE_MAP[prefix];
        if (!moduleKey) {
            return true;
        }
        if (!this.packages.isModuleEnabled(moduleKey)) {
            throw new common_1.ForbiddenException("A(z) \"".concat(this.packages.getActivePackage().displayName, "\" csomag nem tartalmazza a k\u00E9rt modult (").concat(prefix, ")."));
        }
        return true;
    };
    PackageModuleGuard = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [package_resolver_service_1.PackageResolverService])
    ], PackageModuleGuard);
    return PackageModuleGuard;
}());
exports.PackageModuleGuard = PackageModuleGuard;
