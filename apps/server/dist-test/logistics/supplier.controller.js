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
exports.SupplierController = void 0;
var common_1 = require("@nestjs/common");
var supplier_service_1 = require("./supplier.service");
var create_supplier_dto_1 = require("./dto/create-supplier.dto");
var update_supplier_dto_1 = require("./dto/update-supplier.dto");
var link_item_supplier_dto_1 = require("./dto/link-item-supplier.dto");
var audit_service_1 = require("../common/audit/audit.service");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var permission_enum_1 = require("../common/rbac/permission.enum");
var rbac_guard_1 = require("../common/rbac/rbac.guard");
var SupplierController = /** @class */ (function () {
    function SupplierController(supplierService, auditService) {
        this.supplierService = supplierService;
        this.auditService = auditService;
    }
    SupplierController.prototype.findAll = function (skip, take, search) {
        return this.supplierService.findAll(skip ? parseInt(skip) : 0, take ? parseInt(take) : 50, search);
    };
    SupplierController.prototype.findOne = function (id) {
        return this.supplierService.findOne(id);
    };
    SupplierController.prototype.create = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var supplier;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.supplierService.create(dto)];
                    case 1:
                        supplier = _a.sent();
                        return [4 /*yield*/, this.auditService.logCreate('Supplier', supplier.id, supplier)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, supplier];
                }
            });
        });
    };
    SupplierController.prototype.update = function (id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var old, updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.supplierService.findOne(id)];
                    case 1:
                        old = _a.sent();
                        return [4 /*yield*/, this.supplierService.update(id, dto)];
                    case 2:
                        updated = _a.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('Supplier', id, old, updated)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    SupplierController.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var old, deleted;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.supplierService.findOne(id)];
                    case 1:
                        old = _a.sent();
                        return [4 /*yield*/, this.supplierService.delete(id)];
                    case 2:
                        deleted = _a.sent();
                        return [4 /*yield*/, this.auditService.logDelete('Supplier', id, old)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, deleted];
                }
            });
        });
    };
    SupplierController.prototype.linkItem = function (supplierId, itemId, dto) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.supplierService.linkItemToSupplier(itemId, supplierId, dto)];
            });
        });
    };
    SupplierController.prototype.unlinkItem = function (supplierId, itemId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.supplierService.unlinkItemFromSupplier(itemId, supplierId)];
            });
        });
    };
    SupplierController.prototype.getSupplierItems = function (supplierId) {
        return this.supplierService.getSupplierItems(supplierId);
    };
    __decorate([
        (0, common_1.Get)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.SUPPLIER_VIEW),
        __param(0, (0, common_1.Query)('skip')),
        __param(1, (0, common_1.Query)('take')),
        __param(2, (0, common_1.Query)('search')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String]),
        __metadata("design:returntype", void 0)
    ], SupplierController.prototype, "findAll", null);
    __decorate([
        (0, common_1.Get)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.SUPPLIER_VIEW),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], SupplierController.prototype, "findOne", null);
    __decorate([
        (0, common_1.Post)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.SUPPLIER_CREATE),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [create_supplier_dto_1.CreateSupplierDto]),
        __metadata("design:returntype", Promise)
    ], SupplierController.prototype, "create", null);
    __decorate([
        (0, common_1.Put)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.SUPPLIER_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, update_supplier_dto_1.UpdateSupplierDto]),
        __metadata("design:returntype", Promise)
    ], SupplierController.prototype, "update", null);
    __decorate([
        (0, common_1.Delete)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.SUPPLIER_DELETE),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], SupplierController.prototype, "delete", null);
    __decorate([
        (0, common_1.Post)(':id/items/:itemId/link'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.SUPPLIER_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Param)('itemId')),
        __param(2, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, link_item_supplier_dto_1.LinkItemSupplierDto]),
        __metadata("design:returntype", Promise)
    ], SupplierController.prototype, "linkItem", null);
    __decorate([
        (0, common_1.Delete)(':id/items/:itemId/unlink'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.SUPPLIER_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Param)('itemId')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", Promise)
    ], SupplierController.prototype, "unlinkItem", null);
    __decorate([
        (0, common_1.Get)(':id/items'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.SUPPLIER_VIEW),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], SupplierController.prototype, "getSupplierItems", null);
    SupplierController = __decorate([
        (0, common_1.Controller)('logistics/suppliers'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [supplier_service_1.SupplierService,
            audit_service_1.AuditService])
    ], SupplierController);
    return SupplierController;
}());
exports.SupplierController = SupplierController;
