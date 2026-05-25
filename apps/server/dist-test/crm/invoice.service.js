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
exports.InvoiceService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var InvoiceService = /** @class */ (function () {
    function InvoiceService(prisma) {
        this.prisma = prisma;
    }
    InvoiceService.prototype.generateInvoiceNumber = function () {
        return __awaiter(this, void 0, void 0, function () {
            var year, prefix, lastInvoice, nextNumber, lastNumber;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        year = new Date().getFullYear();
                        prefix = "SZ-".concat(year, "-");
                        return [4 /*yield*/, this.prisma.invoice.findFirst({
                                where: {
                                    szamlaSzam: {
                                        startsWith: prefix,
                                    },
                                },
                                orderBy: {
                                    szamlaSzam: 'desc',
                                },
                            })];
                    case 1:
                        lastInvoice = _a.sent();
                        nextNumber = 1;
                        if (lastInvoice) {
                            lastNumber = parseInt(lastInvoice.szamlaSzam.replace(prefix, ''));
                            nextNumber = lastNumber + 1;
                        }
                        return [2 /*return*/, "".concat(prefix).concat(String(nextNumber).padStart(6, '0'))];
                }
            });
        });
    };
    InvoiceService.prototype.findAll = function () {
        return __awaiter(this, arguments, void 0, function (skip, take, filters) {
            var where, _a, total, items;
            if (skip === void 0) { skip = 0; }
            if (take === void 0) { take = 50; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        where = {};
                        if (filters === null || filters === void 0 ? void 0 : filters.accountId) {
                            where.accountId = filters.accountId;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.orderId) {
                            where.orderId = filters.orderId;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.allapot) {
                            where.allapot = filters.allapot;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.tipus) {
                            where.tipus = filters.tipus;
                        }
                        if ((filters === null || filters === void 0 ? void 0 : filters.kiallitasDatumFrom) || (filters === null || filters === void 0 ? void 0 : filters.kiallitasDatumTo)) {
                            where.kiallitasDatum = {};
                            if (filters.kiallitasDatumFrom) {
                                where.kiallitasDatum.gte = new Date(filters.kiallitasDatumFrom);
                            }
                            if (filters.kiallitasDatumTo) {
                                where.kiallitasDatum.lte = new Date(filters.kiallitasDatumTo);
                            }
                        }
                        return [4 /*yield*/, Promise.all([
                                this.prisma.invoice.count({ where: where }),
                                this.prisma.invoice.findMany({
                                    where: where,
                                    skip: skip,
                                    take: take,
                                    include: {
                                        account: {
                                            select: {
                                                id: true,
                                                nev: true,
                                                azonosito: true,
                                            },
                                        },
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
                                                supplier: {
                                                    select: {
                                                        id: true,
                                                        nev: true,
                                                    },
                                                },
                                            },
                                        },
                                        deliveryNote: {
                                            select: {
                                                id: true,
                                                azonosito: true,
                                            },
                                        },
                                        items: true,
                                        _count: {
                                            select: {
                                                items: true,
                                                payments: true,
                                            },
                                        },
                                    },
                                    orderBy: {
                                        kiallitasDatum: 'desc',
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
    InvoiceService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var invoice;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.invoice.findUnique({
                            where: { id: id },
                            include: {
                                account: true,
                                order: {
                                    include: {
                                        account: true,
                                        items: {
                                            include: {
                                                item: true,
                                            },
                                        },
                                        shipments: {
                                            include: {
                                                deliveryNotes: true,
                                            },
                                        },
                                    },
                                },
                                purchaseOrder: {
                                    include: {
                                        supplier: true,
                                        items: {
                                            include: {
                                                item: true,
                                            },
                                        },
                                        deliveryNotes: true,
                                    },
                                },
                                deliveryNote: {
                                    include: {
                                        purchaseOrder: {
                                            include: {
                                                supplier: true,
                                            },
                                        },
                                        shipment: {
                                            include: {
                                                order: true,
                                            },
                                        },
                                    },
                                },
                                items: {
                                    include: {
                                        item: true,
                                    },
                                    orderBy: {
                                        sorrend: 'asc',
                                    },
                                },
                                payments: {
                                    orderBy: {
                                        fizetesiDatum: 'desc',
                                    },
                                },
                            },
                        })];
                    case 1:
                        invoice = _a.sent();
                        if (!invoice) {
                            throw new common_1.NotFoundException('Számla nem található');
                        }
                        return [2 /*return*/, invoice];
                }
            });
        });
    };
    InvoiceService.prototype.create = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var account, order, existingInvoice, purchaseOrder, existingInvoice, supplierAccount, deliveryNote, existingInvoice, supplierAccount, osszeg, afa, _i, _a, itemDto, nettoOsszeg, afaOsszeg, vegosszeg, szamlaSzam, invoice;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.prisma.account.findUnique({
                            where: { id: dto.accountId },
                        })];
                    case 1:
                        account = _e.sent();
                        if (!account) {
                            throw new common_1.NotFoundException('Ügyfél nem található');
                        }
                        if (!dto.orderId) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.prisma.order.findUnique({
                                where: { id: dto.orderId },
                            })];
                    case 2:
                        order = _e.sent();
                        if (!order) {
                            throw new common_1.NotFoundException('Rendelés nem található');
                        }
                        return [4 /*yield*/, this.prisma.invoice.findFirst({
                                where: { orderId: dto.orderId },
                            })];
                    case 3:
                        existingInvoice = _e.sent();
                        if (existingInvoice) {
                            throw new common_1.BadRequestException('A rendeléshez már létezik számla');
                        }
                        _e.label = 4;
                    case 4:
                        if (!dto.purchaseOrderId) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.prisma.purchaseOrder.findUnique({
                                where: { id: dto.purchaseOrderId },
                                include: {
                                    supplier: true,
                                },
                            })];
                    case 5:
                        purchaseOrder = _e.sent();
                        if (!purchaseOrder) {
                            throw new common_1.NotFoundException('Beszerzési rendelés nem található');
                        }
                        return [4 /*yield*/, this.prisma.invoice.findFirst({
                                where: { purchaseOrderId: dto.purchaseOrderId },
                            })];
                    case 6:
                        existingInvoice = _e.sent();
                        if (existingInvoice) {
                            throw new common_1.BadRequestException('A beszerzési rendeléshez már létezik számla');
                        }
                        if (!!dto.accountId) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.prisma.account.findFirst({
                                where: {
                                    OR: [
                                        { nev: { contains: purchaseOrder.supplier.nev } },
                                        { email: purchaseOrder.supplier.email || undefined },
                                    ],
                                },
                            })];
                    case 7:
                        supplierAccount = _e.sent();
                        if (!supplierAccount) {
                            throw new common_1.BadRequestException('A szállítóhoz nincs kapcsolódó ügyfél fiók. Kérjük, hozza létre az ügyfél fiókot.');
                        }
                        dto.accountId = supplierAccount.id;
                        _e.label = 8;
                    case 8:
                        if (!dto.deliveryNoteId) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.prisma.deliveryNote.findUnique({
                                where: { id: dto.deliveryNoteId },
                                include: {
                                    purchaseOrder: {
                                        include: {
                                            supplier: true,
                                        },
                                    },
                                    shipment: {
                                        include: {
                                            order: {
                                                include: {
                                                    account: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            })];
                    case 9:
                        deliveryNote = _e.sent();
                        if (!deliveryNote) {
                            throw new common_1.NotFoundException('Szállítólevél nem található');
                        }
                        return [4 /*yield*/, this.prisma.invoice.findFirst({
                                where: { deliveryNoteId: dto.deliveryNoteId },
                            })];
                    case 10:
                        existingInvoice = _e.sent();
                        if (existingInvoice) {
                            throw new common_1.BadRequestException('A szállítólevélhez már létezik számla');
                        }
                        // Auto-fill purchaseOrderId if delivery note has one
                        if (deliveryNote.purchaseOrderId && !dto.purchaseOrderId) {
                            dto.purchaseOrderId = deliveryNote.purchaseOrderId;
                        }
                        if (!!dto.accountId) return [3 /*break*/, 13];
                        if (!((_b = deliveryNote.purchaseOrder) === null || _b === void 0 ? void 0 : _b.supplier)) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.prisma.account.findFirst({
                                where: {
                                    OR: [
                                        { nev: { contains: deliveryNote.purchaseOrder.supplier.nev } },
                                        { email: deliveryNote.purchaseOrder.supplier.email || undefined },
                                    ],
                                },
                            })];
                    case 11:
                        supplierAccount = _e.sent();
                        if (supplierAccount) {
                            dto.accountId = supplierAccount.id;
                        }
                        return [3 /*break*/, 13];
                    case 12:
                        if ((_d = (_c = deliveryNote.shipment) === null || _c === void 0 ? void 0 : _c.order) === null || _d === void 0 ? void 0 : _d.account) {
                            // Sales delivery note - use order's account
                            dto.accountId = deliveryNote.shipment.order.account.id;
                            if (!dto.orderId) {
                                dto.orderId = deliveryNote.shipment.order.id;
                            }
                        }
                        _e.label = 13;
                    case 13:
                        if (!dto.items || dto.items.length === 0) {
                            throw new common_1.BadRequestException('A számlának legalább egy tételre van szüksége');
                        }
                        osszeg = 0;
                        afa = 0;
                        for (_i = 0, _a = dto.items; _i < _a.length; _i++) {
                            itemDto = _a[_i];
                            nettoOsszeg = itemDto.mennyiseg * itemDto.egysegAr * (1 - (itemDto.kedvezmeny || 0) / 100);
                            afaOsszeg = nettoOsszeg * (itemDto.afaKulcs / 100);
                            osszeg += nettoOsszeg;
                            afa += afaOsszeg;
                        }
                        vegosszeg = osszeg + afa;
                        return [4 /*yield*/, this.generateInvoiceNumber()];
                    case 14:
                        szamlaSzam = _e.sent();
                        return [4 /*yield*/, this.prisma.invoice.create({
                                data: {
                                    accountId: dto.accountId,
                                    orderId: dto.orderId,
                                    purchaseOrderId: dto.purchaseOrderId,
                                    deliveryNoteId: dto.deliveryNoteId,
                                    szamlaSzam: szamlaSzam,
                                    kiallitasDatum: dto.kiallitasDatum ? new Date(dto.kiallitasDatum) : new Date(),
                                    teljesitesDatum: new Date(dto.teljesitesDatum),
                                    fizetesiHataridoDatum: new Date(dto.fizetesiHataridoDatum),
                                    osszeg: osszeg,
                                    afa: afa,
                                    vegosszeg: vegosszeg,
                                    tipus: dto.tipus,
                                    allapot: 'VAZLAT',
                                    fizetesiMod: dto.fizetesiMod,
                                    megjegyzesek: dto.megjegyzesek,
                                    items: {
                                        create: dto.items.map(function (itemDto, index) {
                                            var nettoOsszeg = itemDto.mennyiseg * itemDto.egysegAr * (1 - (itemDto.kedvezmeny || 0) / 100);
                                            var afaOsszeg = nettoOsszeg * (itemDto.afaKulcs / 100);
                                            var bruttoOsszeg = nettoOsszeg + afaOsszeg;
                                            return {
                                                itemId: itemDto.itemId,
                                                nev: itemDto.nev,
                                                azonosito: itemDto.azonosito,
                                                mennyiseg: itemDto.mennyiseg,
                                                egyseg: itemDto.egyseg,
                                                egysegAr: itemDto.egysegAr,
                                                kedvezmeny: itemDto.kedvezmeny || 0,
                                                afaKulcs: itemDto.afaKulcs,
                                                nettoOsszeg: nettoOsszeg,
                                                afaOsszeg: afaOsszeg,
                                                bruttoOsszeg: bruttoOsszeg,
                                                megjegyzes: itemDto.megjegyzes,
                                                sorrend: index,
                                            };
                                        }),
                                    },
                                },
                                include: {
                                    account: true,
                                    order: true,
                                    purchaseOrder: {
                                        include: {
                                            supplier: true,
                                        },
                                    },
                                    deliveryNote: true,
                                    items: true,
                                },
                            })];
                    case 15:
                        invoice = _e.sent();
                        return [2 /*return*/, invoice];
                }
            });
        });
    };
    InvoiceService.prototype.createFromOrder = function (orderId, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var order, existingInvoice, items, fizetesiHataridoDatum;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.prisma.order.findUnique({
                            where: { id: orderId },
                            include: {
                                account: true,
                                items: {
                                    include: {
                                        item: true,
                                    },
                                },
                            },
                        })];
                    case 1:
                        order = _b.sent();
                        if (!order) {
                            throw new common_1.NotFoundException('Rendelés nem található');
                        }
                        return [4 /*yield*/, this.prisma.invoice.findFirst({
                                where: { orderId: orderId },
                            })];
                    case 2:
                        existingInvoice = _b.sent();
                        if (existingInvoice) {
                            throw new common_1.BadRequestException('A rendeléshez már létezik számla');
                        }
                        items = order.items.map(function (orderItem) { return ({
                            itemId: orderItem.itemId,
                            nev: orderItem.item.nev,
                            azonosito: orderItem.item.azonosito,
                            mennyiseg: orderItem.mennyiseg,
                            egyseg: orderItem.item.egyseg,
                            egysegAr: orderItem.egysegAr,
                            kedvezmeny: orderItem.kedvezmeny,
                            afaKulcs: orderItem.item.afaKulcs,
                        }); });
                        fizetesiHataridoDatum = (dto === null || dto === void 0 ? void 0 : dto.fizetesiHataridoDatum)
                            ? new Date(dto.fizetesiHataridoDatum)
                            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                        return [2 /*return*/, this.create({
                                accountId: order.accountId,
                                orderId: order.id,
                                kiallitasDatum: dto === null || dto === void 0 ? void 0 : dto.kiallitasDatum,
                                teljesitesDatum: (dto === null || dto === void 0 ? void 0 : dto.teljesitesDatum) || ((_a = order.teljesitesiDatum) === null || _a === void 0 ? void 0 : _a.toISOString()) || new Date().toISOString(),
                                fizetesiHataridoDatum: fizetesiHataridoDatum.toISOString(),
                                tipus: (dto === null || dto === void 0 ? void 0 : dto.tipus) || 'NORMAL',
                                fizetesiMod: dto === null || dto === void 0 ? void 0 : dto.fizetesiMod,
                                megjegyzesek: dto === null || dto === void 0 ? void 0 : dto.megjegyzesek,
                                items: items,
                            })];
                }
            });
        });
    };
    InvoiceService.prototype.createFromPurchaseOrder = function (purchaseOrderId, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var purchaseOrder, existingInvoice, supplierAccount, items, fizetesiHataridoDatum;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.prisma.purchaseOrder.findUnique({
                            where: { id: purchaseOrderId },
                            include: {
                                supplier: true,
                                items: {
                                    include: {
                                        item: true,
                                    },
                                },
                            },
                        })];
                    case 1:
                        purchaseOrder = _b.sent();
                        if (!purchaseOrder) {
                            throw new common_1.NotFoundException('Beszerzési rendelés nem található');
                        }
                        return [4 /*yield*/, this.prisma.invoice.findFirst({
                                where: { purchaseOrderId: purchaseOrderId },
                            })];
                    case 2:
                        existingInvoice = _b.sent();
                        if (existingInvoice) {
                            throw new common_1.BadRequestException('A beszerzési rendeléshez már létezik számla');
                        }
                        return [4 /*yield*/, this.prisma.account.findFirst({
                                where: {
                                    OR: [
                                        { nev: { contains: purchaseOrder.supplier.nev } },
                                        { email: purchaseOrder.supplier.email || undefined },
                                    ],
                                },
                            })];
                    case 3:
                        supplierAccount = _b.sent();
                        if (!supplierAccount) {
                            throw new common_1.BadRequestException('A szállítóhoz nincs kapcsolódó ügyfél fiók. Kérjük, hozza létre az ügyfél fiókot.');
                        }
                        items = purchaseOrder.items.map(function (poItem) { return ({
                            itemId: poItem.itemId,
                            nev: poItem.item.nev,
                            azonosito: poItem.item.azonosito,
                            mennyiseg: poItem.mennyiseg,
                            egyseg: poItem.item.egyseg,
                            egysegAr: poItem.egysegAr,
                            kedvezmeny: 0,
                            afaKulcs: poItem.item.afaKulcs || 27, // Default VAT if not set
                        }); });
                        fizetesiHataridoDatum = (dto === null || dto === void 0 ? void 0 : dto.fizetesiHataridoDatum)
                            ? new Date(dto.fizetesiHataridoDatum)
                            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                        return [2 /*return*/, this.create({
                                accountId: supplierAccount.id,
                                purchaseOrderId: purchaseOrder.id,
                                kiallitasDatum: dto === null || dto === void 0 ? void 0 : dto.kiallitasDatum,
                                teljesitesDatum: (dto === null || dto === void 0 ? void 0 : dto.teljesitesDatum) || ((_a = purchaseOrder.szallitasiDatum) === null || _a === void 0 ? void 0 : _a.toISOString()) || new Date().toISOString(),
                                fizetesiHataridoDatum: fizetesiHataridoDatum.toISOString(),
                                tipus: (dto === null || dto === void 0 ? void 0 : dto.tipus) || 'NORMAL',
                                fizetesiMod: dto === null || dto === void 0 ? void 0 : dto.fizetesiMod,
                                megjegyzesek: (dto === null || dto === void 0 ? void 0 : dto.megjegyzesek) || purchaseOrder.megjegyzesek,
                                items: items,
                            })];
                }
            });
        });
    };
    InvoiceService.prototype.createFromDeliveryNote = function (deliveryNoteId, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var deliveryNote, existingInvoice;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.prisma.deliveryNote.findUnique({
                            where: { id: deliveryNoteId },
                            include: {
                                purchaseOrder: {
                                    include: {
                                        supplier: true,
                                        items: {
                                            include: {
                                                item: true,
                                            },
                                        },
                                    },
                                },
                                shipment: {
                                    include: {
                                        order: {
                                            include: {
                                                account: true,
                                                items: {
                                                    include: {
                                                        item: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        })];
                    case 1:
                        deliveryNote = _b.sent();
                        if (!deliveryNote) {
                            throw new common_1.NotFoundException('Szállítólevél nem található');
                        }
                        return [4 /*yield*/, this.prisma.invoice.findFirst({
                                where: { deliveryNoteId: deliveryNoteId },
                            })];
                    case 2:
                        existingInvoice = _b.sent();
                        if (existingInvoice) {
                            throw new common_1.BadRequestException('A szállítólevélhez már létezik számla');
                        }
                        // Handle purchase delivery note
                        if (deliveryNote.purchaseOrder) {
                            return [2 /*return*/, this.createFromPurchaseOrder(deliveryNote.purchaseOrder.id, __assign(__assign({}, dto), { deliveryNoteId: deliveryNote.id }))];
                        }
                        // Handle sales delivery note
                        if ((_a = deliveryNote.shipment) === null || _a === void 0 ? void 0 : _a.order) {
                            return [2 /*return*/, this.createFromOrder(deliveryNote.shipment.order.id, __assign(__assign({}, dto), { deliveryNoteId: deliveryNote.id }))];
                        }
                        throw new common_1.BadRequestException('A szállítólevélhez nincs kapcsolódó rendelés vagy beszerzési rendelés');
                }
            });
        });
    };
    InvoiceService.prototype.update = function (id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var invoice, updateData, osszeg, afa, _i, _a, itemDto, nettoOsszeg, afaOsszeg;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        invoice = _b.sent();
                        // Can't update issued invoices
                        if (invoice.allapot !== 'VAZLAT' && invoice.allapot !== 'KIALLITVA') {
                            throw new common_1.BadRequestException('Csak vázlat vagy kiallított számla szerkeszthető');
                        }
                        updateData = {};
                        if (dto.kiallitasDatum) {
                            updateData.kiallitasDatum = new Date(dto.kiallitasDatum);
                        }
                        if (dto.teljesitesDatum) {
                            updateData.teljesitesDatum = new Date(dto.teljesitesDatum);
                        }
                        if (dto.fizetesiHataridoDatum) {
                            updateData.fizetesiHataridoDatum = new Date(dto.fizetesiHataridoDatum);
                        }
                        if (dto.allapot) {
                            updateData.allapot = dto.allapot;
                        }
                        if (dto.fizetesiMod !== undefined) {
                            updateData.fizetesiMod = dto.fizetesiMod;
                        }
                        if (dto.megjegyzesek !== undefined) {
                            updateData.megjegyzesek = dto.megjegyzesek;
                        }
                        if (!dto.items) return [3 /*break*/, 4];
                        // Delete existing items
                        return [4 /*yield*/, this.prisma.invoiceItem.deleteMany({
                                where: { invoiceId: id },
                            })];
                    case 2:
                        // Delete existing items
                        _b.sent();
                        osszeg = 0;
                        afa = 0;
                        for (_i = 0, _a = dto.items; _i < _a.length; _i++) {
                            itemDto = _a[_i];
                            nettoOsszeg = itemDto.mennyiseg * itemDto.egysegAr * (1 - (itemDto.kedvezmeny || 0) / 100);
                            afaOsszeg = nettoOsszeg * (itemDto.afaKulcs / 100);
                            osszeg += nettoOsszeg;
                            afa += afaOsszeg;
                        }
                        updateData.osszeg = osszeg;
                        updateData.afa = afa;
                        updateData.vegosszeg = osszeg + afa;
                        // Create new items
                        return [4 /*yield*/, this.prisma.invoiceItem.createMany({
                                data: dto.items.map(function (itemDto, index) {
                                    var nettoOsszeg = itemDto.mennyiseg * itemDto.egysegAr * (1 - (itemDto.kedvezmeny || 0) / 100);
                                    var afaOsszeg = nettoOsszeg * (itemDto.afaKulcs / 100);
                                    var bruttoOsszeg = nettoOsszeg + afaOsszeg;
                                    return {
                                        invoiceId: id,
                                        itemId: itemDto.itemId,
                                        nev: itemDto.nev,
                                        azonosito: itemDto.azonosito,
                                        mennyiseg: itemDto.mennyiseg,
                                        egyseg: itemDto.egyseg,
                                        egysegAr: itemDto.egysegAr,
                                        kedvezmeny: itemDto.kedvezmeny || 0,
                                        afaKulcs: itemDto.afaKulcs,
                                        nettoOsszeg: nettoOsszeg,
                                        afaOsszeg: afaOsszeg,
                                        bruttoOsszeg: bruttoOsszeg,
                                        megjegyzes: itemDto.megjegyzes,
                                        sorrend: index,
                                    };
                                }),
                            })];
                    case 3:
                        // Create new items
                        _b.sent();
                        _b.label = 4;
                    case 4: return [2 /*return*/, this.prisma.invoice.update({
                            where: { id: id },
                            data: updateData,
                            include: {
                                account: true,
                                items: true,
                            },
                        })];
                }
            });
        });
    };
    InvoiceService.prototype.markAsIssued = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var invoice;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        invoice = _a.sent();
                        if (invoice.allapot !== 'VAZLAT') {
                            throw new common_1.BadRequestException('Csak vázlat számla állítható kiallított állapotba');
                        }
                        return [2 /*return*/, this.prisma.invoice.update({
                                where: { id: id },
                                data: {
                                    allapot: 'KIALLITVA',
                                },
                            })];
                }
            });
        });
    };
    InvoiceService.prototype.markAsSent = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var invoice;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        invoice = _a.sent();
                        if (invoice.allapot !== 'KIALLITVA') {
                            throw new common_1.BadRequestException('Csak kiallított számla állítható elküldött állapotba');
                        }
                        return [2 /*return*/, this.prisma.invoice.update({
                                where: { id: id },
                                data: {
                                    allapot: 'ELKULDVE',
                                },
                            })];
                }
            });
        });
    };
    InvoiceService.prototype.addPayment = function (id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var invoice, totalPaid, remainingAmount, payment, newTotalPaid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        invoice = _a.sent();
                        if (invoice.allapot === 'STORNO') {
                            throw new common_1.BadRequestException('Stornózott számlához nem adható hozzá fizetés');
                        }
                        totalPaid = invoice.payments.reduce(function (sum, payment) { return sum + payment.osszeg; }, 0);
                        remainingAmount = invoice.vegosszeg - totalPaid;
                        if (dto.osszeg > remainingAmount) {
                            throw new common_1.BadRequestException('A fizetés összege nem lehet nagyobb, mint a fennmaradó összeg');
                        }
                        return [4 /*yield*/, this.prisma.invoicePayment.create({
                                data: {
                                    invoiceId: id,
                                    fizetesiDatum: new Date(dto.fizetesiDatum),
                                    osszeg: dto.osszeg,
                                    fizetesiMod: dto.fizetesiMod,
                                    tranzakcioSzam: dto.tranzakcioSzam,
                                    megjegyzesek: dto.megjegyzesek,
                                },
                            })];
                    case 2:
                        payment = _a.sent();
                        newTotalPaid = totalPaid + dto.osszeg;
                        if (!(newTotalPaid >= invoice.vegosszeg)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.prisma.invoice.update({
                                where: { id: id },
                                data: {
                                    allapot: 'KIFIZETVE',
                                    fizetesiDatum: new Date(dto.fizetesiDatum),
                                },
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, payment];
                }
            });
        });
    };
    InvoiceService.prototype.storno = function (id, reason) {
        return __awaiter(this, void 0, void 0, function () {
            var invoice;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        invoice = _a.sent();
                        if (invoice.allapot === 'STORNO') {
                            throw new common_1.BadRequestException('A számla már stornózva van');
                        }
                        return [2 /*return*/, this.prisma.invoice.update({
                                where: { id: id },
                                data: {
                                    allapot: 'STORNO',
                                    megjegyzesek: reason
                                        ? "".concat(invoice.megjegyzesek || '', "\n\nStorno: ").concat(reason).trim()
                                        : invoice.megjegyzesek,
                                },
                            })];
                }
            });
        });
    };
    InvoiceService.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var invoice;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        invoice = _a.sent();
                        if (invoice.allapot !== 'VAZLAT') {
                            throw new common_1.BadRequestException('Csak vázlat számla törölhető');
                        }
                        return [2 /*return*/, this.prisma.invoice.delete({
                                where: { id: id },
                            })];
                }
            });
        });
    };
    InvoiceService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], InvoiceService);
    return InvoiceService;
}());
exports.InvoiceService = InvoiceService;
