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
exports.StockReservationController = void 0;
var common_1 = require("@nestjs/common");
var stock_reservation_service_1 = require("./stock-reservation.service");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var permission_enum_1 = require("../common/rbac/permission.enum");
var rbac_guard_1 = require("../common/rbac/rbac.guard");
var audit_service_1 = require("../common/audit/audit.service");
var StockReservationController = /** @class */ (function () {
    function StockReservationController(stockReservationService, auditService) {
        this.stockReservationService = stockReservationService;
        this.auditService = auditService;
    }
    StockReservationController.prototype.findAllReservations = function (skip, take, itemId, warehouseId, orderId, allapot) {
        return this.stockReservationService.findAllReservations(skip ? parseInt(skip) : 0, take ? parseInt(take) : 50, {
            itemId: itemId,
            warehouseId: warehouseId,
            orderId: orderId,
            allapot: allapot,
        });
    };
    StockReservationController.prototype.getAvailableStock = function (itemId, warehouseId, locationId) {
        return this.stockReservationService.getAvailableStock(itemId, warehouseId, locationId);
    };
    // Expected Receipts - Must be before :id route to avoid route conflicts
    StockReservationController.prototype.findAllExpectedReceipts = function (skip, take, warehouseId, purchaseOrderId, allapot, vartBeerkezesFrom, vartBeerkezesTo) {
        return this.stockReservationService.findAllExpectedReceipts(skip ? parseInt(skip) : 0, take ? parseInt(take) : 50, {
            warehouseId: warehouseId,
            purchaseOrderId: purchaseOrderId,
            allapot: allapot,
            vartBeerkezesFrom: vartBeerkezesFrom,
            vartBeerkezesTo: vartBeerkezesTo,
        });
    };
    StockReservationController.prototype.findOneExpectedReceipt = function (id) {
        return this.stockReservationService.findOneExpectedReceipt(id);
    };
    StockReservationController.prototype.createExpectedReceipt = function (dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var receipt;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.stockReservationService.createExpectedReceipt(dto)];
                    case 1:
                        receipt = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('ExpectedReceipt', receipt.id, receipt, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, receipt];
                }
            });
        });
    };
    StockReservationController.prototype.markExpectedReceiptAsReceived = function (id, req) {
        return __awaiter(this, void 0, void 0, function () {
            var receipt;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.stockReservationService.markExpectedReceiptAsReceived(id)];
                    case 1:
                        receipt = _b.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('ExpectedReceipt', id, { allapot: 'VAR' }, { allapot: 'ERKEZETT' }, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, receipt];
                }
            });
        });
    };
    StockReservationController.prototype.deleteExpectedReceipt = function (id, req) {
        return __awaiter(this, void 0, void 0, function () {
            var oldReceipt;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.stockReservationService.findOneExpectedReceipt(id)];
                    case 1:
                        oldReceipt = _b.sent();
                        return [4 /*yield*/, this.stockReservationService.deleteExpectedReceipt(id)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.auditService.logDelete('ExpectedReceipt', id, oldReceipt, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, { message: 'Várható beérkezés törölve' }];
                }
            });
        });
    };
    StockReservationController.prototype.findOneReservation = function (id) {
        return this.stockReservationService.findOneReservation(id);
    };
    StockReservationController.prototype.createReservation = function (dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var reservation;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.stockReservationService.createReservation(dto)];
                    case 1:
                        reservation = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('StockReservation', reservation.id, reservation, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, reservation];
                }
            });
        });
    };
    StockReservationController.prototype.updateReservation = function (id, dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var oldReservation, updated;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.stockReservationService.findOneReservation(id)];
                    case 1:
                        oldReservation = _b.sent();
                        return [4 /*yield*/, this.stockReservationService.updateReservation(id, dto)];
                    case 2:
                        updated = _b.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('StockReservation', id, oldReservation, updated, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    StockReservationController.prototype.deleteReservation = function (id, req) {
        return __awaiter(this, void 0, void 0, function () {
            var oldReservation;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.stockReservationService.findOneReservation(id)];
                    case 1:
                        oldReservation = _b.sent();
                        return [4 /*yield*/, this.stockReservationService.deleteReservation(id)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.auditService.logDelete('StockReservation', id, oldReservation, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, { message: 'Készletfoglalás törölve' }];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.LOGISTICS_VIEW),
        __param(0, (0, common_1.Query)('skip')),
        __param(1, (0, common_1.Query)('take')),
        __param(2, (0, common_1.Query)('itemId')),
        __param(3, (0, common_1.Query)('warehouseId')),
        __param(4, (0, common_1.Query)('orderId')),
        __param(5, (0, common_1.Query)('allapot')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String, String, String, String]),
        __metadata("design:returntype", void 0)
    ], StockReservationController.prototype, "findAllReservations", null);
    __decorate([
        (0, common_1.Get)('available/:itemId/:warehouseId'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.LOGISTICS_VIEW),
        __param(0, (0, common_1.Param)('itemId')),
        __param(1, (0, common_1.Param)('warehouseId')),
        __param(2, (0, common_1.Query)('locationId')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String]),
        __metadata("design:returntype", void 0)
    ], StockReservationController.prototype, "getAvailableStock", null);
    __decorate([
        (0, common_1.Get)('expected-receipts'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.LOGISTICS_VIEW),
        __param(0, (0, common_1.Query)('skip')),
        __param(1, (0, common_1.Query)('take')),
        __param(2, (0, common_1.Query)('warehouseId')),
        __param(3, (0, common_1.Query)('purchaseOrderId')),
        __param(4, (0, common_1.Query)('allapot')),
        __param(5, (0, common_1.Query)('vartBeerkezesFrom')),
        __param(6, (0, common_1.Query)('vartBeerkezesTo')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
        __metadata("design:returntype", void 0)
    ], StockReservationController.prototype, "findAllExpectedReceipts", null);
    __decorate([
        (0, common_1.Get)('expected-receipts/:id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.LOGISTICS_VIEW),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], StockReservationController.prototype, "findOneExpectedReceipt", null);
    __decorate([
        (0, common_1.Post)('expected-receipts'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.LOGISTICS_CREATE),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], StockReservationController.prototype, "createExpectedReceipt", null);
    __decorate([
        (0, common_1.Post)('expected-receipts/:id/mark-received'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.LOGISTICS_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], StockReservationController.prototype, "markExpectedReceiptAsReceived", null);
    __decorate([
        (0, common_1.Delete)('expected-receipts/:id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.LOGISTICS_DELETE),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], StockReservationController.prototype, "deleteExpectedReceipt", null);
    __decorate([
        (0, common_1.Get)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.LOGISTICS_VIEW),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], StockReservationController.prototype, "findOneReservation", null);
    __decorate([
        (0, common_1.Post)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.LOGISTICS_CREATE),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], StockReservationController.prototype, "createReservation", null);
    __decorate([
        (0, common_1.Put)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.LOGISTICS_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], StockReservationController.prototype, "updateReservation", null);
    __decorate([
        (0, common_1.Delete)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.LOGISTICS_DELETE),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], StockReservationController.prototype, "deleteReservation", null);
    StockReservationController = __decorate([
        (0, common_1.Controller)('logistics/stock-reservations'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [stock_reservation_service_1.StockReservationService,
            audit_service_1.AuditService])
    ], StockReservationController);
    return StockReservationController;
}());
exports.StockReservationController = StockReservationController;
