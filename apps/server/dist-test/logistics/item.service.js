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
exports.ItemService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var ItemService = /** @class */ (function () {
    function ItemService(prisma) {
        this.prisma = prisma;
    }
    ItemService.prototype.findAll = function () {
        return __awaiter(this, arguments, void 0, function (skip, take, search, categoryId) {
            var where, _a, total, items;
            if (skip === void 0) { skip = 0; }
            if (take === void 0) { take = 50; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        where = {};
                        if (search) {
                            where.OR = [
                                { nev: { contains: search } },
                                { azonosito: { contains: search } },
                            ];
                        }
                        if (categoryId) {
                            where.categoryId = categoryId;
                        }
                        return [4 /*yield*/, Promise.all([
                                this.prisma.item.count({ where: where }),
                                this.prisma.item.findMany({
                                    where: where,
                                    skip: skip,
                                    take: take,
                                    include: {
                                        itemGroup: true,
                                        category: true,
                                        stockLevels: {
                                            include: {
                                                warehouse: true,
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
    ItemService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.item.findUnique({
                        where: { id: id },
                        include: {
                            itemGroup: true,
                            category: true,
                            stockLots: {
                                include: {
                                    warehouse: true,
                                },
                            },
                            priceLists: {
                                include: {
                                    priceList: {
                                        include: {
                                            supplier: true,
                                        },
                                    },
                                },
                            },
                            itemSuppliers: {
                                include: {
                                    supplier: true,
                                },
                                orderBy: [
                                    { isPrimary: 'desc' },
                                    { createdAt: 'asc' },
                                ],
                            },
                        },
                    })];
            });
        });
    };
    ItemService.prototype.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var warrantyDays, existingItem, error_1;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // Validate required fields
                        if (!data.nev || !data.azonosito) {
                            throw new Error('Termék név és azonosító megadása kötelező');
                        }
                        // Validate numeric fields
                        if (data.beszerzesiAr !== undefined && (isNaN(parseFloat(data.beszerzesiAr)) || parseFloat(data.beszerzesiAr) < 0)) {
                            throw new Error('Érvénytelen beszerzési ár');
                        }
                        if (data.eladasiAr !== undefined && (isNaN(parseFloat(data.eladasiAr)) || parseFloat(data.eladasiAr) < 0)) {
                            throw new Error('Érvénytelen eladási ár');
                        }
                        if (data.afaKulcs !== undefined && (isNaN(parseFloat(data.afaKulcs)) || parseFloat(data.afaKulcs) < 0 || parseFloat(data.afaKulcs) > 100)) {
                            throw new Error('Érvénytelen ÁFA kulcs (0-100% között kell lennie)');
                        }
                        // Validate szavatossagiIdoNap if provided
                        if (data.szavatossagiIdoNap !== undefined && data.szavatossagiIdoNap !== null) {
                            warrantyDays = parseInt(data.szavatossagiIdoNap);
                            if (isNaN(warrantyDays) || warrantyDays < 0) {
                                throw new Error('Érvénytelen szavatossági idő (pozitív szám kell legyen)');
                            }
                            data.szavatossagiIdoNap = warrantyDays;
                        }
                        return [4 /*yield*/, this.prisma.item.findUnique({
                                where: { azonosito: data.azonosito },
                            })];
                    case 1:
                        existingItem = _c.sent();
                        if (existingItem) {
                            throw new Error("M\u00E1r l\u00E9tezik term\u00E9k ezzel az azonos\u00EDt\u00F3val: ".concat(data.azonosito));
                        }
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.prisma.item.create({
                                data: data,
                                include: { itemGroup: true },
                            })];
                    case 3: return [2 /*return*/, _c.sent()];
                    case 4:
                        error_1 = _c.sent();
                        // Check for database schema errors
                        if (((_a = error_1.message) === null || _a === void 0 ? void 0 : _a.includes('no such column')) || ((_b = error_1.message) === null || _b === void 0 ? void 0 : _b.includes('does not exist'))) {
                            throw new Error('Adatbázis séma hiba: hiányzó oszlop. Kérem futtassa a migrációkat.');
                        }
                        throw error_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ItemService.prototype.update = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.item.update({
                        where: { id: id },
                        data: data,
                        include: { itemGroup: true },
                    })];
            });
        });
    };
    ItemService.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.item.update({
                        where: { id: id },
                        data: { aktiv: false },
                        include: { itemGroup: true },
                    })];
            });
        });
    };
    ItemService.prototype.findAllItemGroups = function () {
        return __awaiter(this, arguments, void 0, function (skip, take) {
            var _a, total, data;
            if (skip === void 0) { skip = 0; }
            if (take === void 0) { take = 100; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            this.prisma.itemGroup.count(),
                            this.prisma.itemGroup.findMany({
                                skip: skip,
                                take: take,
                                orderBy: { nev: 'asc' },
                                include: {
                                    _count: {
                                        select: { items: true },
                                    },
                                },
                            }),
                        ])];
                    case 1:
                        _a = _b.sent(), total = _a[0], data = _a[1];
                        return [2 /*return*/, { total: total, data: data }];
                }
            });
        });
    };
    ItemService.prototype.findOneItemGroup = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.itemGroup.findUnique({
                        where: { id: id },
                        include: {
                            _count: {
                                select: { items: true },
                            },
                        },
                    })];
            });
        });
    };
    ItemService.prototype.createItemGroup = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var existing;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.itemGroup.findUnique({
                            where: { nev: data.nev },
                        })];
                    case 1:
                        existing = _a.sent();
                        if (existing) {
                            throw new Error("M\u00E1r l\u00E9tezik cikkcsoport ezzel a n\u00E9vvel: ".concat(data.nev));
                        }
                        return [2 /*return*/, this.prisma.itemGroup.create({
                                data: data,
                            })];
                }
            });
        });
    };
    ItemService.prototype.updateItemGroup = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var existing;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!data.nev) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.prisma.itemGroup.findUnique({
                                where: { nev: data.nev },
                            })];
                    case 1:
                        existing = _a.sent();
                        if (existing && existing.id !== id) {
                            throw new Error("M\u00E1r l\u00E9tezik cikkcsoport ezzel a n\u00E9vvel: ".concat(data.nev));
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.prisma.itemGroup.update({
                            where: { id: id },
                            data: data,
                        })];
                }
            });
        });
    };
    ItemService.prototype.deleteItemGroup = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var itemCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.item.count({
                            where: { itemGroupId: id },
                        })];
                    case 1:
                        itemCount = _a.sent();
                        if (itemCount > 0) {
                            throw new Error("Nem lehet t\u00F6r\u00F6lni a cikkcsoportot, mert ".concat(itemCount, " term\u00E9k tartozik hozz\u00E1"));
                        }
                        return [2 /*return*/, this.prisma.itemGroup.delete({
                                where: { id: id },
                            })];
                }
            });
        });
    };
    ItemService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], ItemService);
    return ItemService;
}());
exports.ItemService = ItemService;
