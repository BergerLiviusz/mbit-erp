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
exports.SupplierService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var SupplierService = /** @class */ (function () {
    function SupplierService(prisma) {
        this.prisma = prisma;
    }
    SupplierService.prototype.findAll = function () {
        return __awaiter(this, arguments, void 0, function (skip, take, search) {
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
                                { adoszam: { contains: search } },
                                { email: { contains: search } },
                            ];
                        }
                        return [4 /*yield*/, Promise.all([
                                this.prisma.supplier.count({ where: where }),
                                this.prisma.supplier.findMany({
                                    where: where,
                                    skip: skip,
                                    take: take,
                                    include: {
                                        _count: {
                                            select: {
                                                itemSuppliers: true,
                                                purchaseOrders: true,
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
    SupplierService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var supplier;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.supplier.findUnique({
                            where: { id: id },
                            include: {
                                itemSuppliers: {
                                    include: {
                                        item: {
                                            select: {
                                                id: true,
                                                azonosito: true,
                                                nev: true,
                                            },
                                        },
                                    },
                                },
                                purchaseOrders: {
                                    select: {
                                        id: true,
                                        azonosito: true,
                                        allapot: true,
                                        createdAt: true,
                                    },
                                },
                            },
                        })];
                    case 1:
                        supplier = _a.sent();
                        if (!supplier) {
                            throw new common_1.NotFoundException('Szállító nem található');
                        }
                        return [2 /*return*/, supplier];
                }
            });
        });
    };
    SupplierService.prototype.create = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.supplier.create({
                        data: {
                            nev: dto.nev,
                            adoszam: dto.adoszam || null,
                            cim: dto.cim || null,
                            email: dto.email || null,
                            telefon: dto.telefon || null,
                            aktiv: dto.aktiv !== undefined ? dto.aktiv : true,
                        },
                    })];
            });
        });
    };
    SupplierService.prototype.update = function (id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var supplier;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        supplier = _a.sent();
                        return [2 /*return*/, this.prisma.supplier.update({
                                where: { id: id },
                                data: {
                                    nev: dto.nev !== undefined ? dto.nev : supplier.nev,
                                    adoszam: dto.adoszam !== undefined ? dto.adoszam : supplier.adoszam,
                                    cim: dto.cim !== undefined ? dto.cim : supplier.cim,
                                    email: dto.email !== undefined ? dto.email : supplier.email,
                                    telefon: dto.telefon !== undefined ? dto.telefon : supplier.telefon,
                                    aktiv: dto.aktiv !== undefined ? dto.aktiv : supplier.aktiv,
                                },
                            })];
                }
            });
        });
    };
    SupplierService.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var supplier;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        supplier = _a.sent();
                        // Soft delete: set aktiv to false
                        return [2 /*return*/, this.prisma.supplier.update({
                                where: { id: id },
                                data: {
                                    aktiv: false,
                                },
                            })];
                }
            });
        });
    };
    SupplierService.prototype.linkItemToSupplier = function (itemId, supplierId, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var item, supplier, existingLink;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.item.findUnique({
                            where: { id: itemId },
                        })];
                    case 1:
                        item = _a.sent();
                        if (!item) {
                            throw new common_1.NotFoundException('Áru nem található');
                        }
                        return [4 /*yield*/, this.prisma.supplier.findUnique({
                                where: { id: supplierId },
                            })];
                    case 2:
                        supplier = _a.sent();
                        if (!supplier) {
                            throw new common_1.NotFoundException('Szállító nem található');
                        }
                        return [4 /*yield*/, this.prisma.itemSupplier.findUnique({
                                where: {
                                    itemId_supplierId: {
                                        itemId: itemId,
                                        supplierId: supplierId,
                                    },
                                },
                            })];
                    case 3:
                        existingLink = _a.sent();
                        if (existingLink) {
                            throw new common_1.BadRequestException('Az áru már kapcsolva van ehhez a szállítóhoz');
                        }
                        if (!dto.isPrimary) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.prisma.itemSupplier.updateMany({
                                where: {
                                    itemId: itemId,
                                    isPrimary: true,
                                },
                                data: {
                                    isPrimary: false,
                                },
                            })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, this.prisma.itemSupplier.create({
                            data: {
                                itemId: itemId,
                                supplierId: supplierId,
                                isPrimary: dto.isPrimary || false,
                                beszerzesiAr: dto.beszerzesiAr || null,
                                minMennyiseg: dto.minMennyiseg || null,
                                szallitasiIdo: dto.szallitasiIdo || null,
                                megjegyzesek: dto.megjegyzesek || null,
                            },
                            include: {
                                item: {
                                    select: {
                                        id: true,
                                        azonosito: true,
                                        nev: true,
                                    },
                                },
                                supplier: {
                                    select: {
                                        id: true,
                                        nev: true,
                                    },
                                },
                            },
                        })];
                }
            });
        });
    };
    SupplierService.prototype.unlinkItemFromSupplier = function (itemId, supplierId) {
        return __awaiter(this, void 0, void 0, function () {
            var link;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.itemSupplier.findUnique({
                            where: {
                                itemId_supplierId: {
                                    itemId: itemId,
                                    supplierId: supplierId,
                                },
                            },
                        })];
                    case 1:
                        link = _a.sent();
                        if (!link) {
                            throw new common_1.NotFoundException('Kapcsolat nem található');
                        }
                        return [4 /*yield*/, this.prisma.itemSupplier.delete({
                                where: {
                                    itemId_supplierId: {
                                        itemId: itemId,
                                        supplierId: supplierId,
                                    },
                                },
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { success: true }];
                }
            });
        });
    };
    SupplierService.prototype.getItemSuppliers = function (itemId) {
        return __awaiter(this, void 0, void 0, function () {
            var item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.item.findUnique({
                            where: { id: itemId },
                        })];
                    case 1:
                        item = _a.sent();
                        if (!item) {
                            throw new common_1.NotFoundException('Áru nem található');
                        }
                        return [2 /*return*/, this.prisma.itemSupplier.findMany({
                                where: { itemId: itemId },
                                include: {
                                    supplier: true,
                                },
                                orderBy: [
                                    { isPrimary: 'desc' },
                                    { createdAt: 'asc' },
                                ],
                            })];
                }
            });
        });
    };
    SupplierService.prototype.getSupplierItems = function (supplierId) {
        return __awaiter(this, void 0, void 0, function () {
            var supplier;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.supplier.findUnique({
                            where: { id: supplierId },
                        })];
                    case 1:
                        supplier = _a.sent();
                        if (!supplier) {
                            throw new common_1.NotFoundException('Szállító nem található');
                        }
                        return [2 /*return*/, this.prisma.itemSupplier.findMany({
                                where: { supplierId: supplierId },
                                include: {
                                    item: {
                                        select: {
                                            id: true,
                                            azonosito: true,
                                            nev: true,
                                            egyseg: true,
                                        },
                                    },
                                },
                                orderBy: [
                                    { isPrimary: 'desc' },
                                    { createdAt: 'asc' },
                                ],
                            })];
                }
            });
        });
    };
    SupplierService.prototype.setPrimarySupplier = function (itemId, supplierId) {
        return __awaiter(this, void 0, void 0, function () {
            var link;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.itemSupplier.findUnique({
                            where: {
                                itemId_supplierId: {
                                    itemId: itemId,
                                    supplierId: supplierId,
                                },
                            },
                        })];
                    case 1:
                        link = _a.sent();
                        if (!link) {
                            throw new common_1.NotFoundException('Kapcsolat nem található');
                        }
                        // Unset all other primary suppliers for this item
                        return [4 /*yield*/, this.prisma.itemSupplier.updateMany({
                                where: {
                                    itemId: itemId,
                                    isPrimary: true,
                                },
                                data: {
                                    isPrimary: false,
                                },
                            })];
                    case 2:
                        // Unset all other primary suppliers for this item
                        _a.sent();
                        // Set this one as primary
                        return [2 /*return*/, this.prisma.itemSupplier.update({
                                where: {
                                    itemId_supplierId: {
                                        itemId: itemId,
                                        supplierId: supplierId,
                                    },
                                },
                                data: {
                                    isPrimary: true,
                                },
                                include: {
                                    item: {
                                        select: {
                                            id: true,
                                            azonosito: true,
                                            nev: true,
                                        },
                                    },
                                    supplier: {
                                        select: {
                                            id: true,
                                            nev: true,
                                        },
                                    },
                                },
                            })];
                }
            });
        });
    };
    SupplierService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], SupplierService);
    return SupplierService;
}());
exports.SupplierService = SupplierService;
