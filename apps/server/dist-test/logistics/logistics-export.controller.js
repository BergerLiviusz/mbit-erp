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
exports.LogisticsExportController = void 0;
var common_1 = require("@nestjs/common");
var logistics_export_service_1 = require("./logistics-export.service");
var audit_service_1 = require("../common/audit/audit.service");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var permission_enum_1 = require("../common/rbac/permission.enum");
var rbac_guard_1 = require("../common/rbac/rbac.guard");
var LogisticsExportController = /** @class */ (function () {
    function LogisticsExportController(exportService, auditService) {
        this.exportService = exportService;
        this.auditService = auditService;
    }
    LogisticsExportController.prototype.listTypes = function () {
        return [
            { id: 'stock-current', label: 'Aktuális készlet' },
            { id: 'stock-by-warehouse', label: 'Készlet raktáranként' },
            { id: 'stock-movements', label: 'Készletmozgások' },
            { id: 'batches', label: 'Sarzs riport' },
            { id: 'batches-expiring', label: 'Lejáró sarzs' },
            { id: 'low-stock', label: 'Minimum alatti tételek' },
            { id: 'purchase-orders', label: 'Beszerzési rendelések' },
            { id: 'inventory-variance', label: 'Leltár eltérések' },
        ];
    };
    LogisticsExportController.prototype.export = function (reportType, format, query, res, req) {
        return __awaiter(this, void 0, void 0, function () {
            var fmt, result, userId;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        fmt = format === 'xlsx' ? 'xlsx' : 'csv';
                        return [4 /*yield*/, this.exportService.exportReport(reportType, fmt, query)];
                    case 1:
                        result = _d.sent();
                        userId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : (_c = req.user) === null || _c === void 0 ? void 0 : _c.userId;
                        return [4 /*yield*/, this.auditService.log({
                                userId: userId,
                                esemeny: 'export',
                                entitas: 'LogisticsReport',
                                entitasId: reportType,
                                uj: { format: fmt, filters: query },
                            })];
                    case 2:
                        _d.sent();
                        res.setHeader('Content-Type', result.contentType);
                        res.setHeader('Content-Disposition', "attachment; filename=\"".concat(result.filename, "\""));
                        res.send(result.buffer);
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)('types'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.LOGISTICS_VIEW, permission_enum_1.Permission.REPORT_VIEW),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], LogisticsExportController.prototype, "listTypes", null);
    __decorate([
        (0, common_1.Get)(':reportType/export/:format'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.LOGISTICS_EXPORT, permission_enum_1.Permission.REPORT_EXPORT),
        __param(0, (0, common_1.Param)('reportType')),
        __param(1, (0, common_1.Param)('format')),
        __param(2, (0, common_1.Query)()),
        __param(3, (0, common_1.Res)()),
        __param(4, (0, common_1.Req)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, Object, Object, Object]),
        __metadata("design:returntype", Promise)
    ], LogisticsExportController.prototype, "export", null);
    LogisticsExportController = __decorate([
        (0, common_1.Controller)('logistics/reports'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [logistics_export_service_1.LogisticsExportService,
            audit_service_1.AuditService])
    ], LogisticsExportController);
    return LogisticsExportController;
}());
exports.LogisticsExportController = LogisticsExportController;
