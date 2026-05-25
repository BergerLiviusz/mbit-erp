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
exports.HrReportController = void 0;
var common_1 = require("@nestjs/common");
var report_service_1 = require("./report.service");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var permission_enum_1 = require("../common/rbac/permission.enum");
var rbac_guard_1 = require("../common/rbac/rbac.guard");
var audit_service_1 = require("../common/audit/audit.service");
var HrReportController = /** @class */ (function () {
    function HrReportController(hrReportService, auditService) {
        this.hrReportService = hrReportService;
        this.auditService = auditService;
    }
    HrReportController.prototype.generateNavPayrollReport = function (dto, res, req) {
        return __awaiter(this, void 0, void 0, function () {
            var content;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.hrReportService.generateNavPayrollReport(dto)];
                    case 1:
                        content = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('HrReport', "nav-payroll-".concat(dto.ev, "-").concat(dto.honap), __assign({ type: 'NAV_PAYROLL' }, dto), (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                        res.setHeader('Content-Disposition', "attachment; filename=\"nav_berkifizetesi_".concat(dto.ev, "_").concat(dto.honap, ".txt\""));
                        res.send('\ufeff' + content); // BOM for Excel compatibility
                        return [2 /*return*/];
                }
            });
        });
    };
    HrReportController.prototype.generateNavTaxReport = function (dto, res, req) {
        return __awaiter(this, void 0, void 0, function () {
            var content, filename;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.hrReportService.generateNavTaxReport(dto)];
                    case 1:
                        content = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('HrReport', "nav-tax-".concat(dto.ev, "-").concat(dto.quarter || 'full'), __assign({ type: 'NAV_TAX' }, dto), (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                        filename = dto.quarter
                            ? "nav_szja_".concat(dto.ev, "_Q").concat(dto.quarter, ".txt")
                            : "nav_szja_".concat(dto.ev, ".txt");
                        res.setHeader('Content-Disposition', "attachment; filename=\"".concat(filename, "\""));
                        res.send('\ufeff' + content);
                        return [2 /*return*/];
                }
            });
        });
    };
    HrReportController.prototype.generateKshEmploymentReport = function (dto, res, req) {
        return __awaiter(this, void 0, void 0, function () {
            var content, filename;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.hrReportService.generateKshEmploymentReport(dto)];
                    case 1:
                        content = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('HrReport', "ksh-employment-".concat(dto.ev, "-").concat(dto.honap || 'full'), __assign({ type: 'KSH_EMPLOYMENT' }, dto), (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                        filename = dto.honap
                            ? "ksh_foglalkoztatotti_".concat(dto.ev, "_").concat(dto.honap, ".txt")
                            : "ksh_foglalkoztatotti_".concat(dto.ev, ".txt");
                        res.setHeader('Content-Disposition', "attachment; filename=\"".concat(filename, "\""));
                        res.send('\ufeff' + content);
                        return [2 /*return*/];
                }
            });
        });
    };
    HrReportController.prototype.generateKshWageReport = function (dto, res, req) {
        return __awaiter(this, void 0, void 0, function () {
            var content, filename;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.hrReportService.generateKshWageReport(dto)];
                    case 1:
                        content = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('HrReport', "ksh-wage-".concat(dto.ev, "-").concat(dto.honap || 'full'), __assign({ type: 'KSH_WAGE' }, dto), (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                        filename = dto.honap
                            ? "ksh_berstatisztika_".concat(dto.ev, "_").concat(dto.honap, ".txt")
                            : "ksh_berstatisztika_".concat(dto.ev, ".txt");
                        res.setHeader('Content-Disposition', "attachment; filename=\"".concat(filename, "\""));
                        res.send('\ufeff' + content);
                        return [2 /*return*/];
                }
            });
        });
    };
    HrReportController.prototype.generateKshContractReport = function (dto, res, req) {
        return __awaiter(this, void 0, void 0, function () {
            var content, filename;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.hrReportService.generateKshContractReport(dto)];
                    case 1:
                        content = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('HrReport', "ksh-contract-".concat(dto.ev, "-").concat(dto.honap || 'full'), __assign({ type: 'KSH_CONTRACT' }, dto), (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                        filename = dto.honap
                            ? "ksh_szerzodes_".concat(dto.ev, "_").concat(dto.honap, ".txt")
                            : "ksh_szerzodes_".concat(dto.ev, ".txt");
                        res.setHeader('Content-Disposition', "attachment; filename=\"".concat(filename, "\""));
                        res.send('\ufeff' + content);
                        return [2 /*return*/];
                }
            });
        });
    };
    HrReportController.prototype.exportCafeteriaPayroll = function (body, res, req) {
        return __awaiter(this, void 0, void 0, function () {
            var content;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.hrReportService.generateCafeteriaPayrollExport(body.ev)];
                    case 1:
                        content = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('HrReport', "cafeteria-".concat(body.ev), __assign({ type: 'CAFETERIA_PAYROLL' }, body), (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
                        res.setHeader('Content-Disposition', "attachment; filename=\"cafeteria_berszamfejto_".concat(body.ev, ".csv\""));
                        res.send('\ufeff' + content);
                        return [2 /*return*/];
                }
            });
        });
    };
    HrReportController.prototype.exportTimePayroll = function (body, res, req) {
        return __awaiter(this, void 0, void 0, function () {
            var content;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.hrReportService.generateTimePayrollExport(body.ev, body.honap)];
                    case 1:
                        content = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('HrReport', "time-".concat(body.ev, "-").concat(body.honap), __assign({ type: 'TIME_PAYROLL' }, body), (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
                        res.setHeader('Content-Disposition', "attachment; filename=\"munkaido_berszamfejto_".concat(body.ev, "_").concat(body.honap, ".csv\""));
                        res.send('\ufeff' + content);
                        return [2 /*return*/];
                }
            });
        });
    };
    HrReportController.prototype.exportGinopReport = function (reportKey_1, res_1, req_1) {
        return __awaiter(this, arguments, void 0, function (reportKey, res, req, format, withinDays, jobPositionId, osztaly, aktiv) {
            var fmt, filters, result, _a;
            var _b;
            if (format === void 0) { format = 'csv'; }
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        fmt = format === 'xlsx' ? 'xlsx' : 'csv';
                        filters = { jobPositionId: jobPositionId, osztaly: osztaly, aktiv: aktiv };
                        _a = reportKey;
                        switch (_a) {
                            case 'employee-master': return [3 /*break*/, 1];
                            case 'employment-relations': return [3 /*break*/, 3];
                            case 'job-positions': return [3 /*break*/, 5];
                            case 'medical-expiry': return [3 /*break*/, 7];
                            case 'contract-amendments': return [3 /*break*/, 9];
                            case 'nav-ksh-analytics': return [3 /*break*/, 11];
                        }
                        return [3 /*break*/, 13];
                    case 1: return [4 /*yield*/, this.hrReportService.exportEmployeeMaster(fmt, filters)];
                    case 2:
                        result = _c.sent();
                        return [3 /*break*/, 14];
                    case 3: return [4 /*yield*/, this.hrReportService.exportEmploymentRelations(fmt, filters)];
                    case 4:
                        result = _c.sent();
                        return [3 /*break*/, 14];
                    case 5: return [4 /*yield*/, this.hrReportService.exportJobPositions(fmt)];
                    case 6:
                        result = _c.sent();
                        return [3 /*break*/, 14];
                    case 7: return [4 /*yield*/, this.hrReportService.exportMedicalExpiry(fmt, withinDays ? parseInt(withinDays, 10) : 90)];
                    case 8:
                        result = _c.sent();
                        return [3 /*break*/, 14];
                    case 9: return [4 /*yield*/, this.hrReportService.exportContractAmendments(fmt)];
                    case 10:
                        result = _c.sent();
                        return [3 /*break*/, 14];
                    case 11: return [4 /*yield*/, this.hrReportService.exportNavKshHrAnalytics(fmt, filters)];
                    case 12:
                        result = _c.sent();
                        return [3 /*break*/, 14];
                    case 13:
                        res.status(400).json({ message: "Ismeretlen riport: ".concat(reportKey) });
                        return [2 /*return*/];
                    case 14: return [4 /*yield*/, this.auditService.logCreate('HrExportLog', reportKey, { reportKey: reportKey, format: fmt }, (_b = req.user) === null || _b === void 0 ? void 0 : _b.id)];
                    case 15:
                        _c.sent();
                        res.setHeader('Content-Type', result.contentType);
                        res.setHeader('Content-Disposition', "attachment; filename=\"".concat(result.filename, "\""));
                        res.send(result.body);
                        return [2 /*return*/];
                }
            });
        });
    };
    HrReportController.prototype.exportLeaveAnalytics = function (body, res, req) {
        return __awaiter(this, void 0, void 0, function () {
            var content;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.hrReportService.generateLeaveAnalyticsExport(body.evFrom, body.evTo)];
                    case 1:
                        content = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('HrReport', "leave-".concat(body.evFrom), __assign({ type: 'LEAVE_ANALYTICS' }, body), (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
                        res.setHeader('Content-Disposition', "attachment; filename=\"tavollet_riport_".concat(body.evFrom, ".csv\""));
                        res.send('\ufeff' + content);
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Post)('nav/payroll'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_REPORT),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object]),
        __metadata("design:returntype", Promise)
    ], HrReportController.prototype, "generateNavPayrollReport", null);
    __decorate([
        (0, common_1.Post)('nav/tax'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_REPORT),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object]),
        __metadata("design:returntype", Promise)
    ], HrReportController.prototype, "generateNavTaxReport", null);
    __decorate([
        (0, common_1.Post)('ksh/employment'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_REPORT),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object]),
        __metadata("design:returntype", Promise)
    ], HrReportController.prototype, "generateKshEmploymentReport", null);
    __decorate([
        (0, common_1.Post)('ksh/wage'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_REPORT),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object]),
        __metadata("design:returntype", Promise)
    ], HrReportController.prototype, "generateKshWageReport", null);
    __decorate([
        (0, common_1.Post)('ksh/contract'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_REPORT),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object]),
        __metadata("design:returntype", Promise)
    ], HrReportController.prototype, "generateKshContractReport", null);
    __decorate([
        (0, common_1.Post)('export/cafeteria-payroll'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_REPORT),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object]),
        __metadata("design:returntype", Promise)
    ], HrReportController.prototype, "exportCafeteriaPayroll", null);
    __decorate([
        (0, common_1.Post)('export/time-payroll'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_REPORT),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object]),
        __metadata("design:returntype", Promise)
    ], HrReportController.prototype, "exportTimePayroll", null);
    __decorate([
        (0, common_1.Post)('ginop/:reportKey'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_EXPORT, permission_enum_1.Permission.HR_REPORT),
        __param(0, (0, common_1.Param)('reportKey')),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Request)()),
        __param(3, (0, common_1.Query)('format')),
        __param(4, (0, common_1.Query)('withinDays')),
        __param(5, (0, common_1.Query)('jobPositionId')),
        __param(6, (0, common_1.Query)('osztaly')),
        __param(7, (0, common_1.Query)('aktiv')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object, String, String, String, String, String]),
        __metadata("design:returntype", Promise)
    ], HrReportController.prototype, "exportGinopReport", null);
    __decorate([
        (0, common_1.Post)('export/leave-analytics'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_REPORT),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object]),
        __metadata("design:returntype", Promise)
    ], HrReportController.prototype, "exportLeaveAnalytics", null);
    HrReportController = __decorate([
        (0, common_1.Controller)('hr/reports'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [report_service_1.HrReportService,
            audit_service_1.AuditService])
    ], HrReportController);
    return HrReportController;
}());
exports.HrReportController = HrReportController;
