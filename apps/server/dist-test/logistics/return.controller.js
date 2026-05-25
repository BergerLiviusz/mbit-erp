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
exports.ReturnController = void 0;
var common_1 = require("@nestjs/common");
var return_service_1 = require("./return.service");
var create_return_dto_1 = require("./dto/create-return.dto");
var update_return_dto_1 = require("./dto/update-return.dto");
var approve_return_dto_1 = require("./dto/approve-return.dto");
var audit_service_1 = require("../common/audit/audit.service");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var permission_enum_1 = require("../common/rbac/permission.enum");
var rbac_guard_1 = require("../common/rbac/rbac.guard");
var ReturnController = /** @class */ (function () {
    function ReturnController(returnService, auditService) {
        this.returnService = returnService;
        this.auditService = auditService;
    }
    ReturnController.prototype.findAll = function (skip, take, orderId, purchaseOrderId, itemId, warehouseId, allapot) {
        var filters = { orderId: orderId, purchaseOrderId: purchaseOrderId, itemId: itemId, warehouseId: warehouseId, allapot: allapot };
        return this.returnService.findAll(skip ? parseInt(skip) : 0, take ? parseInt(take) : 50, filters);
    };
    ReturnController.prototype.findOne = function (id) {
        return this.returnService.findOne(id);
    };
    ReturnController.prototype.create = function (dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var returnItem;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.returnService.create(dto, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 1:
                        returnItem = _c.sent();
                        return [4 /*yield*/, this.auditService.logCreate('Return', returnItem.id, returnItem, (_b = req.user) === null || _b === void 0 ? void 0 : _b.id)];
                    case 2:
                        _c.sent();
                        return [2 /*return*/, returnItem];
                }
            });
        });
    };
    ReturnController.prototype.update = function (id, dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var old, updated;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.returnService.findOne(id)];
                    case 1:
                        old = _c.sent();
                        return [4 /*yield*/, this.returnService.update(id, dto, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        updated = _c.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('Return', id, old, updated, (_b = req.user) === null || _b === void 0 ? void 0 : _b.id)];
                    case 3:
                        _c.sent();
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    ReturnController.prototype.approve = function (id, dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var old, approved;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.returnService.findOne(id)];
                    case 1:
                        old = _c.sent();
                        return [4 /*yield*/, this.returnService.approve(id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id, dto.megjegyzesek)];
                    case 2:
                        approved = _c.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('Return', id, old, approved, (_b = req.user) === null || _b === void 0 ? void 0 : _b.id)];
                    case 3:
                        _c.sent();
                        return [2 /*return*/, approved];
                }
            });
        });
    };
    ReturnController.prototype.reject = function (id, body, req) {
        return __awaiter(this, void 0, void 0, function () {
            var old, rejected;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.returnService.findOne(id)];
                    case 1:
                        old = _c.sent();
                        return [4 /*yield*/, this.returnService.reject(id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id, body.reason)];
                    case 2:
                        rejected = _c.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('Return', id, old, rejected, (_b = req.user) === null || _b === void 0 ? void 0 : _b.id)];
                    case 3:
                        _c.sent();
                        return [2 /*return*/, rejected];
                }
            });
        });
    };
    ReturnController.prototype.complete = function (id, req) {
        return __awaiter(this, void 0, void 0, function () {
            var old, completed;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.returnService.findOne(id)];
                    case 1:
                        old = _c.sent();
                        return [4 /*yield*/, this.returnService.complete(id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        completed = _c.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('Return', id, old, completed, (_b = req.user) === null || _b === void 0 ? void 0 : _b.id)];
                    case 3:
                        _c.sent();
                        return [2 /*return*/, completed];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.RETURN_VIEW),
        __param(0, (0, common_1.Query)('skip')),
        __param(1, (0, common_1.Query)('take')),
        __param(2, (0, common_1.Query)('orderId')),
        __param(3, (0, common_1.Query)('purchaseOrderId')),
        __param(4, (0, common_1.Query)('itemId')),
        __param(5, (0, common_1.Query)('warehouseId')),
        __param(6, (0, common_1.Query)('allapot')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
        __metadata("design:returntype", void 0)
    ], ReturnController.prototype, "findAll", null);
    __decorate([
        (0, common_1.Get)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.RETURN_VIEW),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], ReturnController.prototype, "findOne", null);
    __decorate([
        (0, common_1.Post)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.RETURN_CREATE),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [create_return_dto_1.CreateReturnDto, Object]),
        __metadata("design:returntype", Promise)
    ], ReturnController.prototype, "create", null);
    __decorate([
        (0, common_1.Put)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.RETURN_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, update_return_dto_1.UpdateReturnDto, Object]),
        __metadata("design:returntype", Promise)
    ], ReturnController.prototype, "update", null);
    __decorate([
        (0, common_1.Post)(':id/approve'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.RETURN_APPROVE),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, approve_return_dto_1.ApproveReturnDto, Object]),
        __metadata("design:returntype", Promise)
    ], ReturnController.prototype, "approve", null);
    __decorate([
        (0, common_1.Post)(':id/reject'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.RETURN_APPROVE),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], ReturnController.prototype, "reject", null);
    __decorate([
        (0, common_1.Post)(':id/complete'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.RETURN_COMPLETE),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], ReturnController.prototype, "complete", null);
    ReturnController = __decorate([
        (0, common_1.Controller)('logistics/returns'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [return_service_1.ReturnService,
            audit_service_1.AuditService])
    ], ReturnController);
    return ReturnController;
}());
exports.ReturnController = ReturnController;
