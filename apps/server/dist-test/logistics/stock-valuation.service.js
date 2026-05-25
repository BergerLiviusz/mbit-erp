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
exports.StockValuationService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var StockValuationService = /** @class */ (function () {
    function StockValuationService(prisma) {
        this.prisma = prisma;
    }
    StockValuationService.prototype.calculateStockValue = function (itemId, warehouseId, ertekelesMod) {
        return __awaiter(this, void 0, void 0, function () {
            var item, warehouse, valuationMethod, stockLots, készletérték, lotDetails, totalValue, totalQuantity, _i, stockLots_1, lot, atlagBeszerzesiAr, _a, stockLots_2, lot, lotValue, totalQuantity, atlagBeszerzesiAr;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.prisma.item.findUnique({
                            where: { id: itemId },
                        })];
                    case 1:
                        item = _b.sent();
                        if (!item) {
                            throw new common_1.NotFoundException('Termék nem található');
                        }
                        return [4 /*yield*/, this.prisma.warehouse.findUnique({
                                where: { id: warehouseId },
                            })];
                    case 2:
                        warehouse = _b.sent();
                        if (!warehouse) {
                            throw new common_1.NotFoundException('Raktár nem található');
                        }
                        valuationMethod = ertekelesMod || warehouse.ertekelesMod || 'FIFO';
                        return [4 /*yield*/, this.prisma.stockLot.findMany({
                                where: {
                                    itemId: itemId,
                                    warehouseId: warehouseId,
                                    mennyiseg: {
                                        gt: 0,
                                    },
                                },
                                orderBy: {
                                    createdAt: valuationMethod === 'LIFO' ? 'desc' : 'asc', // LIFO: newest first, FIFO: oldest first
                                },
                            })];
                    case 3:
                        stockLots = _b.sent();
                        if (stockLots.length === 0) {
                            return [2 /*return*/, {
                                    itemId: itemId,
                                    itemNev: item.nev,
                                    warehouseId: warehouseId,
                                    warehouseNev: warehouse.nev,
                                    mennyiseg: 0,
                                    ertekelesMod: valuationMethod,
                                    készletérték: 0,
                                    atlagBeszerzesiAr: 0,
                                    lotDetails: [],
                                }];
                        }
                        készletérték = 0;
                        lotDetails = [];
                        if (valuationMethod === 'AVG') {
                            totalValue = 0;
                            totalQuantity = 0;
                            for (_i = 0, stockLots_1 = stockLots; _i < stockLots_1.length; _i++) {
                                lot = stockLots_1[_i];
                                totalValue += lot.mennyiseg * lot.beszerzesiAr;
                                totalQuantity += lot.mennyiseg;
                                lotDetails.push({
                                    lotId: lot.id,
                                    sarzsGyartasiSzam: lot.sarzsGyartasiSzam,
                                    mennyiseg: lot.mennyiseg,
                                    beszerzesiAr: lot.beszerzesiAr,
                                    ertek: lot.mennyiseg * lot.beszerzesiAr,
                                    createdAt: lot.createdAt.toISOString(),
                                });
                            }
                            atlagBeszerzesiAr = totalQuantity > 0 ? totalValue / totalQuantity : 0;
                            készletérték = totalValue;
                            return [2 /*return*/, {
                                    itemId: itemId,
                                    itemNev: item.nev,
                                    warehouseId: warehouseId,
                                    warehouseNev: warehouse.nev,
                                    mennyiseg: totalQuantity,
                                    ertekelesMod: valuationMethod,
                                    készletérték: készletérték,
                                    atlagBeszerzesiAr: atlagBeszerzesiAr,
                                    lotDetails: lotDetails,
                                }];
                        }
                        else {
                            // FIFO or LIFO: use lot prices directly
                            for (_a = 0, stockLots_2 = stockLots; _a < stockLots_2.length; _a++) {
                                lot = stockLots_2[_a];
                                lotValue = lot.mennyiseg * lot.beszerzesiAr;
                                készletérték += lotValue;
                                lotDetails.push({
                                    lotId: lot.id,
                                    sarzsGyartasiSzam: lot.sarzsGyartasiSzam,
                                    mennyiseg: lot.mennyiseg,
                                    beszerzesiAr: lot.beszerzesiAr,
                                    ertek: lotValue,
                                    createdAt: lot.createdAt.toISOString(),
                                });
                            }
                            totalQuantity = stockLots.reduce(function (sum, lot) { return sum + lot.mennyiseg; }, 0);
                            atlagBeszerzesiAr = totalQuantity > 0 ? készletérték / totalQuantity : 0;
                            return [2 /*return*/, {
                                    itemId: itemId,
                                    itemNev: item.nev,
                                    warehouseId: warehouseId,
                                    warehouseNev: warehouse.nev,
                                    mennyiseg: totalQuantity,
                                    ertekelesMod: valuationMethod,
                                    készletérték: készletérték,
                                    atlagBeszerzesiAr: atlagBeszerzesiAr,
                                    lotDetails: lotDetails,
                                }];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    StockValuationService.prototype.calculateStockValueForSale = function (itemId, warehouseId, mennyiseg, ertekelesMod) {
        return __awaiter(this, void 0, void 0, function () {
            var warehouse, valuationMethod, stockLots, remainingQuantity, totalCost, usedLots, totalValue, totalQuantity, avgCost, _i, stockLots_3, lot, proportion, usedFromLot, lotCost, _a, stockLots_4, lot, usedFromLot, lotCost;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (mennyiseg <= 0) {
                            throw new common_1.BadRequestException('A mennyiségnek pozitívnak kell lennie');
                        }
                        return [4 /*yield*/, this.prisma.warehouse.findUnique({
                                where: { id: warehouseId },
                            })];
                    case 1:
                        warehouse = _b.sent();
                        if (!warehouse) {
                            throw new common_1.NotFoundException('Raktár nem található');
                        }
                        valuationMethod = ertekelesMod || warehouse.ertekelesMod || 'FIFO';
                        return [4 /*yield*/, this.prisma.stockLot.findMany({
                                where: {
                                    itemId: itemId,
                                    warehouseId: warehouseId,
                                    mennyiseg: {
                                        gt: 0,
                                    },
                                },
                                orderBy: {
                                    createdAt: valuationMethod === 'LIFO' ? 'desc' : 'asc',
                                },
                            })];
                    case 2:
                        stockLots = _b.sent();
                        remainingQuantity = mennyiseg;
                        totalCost = 0;
                        usedLots = [];
                        if (valuationMethod === 'AVG') {
                            totalValue = stockLots.reduce(function (sum, lot) { return sum + lot.mennyiseg * lot.beszerzesiAr; }, 0);
                            totalQuantity = stockLots.reduce(function (sum, lot) { return sum + lot.mennyiseg; }, 0);
                            avgCost = totalQuantity > 0 ? totalValue / totalQuantity : 0;
                            totalCost = mennyiseg * avgCost;
                            // Distribute across lots proportionally
                            for (_i = 0, stockLots_3 = stockLots; _i < stockLots_3.length; _i++) {
                                lot = stockLots_3[_i];
                                if (remainingQuantity <= 0)
                                    break;
                                proportion = lot.mennyiseg / totalQuantity;
                                usedFromLot = Math.min(lot.mennyiseg, remainingQuantity * proportion);
                                lotCost = usedFromLot * avgCost;
                                usedLots.push({
                                    lotId: lot.id,
                                    mennyiseg: usedFromLot,
                                    beszerzesiAr: avgCost,
                                    koltseg: lotCost,
                                });
                                remainingQuantity -= usedFromLot;
                            }
                        }
                        else {
                            // FIFO or LIFO: use lot prices in order
                            for (_a = 0, stockLots_4 = stockLots; _a < stockLots_4.length; _a++) {
                                lot = stockLots_4[_a];
                                if (remainingQuantity <= 0)
                                    break;
                                usedFromLot = Math.min(lot.mennyiseg, remainingQuantity);
                                lotCost = usedFromLot * lot.beszerzesiAr;
                                usedLots.push({
                                    lotId: lot.id,
                                    mennyiseg: usedFromLot,
                                    beszerzesiAr: lot.beszerzesiAr,
                                    koltseg: lotCost,
                                });
                                totalCost += lotCost;
                                remainingQuantity -= usedFromLot;
                            }
                        }
                        if (remainingQuantity > 0) {
                            throw new common_1.BadRequestException("Nincs el\u00E9g k\u00E9szlet. Hi\u00E1nyzik: ".concat(remainingQuantity));
                        }
                        return [2 /*return*/, {
                                koltseg: totalCost,
                                usedLots: usedLots,
                            }];
                }
            });
        });
    };
    StockValuationService.prototype.getStockValuationReport = function (warehouseId, ertekelesMod, itemGroupId) {
        return __awaiter(this, void 0, void 0, function () {
            var where, itemWhere, stockLevels, results, _i, stockLevels_1, stockLevel, stockLots, valuation, item, warehouse, recentLots, avgPrice, totalValue, totalQty, készletérték;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        where = {};
                        if (warehouseId) {
                            where.warehouseId = warehouseId;
                        }
                        itemWhere = {};
                        if (itemGroupId) {
                            itemWhere.itemGroupId = itemGroupId;
                        }
                        return [4 /*yield*/, this.prisma.stockLevel.findMany({
                                where: __assign(__assign({}, where), { mennyiseg: {
                                        gt: 0,
                                    }, item: itemWhere }),
                                include: {
                                    item: {
                                        include: {
                                            itemGroup: true,
                                        },
                                    },
                                    warehouse: true,
                                },
                                distinct: ['itemId', 'warehouseId'],
                            })];
                    case 1:
                        stockLevels = _a.sent();
                        results = [];
                        _i = 0, stockLevels_1 = stockLevels;
                        _a.label = 2;
                    case 2:
                        if (!(_i < stockLevels_1.length)) return [3 /*break*/, 8];
                        stockLevel = stockLevels_1[_i];
                        return [4 /*yield*/, this.prisma.stockLot.findMany({
                                where: {
                                    itemId: stockLevel.itemId,
                                    warehouseId: stockLevel.warehouseId,
                                    mennyiseg: {
                                        gt: 0,
                                    },
                                },
                            })];
                    case 3:
                        stockLots = _a.sent();
                        if (!(stockLots.length > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.calculateStockValue(stockLevel.itemId, stockLevel.warehouseId, ertekelesMod)];
                    case 4:
                        valuation = _a.sent();
                        results.push(valuation);
                        return [3 /*break*/, 7];
                    case 5:
                        item = stockLevel.item;
                        warehouse = stockLevel.warehouse;
                        return [4 /*yield*/, this.prisma.stockLot.findMany({
                                where: {
                                    itemId: stockLevel.itemId,
                                    mennyiseg: {
                                        gt: 0,
                                    },
                                },
                                orderBy: {
                                    createdAt: 'desc',
                                },
                                take: 10,
                            })];
                    case 6:
                        recentLots = _a.sent();
                        avgPrice = 0;
                        if (recentLots.length > 0) {
                            totalValue = recentLots.reduce(function (sum, lot) { return sum + (lot.mennyiseg * lot.beszerzesiAr); }, 0);
                            totalQty = recentLots.reduce(function (sum, lot) { return sum + lot.mennyiseg; }, 0);
                            avgPrice = totalQty > 0 ? totalValue / totalQty : 0;
                        }
                        készletérték = stockLevel.mennyiseg * avgPrice;
                        results.push({
                            itemId: stockLevel.itemId,
                            itemNev: item.nev,
                            warehouseId: stockLevel.warehouseId,
                            warehouseNev: warehouse.nev,
                            mennyiseg: stockLevel.mennyiseg,
                            ertekelesMod: ertekelesMod || warehouse.ertekelesMod || 'FIFO',
                            készletérték: készletérték,
                            atlagBeszerzesiAr: avgPrice,
                            lotDetails: [],
                        });
                        _a.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 2];
                    case 8: return [2 /*return*/, results];
                }
            });
        });
    };
    StockValuationService.prototype.updateWarehouseValuationMethod = function (warehouseId, ertekelesMod) {
        return __awaiter(this, void 0, void 0, function () {
            var validMethods, warehouse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validMethods = ['FIFO', 'LIFO', 'AVG'];
                        if (!validMethods.includes(ertekelesMod)) {
                            throw new common_1.BadRequestException('Érvénytelen értékelési módszer');
                        }
                        return [4 /*yield*/, this.prisma.warehouse.findUnique({
                                where: { id: warehouseId },
                            })];
                    case 1:
                        warehouse = _a.sent();
                        if (!warehouse) {
                            throw new common_1.NotFoundException('Raktár nem található');
                        }
                        return [2 /*return*/, this.prisma.warehouse.update({
                                where: { id: warehouseId },
                                data: {
                                    ertekelesMod: ertekelesMod,
                                },
                            })];
                }
            });
        });
    };
    StockValuationService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], StockValuationService);
    return StockValuationService;
}());
exports.StockValuationService = StockValuationService;
