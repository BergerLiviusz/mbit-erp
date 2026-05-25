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
exports.PriceListController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var price_list_service_1 = require("./price-list.service");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var permission_enum_1 = require("../common/rbac/permission.enum");
var rbac_guard_1 = require("../common/rbac/rbac.guard");
var audit_service_1 = require("../common/audit/audit.service");
var PriceListController = /** @class */ (function () {
    function PriceListController(priceListService, auditService) {
        this.priceListService = priceListService;
        this.auditService = auditService;
    }
    PriceListController.prototype.findAll = function (skip, take, supplierId, aktiv) {
        return this.priceListService.findAll(skip ? parseInt(skip) : 0, take ? parseInt(take) : 50, {
            supplierId: supplierId,
            aktiv: aktiv === 'true' ? true : aktiv === 'false' ? false : undefined,
        });
    };
    PriceListController.prototype.findOne = function (id) {
        return this.priceListService.findOne(id);
    };
    PriceListController.prototype.create = function (dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var priceList;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.priceListService.create(dto)];
                    case 1:
                        priceList = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('PriceList', priceList.id, priceList, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, priceList];
                }
            });
        });
    };
    PriceListController.prototype.update = function (id, dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var oldPriceList, updated;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.priceListService.findOne(id)];
                    case 1:
                        oldPriceList = _b.sent();
                        return [4 /*yield*/, this.priceListService.update(id, dto)];
                    case 2:
                        updated = _b.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('PriceList', id, oldPriceList, updated, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    PriceListController.prototype.delete = function (id, req) {
        return __awaiter(this, void 0, void 0, function () {
            var oldPriceList;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.priceListService.findOne(id)];
                    case 1:
                        oldPriceList = _b.sent();
                        return [4 /*yield*/, this.priceListService.delete(id)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.auditService.logDelete('PriceList', id, oldPriceList, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, { message: 'Árlista törölve' }];
                }
            });
        });
    };
    PriceListController.prototype.addItem = function (priceListId, dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var item;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.priceListService.addItem(priceListId, dto)];
                    case 1:
                        item = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('PriceListItem', "".concat(priceListId, "-").concat(item.itemId), item, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, item];
                }
            });
        });
    };
    PriceListController.prototype.updateItem = function (priceListId, itemId, dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var oldItem, updated;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.priceListService.findOne(priceListId)];
                    case 1:
                        oldItem = _b.sent();
                        return [4 /*yield*/, this.priceListService.updateItem(priceListId, itemId, dto)];
                    case 2:
                        updated = _b.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('PriceListItem', "".concat(priceListId, "-").concat(itemId), oldItem, updated, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    PriceListController.prototype.removeItem = function (priceListId, itemId, req) {
        return __awaiter(this, void 0, void 0, function () {
            var oldItem;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.priceListService.findOne(priceListId)];
                    case 1:
                        oldItem = _b.sent();
                        return [4 /*yield*/, this.priceListService.removeItem(priceListId, itemId)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.auditService.logDelete('PriceListItem', "".concat(priceListId, "-").concat(itemId), oldItem, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, { message: 'Árlista tétel törölve' }];
                }
            });
        });
    };
    PriceListController.prototype.import = function (priceListId, file, req) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!file) {
                            throw new Error('Fájl feltöltése kötelező');
                        }
                        return [4 /*yield*/, this.priceListService.importFromExcel(priceListId, file)];
                    case 1:
                        result = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('PriceListImport', "".concat(priceListId, "-").concat(Date.now()), result, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    PriceListController.prototype.export = function (id, res) {
        return __awaiter(this, void 0, void 0, function () {
            var buffer, priceList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.priceListService.exportToExcel(id)];
                    case 1:
                        buffer = _a.sent();
                        return [4 /*yield*/, this.priceListService.findOne(id)];
                    case 2:
                        priceList = _a.sent();
                        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        res.setHeader('Content-Disposition', "attachment; filename=\"arlista_".concat(priceList.nev.replace(/[^a-zA-Z0-9]/g, '_'), "_").concat(new Date().toISOString().split('T')[0], ".xlsx\""));
                        res.send(buffer);
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.PRICE_LIST_VIEW),
        __param(0, (0, common_1.Query)('skip')),
        __param(1, (0, common_1.Query)('take')),
        __param(2, (0, common_1.Query)('supplierId')),
        __param(3, (0, common_1.Query)('aktiv')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String, String]),
        __metadata("design:returntype", void 0)
    ], PriceListController.prototype, "findAll", null);
    __decorate([
        (0, common_1.Get)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.PRICE_LIST_VIEW),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], PriceListController.prototype, "findOne", null);
    __decorate([
        (0, common_1.Post)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.PRICE_LIST_CREATE),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [price_list_service_1.CreatePriceListDto, Object]),
        __metadata("design:returntype", Promise)
    ], PriceListController.prototype, "create", null);
    __decorate([
        (0, common_1.Put)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.PRICE_LIST_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, price_list_service_1.UpdatePriceListDto, Object]),
        __metadata("design:returntype", Promise)
    ], PriceListController.prototype, "update", null);
    __decorate([
        (0, common_1.Delete)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.PRICE_LIST_DELETE),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], PriceListController.prototype, "delete", null);
    __decorate([
        (0, common_1.Post)(':id/items'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.PRICE_LIST_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, price_list_service_1.AddPriceListItemDto, Object]),
        __metadata("design:returntype", Promise)
    ], PriceListController.prototype, "addItem", null);
    __decorate([
        (0, common_1.Put)(':id/items/:itemId'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.PRICE_LIST_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Param)('itemId')),
        __param(2, (0, common_1.Body)()),
        __param(3, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, price_list_service_1.UpdatePriceListItemDto, Object]),
        __metadata("design:returntype", Promise)
    ], PriceListController.prototype, "updateItem", null);
    __decorate([
        (0, common_1.Delete)(':id/items/:itemId'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.PRICE_LIST_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Param)('itemId')),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, Object]),
        __metadata("design:returntype", Promise)
    ], PriceListController.prototype, "removeItem", null);
    __decorate([
        (0, common_1.Post)(':id/import'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.PRICE_LIST_IMPORT),
        (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.UploadedFile)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], PriceListController.prototype, "import", null);
    __decorate([
        (0, common_1.Get)(':id/export'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.PRICE_LIST_EXPORT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Res)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], PriceListController.prototype, "export", null);
    PriceListController = __decorate([
        (0, common_1.Controller)('logistics/price-lists'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [price_list_service_1.PriceListService,
            audit_service_1.AuditService])
    ], PriceListController);
    return PriceListController;
}());
exports.PriceListController = PriceListController;
