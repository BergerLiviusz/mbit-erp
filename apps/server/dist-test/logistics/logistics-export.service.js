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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogisticsExportService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var stock_movement_service_1 = require("./stock-movement.service");
var exceljs_1 = __importDefault(require("exceljs"));
var LogisticsExportService = /** @class */ (function () {
    function LogisticsExportService(prisma, stockMovementService) {
        this.prisma = prisma;
        this.stockMovementService = stockMovementService;
    }
    LogisticsExportService.prototype.toCsv = function (rows) {
        return rows
            .map(function (r) {
            return r
                .map(function (c) {
                var s = String(c !== null && c !== void 0 ? c : '');
                return s.includes(',') || s.includes('"') ? "\"".concat(s.replace(/"/g, '""'), "\"") : s;
            })
                .join(',');
        })
            .join('\n');
    };
    LogisticsExportService.prototype.toXlsxBuffer = function (sheetName, headers, rows) {
        return __awaiter(this, void 0, void 0, function () {
            var workbook, sheet, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        workbook = new exceljs_1.default.Workbook();
                        sheet = workbook.addWorksheet(sheetName);
                        sheet.addRow(headers);
                        rows.forEach(function (r) { return sheet.addRow(r); });
                        _b = (_a = Buffer).from;
                        return [4 /*yield*/, workbook.xlsx.writeBuffer()];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    LogisticsExportService.prototype.exportReport = function (reportType, format, filters) {
        return __awaiter(this, void 0, void 0, function () {
            var ext, date, _a, levels, headers, rows, wid, levels, headers, rows, movements, headers, rows, lots, headers, rows, days, lots, headers, rows, alerts, headers, rows, orders, headers, rows, sheets, headers, rows, _i, sheets_1, sh, _b, _c, it_1;
            var _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        ext = format === 'csv' ? 'csv' : 'xlsx';
                        date = new Date().toISOString().split('T')[0];
                        _a = reportType;
                        switch (_a) {
                            case 'stock-current': return [3 /*break*/, 1];
                            case 'stock-by-warehouse': return [3 /*break*/, 3];
                            case 'stock-movements': return [3 /*break*/, 5];
                            case 'batches': return [3 /*break*/, 7];
                            case 'batches-expiring': return [3 /*break*/, 9];
                            case 'low-stock': return [3 /*break*/, 11];
                            case 'purchase-orders': return [3 /*break*/, 13];
                            case 'inventory-variance': return [3 /*break*/, 15];
                        }
                        return [3 /*break*/, 17];
                    case 1: return [4 /*yield*/, this.prisma.stockLevel.findMany({
                            include: { item: true, warehouse: true },
                            orderBy: { updatedAt: 'desc' },
                        })];
                    case 2:
                        levels = _g.sent();
                        headers = ['Cikk', 'Azonosító', 'Raktár', 'Mennyiség', 'Min', 'Max', 'Egység'];
                        rows = levels.map(function (l) {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
                            return [
                                (_b = (_a = l.item) === null || _a === void 0 ? void 0 : _a.nev) !== null && _b !== void 0 ? _b : '',
                                (_d = (_c = l.item) === null || _c === void 0 ? void 0 : _c.azonosito) !== null && _d !== void 0 ? _d : '',
                                (_f = (_e = l.warehouse) === null || _e === void 0 ? void 0 : _e.nev) !== null && _f !== void 0 ? _f : '',
                                l.mennyiseg,
                                (_j = (_g = l.minimum) !== null && _g !== void 0 ? _g : (_h = l.item) === null || _h === void 0 ? void 0 : _h.minKeszlet) !== null && _j !== void 0 ? _j : '',
                                (_m = (_k = l.maximum) !== null && _k !== void 0 ? _k : (_l = l.item) === null || _l === void 0 ? void 0 : _l.maxKeszlet) !== null && _m !== void 0 ? _m : '',
                                (_p = (_o = l.item) === null || _o === void 0 ? void 0 : _o.egyseg) !== null && _p !== void 0 ? _p : '',
                            ];
                        });
                        return [2 /*return*/, this.pack('Aktualis_keszlet', headers, rows, format, ext, date)];
                    case 3:
                        wid = filters === null || filters === void 0 ? void 0 : filters.warehouseId;
                        return [4 /*yield*/, this.prisma.stockLevel.findMany({
                                where: wid ? { warehouseId: wid } : undefined,
                                include: { item: true, warehouse: true },
                            })];
                    case 4:
                        levels = _g.sent();
                        headers = ['Raktár', 'Cikk', 'Mennyiség'];
                        rows = levels.map(function (l) {
                            var _a, _b, _c, _d;
                            return [
                                (_b = (_a = l.warehouse) === null || _a === void 0 ? void 0 : _a.nev) !== null && _b !== void 0 ? _b : '',
                                (_d = (_c = l.item) === null || _c === void 0 ? void 0 : _c.nev) !== null && _d !== void 0 ? _d : '',
                                l.mennyiseg,
                            ];
                        });
                        return [2 /*return*/, this.pack('Keszlet_raktarankent', headers, rows, format, ext, date)];
                    case 5: return [4 /*yield*/, this.stockMovementService.findMovements({
                            warehouseId: filters === null || filters === void 0 ? void 0 : filters.warehouseId,
                            itemId: filters === null || filters === void 0 ? void 0 : filters.itemId,
                            take: 10000,
                        })];
                    case 6:
                        movements = (_g.sent()).movements;
                        headers = ['Dátum', 'Típus', 'Cikk', 'Raktár', 'Mennyiség', 'Sarzs', 'Megjegyzés'];
                        rows = movements.map(function (m) {
                            var _a, _b, _c, _d, _e, _f;
                            return [
                                m.createdAt.toISOString(),
                                m.tipus,
                                (_b = (_a = m.item) === null || _a === void 0 ? void 0 : _a.nev) !== null && _b !== void 0 ? _b : '',
                                (_d = (_c = m.warehouse) === null || _c === void 0 ? void 0 : _c.nev) !== null && _d !== void 0 ? _d : '',
                                m.mennyiseg,
                                (_e = m.sarzsGyartasiSzam) !== null && _e !== void 0 ? _e : '',
                                (_f = m.megjegyzesek) !== null && _f !== void 0 ? _f : '',
                            ];
                        });
                        return [2 /*return*/, this.pack('Keszletmozgasok', headers, rows, format, ext, date)];
                    case 7: return [4 /*yield*/, this.stockMovementService.findLots({
                            warehouseId: filters === null || filters === void 0 ? void 0 : filters.warehouseId,
                            take: 10000,
                        })];
                    case 8:
                        lots = (_g.sent()).lots;
                        headers = ['Sarzs', 'Cikk', 'Raktár', 'Mennyiség', 'Lejárat'];
                        rows = lots.map(function (l) {
                            var _a, _b, _c, _d, _e;
                            return [
                                (_a = l.sarzsGyartasiSzam) !== null && _a !== void 0 ? _a : '',
                                (_c = (_b = l.item) === null || _b === void 0 ? void 0 : _b.nev) !== null && _c !== void 0 ? _c : '',
                                (_e = (_d = l.warehouse) === null || _d === void 0 ? void 0 : _d.nev) !== null && _e !== void 0 ? _e : '',
                                l.mennyiseg,
                                l.lejarat ? l.lejarat.toISOString().split('T')[0] : '',
                            ];
                        });
                        return [2 /*return*/, this.pack('Sarzs_riport', headers, rows, format, ext, date)];
                    case 9:
                        days = parseInt((filters === null || filters === void 0 ? void 0 : filters.days) || '30', 10);
                        return [4 /*yield*/, this.stockMovementService.findLots({
                                expiringWithinDays: days,
                                take: 10000,
                            })];
                    case 10:
                        lots = (_g.sent()).lots;
                        headers = ['Sarzs', 'Cikk', 'Raktár', 'Mennyiség', 'Lejárat'];
                        rows = lots.map(function (l) {
                            var _a, _b, _c, _d, _e;
                            return [
                                (_a = l.sarzsGyartasiSzam) !== null && _a !== void 0 ? _a : '',
                                (_c = (_b = l.item) === null || _b === void 0 ? void 0 : _b.nev) !== null && _c !== void 0 ? _c : '',
                                (_e = (_d = l.warehouse) === null || _d === void 0 ? void 0 : _d.nev) !== null && _e !== void 0 ? _e : '',
                                l.mennyiseg,
                                l.lejarat ? l.lejarat.toISOString().split('T')[0] : '',
                            ];
                        });
                        return [2 /*return*/, this.pack('Lejaro_sarzs', headers, rows, format, ext, date)];
                    case 11: return [4 /*yield*/, this.stockMovementService.getStockAlerts()];
                    case 12:
                        alerts = _g.sent();
                        headers = ['Cikk', 'Raktár', 'Aktuális', 'Küszöb', 'Típus'];
                        rows = __spreadArray([], alerts.belowMin.map(function (s) {
                            var _a, _b, _c, _d, _e;
                            return [
                                (_b = (_a = s.item) === null || _a === void 0 ? void 0 : _a.nev) !== null && _b !== void 0 ? _b : '',
                                (_d = (_c = s.warehouse) === null || _c === void 0 ? void 0 : _c.nev) !== null && _d !== void 0 ? _d : '',
                                s.mennyiseg,
                                (_e = s.threshold) !== null && _e !== void 0 ? _e : '',
                                'minimum alatt',
                            ];
                        }), true);
                        return [2 /*return*/, this.pack('Min_keszlet_alatt', headers, rows, format, ext, date)];
                    case 13: return [4 /*yield*/, this.prisma.purchaseOrder.findMany({
                            include: { supplier: true, items: { include: { item: true } } },
                            orderBy: { createdAt: 'desc' },
                        })];
                    case 14:
                        orders = _g.sent();
                        headers = ['Azonosító', 'Szállító', 'Állapot', 'Összeg', 'Dátum'];
                        rows = orders.map(function (o) {
                            var _a, _b;
                            return [
                                o.azonosito,
                                (_b = (_a = o.supplier) === null || _a === void 0 ? void 0 : _a.nev) !== null && _b !== void 0 ? _b : '',
                                o.allapot,
                                o.vegosszeg,
                                o.rendelesiDatum.toISOString().split('T')[0],
                            ];
                        });
                        return [2 /*return*/, this.pack('Beszerzesi_rendelesek', headers, rows, format, ext, date)];
                    case 15: return [4 /*yield*/, this.prisma.inventorySheet.findMany({
                            where: { allapot: { in: ['BEFEJEZETT', 'JOVAHAGYVA', 'FOLYAMATBAN'] } },
                            include: {
                                warehouse: true,
                                items: { include: { item: true } },
                            },
                            take: 50,
                            orderBy: { createdAt: 'desc' },
                        })];
                    case 16:
                        sheets = _g.sent();
                        headers = ['Leltár', 'Cikk', 'Könyv', 'Tényleges', 'Eltérés'];
                        rows = [];
                        for (_i = 0, sheets_1 = sheets; _i < sheets_1.length; _i++) {
                            sh = sheets_1[_i];
                            for (_b = 0, _c = sh.items; _b < _c.length; _b++) {
                                it_1 = _c[_b];
                                if (it_1.kulonbseg != null && it_1.kulonbseg !== 0) {
                                    rows.push([
                                        sh.azonosito,
                                        (_e = (_d = it_1.item) === null || _d === void 0 ? void 0 : _d.nev) !== null && _e !== void 0 ? _e : '',
                                        it_1.konyvKeszlet,
                                        (_f = it_1.tenylegesKeszlet) !== null && _f !== void 0 ? _f : '',
                                        it_1.kulonbseg,
                                    ]);
                                }
                            }
                        }
                        return [2 /*return*/, this.pack('Leltar_elteres', headers, rows, format, ext, date)];
                    case 17: throw new Error("Ismeretlen riport t\u00EDpus: ".concat(reportType));
                }
            });
        });
    };
    LogisticsExportService.prototype.packRows = function (baseName, headers, rows, format) {
        return __awaiter(this, void 0, void 0, function () {
            var ext, date;
            return __generator(this, function (_a) {
                ext = format === 'csv' ? 'csv' : 'xlsx';
                date = new Date().toISOString().split('T')[0];
                return [2 /*return*/, this.pack(baseName, headers, rows, format, ext, date)];
            });
        });
    };
    LogisticsExportService.prototype.pack = function (baseName, headers, rows, format, ext, date) {
        return __awaiter(this, void 0, void 0, function () {
            var filename, csv;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        filename = "".concat(baseName, "_").concat(date, ".").concat(ext);
                        if (format === 'csv') {
                            csv = this.toCsv(__spreadArray([headers], rows.map(function (r) { return r.map(String); }), true));
                            return [2 /*return*/, {
                                    buffer: Buffer.from('\uFEFF' + csv, 'utf-8'),
                                    contentType: 'text/csv; charset=utf-8',
                                    filename: filename,
                                }];
                        }
                        _a = {};
                        return [4 /*yield*/, this.toXlsxBuffer(baseName, headers, rows)];
                    case 1: return [2 /*return*/, (_a.buffer = _b.sent(),
                            _a.contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            _a.filename = filename,
                            _a)];
                }
            });
        });
    };
    LogisticsExportService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService,
            stock_movement_service_1.StockMovementService])
    ], LogisticsExportService);
    return LogisticsExportService;
}());
exports.LogisticsExportService = LogisticsExportService;
