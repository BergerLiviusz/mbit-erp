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
exports.InventorySheetController = void 0;
var common_1 = require("@nestjs/common");
var inventory_sheet_service_1 = require("./inventory-sheet.service");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var permission_enum_1 = require("../common/rbac/permission.enum");
var rbac_guard_1 = require("../common/rbac/rbac.guard");
var audit_service_1 = require("../common/audit/audit.service");
var InventorySheetController = /** @class */ (function () {
    function InventorySheetController(inventorySheetService, auditService) {
        this.inventorySheetService = inventorySheetService;
        this.auditService = auditService;
    }
    InventorySheetController.prototype.findAll = function (skip, take, warehouseId, allapot) {
        return this.inventorySheetService.findAll(skip ? parseInt(skip) : 0, take ? parseInt(take) : 50, {
            warehouseId: warehouseId,
            allapot: allapot,
        });
    };
    InventorySheetController.prototype.findOne = function (id) {
        return this.inventorySheetService.findOne(id);
    };
    InventorySheetController.prototype.create = function (dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var sheet;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.inventorySheetService.create(dto, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 1:
                        sheet = _c.sent();
                        return [4 /*yield*/, this.auditService.logCreate('InventorySheet', sheet.id, sheet, (_b = req.user) === null || _b === void 0 ? void 0 : _b.id)];
                    case 2:
                        _c.sent();
                        return [2 /*return*/, sheet];
                }
            });
        });
    };
    InventorySheetController.prototype.update = function (id, dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var oldSheet, updated;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.inventorySheetService.findOne(id)];
                    case 1:
                        oldSheet = _b.sent();
                        return [4 /*yield*/, this.inventorySheetService.update(id, dto)];
                    case 2:
                        updated = _b.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('InventorySheet', id, oldSheet, updated, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    InventorySheetController.prototype.updateStatus = function (id, body, req) {
        return __awaiter(this, void 0, void 0, function () {
            var oldSheet, allowedStatuses, updated;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.inventorySheetService.findOne(id)];
                    case 1:
                        oldSheet = _b.sent();
                        allowedStatuses = ['NYITOTT', 'FOLYAMATBAN', 'BEFEJEZETT', 'JOVAHAGYVA'];
                        if (!allowedStatuses.includes(body.allapot)) {
                            throw new Error('Érvénytelen állapot');
                        }
                        return [4 /*yield*/, this.inventorySheetService.update(id, { allapot: body.allapot })];
                    case 2:
                        updated = _b.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('InventorySheet', id, oldSheet, updated, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    InventorySheetController.prototype.approve = function (id, req) {
        return __awaiter(this, void 0, void 0, function () {
            var oldSheet, approved;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.inventorySheetService.findOne(id)];
                    case 1:
                        oldSheet = _c.sent();
                        return [4 /*yield*/, this.inventorySheetService.approve(id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        approved = _c.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('InventorySheet', id, oldSheet, approved, (_b = req.user) === null || _b === void 0 ? void 0 : _b.id)];
                    case 3:
                        _c.sent();
                        return [2 /*return*/, approved];
                }
            });
        });
    };
    InventorySheetController.prototype.close = function (id, req) {
        return __awaiter(this, void 0, void 0, function () {
            var oldSheet, closed;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.inventorySheetService.findOne(id)];
                    case 1:
                        oldSheet = _b.sent();
                        return [4 /*yield*/, this.inventorySheetService.close(id)];
                    case 2:
                        closed = _b.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('InventorySheet', id, oldSheet, closed, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, closed];
                }
            });
        });
    };
    InventorySheetController.prototype.revertApproval = function (id, req) {
        return __awaiter(this, void 0, void 0, function () {
            var oldSheet, reverted;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.inventorySheetService.findOne(id)];
                    case 1:
                        oldSheet = _b.sent();
                        return [4 /*yield*/, this.inventorySheetService.revertApproval(id)];
                    case 2:
                        reverted = _b.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('InventorySheet', id, oldSheet, reverted, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, reverted];
                }
            });
        });
    };
    InventorySheetController.prototype.addItem = function (sheetId, dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var item;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.inventorySheetService.addItem(sheetId, dto)];
                    case 1:
                        item = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('InventorySheetItem', item.id, item, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, item];
                }
            });
        });
    };
    InventorySheetController.prototype.updateItem = function (sheetId, itemId, dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var oldItem, updated;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.inventorySheetService.findOne(sheetId)];
                    case 1:
                        oldItem = _b.sent();
                        return [4 /*yield*/, this.inventorySheetService.updateItem(sheetId, itemId, dto)];
                    case 2:
                        updated = _b.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('InventorySheetItem', updated.id, oldItem, updated, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    InventorySheetController.prototype.delete = function (id, req) {
        return __awaiter(this, void 0, void 0, function () {
            var oldSheet;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.inventorySheetService.findOne(id)];
                    case 1:
                        oldSheet = _b.sent();
                        return [4 /*yield*/, this.inventorySheetService.delete(id)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.auditService.logDelete('InventorySheet', id, oldSheet, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, { message: 'Leltárív törölve' }];
                }
            });
        });
    };
    InventorySheetController.prototype.generatePdf = function (id, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.inventorySheetService.generatePdf(id, res)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    InventorySheetController.prototype.generateExcel = function (id, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.inventorySheetService.generateExcel(id, res)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.STOCK_VIEW),
        __param(0, (0, common_1.Query)('skip')),
        __param(1, (0, common_1.Query)('take')),
        __param(2, (0, common_1.Query)('warehouseId')),
        __param(3, (0, common_1.Query)('allapot')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String, String]),
        __metadata("design:returntype", void 0)
    ], InventorySheetController.prototype, "findAll", null);
    __decorate([
        (0, common_1.Get)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.STOCK_VIEW),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], InventorySheetController.prototype, "findOne", null);
    __decorate([
        (0, common_1.Post)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.STOCK_EDIT),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], InventorySheetController.prototype, "create", null);
    __decorate([
        (0, common_1.Put)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.STOCK_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], InventorySheetController.prototype, "update", null);
    __decorate([
        (0, common_1.Put)(':id/status'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.STOCK_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], InventorySheetController.prototype, "updateStatus", null);
    __decorate([
        (0, common_1.Post)(':id/approve'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.STOCK_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], InventorySheetController.prototype, "approve", null);
    __decorate([
        (0, common_1.Post)(':id/close'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.STOCK_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], InventorySheetController.prototype, "close", null);
    __decorate([
        (0, common_1.Post)(':id/revert-approval'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.STOCK_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], InventorySheetController.prototype, "revertApproval", null);
    __decorate([
        (0, common_1.Post)(':id/items'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.STOCK_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], InventorySheetController.prototype, "addItem", null);
    __decorate([
        (0, common_1.Put)(':id/items/:itemId'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.STOCK_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Param)('itemId')),
        __param(2, (0, common_1.Body)()),
        __param(3, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], InventorySheetController.prototype, "updateItem", null);
    __decorate([
        (0, common_1.Delete)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.LOGISTICS_DELETE),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], InventorySheetController.prototype, "delete", null);
    __decorate([
        (0, common_1.Get)(':id/pdf'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.STOCK_VIEW),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Res)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], InventorySheetController.prototype, "generatePdf", null);
    __decorate([
        (0, common_1.Get)(':id/excel'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.STOCK_VIEW),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Res)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], InventorySheetController.prototype, "generateExcel", null);
    InventorySheetController = __decorate([
        (0, common_1.Controller)('logistics/inventory-sheets'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [inventory_sheet_service_1.InventorySheetService,
            audit_service_1.AuditService])
    ], InventorySheetController);
    return InventorySheetController;
}());
exports.InventorySheetController = InventorySheetController;
