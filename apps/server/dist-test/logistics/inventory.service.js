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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var settings_service_1 = require("../system/settings.service");
var pdfkit_1 = __importDefault(require("pdfkit"));
var exceljs_1 = __importDefault(require("exceljs"));
var InventoryService = /** @class */ (function () {
    function InventoryService(prisma, settingsService) {
        this.prisma = prisma;
        this.settingsService = settingsService;
    }
    InventoryService.prototype.getLowStockThreshold = function () {
        return __awaiter(this, void 0, void 0, function () {
            var threshold;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.settingsService.get('logistics.low_stock_threshold')];
                    case 1:
                        threshold = _a.sent();
                        return [2 /*return*/, threshold ? parseFloat(threshold) : 10];
                }
            });
        });
    };
    InventoryService.prototype.addLowStockFlag = function (stockLevel) {
        return __awaiter(this, void 0, void 0, function () {
            var threshold, lowStockFlag;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getLowStockThreshold()];
                    case 1:
                        threshold = _a.sent();
                        lowStockFlag = stockLevel.minimum
                            ? stockLevel.mennyiseg <= stockLevel.minimum
                            : stockLevel.mennyiseg <= threshold;
                        return [2 /*return*/, __assign(__assign({}, stockLevel), { lowStockFlag: lowStockFlag })];
                }
            });
        });
    };
    InventoryService.prototype.findAllStockLevels = function () {
        return __awaiter(this, arguments, void 0, function (skip, take, filters) {
            var where, _a, total, items, data, page, pageSize;
            var _this = this;
            if (skip === void 0) { skip = 0; }
            if (take === void 0) { take = 50; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        where = {};
                        if (filters === null || filters === void 0 ? void 0 : filters.warehouseId) {
                            where.warehouseId = filters.warehouseId;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.itemId) {
                            where.itemId = filters.itemId;
                        }
                        return [4 /*yield*/, Promise.all([
                                this.prisma.stockLevel.count({ where: where }),
                                this.prisma.stockLevel.findMany({
                                    where: where,
                                    skip: skip,
                                    take: take,
                                    include: {
                                        item: {
                                            include: {
                                                itemGroup: true,
                                            },
                                        },
                                        warehouse: true,
                                        location: true,
                                    },
                                    orderBy: { updatedAt: 'desc' },
                                }),
                            ])];
                    case 1:
                        _a = _b.sent(), total = _a[0], items = _a[1];
                        return [4 /*yield*/, Promise.all(items.map(function (item) { return _this.addLowStockFlag(item); }))];
                    case 2:
                        data = _b.sent();
                        page = Math.floor(skip / take) + 1;
                        pageSize = take;
                        return [2 /*return*/, { data: data, total: total, page: page, pageSize: pageSize }];
                }
            });
        });
    };
    InventoryService.prototype.getStockByWarehouse = function (warehouseId) {
        return __awaiter(this, void 0, void 0, function () {
            var stockLevels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.stockLevel.findMany({
                            where: { warehouseId: warehouseId },
                            include: {
                                item: {
                                    include: {
                                        stockLots: {
                                            where: { warehouseId: warehouseId },
                                            orderBy: { createdAt: 'desc' },
                                        },
                                    },
                                },
                                warehouse: true,
                                location: true,
                            },
                            orderBy: { updatedAt: 'desc' },
                        })];
                    case 1:
                        stockLevels = _a.sent();
                        return [4 /*yield*/, Promise.all(stockLevels.map(function (item) { return _this.addLowStockFlag(item); }))];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    InventoryService.prototype.checkLowStock = function () {
        return __awaiter(this, void 0, void 0, function () {
            var threshold, allStockLevels, lowStockItems;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getLowStockThreshold()];
                    case 1:
                        threshold = _a.sent();
                        return [4 /*yield*/, this.prisma.stockLevel.findMany({
                                include: {
                                    item: true,
                                    warehouse: true,
                                    location: true,
                                },
                            })];
                    case 2:
                        allStockLevels = _a.sent();
                        lowStockItems = allStockLevels.filter(function (stockLevel) {
                            return stockLevel.minimum
                                ? stockLevel.mennyiseg <= stockLevel.minimum
                                : stockLevel.mennyiseg <= threshold;
                        });
                        return [4 /*yield*/, Promise.all(lowStockItems.map(function (item) { return _this.addLowStockFlag(item); }))];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    InventoryService.prototype.createStockLevel = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var locationId, existing, stockLevel, mennyiseg, beszerzesiAr, finalBeszerzesiAr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        locationId = data.locationId === undefined || data.locationId === null ? null : data.locationId;
                        if (!(locationId === null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.prisma.stockLevel.findFirst({
                                where: {
                                    itemId: data.itemId,
                                    warehouseId: data.warehouseId,
                                    locationId: null,
                                },
                            })];
                    case 1:
                        existing = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.prisma.stockLevel.findUnique({
                            where: {
                                itemId_warehouseId_locationId: {
                                    itemId: data.itemId,
                                    warehouseId: data.warehouseId,
                                    locationId: locationId,
                                },
                            },
                        })];
                    case 3:
                        existing = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!existing) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.prisma.stockLevel.update({
                                where: { id: existing.id },
                                data: {
                                    mennyiseg: data.mennyiseg !== undefined ? data.mennyiseg : existing.mennyiseg,
                                    minimum: data.minimum !== undefined ? data.minimum : existing.minimum,
                                    maximum: data.maximum !== undefined ? data.maximum : existing.maximum,
                                },
                                include: {
                                    item: {
                                        include: {
                                            itemGroup: true,
                                        },
                                    },
                                    warehouse: true,
                                    location: true,
                                },
                            })];
                    case 5: 
                    // Update existing stock level
                    return [2 /*return*/, _a.sent()];
                    case 6: return [4 /*yield*/, this.prisma.stockLevel.create({
                            data: {
                                itemId: data.itemId,
                                warehouseId: data.warehouseId,
                                locationId: locationId,
                                mennyiseg: data.mennyiseg || 0,
                                minimum: data.minimum || null,
                                maximum: data.maximum || null,
                            },
                            include: {
                                item: true,
                                warehouse: true,
                                location: true,
                            },
                        })];
                    case 7:
                        stockLevel = _a.sent();
                        if (!(data.sarzsGyartasiSzam && data.sarzsGyartasiSzam.trim())) return [3 /*break*/, 9];
                        mennyiseg = data.mennyiseg || 0;
                        beszerzesiAr = data.beszerzesiAr || null;
                        finalBeszerzesiAr = beszerzesiAr;
                        if (!finalBeszerzesiAr && stockLevel.item) {
                            finalBeszerzesiAr = stockLevel.item.beszerzesiAr || 0;
                        }
                        return [4 /*yield*/, this.prisma.stockLot.create({
                                data: {
                                    itemId: data.itemId,
                                    warehouseId: data.warehouseId,
                                    sarzsGyartasiSzam: data.sarzsGyartasiSzam.trim(),
                                    mennyiseg: mennyiseg,
                                    beszerzesiAr: finalBeszerzesiAr || 0,
                                },
                            })];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [2 /*return*/, stockLevel];
                }
            });
        });
    };
    InventoryService.prototype.updateStockLevel = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.stockLevel.update({
                            where: { id: id },
                            data: data,
                            include: {
                                item: true,
                                warehouse: true,
                                location: true,
                            },
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    InventoryService.prototype.deleteStockLevel = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.stockLevel.delete({
                            where: { id: id },
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    InventoryService.prototype.generateInventorySheetPdf = function (warehouseId, res) {
        return __awaiter(this, void 0, void 0, function () {
            var warehouse, stockLevels, doc, tableTop, itemHeight, pageWidth, pageMargins, tableWidth, colWidths, y, _i, stockLevels_1, stock;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, this.prisma.warehouse.findUnique({
                            where: { id: warehouseId },
                        })];
                    case 1:
                        warehouse = _f.sent();
                        if (!warehouse) {
                            throw new Error('Raktár nem található');
                        }
                        return [4 /*yield*/, this.prisma.stockLevel.findMany({
                                where: { warehouseId: warehouseId },
                                include: {
                                    item: true,
                                    location: true,
                                },
                                orderBy: [
                                    { item: { nev: 'asc' } },
                                ],
                            })];
                    case 2:
                        stockLevels = _f.sent();
                        doc = new pdfkit_1.default({ margin: 50 });
                        // Set response headers
                        res.setHeader('Content-Type', 'application/pdf');
                        res.setHeader('Content-Disposition', "attachment; filename=\"leltar_".concat(warehouse.azonosito, "_").concat(new Date().toISOString().split('T')[0], ".pdf\""));
                        doc.pipe(res);
                        // Header
                        doc.fontSize(20).text('Leltár Ív', { align: 'center' });
                        doc.moveDown();
                        // Warehouse info
                        doc.fontSize(12);
                        doc.text("Rakt\u00E1r: ".concat(warehouse.nev), { align: 'left' });
                        doc.text("Azonos\u00EDt\u00F3: ".concat(warehouse.azonosito), { align: 'left' });
                        if (warehouse.cim) {
                            doc.text("C\u00EDm: ".concat(warehouse.cim), { align: 'left' });
                        }
                        doc.text("D\u00E1tum: ".concat(new Date().toLocaleDateString('hu-HU')), { align: 'left' });
                        doc.moveDown();
                        tableTop = doc.y;
                        itemHeight = 20;
                        pageWidth = doc.page.width;
                        pageMargins = doc.page.margins;
                        tableWidth = pageWidth - pageMargins.left - pageMargins.right;
                        colWidths = {
                            nev: tableWidth * 0.25,
                            azonosito: tableWidth * 0.15,
                            mennyiseg: tableWidth * 0.12,
                            hely: tableWidth * 0.15,
                            minimum: tableWidth * 0.11,
                            maximum: tableWidth * 0.11,
                            egyseg: tableWidth * 0.11,
                        };
                        y = tableTop;
                        // Header row
                        doc.fontSize(10).font('Helvetica-Bold');
                        doc.text('Terméknév', pageMargins.left, y, { width: colWidths.nev });
                        doc.text('Azonosító', pageMargins.left + colWidths.nev, y, { width: colWidths.azonosito });
                        doc.text('Készlet', pageMargins.left + colWidths.nev + colWidths.azonosito, y, { width: colWidths.mennyiseg });
                        doc.text('Hely', pageMargins.left + colWidths.nev + colWidths.azonosito + colWidths.mennyiseg, y, { width: colWidths.hely });
                        doc.text('Minimum', pageMargins.left + colWidths.nev + colWidths.azonosito + colWidths.mennyiseg + colWidths.hely, y, { width: colWidths.minimum });
                        doc.text('Maximum', pageMargins.left + colWidths.nev + colWidths.azonosito + colWidths.mennyiseg + colWidths.hely + colWidths.minimum, y, { width: colWidths.maximum });
                        doc.text('Egység', pageMargins.left + colWidths.nev + colWidths.azonosito + colWidths.mennyiseg + colWidths.hely + colWidths.minimum + colWidths.maximum, y, { width: colWidths.egyseg });
                        y += itemHeight;
                        doc.moveTo(pageMargins.left, y).lineTo(pageMargins.left + tableWidth, y).stroke();
                        y += 5;
                        // Data rows
                        doc.fontSize(9).font('Helvetica');
                        for (_i = 0, stockLevels_1 = stockLevels; _i < stockLevels_1.length; _i++) {
                            stock = stockLevels_1[_i];
                            if (y > doc.page.height - pageMargins.bottom - itemHeight) {
                                doc.addPage();
                                y = pageMargins.top;
                            }
                            doc.text(((_a = stock.item) === null || _a === void 0 ? void 0 : _a.nev) || '-', pageMargins.left, y, { width: colWidths.nev });
                            doc.text(((_b = stock.item) === null || _b === void 0 ? void 0 : _b.azonosito) || '-', pageMargins.left + colWidths.nev, y, { width: colWidths.azonosito });
                            doc.text(((_c = stock.mennyiseg) === null || _c === void 0 ? void 0 : _c.toLocaleString('hu-HU')) || '0', pageMargins.left + colWidths.nev + colWidths.azonosito, y, { width: colWidths.mennyiseg });
                            doc.text(((_d = stock.location) === null || _d === void 0 ? void 0 : _d.nev) || '-', pageMargins.left + colWidths.nev + colWidths.azonosito + colWidths.mennyiseg, y, { width: colWidths.hely });
                            doc.text(stock.minimum !== null && stock.minimum !== undefined ? stock.minimum.toLocaleString('hu-HU') : '-', pageMargins.left + colWidths.nev + colWidths.azonosito + colWidths.mennyiseg + colWidths.hely, y, { width: colWidths.minimum });
                            doc.text(stock.maximum !== null && stock.maximum !== undefined ? stock.maximum.toLocaleString('hu-HU') : '-', pageMargins.left + colWidths.nev + colWidths.azonosito + colWidths.mennyiseg + colWidths.hely + colWidths.minimum, y, { width: colWidths.maximum });
                            doc.text(((_e = stock.item) === null || _e === void 0 ? void 0 : _e.egyseg) || '-', pageMargins.left + colWidths.nev + colWidths.azonosito + colWidths.mennyiseg + colWidths.hely + colWidths.minimum + colWidths.maximum, y, { width: colWidths.egyseg });
                            y += itemHeight;
                        }
                        // Footer
                        doc.fontSize(8).font('Helvetica');
                        doc.text("\u00D6sszesen: ".concat(stockLevels.length, " t\u00E9tel"), pageMargins.left, doc.page.height - pageMargins.bottom - 20);
                        doc.end();
                        return [2 /*return*/];
                }
            });
        });
    };
    InventoryService.prototype.generateInventorySheetExcel = function (warehouseId, res) {
        return __awaiter(this, void 0, void 0, function () {
            var warehouse, stockLevels, workbook, worksheet, headerRow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.warehouse.findUnique({
                            where: { id: warehouseId },
                        })];
                    case 1:
                        warehouse = _a.sent();
                        if (!warehouse) {
                            throw new Error('Raktár nem található');
                        }
                        return [4 /*yield*/, this.prisma.stockLevel.findMany({
                                where: { warehouseId: warehouseId },
                                include: {
                                    item: true,
                                    location: true,
                                },
                                orderBy: [
                                    { item: { nev: 'asc' } },
                                ],
                            })];
                    case 2:
                        stockLevels = _a.sent();
                        workbook = new exceljs_1.default.Workbook();
                        worksheet = workbook.addWorksheet('Leltár Ív');
                        // Header
                        worksheet.mergeCells('A1:H1');
                        worksheet.getCell('A1').value = 'Leltár Ív';
                        worksheet.getCell('A1').font = { size: 16, bold: true };
                        worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
                        // Warehouse info
                        worksheet.getCell('A3').value = 'Raktár:';
                        worksheet.getCell('B3').value = warehouse.nev;
                        worksheet.getCell('A4').value = 'Azonosító:';
                        worksheet.getCell('B4').value = warehouse.azonosito;
                        if (warehouse.cim) {
                            worksheet.getCell('A5').value = 'Cím:';
                            worksheet.getCell('B5').value = warehouse.cim;
                        }
                        worksheet.getCell('A6').value = 'Dátum:';
                        worksheet.getCell('B6').value = new Date().toLocaleDateString('hu-HU');
                        headerRow = 8;
                        worksheet.getCell("A".concat(headerRow)).value = 'Terméknév';
                        worksheet.getCell("B".concat(headerRow)).value = 'Azonosító';
                        worksheet.getCell("C".concat(headerRow)).value = 'Készlet';
                        worksheet.getCell("D".concat(headerRow)).value = 'Hely';
                        worksheet.getCell("E".concat(headerRow)).value = 'Minimum';
                        worksheet.getCell("F".concat(headerRow)).value = 'Maximum';
                        worksheet.getCell("G".concat(headerRow)).value = 'Egység';
                        worksheet.getCell("H".concat(headerRow)).value = 'Beszerzési ár';
                        worksheet.getCell("I".concat(headerRow)).value = 'Eladási ár';
                        worksheet.getCell("J".concat(headerRow)).value = 'ÁFA kulcs';
                        worksheet.getCell("K".concat(headerRow)).value = 'Szavatossági idő (nap)';
                        // Style header
                        worksheet.getRow(headerRow).font = { bold: true };
                        worksheet.getRow(headerRow).fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFE0E0E0' },
                        };
                        // Data rows
                        stockLevels.forEach(function (stock, index) {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                            var row = headerRow + 1 + index;
                            worksheet.getCell("A".concat(row)).value = ((_a = stock.item) === null || _a === void 0 ? void 0 : _a.nev) || '-';
                            worksheet.getCell("B".concat(row)).value = ((_b = stock.item) === null || _b === void 0 ? void 0 : _b.azonosito) || '-';
                            worksheet.getCell("C".concat(row)).value = stock.mennyiseg || 0;
                            worksheet.getCell("C".concat(row)).numFmt = '#,##0.00';
                            worksheet.getCell("D".concat(row)).value = ((_c = stock.location) === null || _c === void 0 ? void 0 : _c.nev) || '-';
                            worksheet.getCell("E".concat(row)).value = stock.minimum !== null && stock.minimum !== undefined ? stock.minimum : '-';
                            if (stock.minimum !== null && stock.minimum !== undefined) {
                                worksheet.getCell("E".concat(row)).numFmt = '#,##0.00';
                            }
                            worksheet.getCell("F".concat(row)).value = stock.maximum !== null && stock.maximum !== undefined ? stock.maximum : '-';
                            if (stock.maximum !== null && stock.maximum !== undefined) {
                                worksheet.getCell("F".concat(row)).numFmt = '#,##0.00';
                            }
                            worksheet.getCell("G".concat(row)).value = ((_d = stock.item) === null || _d === void 0 ? void 0 : _d.egyseg) || '-';
                            worksheet.getCell("H".concat(row)).value = ((_e = stock.item) === null || _e === void 0 ? void 0 : _e.beszerzesiAr) || 0;
                            worksheet.getCell("H".concat(row)).numFmt = '#,##0';
                            worksheet.getCell("I".concat(row)).value = ((_f = stock.item) === null || _f === void 0 ? void 0 : _f.eladasiAr) || 0;
                            worksheet.getCell("I".concat(row)).numFmt = '#,##0';
                            worksheet.getCell("J".concat(row)).value = ((_g = stock.item) === null || _g === void 0 ? void 0 : _g.afaKulcs) || 0;
                            worksheet.getCell("J".concat(row)).numFmt = '0.00%';
                            worksheet.getCell("K".concat(row)).value = ((_h = stock.item) === null || _h === void 0 ? void 0 : _h.szavatossagiIdoNap) !== null && ((_j = stock.item) === null || _j === void 0 ? void 0 : _j.szavatossagiIdoNap) !== undefined ? stock.item.szavatossagiIdoNap : '-';
                        });
                        // Auto-fit columns
                        worksheet.columns.forEach(function (column) {
                            column.width = 15;
                        });
                        // Set response headers
                        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        res.setHeader('Content-Disposition', "attachment; filename=\"leltar_".concat(warehouse.azonosito, "_").concat(new Date().toISOString().split('T')[0], ".xlsx\""));
                        return [4 /*yield*/, workbook.xlsx.write(res)];
                    case 3:
                        _a.sent();
                        res.end();
                        return [2 /*return*/];
                }
            });
        });
    };
    InventoryService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService,
            settings_service_1.SystemSettingsService])
    ], InventoryService);
    return InventoryService;
}());
exports.InventoryService = InventoryService;
