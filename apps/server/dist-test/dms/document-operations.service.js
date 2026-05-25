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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentOperationsService = exports.DMS_WORKFLOW_STATES = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var storage_service_1 = require("../common/storage/storage.service");
var audit_service_1 = require("../common/audit/audit.service");
var ExcelJS = __importStar(require("exceljs"));
exports.DMS_WORKFLOW_STATES = [
    'beerkezett',
    'iktatott',
    'feldolgozas_alatt',
    'jovahagyasra_var',
    'jovahagyott',
    'archivalva',
    'elutasitva',
];
var DocumentOperationsService = /** @class */ (function () {
    function DocumentOperationsService(prisma, storage, audit) {
        this.prisma = prisma;
        this.storage = storage;
        this.audit = audit;
    }
    DocumentOperationsService.prototype.assertDocumentAccess = function (documentId_1, userId_1, isAdmin_1) {
        return __awaiter(this, arguments, void 0, function (documentId, userId, isAdmin, minLevel) {
            var doc, acc, levels, need, have;
            if (minLevel === void 0) { minLevel = 'READ'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.document.findUnique({
                            where: { id: documentId },
                            include: { access: true },
                        })];
                    case 1:
                        doc = _a.sent();
                        if (!doc)
                            throw new common_1.NotFoundException('Dokumentum nem található');
                        if (isAdmin)
                            return [2 /*return*/, doc];
                        if (!userId)
                            throw new common_1.ForbiddenException('Nincs hitelesítve');
                        if (doc.createdById === userId)
                            return [2 /*return*/, doc];
                        acc = doc.access.find(function (a) { return a.userId === userId; });
                        if (!acc)
                            throw new common_1.ForbiddenException('Nincs hozzáférése a dokumentumhoz');
                        levels = { READ: 1, EDIT: 2, FULL_ACCESS: 3, ADMIN: 3 };
                        need = levels[minLevel] || 1;
                        have = levels[acc.jogosultsag] || 1;
                        if (have < need)
                            throw new common_1.ForbiddenException('Nincs elegendő jogosultság');
                        return [2 /*return*/, doc];
                }
            });
        });
    };
    DocumentOperationsService.prototype.validateIktatoSzam = function (iktatoSzam, excludeId) {
        return __awaiter(this, void 0, void 0, function () {
            var existing;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.document.findUnique({
                            where: { iktatoSzam: iktatoSzam },
                        })];
                    case 1:
                        existing = _a.sent();
                        if (!existing)
                            return [2 /*return*/, true];
                        if (excludeId && existing.id === excludeId)
                            return [2 /*return*/, true];
                        return [2 /*return*/, false];
                }
            });
        });
    };
    DocumentOperationsService.prototype.changeWorkflow = function (documentId, ujAllapot, options) {
        return __awaiter(this, void 0, void 0, function () {
            var doc, updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!exports.DMS_WORKFLOW_STATES.includes(ujAllapot)) {
                            throw new common_1.BadRequestException("\u00C9rv\u00E9nytelen \u00E1llapot: ".concat(ujAllapot));
                        }
                        return [4 /*yield*/, this.assertDocumentAccess(documentId, options.userId, options.isAdmin || false, 'EDIT')];
                    case 1:
                        doc = _a.sent();
                        return [4 /*yield*/, this.prisma.document.update({
                                where: { id: documentId },
                                data: __assign({ allapot: ujAllapot }, (options.felelos !== undefined && { felelos: options.felelos })),
                            })];
                    case 2:
                        updated = _a.sent();
                        return [4 /*yield*/, this.prisma.documentWorkflowLog.create({
                                data: {
                                    documentId: documentId,
                                    regiAllapot: doc.allapot,
                                    ujAllapot: ujAllapot,
                                    megjegyzes: options.megjegyzes,
                                    userId: options.userId,
                                },
                            })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.audit.log({
                                userId: options.userId,
                                esemeny: 'workflow',
                                entitas: 'Document',
                                entitasId: documentId,
                                regi: { allapot: doc.allapot },
                                uj: { allapot: ujAllapot, megjegyzes: options.megjegyzes },
                            })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    DocumentOperationsService.prototype.archive = function (documentId, userId, isAdmin, megjegyzes) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.changeWorkflow(documentId, 'archivalva', {
                        megjegyzes: megjegyzes || 'Archiválás',
                        userId: userId,
                        isAdmin: isAdmin,
                    })];
            });
        });
    };
    DocumentOperationsService.prototype.addVersion = function (documentId, file, valtoztatasLeiras, userId, isAdmin) {
        return __awaiter(this, void 0, void 0, function () {
            var doc, lastVersion, nextVer, sanitized, relativePath, version;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.assertDocumentAccess(documentId, userId, isAdmin, 'EDIT')];
                    case 1:
                        doc = _a.sent();
                        if (doc.allapot === 'archivalva' && !isAdmin) {
                            throw new common_1.ForbiddenException('Archivált dokumentumhoz csak admin tölthet fel verziót');
                        }
                        return [4 /*yield*/, this.prisma.documentVersion.findFirst({
                                where: { documentId: documentId },
                                orderBy: { verzioSzam: 'desc' },
                            })];
                    case 2:
                        lastVersion = _a.sent();
                        nextVer = ((lastVersion === null || lastVersion === void 0 ? void 0 : lastVersion.verzioSzam) || 0) + 1;
                        if (!doc.fajlUtvonal) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.prisma.documentVersion.create({
                                data: {
                                    documentId: documentId,
                                    verzioSzam: lastVersion ? lastVersion.verzioSzam : 1,
                                    fajlUtvonal: doc.fajlUtvonal,
                                    valtoztatasLeiras: 'Automatikus mentés feltöltés előtt',
                                    createdById: userId,
                                },
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        sanitized = this.storage.sanitizeFilename(file.originalname);
                        return [4 /*yield*/, this.storage.saveFile('files', sanitized, file.buffer)];
                    case 5:
                        relativePath = _a.sent();
                        return [4 /*yield*/, this.prisma.documentVersion.create({
                                data: {
                                    documentId: documentId,
                                    verzioSzam: nextVer,
                                    fajlUtvonal: relativePath,
                                    valtoztatasLeiras: valtoztatasLeiras,
                                    createdById: userId,
                                },
                            })];
                    case 6:
                        version = _a.sent();
                        return [4 /*yield*/, this.prisma.document.update({
                                where: { id: documentId },
                                data: {
                                    fajlNev: file.originalname,
                                    fajlMeret: file.size,
                                    fajlUtvonal: relativePath,
                                    mimeType: file.mimetype,
                                },
                            })];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, this.audit.log({
                                userId: userId,
                                esemeny: 'version_upload',
                                entitas: 'Document',
                                entitasId: documentId,
                                uj: { verzioSzam: nextVer },
                            })];
                    case 8:
                        _a.sent();
                        return [2 /*return*/, version];
                }
            });
        });
    };
    DocumentOperationsService.prototype.assertNotArchivedForMutation = function (doc, isAdmin, action) {
        if (doc.allapot === 'archivalva' && !isAdmin) {
            throw new common_1.ForbiddenException("Archiv\u00E1lt dokumentum nem ".concat(action));
        }
    };
    DocumentOperationsService.prototype.openVersionFile = function (versionId_1, userId_1) {
        return __awaiter(this, arguments, void 0, function (versionId, userId, isAdmin) {
            var version, buffer, _a;
            if (isAdmin === void 0) { isAdmin = false; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.prisma.documentVersion.findUnique({
                            where: { id: versionId },
                            include: { document: { select: { id: true } } },
                        })];
                    case 1:
                        version = _b.sent();
                        if (!version)
                            throw new common_1.NotFoundException('Verzió nem található');
                        return [4 /*yield*/, this.assertDocumentAccess(version.documentId, userId, isAdmin, 'READ')];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.storage.readFile(version.fajlUtvonal)];
                    case 4:
                        buffer = _b.sent();
                        return [2 /*return*/, { buffer: buffer, path: version.fajlUtvonal }];
                    case 5:
                        _a = _b.sent();
                        throw new common_1.NotFoundException('A verzió fájlja nem található a tárolóban. Ellenőrizze a fájl elérési útját vagy töltse fel újra.');
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    DocumentOperationsService.prototype.getFileBuffer = function (documentId_1, userId_1) {
        return __awaiter(this, arguments, void 0, function (documentId, userId, isAdmin) {
            var doc, buffer, _a;
            if (isAdmin === void 0) { isAdmin = false; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.assertDocumentAccess(documentId, userId, isAdmin, 'READ')];
                    case 1:
                        doc = _b.sent();
                        if (!doc.fajlUtvonal)
                            throw new common_1.BadRequestException('Nincs fájl');
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.storage.readFile(doc.fajlUtvonal)];
                    case 3:
                        buffer = _b.sent();
                        return [2 /*return*/, { doc: doc, buffer: buffer }];
                    case 4:
                        _a = _b.sent();
                        throw new common_1.NotFoundException('A dokumentum fájlja nem található. Lehetséges, hogy régi tárolási útvonalról van szó – töltse fel újra a fájlt.');
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DocumentOperationsService.prototype.updateDocument = function (documentId_1, dto_1, userId_1) {
        return __awaiter(this, arguments, void 0, function (documentId, dto, userId, isAdmin) {
            var doc, updateData;
            if (isAdmin === void 0) { isAdmin = false; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.assertDocumentAccess(documentId, userId, isAdmin, 'EDIT')];
                    case 1:
                        doc = _a.sent();
                        this.assertNotArchivedForMutation(doc, isAdmin, 'módosítható');
                        updateData = __assign({}, dto);
                        if (dto.ervenyessegKezdet !== undefined) {
                            updateData.ervenyessegKezdet = dto.ervenyessegKezdet
                                ? new Date(dto.ervenyessegKezdet)
                                : null;
                        }
                        if (dto.ervenyessegVeg !== undefined) {
                            updateData.ervenyessegVeg = dto.ervenyessegVeg
                                ? new Date(dto.ervenyessegVeg)
                                : null;
                        }
                        if (dto.lejarat !== undefined) {
                            updateData.lejarat = dto.lejarat ? new Date(dto.lejarat) : null;
                        }
                        if (dto.irany !== undefined) {
                            updateData.irany = dto.irany || null;
                        }
                        return [2 /*return*/, this.prisma.document.update({
                                where: { id: documentId },
                                data: updateData,
                            })];
                }
            });
        });
    };
    DocumentOperationsService.prototype.uploadFileToDocument = function (documentId_1, file_1, userId_1) {
        return __awaiter(this, arguments, void 0, function (documentId, file, userId, isAdmin) {
            var doc, sanitizedFilename, relativePath;
            if (isAdmin === void 0) { isAdmin = false; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.assertDocumentAccess(documentId, userId, isAdmin, 'EDIT')];
                    case 1:
                        doc = _a.sent();
                        this.assertNotArchivedForMutation(doc, isAdmin, 'tölthető fel');
                        sanitizedFilename = this.storage.sanitizeFilename(file.originalname);
                        return [4 /*yield*/, this.storage.saveFile('files', sanitizedFilename, file.buffer)];
                    case 2:
                        relativePath = _a.sent();
                        return [2 /*return*/, this.prisma.document.update({
                                where: { id: documentId },
                                data: {
                                    fajlNev: file.originalname,
                                    fajlMeret: file.size,
                                    fajlUtvonal: relativePath,
                                    mimeType: file.mimetype,
                                },
                            })];
                }
            });
        });
    };
    DocumentOperationsService.prototype.exportList = function (filters_1, format_1, userId_1) {
        return __awaiter(this, arguments, void 0, function (filters, format, userId, isAdmin) {
            var where, rows, header, lines, workbook, sheet, buffer;
            if (isAdmin === void 0) { isAdmin = false; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        where = {};
                        if (filters === null || filters === void 0 ? void 0 : filters.categoryId)
                            where.categoryId = filters.categoryId;
                        if (filters === null || filters === void 0 ? void 0 : filters.allapot)
                            where.allapot = filters.allapot;
                        if (filters === null || filters === void 0 ? void 0 : filters.accountId)
                            where.accountId = filters.accountId;
                        if (!isAdmin && userId) {
                            where.OR = [
                                { createdById: userId },
                                { access: { some: { userId: userId } } },
                            ];
                        }
                        return [4 /*yield*/, this.prisma.document.findMany({
                                where: where,
                                include: {
                                    category: true,
                                    account: true,
                                    ocrJob: { select: { allapot: true } },
                                    createdBy: { select: { nev: true } },
                                },
                                orderBy: { createdAt: 'desc' },
                                take: 5000,
                            })];
                    case 1:
                        rows = _a.sent();
                        return [4 /*yield*/, this.audit.log({
                                userId: userId,
                                esemeny: 'export',
                                entitas: 'Document',
                                uj: { format: format, count: rows.length },
                            })];
                    case 2:
                        _a.sent();
                        if (format === 'csv') {
                            header = 'Iktatoszam;Nev;Tipus;Allapot;Kategoria;Ugyfel;Felelos;OCR;Letrehozva';
                            lines = rows.map(function (r) {
                                var _a, _b, _c;
                                return [
                                    r.iktatoSzam,
                                    r.nev,
                                    r.tipus,
                                    r.allapot,
                                    (_a = r.category) === null || _a === void 0 ? void 0 : _a.nev,
                                    (_b = r.account) === null || _b === void 0 ? void 0 : _b.nev,
                                    r.felelos,
                                    (_c = r.ocrJob) === null || _c === void 0 ? void 0 : _c.allapot,
                                    r.createdAt.toISOString(),
                                ]
                                    .map(function (c) { return "\"".concat((c || '').toString().replace(/"/g, '""'), "\""); })
                                    .join(';');
                            });
                            return [2 /*return*/, { contentType: 'text/csv; charset=utf-8', body: '\ufeff' + __spreadArray([header], lines, true).join('\n') }];
                        }
                        workbook = new ExcelJS.Workbook();
                        sheet = workbook.addWorksheet('Dokumentumok');
                        sheet.addRow([
                            'Iktatószám',
                            'Név',
                            'Típus',
                            'Állapot',
                            'Kategória',
                            'Ügyfél',
                            'Felelős',
                            'OCR',
                            'Létrehozva',
                        ]);
                        rows.forEach(function (r) {
                            var _a, _b, _c;
                            return sheet.addRow([
                                r.iktatoSzam,
                                r.nev,
                                r.tipus,
                                r.allapot,
                                (_a = r.category) === null || _a === void 0 ? void 0 : _a.nev,
                                (_b = r.account) === null || _b === void 0 ? void 0 : _b.nev,
                                r.felelos,
                                (_c = r.ocrJob) === null || _c === void 0 ? void 0 : _c.allapot,
                                r.createdAt,
                            ]);
                        });
                        return [4 /*yield*/, workbook.xlsx.writeBuffer()];
                    case 3:
                        buffer = _a.sent();
                        return [2 /*return*/, {
                                contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                body: buffer,
                            }];
                }
            });
        });
    };
    DocumentOperationsService.prototype.getReport = function (type_1, userId_1) {
        return __awaiter(this, arguments, void 0, function (type, userId, isAdmin) {
            var accessFilter, _a, in30, jobs;
            if (isAdmin === void 0) { isAdmin = false; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        accessFilter = !isAdmin && userId
                            ? {
                                OR: [{ createdById: userId }, { access: { some: { userId: userId } } }],
                            }
                            : {};
                        _a = type;
                        switch (_a) {
                            case 'expiring': return [3 /*break*/, 1];
                            case 'by-type': return [3 /*break*/, 2];
                            case 'by-responsible': return [3 /*break*/, 3];
                            case 'ocr-errors': return [3 /*break*/, 4];
                            case 'archived': return [3 /*break*/, 6];
                        }
                        return [3 /*break*/, 7];
                    case 1:
                        {
                            in30 = new Date();
                            in30.setDate(in30.getDate() + 30);
                            return [2 /*return*/, this.prisma.document.findMany({
                                    where: __assign(__assign({}, accessFilter), { lejarat: { lte: in30, gte: new Date() }, allapot: { not: 'archivalva' } }),
                                    include: { account: true, category: true },
                                    orderBy: { lejarat: 'asc' },
                                })];
                        }
                        _b.label = 2;
                    case 2: return [2 /*return*/, this.prisma.document.groupBy({
                            by: ['tipus'],
                            where: accessFilter,
                            _count: { id: true },
                        })];
                    case 3: return [2 /*return*/, this.prisma.document.groupBy({
                            by: ['felelos'],
                            where: __assign(__assign({}, accessFilter), { allapot: { not: 'archivalva' } }),
                            _count: { id: true },
                        })];
                    case 4: return [4 /*yield*/, this.prisma.oCRJob.findMany({
                            where: { allapot: 'hiba' },
                            include: {
                                document: {
                                    select: {
                                        id: true,
                                        nev: true,
                                        iktatoSzam: true,
                                        createdById: true,
                                        access: { select: { userId: true } },
                                    },
                                },
                            },
                        })];
                    case 5:
                        jobs = _b.sent();
                        if (isAdmin || !userId)
                            return [2 /*return*/, jobs];
                        return [2 /*return*/, jobs.filter(function (j) {
                                return j.document.createdById === userId ||
                                    j.document.access.some(function (a) { return a.userId === userId; });
                            })];
                    case 6: return [2 /*return*/, this.prisma.document.findMany({
                            where: __assign(__assign({}, accessFilter), { allapot: 'archivalva' }),
                            orderBy: { updatedAt: 'desc' },
                        })];
                    case 7: return [2 /*return*/, []];
                }
            });
        });
    };
    DocumentOperationsService.prototype.findByIktatoSzam = function (iktatoSzam_1, userId_1) {
        return __awaiter(this, arguments, void 0, function (iktatoSzam, userId, isAdmin) {
            var doc, has, _a;
            if (isAdmin === void 0) { isAdmin = false; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.prisma.document.findUnique({
                            where: { iktatoSzam: iktatoSzam },
                            include: { category: true, account: true, ocrJob: true },
                        })];
                    case 1:
                        doc = _b.sent();
                        if (!doc)
                            return [2 /*return*/, null];
                        if (!(!isAdmin && userId)) return [3 /*break*/, 4];
                        _a = doc.createdById === userId;
                        if (_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.prisma.documentAccess.count({
                                where: { documentId: doc.id, userId: userId },
                            })];
                    case 2:
                        _a = (_b.sent()) > 0;
                        _b.label = 3;
                    case 3:
                        has = _a;
                        if (!has)
                            return [2 /*return*/, null];
                        _b.label = 4;
                    case 4: return [2 /*return*/, doc];
                }
            });
        });
    };
    DocumentOperationsService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService,
            storage_service_1.StorageService,
            audit_service_1.AuditService])
    ], DocumentOperationsService);
    return DocumentOperationsService;
}());
exports.DocumentOperationsService = DocumentOperationsService;
