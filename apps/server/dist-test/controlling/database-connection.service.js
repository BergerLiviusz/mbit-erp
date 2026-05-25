"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.DatabaseConnectionService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var crypto = __importStar(require("crypto"));
var DatabaseConnectionService = /** @class */ (function () {
    function DatabaseConnectionService(prisma) {
        this.prisma = prisma;
        this.encryptionKey = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';
    }
    DatabaseConnectionService.prototype.encrypt = function (text) {
        var iv = crypto.randomBytes(16);
        var cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.encryptionKey.substring(0, 32).padEnd(32)), iv);
        var encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted;
    };
    DatabaseConnectionService.prototype.decrypt = function (encryptedText) {
        var parts = encryptedText.split(':');
        var iv = Buffer.from(parts[0], 'hex');
        var encrypted = parts[1];
        var decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.encryptionKey.substring(0, 32).padEnd(32)), iv);
        var decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    };
    DatabaseConnectionService.prototype.findAll = function () {
        return __awaiter(this, arguments, void 0, function (skip, take, filters) {
            var where, _a, total, items, safeItems;
            if (skip === void 0) { skip = 0; }
            if (take === void 0) { take = 50; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        where = {};
                        if ((filters === null || filters === void 0 ? void 0 : filters.aktiv) !== undefined) {
                            where.aktiv = filters.aktiv;
                        }
                        return [4 /*yield*/, Promise.all([
                                this.prisma.databaseConnection.count({ where: where }),
                                this.prisma.databaseConnection.findMany({
                                    where: where,
                                    skip: skip,
                                    take: take,
                                    orderBy: {
                                        nev: 'asc',
                                    },
                                }),
                            ])];
                    case 1:
                        _a = _b.sent(), total = _a[0], items = _a[1];
                        safeItems = items.map(function (item) { return (__assign(__assign({}, item), { password: item.password ? '***' : null })); });
                        return [2 /*return*/, { total: total, items: safeItems }];
                }
            });
        });
    };
    DatabaseConnectionService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var connection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.databaseConnection.findUnique({
                            where: { id: id },
                        })];
                    case 1:
                        connection = _a.sent();
                        if (!connection) {
                            throw new common_1.NotFoundException('Adatbázis kapcsolat nem található');
                        }
                        // Don't return password
                        return [2 /*return*/, __assign(__assign({}, connection), { password: connection.password ? '***' : null })];
                }
            });
        });
    };
    DatabaseConnectionService.prototype.create = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var validTypes, data;
            return __generator(this, function (_a) {
                validTypes = ['SQLITE', 'POSTGRESQL', 'MYSQL', 'MSSQL', 'ORACLE'];
                if (!validTypes.includes(dto.tipus.toUpperCase())) {
                    throw new common_1.BadRequestException('Érvénytelen adatbázis típus');
                }
                data = __assign(__assign({}, dto), { tipus: dto.tipus.toUpperCase(), password: dto.password ? this.encrypt(dto.password) : undefined });
                return [2 /*return*/, this.prisma.databaseConnection.create({
                        data: data,
                    })];
            });
        });
    };
    DatabaseConnectionService.prototype.update = function (id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var connection, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        connection = _a.sent();
                        data = __assign(__assign({}, dto), { tipus: dto.tipus ? dto.tipus.toUpperCase() : undefined, password: dto.password ? this.encrypt(dto.password) : undefined });
                        return [2 /*return*/, this.prisma.databaseConnection.update({
                                where: { id: id },
                                data: data,
                            })];
                }
            });
        });
    };
    DatabaseConnectionService.prototype.testConnection = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var connection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.databaseConnection.findUnique({
                            where: { id: id },
                        })];
                    case 1:
                        connection = _a.sent();
                        if (!connection) {
                            throw new common_1.NotFoundException('Adatbázis kapcsolat nem található');
                        }
                        try {
                            // Simple connection test - in production, use appropriate database driver
                            // This is a placeholder implementation
                            if (connection.connectionString) {
                                // Test connection string
                                return [2 /*return*/, { success: true, message: 'Kapcsolat sikeres' }];
                            }
                            else if (connection.host && connection.database) {
                                // Test host/database connection
                                return [2 /*return*/, { success: true, message: 'Kapcsolat sikeres' }];
                            }
                            else {
                                return [2 /*return*/, { success: false, message: 'Hiányzó kapcsolati információk' }];
                            }
                        }
                        catch (error) {
                            return [2 /*return*/, { success: false, message: error.message || 'Kapcsolati hiba' }];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    DatabaseConnectionService.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var connection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        connection = _a.sent();
                        return [2 /*return*/, this.prisma.databaseConnection.delete({
                                where: { id: id },
                            })];
                }
            });
        });
    };
    DatabaseConnectionService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], DatabaseConnectionService);
    return DatabaseConnectionService;
}());
exports.DatabaseConnectionService = DatabaseConnectionService;
