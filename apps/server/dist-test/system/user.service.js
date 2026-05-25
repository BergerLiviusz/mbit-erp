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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var bcrypt = __importStar(require("bcrypt"));
var UserService = /** @class */ (function () {
    function UserService(prisma) {
        this.prisma = prisma;
    }
    UserService.prototype.findAll = function () {
        return __awaiter(this, arguments, void 0, function (skip, take) {
            var _a, total, items;
            if (skip === void 0) { skip = 0; }
            if (take === void 0) { take = 50; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            this.prisma.user.count(),
                            this.prisma.user.findMany({
                                skip: skip,
                                take: take,
                                include: {
                                    roles: {
                                        include: {
                                            role: true,
                                        },
                                    },
                                },
                                orderBy: { createdAt: 'desc' },
                            }),
                        ])];
                    case 1:
                        _a = _b.sent(), total = _a[0], items = _a[1];
                        return [2 /*return*/, { total: total, items: items }];
                }
            });
        });
    };
    UserService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                            where: { id: id },
                            include: {
                                roles: {
                                    include: {
                                        role: true,
                                    },
                                },
                            },
                        })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.NotFoundException('Felhasználó nem található');
                        }
                        return [2 /*return*/, user];
                }
            });
        });
    };
    UserService.prototype.findByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.user.findUnique({
                        where: { email: email },
                        include: {
                            roles: {
                                include: {
                                    role: true,
                                },
                            },
                        },
                    })];
            });
        });
    };
    UserService.prototype.create = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var existingUser, hashedPassword, user, userRole;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                            where: { email: dto.email },
                        })];
                    case 1:
                        existingUser = _a.sent();
                        if (existingUser) {
                            throw new common_1.BadRequestException('Ez az email cím már használatban van');
                        }
                        return [4 /*yield*/, bcrypt.hash(dto.password, 10)];
                    case 2:
                        hashedPassword = _a.sent();
                        return [4 /*yield*/, this.prisma.user.create({
                                data: {
                                    email: dto.email,
                                    password: hashedPassword,
                                    nev: dto.nev,
                                    aktiv: dto.aktiv !== undefined ? dto.aktiv : true,
                                },
                            })];
                    case 3:
                        user = _a.sent();
                        return [4 /*yield*/, this.prisma.role.findUnique({
                                where: { nev: 'User' },
                            })];
                    case 4:
                        userRole = _a.sent();
                        if (!userRole) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.prisma.userRole.create({
                                data: {
                                    userId: user.id,
                                    roleId: userRole.id,
                                },
                            })];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, this.findOne(user.id)];
                }
            });
        });
    };
    UserService.prototype.update = function (id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var user, existingUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        user = _a.sent();
                        if (!(dto.email && dto.email !== user.email)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { email: dto.email },
                            })];
                    case 2:
                        existingUser = _a.sent();
                        if (existingUser) {
                            throw new common_1.BadRequestException('Ez az email cím már használatban van');
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/, this.prisma.user.update({
                            where: { id: id },
                            data: dto,
                            include: {
                                roles: {
                                    include: {
                                        role: true,
                                    },
                                },
                            },
                        })];
                }
            });
        });
    };
    UserService.prototype.changePassword = function (userId, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var user, isPasswordValid, hashedPassword;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(userId)];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, bcrypt.compare(dto.currentPassword, user.password)];
                    case 2:
                        isPasswordValid = _a.sent();
                        if (!isPasswordValid) {
                            throw new common_1.BadRequestException('A jelenlegi jelszó nem megfelelő');
                        }
                        return [4 /*yield*/, bcrypt.hash(dto.newPassword, 10)];
                    case 3:
                        hashedPassword = _a.sent();
                        return [2 /*return*/, this.prisma.user.update({
                                where: { id: userId },
                                data: {
                                    password: hashedPassword,
                                },
                            })];
                }
            });
        });
    };
    UserService.prototype.adminChangePassword = function (userId, newPassword) {
        return __awaiter(this, void 0, void 0, function () {
            var user, hashedPassword;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!newPassword || newPassword.length < 4) {
                            throw new common_1.BadRequestException('A jelszónak legalább 4 karakternek kell lennie');
                        }
                        return [4 /*yield*/, this.findOne(userId)];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, bcrypt.hash(newPassword, 10)];
                    case 2:
                        hashedPassword = _a.sent();
                        return [2 /*return*/, this.prisma.user.update({
                                where: { id: userId },
                                data: {
                                    password: hashedPassword,
                                },
                            })];
                }
            });
        });
    };
    UserService.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        user = _a.sent();
                        // Prevent deleting the default admin user
                        if (user.email === 'admin@mbit.hu') {
                            throw new common_1.BadRequestException('Az alapértelmezett admin felhasználó nem törölhető');
                        }
                        return [2 /*return*/, this.prisma.user.delete({
                                where: { id: id },
                            })];
                }
            });
        });
    };
    UserService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
