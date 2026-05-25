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
exports.ReportCatalogService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var report_export_service_1 = require("./report-export.service");
var DEFAULT_TEMPLATES = [
    { kod: 'crm.pipeline', nev: 'CRM pipeline', kategoria: 'CRM', exportFormats: 'csv,xlsx' },
    { kod: 'crm.campaigns', nev: 'Kampány összesítő', kategoria: 'CRM', exportFormats: 'csv,xlsx' },
    { kod: 'crm.tickets', nev: 'Reklamációk', kategoria: 'CRM', exportFormats: 'csv,xlsx' },
    { kod: 'dms.status', nev: 'Dokumentum állapot', kategoria: 'DMS', exportFormats: 'csv,xlsx' },
    { kod: 'dms.ocr', nev: 'OCR státusz', kategoria: 'DMS', exportFormats: 'csv,xlsx' },
    { kod: 'hr.employees', nev: 'Dolgozói lista', kategoria: 'HR', exportFormats: 'csv,xlsx' },
    { kod: 'hr.medical', nev: 'Orvosi lejárat', kategoria: 'HR', exportFormats: 'csv,xlsx' },
    { kod: 'logistics.stock', nev: 'Aktuális készlet', kategoria: 'LOGISTICS', exportFormats: 'csv,xlsx' },
    { kod: 'logistics.purchase', nev: 'Beszerzési rendelések', kategoria: 'LOGISTICS', exportFormats: 'csv,xlsx' },
    { kod: 'system.audit', nev: 'Audit napló', kategoria: 'SYSTEM', exportFormats: 'csv,xlsx' },
];
var ReportCatalogService = /** @class */ (function () {
    function ReportCatalogService(prisma, exportService) {
        this.prisma = prisma;
        this.exportService = exportService;
    }
    ReportCatalogService.prototype.onModuleInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.ensureDefaultTemplates()];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ReportCatalogService.prototype.ensureDefaultTemplates = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, DEFAULT_TEMPLATES_1, t;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, DEFAULT_TEMPLATES_1 = DEFAULT_TEMPLATES;
                        _a.label = 1;
                    case 1:
                        if (!(_i < DEFAULT_TEMPLATES_1.length)) return [3 /*break*/, 4];
                        t = DEFAULT_TEMPLATES_1[_i];
                        return [4 /*yield*/, this.prisma.reportTemplate.upsert({
                                where: { kod: t.kod },
                                update: { nev: t.nev, kategoria: t.kategoria, exportFormats: t.exportFormats, aktiv: true },
                                create: __assign(__assign({}, t), { leiras: "El\u0151re defini\u00E1lt riport: ".concat(t.nev) }),
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ReportCatalogService.prototype.listTemplates = function (kategoria) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.reportTemplate.findMany({
                        where: __assign({ aktiv: true }, (kategoria ? { kategoria: kategoria } : {})),
                        orderBy: [{ kategoria: 'asc' }, { nev: 'asc' }],
                    })];
            });
        });
    };
    ReportCatalogService.prototype.runReport = function (kod, format, userId, params) {
        return __awaiter(this, void 0, void 0, function () {
            var template, data, buffer, contentType, csv, filename, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.prisma.reportTemplate.findUnique({ where: { kod: kod } })];
                    case 1:
                        template = _b.sent();
                        if (!template)
                            throw new Error("Ismeretlen riport: ".concat(kod));
                        return [4 /*yield*/, this.buildReportData(kod, params)];
                    case 2:
                        data = _b.sent();
                        if (!(format === 'csv')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.exportService.exportToCsv(data)];
                    case 3:
                        csv = _b.sent();
                        buffer = Buffer.from('\uFEFF' + csv, 'utf-8');
                        contentType = 'text/csv; charset=utf-8';
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.exportService.exportToExcel(data)];
                    case 5:
                        buffer = _b.sent();
                        contentType =
                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                        _b.label = 6;
                    case 6:
                        filename = "".concat(kod, "_").concat(new Date().toISOString().split('T')[0], ".").concat(format === 'csv' ? 'csv' : 'xlsx');
                        _b.label = 7;
                    case 7:
                        _b.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, this.prisma.reportExecution.create({
                                data: {
                                    reportTemplateId: template.id,
                                    executedById: userId,
                                    parameterek: params ? JSON.stringify(params) : null,
                                    formatum: format,
                                },
                            })];
                    case 8:
                        _b.sent();
                        return [3 /*break*/, 10];
                    case 9:
                        _a = _b.sent();
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/, { buffer: buffer, contentType: contentType, filename: filename }];
                }
            });
        });
    };
    ReportCatalogService.prototype.buildReportData = function (kod, _params) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, rows, rows, rows, rows, rows, rows, in60, rows, rows, rows, rows;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = kod;
                        switch (_a) {
                            case 'crm.pipeline': return [3 /*break*/, 1];
                            case 'crm.campaigns': return [3 /*break*/, 3];
                            case 'crm.tickets': return [3 /*break*/, 5];
                            case 'dms.status': return [3 /*break*/, 7];
                            case 'dms.ocr': return [3 /*break*/, 9];
                            case 'hr.employees': return [3 /*break*/, 11];
                            case 'hr.medical': return [3 /*break*/, 13];
                            case 'logistics.stock': return [3 /*break*/, 15];
                            case 'logistics.purchase': return [3 /*break*/, 17];
                            case 'system.audit': return [3 /*break*/, 19];
                        }
                        return [3 /*break*/, 21];
                    case 1: return [4 /*yield*/, this.prisma.opportunity.findMany({
                            include: { account: { select: { nev: true } } },
                            take: 5000,
                        })];
                    case 2:
                        rows = _b.sent();
                        return [2 /*return*/, {
                                title: 'CRM Pipeline',
                                headers: ['Név', 'Ügyfél', 'Szakasz', 'Érték', 'Valószínűség'],
                                rows: rows.map(function (o) {
                                    var _a;
                                    return [
                                        o.nev,
                                        ((_a = o.account) === null || _a === void 0 ? void 0 : _a.nev) || '',
                                        o.szakasz,
                                        o.ertek,
                                        o.valoszinuseg,
                                    ];
                                }),
                            }];
                    case 3: return [4 /*yield*/, this.prisma.campaign.findMany({ take: 1000 })];
                    case 4:
                        rows = _b.sent();
                        return [2 /*return*/, {
                                title: 'Kampányok',
                                headers: ['Név', 'Típus', 'Állapot', 'Kezdet'],
                                rows: rows.map(function (c) { return [c.nev, c.tipus, c.allapot, c.kezdetDatum.toISOString().split('T')[0]]; }),
                            }];
                    case 5: return [4 /*yield*/, this.prisma.ticket.findMany({ take: 2000 })];
                    case 6:
                        rows = _b.sent();
                        return [2 /*return*/, {
                                title: 'Reklamációk',
                                headers: ['Azonosító', 'Tárgy', 'Típus', 'Állapot'],
                                rows: rows.map(function (t) { return [t.azonosito, t.targy, t.tipus, t.allapot]; }),
                            }];
                    case 7: return [4 /*yield*/, this.prisma.document.findMany({ take: 3000 })];
                    case 8:
                        rows = _b.sent();
                        return [2 /*return*/, {
                                title: 'Dokumentum állapot',
                                headers: ['Név', 'Állapot', 'Lejárat', 'Iktatószám'],
                                rows: rows.map(function (d) { return [
                                    d.nev,
                                    d.allapot,
                                    d.lejarat ? d.lejarat.toISOString().split('T')[0] : '',
                                    d.iktatoSzam || '',
                                ]; }),
                            }];
                    case 9: return [4 /*yield*/, this.prisma.oCRJob.findMany({ include: { document: true }, take: 2000 })];
                    case 10:
                        rows = _b.sent();
                        return [2 /*return*/, {
                                title: 'OCR állapot',
                                headers: ['Dokumentum', 'Állapot', 'Pontosság'],
                                rows: rows.map(function (j) { var _a, _b; return [((_a = j.document) === null || _a === void 0 ? void 0 : _a.nev) || '', j.allapot, (_b = j.pontossag) !== null && _b !== void 0 ? _b : '']; }),
                            }];
                    case 11: return [4 /*yield*/, this.prisma.employee.findMany({
                            where: { aktiv: true },
                            include: { jobPosition: true },
                        })];
                    case 12:
                        rows = _b.sent();
                        return [2 /*return*/, {
                                title: 'Dolgozók',
                                headers: ['Azonosító', 'Név', 'Munkakör', 'Állapot'],
                                rows: rows.map(function (e) {
                                    var _a;
                                    return [
                                        e.azonosito,
                                        "".concat(e.vezetekNev, " ").concat(e.keresztNev),
                                        ((_a = e.jobPosition) === null || _a === void 0 ? void 0 : _a.nev) || '',
                                        e.allapot,
                                    ];
                                }),
                            }];
                    case 13:
                        in60 = new Date();
                        in60.setDate(in60.getDate() + 60);
                        return [4 /*yield*/, this.prisma.medicalExamination.findMany({
                                where: { ervenyessegVege: { lte: in60 } },
                                include: { employee: true },
                            })];
                    case 14:
                        rows = _b.sent();
                        return [2 /*return*/, {
                                title: 'Orvosi lejárat',
                                headers: ['Dolgozó', 'Lejárat', 'Eredmény'],
                                rows: rows.map(function (m) {
                                    var _a;
                                    return [
                                        m.employee ? "".concat(m.employee.vezetekNev, " ").concat(m.employee.keresztNev) : '',
                                        ((_a = m.ervenyessegVege) === null || _a === void 0 ? void 0 : _a.toISOString().split('T')[0]) || '',
                                        m.eredmeny || '',
                                    ];
                                }),
                            }];
                    case 15: return [4 /*yield*/, this.prisma.stockLevel.findMany({
                            include: { item: true, warehouse: true },
                        })];
                    case 16:
                        rows = _b.sent();
                        return [2 /*return*/, {
                                title: 'Készlet',
                                headers: ['Cikk', 'Raktár', 'Mennyiség'],
                                rows: rows.map(function (s) { var _a, _b; return [((_a = s.item) === null || _a === void 0 ? void 0 : _a.nev) || '', ((_b = s.warehouse) === null || _b === void 0 ? void 0 : _b.nev) || '', s.mennyiseg]; }),
                            }];
                    case 17: return [4 /*yield*/, this.prisma.purchaseOrder.findMany({
                            include: { supplier: true },
                        })];
                    case 18:
                        rows = _b.sent();
                        return [2 /*return*/, {
                                title: 'Beszerzések',
                                headers: ['Azonosító', 'Szállító', 'Állapot', 'Összeg'],
                                rows: rows.map(function (p) { var _a; return [p.azonosito, ((_a = p.supplier) === null || _a === void 0 ? void 0 : _a.nev) || '', p.allapot, p.vegosszeg]; }),
                            }];
                    case 19: return [4 /*yield*/, this.prisma.auditLog.findMany({
                            take: 5000,
                            orderBy: { createdAt: 'desc' },
                            include: { user: { select: { nev: true, email: true } } },
                        })];
                    case 20:
                        rows = _b.sent();
                        return [2 /*return*/, {
                                title: 'Audit napló',
                                headers: ['Idő', 'Esemény', 'Entitás', 'Felhasználó'],
                                rows: rows.map(function (a) {
                                    var _a, _b;
                                    return [
                                        a.createdAt.toISOString(),
                                        a.esemeny,
                                        a.entitas,
                                        ((_a = a.user) === null || _a === void 0 ? void 0 : _a.nev) || ((_b = a.user) === null || _b === void 0 ? void 0 : _b.email) || '',
                                    ];
                                }),
                            }];
                    case 21: return [2 /*return*/, { headers: ['Info'], rows: [['Nincs adat']] }];
                }
            });
        });
    };
    ReportCatalogService.prototype.runAdHoc = function (config, format) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, headers, rows, data, csv;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.buildAdHocRows(config)];
                    case 1:
                        _a = _c.sent(), headers = _a.headers, rows = _a.rows;
                        data = { title: "Ad-hoc ".concat(config.module), headers: headers, rows: rows };
                        if (!(format === 'csv')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.exportService.exportToCsv(data)];
                    case 2:
                        csv = _c.sent();
                        return [2 /*return*/, {
                                buffer: Buffer.from('\uFEFF' + csv, 'utf-8'),
                                contentType: 'text/csv; charset=utf-8',
                                filename: "adhoc_".concat(config.module, ".csv"),
                            }];
                    case 3:
                        _b = {};
                        return [4 /*yield*/, this.exportService.exportToExcel(data)];
                    case 4: return [2 /*return*/, (_b.buffer = _c.sent(),
                            _b.contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            _b.filename = "adhoc_".concat(config.module, ".xlsx"),
                            _b)];
                }
            });
        });
    };
    ReportCatalogService.prototype.buildAdHocRows = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var kod, map, reportKod, full, fieldIdx, headers, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        kod = "".concat(config.module.toLowerCase(), ".pipeline");
                        map = {
                            CRM: 'crm.pipeline',
                            DMS: 'dms.status',
                            HR: 'hr.employees',
                            LOGISTICS: 'logistics.stock',
                            SYSTEM: 'system.audit',
                        };
                        reportKod = map[config.module.toUpperCase()] || 'system.audit';
                        return [4 /*yield*/, this.buildReportData(reportKod)];
                    case 1:
                        full = _a.sent();
                        fieldIdx = config.fields.map(function (f) { return full.headers.indexOf(f); }).filter(function (i) { return i >= 0; });
                        headers = fieldIdx.length ? config.fields : full.headers;
                        rows = full.rows.map(function (row) {
                            return fieldIdx.length ? fieldIdx.map(function (i) { return row[i]; }) : row;
                        });
                        return [2 /*return*/, { headers: headers, rows: rows }];
                }
            });
        });
    };
    ReportCatalogService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService,
            report_export_service_1.ReportExportService])
    ], ReportCatalogService);
    return ReportCatalogService;
}());
exports.ReportCatalogService = ReportCatalogService;
