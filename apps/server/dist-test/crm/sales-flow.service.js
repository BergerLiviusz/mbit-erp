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
exports.SalesFlowService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var settings_service_1 = require("../system/settings.service");
var order_status_enum_1 = require("./enums/order-status.enum");
var SalesFlowService = /** @class */ (function () {
    function SalesFlowService(prisma, settingsService) {
        this.prisma = prisma;
        this.settingsService = settingsService;
    }
    SalesFlowService.prototype.convertQuoteToOrder = function (quoteId) {
        return __awaiter(this, void 0, void 0, function () {
            var quote, azonosito, order;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.quote.findUnique({
                            where: { id: quoteId },
                            include: { items: true, order: true, discounts: true },
                        })];
                    case 1:
                        quote = _a.sent();
                        if (!quote)
                            throw new common_1.NotFoundException('Árajánlat nem található');
                        if (quote.order)
                            throw new common_1.BadRequestException('Ehhez az árajánlathoz már létezik rendelés');
                        if (!['jovahagyott', 'elfogadva'].includes(quote.allapot)) {
                            throw new common_1.BadRequestException('Csak jóváhagyott vagy elfogadott árajánlatból hozható létre rendelés');
                        }
                        return [4 /*yield*/, this.generateOrderNumber()];
                    case 2:
                        azonosito = _a.sent();
                        return [4 /*yield*/, this.prisma.order.create({
                                data: __assign({ azonosito: azonosito, accountId: quote.accountId, quoteId: quote.id, rendelesiDatum: new Date(), osszeg: quote.osszeg, afa: quote.afa, vegosszeg: quote.vegosszeg, allapot: order_status_enum_1.OrderStatus.NEW, megjegyzesek: "\u00C1raj\u00E1nlatb\u00F3l: ".concat(quote.azonosito), items: {
                                        create: quote.items.map(function (item) { return ({
                                            itemId: item.itemId,
                                            mennyiseg: item.mennyiseg,
                                            egysegAr: item.egysegAr,
                                            kedvezmeny: item.kedvezmeny,
                                            osszeg: item.osszeg,
                                        }); }),
                                    } }, (quote.discounts.length > 0 && {
                                    discounts: {
                                        create: quote.discounts.map(function (d) { return ({
                                            tipus: d.tipus,
                                            ertek: d.ertek,
                                            mennyisegiHatar: d.mennyisegiHatar,
                                            ertekHatar: d.ertekHatar,
                                            kezdetDatum: d.kezdetDatum,
                                            vegesDatum: d.vegesDatum,
                                            leiras: d.leiras,
                                        }); }),
                                    },
                                })),
                                include: {
                                    account: true,
                                    quote: true,
                                    items: { include: { item: true } },
                                },
                            })];
                    case 3:
                        order = _a.sent();
                        return [4 /*yield*/, this.prisma.quote.update({
                                where: { id: quoteId },
                                data: { allapot: 'elfogadva' },
                            })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, order];
                }
            });
        });
    };
    SalesFlowService.prototype.createShipmentFromOrder = function (orderId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var order, szallitasiCim;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.prisma.order.findUnique({
                            where: { id: orderId },
                            include: { account: true, shipments: true },
                        })];
                    case 1:
                        order = _c.sent();
                        if (!order)
                            throw new common_1.NotFoundException('Rendelés nem található');
                        szallitasiCim = (data === null || data === void 0 ? void 0 : data.szallitasiCim) ||
                            ((_a = order.account) === null || _a === void 0 ? void 0 : _a.szallitasiCim) ||
                            ((_b = order.account) === null || _b === void 0 ? void 0 : _b.cim) ||
                            'Nincs megadva szállítási cím';
                        return [2 /*return*/, this.prisma.shipment.create({
                                data: {
                                    orderId: orderId,
                                    szallitasiCim: szallitasiCim,
                                    szallitasiMod: (data === null || data === void 0 ? void 0 : data.szallitasiMod) || 'standard',
                                    szallitasiDatum: new Date(),
                                    allapot: 'ELKESZULT',
                                    megjegyzesek: "Rendel\u00E9s: ".concat(order.azonosito),
                                },
                            })];
                }
            });
        });
    };
    SalesFlowService.prototype.createInvoiceStubFromOrder = function (orderId) {
        return __awaiter(this, void 0, void 0, function () {
            var order, count, szamlaSzam, now, fizetesiHatarido;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.order.findUnique({
                            where: { id: orderId },
                            include: { invoiceStub: true, account: true },
                        })];
                    case 1:
                        order = _a.sent();
                        if (!order)
                            throw new common_1.NotFoundException('Rendelés nem található');
                        if (order.invoiceStub)
                            throw new common_1.BadRequestException('Ehhez a rendeléshez már létezik számla-meta');
                        return [4 /*yield*/, this.prisma.invoiceStub.count()];
                    case 2:
                        count = _a.sent();
                        szamlaSzam = "SZM-".concat(new Date().getFullYear(), "-").concat(String(count + 1).padStart(5, '0'));
                        now = new Date();
                        fizetesiHatarido = new Date(now);
                        fizetesiHatarido.setDate(fizetesiHatarido.getDate() + 30);
                        return [2 /*return*/, this.prisma.invoiceStub.create({
                                data: {
                                    accountId: order.accountId,
                                    orderId: order.id,
                                    szamlaSzam: szamlaSzam,
                                    teljesitesDatum: now,
                                    fizetesiHataridoDatum: fizetesiHatarido,
                                    osszeg: order.osszeg,
                                    afa: order.afa,
                                    vegosszeg: order.vegosszeg,
                                    tipus: 'NORMAL',
                                    allapot: 'TERVEZET',
                                    megjegyzesek: "Rendel\u00E9sb\u0151l: ".concat(order.azonosito),
                                },
                                include: { account: true, order: true },
                            })];
                }
            });
        });
    };
    SalesFlowService.prototype.createInvoiceStubFromShipment = function (shipmentId) {
        return __awaiter(this, void 0, void 0, function () {
            var shipment;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.shipment.findUnique({
                            where: { id: shipmentId },
                            include: { order: { include: { invoiceStub: true, account: true } } },
                        })];
                    case 1:
                        shipment = _a.sent();
                        if (!(shipment === null || shipment === void 0 ? void 0 : shipment.order))
                            throw new common_1.NotFoundException('Szállítás / rendelés nem található');
                        return [2 /*return*/, this.createInvoiceStubFromOrder(shipment.order.id)];
                }
            });
        });
    };
    SalesFlowService.prototype.generateOrderNumber = function () {
        return __awaiter(this, void 0, void 0, function () {
            var prefix, lastOrder, nextNumber, lastNumber;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.settingsService.get('order.number.prefix')];
                    case 1:
                        prefix = (_a.sent()) || 'REND';
                        return [4 /*yield*/, this.prisma.order.findFirst({
                                where: { azonosito: { startsWith: prefix } },
                                orderBy: { azonosito: 'desc' },
                            })];
                    case 2:
                        lastOrder = _a.sent();
                        nextNumber = 1;
                        if (lastOrder) {
                            lastNumber = parseInt(lastOrder.azonosito.replace(prefix, ''), 10) || 0;
                            nextNumber = lastNumber + 1;
                        }
                        return [2 /*return*/, "".concat(prefix, "-").concat(nextNumber.toString().padStart(6, '0'))];
                }
            });
        });
    };
    SalesFlowService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService,
            settings_service_1.SystemSettingsService])
    ], SalesFlowService);
    return SalesFlowService;
}());
exports.SalesFlowService = SalesFlowService;
