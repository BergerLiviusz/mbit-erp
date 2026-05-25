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
exports.ReportExportController = void 0;
var common_1 = require("@nestjs/common");
var report_export_service_1 = require("./report-export.service");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var permission_enum_1 = require("../common/rbac/permission.enum");
var rbac_guard_1 = require("../common/rbac/rbac.guard");
var audit_service_1 = require("../common/audit/audit.service");
var ReportExportController = /** @class */ (function () {
    function ReportExportController(reportExportService, auditService) {
        this.reportExportService = reportExportService;
        this.auditService = auditService;
    }
    ReportExportController.prototype.exportToExcel = function (data, res, req) {
        return __awaiter(this, void 0, void 0, function () {
            var buffer;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.reportExportService.exportToExcel(data)];
                    case 1:
                        buffer = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('ReportExport', "excel-".concat(Date.now()), { format: 'EXCEL', title: data.title }, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        res.setHeader('Content-Disposition', "attachment; filename=\"riport_".concat(new Date().toISOString().split('T')[0], ".xlsx\""));
                        res.end(buffer);
                        return [2 /*return*/];
                }
            });
        });
    };
    ReportExportController.prototype.exportToCsv = function (data, res, req) {
        return __awaiter(this, void 0, void 0, function () {
            var content;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.reportExportService.exportToCsv(data)];
                    case 1:
                        content = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('ReportExport', "csv-".concat(Date.now()), { format: 'CSV', title: data.title }, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
                        res.setHeader('Content-Disposition', "attachment; filename=\"riport_".concat(new Date().toISOString().split('T')[0], ".csv\""));
                        res.send('\ufeff' + content);
                        return [2 /*return*/];
                }
            });
        });
    };
    ReportExportController.prototype.exportToTxt = function (data, res, req) {
        return __awaiter(this, void 0, void 0, function () {
            var content;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.reportExportService.exportToTxt(data)];
                    case 1:
                        content = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('ReportExport', "txt-".concat(Date.now()), { format: 'TXT', title: data.title }, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                        res.setHeader('Content-Disposition', "attachment; filename=\"riport_".concat(new Date().toISOString().split('T')[0], ".txt\""));
                        res.send(content);
                        return [2 /*return*/];
                }
            });
        });
    };
    ReportExportController.prototype.exportToXml = function (data, res, req) {
        return __awaiter(this, void 0, void 0, function () {
            var content;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.reportExportService.exportToXml(data)];
                    case 1:
                        content = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('ReportExport', "xml-".concat(Date.now()), { format: 'XML', title: data.title }, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
                        res.setHeader('Content-Disposition', "attachment; filename=\"riport_".concat(new Date().toISOString().split('T')[0], ".xml\""));
                        res.send(content);
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Post)('excel'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.REPORT_EXPORT),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object]),
        __metadata("design:returntype", Promise)
    ], ReportExportController.prototype, "exportToExcel", null);
    __decorate([
        (0, common_1.Post)('csv'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.REPORT_EXPORT),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object]),
        __metadata("design:returntype", Promise)
    ], ReportExportController.prototype, "exportToCsv", null);
    __decorate([
        (0, common_1.Post)('txt'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.REPORT_EXPORT),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object]),
        __metadata("design:returntype", Promise)
    ], ReportExportController.prototype, "exportToTxt", null);
    __decorate([
        (0, common_1.Post)('xml'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.REPORT_EXPORT),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object]),
        __metadata("design:returntype", Promise)
    ], ReportExportController.prototype, "exportToXml", null);
    ReportExportController = __decorate([
        (0, common_1.Controller)('controlling/reports/export'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [report_export_service_1.ReportExportService,
            audit_service_1.AuditService])
    ], ReportExportController);
    return ReportExportController;
}());
exports.ReportExportController = ReportExportController;
