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
exports.PriceListService = exports.UpdatePriceListItemDto = exports.AddPriceListItemDto = exports.UpdatePriceListDto = exports.CreatePriceListDto = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var create_price_list_dto_1 = require("./dto/create-price-list.dto");
Object.defineProperty(exports, "CreatePriceListDto", { enumerable: true, get: function () { return create_price_list_dto_1.CreatePriceListDto; } });
var update_price_list_dto_1 = require("./dto/update-price-list.dto");
Object.defineProperty(exports, "UpdatePriceListDto", { enumerable: true, get: function () { return update_price_list_dto_1.UpdatePriceListDto; } });
var add_price_list_item_dto_1 = require("./dto/add-price-list-item.dto");
Object.defineProperty(exports, "AddPriceListItemDto", { enumerable: true, get: function () { return add_price_list_item_dto_1.AddPriceListItemDto; } });
var update_price_list_item_dto_1 = require("./dto/update-price-list-item.dto");
Object.defineProperty(exports, "UpdatePriceListItemDto", { enumerable: true, get: function () { return update_price_list_item_dto_1.UpdatePriceListItemDto; } });
var exceljs_1 = __importDefault(require("exceljs"));
var PriceListService = /** @class */ (function () {
    function PriceListService(prisma) {
        this.prisma = prisma;
    }
    PriceListService.prototype.findAll = function () {
        return __awaiter(this, arguments, void 0, function (skip, take, filters) {
            var where, _a, total, items;
            if (skip === void 0) { skip = 0; }
            if (take === void 0) { take = 50; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        where = {};
                        if (filters === null || filters === void 0 ? void 0 : filters.supplierId) {
                            where.supplierId = filters.supplierId;
                        }
                        if ((filters === null || filters === void 0 ? void 0 : filters.aktiv) !== undefined) {
                            where.aktiv = filters.aktiv;
                        }
                        return [4 /*yield*/, Promise.all([
                                this.prisma.priceList.count({ where: where }),
                                this.prisma.priceList.findMany({
                                    where: where,
                                    skip: skip,
                                    take: take,
                                    include: {
                                        supplier: {
                                            select: {
                                                id: true,
                                                nev: true,
                                            },
                                        },
                                        _count: {
                                            select: {
                                                items: true,
                                            },
                                        },
                                    },
                                    orderBy: {
                                        createdAt: 'desc',
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
    PriceListService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var priceList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.priceList.findUnique({
                            where: { id: id },
                            include: {
                                supplier: true,
                                items: {
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
                                    orderBy: {
                                        item: {
                                            nev: 'asc',
                                        },
                                    },
                                },
                            },
                        })];
                    case 1:
                        priceList = _a.sent();
                        if (!priceList) {
                            throw new common_1.NotFoundException('Árlista nem található');
                        }
                        return [2 /*return*/, priceList];
                }
            });
        });
    };
    PriceListService.prototype.create = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var supplier;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Debug logging
                        console.log('PriceListService.create - received dto:', JSON.stringify(dto, null, 2));
                        console.log('PriceListService.create - dto.supplierId:', dto.supplierId);
                        console.log('PriceListService.create - typeof dto.supplierId:', typeof dto.supplierId);
                        // Validate supplierId - check for undefined, null, or empty string
                        if (!dto.supplierId || (typeof dto.supplierId === 'string' && dto.supplierId.trim() === '')) {
                            console.log('PriceListService.create - validation failed, supplierId is empty');
                            throw new common_1.BadRequestException('Szállító megadása kötelező');
                        }
                        return [4 /*yield*/, this.prisma.supplier.findUnique({
                                where: { id: dto.supplierId },
                            })];
                    case 1:
                        supplier = _a.sent();
                        if (!supplier) {
                            throw new common_1.NotFoundException('Szállító nem található');
                        }
                        return [2 /*return*/, this.prisma.priceList.create({
                                data: {
                                    supplierId: dto.supplierId,
                                    nev: dto.nev,
                                    ervenyessegKezdet: new Date(dto.ervenyessegKezdet),
                                    ervenyessegVeg: dto.ervenyessegVeg ? new Date(dto.ervenyessegVeg) : null,
                                    aktiv: dto.aktiv !== undefined ? dto.aktiv : true,
                                },
                                include: {
                                    supplier: true,
                                },
                            })];
                }
            });
        });
    };
    PriceListService.prototype.update = function (id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var priceList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        priceList = _a.sent();
                        return [2 /*return*/, this.prisma.priceList.update({
                                where: { id: id },
                                data: {
                                    nev: dto.nev !== undefined ? dto.nev : priceList.nev,
                                    ervenyessegKezdet: dto.ervenyessegKezdet ? new Date(dto.ervenyessegKezdet) : priceList.ervenyessegKezdet,
                                    ervenyessegVeg: dto.ervenyessegVeg !== undefined ? (dto.ervenyessegVeg ? new Date(dto.ervenyessegVeg) : null) : priceList.ervenyessegVeg,
                                    aktiv: dto.aktiv !== undefined ? dto.aktiv : priceList.aktiv,
                                },
                                include: {
                                    supplier: true,
                                },
                            })];
                }
            });
        });
    };
    PriceListService.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var priceList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        priceList = _a.sent();
                        return [2 /*return*/, this.prisma.priceList.delete({
                                where: { id: id },
                            })];
                }
            });
        });
    };
    PriceListService.prototype.addItem = function (priceListId, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var priceList, item, existingItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(priceListId)];
                    case 1:
                        priceList = _a.sent();
                        return [4 /*yield*/, this.prisma.item.findUnique({
                                where: { id: dto.itemId },
                            })];
                    case 2:
                        item = _a.sent();
                        if (!item) {
                            throw new common_1.NotFoundException('Áru nem található');
                        }
                        return [4 /*yield*/, this.prisma.priceListItem.findUnique({
                                where: {
                                    priceListId_itemId: {
                                        priceListId: priceListId,
                                        itemId: dto.itemId,
                                    },
                                },
                            })];
                    case 3:
                        existingItem = _a.sent();
                        if (existingItem) {
                            throw new common_1.BadRequestException('Az áru már szerepel az árlistában');
                        }
                        return [2 /*return*/, this.prisma.priceListItem.create({
                                data: {
                                    priceListId: priceListId,
                                    itemId: dto.itemId,
                                    ar: dto.ar,
                                    valuta: dto.valuta || 'HUF',
                                },
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
                            })];
                }
            });
        });
    };
    PriceListService.prototype.updateItem = function (priceListId, itemId, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var priceListItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.priceListItem.findUnique({
                            where: {
                                priceListId_itemId: {
                                    priceListId: priceListId,
                                    itemId: itemId,
                                },
                            },
                        })];
                    case 1:
                        priceListItem = _a.sent();
                        if (!priceListItem) {
                            throw new common_1.NotFoundException('Árlista tétel nem található');
                        }
                        return [2 /*return*/, this.prisma.priceListItem.update({
                                where: {
                                    priceListId_itemId: {
                                        priceListId: priceListId,
                                        itemId: itemId,
                                    },
                                },
                                data: {
                                    ar: dto.ar !== undefined ? dto.ar : priceListItem.ar,
                                    valuta: dto.valuta !== undefined ? dto.valuta : priceListItem.valuta,
                                },
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
                            })];
                }
            });
        });
    };
    PriceListService.prototype.removeItem = function (priceListId, itemId) {
        return __awaiter(this, void 0, void 0, function () {
            var priceListItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.priceListItem.findUnique({
                            where: {
                                priceListId_itemId: {
                                    priceListId: priceListId,
                                    itemId: itemId,
                                },
                            },
                        })];
                    case 1:
                        priceListItem = _a.sent();
                        if (!priceListItem) {
                            throw new common_1.NotFoundException('Árlista tétel nem található');
                        }
                        return [2 /*return*/, this.prisma.priceListItem.delete({
                                where: {
                                    priceListId_itemId: {
                                        priceListId: priceListId,
                                        itemId: itemId,
                                    },
                                },
                            })];
                }
            });
        });
    };
    PriceListService.prototype.importFromExcel = function (priceListId, file) {
        return __awaiter(this, void 0, void 0, function () {
            var priceList, workbook, errors, success, worksheet, rows, _i, _a, row, itemAzonosito, arValue, valuta, ar, item, existingItem, error_1;
            var _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, this.findOne(priceListId)];
                    case 1:
                        priceList = _f.sent();
                        workbook = new exceljs_1.default.Workbook();
                        errors = [];
                        success = 0;
                        return [4 /*yield*/, workbook.xlsx.load(file.buffer)];
                    case 2:
                        _f.sent();
                        worksheet = workbook.getWorksheet(1);
                        if (!worksheet) {
                            throw new common_1.BadRequestException('Az Excel fájl nem tartalmaz munkalapot');
                        }
                        rows = worksheet.getRows(2, worksheet.rowCount);
                        _i = 0, _a = rows || [];
                        _f.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3 /*break*/, 13];
                        row = _a[_i];
                        _f.label = 4;
                    case 4:
                        _f.trys.push([4, 11, , 12]);
                        itemAzonosito = (_c = (_b = row.getCell(1).value) === null || _b === void 0 ? void 0 : _b.toString()) === null || _c === void 0 ? void 0 : _c.trim();
                        arValue = row.getCell(2).value;
                        valuta = ((_e = (_d = row.getCell(3).value) === null || _d === void 0 ? void 0 : _d.toString()) === null || _e === void 0 ? void 0 : _e.trim()) || 'HUF';
                        if (!itemAzonosito || !arValue) {
                            return [3 /*break*/, 12]; // Skip empty rows
                        }
                        ar = typeof arValue === 'number' ? arValue : parseFloat(arValue.toString());
                        if (isNaN(ar)) {
                            errors.push("Sor ".concat(row.number, ": \u00C9rv\u00E9nytelen \u00E1r \u00E9rt\u00E9k"));
                            return [3 /*break*/, 12];
                        }
                        return [4 /*yield*/, this.prisma.item.findUnique({
                                where: { azonosito: itemAzonosito },
                            })];
                    case 5:
                        item = _f.sent();
                        if (!item) {
                            errors.push("Sor ".concat(row.number, ": Cikk nem tal\u00E1lhat\u00F3 azonos\u00EDt\u00F3val: ").concat(itemAzonosito));
                            return [3 /*break*/, 12];
                        }
                        return [4 /*yield*/, this.prisma.priceListItem.findUnique({
                                where: {
                                    priceListId_itemId: {
                                        priceListId: priceListId,
                                        itemId: item.id,
                                    },
                                },
                            })];
                    case 6:
                        existingItem = _f.sent();
                        if (!existingItem) return [3 /*break*/, 8];
                        // Update existing item
                        return [4 /*yield*/, this.prisma.priceListItem.update({
                                where: {
                                    priceListId_itemId: {
                                        priceListId: priceListId,
                                        itemId: item.id,
                                    },
                                },
                                data: {
                                    ar: ar,
                                    valuta: valuta,
                                },
                            })];
                    case 7:
                        // Update existing item
                        _f.sent();
                        return [3 /*break*/, 10];
                    case 8: 
                    // Create new item
                    return [4 /*yield*/, this.prisma.priceListItem.create({
                            data: {
                                priceListId: priceListId,
                                itemId: item.id,
                                ar: ar,
                                valuta: valuta,
                            },
                        })];
                    case 9:
                        // Create new item
                        _f.sent();
                        _f.label = 10;
                    case 10:
                        success++;
                        return [3 /*break*/, 12];
                    case 11:
                        error_1 = _f.sent();
                        errors.push("Sor ".concat(row.number, ": ").concat(error_1.message));
                        return [3 /*break*/, 12];
                    case 12:
                        _i++;
                        return [3 /*break*/, 3];
                    case 13: return [2 /*return*/, { success: success, errors: errors }];
                }
            });
        });
    };
    PriceListService.prototype.exportToExcel = function (priceListId) {
        return __awaiter(this, void 0, void 0, function () {
            var priceList, workbook, worksheet, infoRow, headerRow, buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(priceListId)];
                    case 1:
                        priceList = _a.sent();
                        workbook = new exceljs_1.default.Workbook();
                        worksheet = workbook.addWorksheet('Árlista');
                        // Header
                        worksheet.mergeCells('A1:D1');
                        worksheet.getCell('A1').value = priceList.nev;
                        worksheet.getCell('A1').font = { size: 16, bold: true };
                        worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
                        infoRow = 3;
                        worksheet.getCell("A".concat(infoRow)).value = 'Szállító:';
                        worksheet.getCell("B".concat(infoRow)).value = priceList.supplier.nev;
                        infoRow++;
                        worksheet.getCell("A".concat(infoRow)).value = 'Érvényesség kezdete:';
                        worksheet.getCell("B".concat(infoRow)).value = new Date(priceList.ervenyessegKezdet).toLocaleDateString('hu-HU');
                        infoRow++;
                        if (priceList.ervenyessegVeg) {
                            worksheet.getCell("A".concat(infoRow)).value = 'Érvényesség vége:';
                            worksheet.getCell("B".concat(infoRow)).value = new Date(priceList.ervenyessegVeg).toLocaleDateString('hu-HU');
                            infoRow++;
                        }
                        worksheet.getCell("A".concat(infoRow)).value = 'Állapot:';
                        worksheet.getCell("B".concat(infoRow)).value = priceList.aktiv ? 'Aktív' : 'Inaktív';
                        infoRow++;
                        headerRow = infoRow + 1;
                        worksheet.getCell("A".concat(headerRow)).value = 'Cikk azonosító';
                        worksheet.getCell("B".concat(headerRow)).value = 'Cikk név';
                        worksheet.getCell("C".concat(headerRow)).value = 'Ár';
                        worksheet.getCell("D".concat(headerRow)).value = 'Valuta';
                        // Style header
                        worksheet.getRow(headerRow).font = { bold: true };
                        worksheet.getRow(headerRow).fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFE0E0E0' },
                        };
                        worksheet.getRow(headerRow).eachCell(function (cell) {
                            cell.border = {
                                top: { style: 'thin' },
                                left: { style: 'thin' },
                                bottom: { style: 'thin' },
                                right: { style: 'thin' },
                            };
                        });
                        // Data rows
                        priceList.items.forEach(function (item, index) {
                            var row = headerRow + 1 + index;
                            worksheet.getCell("A".concat(row)).value = item.item.azonosito;
                            worksheet.getCell("B".concat(row)).value = item.item.nev;
                            worksheet.getCell("C".concat(row)).value = item.ar;
                            worksheet.getCell("C".concat(row)).numFmt = '#,##0';
                            worksheet.getCell("D".concat(row)).value = item.valuta;
                            // Add borders to data rows
                            worksheet.getRow(row).eachCell(function (cell) {
                                cell.border = {
                                    top: { style: 'thin' },
                                    left: { style: 'thin' },
                                    bottom: { style: 'thin' },
                                    right: { style: 'thin' },
                                };
                            });
                        });
                        // Auto-fit columns
                        worksheet.columns.forEach(function (column) {
                            var maxLength = 0;
                            column.eachCell({ includeEmpty: true }, function (cell) {
                                var columnLength = cell.value ? cell.value.toString().length : 0;
                                if (columnLength > maxLength) {
                                    maxLength = columnLength;
                                }
                            });
                            column.width = maxLength < 10 ? 10 : maxLength + 2;
                        });
                        return [4 /*yield*/, workbook.xlsx.writeBuffer()];
                    case 2:
                        buffer = _a.sent();
                        return [2 /*return*/, Buffer.from(buffer)];
                }
            });
        });
    };
    PriceListService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], PriceListService);
    return PriceListService;
}());
exports.PriceListService = PriceListService;
