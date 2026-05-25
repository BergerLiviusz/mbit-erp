"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var jwt_1 = require("@nestjs/jwt");
var prisma_service_1 = require("../prisma/prisma.service");
var bcrypt = __importStar(require("bcrypt"));
var AuthService = /** @class */ (function () {
    function AuthService(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    AuthService.prototype.login = function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var user, isPasswordValid, payload, permissions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                            where: { email: email },
                            include: { roles: { include: { role: true } } },
                        })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.UnauthorizedException('Érvénytelen bejelentkezési adatok');
                        }
                        return [4 /*yield*/, bcrypt.compare(password, user.password)];
                    case 2:
                        isPasswordValid = _a.sent();
                        if (!isPasswordValid) {
                            throw new common_1.UnauthorizedException('Érvénytelen bejelentkezési adatok');
                        }
                        if (!user.aktiv) {
                            throw new common_1.UnauthorizedException('A fiók inaktív');
                        }
                        payload = {
                            sub: user.id,
                            email: user.email,
                            roles: user.roles.map(function (ur) { return ur.role.nev; }),
                        };
                        return [4 /*yield*/, this.getUserPermissionCodes(user.id)];
                    case 3:
                        permissions = _a.sent();
                        return [2 /*return*/, {
                                access_token: this.jwtService.sign(payload),
                                user: {
                                    id: user.id,
                                    email: user.email,
                                    nev: user.nev,
                                    roles: user.roles.map(function (ur) { return ur.role.nev; }),
                                    permissions: permissions,
                                },
                            }];
                }
            });
        });
    };
    AuthService.prototype.getUserPermissionCodes = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var userRoles, codes, _i, userRoles_1, ur, _a, _b, rp;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.prisma.userRole.findMany({
                            where: { userId: userId },
                            include: {
                                role: {
                                    include: {
                                        rolePermissions: { include: { permission: true } },
                                    },
                                },
                            },
                        })];
                    case 1:
                        userRoles = _c.sent();
                        codes = new Set();
                        for (_i = 0, userRoles_1 = userRoles; _i < userRoles_1.length; _i++) {
                            ur = userRoles_1[_i];
                            for (_a = 0, _b = ur.role.rolePermissions; _a < _b.length; _a++) {
                                rp = _b[_a];
                                codes.add(rp.permission.kod);
                            }
                        }
                        return [2 /*return*/, __spreadArray([], codes, true)];
                }
            });
        });
    };
    AuthService.prototype.getMe = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, permissions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                            where: { id: userId },
                            include: { roles: { include: { role: true } } },
                        })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.UnauthorizedException('Felhasználó nem található');
                        }
                        return [4 /*yield*/, this.getUserPermissionCodes(userId)];
                    case 2:
                        permissions = _a.sent();
                        return [2 /*return*/, {
                                id: user.id,
                                email: user.email,
                                nev: user.nev,
                                roles: user.roles.map(function (ur) { return ur.role.nev; }),
                                permissions: permissions,
                            }];
                }
            });
        });
    };
    AuthService.prototype.register = function (email, password, nev) {
        return __awaiter(this, void 0, void 0, function () {
            var hashedPassword, user, userRole;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, bcrypt.hash(password, 10)];
                    case 1:
                        hashedPassword = _a.sent();
                        return [4 /*yield*/, this.prisma.user.create({
                                data: {
                                    email: email,
                                    password: hashedPassword,
                                    nev: nev,
                                },
                            })];
                    case 2:
                        user = _a.sent();
                        return [4 /*yield*/, this.prisma.role.findUnique({
                                where: { nev: 'User' },
                            })];
                    case 3:
                        userRole = _a.sent();
                        if (!userRole) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.prisma.userRole.create({
                                data: {
                                    userId: user.id,
                                    roleId: userRole.id,
                                },
                            })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, this.login(email, password)];
                }
            });
        });
    };
    AuthService.prototype.getAdminEmail = function () {
        return __awaiter(this, void 0, void 0, function () {
            var adminRole, adminUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.role.findUnique({
                            where: { nev: 'Admin' },
                        })];
                    case 1:
                        adminRole = _a.sent();
                        if (!adminRole) {
                            console.log('[AuthService] Admin role not found, returning default email');
                            return [2 /*return*/, { email: 'admin@mbit.hu' }];
                        }
                        return [4 /*yield*/, this.prisma.user.findFirst({
                                where: {
                                    roles: {
                                        some: {
                                            roleId: adminRole.id,
                                        },
                                    },
                                    aktiv: true,
                                },
                                orderBy: {
                                    createdAt: 'asc', // Get the first admin user (usually the default one)
                                },
                            })];
                    case 2:
                        adminUser = _a.sent();
                        if (!adminUser) {
                            console.log('[AuthService] Admin user not found, returning default email');
                            return [2 /*return*/, { email: 'admin@mbit.hu' }];
                        }
                        console.log('[AuthService] Found admin user:', { id: adminUser.id, email: adminUser.email });
                        return [2 /*return*/, { email: adminUser.email }];
                }
            });
        });
    };
    AuthService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService,
            jwt_1.JwtService])
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
