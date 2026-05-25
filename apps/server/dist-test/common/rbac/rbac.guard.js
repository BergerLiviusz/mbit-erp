"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RbacGuard = void 0;
var common_1 = require("@nestjs/common");
var core_1 = require("@nestjs/core");
var passport_1 = require("@nestjs/passport");
var rbac_decorator_1 = require("./rbac.decorator");
var prisma_service_1 = require("../../prisma/prisma.service");
var package_resolver_service_1 = require("../package/package-resolver.service");
var RbacGuard = /** @class */ (function (_super) {
    __extends(RbacGuard, _super);
    function RbacGuard(reflector, prisma, packages) {
        var _this = _super.call(this) || this;
        _this.reflector = reflector;
        _this.prisma = prisma;
        _this.packages = packages;
        return _this;
    }
    RbacGuard.prototype.canActivate = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var isElectronDesktop, adminUser, error_1, request_1, isPublic, requiredPermissions, allowedPermissions, jwtAuthenticated, request, user, userRoles, userPermissions, _i, userRoles_1, userRole, _a, _b, rolePermission, hasPermission, permissionNames;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        isElectronDesktop = process.env.ELECTRON_RUN_AS_NODE === '1';
                        if (!isElectronDesktop) return [3 /*break*/, 5];
                        adminUser = null;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.prisma.user.findFirst({
                                where: {
                                    email: 'admin@mbit.hu',
                                    aktiv: true,
                                },
                                include: {
                                    roles: {
                                        include: {
                                            role: true,
                                        },
                                    },
                                },
                            })];
                    case 2:
                        adminUser = _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _c.sent();
                        // Log and continue with fallback user
                        // eslint-disable-next-line no-console
                        console.error('[RbacGuard] Failed to load admin user for Electron mode:', error_1);
                        return [3 /*break*/, 4];
                    case 4:
                        request_1 = context.switchToHttp().getRequest();
                        if (adminUser) {
                            request_1.user = {
                                id: adminUser.id,
                                userId: adminUser.id,
                                email: adminUser.email,
                                roles: adminUser.roles.map(function (ur) { return ur.role.nev; }),
                            };
                        }
                        else {
                            // Fallback if admin user doesn't exist yet
                            request_1.user = {
                                id: null,
                                userId: null,
                                email: 'desktop@mbit.local',
                                roles: ['Admin', 'User'],
                            };
                        }
                        return [2 /*return*/, true];
                    case 5:
                        isPublic = this.reflector.getAllAndOverride(rbac_decorator_1.IS_PUBLIC_KEY, [
                            context.getHandler(),
                            context.getClass(),
                        ]);
                        if (isPublic) {
                            return [2 /*return*/, true];
                        }
                        requiredPermissions = this.reflector.getAllAndOverride(rbac_decorator_1.PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
                        if (!requiredPermissions || requiredPermissions.length === 0) {
                            return [2 /*return*/, true];
                        }
                        allowedPermissions = requiredPermissions.filter(function (p) {
                            return _this.packages.isPermissionAllowed(p);
                        });
                        if (allowedPermissions.length === 0) {
                            throw new common_1.ForbiddenException("A(z) \"".concat(this.packages.getActivePackage().displayName, "\" csomag nem tartalmazza a k\u00E9rt funkci\u00F3t."));
                        }
                        return [4 /*yield*/, _super.prototype.canActivate.call(this, context)];
                    case 6:
                        jwtAuthenticated = _c.sent();
                        if (!jwtAuthenticated) {
                            throw new common_1.ForbiddenException('Nincs bejelentkezve');
                        }
                        request = context.switchToHttp().getRequest();
                        user = request.user;
                        if (!user) {
                            throw new common_1.ForbiddenException('Nincs bejelentkezve');
                        }
                        return [4 /*yield*/, this.prisma.userRole.findMany({
                                where: { userId: user.id },
                                include: {
                                    role: {
                                        include: {
                                            rolePermissions: {
                                                include: {
                                                    permission: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            })];
                    case 7:
                        userRoles = _c.sent();
                        if (!userRoles || userRoles.length === 0) {
                            throw new common_1.ForbiddenException('Felhasználóhoz nem tartoznak szerepkörök. Kérjük, lépjen kapcsolatba a rendszergazdával.');
                        }
                        userPermissions = new Set();
                        for (_i = 0, userRoles_1 = userRoles; _i < userRoles_1.length; _i++) {
                            userRole = userRoles_1[_i];
                            for (_a = 0, _b = userRole.role.rolePermissions; _a < _b.length; _a++) {
                                rolePermission = _b[_a];
                                userPermissions.add(rolePermission.permission.kod);
                            }
                        }
                        hasPermission = allowedPermissions.some(function (permission) {
                            return userPermissions.has(permission);
                        });
                        if (!hasPermission) {
                            permissionNames = allowedPermissions.join(', ');
                            throw new common_1.ForbiddenException("Nincs megfelel\u0151 jogosults\u00E1g. Sz\u00FCks\u00E9ges: ".concat(permissionNames));
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    RbacGuard = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [core_1.Reflector,
            prisma_service_1.PrismaService,
            package_resolver_service_1.PackageResolverService])
    ], RbacGuard);
    return RbacGuard;
}((0, passport_1.AuthGuard)('jwt')));
exports.RbacGuard = RbacGuard;
