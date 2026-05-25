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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryReportService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var inventory_service_1 = require("./inventory.service");
var pdfkit_1 = __importDefault(require("pdfkit"));
var exceljs_1 = __importDefault(require("exceljs"));
var InventoryReportService = /** @class */ (function () {
    function InventoryReportService(prisma, inventoryService) {
        this.prisma = prisma;
        this.inventoryService = inventoryService;
    }
    InventoryReportService.prototype.getReportData = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var stockFilters, stockLevels, data, filterDate_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        stockFilters = {};
                        if (filters === null || filters === void 0 ? void 0 : filters.warehouseId) {
                            stockFilters.warehouseId = filters.warehouseId;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.itemId) {
                            stockFilters.itemId = filters.itemId;
                        }
                        return [4 /*yield*/, this.inventoryService.findAllStockLevels(0, 10000, stockFilters)];
                    case 1:
                        stockLevels = _a.sent();
                        data = stockLevels.data;
                        // Filter by item group if provided
                        if (filters === null || filters === void 0 ? void 0 : filters.itemGroupId) {
                            data = data.filter(function (item) { var _a; return ((_a = item.item) === null || _a === void 0 ? void 0 : _a.itemGroupId) === filters.itemGroupId; });
                        }
                        // Filter low stock if requested
                        if (filters === null || filters === void 0 ? void 0 : filters.lowStockOnly) {
                            data = data.filter(function (item) { return item.lowStockFlag; });
                        }
                        // Filter by date if provided
                        if (filters === null || filters === void 0 ? void 0 : filters.date) {
                            filterDate_1 = new Date(filters.date);
                            data = data.filter(function (item) {
                                var itemDate = new Date(item.updatedAt);
                                return itemDate.toDateString() === filterDate_1.toDateString();
                            });
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    };
    InventoryReportService.prototype.getReportDataByItemGroup = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var stockLevels, groupedData, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getReportData(filters)];
                    case 1:
                        stockLevels = _a.sent();
                        groupedData = {};
                        stockLevels.forEach(function (level) {
                            var _a, _b, _c;
                            var groupId = ((_a = level.item) === null || _a === void 0 ? void 0 : _a.itemGroupId) || 'Nincs csoport';
                            var groupName = ((_c = (_b = level.item) === null || _b === void 0 ? void 0 : _b.itemGroup) === null || _c === void 0 ? void 0 : _c.nev) || 'Nincs csoport';
                            var key = "".concat(groupId, "|").concat(groupName);
                            if (!groupedData[key]) {
                                groupedData[key] = [];
                            }
                            groupedData[key].push(level);
                        });
                        result = Object.entries(groupedData).map(function (_a) {
                            var key = _a[0], items = _a[1];
                            var _b = key.split('|'), groupId = _b[0], groupName = _b[1];
                            var totalQuantity = items.reduce(function (sum, item) { return sum + (item.mennyiseg || 0); }, 0);
                            var totalValue = items.reduce(function (sum, item) { var _a; return sum + ((item.mennyiseg || 0) * (((_a = item.item) === null || _a === void 0 ? void 0 : _a.beszerzesiAr) || 0)); }, 0);
                            var itemCount = items.length;
                            return {
                                groupId: groupId === 'Nincs csoport' ? null : groupId,
                                groupName: groupName,
                                itemCount: itemCount,
                                totalQuantity: totalQuantity,
                                totalValue: totalValue,
                                items: items,
                            };
                        });
                        return [2 /*return*/, result];
                }
            });
        });
    };
    InventoryReportService.prototype.generatePDF = function (filters, res) {
        return __awaiter(this, void 0, void 0, function () {
            var data, warehouse, itemGroup;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getReportData(filters)];
                    case 1:
                        data = _a.sent();
                        warehouse = null;
                        if (!(filters === null || filters === void 0 ? void 0 : filters.warehouseId)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.prisma.warehouse.findUnique({
                                where: { id: filters.warehouseId },
                            })];
                    case 2:
                        warehouse = _a.sent();
                        _a.label = 3;
                    case 3:
                        itemGroup = null;
                        if (!(filters === null || filters === void 0 ? void 0 : filters.itemGroupId)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.prisma.itemGroup.findUnique({
                                where: { id: filters.itemGroupId },
                            })];
                    case 4:
                        itemGroup = _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, new Promise(function (resolve, reject) {
                            var doc = new pdfkit_1.default({ margin: 50 });
                            var chunks = [];
                            doc.on('data', function (chunk) { return chunks.push(chunk); });
                            doc.on('end', function () { return resolve(Buffer.concat(chunks)); });
                            doc.on('error', reject);
                            // Header
                            doc.fontSize(20).text('Leltárív', { align: 'center' });
                            doc.moveDown(0.5);
                            doc.fontSize(12);
                            doc.text("D\u00E1tum: ".concat(new Date().toLocaleDateString('hu-HU')), { align: 'left' });
                            if (warehouse) {
                                doc.text("Rakt\u00E1r: ".concat(warehouse.nev, " (").concat(warehouse.azonosito, ")"), { align: 'left' });
                            }
                            else {
                                doc.text('Raktár: Összes raktár', { align: 'left' });
                            }
                            if (itemGroup) {
                                doc.text("Cikkcsoport: ".concat(itemGroup.nev), { align: 'left' });
                            }
                            doc.moveDown();
                            // Table header
                            var tableTop = doc.y;
                            var tableLeft = 50;
                            var colWidths = [80, 150, 80, 60, 100, 70, 70, 60];
                            var rowHeight = 25;
                            doc.fontSize(10).font('Helvetica-Bold');
                            doc.text('Azonosító', tableLeft, tableTop);
                            doc.text('Név', tableLeft + colWidths[0], tableTop);
                            doc.text('Mennyiség', tableLeft + colWidths[0] + colWidths[1], tableTop);
                            doc.text('Egység', tableLeft + colWidths[0] + colWidths[1] + colWidths[2], tableTop);
                            doc.text('Raktári hely', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], tableTop);
                            doc.text('Minimum', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], tableTop);
                            doc.text('Maximum', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5], tableTop);
                            doc.text('Státusz', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5] + colWidths[6], tableTop);
                            // Draw header line
                            doc.moveTo(tableLeft, tableTop + 15).lineTo(tableLeft + colWidths.reduce(function (a, b) { return a + b; }, 0), tableTop + 15).stroke();
                            // Table rows
                            doc.font('Helvetica').fontSize(9);
                            var y = tableTop + rowHeight;
                            var totalQuantity = 0;
                            var lowStockCount = 0;
                            data.forEach(function (item) {
                                var _a, _b, _c, _d, _e, _f;
                                if (y > 750) {
                                    // New page
                                    doc.addPage();
                                    y = 50;
                                }
                                totalQuantity += item.mennyiseg;
                                if (item.lowStockFlag) {
                                    lowStockCount++;
                                }
                                doc.text(((_a = item.item) === null || _a === void 0 ? void 0 : _a.azonosito) || '-', tableLeft, y);
                                doc.text(((_b = item.item) === null || _b === void 0 ? void 0 : _b.nev) || '-', tableLeft + colWidths[0], y, { width: colWidths[1] });
                                doc.text(item.mennyiseg.toString(), tableLeft + colWidths[0] + colWidths[1], y, { align: 'right' });
                                doc.text(((_c = item.item) === null || _c === void 0 ? void 0 : _c.egyseg) || '-', tableLeft + colWidths[0] + colWidths[1] + colWidths[2], y);
                                doc.text(((_d = item.location) === null || _d === void 0 ? void 0 : _d.nev) || '-', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], y, { width: colWidths[4] });
                                doc.text(((_e = item.minimum) === null || _e === void 0 ? void 0 : _e.toString()) || '-', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], y, { align: 'right' });
                                doc.text(((_f = item.maximum) === null || _f === void 0 ? void 0 : _f.toString()) || '-', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5], y, { align: 'right' });
                                doc.text(item.lowStockFlag ? 'Alacsony' : 'Normál', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5] + colWidths[6], y);
                                y += rowHeight;
                            });
                            // Footer
                            doc.moveDown(2);
                            doc.fontSize(10).font('Helvetica-Bold');
                            doc.text("\u00D6sszes\u00EDtett mennyis\u00E9g: ".concat(totalQuantity), { align: 'left' });
                            doc.text("Alacsony k\u00E9szlet\u0171 t\u00E9telek sz\u00E1ma: ".concat(lowStockCount), { align: 'left' });
                            doc.end();
                        })];
                }
            });
        });
    };
    InventoryReportService.prototype.generateCSV = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var data, csv;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getReportData(filters)];
                    case 1:
                        data = _a.sent();
                        csv = '\uFEFF';
                        csv += 'Azonosító,Név,Mennyiség,Egység,Raktár,Raktári hely,Minimum,Maximum,Státusz\n';
                        data.forEach(function (item) {
                            var _a, _b, _c, _d, _e, _f, _g;
                            var row = [
                                ((_a = item.item) === null || _a === void 0 ? void 0 : _a.azonosito) || '',
                                "\"".concat((((_b = item.item) === null || _b === void 0 ? void 0 : _b.nev) || '').replace(/"/g, '""'), "\""),
                                item.mennyiseg.toString(),
                                ((_c = item.item) === null || _c === void 0 ? void 0 : _c.egyseg) || '',
                                ((_d = item.warehouse) === null || _d === void 0 ? void 0 : _d.nev) || '',
                                ((_e = item.location) === null || _e === void 0 ? void 0 : _e.nev) || '',
                                ((_f = item.minimum) === null || _f === void 0 ? void 0 : _f.toString()) || '',
                                ((_g = item.maximum) === null || _g === void 0 ? void 0 : _g.toString()) || '',
                                item.lowStockFlag ? 'Alacsony' : 'Normál',
                            ];
                            csv += row.join(',') + '\n';
                        });
                        return [2 /*return*/, csv];
                }
            });
        });
    };
    InventoryReportService.prototype.generateExcel = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var data, workbook, worksheet, totalRow, lowStockRow, buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getReportData(filters)];
                    case 1:
                        data = _a.sent();
                        workbook = new exceljs_1.default.Workbook();
                        worksheet = workbook.addWorksheet('Leltárív');
                        // Header row
                        worksheet.columns = [
                            { header: 'Azonosító', key: 'azonosito', width: 15 },
                            { header: 'Név', key: 'nev', width: 30 },
                            { header: 'Mennyiség', key: 'mennyiseg', width: 12 },
                            { header: 'Egység', key: 'egyseg', width: 10 },
                            { header: 'Raktár', key: 'raktar', width: 20 },
                            { header: 'Raktári hely', key: 'hely', width: 20 },
                            { header: 'Minimum', key: 'minimum', width: 12 },
                            { header: 'Maximum', key: 'maximum', width: 12 },
                            { header: 'Státusz', key: 'status', width: 12 },
                        ];
                        // Style header
                        worksheet.getRow(1).font = { bold: true };
                        worksheet.getRow(1).fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFD3D3D3' },
                        };
                        // Add data rows
                        data.forEach(function (item) {
                            var _a, _b, _c, _d, _e;
                            worksheet.addRow({
                                azonosito: ((_a = item.item) === null || _a === void 0 ? void 0 : _a.azonosito) || '',
                                nev: ((_b = item.item) === null || _b === void 0 ? void 0 : _b.nev) || '',
                                mennyiseg: item.mennyiseg,
                                egyseg: ((_c = item.item) === null || _c === void 0 ? void 0 : _c.egyseg) || '',
                                raktar: ((_d = item.warehouse) === null || _d === void 0 ? void 0 : _d.nev) || '',
                                hely: ((_e = item.location) === null || _e === void 0 ? void 0 : _e.nev) || '',
                                minimum: item.minimum || '',
                                maximum: item.maximum || '',
                                status: item.lowStockFlag ? 'Alacsony' : 'Normál',
                            });
                        });
                        totalRow = worksheet.addRow({});
                        totalRow.getCell(1).value = 'Összesített mennyiség:';
                        totalRow.getCell(2).value = data.reduce(function (sum, item) { return sum + item.mennyiseg; }, 0);
                        totalRow.getCell(1).font = { bold: true };
                        totalRow.getCell(2).font = { bold: true };
                        lowStockRow = worksheet.addRow({});
                        lowStockRow.getCell(1).value = 'Alacsony készletű tételek száma:';
                        lowStockRow.getCell(2).value = data.filter(function (item) { return item.lowStockFlag; }).length;
                        lowStockRow.getCell(1).font = { bold: true };
                        lowStockRow.getCell(2).font = { bold: true };
                        return [4 /*yield*/, workbook.xlsx.writeBuffer()];
                    case 2:
                        buffer = _a.sent();
                        return [2 /*return*/, Buffer.from(buffer)];
                }
            });
        });
    };
    InventoryReportService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService,
            inventory_service_1.InventoryService])
    ], InventoryReportService);
    return InventoryReportService;
}());
exports.InventoryReportService = InventoryReportService;
