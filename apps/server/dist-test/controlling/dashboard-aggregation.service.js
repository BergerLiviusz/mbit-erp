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
exports.DashboardAggregationService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var DashboardAggregationService = /** @class */ (function () {
    function DashboardAggregationService(prisma) {
        this.prisma = prisma;
    }
    DashboardAggregationService.prototype.getDashboard = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var mod, cards, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, charts;
            return __generator(this, function (_r) {
                switch (_r.label) {
                    case 0:
                        mod = filters === null || filters === void 0 ? void 0 : filters.module;
                        cards = [];
                        if (!(!mod || mod === 'CRM')) return [3 /*break*/, 2];
                        _b = (_a = cards.push).apply;
                        _c = [cards];
                        return [4 /*yield*/, this.crmKpis()];
                    case 1:
                        _b.apply(_a, _c.concat([(_r.sent())]));
                        _r.label = 2;
                    case 2:
                        if (!(!mod || mod === 'DMS')) return [3 /*break*/, 4];
                        _e = (_d = cards.push).apply;
                        _f = [cards];
                        return [4 /*yield*/, this.dmsKpis()];
                    case 3:
                        _e.apply(_d, _f.concat([(_r.sent())]));
                        _r.label = 4;
                    case 4:
                        if (!(!mod || mod === 'HR')) return [3 /*break*/, 6];
                        _h = (_g = cards.push).apply;
                        _j = [cards];
                        return [4 /*yield*/, this.hrKpis()];
                    case 5:
                        _h.apply(_g, _j.concat([(_r.sent())]));
                        _r.label = 6;
                    case 6:
                        if (!(!mod || mod === 'LOGISTICS')) return [3 /*break*/, 8];
                        _l = (_k = cards.push).apply;
                        _m = [cards];
                        return [4 /*yield*/, this.logisticsKpis()];
                    case 7:
                        _l.apply(_k, _m.concat([(_r.sent())]));
                        _r.label = 8;
                    case 8:
                        if (!(!mod || mod === 'SYSTEM')) return [3 /*break*/, 10];
                        _p = (_o = cards.push).apply;
                        _q = [cards];
                        return [4 /*yield*/, this.systemKpis()];
                    case 9:
                        _p.apply(_o, _q.concat([(_r.sent())]));
                        _r.label = 10;
                    case 10: return [4 /*yield*/, this.buildCharts(mod)];
                    case 11:
                        charts = _r.sent();
                        return [4 /*yield*/, this.saveSnapshots(cards)];
                    case 12:
                        _r.sent();
                        return [2 /*return*/, {
                                generatedAt: new Date().toISOString(),
                                filters: filters || {},
                                kpis: cards,
                                charts: charts,
                            }];
                }
            });
        });
    };
    DashboardAggregationService.prototype.crmKpis = function () {
        return __awaiter(this, void 0, void 0, function () {
            var closedStages, openOpps, openValue, closed, pipeline, feedbackTotal, positive, conversion;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        closedStages = ['WON', 'LOST', 'CLOSED', 'lezart', 'vesztett', 'nyert'];
                        return [4 /*yield*/, this.prisma.opportunity.findMany({
                                where: { szakasz: { notIn: closedStages } },
                            })];
                    case 1:
                        openOpps = _a.sent();
                        openValue = openOpps.reduce(function (s, o) { return s + (o.ertek || 0); }, 0);
                        return [4 /*yield*/, this.prisma.opportunity.count({
                                where: { szakasz: { in: ['WON', 'CLOSED', 'nyert', 'lezart'] } },
                            })];
                    case 2:
                        closed = _a.sent();
                        return [4 /*yield*/, this.prisma.opportunity.aggregate({ _sum: { ertek: true } })];
                    case 3:
                        pipeline = _a.sent();
                        return [4 /*yield*/, this.prisma.campaignAccount.count()];
                    case 4:
                        feedbackTotal = _a.sent();
                        return [4 /*yield*/, this.prisma.campaignAccount.count({
                                where: {
                                    visszajelzes: { in: ['POSITIVE', 'pozitiv', 'IGEN', 'erdeklodik', 'pozitív'] },
                                },
                            })];
                    case 5:
                        positive = _a.sent();
                        conversion = feedbackTotal > 0 ? Math.round((positive / feedbackTotal) * 100) : 0;
                        return [2 /*return*/, [
                                { code: 'crm.open_opportunity_value', name: 'Nyitott opportunity érték', category: 'CRM', value: openValue, unit: 'HUF' },
                                { code: 'crm.closed_opportunities', name: 'Lezárt opportunity', category: 'CRM', value: closed },
                                { code: 'crm.pipeline_total', name: 'Pipeline összérték', category: 'CRM', value: pipeline._sum.ertek || 0, unit: 'HUF' },
                                { code: 'crm.campaign_conversion', name: 'Kampány konverzió', category: 'CRM', value: conversion, unit: '%' },
                            ]];
                }
            });
        });
    };
    DashboardAggregationService.prototype.dmsKpis = function () {
        return __awaiter(this, void 0, void 0, function () {
            var openDocs, in30, expiring, ocrErrors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.document.count({
                            where: { allapot: { notIn: ['ARCHIVED', 'SELEJT', 'CLOSED'] } },
                        })];
                    case 1:
                        openDocs = _a.sent();
                        in30 = new Date();
                        in30.setDate(in30.getDate() + 30);
                        return [4 /*yield*/, this.prisma.document.count({
                                where: { lejarat: { lte: in30, gte: new Date() } },
                            })];
                    case 2:
                        expiring = _a.sent();
                        return [4 /*yield*/, this.prisma.oCRJob.count({
                                where: { allapot: { in: ['ERROR', 'FAILED', 'HIBA'] } },
                            })];
                    case 3:
                        ocrErrors = _a.sent();
                        return [2 /*return*/, [
                                { code: 'dms.open_documents', name: 'Nyitott dokumentumok', category: 'DMS', value: openDocs },
                                { code: 'dms.expiring_documents', name: 'Lejáró dokumentumok (30 nap)', category: 'DMS', value: expiring, status: expiring > 0 ? 'warning' : 'ok' },
                                { code: 'dms.ocr_errors', name: 'OCR hibák', category: 'DMS', value: ocrErrors, status: ocrErrors > 0 ? 'critical' : 'ok' },
                            ]];
                }
            });
        });
    };
    DashboardAggregationService.prototype.hrKpis = function () {
        return __awaiter(this, void 0, void 0, function () {
            var active, in60, medical, contracts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.employee.count({ where: { aktiv: true } })];
                    case 1:
                        active = _a.sent();
                        in60 = new Date();
                        in60.setDate(in60.getDate() + 60);
                        return [4 /*yield*/, this.prisma.medicalExamination.count({
                                where: {
                                    ervenyessegVege: { lte: in60, gte: new Date() },
                                },
                            })];
                    case 2:
                        medical = _a.sent();
                        return [4 /*yield*/, this.prisma.employmentContract.count({
                                where: {
                                    aktiv: true,
                                    vegDatum: { lte: in60, gte: new Date() },
                                },
                            })];
                    case 3:
                        contracts = _a.sent();
                        return [2 /*return*/, [
                                { code: 'hr.active_employees', name: 'Aktív dolgozók', category: 'HR', value: active },
                                { code: 'hr.medical_expiring', name: 'Lejáró orvosi vizsgálat', category: 'HR', value: medical, status: medical > 0 ? 'warning' : 'ok' },
                                { code: 'hr.contract_expiring', name: 'Szerződés lejárat (60 nap)', category: 'HR', value: contracts, status: contracts > 0 ? 'warning' : 'ok' },
                            ]];
                }
            });
        });
    };
    DashboardAggregationService.prototype.logisticsKpis = function () {
        return __awaiter(this, void 0, void 0, function () {
            var levels, stockValue, belowMin, _i, levels_1, sl, min, openPo, in30, expiringLots;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.prisma.stockLevel.findMany({
                            include: { item: true },
                        })];
                    case 1:
                        levels = _d.sent();
                        stockValue = 0;
                        belowMin = 0;
                        for (_i = 0, levels_1 = levels; _i < levels_1.length; _i++) {
                            sl = levels_1[_i];
                            stockValue += sl.mennyiseg * (((_a = sl.item) === null || _a === void 0 ? void 0 : _a.beszerzesiAr) || 0);
                            min = (_b = sl.minimum) !== null && _b !== void 0 ? _b : (_c = sl.item) === null || _c === void 0 ? void 0 : _c.minKeszlet;
                            if (min != null && sl.mennyiseg < min)
                                belowMin++;
                        }
                        return [4 /*yield*/, this.prisma.purchaseOrder.count({
                                where: { allapot: { in: ['draft', 'approved', 'ordered', 'partial', 'DRAFT', 'APPROVED', 'ORDERED', 'PARTIAL'] } },
                            })];
                    case 2:
                        openPo = _d.sent();
                        in30 = new Date();
                        in30.setDate(in30.getDate() + 30);
                        return [4 /*yield*/, this.prisma.stockLot.count({
                                where: { lejarat: { lte: in30, not: null } },
                            })];
                    case 3:
                        expiringLots = _d.sent();
                        return [2 /*return*/, [
                                { code: 'logistics.stock_value', name: 'Készletérték', category: 'LOGISTICS', value: Math.round(stockValue), unit: 'HUF' },
                                { code: 'logistics.below_min', name: 'Minimum alatti tétel', category: 'LOGISTICS', value: belowMin, status: belowMin > 0 ? 'warning' : 'ok' },
                                { code: 'logistics.open_purchase_orders', name: 'Nyitott beszerzések', category: 'LOGISTICS', value: openPo },
                                { code: 'logistics.expiring_batches', name: 'Lejáró sarzsok (30 nap)', category: 'LOGISTICS', value: expiringLots, status: expiringLots > 0 ? 'warning' : 'ok' },
                            ]];
                }
            });
        });
    };
    DashboardAggregationService.prototype.systemKpis = function () {
        return __awaiter(this, void 0, void 0, function () {
            var auditCount, backupStatus, lastBackup, setting, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.prisma.auditLog.count({
                            where: {
                                createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
                            },
                        })];
                    case 1:
                        auditCount = _b.sent();
                        backupStatus = 0;
                        lastBackup = '';
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.prisma.systemSetting.findUnique({
                                where: { kulcs: 'backup.last_success' },
                            })];
                    case 3:
                        setting = _b.sent();
                        if (setting === null || setting === void 0 ? void 0 : setting.ertek) {
                            backupStatus = 1;
                            lastBackup = setting.ertek;
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/, [
                            { code: 'system.backup_ok', name: 'Backup státusz', category: 'SYSTEM', value: backupStatus, unit: backupStatus ? 'OK' : 'Nincs adat' },
                            { code: 'system.audit_events_7d', name: 'Audit események (7 nap)', category: 'SYSTEM', value: auditCount },
                        ]];
                }
            });
        });
    };
    DashboardAggregationService.prototype.buildCharts = function (module) {
        return __awaiter(this, void 0, void 0, function () {
            var charts, byStage, moves, byType, _i, moves_1, m;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        charts = [];
                        if (!(!module || module === 'CRM')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.prisma.opportunity.groupBy({
                                by: ['szakasz'],
                                _count: { id: true },
                                _sum: { ertek: true },
                            })];
                    case 1:
                        byStage = _a.sent();
                        charts.push({
                            name: 'Pipeline állapot',
                            data: byStage.map(function (g) { return ({
                                label: g.szakasz,
                                value: g._sum.ertek || g._count.id,
                            }); }),
                        });
                        _a.label = 2;
                    case 2:
                        if (!(!module || module === 'LOGISTICS')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.prisma.stockMove.findMany({
                                take: 200,
                                orderBy: { createdAt: 'desc' },
                            })];
                    case 3:
                        moves = _a.sent();
                        byType = {};
                        for (_i = 0, moves_1 = moves; _i < moves_1.length; _i++) {
                            m = moves_1[_i];
                            byType[m.tipus] = (byType[m.tipus] || 0) + 1;
                        }
                        charts.push({
                            name: 'Készletmozgások típus szerint',
                            data: Object.entries(byType).map(function (_a) {
                                var label = _a[0], value = _a[1];
                                return ({ label: label, value: value });
                            }),
                        });
                        _a.label = 4;
                    case 4: return [2 /*return*/, charts];
                }
            });
        });
    };
    DashboardAggregationService.prototype.saveSnapshots = function (cards) {
        return __awaiter(this, void 0, void 0, function () {
            var now, _i, cards_1, c, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        now = new Date();
                        _i = 0, cards_1 = cards;
                        _b.label = 1;
                    case 1:
                        if (!(_i < cards_1.length)) return [3 /*break*/, 6];
                        c = cards_1[_i];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.prisma.systemMetricSnapshot.create({
                                data: {
                                    metricCode: c.code,
                                    metricValue: c.value,
                                    snapshotDate: now,
                                    sourceModule: c.category,
                                },
                            })];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    DashboardAggregationService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], DashboardAggregationService);
    return DashboardAggregationService;
}());
exports.DashboardAggregationService = DashboardAggregationService;
