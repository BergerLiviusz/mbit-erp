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
exports.ReturnService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var stock_service_1 = require("./stock.service");
var ReturnService = /** @class */ (function () {
    function ReturnService(prisma, stockService) {
        this.prisma = prisma;
        this.stockService = stockService;
    }
    ReturnService.prototype.findAll = function () {
        return __awaiter(this, arguments, void 0, function (skip, take, filters) {
            var where, _a, total, items;
            if (skip === void 0) { skip = 0; }
            if (take === void 0) { take = 50; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        where = {};
                        if (filters === null || filters === void 0 ? void 0 : filters.orderId) {
                            where.orderId = filters.orderId;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.purchaseOrderId) {
                            where.purchaseOrderId = filters.purchaseOrderId;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.itemId) {
                            where.itemId = filters.itemId;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.warehouseId) {
                            where.warehouseId = filters.warehouseId;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.allapot) {
                            where.allapot = filters.allapot;
                        }
                        return [4 /*yield*/, Promise.all([
                                this.prisma.return.count({ where: where }),
                                this.prisma.return.findMany({
                                    where: where,
                                    skip: skip,
                                    take: take,
                                    include: {
                                        order: {
                                            select: {
                                                id: true,
                                                azonosito: true,
                                            },
                                        },
                                        purchaseOrder: {
                                            select: {
                                                id: true,
                                                azonosito: true,
                                            },
                                        },
                                        item: {
                                            select: {
                                                id: true,
                                                azonosito: true,
                                                nev: true,
                                            },
                                        },
                                        warehouse: {
                                            select: {
                                                id: true,
                                                azonosito: true,
                                                nev: true,
                                            },
                                        },
                                        createdBy: {
                                            select: {
                                                id: true,
                                                nev: true,
                                                email: true,
                                            },
                                        },
                                        approvedBy: {
                                            select: {
                                                id: true,
                                                nev: true,
                                                email: true,
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
    ReturnService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var returnItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.return.findUnique({
                            where: { id: id },
                            include: {
                                order: true,
                                purchaseOrder: true,
                                item: true,
                                warehouse: true,
                                createdBy: {
                                    select: {
                                        id: true,
                                        nev: true,
                                        email: true,
                                    },
                                },
                                approvedBy: {
                                    select: {
                                        id: true,
                                        nev: true,
                                        email: true,
                                    },
                                },
                            },
                        })];
                    case 1:
                        returnItem = _a.sent();
                        if (!returnItem) {
                            throw new common_1.NotFoundException('Visszárú nem található');
                        }
                        return [2 /*return*/, returnItem];
                }
            });
        });
    };
    ReturnService.prototype.create = function (dto, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var item, warehouse, order, purchaseOrder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.item.findUnique({
                            where: { id: dto.itemId },
                        })];
                    case 1:
                        item = _a.sent();
                        if (!item) {
                            throw new common_1.NotFoundException('Áru nem található');
                        }
                        return [4 /*yield*/, this.prisma.warehouse.findUnique({
                                where: { id: dto.warehouseId },
                            })];
                    case 2:
                        warehouse = _a.sent();
                        if (!warehouse) {
                            throw new common_1.NotFoundException('Raktár nem található');
                        }
                        if (!dto.orderId) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.prisma.order.findUnique({
                                where: { id: dto.orderId },
                            })];
                    case 3:
                        order = _a.sent();
                        if (!order) {
                            throw new common_1.NotFoundException('Rendelés nem található');
                        }
                        _a.label = 4;
                    case 4:
                        if (!dto.purchaseOrderId) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.prisma.purchaseOrder.findUnique({
                                where: { id: dto.purchaseOrderId },
                            })];
                    case 5:
                        purchaseOrder = _a.sent();
                        if (!purchaseOrder) {
                            throw new common_1.NotFoundException('Beszerzési rendelés nem található');
                        }
                        _a.label = 6;
                    case 6:
                        // Ensure only one of orderId or purchaseOrderId is provided
                        if (dto.orderId && dto.purchaseOrderId) {
                            throw new common_1.BadRequestException('Csak egy rendelés (order vagy purchaseOrder) adható meg');
                        }
                        return [2 /*return*/, this.prisma.return.create({
                                data: {
                                    orderId: dto.orderId || null,
                                    purchaseOrderId: dto.purchaseOrderId || null,
                                    itemId: dto.itemId,
                                    warehouseId: dto.warehouseId,
                                    mennyiseg: dto.mennyiseg,
                                    ok: dto.ok,
                                    visszaruDatum: dto.visszaruDatum ? new Date(dto.visszaruDatum) : new Date(),
                                    megjegyzesek: dto.megjegyzesek || null,
                                    createdById: userId || null,
                                    allapot: 'PENDING',
                                },
                                include: {
                                    order: true,
                                    purchaseOrder: true,
                                    item: true,
                                    warehouse: true,
                                    createdBy: {
                                        select: {
                                            id: true,
                                            nev: true,
                                            email: true,
                                        },
                                    },
                                },
                            })];
                }
            });
        });
    };
    ReturnService.prototype.update = function (id, dto, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var returnItem, updateData, item, warehouse, purchaseOrder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        returnItem = _a.sent();
                        // Only allow updates if status is PENDING
                        if (returnItem.allapot !== 'PENDING') {
                            throw new common_1.BadRequestException('Csak PENDING állapotú visszárú módosítható');
                        }
                        updateData = {};
                        if (!(dto.itemId !== undefined)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.prisma.item.findUnique({
                                where: { id: dto.itemId },
                            })];
                    case 2:
                        item = _a.sent();
                        if (!item) {
                            throw new common_1.NotFoundException('Áru nem található');
                        }
                        updateData.itemId = dto.itemId;
                        _a.label = 3;
                    case 3:
                        if (!(dto.warehouseId !== undefined)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.prisma.warehouse.findUnique({
                                where: { id: dto.warehouseId },
                            })];
                    case 4:
                        warehouse = _a.sent();
                        if (!warehouse) {
                            throw new common_1.NotFoundException('Raktár nem található');
                        }
                        updateData.warehouseId = dto.warehouseId;
                        _a.label = 5;
                    case 5:
                        if (dto.mennyiseg !== undefined) {
                            updateData.mennyiseg = dto.mennyiseg;
                        }
                        if (dto.ok !== undefined) {
                            updateData.ok = dto.ok;
                        }
                        if (dto.visszaruDatum !== undefined) {
                            updateData.visszaruDatum = new Date(dto.visszaruDatum);
                        }
                        if (dto.megjegyzesek !== undefined) {
                            updateData.megjegyzesek = dto.megjegyzesek;
                        }
                        if (!(dto.purchaseOrderId !== undefined)) return [3 /*break*/, 8];
                        if (!dto.purchaseOrderId) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.prisma.purchaseOrder.findUnique({
                                where: { id: dto.purchaseOrderId },
                            })];
                    case 6:
                        purchaseOrder = _a.sent();
                        if (!purchaseOrder) {
                            throw new common_1.NotFoundException('Beszerzési rendelés nem található');
                        }
                        _a.label = 7;
                    case 7:
                        updateData.purchaseOrderId = dto.purchaseOrderId || null;
                        _a.label = 8;
                    case 8: return [2 /*return*/, this.prisma.return.update({
                            where: { id: id },
                            data: updateData,
                            include: {
                                order: true,
                                purchaseOrder: true,
                                item: true,
                                warehouse: true,
                                createdBy: {
                                    select: {
                                        id: true,
                                        nev: true,
                                        email: true,
                                    },
                                },
                            },
                        })];
                }
            });
        });
    };
    ReturnService.prototype.approve = function (id, userId, megjegyzesek) {
        return __awaiter(this, void 0, void 0, function () {
            var returnItem, updatedReturn;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        returnItem = _a.sent();
                        if (returnItem.allapot !== 'PENDING') {
                            throw new common_1.BadRequestException('Csak PENDING állapotú visszárú jóváhagyható');
                        }
                        return [4 /*yield*/, this.prisma.return.update({
                                where: { id: id },
                                data: {
                                    allapot: 'APPROVED',
                                    approvedById: userId,
                                    megjegyzesek: megjegyzesek || returnItem.megjegyzesek,
                                },
                                include: {
                                    order: true,
                                    purchaseOrder: true,
                                    item: true,
                                    warehouse: true,
                                    approvedBy: {
                                        select: {
                                            id: true,
                                            nev: true,
                                            email: true,
                                        },
                                    },
                                },
                            })];
                    case 2:
                        updatedReturn = _a.sent();
                        // Create StockMove for return
                        return [4 /*yield*/, this.stockService.createStockMove({
                                itemId: returnItem.itemId,
                                warehouseId: returnItem.warehouseId,
                                tipus: 'RETURN',
                                mennyiseg: returnItem.mennyiseg,
                                referenciaId: id,
                                megjegyzesek: "Vissz\u00E1r\u00FA j\u00F3v\u00E1hagyva: ".concat(megjegyzesek || ''),
                            })];
                    case 3:
                        // Create StockMove for return
                        _a.sent();
                        return [2 /*return*/, updatedReturn];
                }
            });
        });
    };
    ReturnService.prototype.reject = function (id, userId, reason) {
        return __awaiter(this, void 0, void 0, function () {
            var returnItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        returnItem = _a.sent();
                        if (returnItem.allapot !== 'PENDING') {
                            throw new common_1.BadRequestException('Csak PENDING állapotú visszárú elutasítható');
                        }
                        return [2 /*return*/, this.prisma.return.update({
                                where: { id: id },
                                data: {
                                    allapot: 'REJECTED',
                                    approvedById: userId,
                                    megjegyzesek: reason || returnItem.megjegyzesek || 'Elutasítva',
                                },
                                include: {
                                    order: true,
                                    purchaseOrder: true,
                                    item: true,
                                    warehouse: true,
                                    approvedBy: {
                                        select: {
                                            id: true,
                                            nev: true,
                                            email: true,
                                        },
                                    },
                                },
                            })];
                }
            });
        });
    };
    ReturnService.prototype.complete = function (id, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var returnItem, stockLevel, availableStock;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        returnItem = _c.sent();
                        if (returnItem.allapot !== 'APPROVED') {
                            throw new common_1.BadRequestException('Csak APPROVED állapotú visszárú feldolgozható');
                        }
                        return [4 /*yield*/, this.prisma.stockLevel.findFirst({
                                where: {
                                    itemId: returnItem.itemId,
                                    warehouseId: returnItem.warehouseId,
                                },
                            })];
                    case 2:
                        stockLevel = _c.sent();
                        if (!returnItem.purchaseOrderId) return [3 /*break*/, 7];
                        if (!stockLevel) return [3 /*break*/, 4];
                        availableStock = stockLevel.mennyiseg - (stockLevel.foglaltMennyiseg || 0);
                        if (availableStock < returnItem.mennyiseg) {
                            throw new common_1.BadRequestException("Nincs el\u00E9g k\u00E9szlet a vissz\u00E1r\u00FAhoz. El\u00E9rhet\u0151: ".concat(availableStock, ", K\u00E9rt: ").concat(returnItem.mennyiseg));
                        }
                        return [4 /*yield*/, this.prisma.stockLevel.update({
                                where: { id: stockLevel.id },
                                data: {
                                    mennyiseg: {
                                        decrement: returnItem.mennyiseg,
                                    },
                                },
                            })];
                    case 3:
                        _c.sent();
                        return [3 /*break*/, 5];
                    case 4: throw new common_1.BadRequestException('Nincs készlet a visszárúhoz');
                    case 5: 
                    // Create stock move for audit trail
                    return [4 /*yield*/, this.prisma.stockMove.create({
                            data: {
                                itemId: returnItem.itemId,
                                warehouseId: returnItem.warehouseId,
                                tipus: 'BESZERZES_VISSZARU',
                                mennyiseg: -returnItem.mennyiseg,
                                referenciaId: returnItem.purchaseOrderId,
                                megjegyzesek: "Beszerz\u00E9si vissz\u00E1r\u00FA: ".concat(((_a = returnItem.purchaseOrder) === null || _a === void 0 ? void 0 : _a.azonosito) || returnItem.purchaseOrderId),
                            },
                        })];
                    case 6:
                        // Create stock move for audit trail
                        _c.sent();
                        return [3 /*break*/, 13];
                    case 7:
                        if (!stockLevel) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.prisma.stockLevel.update({
                                where: { id: stockLevel.id },
                                data: {
                                    mennyiseg: {
                                        increment: returnItem.mennyiseg,
                                    },
                                },
                            })];
                    case 8:
                        _c.sent();
                        return [3 /*break*/, 11];
                    case 9: 
                    // Create new stock level if it doesn't exist
                    return [4 /*yield*/, this.prisma.stockLevel.create({
                            data: {
                                itemId: returnItem.itemId,
                                warehouseId: returnItem.warehouseId,
                                mennyiseg: returnItem.mennyiseg,
                            },
                        })];
                    case 10:
                        // Create new stock level if it doesn't exist
                        _c.sent();
                        _c.label = 11;
                    case 11: 
                    // Create stock move for audit trail
                    return [4 /*yield*/, this.prisma.stockMove.create({
                            data: {
                                itemId: returnItem.itemId,
                                warehouseId: returnItem.warehouseId,
                                tipus: 'ELADAS_VISSZARU',
                                mennyiseg: returnItem.mennyiseg,
                                referenciaId: returnItem.orderId || id,
                                megjegyzesek: "Elad\u00E1si vissz\u00E1r\u00FA: ".concat(((_b = returnItem.order) === null || _b === void 0 ? void 0 : _b.azonosito) || returnItem.orderId || id),
                            },
                        })];
                    case 12:
                        // Create stock move for audit trail
                        _c.sent();
                        _c.label = 13;
                    case 13: 
                    // Update return status to COMPLETED
                    return [2 /*return*/, this.prisma.return.update({
                            where: { id: id },
                            data: {
                                allapot: 'COMPLETED',
                            },
                            include: {
                                order: true,
                                purchaseOrder: true,
                                item: true,
                                warehouse: true,
                                createdBy: {
                                    select: {
                                        id: true,
                                        nev: true,
                                        email: true,
                                    },
                                },
                                approvedBy: {
                                    select: {
                                        id: true,
                                        nev: true,
                                        email: true,
                                    },
                                },
                            },
                        })];
                }
            });
        });
    };
    ReturnService.prototype.getByOrder = function (orderId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.return.findMany({
                        where: { orderId: orderId },
                        include: {
                            purchaseOrder: true,
                            item: true,
                            warehouse: true,
                            createdBy: {
                                select: {
                                    id: true,
                                    nev: true,
                                    email: true,
                                },
                            },
                            approvedBy: {
                                select: {
                                    id: true,
                                    nev: true,
                                    email: true,
                                },
                            },
                        },
                        orderBy: { createdAt: 'desc' },
                    })];
            });
        });
    };
    ReturnService.prototype.getByPurchaseOrder = function (purchaseOrderId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.return.findMany({
                        where: { purchaseOrderId: purchaseOrderId },
                        include: {
                            order: true,
                            item: true,
                            warehouse: true,
                            createdBy: {
                                select: {
                                    id: true,
                                    nev: true,
                                    email: true,
                                },
                            },
                            approvedBy: {
                                select: {
                                    id: true,
                                    nev: true,
                                    email: true,
                                },
                            },
                        },
                        orderBy: { createdAt: 'desc' },
                    })];
            });
        });
    };
    ReturnService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService,
            stock_service_1.StockService])
    ], ReturnService);
    return ReturnService;
}());
exports.ReturnService = ReturnService;
