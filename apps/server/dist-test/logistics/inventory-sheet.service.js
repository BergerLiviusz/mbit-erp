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
exports.InventorySheetService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var pdfkit_1 = __importDefault(require("pdfkit"));
var exceljs_1 = __importDefault(require("exceljs"));
var InventorySheetService = /** @class */ (function () {
    function InventorySheetService(prisma) {
        this.prisma = prisma;
    }
    InventorySheetService.prototype.generateSheetNumber = function () {
        return __awaiter(this, void 0, void 0, function () {
            var year, count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        year = new Date().getFullYear();
                        return [4 /*yield*/, this.prisma.inventorySheet.count({
                                where: {
                                    azonosito: {
                                        startsWith: "L-".concat(year, "-"),
                                    },
                                },
                            })];
                    case 1:
                        count = _a.sent();
                        return [2 /*return*/, "L-".concat(year, "-").concat(String(count + 1).padStart(5, '0'))];
                }
            });
        });
    };
    InventorySheetService.prototype.findAll = function () {
        return __awaiter(this, arguments, void 0, function (skip, take, filters) {
            var where, _a, total, items;
            if (skip === void 0) { skip = 0; }
            if (take === void 0) { take = 50; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        where = {};
                        if (filters === null || filters === void 0 ? void 0 : filters.warehouseId) {
                            where.warehouseId = filters.warehouseId;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.allapot) {
                            where.allapot = filters.allapot;
                        }
                        return [4 /*yield*/, Promise.all([
                                this.prisma.inventorySheet.count({ where: where }),
                                this.prisma.inventorySheet.findMany({
                                    where: where,
                                    skip: skip,
                                    take: take,
                                    include: {
                                        warehouse: {
                                            select: {
                                                id: true,
                                                nev: true,
                                                azonosito: true,
                                            },
                                        },
                                        createdBy: {
                                            select: {
                                                id: true,
                                                nev: true,
                                                email: true,
                                            },
                                        },
                                        approvedBy: {
                                            select: {
                                                id: true,
                                                nev: true,
                                                email: true,
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
    InventorySheetService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var sheet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.inventorySheet.findUnique({
                            where: { id: id },
                            include: {
                                warehouse: true,
                                createdBy: {
                                    select: {
                                        id: true,
                                        nev: true,
                                        email: true,
                                    },
                                },
                                approvedBy: {
                                    select: {
                                        id: true,
                                        nev: true,
                                        email: true,
                                    },
                                },
                                items: {
                                    include: {
                                        item: true,
                                        location: true,
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
                        sheet = _a.sent();
                        if (!sheet) {
                            throw new common_1.NotFoundException('Leltárív nem található');
                        }
                        return [2 /*return*/, sheet];
                }
            });
        });
    };
    InventorySheetService.prototype.create = function (dto, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var warehouse, azonosito, whereClause, stockLevels, sheet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.warehouse.findUnique({
                            where: { id: dto.warehouseId },
                        })];
                    case 1:
                        warehouse = _a.sent();
                        if (!warehouse) {
                            throw new common_1.NotFoundException('Raktár nem található');
                        }
                        return [4 /*yield*/, this.generateSheetNumber()];
                    case 2:
                        azonosito = _a.sent();
                        whereClause = { warehouseId: dto.warehouseId };
                        // If itemIds are provided, filter by them (partial inventory)
                        if (dto.itemIds && dto.itemIds.length > 0) {
                            whereClause.itemId = { in: dto.itemIds };
                        }
                        return [4 /*yield*/, this.prisma.stockLevel.findMany({
                                where: whereClause,
                                include: {
                                    item: true,
                                    location: true,
                                },
                            })];
                    case 3:
                        stockLevels = _a.sent();
                        return [4 /*yield*/, this.prisma.inventorySheet.create({
                                data: {
                                    warehouseId: dto.warehouseId,
                                    azonosito: azonosito,
                                    leltarDatum: dto.leltarDatum ? new Date(dto.leltarDatum) : new Date(),
                                    megjegyzesek: dto.megjegyzesek,
                                    createdById: userId,
                                    allapot: 'NYITOTT',
                                    items: {
                                        create: stockLevels.map(function (stock) { return ({
                                            itemId: stock.itemId,
                                            locationId: stock.locationId,
                                            konyvKeszlet: stock.mennyiseg,
                                            tenylegesKeszlet: null,
                                            kulonbseg: null,
                                        }); }),
                                    },
                                },
                                include: {
                                    warehouse: true,
                                    createdBy: {
                                        select: {
                                            id: true,
                                            nev: true,
                                            email: true,
                                        },
                                    },
                                    items: {
                                        include: {
                                            item: true,
                                            location: true,
                                        },
                                    },
                                },
                            })];
                    case 4:
                        sheet = _a.sent();
                        return [2 /*return*/, sheet];
                }
            });
        });
    };
    InventorySheetService.prototype.update = function (id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var sheet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        sheet = _a.sent();
                        if (sheet.allapot === 'LEZARVA') {
                            throw new common_1.BadRequestException('Lezárt leltárív nem módosítható');
                        }
                        return [2 /*return*/, this.prisma.inventorySheet.update({
                                where: { id: id },
                                data: dto,
                                include: {
                                    warehouse: true,
                                    createdBy: {
                                        select: {
                                            id: true,
                                            nev: true,
                                            email: true,
                                        },
                                    },
                                    items: {
                                        include: {
                                            item: true,
                                            location: true,
                                        },
                                    },
                                },
                            })];
                }
            });
        });
    };
    InventorySheetService.prototype.addItem = function (sheetId, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var sheet, stockLevel, kulonbseg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(sheetId)];
                    case 1:
                        sheet = _a.sent();
                        if (sheet.allapot === 'LEZARVA' || sheet.allapot === 'JOVAHAGYVA') {
                            throw new common_1.BadRequestException('Ez a leltárív már nem módosítható');
                        }
                        return [4 /*yield*/, this.prisma.stockLevel.findFirst({
                                where: {
                                    itemId: dto.itemId,
                                    warehouseId: sheet.warehouseId,
                                    locationId: dto.locationId || null,
                                },
                            })];
                    case 2:
                        stockLevel = _a.sent();
                        if (!stockLevel) {
                            throw new common_1.NotFoundException('Készletszint nem található');
                        }
                        kulonbseg = dto.tenylegesKeszlet - stockLevel.mennyiseg;
                        return [2 /*return*/, this.prisma.inventorySheetItem.create({
                                data: {
                                    inventorySheetId: sheetId,
                                    itemId: dto.itemId,
                                    locationId: dto.locationId || null,
                                    konyvKeszlet: stockLevel.mennyiseg,
                                    tenylegesKeszlet: dto.tenylegesKeszlet,
                                    kulonbseg: kulonbseg,
                                    megjegyzesek: dto.megjegyzesek,
                                },
                                include: {
                                    item: true,
                                    location: true,
                                },
                            })];
                }
            });
        });
    };
    InventorySheetService.prototype.updateItem = function (sheetId, itemId, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var sheet, sheetItem, tenylegesKeszlet, kulonbseg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(sheetId)];
                    case 1:
                        sheet = _a.sent();
                        if (sheet.allapot === 'LEZARVA' || sheet.allapot === 'JOVAHAGYVA') {
                            throw new common_1.BadRequestException('Ez a leltárív már nem módosítható');
                        }
                        return [4 /*yield*/, this.prisma.inventorySheetItem.findFirst({
                                where: {
                                    inventorySheetId: sheetId,
                                    itemId: itemId,
                                },
                            })];
                    case 2:
                        sheetItem = _a.sent();
                        if (!sheetItem) {
                            throw new common_1.NotFoundException('Leltárív tétel nem található');
                        }
                        tenylegesKeszlet = dto.tenylegesKeszlet !== undefined ? dto.tenylegesKeszlet : sheetItem.tenylegesKeszlet;
                        kulonbseg = tenylegesKeszlet !== null ? tenylegesKeszlet - sheetItem.konyvKeszlet : null;
                        return [2 /*return*/, this.prisma.inventorySheetItem.update({
                                where: { id: sheetItem.id },
                                data: {
                                    tenylegesKeszlet: dto.tenylegesKeszlet !== undefined ? dto.tenylegesKeszlet : undefined,
                                    kulonbseg: kulonbseg,
                                    megjegyzesek: dto.megjegyzesek !== undefined ? dto.megjegyzesek : undefined,
                                },
                                include: {
                                    item: true,
                                    location: true,
                                },
                            })];
                }
            });
        });
    };
    InventorySheetService.prototype.approve = function (sheetId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var sheet, _i, _a, item, stockLevel;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.findOne(sheetId)];
                    case 1:
                        sheet = _b.sent();
                        if (sheet.allapot !== 'BEFEJEZETT') {
                            throw new common_1.BadRequestException('Csak befejezett leltárív jóváhagyható');
                        }
                        _i = 0, _a = sheet.items;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        item = _a[_i];
                        if (!(item.tenylegesKeszlet !== null && item.kulonbseg !== null && item.kulonbseg !== 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.prisma.stockLevel.findFirst({
                                where: {
                                    itemId: item.itemId,
                                    warehouseId: sheet.warehouseId,
                                    locationId: item.locationId || null,
                                },
                            })];
                    case 3:
                        stockLevel = _b.sent();
                        if (!stockLevel) return [3 /*break*/, 6];
                        // Update stock level
                        return [4 /*yield*/, this.prisma.stockLevel.update({
                                where: { id: stockLevel.id },
                                data: {
                                    mennyiseg: item.tenylegesKeszlet,
                                },
                            })];
                    case 4:
                        // Update stock level
                        _b.sent();
                        // Create stock move for audit trail
                        return [4 /*yield*/, this.prisma.stockMove.create({
                                data: {
                                    itemId: item.itemId,
                                    warehouseId: sheet.warehouseId,
                                    tipus: 'LELTAR_KORREKCIO',
                                    mennyiseg: item.kulonbseg,
                                    megjegyzesek: "Lelt\u00E1r\u00EDv korrekci\u00F3: ".concat(sheet.azonosito),
                                },
                            })];
                    case 5:
                        // Create stock move for audit trail
                        _b.sent();
                        _b.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7: 
                    // Update sheet status
                    return [2 /*return*/, this.prisma.inventorySheet.update({
                            where: { id: sheetId },
                            data: {
                                allapot: 'JOVAHAGYVA',
                                approvedById: userId,
                            },
                            include: {
                                warehouse: true,
                                createdBy: {
                                    select: {
                                        id: true,
                                        nev: true,
                                        email: true,
                                    },
                                },
                                approvedBy: {
                                    select: {
                                        id: true,
                                        nev: true,
                                        email: true,
                                    },
                                },
                                items: {
                                    include: {
                                        item: true,
                                        location: true,
                                    },
                                },
                            },
                        })];
                }
            });
        });
    };
    InventorySheetService.prototype.close = function (sheetId) {
        return __awaiter(this, void 0, void 0, function () {
            var sheet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(sheetId)];
                    case 1:
                        sheet = _a.sent();
                        if (sheet.allapot !== 'JOVAHAGYVA') {
                            throw new common_1.BadRequestException('Csak jóváhagyott leltárív zárható le');
                        }
                        return [2 /*return*/, this.prisma.inventorySheet.update({
                                where: { id: sheetId },
                                data: {
                                    allapot: 'LEZARVA',
                                },
                                include: {
                                    warehouse: true,
                                    createdBy: {
                                        select: {
                                            id: true,
                                            nev: true,
                                            email: true,
                                        },
                                    },
                                    approvedBy: {
                                        select: {
                                            id: true,
                                            nev: true,
                                            email: true,
                                        },
                                    },
                                    items: {
                                        include: {
                                            item: true,
                                            location: true,
                                        },
                                    },
                                },
                            })];
                }
            });
        });
    };
    InventorySheetService.prototype.revertApproval = function (sheetId) {
        return __awaiter(this, void 0, void 0, function () {
            var sheet, _i, _a, item, stockLevel;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.findOne(sheetId)];
                    case 1:
                        sheet = _b.sent();
                        if (sheet.allapot !== 'JOVAHAGYVA') {
                            throw new common_1.BadRequestException('Csak jóváhagyott leltárív jóváhagyása vonható vissza');
                        }
                        _i = 0, _a = sheet.items;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        item = _a[_i];
                        if (!(item.tenylegesKeszlet !== null && item.kulonbseg !== null && item.kulonbseg !== 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.prisma.stockLevel.findFirst({
                                where: {
                                    itemId: item.itemId,
                                    warehouseId: sheet.warehouseId,
                                    locationId: item.locationId || null,
                                },
                            })];
                    case 3:
                        stockLevel = _b.sent();
                        if (!stockLevel) return [3 /*break*/, 6];
                        // Revert to original stock level (konyvKeszlet)
                        return [4 /*yield*/, this.prisma.stockLevel.update({
                                where: { id: stockLevel.id },
                                data: {
                                    mennyiseg: item.konyvKeszlet,
                                },
                            })];
                    case 4:
                        // Revert to original stock level (konyvKeszlet)
                        _b.sent();
                        // Create stock move for audit trail (revert)
                        return [4 /*yield*/, this.prisma.stockMove.create({
                                data: {
                                    itemId: item.itemId,
                                    warehouseId: sheet.warehouseId,
                                    tipus: 'LELTAR_VISSZAVONAS',
                                    mennyiseg: -item.kulonbseg,
                                    megjegyzesek: "Lelt\u00E1r\u00EDv j\u00F3v\u00E1hagy\u00E1s visszavon\u00E1sa: ".concat(sheet.azonosito),
                                },
                            })];
                    case 5:
                        // Create stock move for audit trail (revert)
                        _b.sent();
                        _b.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7: 
                    // Update sheet status to BEFEJEZETT and clear approvedBy
                    return [2 /*return*/, this.prisma.inventorySheet.update({
                            where: { id: sheetId },
                            data: {
                                allapot: 'BEFEJEZETT',
                                approvedById: null,
                            },
                            include: {
                                warehouse: true,
                                createdBy: {
                                    select: {
                                        id: true,
                                        nev: true,
                                        email: true,
                                    },
                                },
                                approvedBy: {
                                    select: {
                                        id: true,
                                        nev: true,
                                        email: true,
                                    },
                                },
                                items: {
                                    include: {
                                        item: true,
                                        location: true,
                                    },
                                },
                            },
                        })];
                }
            });
        });
    };
    InventorySheetService.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var sheet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        sheet = _a.sent();
                        if (sheet.allapot === 'JOVAHAGYVA' || sheet.allapot === 'LEZARVA') {
                            throw new common_1.BadRequestException('Jóváhagyott vagy lezárt leltárív nem törölhető');
                        }
                        return [2 /*return*/, this.prisma.inventorySheet.delete({
                                where: { id: id },
                            })];
                }
            });
        });
    };
    InventorySheetService.prototype.generatePdf = function (id, res) {
        return __awaiter(this, void 0, void 0, function () {
            var sheet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        sheet = _a.sent();
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                var doc = new pdfkit_1.default({ margin: 50, size: 'A4' });
                                var pageNumber = 1;
                                // Set response headers
                                res.setHeader('Content-Type', 'application/pdf');
                                res.setHeader('Content-Disposition', "attachment; filename=\"leltariv_".concat(sheet.azonosito, "_").concat(new Date().toISOString().split('T')[0], ".pdf\""));
                                doc.pipe(res);
                                // Track page numbers
                                doc.on('pageAdded', function () {
                                    pageNumber++;
                                });
                                // Header with better formatting
                                doc.fontSize(24).font('Helvetica-Bold').text('Leltárív', { align: 'center' });
                                doc.moveDown(1);
                                // Sheet information in two columns
                                var infoLeft = 50;
                                var infoRight = doc.page.width / 2 + 25;
                                var infoY = doc.y;
                                doc.fontSize(10).font('Helvetica-Bold');
                                doc.text('Leltárív adatok', infoLeft, infoY);
                                infoY += 15;
                                doc.fontSize(9).font('Helvetica');
                                doc.text("Azonos\u00EDt\u00F3: ".concat(sheet.azonosito), infoLeft, infoY);
                                infoY += 12;
                                doc.text("D\u00E1tum: ".concat(new Date(sheet.leltarDatum).toLocaleDateString('hu-HU')), infoLeft, infoY);
                                infoY += 12;
                                doc.text("\u00C1llapot: ".concat(sheet.allapot), infoLeft, infoY);
                                infoY += 15;
                                if (sheet.warehouse) {
                                    doc.fontSize(10).font('Helvetica-Bold');
                                    doc.text('Raktár adatok', infoLeft, infoY);
                                    infoY += 15;
                                    doc.fontSize(9).font('Helvetica');
                                    doc.text("".concat(sheet.warehouse.nev, " (").concat(sheet.warehouse.azonosito, ")"), infoLeft, infoY);
                                    infoY += 12;
                                    if (sheet.warehouse.cim) {
                                        doc.text("C\u00EDm: ".concat(sheet.warehouse.cim), infoLeft, infoY);
                                        infoY += 12;
                                    }
                                }
                                // Calculate page width early
                                var pageWidth = doc.page.width - 100;
                                var tableLeft = 50;
                                var infoYRight = doc.y + 15;
                                if (sheet.createdBy) {
                                    doc.fontSize(9).font('Helvetica');
                                    doc.text("L\u00E9trehozta: ".concat(sheet.createdBy.nev), infoRight, infoYRight);
                                    infoYRight += 12;
                                }
                                if (sheet.approvedBy) {
                                    doc.text("J\u00F3v\u00E1hagyta: ".concat(sheet.approvedBy.nev), infoRight, infoYRight);
                                    infoYRight += 12;
                                }
                                if (sheet.megjegyzesek) {
                                    doc.moveDown(1);
                                    doc.fontSize(9).font('Helvetica');
                                    doc.text("Megjegyz\u00E9sek: ".concat(sheet.megjegyzesek), infoLeft, doc.y, { width: pageWidth });
                                    doc.moveDown(0.5);
                                }
                                doc.moveDown(1);
                                // Table header
                                var tableTop = doc.y;
                                var colWidths = {
                                    azonosito: pageWidth * 0.15,
                                    nev: pageWidth * 0.25,
                                    konyvKeszlet: pageWidth * 0.12,
                                    tenylegesKeszlet: pageWidth * 0.12,
                                    kulonbseg: pageWidth * 0.12,
                                    hely: pageWidth * 0.12,
                                    megjegyzesek: pageWidth * 0.12,
                                };
                                var rowHeight = 20;
                                var y = tableTop;
                                // Draw table header
                                doc.fontSize(9).font('Helvetica-Bold');
                                doc.rect(tableLeft, y, pageWidth, rowHeight).stroke();
                                doc.text('Cikk azon.', tableLeft + 5, y + 5, { width: colWidths.azonosito - 10 });
                                doc.text('Cikk név', tableLeft + colWidths.azonosito + 5, y + 5, { width: colWidths.nev - 10 });
                                doc.text('Könyv szerinti', tableLeft + colWidths.azonosito + colWidths.nev + 5, y + 5, { width: colWidths.konyvKeszlet - 10 });
                                doc.text('Tényleges', tableLeft + colWidths.azonosito + colWidths.nev + colWidths.konyvKeszlet + 5, y + 5, { width: colWidths.tenylegesKeszlet - 10 });
                                doc.text('Különbözet', tableLeft + colWidths.azonosito + colWidths.nev + colWidths.konyvKeszlet + colWidths.tenylegesKeszlet + 5, y + 5, { width: colWidths.kulonbseg - 10 });
                                doc.text('Raktári hely', tableLeft + colWidths.azonosito + colWidths.nev + colWidths.konyvKeszlet + colWidths.tenylegesKeszlet + colWidths.kulonbseg + 5, y + 5, { width: colWidths.hely - 10 });
                                doc.text('Megjegyzés', tableLeft + colWidths.azonosito + colWidths.nev + colWidths.konyvKeszlet + colWidths.tenylegesKeszlet + colWidths.kulonbseg + colWidths.hely + 5, y + 5, { width: colWidths.megjegyzesek - 10 });
                                y += rowHeight;
                                // Draw table rows
                                doc.fontSize(8).font('Helvetica');
                                var totalKulonbseg = 0;
                                var itemCount = 0;
                                sheet.items.forEach(function (item, index) {
                                    var _a, _b, _c, _d;
                                    // Check if we need a new page
                                    if (y + rowHeight > doc.page.height - 50) {
                                        doc.addPage();
                                        y = 50;
                                        // Redraw header on new page
                                        doc.fontSize(9).font('Helvetica-Bold');
                                        doc.rect(tableLeft, y, pageWidth, rowHeight).stroke();
                                        doc.text('Cikk azon.', tableLeft + 5, y + 5, { width: colWidths.azonosito - 10 });
                                        doc.text('Cikk név', tableLeft + colWidths.azonosito + 5, y + 5, { width: colWidths.nev - 10 });
                                        doc.text('Könyv szerinti', tableLeft + colWidths.azonosito + colWidths.nev + 5, y + 5, { width: colWidths.konyvKeszlet - 10 });
                                        doc.text('Tényleges', tableLeft + colWidths.azonosito + colWidths.nev + colWidths.konyvKeszlet + 5, y + 5, { width: colWidths.tenylegesKeszlet - 10 });
                                        doc.text('Különbözet', tableLeft + colWidths.azonosito + colWidths.nev + colWidths.konyvKeszlet + colWidths.tenylegesKeszlet + 5, y + 5, { width: colWidths.kulonbseg - 10 });
                                        doc.text('Raktári hely', tableLeft + colWidths.azonosito + colWidths.nev + colWidths.konyvKeszlet + colWidths.tenylegesKeszlet + colWidths.kulonbseg + 5, y + 5, { width: colWidths.hely - 10 });
                                        doc.text('Megjegyzés', tableLeft + colWidths.azonosito + colWidths.nev + colWidths.konyvKeszlet + colWidths.tenylegesKeszlet + colWidths.kulonbseg + colWidths.hely + 5, y + 5, { width: colWidths.megjegyzesek - 10 });
                                        y += rowHeight;
                                        doc.fontSize(8).font('Helvetica');
                                    }
                                    // Draw row border
                                    doc.rect(tableLeft, y, pageWidth, rowHeight).stroke();
                                    // Row data
                                    var itemNev = ((_a = item.item) === null || _a === void 0 ? void 0 : _a.nev) || 'Ismeretlen';
                                    var itemAzonosito = ((_b = item.item) === null || _b === void 0 ? void 0 : _b.azonosito) || '-';
                                    var konyvKeszlet = item.konyvKeszlet.toLocaleString('hu-HU');
                                    var tenylegesKeszlet = item.tenylegesKeszlet !== null ? item.tenylegesKeszlet.toLocaleString('hu-HU') : '-';
                                    var kulonbseg = item.kulonbseg !== null ? item.kulonbseg.toLocaleString('hu-HU') : '-';
                                    var hely = ((_c = item.location) === null || _c === void 0 ? void 0 : _c.nev) || ((_d = item.location) === null || _d === void 0 ? void 0 : _d.azonosito) || '-';
                                    var megjegyzes = item.megjegyzesek || '';
                                    // Color for difference
                                    if (item.kulonbseg !== null && item.kulonbseg !== 0) {
                                        if (item.kulonbseg > 0) {
                                            doc.fillColor('green');
                                        }
                                        else {
                                            doc.fillColor('red');
                                        }
                                    }
                                    else {
                                        doc.fillColor('black');
                                    }
                                    doc.text(itemAzonosito, tableLeft + 5, y + 5, { width: colWidths.azonosito - 10 });
                                    doc.text(itemNev, tableLeft + colWidths.azonosito + 5, y + 5, { width: colWidths.nev - 10 });
                                    doc.text(konyvKeszlet, tableLeft + colWidths.azonosito + colWidths.nev + 5, y + 5, { width: colWidths.konyvKeszlet - 10, align: 'right' });
                                    doc.text(tenylegesKeszlet, tableLeft + colWidths.azonosito + colWidths.nev + colWidths.konyvKeszlet + 5, y + 5, { width: colWidths.tenylegesKeszlet - 10, align: 'right' });
                                    doc.text(kulonbseg, tableLeft + colWidths.azonosito + colWidths.nev + colWidths.konyvKeszlet + colWidths.tenylegesKeszlet + 5, y + 5, { width: colWidths.kulonbseg - 10, align: 'right' });
                                    doc.text(hely, tableLeft + colWidths.azonosito + colWidths.nev + colWidths.konyvKeszlet + colWidths.tenylegesKeszlet + colWidths.kulonbseg + 5, y + 5, { width: colWidths.hely - 10 });
                                    // Truncate or wrap long text
                                    var maxMegjegyzesLength = 40;
                                    var megjegyzesText = megjegyzes.length > maxMegjegyzesLength
                                        ? megjegyzes.substring(0, maxMegjegyzesLength) + '...'
                                        : megjegyzes;
                                    doc.text(megjegyzesText, tableLeft + colWidths.azonosito + colWidths.nev + colWidths.konyvKeszlet + colWidths.tenylegesKeszlet + colWidths.kulonbseg + colWidths.hely + 5, y + 5, { width: colWidths.megjegyzesek - 10 });
                                    doc.fillColor('black');
                                    if (item.kulonbseg !== null) {
                                        totalKulonbseg += item.kulonbseg;
                                    }
                                    itemCount++;
                                    y += rowHeight;
                                });
                                // Summary
                                doc.moveDown(1);
                                y = doc.y;
                                // Draw summary box
                                var summaryBoxHeight = 40;
                                doc.rect(tableLeft, y, pageWidth, summaryBoxHeight).stroke();
                                doc.fillColor('lightgray');
                                doc.rect(tableLeft, y, pageWidth, summaryBoxHeight).fill();
                                doc.fillColor('black');
                                y += 10;
                                doc.fontSize(10).font('Helvetica-Bold');
                                doc.text('Összesítő:', tableLeft + 5, y);
                                y += 15;
                                doc.fontSize(9).font('Helvetica');
                                doc.text("\u00D6sszes t\u00E9tel sz\u00E1ma: ".concat(itemCount), tableLeft + 5, y);
                                y += 12;
                                doc.text("\u00D6sszes k\u00FCl\u00F6nb\u00F6zet: ".concat(totalKulonbseg.toLocaleString('hu-HU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })), tableLeft + 5, y);
                                // Footer on each page
                                var addFooter = function () {
                                    var currentPage = doc.bufferedPageRange().start;
                                    doc.fontSize(7).font('Helvetica');
                                    doc.text("Gener\u00E1lva: ".concat(new Date().toLocaleString('hu-HU'), " | Oldal ").concat(currentPage + 1), tableLeft, doc.page.height - 20, { align: 'left' });
                                };
                                // Add footer to all pages
                                doc.on('pageAdded', function () {
                                    addFooter();
                                });
                                // Add footer to first page
                                addFooter();
                                doc.end();
                                doc.on('end', function () { return resolve(); });
                                doc.on('error', function (err) { return reject(err); });
                            })];
                }
            });
        });
    };
    InventorySheetService.prototype.generateExcel = function (id, res) {
        return __awaiter(this, void 0, void 0, function () {
            var sheet, workbook, worksheet, infoRow, headerRow, totalKulonbseg, summaryRow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        sheet = _a.sent();
                        workbook = new exceljs_1.default.Workbook();
                        worksheet = workbook.addWorksheet('Leltárív');
                        // Header
                        worksheet.mergeCells('A1:H1');
                        worksheet.getCell('A1').value = 'Leltárív';
                        worksheet.getCell('A1').font = { size: 16, bold: true };
                        worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
                        infoRow = 3;
                        worksheet.getCell("A".concat(infoRow)).value = 'Azonosító:';
                        worksheet.getCell("B".concat(infoRow)).value = sheet.azonosito;
                        infoRow++;
                        worksheet.getCell("A".concat(infoRow)).value = 'Dátum:';
                        worksheet.getCell("B".concat(infoRow)).value = new Date(sheet.leltarDatum).toLocaleDateString('hu-HU');
                        infoRow++;
                        if (sheet.warehouse) {
                            worksheet.getCell("A".concat(infoRow)).value = 'Raktár:';
                            worksheet.getCell("B".concat(infoRow)).value = "".concat(sheet.warehouse.nev, " (").concat(sheet.warehouse.azonosito, ")");
                            infoRow++;
                            if (sheet.warehouse.cim) {
                                worksheet.getCell("A".concat(infoRow)).value = 'Raktár címe:';
                                worksheet.getCell("B".concat(infoRow)).value = sheet.warehouse.cim;
                                infoRow++;
                            }
                        }
                        if (sheet.createdBy) {
                            worksheet.getCell("A".concat(infoRow)).value = 'Létrehozta:';
                            worksheet.getCell("B".concat(infoRow)).value = sheet.createdBy.nev;
                            infoRow++;
                        }
                        if (sheet.approvedBy) {
                            worksheet.getCell("A".concat(infoRow)).value = 'Jóváhagyta:';
                            worksheet.getCell("B".concat(infoRow)).value = sheet.approvedBy.nev;
                            infoRow++;
                        }
                        worksheet.getCell("A".concat(infoRow)).value = 'Állapot:';
                        worksheet.getCell("B".concat(infoRow)).value = sheet.allapot;
                        infoRow++;
                        if (sheet.megjegyzesek) {
                            worksheet.getCell("A".concat(infoRow)).value = 'Megjegyzések:';
                            worksheet.getCell("B".concat(infoRow)).value = sheet.megjegyzesek;
                            infoRow++;
                        }
                        headerRow = infoRow + 1;
                        worksheet.getCell("A".concat(headerRow)).value = 'Cikk azonosító';
                        worksheet.getCell("B".concat(headerRow)).value = 'Cikk név';
                        worksheet.getCell("C".concat(headerRow)).value = 'Könyv szerinti készlet';
                        worksheet.getCell("D".concat(headerRow)).value = 'Tényleges készlet';
                        worksheet.getCell("E".concat(headerRow)).value = 'Különbözet';
                        worksheet.getCell("F".concat(headerRow)).value = 'Raktári hely';
                        worksheet.getCell("G".concat(headerRow)).value = 'Megjegyzés';
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
                        totalKulonbseg = 0;
                        sheet.items.forEach(function (item, index) {
                            var _a, _b, _c, _d;
                            var row = headerRow + 1 + index;
                            worksheet.getCell("A".concat(row)).value = ((_a = item.item) === null || _a === void 0 ? void 0 : _a.azonosito) || '-';
                            worksheet.getCell("B".concat(row)).value = ((_b = item.item) === null || _b === void 0 ? void 0 : _b.nev) || 'Ismeretlen';
                            worksheet.getCell("C".concat(row)).value = item.konyvKeszlet;
                            worksheet.getCell("C".concat(row)).numFmt = '#,##0.00';
                            worksheet.getCell("D".concat(row)).value = item.tenylegesKeszlet !== null ? item.tenylegesKeszlet : '-';
                            if (item.tenylegesKeszlet !== null) {
                                worksheet.getCell("D".concat(row)).numFmt = '#,##0.00';
                            }
                            worksheet.getCell("E".concat(row)).value = item.kulonbseg !== null ? item.kulonbseg : '-';
                            if (item.kulonbseg !== null) {
                                worksheet.getCell("E".concat(row)).numFmt = '#,##0.00';
                                // Color coding for difference
                                if (item.kulonbseg > 0) {
                                    worksheet.getCell("E".concat(row)).fill = {
                                        type: 'pattern',
                                        pattern: 'solid',
                                        fgColor: { argb: 'FF90EE90' }, // Light green
                                    };
                                }
                                else if (item.kulonbseg < 0) {
                                    worksheet.getCell("E".concat(row)).fill = {
                                        type: 'pattern',
                                        pattern: 'solid',
                                        fgColor: { argb: 'FFFFB6C1' }, // Light red
                                    };
                                }
                                totalKulonbseg += item.kulonbseg;
                            }
                            worksheet.getCell("F".concat(row)).value = ((_c = item.location) === null || _c === void 0 ? void 0 : _c.nev) || ((_d = item.location) === null || _d === void 0 ? void 0 : _d.azonosito) || '-';
                            worksheet.getCell("G".concat(row)).value = item.megjegyzesek || '';
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
                        summaryRow = headerRow + sheet.items.length + 2;
                        worksheet.getCell("A".concat(summaryRow)).value = 'Összesítő:';
                        worksheet.getCell("A".concat(summaryRow)).font = { bold: true };
                        worksheet.getCell("B".concat(summaryRow)).value = 'Összes tétel száma:';
                        worksheet.getCell("C".concat(summaryRow)).value = sheet.items.length;
                        worksheet.getCell("C".concat(summaryRow)).font = { bold: true };
                        worksheet.getCell("D".concat(summaryRow)).value = 'Összes különbözet:';
                        worksheet.getCell("E".concat(summaryRow)).value = totalKulonbseg;
                        worksheet.getCell("E".concat(summaryRow)).numFmt = '#,##0.00';
                        worksheet.getCell("E".concat(summaryRow)).font = { bold: true };
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
                        // Set response headers
                        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        res.setHeader('Content-Disposition', "attachment; filename=\"leltariv_".concat(sheet.azonosito, "_").concat(new Date().toISOString().split('T')[0], ".xlsx\""));
                        return [4 /*yield*/, workbook.xlsx.write(res)];
                    case 2:
                        _a.sent();
                        res.end();
                        return [2 /*return*/];
                }
            });
        });
    };
    InventorySheetService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], InventorySheetService);
    return InventorySheetService;
}());
exports.InventorySheetService = InventorySheetService;
