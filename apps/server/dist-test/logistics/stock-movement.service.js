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
exports.StockMovementService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var settings_service_1 = require("../system/settings.service");
var StockMovementService = /** @class */ (function () {
    function StockMovementService(prisma, settingsService) {
        this.prisma = prisma;
        this.settingsService = settingsService;
    }
    StockMovementService.prototype.allowNegativeStock = function () {
        return __awaiter(this, void 0, void 0, function () {
            var v;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.settingsService.get('logistics.allow_negative_stock')];
                    case 1:
                        v = _a.sent();
                        return [2 /*return*/, v === 'true'];
                }
            });
        });
    };
    StockMovementService.prototype.getStockLevel = function (itemId_1, warehouseId_1) {
        return __awaiter(this, arguments, void 0, function (itemId, warehouseId, locationId) {
            if (locationId === void 0) { locationId = null; }
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.stockLevel.findFirst({
                        where: { itemId: itemId, warehouseId: warehouseId, locationId: locationId },
                    })];
            });
        });
    };
    StockMovementService.prototype.ensureStockLevel = function (itemId_1, warehouseId_1) {
        return __awaiter(this, arguments, void 0, function (itemId, warehouseId, locationId) {
            var existing, item;
            var _a, _b;
            if (locationId === void 0) { locationId = null; }
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getStockLevel(itemId, warehouseId, locationId)];
                    case 1:
                        existing = _c.sent();
                        if (existing)
                            return [2 /*return*/, existing];
                        return [4 /*yield*/, this.prisma.item.findUnique({ where: { id: itemId } })];
                    case 2:
                        item = _c.sent();
                        return [2 /*return*/, this.prisma.stockLevel.create({
                                data: {
                                    itemId: itemId,
                                    warehouseId: warehouseId,
                                    locationId: locationId,
                                    mennyiseg: 0,
                                    minimum: (_a = item === null || item === void 0 ? void 0 : item.minKeszlet) !== null && _a !== void 0 ? _a : null,
                                    maximum: (_b = item === null || item === void 0 ? void 0 : item.maxKeszlet) !== null && _b !== void 0 ? _b : null,
                                },
                            })];
                }
            });
        });
    };
    StockMovementService.prototype.adjustLot = function (itemId, warehouseId, sarzsGyartasiSzam, delta, beszerzesiAr, lejarat) {
        return __awaiter(this, void 0, void 0, function () {
            var sarzs, lot, nextQty, item;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!(sarzsGyartasiSzam === null || sarzsGyartasiSzam === void 0 ? void 0 : sarzsGyartasiSzam.trim()))
                            return [2 /*return*/];
                        sarzs = sarzsGyartasiSzam.trim();
                        return [4 /*yield*/, this.prisma.stockLot.findFirst({
                                where: { itemId: itemId, warehouseId: warehouseId, sarzsGyartasiSzam: sarzs },
                            })];
                    case 1:
                        lot = _d.sent();
                        if (!lot) return [3 /*break*/, 6];
                        nextQty = lot.mennyiseg + delta;
                        if (nextQty < 0) {
                            throw new common_1.BadRequestException("Nincs elegend\u0151 sarzs k\u00E9szlet: ".concat(sarzs));
                        }
                        if (!(nextQty === 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.prisma.stockLot.delete({ where: { id: lot.id } })];
                    case 2:
                        _d.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.prisma.stockLot.update({
                            where: { id: lot.id },
                            data: { mennyiseg: nextQty },
                        })];
                    case 4:
                        _d.sent();
                        _d.label = 5;
                    case 5: return [2 /*return*/];
                    case 6:
                        if (!(delta > 0)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.prisma.item.findUnique({ where: { id: itemId } })];
                    case 7:
                        item = _d.sent();
                        return [4 /*yield*/, this.prisma.stockLot.create({
                                data: {
                                    itemId: itemId,
                                    warehouseId: warehouseId,
                                    sarzsGyartasiSzam: sarzs,
                                    mennyiseg: delta,
                                    beszerzesiAr: (_a = beszerzesiAr !== null && beszerzesiAr !== void 0 ? beszerzesiAr : item === null || item === void 0 ? void 0 : item.beszerzesiAr) !== null && _a !== void 0 ? _a : 0,
                                    minKeszlet: (_b = item === null || item === void 0 ? void 0 : item.minKeszlet) !== null && _b !== void 0 ? _b : 0,
                                    maxKeszlet: (_c = item === null || item === void 0 ? void 0 : item.maxKeszlet) !== null && _c !== void 0 ? _c : null,
                                    lejarat: lejarat !== null && lejarat !== void 0 ? lejarat : null,
                                },
                            })];
                    case 8:
                        _d.sent();
                        _d.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    StockMovementService.prototype.changeQuantity = function (itemId, warehouseId, delta, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var item, level, next, _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.prisma.item.findUnique({ where: { id: itemId } })];
                    case 1:
                        item = _c.sent();
                        if (!item)
                            throw new common_1.NotFoundException('Cikk nem található');
                        if (item.sarzsKotelezo && !((_b = opts === null || opts === void 0 ? void 0 : opts.sarzsGyartasiSzam) === null || _b === void 0 ? void 0 : _b.trim()) && delta !== 0) {
                            throw new common_1.BadRequestException('Sarzs/gyártási szám megadása kötelező ennél a cikknél');
                        }
                        return [4 /*yield*/, this.ensureStockLevel(itemId, warehouseId, null)];
                    case 2:
                        level = _c.sent();
                        next = level.mennyiseg + delta;
                        _a = next < 0;
                        if (!_a) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.allowNegativeStock()];
                    case 3:
                        _a = !(_c.sent());
                        _c.label = 4;
                    case 4:
                        if (_a) {
                            throw new common_1.BadRequestException("Negat\u00EDv k\u00E9szlet nem enged\u00E9lyezett (jelenlegi: ".concat(level.mennyiseg, ", v\u00E1ltoz\u00E1s: ").concat(delta, ")"));
                        }
                        return [4 /*yield*/, this.prisma.stockLevel.update({
                                where: { id: level.id },
                                data: { mennyiseg: next },
                            })];
                    case 5:
                        _c.sent();
                        if (!(opts === null || opts === void 0 ? void 0 : opts.sarzsGyartasiSzam)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.adjustLot(itemId, warehouseId, opts.sarzsGyartasiSzam, delta, opts.beszerzesiAr, opts.lejarat)];
                    case 6:
                        _c.sent();
                        _c.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    StockMovementService.prototype.execute = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var qty, sarzsOpts, _a, level, delta, fromId, toId;
            var _b, _c, _d, _e, _f, _g, _h, _j;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        if (!dto.mennyiseg || dto.mennyiseg <= 0) {
                            throw new common_1.BadRequestException('A mennyiségnek pozitívnak kell lennie');
                        }
                        qty = dto.mennyiseg;
                        sarzsOpts = {
                            sarzsGyartasiSzam: dto.sarzsGyartasiSzam,
                            beszerzesiAr: dto.beszerzesiAr,
                            lejarat: dto.lejarat ? new Date(dto.lejarat) : null,
                        };
                        _a = dto.tipus;
                        switch (_a) {
                            case 'BEVETEL': return [3 /*break*/, 1];
                            case 'KIADAS': return [3 /*break*/, 3];
                            case 'KORREKCIO': return [3 /*break*/, 5];
                            case 'ATMOZGATAS': return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 11];
                    case 1: return [4 /*yield*/, this.changeQuantity(dto.itemId, dto.warehouseId, qty, sarzsOpts)];
                    case 2:
                        _k.sent();
                        return [3 /*break*/, 12];
                    case 3: return [4 /*yield*/, this.changeQuantity(dto.itemId, dto.warehouseId, -qty, sarzsOpts)];
                    case 4:
                        _k.sent();
                        return [3 /*break*/, 12];
                    case 5: return [4 /*yield*/, this.ensureStockLevel(dto.itemId, dto.warehouseId, null)];
                    case 6:
                        level = _k.sent();
                        delta = qty - level.mennyiseg;
                        return [4 /*yield*/, this.changeQuantity(dto.itemId, dto.warehouseId, delta, sarzsOpts)];
                    case 7:
                        _k.sent();
                        return [3 /*break*/, 12];
                    case 8:
                        fromId = dto.forrasRaktarId || dto.warehouseId;
                        toId = dto.celRaktarId;
                        if (!toId || fromId === toId) {
                            throw new common_1.BadRequestException('Forrás és cél raktár megadása kötelező átmozgatáskor');
                        }
                        return [4 /*yield*/, this.changeQuantity(dto.itemId, fromId, -qty, sarzsOpts)];
                    case 9:
                        _k.sent();
                        return [4 /*yield*/, this.changeQuantity(dto.itemId, toId, qty, sarzsOpts)];
                    case 10:
                        _k.sent();
                        dto.warehouseId = fromId;
                        return [3 /*break*/, 12];
                    case 11: throw new common_1.BadRequestException("Ismeretlen mozg\u00E1st\u00EDpus: ".concat(dto.tipus));
                    case 12: return [2 /*return*/, this.prisma.stockMove.create({
                            data: {
                                itemId: dto.itemId,
                                warehouseId: dto.warehouseId,
                                forrasRaktarId: (_b = dto.forrasRaktarId) !== null && _b !== void 0 ? _b : (dto.tipus === 'ATMOZGATAS' ? dto.warehouseId : null),
                                celRaktarId: (_c = dto.celRaktarId) !== null && _c !== void 0 ? _c : null,
                                tipus: dto.tipus,
                                mennyiseg: qty,
                                sarzsGyartasiSzam: ((_d = dto.sarzsGyartasiSzam) === null || _d === void 0 ? void 0 : _d.trim()) || null,
                                referenciaId: (_e = dto.referenciaId) !== null && _e !== void 0 ? _e : null,
                                referenciaTipus: (_f = dto.referenciaTipus) !== null && _f !== void 0 ? _f : null,
                                referenciaAzonosito: (_g = dto.referenciaAzonosito) !== null && _g !== void 0 ? _g : null,
                                userId: (_h = dto.userId) !== null && _h !== void 0 ? _h : null,
                                megjegyzesek: (_j = dto.megjegyzesek) !== null && _j !== void 0 ? _j : null,
                            },
                            include: { item: true, warehouse: true },
                        })];
                }
            });
        });
    };
    StockMovementService.prototype.findMovements = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var where, skip, take, _a, total, movements;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        where = {};
                        if (filters === null || filters === void 0 ? void 0 : filters.itemId)
                            where.itemId = filters.itemId;
                        if (filters === null || filters === void 0 ? void 0 : filters.warehouseId)
                            where.warehouseId = filters.warehouseId;
                        if (filters === null || filters === void 0 ? void 0 : filters.tipus)
                            where.tipus = filters.tipus;
                        if (filters === null || filters === void 0 ? void 0 : filters.sarzsGyartasiSzam) {
                            where.sarzsGyartasiSzam = { contains: filters.sarzsGyartasiSzam };
                        }
                        skip = (_b = filters === null || filters === void 0 ? void 0 : filters.skip) !== null && _b !== void 0 ? _b : 0;
                        take = (_c = filters === null || filters === void 0 ? void 0 : filters.take) !== null && _c !== void 0 ? _c : 100;
                        return [4 /*yield*/, Promise.all([
                                this.prisma.stockMove.count({ where: where }),
                                this.prisma.stockMove.findMany({
                                    where: where,
                                    skip: skip,
                                    take: take,
                                    include: { item: true, warehouse: true },
                                    orderBy: { createdAt: 'desc' },
                                }),
                            ])];
                    case 1:
                        _a = _d.sent(), total = _a[0], movements = _a[1];
                        return [2 /*return*/, { total: total, movements: movements }];
                }
            });
        });
    };
    StockMovementService.prototype.findLots = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var where, until, skip, take, _a, total, lots;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        where = {};
                        if (filters === null || filters === void 0 ? void 0 : filters.warehouseId)
                            where.warehouseId = filters.warehouseId;
                        if (filters === null || filters === void 0 ? void 0 : filters.itemId)
                            where.itemId = filters.itemId;
                        if (filters === null || filters === void 0 ? void 0 : filters.sarzsGyartasiSzam) {
                            where.sarzsGyartasiSzam = { contains: filters.sarzsGyartasiSzam };
                        }
                        if ((filters === null || filters === void 0 ? void 0 : filters.expiringWithinDays) != null) {
                            until = new Date();
                            until.setDate(until.getDate() + filters.expiringWithinDays);
                            where.lejarat = { lte: until, not: null };
                        }
                        skip = (_b = filters === null || filters === void 0 ? void 0 : filters.skip) !== null && _b !== void 0 ? _b : 0;
                        take = (_c = filters === null || filters === void 0 ? void 0 : filters.take) !== null && _c !== void 0 ? _c : 100;
                        return [4 /*yield*/, Promise.all([
                                this.prisma.stockLot.count({ where: where }),
                                this.prisma.stockLot.findMany({
                                    where: where,
                                    skip: skip,
                                    take: take,
                                    include: { item: true, warehouse: true },
                                    orderBy: [{ lejarat: 'asc' }, { createdAt: 'desc' }],
                                }),
                            ])];
                    case 1:
                        _a = _d.sent(), total = _a[0], lots = _a[1];
                        return [2 /*return*/, { total: total, lots: lots }];
                }
            });
        });
    };
    StockMovementService.prototype.getStockAlerts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var levels, belowMin, aboveMax, _i, levels_1, sl, min, max;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.prisma.stockLevel.findMany({
                            include: { item: true, warehouse: true },
                        })];
                    case 1:
                        levels = _e.sent();
                        belowMin = [];
                        aboveMax = [];
                        for (_i = 0, levels_1 = levels; _i < levels_1.length; _i++) {
                            sl = levels_1[_i];
                            min = (_a = sl.minimum) !== null && _a !== void 0 ? _a : (_b = sl.item) === null || _b === void 0 ? void 0 : _b.minKeszlet;
                            max = (_c = sl.maximum) !== null && _c !== void 0 ? _c : (_d = sl.item) === null || _d === void 0 ? void 0 : _d.maxKeszlet;
                            if (min != null && sl.mennyiseg < min)
                                belowMin.push(sl);
                            if (max != null && sl.mennyiseg > max)
                                aboveMax.push(sl);
                        }
                        return [2 /*return*/, {
                                belowMin: belowMin.map(function (s) {
                                    var _a, _b;
                                    return (__assign(__assign({}, s), { alertType: 'BELOW_MIN', threshold: (_a = s.minimum) !== null && _a !== void 0 ? _a : (_b = s.item) === null || _b === void 0 ? void 0 : _b.minKeszlet }));
                                }),
                                aboveMax: aboveMax.map(function (s) {
                                    var _a, _b;
                                    return (__assign(__assign({}, s), { alertType: 'ABOVE_MAX', threshold: (_a = s.maximum) !== null && _a !== void 0 ? _a : (_b = s.item) === null || _b === void 0 ? void 0 : _b.maxKeszlet }));
                                }),
                            }];
                }
            });
        });
    };
    StockMovementService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService,
            settings_service_1.SystemSettingsService])
    ], StockMovementService);
    return StockMovementService;
}());
exports.StockMovementService = StockMovementService;
