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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseOrderService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var settings_service_1 = require("../system/settings.service");
var PurchaseOrderService = /** @class */ (function () {
    function PurchaseOrderService(prisma, settingsService) {
        this.prisma = prisma;
        this.settingsService = settingsService;
    }
    PurchaseOrderService.prototype.generateAzonosito = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pattern, defaultPattern, template, now, year, count, nextNumber;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.settingsService.get('numbering.purchase_order.pattern')];
                    case 1:
                        pattern = _a.sent();
                        defaultPattern = 'PO-{YYYY}-{####}';
                        template = pattern || defaultPattern;
                        now = new Date();
                        year = now.getFullYear().toString();
                        return [4 /*yield*/, this.prisma.purchaseOrder.count({
                                where: {
                                    createdAt: {
                                        gte: new Date("".concat(year, "-01-01")),
                                        lt: new Date("".concat(parseInt(year) + 1, "-01-01")),
                                    },
                                },
                            })];
                    case 2:
                        count = _a.sent();
                        nextNumber = (count + 1).toString().padStart(4, '0');
                        return [2 /*return*/, template
                                .replace('{YYYY}', year)
                                .replace('{####}', nextNumber)];
                }
            });
        });
    };
    PurchaseOrderService.prototype.findAll = function () {
        return __awaiter(this, arguments, void 0, function (skip, take, filters) {
            var where, _a, total, data, page, pageSize;
            if (skip === void 0) { skip = 0; }
            if (take === void 0) { take = 50; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        where = {};
                        if (filters === null || filters === void 0 ? void 0 : filters.allapot) {
                            where.allapot = filters.allapot;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.supplierId) {
                            where.supplierId = filters.supplierId;
                        }
                        return [4 /*yield*/, Promise.all([
                                this.prisma.purchaseOrder.count({ where: where }),
                                this.prisma.purchaseOrder.findMany({
                                    where: where,
                                    skip: skip,
                                    take: take,
                                    include: {
                                        supplier: true,
                                        items: {
                                            include: {
                                                item: true,
                                            },
                                        },
                                    },
                                    orderBy: { createdAt: 'desc' },
                                }),
                            ])];
                    case 1:
                        _a = _b.sent(), total = _a[0], data = _a[1];
                        page = Math.floor(skip / take) + 1;
                        pageSize = take;
                        return [2 /*return*/, { data: data, total: total, page: page, pageSize: pageSize }];
                }
            });
        });
    };
    PurchaseOrderService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.purchaseOrder.findUnique({
                        where: { id: id },
                        include: {
                            supplier: true,
                            items: {
                                include: {
                                    item: true,
                                },
                            },
                            deliveryNotes: true,
                        },
                    })];
            });
        });
    };
    PurchaseOrderService.prototype.create = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var azonosito, items, orderData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.generateAzonosito()];
                    case 1:
                        azonosito = _a.sent();
                        items = dto.items, orderData = __rest(dto, ["items"]);
                        return [2 /*return*/, this.prisma.purchaseOrder.create({
                                data: __assign(__assign({}, orderData), { azonosito: azonosito, rendelesiDatum: dto.rendelesiDatum || new Date(), items: {
                                        create: items.map(function (item) { return ({
                                            itemId: item.itemId,
                                            mennyiseg: item.mennyiseg,
                                            egysegAr: item.egysegAr,
                                            osszeg: item.osszeg,
                                        }); }),
                                    } }),
                                include: {
                                    supplier: true,
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
    PurchaseOrderService.prototype.update = function (id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.purchaseOrder.update({
                        where: { id: id },
                        data: dto,
                        include: {
                            supplier: true,
                            items: {
                                include: {
                                    item: true,
                                },
                            },
                        },
                    })];
            });
        });
    };
    PurchaseOrderService.prototype.transitionStatus = function (id, allapot) {
        return __awaiter(this, void 0, void 0, function () {
            var po, allowed, current, nextList;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        po = _d.sent();
                        if (!po)
                            throw new common_1.BadRequestException('Beszerzési rendelés nem található');
                        allowed = {
                            draft: ['approved', 'ordered'],
                            DRAFT: ['approved', 'APPROVED', 'ordered', 'ORDERED'],
                            approved: ['ordered'],
                            APPROVED: ['ordered', 'ORDERED'],
                            ordered: ['partial', 'received'],
                            ORDERED: ['partial', 'PARTIAL', 'received', 'RECEIVED'],
                            partial: ['received', 'closed'],
                            PARTIAL: ['received', 'RECEIVED', 'closed', 'CLOSED'],
                            received: ['closed'],
                            RECEIVED: ['closed', 'CLOSED'],
                            BEEERKEZETT: ['closed', 'CLOSED', 'LEZARVA'],
                        };
                        current = (_c = (_b = (_a = po.allapot) === null || _a === void 0 ? void 0 : _a.toLowerCase) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : po.allapot;
                        nextList = allowed[po.allapot] ||
                            allowed[current] ||
                            [];
                        if (nextList.length > 0 &&
                            !nextList.includes(allapot) &&
                            !nextList.includes(allapot.toUpperCase())) {
                            throw new common_1.BadRequestException("\u00C1llapotv\u00E1lt\u00E1s nem enged\u00E9lyezett: ".concat(po.allapot, " \u2192 ").concat(allapot));
                        }
                        return [2 /*return*/, this.prisma.purchaseOrder.update({
                                where: { id: id },
                                data: { allapot: allapot },
                                include: {
                                    supplier: true,
                                    items: { include: { item: true } },
                                },
                            })];
                }
            });
        });
    };
    PurchaseOrderService.prototype.receive = function (id, warehouseId, receivedItems) {
        return __awaiter(this, void 0, void 0, function () {
            var purchaseOrder, closed, _loop_1, this_1, _i, receivedItems_1, receivedItem, totalOrdered, totalReceived, newStatus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        purchaseOrder = _a.sent();
                        if (!purchaseOrder) {
                            throw new Error('Beszerzési rendelés nem található');
                        }
                        closed = ['received', 'RECEIVED', 'BEEERKEZETT', 'closed', 'CLOSED', 'LEZARVA'];
                        if (closed.includes(purchaseOrder.allapot)) {
                            throw new common_1.BadRequestException('A beszerzési rendelés már lezárva vagy teljesen beérkezett');
                        }
                        _loop_1 = function (receivedItem) {
                            var orderItem, stockLevel;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        orderItem = purchaseOrder.items.find(function (item) { return item.itemId === receivedItem.itemId; });
                                        if (!orderItem) {
                                            throw new common_1.BadRequestException("Term\u00E9k nem tal\u00E1lhat\u00F3 a rendel\u00E9sben: ".concat(receivedItem.itemId));
                                        }
                                        return [4 /*yield*/, this_1.prisma.stockLevel.findFirst({
                                                where: {
                                                    itemId: receivedItem.itemId,
                                                    warehouseId: warehouseId,
                                                    locationId: null,
                                                },
                                            })];
                                    case 1:
                                        stockLevel = _b.sent();
                                        if (!stockLevel) return [3 /*break*/, 3];
                                        // Update existing stock level
                                        return [4 /*yield*/, this_1.prisma.stockLevel.update({
                                                where: { id: stockLevel.id },
                                                data: {
                                                    mennyiseg: {
                                                        increment: receivedItem.mennyiseg,
                                                    },
                                                },
                                            })];
                                    case 2:
                                        // Update existing stock level
                                        _b.sent();
                                        return [3 /*break*/, 5];
                                    case 3: 
                                    // Create new stock level
                                    return [4 /*yield*/, this_1.prisma.stockLevel.create({
                                            data: {
                                                itemId: receivedItem.itemId,
                                                warehouseId: warehouseId,
                                                mennyiseg: receivedItem.mennyiseg,
                                            },
                                        })];
                                    case 4:
                                        // Create new stock level
                                        _b.sent();
                                        _b.label = 5;
                                    case 5:
                                        if (!(receivedItem.sarzsGyartasiSzam || receivedItem.beszerzesiAr)) return [3 /*break*/, 7];
                                        return [4 /*yield*/, this_1.prisma.stockLot.create({
                                                data: {
                                                    itemId: receivedItem.itemId,
                                                    warehouseId: warehouseId,
                                                    sarzsGyartasiSzam: receivedItem.sarzsGyartasiSzam || null,
                                                    mennyiseg: receivedItem.mennyiseg,
                                                    beszerzesiAr: receivedItem.beszerzesiAr || orderItem.egysegAr,
                                                },
                                            })];
                                    case 6:
                                        _b.sent();
                                        _b.label = 7;
                                    case 7: 
                                    // Create stock move for audit trail
                                    return [4 /*yield*/, this_1.prisma.stockMove.create({
                                            data: {
                                                itemId: receivedItem.itemId,
                                                warehouseId: warehouseId,
                                                tipus: 'BESZERZES',
                                                mennyiseg: receivedItem.mennyiseg,
                                                sarzsGyartasiSzam: receivedItem.sarzsGyartasiSzam || null,
                                                referenciaId: purchaseOrder.id,
                                                megjegyzesek: "Beszerz\u00E9si rendel\u00E9s: ".concat(purchaseOrder.azonosito),
                                            },
                                        })];
                                    case 8:
                                        // Create stock move for audit trail
                                        _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, receivedItems_1 = receivedItems;
                        _a.label = 2;
                    case 2:
                        if (!(_i < receivedItems_1.length)) return [3 /*break*/, 5];
                        receivedItem = receivedItems_1[_i];
                        return [5 /*yield**/, _loop_1(receivedItem)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        totalOrdered = purchaseOrder.items.reduce(function (s, i) { return s + i.mennyiseg; }, 0);
                        totalReceived = receivedItems.reduce(function (s, i) { return s + i.mennyiseg; }, 0);
                        newStatus = totalReceived >= totalOrdered ? 'received' : 'partial';
                        return [2 /*return*/, this.prisma.purchaseOrder.update({
                                where: { id: id },
                                data: {
                                    allapot: newStatus,
                                },
                                include: {
                                    supplier: true,
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
    PurchaseOrderService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService,
            settings_service_1.SystemSettingsService])
    ], PurchaseOrderService);
    return PurchaseOrderService;
}());
exports.PurchaseOrderService = PurchaseOrderService;
