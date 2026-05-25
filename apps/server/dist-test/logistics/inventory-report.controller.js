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
exports.InventoryReportController = void 0;
var common_1 = require("@nestjs/common");
var inventory_report_service_1 = require("./inventory-report.service");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var permission_enum_1 = require("../common/rbac/permission.enum");
var rbac_guard_1 = require("../common/rbac/rbac.guard");
var InventoryReportController = /** @class */ (function () {
    function InventoryReportController(reportService) {
        this.reportService = reportService;
    }
    InventoryReportController.prototype.print = function (warehouseId_1, itemGroupId_1) {
        return __awaiter(this, arguments, void 0, function (warehouseId, itemGroupId, format, date, lowStockOnly, res) {
            var filters, dateStr, warehouse, buffer, csv, buffer, error_1;
            if (format === void 0) { format = 'pdf'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filters = {
                            warehouseId: warehouseId,
                            itemGroupId: itemGroupId,
                            date: date,
                            lowStockOnly: lowStockOnly === 'true',
                        };
                        dateStr = new Date().toISOString().split('T')[0];
                        warehouse = warehouseId ? "_raktar_".concat(warehouseId) : '';
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, , 10]);
                        if (!(format === 'pdf')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.reportService.generatePDF(filters)];
                    case 2:
                        buffer = _a.sent();
                        res === null || res === void 0 ? void 0 : res.setHeader('Content-Type', 'application/pdf');
                        res === null || res === void 0 ? void 0 : res.setHeader('Content-Disposition', "attachment; filename=\"Leltariv_".concat(dateStr).concat(warehouse, ".pdf\""));
                        res === null || res === void 0 ? void 0 : res.send(buffer);
                        return [3 /*break*/, 8];
                    case 3:
                        if (!(format === 'csv')) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.reportService.generateCSV(filters)];
                    case 4:
                        csv = _a.sent();
                        res === null || res === void 0 ? void 0 : res.setHeader('Content-Type', 'text/csv; charset=utf-8');
                        res === null || res === void 0 ? void 0 : res.setHeader('Content-Disposition', "attachment; filename=\"Leltariv_".concat(dateStr).concat(warehouse, ".csv\""));
                        res === null || res === void 0 ? void 0 : res.send(Buffer.from(csv, 'utf-8'));
                        return [3 /*break*/, 8];
                    case 5:
                        if (!(format === 'excel')) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.reportService.generateExcel(filters)];
                    case 6:
                        buffer = _a.sent();
                        res === null || res === void 0 ? void 0 : res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        res === null || res === void 0 ? void 0 : res.setHeader('Content-Disposition', "attachment; filename=\"Leltariv_".concat(dateStr).concat(warehouse, ".xlsx\""));
                        res === null || res === void 0 ? void 0 : res.send(buffer);
                        return [3 /*break*/, 8];
                    case 7:
                        res === null || res === void 0 ? void 0 : res.status(common_1.HttpStatus.BAD_REQUEST).json({
                            error: 'Érvénytelen formátum. Használjon: pdf, csv vagy excel',
                        });
                        _a.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_1 = _a.sent();
                        res === null || res === void 0 ? void 0 : res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                            error: 'Hiba a riport generálása során',
                            message: error_1 instanceof Error ? error_1.message : 'Ismeretlen hiba',
                        });
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    InventoryReportController.prototype.getByItemGroup = function (warehouseId, itemGroupId, date, lowStockOnly) {
        return __awaiter(this, void 0, void 0, function () {
            var filters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filters = {
                            warehouseId: warehouseId,
                            itemGroupId: itemGroupId,
                            date: date,
                            lowStockOnly: lowStockOnly === 'true',
                        };
                        return [4 /*yield*/, this.reportService.getReportDataByItemGroup(filters)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)('print'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.INVENTORY_REPORT_PRINT),
        __param(0, (0, common_1.Query)('warehouseId')),
        __param(1, (0, common_1.Query)('itemGroupId')),
        __param(2, (0, common_1.Query)('format')),
        __param(3, (0, common_1.Query)('date')),
        __param(4, (0, common_1.Query)('lowStockOnly')),
        __param(5, (0, common_1.Res)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String, String, String, Object]),
        __metadata("design:returntype", Promise)
    ], InventoryReportController.prototype, "print", null);
    __decorate([
        (0, common_1.Get)('by-item-group'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.INVENTORY_REPORT_PRINT),
        __param(0, (0, common_1.Query)('warehouseId')),
        __param(1, (0, common_1.Query)('itemGroupId')),
        __param(2, (0, common_1.Query)('date')),
        __param(3, (0, common_1.Query)('lowStockOnly')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String, String]),
        __metadata("design:returntype", Promise)
    ], InventoryReportController.prototype, "getByItemGroup", null);
    InventoryReportController = __decorate([
        (0, common_1.Controller)('logistics/inventory/reports'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [inventory_report_service_1.InventoryReportService])
    ], InventoryReportController);
    return InventoryReportController;
}());
exports.InventoryReportController = InventoryReportController;
