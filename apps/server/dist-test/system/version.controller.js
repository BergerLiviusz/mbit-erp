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
exports.VersionController = void 0;
var common_1 = require("@nestjs/common");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var package_resolver_service_1 = require("../common/package/package-resolver.service");
var VersionController = /** @class */ (function () {
    function VersionController(packages) {
        this.packages = packages;
    }
    VersionController.prototype.getVersion = function () {
        return this.packages.getVersionInfo();
    };
    __decorate([
        (0, common_1.Get)(),
        (0, rbac_decorator_1.Public)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], VersionController.prototype, "getVersion", null);
    VersionController = __decorate([
        (0, common_1.Controller)('system/version'),
        __metadata("design:paramtypes", [package_resolver_service_1.PackageResolverService])
    ], VersionController);
    return VersionController;
}());
exports.VersionController = VersionController;
