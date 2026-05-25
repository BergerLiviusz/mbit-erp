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
exports.OrderController = void 0;
var common_1 = require("@nestjs/common");
var order_service_1 = require("./order.service");
var create_order_dto_1 = require("./dto/create-order.dto");
var update_order_dto_1 = require("./dto/update-order.dto");
var order_status_dto_1 = require("./dto/order-status.dto");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var permission_enum_1 = require("../common/rbac/permission.enum");
var rbac_guard_1 = require("../common/rbac/rbac.guard");
var audit_service_1 = require("../common/audit/audit.service");
var order_status_enum_1 = require("./enums/order-status.enum");
var OrderController = /** @class */ (function () {
    function OrderController(orderService, auditService) {
        this.orderService = orderService;
        this.auditService = auditService;
    }
    OrderController.prototype.create = function (req, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var newOrder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.orderService.create(dto)];
                    case 1:
                        newOrder = _a.sent();
                        return [4 /*yield*/, this.auditService.logCreate('order', newOrder.id, newOrder)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, newOrder];
                }
            });
        });
    };
    OrderController.prototype.findAll = function (skip, take, allapot, accountId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function () {
            var filters;
            return __generator(this, function (_a) {
                filters = { allapot: allapot, accountId: accountId, startDate: startDate, endDate: endDate };
                return [2 /*return*/, this.orderService.findAll(skip ? parseInt(skip) : 0, take ? parseInt(take) : 50, filters)];
            });
        });
    };
    OrderController.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.orderService.findOne(id)];
            });
        });
    };
    OrderController.prototype.update = function (id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var oldOrder, updatedOrder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.orderService.findOne(id)];
                    case 1:
                        oldOrder = _a.sent();
                        return [4 /*yield*/, this.orderService.update(id, dto)];
                    case 2:
                        updatedOrder = _a.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('order', id, oldOrder, updatedOrder)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, updatedOrder];
                }
            });
        });
    };
    OrderController.prototype.changeStatus = function (req, id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var oldOrder, updatedOrder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.orderService.findOne(id)];
                    case 1:
                        oldOrder = _a.sent();
                        return [4 /*yield*/, this.orderService.changeStatus(id, dto.allapot, dto.megjegyzesek, dto.warehouseId)];
                    case 2:
                        updatedOrder = _a.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('order', id, oldOrder, updatedOrder, "Status changed to ".concat(dto.allapot))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, updatedOrder];
                }
            });
        });
    };
    OrderController.prototype.cancel = function (req, id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var oldOrder, cancelledOrder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.orderService.findOne(id)];
                    case 1:
                        oldOrder = _a.sent();
                        return [4 /*yield*/, this.orderService.changeStatus(id, order_status_enum_1.OrderStatus.CANCELLED, dto.megjegyzesek || 'Rendelés visszavonva')];
                    case 2:
                        cancelledOrder = _a.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('order', id, oldOrder, cancelledOrder, 'Order cancelled')];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, cancelledOrder];
                }
            });
        });
    };
    OrderController.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var deletedOrder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.orderService.delete(id)];
                    case 1:
                        deletedOrder = _a.sent();
                        return [4 /*yield*/, this.auditService.logDelete('order', id, deletedOrder)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, deletedOrder];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Post)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.ORDER_CREATE),
        __param(0, (0, common_1.Request)()),
        __param(1, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, create_order_dto_1.CreateOrderDto]),
        __metadata("design:returntype", Promise)
    ], OrderController.prototype, "create", null);
    __decorate([
        (0, common_1.Get)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.ORDER_VIEW),
        __param(0, (0, common_1.Query)('skip')),
        __param(1, (0, common_1.Query)('take')),
        __param(2, (0, common_1.Query)('allapot')),
        __param(3, (0, common_1.Query)('accountId')),
        __param(4, (0, common_1.Query)('startDate')),
        __param(5, (0, common_1.Query)('endDate')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String, String, String, String]),
        __metadata("design:returntype", Promise)
    ], OrderController.prototype, "findAll", null);
    __decorate([
        (0, common_1.Get)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.ORDER_VIEW),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], OrderController.prototype, "findOne", null);
    __decorate([
        (0, common_1.Put)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.ORDER_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, update_order_dto_1.UpdateOrderDto]),
        __metadata("design:returntype", Promise)
    ], OrderController.prototype, "update", null);
    __decorate([
        (0, common_1.Post)(':id/status'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.ORDER_FULFILL),
        __param(0, (0, common_1.Request)()),
        __param(1, (0, common_1.Param)('id')),
        __param(2, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String, order_status_dto_1.OrderStatusDto]),
        __metadata("design:returntype", Promise)
    ], OrderController.prototype, "changeStatus", null);
    __decorate([
        (0, common_1.Post)(':id/cancel'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.ORDER_CANCEL),
        __param(0, (0, common_1.Request)()),
        __param(1, (0, common_1.Param)('id')),
        __param(2, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String, order_status_dto_1.OrderStatusDto]),
        __metadata("design:returntype", Promise)
    ], OrderController.prototype, "cancel", null);
    __decorate([
        (0, common_1.Delete)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.ORDER_DELETE),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], OrderController.prototype, "delete", null);
    OrderController = __decorate([
        (0, common_1.Controller)('crm/orders'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [order_service_1.OrderService,
            audit_service_1.AuditService])
    ], OrderController);
    return OrderController;
}());
exports.OrderController = OrderController;
