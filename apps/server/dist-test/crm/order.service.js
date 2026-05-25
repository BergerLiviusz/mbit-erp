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
exports.OrderService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var settings_service_1 = require("../system/settings.service");
var order_status_enum_1 = require("./enums/order-status.enum");
var OrderService = /** @class */ (function () {
    function OrderService(prisma, settingsService) {
        this.prisma = prisma;
        this.settingsService = settingsService;
    }
    OrderService.prototype.findAll = function () {
        return __awaiter(this, arguments, void 0, function (skip, take, filters) {
            var where, _a, data, total;
            if (skip === void 0) { skip = 0; }
            if (take === void 0) { take = 50; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        where = {};
                        if (filters === null || filters === void 0 ? void 0 : filters.allapot) {
                            where.allapot = filters.allapot;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.accountId) {
                            where.accountId = filters.accountId;
                        }
                        if ((filters === null || filters === void 0 ? void 0 : filters.startDate) || (filters === null || filters === void 0 ? void 0 : filters.endDate)) {
                            where.rendelesiDatum = {};
                            if (filters.startDate) {
                                where.rendelesiDatum.gte = new Date(filters.startDate);
                            }
                            if (filters.endDate) {
                                where.rendelesiDatum.lte = new Date(filters.endDate);
                            }
                        }
                        return [4 /*yield*/, Promise.all([
                                this.prisma.order.findMany({
                                    where: where,
                                    skip: skip,
                                    take: take,
                                    include: {
                                        account: {
                                            select: {
                                                id: true,
                                                nev: true,
                                                azonosito: true,
                                                email: true,
                                            },
                                        },
                                        quote: {
                                            select: {
                                                id: true,
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
                                        returns: {
                                            select: {
                                                id: true,
                                                allapot: true,
                                                mennyiseg: true,
                                            },
                                        },
                                    },
                                    orderBy: { createdAt: 'desc' },
                                }),
                                this.prisma.order.count({ where: where }),
                            ])];
                    case 1:
                        _a = _b.sent(), data = _a[0], total = _a[1];
                        return [2 /*return*/, { data: data, total: total, page: Math.floor(skip / take) + 1, pageSize: take }];
                }
            });
        });
    };
    OrderService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var order;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.order.findUnique({
                            where: { id: id },
                            include: {
                                account: {
                                    include: {
                                        contacts: true,
                                    },
                                },
                                quote: {
                                    include: {
                                        items: {
                                            include: {
                                                item: true,
                                            },
                                        },
                                    },
                                },
                                items: {
                                    include: {
                                        item: true,
                                    },
                                },
                                discounts: true,
                                shipments: true,
                                returns: {
                                    include: {
                                        item: true,
                                        warehouse: true,
                                    },
                                },
                            },
                        })];
                    case 1:
                        order = _a.sent();
                        if (!order) {
                            throw new common_1.NotFoundException("Order with ID ".concat(id, " not found."));
                        }
                        return [2 /*return*/, order];
                }
            });
        });
    };
    OrderService.prototype.findByAccount = function (accountId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.order.findMany({
                            where: { accountId: accountId },
                            include: {
                                items: {
                                    include: {
                                        item: true,
                                    },
                                },
                            },
                            orderBy: { createdAt: 'desc' },
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OrderService.prototype.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var account, quote, azonosito, osszeg, orderItems, _i, _a, itemDto, item, kedvezmeny, itemOsszeg, afa, vegosszeg;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.prisma.account.findUnique({
                            where: { id: data.accountId },
                        })];
                    case 1:
                        account = _b.sent();
                        if (!account) {
                            throw new common_1.NotFoundException("Account with ID ".concat(data.accountId, " not found."));
                        }
                        if (!data.quoteId) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.prisma.quote.findUnique({
                                where: { id: data.quoteId },
                            })];
                    case 2:
                        quote = _b.sent();
                        if (!quote) {
                            throw new common_1.NotFoundException("Quote with ID ".concat(data.quoteId, " not found."));
                        }
                        if (quote.allapot !== 'elfogadva' && quote.allapot !== 'jovahagyott') {
                            throw new common_1.BadRequestException('Only approved or accepted quotes can be converted to orders.');
                        }
                        _b.label = 3;
                    case 3: return [4 /*yield*/, this.generateOrderNumber()];
                    case 4:
                        azonosito = _b.sent();
                        osszeg = 0;
                        orderItems = [];
                        _i = 0, _a = data.items;
                        _b.label = 5;
                    case 5:
                        if (!(_i < _a.length)) return [3 /*break*/, 8];
                        itemDto = _a[_i];
                        return [4 /*yield*/, this.prisma.item.findUnique({
                                where: { id: itemDto.itemId },
                            })];
                    case 6:
                        item = _b.sent();
                        if (!item) {
                            throw new common_1.NotFoundException("Item with ID ".concat(itemDto.itemId, " not found."));
                        }
                        kedvezmeny = itemDto.kedvezmeny || 0;
                        itemOsszeg = itemDto.mennyiseg * itemDto.egysegAr * (1 - kedvezmeny / 100);
                        osszeg += itemOsszeg;
                        orderItems.push({
                            itemId: itemDto.itemId,
                            mennyiseg: itemDto.mennyiseg,
                            egysegAr: itemDto.egysegAr,
                            kedvezmeny: kedvezmeny,
                            osszeg: itemOsszeg,
                        });
                        _b.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 5];
                    case 8:
                        afa = osszeg * 0.27;
                        vegosszeg = osszeg + afa;
                        return [4 /*yield*/, this.prisma.order.create({
                                data: __assign(__assign({ azonosito: azonosito, rendelesiDatum: new Date(), szallitasiDatum: data.szallitasiDatum ? new Date(data.szallitasiDatum) : null, osszeg: osszeg, afa: afa, vegosszeg: vegosszeg, allapot: order_status_enum_1.OrderStatus.NEW, megjegyzesek: data.megjegyzesek, account: {
                                        connect: { id: data.accountId },
                                    } }, (data.quoteId && {
                                    quote: {
                                        connect: { id: data.quoteId },
                                    },
                                })), { items: {
                                        create: orderItems,
                                    } }),
                                include: {
                                    account: true,
                                    quote: true,
                                    items: {
                                        include: {
                                            item: true,
                                        },
                                    },
                                },
                            })];
                    case 9: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    OrderService.prototype.update = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var existingOrder, updateData, osszeg, orderItems, _i, _a, itemDto, item, kedvezmeny, itemOsszeg, afa, vegosszeg;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        existingOrder = _b.sent();
                        // Only allow updates to NEW orders, or status changes
                        if (existingOrder.allapot !== order_status_enum_1.OrderStatus.NEW && data.allapot === undefined) {
                            throw new common_1.BadRequestException('Only NEW orders can be updated. Use status change endpoint for workflow changes.');
                        }
                        updateData = __assign({}, data);
                        if (!(data.items && data.items.length > 0)) return [3 /*break*/, 7];
                        osszeg = 0;
                        orderItems = [];
                        _i = 0, _a = data.items;
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
                            throw new common_1.NotFoundException("Item with ID ".concat(itemDto.itemId, " not found."));
                        }
                        kedvezmeny = itemDto.kedvezmeny || 0;
                        itemOsszeg = itemDto.mennyiseg * itemDto.egysegAr * (1 - kedvezmeny / 100);
                        osszeg += itemOsszeg;
                        orderItems.push({
                            itemId: itemDto.itemId,
                            mennyiseg: itemDto.mennyiseg,
                            egysegAr: itemDto.egysegAr,
                            kedvezmeny: kedvezmeny,
                            osszeg: itemOsszeg,
                        });
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        afa = osszeg * 0.27;
                        vegosszeg = osszeg + afa;
                        updateData.osszeg = osszeg;
                        updateData.afa = afa;
                        updateData.vegosszeg = vegosszeg;
                        // Delete old items and create new ones
                        return [4 /*yield*/, this.prisma.orderItem.deleteMany({
                                where: { orderId: id },
                            })];
                    case 6:
                        // Delete old items and create new ones
                        _b.sent();
                        updateData.items = {
                            create: orderItems,
                        };
                        _b.label = 7;
                    case 7:
                        if (data.szallitasiDatum) {
                            updateData.szallitasiDatum = new Date(data.szallitasiDatum);
                        }
                        if (data.teljesitesiDatum) {
                            updateData.teljesitesiDatum = new Date(data.teljesitesiDatum);
                        }
                        return [4 /*yield*/, this.prisma.order.update({
                                where: { id: id },
                                data: updateData,
                                include: {
                                    account: true,
                                    quote: true,
                                    items: {
                                        include: {
                                            item: true,
                                        },
                                    },
                                },
                            })];
                    case 8: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    OrderService.prototype.changeStatus = function (id, newStatus, megjegyzesek, warehouseId) {
        return __awaiter(this, void 0, void 0, function () {
            var order, validTransitions, allowedStatuses, _i, _a, orderItem, stockLevel, availableStock, updateData;
            var _b;
            var _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        order = _e.sent();
                        validTransitions = (_b = {},
                            _b[order_status_enum_1.OrderStatus.NEW] = [order_status_enum_1.OrderStatus.IN_PROCESS, order_status_enum_1.OrderStatus.CANCELLED],
                            _b[order_status_enum_1.OrderStatus.IN_PROCESS] = [order_status_enum_1.OrderStatus.SHIPPED, order_status_enum_1.OrderStatus.CANCELLED],
                            _b[order_status_enum_1.OrderStatus.SHIPPED] = [order_status_enum_1.OrderStatus.COMPLETED],
                            _b[order_status_enum_1.OrderStatus.COMPLETED] = [],
                            _b[order_status_enum_1.OrderStatus.CANCELLED] = [],
                            _b);
                        allowedStatuses = validTransitions[order.allapot];
                        if (!allowedStatuses || !allowedStatuses.includes(newStatus)) {
                            throw new common_1.BadRequestException("Cannot change status from ".concat(order.allapot, " to ").concat(newStatus, ". Valid transitions: ").concat(allowedStatuses.join(', ')));
                        }
                        if (!(newStatus === order_status_enum_1.OrderStatus.SHIPPED && warehouseId)) return [3 /*break*/, 8];
                        _i = 0, _a = order.items;
                        _e.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 8];
                        orderItem = _a[_i];
                        return [4 /*yield*/, this.prisma.stockLevel.findFirst({
                                where: {
                                    itemId: orderItem.itemId,
                                    warehouseId: warehouseId,
                                    locationId: null,
                                },
                            })];
                    case 3:
                        stockLevel = _e.sent();
                        if (!stockLevel) return [3 /*break*/, 6];
                        availableStock = (stockLevel.mennyiseg || 0) - (stockLevel.foglaltMennyiseg || 0);
                        if (availableStock < orderItem.mennyiseg) {
                            throw new common_1.BadRequestException("Nincs el\u00E9g k\u00E9szlet a term\u00E9khez: ".concat(((_c = orderItem.item) === null || _c === void 0 ? void 0 : _c.nev) || orderItem.itemId, ". El\u00E9rhet\u0151: ").concat(availableStock, ", K\u00E9rt: ").concat(orderItem.mennyiseg));
                        }
                        // Update stock level - reduce quantity
                        return [4 /*yield*/, this.prisma.stockLevel.update({
                                where: { id: stockLevel.id },
                                data: {
                                    mennyiseg: {
                                        decrement: orderItem.mennyiseg,
                                    },
                                },
                            })];
                    case 4:
                        // Update stock level - reduce quantity
                        _e.sent();
                        // Create stock move for audit trail
                        return [4 /*yield*/, this.prisma.stockMove.create({
                                data: {
                                    itemId: orderItem.itemId,
                                    warehouseId: warehouseId,
                                    tipus: 'ELADAS',
                                    mennyiseg: -orderItem.mennyiseg,
                                    referenciaId: order.id,
                                    megjegyzesek: "Elad\u00E1si rendel\u00E9s: ".concat(order.azonosito),
                                },
                            })];
                    case 5:
                        // Create stock move for audit trail
                        _e.sent();
                        return [3 /*break*/, 7];
                    case 6: throw new common_1.BadRequestException("Nincs k\u00E9szlet a term\u00E9khez: ".concat(((_d = orderItem.item) === null || _d === void 0 ? void 0 : _d.nev) || orderItem.itemId));
                    case 7:
                        _i++;
                        return [3 /*break*/, 2];
                    case 8:
                        updateData = {
                            allapot: newStatus,
                        };
                        if (megjegyzesek) {
                            updateData.megjegyzesek = order.megjegyzesek
                                ? "".concat(order.megjegyzesek, "\n\n[").concat(newStatus, "] ").concat(megjegyzesek)
                                : "[".concat(newStatus, "] ").concat(megjegyzesek);
                        }
                        // Set completion date if status is COMPLETED
                        if (newStatus === order_status_enum_1.OrderStatus.COMPLETED) {
                            updateData.teljesitesiDatum = new Date();
                        }
                        return [4 /*yield*/, this.prisma.order.update({
                                where: { id: id },
                                data: updateData,
                                include: {
                                    account: true,
                                    quote: true,
                                    items: {
                                        include: {
                                            item: true,
                                        },
                                    },
                                },
                            })];
                    case 9: return [2 /*return*/, _e.sent()];
                }
            });
        });
    };
    OrderService.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var order;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        order = _a.sent();
                        // Only allow deletion of NEW or CANCELLED orders
                        if (order.allapot !== order_status_enum_1.OrderStatus.NEW && order.allapot !== order_status_enum_1.OrderStatus.CANCELLED) {
                            throw new common_1.BadRequestException('Only NEW or CANCELLED orders can be deleted.');
                        }
                        return [4 /*yield*/, this.prisma.order.delete({
                                where: { id: id },
                            })];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OrderService.prototype.generateOrderNumber = function () {
        return __awaiter(this, void 0, void 0, function () {
            var prefix, prefixValue, lastOrder, nextNumber, lastNumber;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.settingsService.get('order.number.prefix')];
                    case 1:
                        prefix = _a.sent();
                        prefixValue = prefix || 'REND';
                        return [4 /*yield*/, this.prisma.order.findFirst({
                                where: {
                                    azonosito: {
                                        startsWith: prefixValue,
                                    },
                                },
                                orderBy: {
                                    azonosito: 'desc',
                                },
                            })];
                    case 2:
                        lastOrder = _a.sent();
                        nextNumber = 1;
                        if (lastOrder) {
                            lastNumber = parseInt(lastOrder.azonosito.replace(prefixValue, '')) || 0;
                            nextNumber = lastNumber + 1;
                        }
                        return [2 /*return*/, "".concat(prefixValue, "-").concat(nextNumber.toString().padStart(6, '0'))];
                }
            });
        });
    };
    OrderService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService,
            settings_service_1.SystemSettingsService])
    ], OrderService);
    return OrderService;
}());
exports.OrderService = OrderService;
