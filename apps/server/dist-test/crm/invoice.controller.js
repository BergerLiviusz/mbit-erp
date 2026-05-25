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
exports.InvoiceController = void 0;
var common_1 = require("@nestjs/common");
var invoice_service_1 = require("./invoice.service");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var permission_enum_1 = require("../common/rbac/permission.enum");
var rbac_guard_1 = require("../common/rbac/rbac.guard");
var audit_service_1 = require("../common/audit/audit.service");
var InvoiceController = /** @class */ (function () {
    function InvoiceController(invoiceService, auditService) {
        this.invoiceService = invoiceService;
        this.auditService = auditService;
    }
    InvoiceController.prototype.findAll = function (skip, take, accountId, orderId, allapot, tipus, kiallitasDatumFrom, kiallitasDatumTo) {
        return this.invoiceService.findAll(skip ? parseInt(skip) : 0, take ? parseInt(take) : 50, {
            accountId: accountId,
            orderId: orderId,
            allapot: allapot,
            tipus: tipus,
            kiallitasDatumFrom: kiallitasDatumFrom,
            kiallitasDatumTo: kiallitasDatumTo,
        });
    };
    InvoiceController.prototype.findOne = function (id) {
        return this.invoiceService.findOne(id);
    };
    InvoiceController.prototype.create = function (dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var invoice;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.invoiceService.create(dto)];
                    case 1:
                        invoice = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('Invoice', invoice.id, invoice, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, invoice];
                }
            });
        });
    };
    InvoiceController.prototype.createFromOrder = function (orderId, req, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var invoice;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.invoiceService.createFromOrder(orderId, dto)];
                    case 1:
                        invoice = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('Invoice', invoice.id, __assign(__assign({}, invoice), { source: 'order', orderId: orderId }), (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, invoice];
                }
            });
        });
    };
    InvoiceController.prototype.createFromPurchaseOrder = function (purchaseOrderId, req, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var invoice;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.invoiceService.createFromPurchaseOrder(purchaseOrderId, dto)];
                    case 1:
                        invoice = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('Invoice', invoice.id, __assign(__assign({}, invoice), { source: 'purchaseOrder', purchaseOrderId: purchaseOrderId }), (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, invoice];
                }
            });
        });
    };
    InvoiceController.prototype.createFromDeliveryNote = function (deliveryNoteId, req, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var invoice;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.invoiceService.createFromDeliveryNote(deliveryNoteId, dto)];
                    case 1:
                        invoice = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('Invoice', invoice.id, __assign(__assign({}, invoice), { source: 'deliveryNote', deliveryNoteId: deliveryNoteId }), (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, invoice];
                }
            });
        });
    };
    InvoiceController.prototype.update = function (id, dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var oldInvoice, updated;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.invoiceService.findOne(id)];
                    case 1:
                        oldInvoice = _b.sent();
                        return [4 /*yield*/, this.invoiceService.update(id, dto)];
                    case 2:
                        updated = _b.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('Invoice', id, oldInvoice, updated, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    InvoiceController.prototype.markAsIssued = function (id, req) {
        return __awaiter(this, void 0, void 0, function () {
            var invoice;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.invoiceService.markAsIssued(id)];
                    case 1:
                        invoice = _b.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('Invoice', id, { allapot: 'VAZLAT' }, { allapot: 'KIALLITVA' }, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, invoice];
                }
            });
        });
    };
    InvoiceController.prototype.markAsSent = function (id, req) {
        return __awaiter(this, void 0, void 0, function () {
            var invoice;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.invoiceService.markAsSent(id)];
                    case 1:
                        invoice = _b.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('Invoice', id, { allapot: 'KIALLITVA' }, { allapot: 'ELKULDVE' }, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, invoice];
                }
            });
        });
    };
    InvoiceController.prototype.addPayment = function (id, dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var payment;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.invoiceService.addPayment(id, dto)];
                    case 1:
                        payment = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('InvoicePayment', payment.id, payment, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, payment];
                }
            });
        });
    };
    InvoiceController.prototype.storno = function (id, body, req) {
        return __awaiter(this, void 0, void 0, function () {
            var invoice;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.invoiceService.storno(id, body.reason)];
                    case 1:
                        invoice = _b.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('Invoice', id, { allapot: invoice.allapot }, { allapot: 'STORNO' }, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, invoice];
                }
            });
        });
    };
    InvoiceController.prototype.delete = function (id, req) {
        return __awaiter(this, void 0, void 0, function () {
            var oldInvoice;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.invoiceService.findOne(id)];
                    case 1:
                        oldInvoice = _b.sent();
                        return [4 /*yield*/, this.invoiceService.delete(id)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.auditService.logDelete('Invoice', id, oldInvoice, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, { message: 'Számla törölve' }];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.CRM_VIEW),
        __param(0, (0, common_1.Query)('skip')),
        __param(1, (0, common_1.Query)('take')),
        __param(2, (0, common_1.Query)('accountId')),
        __param(3, (0, common_1.Query)('orderId')),
        __param(4, (0, common_1.Query)('allapot')),
        __param(5, (0, common_1.Query)('tipus')),
        __param(6, (0, common_1.Query)('kiallitasDatumFrom')),
        __param(7, (0, common_1.Query)('kiallitasDatumTo')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String, String, String, String, String, String]),
        __metadata("design:returntype", void 0)
    ], InvoiceController.prototype, "findAll", null);
    __decorate([
        (0, common_1.Get)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.CRM_VIEW),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], InvoiceController.prototype, "findOne", null);
    __decorate([
        (0, common_1.Post)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.CRM_CREATE),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], InvoiceController.prototype, "create", null);
    __decorate([
        (0, common_1.Post)('from-order/:orderId'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.CRM_CREATE),
        __param(0, (0, common_1.Param)('orderId')),
        __param(1, (0, common_1.Request)()),
        __param(2, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], InvoiceController.prototype, "createFromOrder", null);
    __decorate([
        (0, common_1.Post)('from-purchase-order/:purchaseOrderId'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.CRM_CREATE),
        __param(0, (0, common_1.Param)('purchaseOrderId')),
        __param(1, (0, common_1.Request)()),
        __param(2, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], InvoiceController.prototype, "createFromPurchaseOrder", null);
    __decorate([
        (0, common_1.Post)('from-delivery-note/:deliveryNoteId'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.CRM_CREATE),
        __param(0, (0, common_1.Param)('deliveryNoteId')),
        __param(1, (0, common_1.Request)()),
        __param(2, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], InvoiceController.prototype, "createFromDeliveryNote", null);
    __decorate([
        (0, common_1.Put)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.CRM_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], InvoiceController.prototype, "update", null);
    __decorate([
        (0, common_1.Post)(':id/mark-issued'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.CRM_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], InvoiceController.prototype, "markAsIssued", null);
    __decorate([
        (0, common_1.Post)(':id/mark-sent'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.CRM_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], InvoiceController.prototype, "markAsSent", null);
    __decorate([
        (0, common_1.Post)(':id/payments'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.CRM_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], InvoiceController.prototype, "addPayment", null);
    __decorate([
        (0, common_1.Post)(':id/storno'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.CRM_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], InvoiceController.prototype, "storno", null);
    __decorate([
        (0, common_1.Delete)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.CRM_DELETE),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], InvoiceController.prototype, "delete", null);
    InvoiceController = __decorate([
        (0, common_1.Controller)('crm/invoices'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [invoice_service_1.InvoiceService,
            audit_service_1.AuditService])
    ], InvoiceController);
    return InvoiceController;
}());
exports.InvoiceController = InvoiceController;
