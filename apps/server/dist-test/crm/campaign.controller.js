"use strict";
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
exports.CampaignController = void 0;
var common_1 = require("@nestjs/common");
var campaign_service_1 = require("./campaign.service");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var permission_enum_1 = require("../common/rbac/permission.enum");
var rbac_guard_1 = require("../common/rbac/rbac.guard");
var audit_service_1 = require("../common/audit/audit.service");
var ExcelJS = __importStar(require("exceljs"));
var CampaignController = /** @class */ (function () {
    function CampaignController(campaignService, auditService) {
        this.campaignService = campaignService;
        this.auditService = auditService;
    }
    CampaignController.prototype.findAll = function (skipParam, takeParam, tipus, allapot, iparag, regio, kezdetDatum, befejezesDatum) {
        return __awaiter(this, void 0, void 0, function () {
            var skip, take, filters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        skip = skipParam ? parseInt(skipParam, 10) : 0;
                        take = takeParam ? parseInt(takeParam, 10) : 50;
                        if (isNaN(skip) || skip < 0) {
                            throw new common_1.BadRequestException('Invalid skip parameter');
                        }
                        if (isNaN(take) || take < 1) {
                            throw new common_1.BadRequestException('Invalid take parameter');
                        }
                        filters = {};
                        if (tipus)
                            filters.tipus = tipus;
                        if (allapot)
                            filters.allapot = allapot;
                        if (iparag)
                            filters.iparag = iparag;
                        if (regio)
                            filters.regio = regio;
                        if (kezdetDatum)
                            filters.kezdetDatum = kezdetDatum;
                        if (befejezesDatum)
                            filters.befejezesDatum = befejezesDatum;
                        return [4 /*yield*/, this.campaignService.findAll(skip, take, filters)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CampaignController.prototype.exportCampaigns = function (format, res, tipus, allapot, iparag, regio, kezdetDatum, befejezesDatum) {
        return __awaiter(this, void 0, void 0, function () {
            var filters, campaigns, csvHeaders, csvRows, csvContent, workbook, worksheet_1, buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filters = {};
                        if (tipus)
                            filters.tipus = tipus;
                        if (allapot)
                            filters.allapot = allapot;
                        if (iparag)
                            filters.iparag = iparag;
                        if (regio)
                            filters.regio = regio;
                        if (kezdetDatum)
                            filters.kezdetDatum = kezdetDatum;
                        if (befejezesDatum)
                            filters.befejezesDatum = befejezesDatum;
                        return [4 /*yield*/, this.campaignService.exportCampaigns(filters, format)];
                    case 1:
                        campaigns = _a.sent();
                        if (!(format === 'csv')) return [3 /*break*/, 2];
                        csvHeaders = [
                            'Kampány neve',
                            'Típus',
                            'Állapot',
                            'Kezdés dátuma',
                            'Befejezés dátuma',
                            'Költségvetés',
                            'Létrehozta',
                            'Célcsoportok száma',
                            'Leadek száma',
                        ];
                        csvRows = campaigns.map(function (campaign) {
                            var _a, _b, _c, _d, _e, _f;
                            return [
                                campaign.nev,
                                campaign.tipus,
                                campaign.allapot,
                                campaign.kezdetDatum.toISOString().split('T')[0],
                                campaign.befejezesDatum ? campaign.befejezesDatum.toISOString().split('T')[0] : '',
                                ((_a = campaign.koltsegvetes) === null || _a === void 0 ? void 0 : _a.toString()) || '',
                                ((_b = campaign.createdBy) === null || _b === void 0 ? void 0 : _b.nev) || '',
                                ((_d = (_c = campaign._count) === null || _c === void 0 ? void 0 : _c.accounts) === null || _d === void 0 ? void 0 : _d.toString()) || '0',
                                ((_f = (_e = campaign._count) === null || _e === void 0 ? void 0 : _e.leads) === null || _f === void 0 ? void 0 : _f.toString()) || '0',
                            ];
                        });
                        csvContent = __spreadArray([
                            csvHeaders.join(',')
                        ], csvRows.map(function (row) { return row.map(function (cell) { return "\"".concat(cell, "\""); }).join(','); }), true).join('\n');
                        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
                        res.setHeader('Content-Disposition', "attachment; filename=\"kampanyok_".concat(new Date().toISOString().split('T')[0], ".csv\""));
                        res.send('\ufeff' + csvContent); // BOM for Excel compatibility
                        return [3 /*break*/, 4];
                    case 2:
                        workbook = new ExcelJS.Workbook();
                        worksheet_1 = workbook.addWorksheet('Kampányok');
                        // Headers
                        worksheet_1.addRow([
                            'Kampány neve',
                            'Típus',
                            'Állapot',
                            'Kezdés dátuma',
                            'Befejezés dátuma',
                            'Költségvetés',
                            'Létrehozta',
                            'Célcsoportok száma',
                            'Leadek száma',
                        ]);
                        worksheet_1.getRow(1).font = { bold: true };
                        worksheet_1.getRow(1).fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFD3D3D3' },
                        };
                        // Data rows
                        campaigns.forEach(function (campaign) {
                            var _a, _b, _c;
                            worksheet_1.addRow([
                                campaign.nev,
                                campaign.tipus,
                                campaign.allapot,
                                campaign.kezdetDatum.toISOString().split('T')[0],
                                campaign.befejezesDatum ? campaign.befejezesDatum.toISOString().split('T')[0] : '',
                                campaign.koltsegvetes || 0,
                                ((_a = campaign.createdBy) === null || _a === void 0 ? void 0 : _a.nev) || '',
                                ((_b = campaign._count) === null || _b === void 0 ? void 0 : _b.accounts) || 0,
                                ((_c = campaign._count) === null || _c === void 0 ? void 0 : _c.leads) || 0,
                            ]);
                        });
                        // Adjust column widths
                        worksheet_1.columns.forEach(function (column, i) {
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
                    case 3:
                        buffer = _a.sent();
                        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        res.setHeader('Content-Disposition', "attachment; filename=\"kampanyok_".concat(new Date().toISOString().split('T')[0], ".xlsx\""));
                        res.end(buffer);
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CampaignController.prototype.resultsReport = function (campaignId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.campaignService.getResultsReport(campaignId)];
            });
        });
    };
    CampaignController.prototype.close = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var old, campaign;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.campaignService.findOne(id)];
                    case 1:
                        old = _a.sent();
                        return [4 /*yield*/, this.campaignService.close(id)];
                    case 2:
                        campaign = _a.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('Campaign', id, old, { allapot: 'lezart' })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, campaign];
                }
            });
        });
    };
    CampaignController.prototype.selectAudience = function (id, filters) {
        return __awaiter(this, void 0, void 0, function () {
            var campaign;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.campaignService.selectAudience(id, filters)];
                    case 1:
                        campaign = _a.sent();
                        return [4 /*yield*/, this.auditService.log({
                                esemeny: 'update',
                                entitas: 'CampaignAudience',
                                entitasId: id,
                                uj: filters,
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, campaign];
                }
            });
        });
    };
    CampaignController.prototype.feedback = function (id, accountId, visszajelzes) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.campaignService.setFeedback(id, accountId, visszajelzes)];
            });
        });
    };
    CampaignController.prototype.exportAudience = function (id, format, res) {
        return __awaiter(this, void 0, void 0, function () {
            var rows, header, lines, workbook, sheet, buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.campaignService.exportAudience(id, format)];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [4 /*yield*/, this.auditService.log({
                                esemeny: 'export',
                                entitas: 'CampaignAudience',
                                entitasId: id,
                                uj: { format: format },
                            })];
                    case 2:
                        _a.sent();
                        if (format === 'csv') {
                            header = 'UgyfelAzonosito,UgyfelNev,Email,Telefon,Visszajelzes,KapcsolatNev,KapcsolatEmail';
                            lines = rows.map(function (r) {
                                var c = r.account.contacts[0];
                                return [
                                    r.account.azonosito,
                                    r.account.nev,
                                    r.account.email || '',
                                    r.account.telefon || '',
                                    r.visszajelzes || '',
                                    (c === null || c === void 0 ? void 0 : c.nev) || '',
                                    (c === null || c === void 0 ? void 0 : c.email) || '',
                                ]
                                    .map(function (x) { return "\"".concat(x, "\""); })
                                    .join(',');
                            });
                            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
                            res.send('\ufeff' + __spreadArray([header], lines, true).join('\n'));
                            return [2 /*return*/];
                        }
                        workbook = new ExcelJS.Workbook();
                        sheet = workbook.addWorksheet('Celkozonseg');
                        sheet.addRow(['Azonosító', 'Név', 'Email', 'Telefon', 'Visszajelzés']);
                        rows.forEach(function (r) {
                            return sheet.addRow([
                                r.account.azonosito,
                                r.account.nev,
                                r.account.email,
                                r.account.telefon,
                                r.visszajelzes,
                            ]);
                        });
                        return [4 /*yield*/, workbook.xlsx.writeBuffer()];
                    case 3:
                        buffer = _a.sent();
                        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        res.end(buffer);
                        return [2 /*return*/];
                }
            });
        });
    };
    CampaignController.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.campaignService.findOne(id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CampaignController.prototype.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var campaign;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.campaignService.create(data)];
                    case 1:
                        campaign = _a.sent();
                        return [4 /*yield*/, this.auditService.logCreate('Campaign', campaign.id, data)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, campaign];
                }
            });
        });
    };
    CampaignController.prototype.update = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var old, campaign;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.campaignService.findOne(id)];
                    case 1:
                        old = _a.sent();
                        return [4 /*yield*/, this.campaignService.update(id, data)];
                    case 2:
                        campaign = _a.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('Campaign', id, old, data)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, campaign];
                }
            });
        });
    };
    CampaignController.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var old;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.campaignService.findOne(id)];
                    case 1:
                        old = _a.sent();
                        return [4 /*yield*/, this.campaignService.delete(id)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.auditService.logDelete('Campaign', id, old)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, { message: 'Kampány törölve' }];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.CAMPAIGN_VIEW),
        __param(0, (0, common_1.Query)('skip')),
        __param(1, (0, common_1.Query)('take')),
        __param(2, (0, common_1.Query)('tipus')),
        __param(3, (0, common_1.Query)('allapot')),
        __param(4, (0, common_1.Query)('iparag')),
        __param(5, (0, common_1.Query)('regio')),
        __param(6, (0, common_1.Query)('kezdetDatum')),
        __param(7, (0, common_1.Query)('befejezesDatum')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String, String, String, String, String, String]),
        __metadata("design:returntype", Promise)
    ], CampaignController.prototype, "findAll", null);
    __decorate([
        (0, common_1.Get)('export/:format'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.CAMPAIGN_VIEW),
        __param(0, (0, common_1.Param)('format')),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Query)('tipus')),
        __param(3, (0, common_1.Query)('allapot')),
        __param(4, (0, common_1.Query)('iparag')),
        __param(5, (0, common_1.Query)('regio')),
        __param(6, (0, common_1.Query)('kezdetDatum')),
        __param(7, (0, common_1.Query)('befejezesDatum')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, String, String, String, String, String, String]),
        __metadata("design:returntype", Promise)
    ], CampaignController.prototype, "exportCampaigns", null);
    __decorate([
        (0, common_1.Get)('report/results'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.CAMPAIGN_VIEW),
        __param(0, (0, common_1.Query)('campaignId')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], CampaignController.prototype, "resultsReport", null);
    __decorate([
        (0, common_1.Post)(':id/close'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.CAMPAIGN_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], CampaignController.prototype, "close", null);
    __decorate([
        (0, common_1.Post)(':id/audience/select'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.CAMPAIGN_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], CampaignController.prototype, "selectAudience", null);
    __decorate([
        (0, common_1.Post)(':id/audience/:accountId/feedback'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.CAMPAIGN_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Param)('accountId')),
        __param(2, (0, common_1.Body)('visszajelzes')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String]),
        __metadata("design:returntype", Promise)
    ], CampaignController.prototype, "feedback", null);
    __decorate([
        (0, common_1.Get)(':id/audience/export/:format'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.CAMPAIGN_VIEW),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Param)('format')),
        __param(2, (0, common_1.Res)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, Object]),
        __metadata("design:returntype", Promise)
    ], CampaignController.prototype, "exportAudience", null);
    __decorate([
        (0, common_1.Get)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.CAMPAIGN_VIEW),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], CampaignController.prototype, "findOne", null);
    __decorate([
        (0, common_1.Post)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.CAMPAIGN_CREATE),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], CampaignController.prototype, "create", null);
    __decorate([
        (0, common_1.Put)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.CAMPAIGN_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], CampaignController.prototype, "update", null);
    __decorate([
        (0, common_1.Delete)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.CAMPAIGN_DELETE),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], CampaignController.prototype, "delete", null);
    CampaignController = __decorate([
        (0, common_1.Controller)('crm/campaigns'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [campaign_service_1.CampaignService,
            audit_service_1.AuditService])
    ], CampaignController);
    return CampaignController;
}());
exports.CampaignController = CampaignController;
