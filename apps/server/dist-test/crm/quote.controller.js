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
exports.QuoteController = void 0;
var common_1 = require("@nestjs/common");
var quote_service_1 = require("./quote.service");
var sales_flow_service_1 = require("./sales-flow.service");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var permission_enum_1 = require("../common/rbac/permission.enum");
var rbac_guard_1 = require("../common/rbac/rbac.guard");
var audit_service_1 = require("../common/audit/audit.service");
var QuoteController = /** @class */ (function () {
    function QuoteController(quoteService, salesFlowService, auditService) {
        this.quoteService = quoteService;
        this.salesFlowService = salesFlowService;
        this.auditService = auditService;
    }
    QuoteController.prototype.findAll = function (skipParam, takeParam, allapot) {
        return __awaiter(this, void 0, void 0, function () {
            var skip, take;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        skip = skipParam ? parseInt(skipParam, 10) : 0;
                        take = takeParam ? parseInt(takeParam, 10) : 10;
                        if (isNaN(skip) || skip < 0) {
                            throw new common_1.BadRequestException('Invalid skip parameter');
                        }
                        if (isNaN(take) || take < 1) {
                            throw new common_1.BadRequestException('Invalid take parameter');
                        }
                        return [4 /*yield*/, this.quoteService.findAll(skip, take, allapot)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    QuoteController.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.quoteService.findOne(id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    QuoteController.prototype.create = function (createDto) {
        return __awaiter(this, void 0, void 0, function () {
            var quote;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.quoteService.create(createDto)];
                    case 1:
                        quote = _a.sent();
                        return [4 /*yield*/, this.auditService.logCreate('Quote', quote.id, createDto)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, quote];
                }
            });
        });
    };
    QuoteController.prototype.update = function (id, updateDto) {
        return __awaiter(this, void 0, void 0, function () {
            var old, quote;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.quoteService.findOne(id)];
                    case 1:
                        old = _a.sent();
                        return [4 /*yield*/, this.quoteService.update(id, updateDto)];
                    case 2:
                        quote = _a.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('Quote', id, old, updateDto)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, quote];
                }
            });
        });
    };
    QuoteController.prototype.convertToOrder = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var order;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.salesFlowService.convertQuoteToOrder(id)];
                    case 1:
                        order = _a.sent();
                        return [4 /*yield*/, this.auditService.log({
                                esemeny: 'generate',
                                entitas: 'Order',
                                entitasId: order.id,
                                uj: { quoteId: id },
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, order];
                }
            });
        });
    };
    QuoteController.prototype.approve = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var old, quote;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.quoteService.findOne(id)];
                    case 1:
                        old = _a.sent();
                        return [4 /*yield*/, this.quoteService.approve(id)];
                    case 2:
                        quote = _a.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('Quote', id, old, { allapot: quote.allapot })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, quote];
                }
            });
        });
    };
    QuoteController.prototype.reject = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var old, quote;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.quoteService.findOne(id)];
                    case 1:
                        old = _a.sent();
                        return [4 /*yield*/, this.quoteService.reject(id)];
                    case 2:
                        quote = _a.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('Quote', id, old, { allapot: 'elutasitott' })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, quote];
                }
            });
        });
    };
    QuoteController.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var old;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.quoteService.findOne(id)];
                    case 1:
                        old = _a.sent();
                        return [4 /*yield*/, this.quoteService.delete(id)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.auditService.logDelete('Quote', id, old)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, { message: 'Árajánlat törölve' }];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.QUOTE_VIEW),
        __param(0, (0, common_1.Query)('skip')),
        __param(1, (0, common_1.Query)('take')),
        __param(2, (0, common_1.Query)('allapot')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String]),
        __metadata("design:returntype", Promise)
    ], QuoteController.prototype, "findAll", null);
    __decorate([
        (0, common_1.Get)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.QUOTE_VIEW),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], QuoteController.prototype, "findOne", null);
    __decorate([
        (0, common_1.Post)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.QUOTE_CREATE),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], QuoteController.prototype, "create", null);
    __decorate([
        (0, common_1.Put)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.QUOTE_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], QuoteController.prototype, "update", null);
    __decorate([
        (0, common_1.Post)(':id/convert-to-order'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.ORDER_CREATE),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], QuoteController.prototype, "convertToOrder", null);
    __decorate([
        (0, common_1.Post)(':id/approve'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.QUOTE_APPROVE),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], QuoteController.prototype, "approve", null);
    __decorate([
        (0, common_1.Post)(':id/reject'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.QUOTE_APPROVE),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], QuoteController.prototype, "reject", null);
    __decorate([
        (0, common_1.Delete)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.QUOTE_DELETE),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], QuoteController.prototype, "delete", null);
    QuoteController = __decorate([
        (0, common_1.Controller)('crm/quotes'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [quote_service_1.QuoteService,
            sales_flow_service_1.SalesFlowService,
            audit_service_1.AuditService])
    ], QuoteController);
    return QuoteController;
}());
exports.QuoteController = QuoteController;
