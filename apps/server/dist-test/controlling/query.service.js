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
exports.QueryService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var QueryService = /** @class */ (function () {
    function QueryService(prisma) {
        this.prisma = prisma;
    }
    // Query Templates
    QueryService.prototype.findAllTemplates = function () {
        return __awaiter(this, arguments, void 0, function (skip, take, filters) {
            var where, _a, total, items;
            if (skip === void 0) { skip = 0; }
            if (take === void 0) { take = 50; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        where = {};
                        if (filters === null || filters === void 0 ? void 0 : filters.kategoria) {
                            where.kategoria = filters.kategoria;
                        }
                        if ((filters === null || filters === void 0 ? void 0 : filters.aktiv) !== undefined) {
                            where.aktiv = filters.aktiv;
                        }
                        return [4 /*yield*/, Promise.all([
                                this.prisma.queryTemplate.count({ where: where }),
                                this.prisma.queryTemplate.findMany({
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
                        return [2 /*return*/, { total: total, items: items }];
                }
            });
        });
    };
    QueryService.prototype.findTemplate = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var template;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.queryTemplate.findUnique({
                            where: { id: id },
                        })];
                    case 1:
                        template = _a.sent();
                        if (!template) {
                            throw new common_1.NotFoundException('Lekérdezés sablon nem található');
                        }
                        return [2 /*return*/, template];
                }
            });
        });
    };
    QueryService.prototype.createTemplate = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var existing;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.queryTemplate.findUnique({
                            where: { azonosito: dto.azonosito },
                        })];
                    case 1:
                        existing = _a.sent();
                        if (existing) {
                            throw new common_1.BadRequestException('Ez az azonosító már használatban van');
                        }
                        return [2 /*return*/, this.prisma.queryTemplate.create({
                                data: dto,
                            })];
                }
            });
        });
    };
    QueryService.prototype.updateTemplate = function (id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var template;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findTemplate(id)];
                    case 1:
                        template = _a.sent();
                        return [2 /*return*/, this.prisma.queryTemplate.update({
                                where: { id: id },
                                data: dto,
                            })];
                }
            });
        });
    };
    QueryService.prototype.deleteTemplate = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var template;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findTemplate(id)];
                    case 1:
                        template = _a.sent();
                        return [2 /*return*/, this.prisma.queryTemplate.delete({
                                where: { id: id },
                            })];
                }
            });
        });
    };
    // Ad-hoc Queries
    QueryService.prototype.findAllAdHocQueries = function () {
        return __awaiter(this, arguments, void 0, function (skip, take) {
            var _a, total, items;
            if (skip === void 0) { skip = 0; }
            if (take === void 0) { take = 50; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            this.prisma.adHocQuery.count(),
                            this.prisma.adHocQuery.findMany({
                                skip: skip,
                                take: take,
                                include: {
                                    createdBy: {
                                        select: {
                                            id: true,
                                            nev: true,
                                            email: true,
                                        },
                                    },
                                },
                                orderBy: {
                                    createdAt: 'desc',
                                },
                            }),
                        ])];
                    case 1:
                        _a = _b.sent(), total = _a[0], items = _a[1];
                        return [2 /*return*/, { total: total, items: items }];
                }
            });
        });
    };
    QueryService.prototype.findAdHocQuery = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.adHocQuery.findUnique({
                            where: { id: id },
                            include: {
                                createdBy: {
                                    select: {
                                        id: true,
                                        nev: true,
                                        email: true,
                                    },
                                },
                            },
                        })];
                    case 1:
                        query = _a.sent();
                        if (!query) {
                            throw new common_1.NotFoundException('Ad-hoc lekérdezés nem található');
                        }
                        return [2 /*return*/, query];
                }
            });
        });
    };
    QueryService.prototype.createAdHocQuery = function (dto, userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.adHocQuery.create({
                        data: __assign(__assign({}, dto), { createdById: userId }),
                        include: {
                            createdBy: {
                                select: {
                                    id: true,
                                    nev: true,
                                    email: true,
                                },
                            },
                        },
                    })];
            });
        });
    };
    QueryService.prototype.executeQuery = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // WARNING: This is a simplified implementation
                // In production, you should:
                // 1. Validate the query to prevent SQL injection
                // 2. Use parameterized queries
                // 3. Limit query execution time
                // 4. Restrict to SELECT queries only
                try {
                    // For now, return empty array as placeholder
                    // In production, execute against the database connection
                    return [2 /*return*/, []];
                }
                catch (error) {
                    throw new common_1.BadRequestException("Hiba a lek\u00E9rdez\u00E9s v\u00E9grehajt\u00E1sakor: ".concat(error.message));
                }
                return [2 /*return*/];
            });
        });
    };
    QueryService.prototype.deleteAdHocQuery = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findAdHocQuery(id)];
                    case 1:
                        query = _a.sent();
                        return [2 /*return*/, this.prisma.adHocQuery.delete({
                                where: { id: id },
                            })];
                }
            });
        });
    };
    QueryService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], QueryService);
    return QueryService;
}());
exports.QueryService = QueryService;
