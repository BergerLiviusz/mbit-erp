"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.StockMovementController = void 0;
var common_1 = require("@nestjs/common");
var stock_movement_service_1 = require("./stock-movement.service");
var audit_service_1 = require("../common/audit/audit.service");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var permission_enum_1 = require("../common/rbac/permission.enum");
var rbac_guard_1 = require("../common/rbac/rbac.guard");
var StockMovementController = /** @class */ (function () {
    function StockMovementController(movementService, auditService) {
        this.movementService = movementService;
        this.auditService = auditService;
    }
    StockMovementController.prototype.findAll = function (itemId, warehouseId, tipus, sarzsGyartasiSzam, skip, take) {
        return this.movementService.findMovements({
            itemId: itemId,
            warehouseId: warehouseId,
            tipus: tipus,
            sarzsGyartasiSzam: sarzsGyartasiSzam,
            skip: skip ? parseInt(skip, 10) : 0,
            take: take ? parseInt(take, 10) : 100,
        });
    };
    StockMovementController.prototype.findLots = function (warehouseId, itemId, sarzsGyartasiSzam, expiringWithinDays, skip, take) {
        return this.movementService.findLots({
            warehouseId: warehouseId,
            itemId: itemId,
            sarzsGyartasiSzam: sarzsGyartasiSzam,
            expiringWithinDays: expiringWithinDays
                ? parseInt(expiringWithinDays, 10)
                : undefined,
            skip: skip ? parseInt(skip, 10) : 0,
            take: take ? parseInt(take, 10) : 100,
        });
    };
    StockMovementController.prototype.alerts = function () {
        return this.movementService.getStockAlerts();
    };
    StockMovementController.prototype.execute = function (dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, move;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        userId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : (_c = req.user) === null || _c === void 0 ? void 0 : _c.userId;
                        return [4 /*yield*/, this.movementService.execute(__assign(__assign({}, dto), { userId: userId }))];
                    case 1:
                        move = _d.sent();
                        return [4 /*yield*/, this.auditService.logCreate('StockMove', move.id, move, userId)];
                    case 2:
                        _d.sent();
                        return [2 /*return*/, move];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.STOCK_VIEW, permission_enum_1.Permission.LOGISTICS_VIEW),
        __param(0, (0, common_1.Query)('itemId')),
        __param(1, (0, common_1.Query)('warehouseId')),
        __param(2, (0, common_1.Query)('tipus')),
        __param(3, (0, common_1.Query)('sarzsGyartasiSzam')),
        __param(4, (0, common_1.Query)('skip')),
        __param(5, (0, common_1.Query)('take')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String, String, String, String]),
        __metadata("design:returntype", void 0)
    ], StockMovementController.prototype, "findAll", null);
    __decorate([
        (0, common_1.Get)('lots'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.STOCK_VIEW, permission_enum_1.Permission.LOGISTICS_VIEW),
        __param(0, (0, common_1.Query)('warehouseId')),
        __param(1, (0, common_1.Query)('itemId')),
        __param(2, (0, common_1.Query)('sarzsGyartasiSzam')),
        __param(3, (0, common_1.Query)('expiringWithinDays')),
        __param(4, (0, common_1.Query)('skip')),
        __param(5, (0, common_1.Query)('take')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String, String, String, String]),
        __metadata("design:returntype", void 0)
    ], StockMovementController.prototype, "findLots", null);
    __decorate([
        (0, common_1.Get)('alerts'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.STOCK_VIEW, permission_enum_1.Permission.LOGISTICS_VIEW),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], StockMovementController.prototype, "alerts", null);
    __decorate([
        (0, common_1.Post)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.STOCK_MOVE, permission_enum_1.Permission.INVENTORY_MANAGE, permission_enum_1.Permission.LOGISTICS_EDIT),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Req)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], StockMovementController.prototype, "execute", null);
    StockMovementController = __decorate([
        (0, common_1.Controller)('logistics/stock-movements'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [stock_movement_service_1.StockMovementService,
            audit_service_1.AuditService])
    ], StockMovementController);
    return StockMovementController;
}());
exports.StockMovementController = StockMovementController;
