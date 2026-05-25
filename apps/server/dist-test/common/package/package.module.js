"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageModule = void 0;
var common_1 = require("@nestjs/common");
var core_1 = require("@nestjs/core");
var package_resolver_service_1 = require("./package-resolver.service");
var package_module_guard_1 = require("./package-module.guard");
var PackageModule = /** @class */ (function () {
    function PackageModule() {
    }
    PackageModule = __decorate([
        (0, common_1.Global)(),
        (0, common_1.Module)({
            providers: [
                package_resolver_service_1.PackageResolverService,
                {
                    provide: core_1.APP_GUARD,
                    useClass: package_module_guard_1.PackageModuleGuard,
                },
            ],
            exports: [package_resolver_service_1.PackageResolverService],
        })
    ], PackageModule);
    return PackageModule;
}());
exports.PackageModule = PackageModule;
