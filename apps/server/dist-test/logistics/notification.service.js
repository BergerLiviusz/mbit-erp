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
exports.NotificationService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var NotificationService = /** @class */ (function () {
    function NotificationService(prisma) {
        this.prisma = prisma;
    }
    NotificationService.prototype.getExpiringProducts = function () {
        return __awaiter(this, arguments, void 0, function (days) {
            var cutoffDate, items, expiringProducts, _i, items_1, item, _a, _b, lot, expirationDate, warehouse;
            if (days === void 0) { days = 30; }
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        cutoffDate = new Date();
                        cutoffDate.setDate(cutoffDate.getDate() + days);
                        return [4 /*yield*/, this.prisma.item.findMany({
                                where: {
                                    aktiv: true,
                                    szavatossagiIdoNap: {
                                        not: null,
                                    },
                                },
                                include: {
                                    stockLots: true,
                                },
                            })];
                    case 1:
                        items = _c.sent();
                        expiringProducts = [];
                        _i = 0, items_1 = items;
                        _c.label = 2;
                    case 2:
                        if (!(_i < items_1.length)) return [3 /*break*/, 7];
                        item = items_1[_i];
                        if (!item.szavatossagiIdoNap)
                            return [3 /*break*/, 6];
                        _a = 0, _b = item.stockLots;
                        _c.label = 3;
                    case 3:
                        if (!(_a < _b.length)) return [3 /*break*/, 6];
                        lot = _b[_a];
                        expirationDate = new Date(lot.createdAt);
                        expirationDate.setDate(expirationDate.getDate() + item.szavatossagiIdoNap);
                        if (!(expirationDate <= cutoffDate && expirationDate >= new Date())) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.prisma.warehouse.findUnique({
                                where: { id: lot.warehouseId },
                            })];
                    case 4:
                        warehouse = _c.sent();
                        expiringProducts.push({
                            itemId: item.id,
                            itemName: item.nev,
                            itemAzonosito: item.azonosito,
                            warehouseId: lot.warehouseId,
                            warehouseName: (warehouse === null || warehouse === void 0 ? void 0 : warehouse.nev) || 'Ismeretlen raktár',
                            expirationDate: expirationDate.toISOString(),
                            daysUntilExpiration: Math.ceil((expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
                            quantity: lot.mennyiseg,
                        });
                        _c.label = 5;
                    case 5:
                        _a++;
                        return [3 /*break*/, 3];
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7: return [2 /*return*/, expiringProducts.sort(function (a, b) {
                            return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
                        })];
                }
            });
        });
    };
    NotificationService.prototype.getLowStockItems = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stockLevels, lowStockItems;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.stockLevel.findMany({
                            where: {
                                minimum: {
                                    not: null,
                                },
                                item: {
                                    aktiv: true,
                                },
                            },
                            include: {
                                item: true,
                                warehouse: true,
                            },
                        })];
                    case 1:
                        stockLevels = _a.sent();
                        lowStockItems = stockLevels
                            .filter(function (sl) {
                            if (sl.minimum === null)
                                return false;
                            return sl.mennyiseg <= sl.minimum;
                        })
                            .map(function (sl) { return ({
                            id: sl.id,
                            itemId: sl.itemId,
                            itemName: sl.item.nev,
                            itemAzonosito: sl.item.azonosito,
                            warehouseId: sl.warehouseId,
                            warehouseName: sl.warehouse.nev,
                            currentStock: sl.mennyiseg,
                            minimumStock: sl.minimum,
                            maximumStock: sl.maximum,
                        }); });
                        return [2 /*return*/, lowStockItems];
                }
            });
        });
    };
    NotificationService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], NotificationService);
    return NotificationService;
}());
exports.NotificationService = NotificationService;
