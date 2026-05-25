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
exports.ShipmentController = void 0;
var common_1 = require("@nestjs/common");
var shipment_service_1 = require("./shipment.service");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var permission_enum_1 = require("../common/rbac/permission.enum");
var rbac_guard_1 = require("../common/rbac/rbac.guard");
var audit_service_1 = require("../common/audit/audit.service");
var ShipmentController = /** @class */ (function () {
    function ShipmentController(shipmentService, auditService) {
        this.shipmentService = shipmentService;
        this.auditService = auditService;
    }
    ShipmentController.prototype.findAll = function (orderId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.shipmentService.findAll(orderId)];
            });
        });
    };
    ShipmentController.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.shipmentService.findOne(id)];
            });
        });
    };
    ShipmentController.prototype.createFromOrder = function (orderId, body) {
        return __awaiter(this, void 0, void 0, function () {
            var shipment;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.shipmentService.createFromOrder(orderId, body)];
                    case 1:
                        shipment = _a.sent();
                        return [4 /*yield*/, this.auditService.log({
                                esemeny: 'generate',
                                entitas: 'Shipment',
                                entitasId: shipment.id,
                                uj: { orderId: orderId, from: 'order' },
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, shipment];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.SHIPMENT_VIEW),
        __param(0, (0, common_1.Query)('orderId')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], ShipmentController.prototype, "findAll", null);
    __decorate([
        (0, common_1.Get)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.SHIPMENT_VIEW),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], ShipmentController.prototype, "findOne", null);
    __decorate([
        (0, common_1.Post)('from-order/:orderId'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.SHIPMENT_CREATE),
        __param(0, (0, common_1.Param)('orderId')),
        __param(1, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], ShipmentController.prototype, "createFromOrder", null);
    ShipmentController = __decorate([
        (0, common_1.Controller)('crm/shipments'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [shipment_service_1.ShipmentService,
            audit_service_1.AuditService])
    ], ShipmentController);
    return ShipmentController;
}());
exports.ShipmentController = ShipmentController;
