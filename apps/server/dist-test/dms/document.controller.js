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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.DocumentController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var document_service_1 = require("./document.service");
var document_operations_service_1 = require("./document-operations.service");
var audit_service_1 = require("../common/audit/audit.service");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var permission_enum_1 = require("../common/rbac/permission.enum");
var rbac_guard_1 = require("../common/rbac/rbac.guard");
var storage_service_1 = require("../common/storage/storage.service");
var ocr_service_1 = require("./ocr.service");
var prisma_service_1 = require("../prisma/prisma.service");
var DocumentController = /** @class */ (function () {
    function DocumentController(documentService, auditService, storageService, ocrService, prisma, documentOps) {
        this.documentService = documentService;
        this.auditService = auditService;
        this.storageService = storageService;
        this.ocrService = ocrService;
        this.prisma = prisma;
        this.documentOps = documentOps;
    }
    DocumentController.prototype.exportList = function (format, res, query, req) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, isAdmin, result;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                        isAdmin = ((_c = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.roles) === null || _c === void 0 ? void 0 : _c.includes('Admin')) || false;
                        return [4 /*yield*/, this.documentOps.exportList(query, format, userId, isAdmin)];
                    case 1:
                        result = _d.sent();
                        res.setHeader('Content-Type', result.contentType);
                        res.setHeader('Content-Disposition', "attachment; filename=\"dokumentumok_".concat(new Date().toISOString().split('T')[0], ".").concat(format === 'csv' ? 'csv' : 'xlsx', "\""));
                        res.end(result.body);
                        return [2 /*return*/];
                }
            });
        });
    };
    DocumentController.prototype.report = function (reportType, req) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, isAdmin;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                isAdmin = ((_c = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.roles) === null || _c === void 0 ? void 0 : _c.includes('Admin')) || false;
                return [2 /*return*/, this.documentOps.getReport(reportType, userId, isAdmin)];
            });
        });
    };
    DocumentController.prototype.lookupIktato = function (iktatoSzam, req) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, isAdmin, doc;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                        isAdmin = ((_c = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.roles) === null || _c === void 0 ? void 0 : _c.includes('Admin')) || false;
                        return [4 /*yield*/, this.documentOps.findByIktatoSzam(iktatoSzam, userId, isAdmin)];
                    case 1:
                        doc = _d.sent();
                        if (!doc)
                            throw new common_1.BadRequestException('Dokumentum nem található');
                        return [2 /*return*/, doc];
                }
            });
        });
    };
    DocumentController.prototype.ocrJobs = function (skip, take, req) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, isAdmin;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                isAdmin = ((_c = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.roles) === null || _c === void 0 ? void 0 : _c.includes('Admin')) || false;
                return [2 /*return*/, this.ocrService.findAll(skip ? parseInt(skip) : 0, take ? parseInt(take) : 50, userId, isAdmin)];
            });
        });
    };
    DocumentController.prototype.findAll = function (skip, take, categoryId, allapot, accountId, irany, search, tagId, opportunityId, quoteId, req) {
        var _a, _b, _c;
        var filters = {
            categoryId: categoryId,
            allapot: allapot,
            accountId: accountId,
            irany: irany,
            search: search,
            tagId: tagId,
            opportunityId: opportunityId,
            quoteId: quoteId,
        };
        var userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
        var isAdmin = ((_c = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.roles) === null || _c === void 0 ? void 0 : _c.includes('Admin')) || false;
        return this.documentService.findAll(skip ? parseInt(skip) : 0, take ? parseInt(take) : 50, filters, userId, isAdmin);
    };
    DocumentController.prototype.downloadVersion = function (versionId, res, req) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, isAdmin, buffer;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                        isAdmin = ((_c = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.roles) === null || _c === void 0 ? void 0 : _c.includes('Admin')) || false;
                        return [4 /*yield*/, this.documentOps.openVersionFile(versionId, userId, isAdmin)];
                    case 1:
                        buffer = (_d.sent()).buffer;
                        res.setHeader('Content-Type', 'application/octet-stream');
                        res.send(buffer);
                        return [2 /*return*/];
                }
            });
        });
    };
    DocumentController.prototype.create = function (dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, isAdmin, document_1, e_1;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                        isAdmin = ((_c = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.roles) === null || _c === void 0 ? void 0 : _c.includes('Admin')) || false;
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, this.documentService.create(dto, userId, {
                                manualIktato: !!dto.iktatoSzam,
                                isAdmin: isAdmin,
                            })];
                    case 2:
                        document_1 = _d.sent();
                        return [4 /*yield*/, this.auditService.log({
                                userId: userId,
                                esemeny: 'iktatas',
                                entitas: 'Document',
                                entitasId: document_1.id,
                                uj: { iktatoSzam: document_1.iktatoSzam },
                            })];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, this.auditService.logCreate('Document', document_1.id, document_1, userId)];
                    case 4:
                        _d.sent();
                        return [2 /*return*/, document_1];
                    case 5:
                        e_1 = _d.sent();
                        throw new common_1.BadRequestException(e_1.message || 'Iktatás sikertelen');
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    DocumentController.prototype.update = function (id, dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, isAdmin, oldDocument, updatedDocument;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                        isAdmin = ((_c = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.roles) === null || _c === void 0 ? void 0 : _c.includes('Admin')) || false;
                        return [4 /*yield*/, this.documentService.findOne(id, userId, isAdmin)];
                    case 1:
                        oldDocument = _e.sent();
                        if (!oldDocument) {
                            throw new common_1.BadRequestException('Dokumentum nem található vagy nincs hozzáférése');
                        }
                        return [4 /*yield*/, this.documentOps.updateDocument(id, dto, userId, isAdmin)];
                    case 2:
                        updatedDocument = _e.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('Document', id, oldDocument, updatedDocument, (_d = req.user) === null || _d === void 0 ? void 0 : _d.id)];
                    case 3:
                        _e.sent();
                        return [2 /*return*/, updatedDocument];
                }
            });
        });
    };
    DocumentController.prototype.upload = function (id, file, req) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, isAdmin, updatedDocument, relativePath, settings;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!file) {
                            throw new common_1.BadRequestException('Nincs fájl feltöltve');
                        }
                        userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                        isAdmin = ((_c = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.roles) === null || _c === void 0 ? void 0 : _c.includes('Admin')) || false;
                        return [4 /*yield*/, this.documentOps.uploadFileToDocument(id, file, userId, isAdmin)];
                    case 1:
                        updatedDocument = _e.sent();
                        relativePath = updatedDocument.fajlUtvonal;
                        return [4 /*yield*/, this.auditService.log({
                                userId: (_d = req.user) === null || _d === void 0 ? void 0 : _d.id,
                                esemeny: 'upload',
                                entitas: 'Document',
                                entitasId: id,
                            })];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, this.prisma.systemSetting.findUnique({
                                where: { kulcs: 'dms.ocr.enabled' },
                            })];
                    case 3:
                        settings = _e.sent();
                        if (!((settings === null || settings === void 0 ? void 0 : settings.ertek) === 'true' && file.mimetype === 'application/pdf')) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.ocrService.createJob(id)];
                    case 4:
                        _e.sent();
                        _e.label = 5;
                    case 5: return [2 /*return*/, {
                            success: true,
                            message: 'Fájl sikeresen feltöltve',
                            documentId: id,
                            file: {
                                nev: file.originalname,
                                meret: file.size,
                                utvonal: relativePath,
                                mimeType: file.mimetype,
                            },
                        }];
                }
            });
        });
    };
    DocumentController.prototype.downloadFile = function (id, res, req) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, isAdmin, _a, doc, buffer;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        userId = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id;
                        isAdmin = ((_d = (_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.roles) === null || _d === void 0 ? void 0 : _d.includes('Admin')) || false;
                        return [4 /*yield*/, this.documentOps.getFileBuffer(id, userId, isAdmin)];
                    case 1:
                        _a = _e.sent(), doc = _a.doc, buffer = _a.buffer;
                        res.setHeader('Content-Type', doc.mimeType || 'application/octet-stream');
                        res.setHeader('Content-Disposition', "inline; filename=\"".concat(encodeURIComponent(doc.fajlNev), "\""));
                        res.send(buffer);
                        return [2 /*return*/];
                }
            });
        });
    };
    DocumentController.prototype.workflow = function (id, body, req) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, isAdmin;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                isAdmin = ((_c = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.roles) === null || _c === void 0 ? void 0 : _c.includes('Admin')) || false;
                return [2 /*return*/, this.documentOps.changeWorkflow(id, body.ujAllapot, {
                        megjegyzes: body.megjegyzes,
                        felelos: body.felelos,
                        userId: userId,
                        isAdmin: isAdmin,
                    })];
            });
        });
    };
    DocumentController.prototype.archive = function (id, megjegyzes, req) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, isAdmin, doc;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                        isAdmin = ((_c = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.roles) === null || _c === void 0 ? void 0 : _c.includes('Admin')) || false;
                        return [4 /*yield*/, this.documentOps.archive(id, userId, isAdmin, megjegyzes)];
                    case 1:
                        doc = _d.sent();
                        return [4 /*yield*/, this.auditService.log({
                                userId: userId,
                                esemeny: 'archive',
                                entitas: 'Document',
                                entitasId: id,
                            })];
                    case 2:
                        _d.sent();
                        return [2 /*return*/, doc];
                }
            });
        });
    };
    DocumentController.prototype.uploadVersion = function (id, file, valtoztatasLeiras, req) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, isAdmin;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                if (!file)
                    throw new common_1.BadRequestException('Nincs fájl');
                userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                isAdmin = ((_c = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.roles) === null || _c === void 0 ? void 0 : _c.includes('Admin')) || false;
                return [2 /*return*/, this.documentOps.addVersion(id, file, valtoztatasLeiras, userId, isAdmin)];
            });
        });
    };
    DocumentController.prototype.delete = function (id, req) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, isAdmin, document, error_1;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                        isAdmin = ((_c = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.roles) === null || _c === void 0 ? void 0 : _c.includes('Admin')) || false;
                        return [4 /*yield*/, this.documentService.findOne(id, userId, isAdmin)];
                    case 1:
                        document = _e.sent();
                        if (!document) {
                            throw new common_1.BadRequestException('Dokumentum nem található');
                        }
                        if (!(document.allapot === 'archivalva' && !isAdmin)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.auditService.log({
                                userId: userId,
                                esemeny: 'delete_denied',
                                entitas: 'Document',
                                entitasId: id,
                                uj: { reason: 'archived' },
                            })];
                    case 2:
                        _e.sent();
                        throw new common_1.BadRequestException('Archivált dokumentum nem törölhető');
                    case 3:
                        if (!document.fajlUtvonal) return [3 /*break*/, 7];
                        _e.label = 4;
                    case 4:
                        _e.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, this.storageService.deleteFile(document.fajlUtvonal)];
                    case 5:
                        _e.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _e.sent();
                        // Logoljuk, de nem dobunk hibát, ha a fájl nem található
                        console.warn("F\u00E1jl t\u00F6rl\u00E9se sikertelen: ".concat(document.fajlUtvonal), error_1);
                        return [3 /*break*/, 7];
                    case 7: return [4 /*yield*/, this.documentService.delete(id)];
                    case 8:
                        _e.sent();
                        return [4 /*yield*/, this.auditService.logDelete('Document', id, document, (_d = req.user) === null || _d === void 0 ? void 0 : _d.id)];
                    case 9:
                        _e.sent();
                        return [2 /*return*/, { message: 'Dokumentum sikeresen törölve' }];
                }
            });
        });
    };
    DocumentController.prototype.getFolderPath = function (id, req) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, isAdmin, document, fullPath, folderPath;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                        isAdmin = ((_c = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.roles) === null || _c === void 0 ? void 0 : _c.includes('Admin')) || false;
                        return [4 /*yield*/, this.documentService.findOne(id, userId, isAdmin)];
                    case 1:
                        document = _d.sent();
                        if (!document) {
                            throw new common_1.BadRequestException('Dokumentum nem található vagy nincs hozzáférése');
                        }
                        if (!document.fajlUtvonal) {
                            throw new common_1.BadRequestException('A dokumentumhoz nincs fájl társítva');
                        }
                        return [4 /*yield*/, this.storageService.getResolvableAbsolutePath(document.fajlUtvonal)];
                    case 2:
                        fullPath = _d.sent();
                        if (!fullPath) {
                            throw new common_1.BadRequestException('A fájl nem található a tárolóban. Lehetséges régi útvonal – töltse fel újra a dokumentumot.');
                        }
                        folderPath = require('path').dirname(fullPath);
                        return [2 /*return*/, { folderPath: folderPath, fileFound: true }];
                }
            });
        });
    };
    DocumentController.prototype.downloadOcrText = function (id, res, req) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, isAdmin, document, ocrJob, fileBuffer, filename, error_2;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                        isAdmin = ((_c = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.roles) === null || _c === void 0 ? void 0 : _c.includes('Admin')) || false;
                        return [4 /*yield*/, this.documentService.findOne(id, userId, isAdmin)];
                    case 1:
                        document = _d.sent();
                        if (!document) {
                            throw new common_1.BadRequestException('Dokumentum nem található vagy nincs hozzáférése');
                        }
                        return [4 /*yield*/, this.prisma.oCRJob.findUnique({
                                where: { documentId: id },
                            })];
                    case 2:
                        ocrJob = _d.sent();
                        if (!ocrJob || ocrJob.allapot !== 'kesz') {
                            throw new common_1.BadRequestException('OCR feldolgozás még nem készült el vagy nem található');
                        }
                        if (!ocrJob.txtFajlUtvonal) {
                            throw new common_1.BadRequestException('OCR szövegfájl nem található');
                        }
                        _d.label = 3;
                    case 3:
                        _d.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.storageService.readFile(ocrJob.txtFajlUtvonal)];
                    case 4:
                        fileBuffer = _d.sent();
                        filename = "".concat(document.fajlNev.replace(/\.[^/.]+$/, ''), "_ocr.txt");
                        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                        res.setHeader('Content-Disposition', "attachment; filename=\"".concat(encodeURIComponent(filename), "\""));
                        res.send(fileBuffer);
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _d.sent();
                        throw new common_1.BadRequestException('Nem sikerült betölteni az OCR szövegfájlt');
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    DocumentController.prototype.triggerOcr = function (id, req) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, isAdmin, document, job;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                        isAdmin = ((_c = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.roles) === null || _c === void 0 ? void 0 : _c.includes('Admin')) || false;
                        return [4 /*yield*/, this.documentService.findOne(id, userId, isAdmin)];
                    case 1:
                        document = _e.sent();
                        if (!document) {
                            throw new common_1.BadRequestException('Dokumentum nem található');
                        }
                        if (!document.fajlUtvonal) {
                            throw new common_1.BadRequestException('A dokumentumhoz nincs fájl feltöltve');
                        }
                        return [4 /*yield*/, this.ocrService.createJob(id)];
                    case 2:
                        job = _e.sent();
                        return [4 /*yield*/, this.auditService.log({
                                userId: (_d = req.user) === null || _d === void 0 ? void 0 : _d.id,
                                esemeny: 'ocr_trigger',
                                entitas: 'Document',
                                entitasId: id,
                            })];
                    case 3:
                        _e.sent();
                        return [2 /*return*/, {
                                message: 'OCR feldolgozás elindítva',
                                jobId: job.id,
                            }];
                }
            });
        });
    };
    DocumentController.prototype.addAccess = function (id, body, req) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, isAdmin, document, allowedLevels, access;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                        isAdmin = ((_c = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.roles) === null || _c === void 0 ? void 0 : _c.includes('Admin')) || false;
                        return [4 /*yield*/, this.documentService.findOne(id, userId, isAdmin)];
                    case 1:
                        document = _d.sent();
                        if (!document) {
                            throw new common_1.BadRequestException('Dokumentum nem található vagy nincs hozzáférése');
                        }
                        if (!isAdmin && document.createdById !== userId) {
                            throw new common_1.BadRequestException('Nincs jogosultsága a dokumentum hozzáférésének kezeléséhez');
                        }
                        allowedLevels = ['READ', 'EDIT', 'FULL_ACCESS', 'ADMIN'];
                        if (!allowedLevels.includes(body.jogosultsag)) {
                            throw new common_1.BadRequestException("\u00C9rv\u00E9nytelen jogosults\u00E1g. Enged\u00E9lyezett: ".concat(allowedLevels.join(', ')));
                        }
                        return [4 /*yield*/, this.prisma.documentAccess.upsert({
                                where: {
                                    documentId_userId: {
                                        documentId: id,
                                        userId: body.userId,
                                    },
                                },
                                update: {
                                    jogosultsag: body.jogosultsag,
                                },
                                create: {
                                    documentId: id,
                                    userId: body.userId,
                                    jogosultsag: body.jogosultsag,
                                },
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            nev: true,
                                            email: true,
                                        },
                                    },
                                },
                            })];
                    case 2:
                        access = _d.sent();
                        return [4 /*yield*/, this.auditService.log({
                                userId: userId,
                                esemeny: 'add_access',
                                entitas: 'Document',
                                entitasId: id,
                            })];
                    case 3:
                        _d.sent();
                        return [2 /*return*/, access];
                }
            });
        });
    };
    DocumentController.prototype.removeAccess = function (id, targetUserId, req) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, isAdmin, document;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                        isAdmin = ((_c = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.roles) === null || _c === void 0 ? void 0 : _c.includes('Admin')) || false;
                        return [4 /*yield*/, this.documentService.findOne(id, userId, isAdmin)];
                    case 1:
                        document = _d.sent();
                        if (!document) {
                            throw new common_1.BadRequestException('Dokumentum nem található vagy nincs hozzáférése');
                        }
                        if (!isAdmin && document.createdById !== userId) {
                            throw new common_1.BadRequestException('Nincs jogosultsága a dokumentum hozzáférésének kezeléséhez');
                        }
                        return [4 /*yield*/, this.prisma.documentAccess.delete({
                                where: {
                                    documentId_userId: {
                                        documentId: id,
                                        userId: targetUserId,
                                    },
                                },
                            })];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, this.auditService.log({
                                userId: userId,
                                esemeny: 'remove_access',
                                entitas: 'Document',
                                entitasId: id,
                            })];
                    case 3:
                        _d.sent();
                        return [2 /*return*/, { success: true }];
                }
            });
        });
    };
    DocumentController.prototype.findOne = function (id, req) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, isAdmin, document;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                        isAdmin = ((_c = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.roles) === null || _c === void 0 ? void 0 : _c.includes('Admin')) || false;
                        return [4 /*yield*/, this.documentService.findOne(id, userId, isAdmin)];
                    case 1:
                        document = _d.sent();
                        if (!document) {
                            throw new common_1.BadRequestException('Dokumentum nem található vagy nincs hozzáférése');
                        }
                        return [2 /*return*/, document];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)('export/:format'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.DMS_EXPORT),
        __param(0, (0, common_1.Param)('format')),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Query)()),
        __param(3, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object, Object]),
        __metadata("design:returntype", Promise)
    ], DocumentController.prototype, "exportList", null);
    __decorate([
        (0, common_1.Get)('reports/:reportType'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.DOCUMENT_VIEW),
        __param(0, (0, common_1.Param)('reportType')),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], DocumentController.prototype, "report", null);
    __decorate([
        (0, common_1.Get)('lookup/iktato/:iktatoSzam'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.DOCUMENT_VIEW),
        __param(0, (0, common_1.Param)('iktatoSzam')),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], DocumentController.prototype, "lookupIktato", null);
    __decorate([
        (0, common_1.Get)('ocr-jobs'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.DOCUMENT_VIEW),
        __param(0, (0, common_1.Query)('skip')),
        __param(1, (0, common_1.Query)('take')),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, Object]),
        __metadata("design:returntype", Promise)
    ], DocumentController.prototype, "ocrJobs", null);
    __decorate([
        (0, common_1.Get)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.DOCUMENT_VIEW),
        __param(0, (0, common_1.Query)('skip')),
        __param(1, (0, common_1.Query)('take')),
        __param(2, (0, common_1.Query)('categoryId')),
        __param(3, (0, common_1.Query)('allapot')),
        __param(4, (0, common_1.Query)('accountId')),
        __param(5, (0, common_1.Query)('irany')),
        __param(6, (0, common_1.Query)('search')),
        __param(7, (0, common_1.Query)('tagId')),
        __param(8, (0, common_1.Query)('opportunityId')),
        __param(9, (0, common_1.Query)('quoteId')),
        __param(10, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String, String, Object]),
        __metadata("design:returntype", void 0)
    ], DocumentController.prototype, "findAll", null);
    __decorate([
        (0, common_1.Get)('versions/:versionId/file'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.DMS_DOWNLOAD),
        __param(0, (0, common_1.Param)('versionId')),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], DocumentController.prototype, "downloadVersion", null);
    __decorate([
        (0, common_1.Post)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.DOCUMENT_CREATE),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], DocumentController.prototype, "create", null);
    __decorate([
        (0, common_1.Put)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.DOCUMENT_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], DocumentController.prototype, "update", null);
    __decorate([
        (0, common_1.Post)(':id/upload'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.DMS_UPLOAD),
        (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
            limits: {
                fileSize: 50 * 1024 * 1024,
            },
            fileFilter: function (req, file, callback) {
                var allowedMimeTypes = [
                    'application/pdf',
                    'image/jpeg',
                    'image/png',
                    'image/gif',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'text/plain',
                ];
                if (allowedMimeTypes.includes(file.mimetype)) {
                    callback(null, true);
                }
                else {
                    callback(new common_1.BadRequestException('Nem támogatott fájltípus'), false);
                }
            },
        })),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.UploadedFile)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], DocumentController.prototype, "upload", null);
    __decorate([
        (0, common_1.Get)(':id/download'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.DMS_DOWNLOAD),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], DocumentController.prototype, "downloadFile", null);
    __decorate([
        (0, common_1.Post)(':id/workflow'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.DOCUMENT_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], DocumentController.prototype, "workflow", null);
    __decorate([
        (0, common_1.Post)(':id/archive'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.DOCUMENT_ARCHIVE),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)('megjegyzes')),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, Object]),
        __metadata("design:returntype", Promise)
    ], DocumentController.prototype, "archive", null);
    __decorate([
        (0, common_1.Post)(':id/versions'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.DMS_VERSION),
        (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { limits: { fileSize: 50 * 1024 * 1024 } })),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.UploadedFile)()),
        __param(2, (0, common_1.Body)('valtoztatasLeiras')),
        __param(3, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, String, Object]),
        __metadata("design:returntype", Promise)
    ], DocumentController.prototype, "uploadVersion", null);
    __decorate([
        (0, common_1.Delete)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.DOCUMENT_DELETE),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], DocumentController.prototype, "delete", null);
    __decorate([
        (0, common_1.Get)(':id/folder-path'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.DOCUMENT_VIEW),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], DocumentController.prototype, "getFolderPath", null);
    __decorate([
        (0, common_1.Get)(':id/ocr/download'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.DOCUMENT_VIEW),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], DocumentController.prototype, "downloadOcrText", null);
    __decorate([
        (0, common_1.Post)(':id/ocr'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.DOCUMENT_OCR),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], DocumentController.prototype, "triggerOcr", null);
    __decorate([
        (0, common_1.Post)(':id/access'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.DOCUMENT_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], DocumentController.prototype, "addAccess", null);
    __decorate([
        (0, common_1.Delete)(':id/access/:userId'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.DOCUMENT_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Param)('userId')),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, Object]),
        __metadata("design:returntype", Promise)
    ], DocumentController.prototype, "removeAccess", null);
    __decorate([
        (0, common_1.Get)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.DOCUMENT_VIEW),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], DocumentController.prototype, "findOne", null);
    DocumentController = __decorate([
        (0, common_1.Controller)('dms/documents'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [document_service_1.DocumentService,
            audit_service_1.AuditService,
            storage_service_1.StorageService,
            ocr_service_1.OcrService,
            prisma_service_1.PrismaService,
            document_operations_service_1.DocumentOperationsService])
    ], DocumentController);
    return DocumentController;
}());
exports.DocumentController = DocumentController;
