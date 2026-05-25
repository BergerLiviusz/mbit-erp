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
exports.ProductCategoryController = void 0;
var common_1 = require("@nestjs/common");
var product_category_service_1 = require("./product-category.service");
var logistics_export_service_1 = require("./logistics-export.service");
var audit_service_1 = require("../common/audit/audit.service");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var permission_enum_1 = require("../common/rbac/permission.enum");
var rbac_guard_1 = require("../common/rbac/rbac.guard");
var ProductCategoryController = /** @class */ (function () {
    function ProductCategoryController(categoryService, exportService, auditService) {
        this.categoryService = categoryService;
        this.exportService = exportService;
        this.auditService = auditService;
    }
    ProductCategoryController.prototype.findAll = function (tree) {
        if (tree === 'true')
            return this.categoryService.findTree();
        return this.categoryService.findAll();
    };
    ProductCategoryController.prototype.report = function () {
        return this.categoryService.reportByCategory();
    };
    ProductCategoryController.prototype.exportCategoryReport = function (format, res) {
        return __awaiter(this, void 0, void 0, function () {
            var data, headers, rows, fmt, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.categoryService.reportByCategory()];
                    case 1:
                        data = _a.sent();
                        headers = ['Kategória', 'Cikkek száma', 'Össz mennyiség', 'Érték'];
                        rows = data.map(function (r) { return [
                            r.categoryName,
                            r.itemCount,
                            r.totalQty,
                            r.totalValue,
                        ]; });
                        fmt = format === 'xlsx' ? 'xlsx' : 'csv';
                        return [4 /*yield*/, this.exportService.packRows('Kategoria_riport', headers, rows, fmt)];
                    case 2:
                        result = _a.sent();
                        return [4 /*yield*/, this.auditService.log({
                                esemeny: 'export',
                                entitas: 'ProductCategory',
                                uj: { format: fmt, rowCount: rows.length },
                            })];
                    case 3:
                        _a.sent();
                        res.setHeader('Content-Type', result.contentType);
                        res.setHeader('Content-Disposition', "attachment; filename=\"".concat(result.filename, "\""));
                        res.send(result.buffer);
                        return [2 /*return*/];
                }
            });
        });
    };
    ProductCategoryController.prototype.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var created;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.categoryService.create(data)];
                    case 1:
                        created = _a.sent();
                        return [4 /*yield*/, this.auditService.logCreate('ProductCategory', created.id, created)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, created];
                }
            });
        });
    };
    ProductCategoryController.prototype.update = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var old, prev, updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.categoryService.findAll(0, 1000)];
                    case 1:
                        old = _a.sent();
                        prev = old.data.find(function (c) { return c.id === id; });
                        return [4 /*yield*/, this.categoryService.update(id, data)];
                    case 2:
                        updated = _a.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('ProductCategory', id, prev, updated)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    ProductCategoryController.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var deleted;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.categoryService.delete(id)];
                    case 1:
                        deleted = _a.sent();
                        return [4 /*yield*/, this.auditService.logDelete('ProductCategory', id, deleted)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, deleted];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.LOGISTICS_VIEW, permission_enum_1.Permission.PRODUCT_VIEW),
        __param(0, (0, common_1.Query)('tree')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], ProductCategoryController.prototype, "findAll", null);
    __decorate([
        (0, common_1.Get)('report'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.LOGISTICS_VIEW, permission_enum_1.Permission.REPORT_VIEW),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ProductCategoryController.prototype, "report", null);
    __decorate([
        (0, common_1.Get)('export/:format'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.LOGISTICS_EXPORT, permission_enum_1.Permission.REPORT_EXPORT),
        __param(0, (0, common_1.Param)('format')),
        __param(1, (0, common_1.Res)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], ProductCategoryController.prototype, "exportCategoryReport", null);
    __decorate([
        (0, common_1.Post)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.LOGISTICS_CREATE, permission_enum_1.Permission.PRODUCT_CREATE),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], ProductCategoryController.prototype, "create", null);
    __decorate([
        (0, common_1.Put)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.LOGISTICS_EDIT, permission_enum_1.Permission.PRODUCT_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], ProductCategoryController.prototype, "update", null);
    __decorate([
        (0, common_1.Delete)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.LOGISTICS_DELETE, permission_enum_1.Permission.PRODUCT_DELETE),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], ProductCategoryController.prototype, "delete", null);
    ProductCategoryController = __decorate([
        (0, common_1.Controller)('logistics/categories'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [product_category_service_1.ProductCategoryService,
            logistics_export_service_1.LogisticsExportService,
            audit_service_1.AuditService])
    ], ProductCategoryController);
    return ProductCategoryController;
}());
exports.ProductCategoryController = ProductCategoryController;
