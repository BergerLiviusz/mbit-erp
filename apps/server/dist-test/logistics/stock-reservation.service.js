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
exports.StockReservationService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var StockReservationService = /** @class */ (function () {
    function StockReservationService(prisma) {
        this.prisma = prisma;
    }
    StockReservationService.prototype.findAllReservations = function () {
        return __awaiter(this, arguments, void 0, function (skip, take, filters) {
            var where, _a, total, items;
            if (skip === void 0) { skip = 0; }
            if (take === void 0) { take = 50; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        where = {};
                        if (filters === null || filters === void 0 ? void 0 : filters.itemId) {
                            where.itemId = filters.itemId;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.warehouseId) {
                            where.warehouseId = filters.warehouseId;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.orderId) {
                            where.orderId = filters.orderId;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.allapot) {
                            where.allapot = filters.allapot;
                        }
                        return [4 /*yield*/, Promise.all([
                                this.prisma.stockReservation.count({ where: where }),
                                this.prisma.stockReservation.findMany({
                                    where: where,
                                    skip: skip,
                                    take: take,
                                    include: {
                                        item: {
                                            select: {
                                                id: true,
                                                nev: true,
                                                azonosito: true,
                                                egyseg: true,
                                            },
                                        },
                                        warehouse: {
                                            select: {
                                                id: true,
                                                nev: true,
                                                azonosito: true,
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
    StockReservationService.prototype.findOneReservation = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var reservation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.stockReservation.findUnique({
                            where: { id: id },
                            include: {
                                item: true,
                                warehouse: true,
                            },
                        })];
                    case 1:
                        reservation = _a.sent();
                        if (!reservation) {
                            throw new common_1.NotFoundException('Készletfoglalás nem található');
                        }
                        return [2 /*return*/, reservation];
                }
            });
        });
    };
    StockReservationService.prototype.createReservation = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var item, warehouse, stockLevel, availableStock, reservation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.item.findUnique({
                            where: { id: dto.itemId },
                        })];
                    case 1:
                        item = _a.sent();
                        if (!item) {
                            throw new common_1.NotFoundException('Termék nem található');
                        }
                        return [4 /*yield*/, this.prisma.warehouse.findUnique({
                                where: { id: dto.warehouseId },
                            })];
                    case 2:
                        warehouse = _a.sent();
                        if (!warehouse) {
                            throw new common_1.NotFoundException('Raktár nem található');
                        }
                        return [4 /*yield*/, this.prisma.stockLevel.findFirst({
                                where: {
                                    itemId: dto.itemId,
                                    warehouseId: dto.warehouseId,
                                    locationId: dto.locationId || null,
                                },
                            })];
                    case 3:
                        stockLevel = _a.sent();
                        availableStock = ((stockLevel === null || stockLevel === void 0 ? void 0 : stockLevel.mennyiseg) || 0) - ((stockLevel === null || stockLevel === void 0 ? void 0 : stockLevel.foglaltMennyiseg) || 0);
                        if (dto.mennyiseg > availableStock) {
                            throw new common_1.BadRequestException("Nincs el\u00E9g szabad k\u00E9szlet. El\u00E9rhet\u0151: ".concat(availableStock, ", K\u00E9rt: ").concat(dto.mennyiseg));
                        }
                        return [4 /*yield*/, this.prisma.stockReservation.create({
                                data: {
                                    itemId: dto.itemId,
                                    warehouseId: dto.warehouseId,
                                    locationId: dto.locationId || null,
                                    orderId: dto.orderId,
                                    purchaseOrderId: dto.purchaseOrderId,
                                    mennyiseg: dto.mennyiseg,
                                    megjegyzesek: dto.megjegyzesek,
                                },
                                include: {
                                    item: true,
                                    warehouse: true,
                                },
                            })];
                    case 4:
                        reservation = _a.sent();
                        if (!stockLevel) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.prisma.stockLevel.update({
                                where: { id: stockLevel.id },
                                data: {
                                    foglaltMennyiseg: (stockLevel.foglaltMennyiseg || 0) + dto.mennyiseg,
                                },
                            })];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, reservation];
                }
            });
        });
    };
    StockReservationService.prototype.updateReservation = function (id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var reservation, updateData, stockLevel, oldReserved, newReserved, availableStock, stockLevel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneReservation(id)];
                    case 1:
                        reservation = _a.sent();
                        updateData = {};
                        if (!(dto.mennyiseg !== undefined)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.prisma.stockLevel.findFirst({
                                where: {
                                    itemId: reservation.itemId,
                                    warehouseId: reservation.warehouseId,
                                    locationId: reservation.locationId || null,
                                },
                            })];
                    case 2:
                        stockLevel = _a.sent();
                        if (!stockLevel) return [3 /*break*/, 4];
                        oldReserved = reservation.mennyiseg;
                        newReserved = dto.mennyiseg;
                        availableStock = (stockLevel.mennyiseg || 0) - (stockLevel.foglaltMennyiseg || 0) + oldReserved;
                        if (newReserved > availableStock) {
                            throw new common_1.BadRequestException("Nincs el\u00E9g szabad k\u00E9szlet. El\u00E9rhet\u0151: ".concat(availableStock, ", K\u00E9rt: ").concat(newReserved));
                        }
                        return [4 /*yield*/, this.prisma.stockLevel.update({
                                where: { id: stockLevel.id },
                                data: {
                                    foglaltMennyiseg: (stockLevel.foglaltMennyiseg || 0) - oldReserved + newReserved,
                                },
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        updateData.mennyiseg = dto.mennyiseg;
                        _a.label = 5;
                    case 5:
                        if (!(dto.allapot !== undefined)) return [3 /*break*/, 8];
                        updateData.allapot = dto.allapot;
                        if (!(dto.allapot === 'KISZALLITVA' || dto.allapot === 'TOROLVE')) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.prisma.stockLevel.findFirst({
                                where: {
                                    itemId: reservation.itemId,
                                    warehouseId: reservation.warehouseId,
                                    locationId: reservation.locationId || null,
                                },
                            })];
                    case 6:
                        stockLevel = _a.sent();
                        if (!stockLevel) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.prisma.stockLevel.update({
                                where: { id: stockLevel.id },
                                data: {
                                    foglaltMennyiseg: Math.max(0, (stockLevel.foglaltMennyiseg || 0) - reservation.mennyiseg),
                                },
                            })];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        if (dto.megjegyzesek !== undefined) {
                            updateData.megjegyzesek = dto.megjegyzesek;
                        }
                        return [2 /*return*/, this.prisma.stockReservation.update({
                                where: { id: id },
                                data: updateData,
                                include: {
                                    item: true,
                                    warehouse: true,
                                },
                            })];
                }
            });
        });
    };
    StockReservationService.prototype.deleteReservation = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var reservation, stockLevel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneReservation(id)];
                    case 1:
                        reservation = _a.sent();
                        return [4 /*yield*/, this.prisma.stockLevel.findFirst({
                                where: {
                                    itemId: reservation.itemId,
                                    warehouseId: reservation.warehouseId,
                                    locationId: reservation.locationId || null,
                                },
                            })];
                    case 2:
                        stockLevel = _a.sent();
                        if (!stockLevel) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.prisma.stockLevel.update({
                                where: { id: stockLevel.id },
                                data: {
                                    foglaltMennyiseg: Math.max(0, (stockLevel.foglaltMennyiseg || 0) - reservation.mennyiseg),
                                },
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, this.prisma.stockReservation.delete({
                            where: { id: id },
                        })];
                }
            });
        });
    };
    // Expected Receipts
    StockReservationService.prototype.findAllExpectedReceipts = function () {
        return __awaiter(this, arguments, void 0, function (skip, take, filters) {
            var where, _a, total, items;
            if (skip === void 0) { skip = 0; }
            if (take === void 0) { take = 50; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        where = {};
                        if (filters === null || filters === void 0 ? void 0 : filters.warehouseId) {
                            where.warehouseId = filters.warehouseId;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.purchaseOrderId) {
                            where.purchaseOrderId = filters.purchaseOrderId;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.allapot) {
                            where.allapot = filters.allapot;
                        }
                        if ((filters === null || filters === void 0 ? void 0 : filters.vartBeerkezesFrom) || (filters === null || filters === void 0 ? void 0 : filters.vartBeerkezesTo)) {
                            where.vartBeerkezes = {};
                            if (filters.vartBeerkezesFrom) {
                                where.vartBeerkezes.gte = new Date(filters.vartBeerkezesFrom);
                            }
                            if (filters.vartBeerkezesTo) {
                                where.vartBeerkezes.lte = new Date(filters.vartBeerkezesTo);
                            }
                        }
                        return [4 /*yield*/, Promise.all([
                                this.prisma.expectedReceipt.count({ where: where }),
                                this.prisma.expectedReceipt.findMany({
                                    where: where,
                                    skip: skip,
                                    take: take,
                                    include: {
                                        warehouse: {
                                            select: {
                                                id: true,
                                                nev: true,
                                                azonosito: true,
                                            },
                                        },
                                        items: {
                                            include: {
                                                item: {
                                                    select: {
                                                        id: true,
                                                        nev: true,
                                                        azonosito: true,
                                                    },
                                                },
                                            },
                                        },
                                        _count: {
                                            select: {
                                                items: true,
                                            },
                                        },
                                    },
                                    orderBy: {
                                        vartBeerkezes: 'asc',
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
    StockReservationService.prototype.findOneExpectedReceipt = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.expectedReceipt.findUnique({
                            where: { id: id },
                            include: {
                                warehouse: true,
                                items: {
                                    include: {
                                        item: true,
                                    },
                                },
                            },
                        })];
                    case 1:
                        receipt = _a.sent();
                        if (!receipt) {
                            throw new common_1.NotFoundException('Várható beérkezés nem található');
                        }
                        return [2 /*return*/, receipt];
                }
            });
        });
    };
    StockReservationService.prototype.createExpectedReceipt = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var warehouse, _i, _a, itemDto, item;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.prisma.warehouse.findUnique({
                            where: { id: dto.warehouseId },
                        })];
                    case 1:
                        warehouse = _b.sent();
                        if (!warehouse) {
                            throw new common_1.NotFoundException('Raktár nem található');
                        }
                        if (!dto.items || dto.items.length === 0) {
                            throw new common_1.BadRequestException('Legalább egy tétel szükséges');
                        }
                        _i = 0, _a = dto.items;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        itemDto = _a[_i];
                        return [4 /*yield*/, this.prisma.item.findUnique({
                                where: { id: itemDto.itemId },
                            })];
                    case 3:
                        item = _b.sent();
                        if (!item) {
                            throw new common_1.NotFoundException("Term\u00E9k nem tal\u00E1lhat\u00F3: ".concat(itemDto.itemId));
                        }
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, this.prisma.expectedReceipt.create({
                            data: {
                                warehouseId: dto.warehouseId,
                                purchaseOrderId: dto.purchaseOrderId,
                                vartBeerkezes: new Date(dto.vartBeerkezes),
                                megjegyzesek: dto.megjegyzesek,
                                items: {
                                    create: dto.items.map(function (itemDto) { return ({
                                        itemId: itemDto.itemId,
                                        mennyiseg: itemDto.mennyiseg,
                                        egysegAr: itemDto.egysegAr,
                                        megjegyzesek: itemDto.megjegyzesek,
                                    }); }),
                                },
                            },
                            include: {
                                warehouse: true,
                                items: {
                                    include: {
                                        item: true,
                                    },
                                },
                            },
                        })];
                }
            });
        });
    };
    StockReservationService.prototype.markExpectedReceiptAsReceived = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneExpectedReceipt(id)];
                    case 1:
                        receipt = _a.sent();
                        if (receipt.allapot === 'ERKEZETT') {
                            throw new common_1.BadRequestException('A beérkezés már rögzítve van');
                        }
                        return [2 /*return*/, this.prisma.expectedReceipt.update({
                                where: { id: id },
                                data: {
                                    allapot: 'ERKEZETT',
                                },
                                include: {
                                    warehouse: true,
                                    items: {
                                        include: {
                                            item: true,
                                        },
                                    },
                                },
                            })];
                }
            });
        });
    };
    StockReservationService.prototype.deleteExpectedReceipt = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneExpectedReceipt(id)];
                    case 1:
                        receipt = _a.sent();
                        return [2 /*return*/, this.prisma.expectedReceipt.delete({
                                where: { id: id },
                            })];
                }
            });
        });
    };
    StockReservationService.prototype.getAvailableStock = function (itemId, warehouseId, locationId) {
        return __awaiter(this, void 0, void 0, function () {
            var stockLevel, totalStock, reservedStock, availableStock;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.stockLevel.findFirst({
                            where: {
                                itemId: itemId,
                                warehouseId: warehouseId,
                                locationId: locationId || null,
                            },
                        })];
                    case 1:
                        stockLevel = _a.sent();
                        totalStock = (stockLevel === null || stockLevel === void 0 ? void 0 : stockLevel.mennyiseg) || 0;
                        reservedStock = (stockLevel === null || stockLevel === void 0 ? void 0 : stockLevel.foglaltMennyiseg) || 0;
                        availableStock = totalStock - reservedStock;
                        return [2 /*return*/, {
                                totalStock: totalStock,
                                reservedStock: reservedStock,
                                availableStock: availableStock,
                            }];
                }
            });
        });
    };
    StockReservationService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], StockReservationService);
    return StockReservationService;
}());
exports.StockReservationService = StockReservationService;
