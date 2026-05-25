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
exports.IntrastatController = void 0;
var common_1 = require("@nestjs/common");
var intrastat_service_1 = require("./intrastat.service");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var permission_enum_1 = require("../common/rbac/permission.enum");
var rbac_guard_1 = require("../common/rbac/rbac.guard");
var audit_service_1 = require("../common/audit/audit.service");
var IntrastatController = /** @class */ (function () {
    function IntrastatController(intrastatService, auditService) {
        this.intrastatService = intrastatService;
        this.auditService = auditService;
    }
    IntrastatController.prototype.findAll = function (skip, take, ev, honap, allapot) {
        return this.intrastatService.findAll(skip ? parseInt(skip) : 0, take ? parseInt(take) : 50, {
            ev: ev ? parseInt(ev) : undefined,
            honap: honap ? parseInt(honap) : undefined,
            allapot: allapot,
        });
    };
    IntrastatController.prototype.findByEvHonap = function (ev, honap) {
        return this.intrastatService.findByEvHonap(parseInt(ev), parseInt(honap));
    };
    IntrastatController.prototype.findOne = function (id) {
        return this.intrastatService.findOne(id);
    };
    IntrastatController.prototype.exportNav = function (id, res) {
        return __awaiter(this, void 0, void 0, function () {
            var content, declaration;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.intrastatService.generateNavFormat(id)];
                    case 1:
                        content = _a.sent();
                        return [4 /*yield*/, this.intrastatService.findOne(id)];
                    case 2:
                        declaration = _a.sent();
                        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                        res.setHeader('Content-Disposition', "attachment; filename=\"intrastat_".concat(declaration.ev, "_").concat(declaration.honap, "_nav.txt\""));
                        res.send(content);
                        return [2 /*return*/];
                }
            });
        });
    };
    IntrastatController.prototype.exportXml = function (id, res) {
        return __awaiter(this, void 0, void 0, function () {
            var content, declaration;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.intrastatService.generateXmlFormat(id)];
                    case 1:
                        content = _a.sent();
                        return [4 /*yield*/, this.intrastatService.findOne(id)];
                    case 2:
                        declaration = _a.sent();
                        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
                        res.setHeader('Content-Disposition', "attachment; filename=\"intrastat_".concat(declaration.ev, "_").concat(declaration.honap, ".xml\""));
                        res.send(content);
                        return [2 /*return*/];
                }
            });
        });
    };
    IntrastatController.prototype.create = function (dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var declaration;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.intrastatService.create(dto)];
                    case 1:
                        declaration = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('IntrastatDeclaration', declaration.id, declaration, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, declaration];
                }
            });
        });
    };
    IntrastatController.prototype.addItem = function (declarationId, dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var item;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.intrastatService.addItem(declarationId, dto)];
                    case 1:
                        item = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('IntrastatItem', item.id, item, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, item];
                }
            });
        });
    };
    IntrastatController.prototype.updateItem = function (declarationId, itemId, dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var oldItem, updated;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.intrastatService.findOne(declarationId)];
                    case 1:
                        oldItem = _b.sent();
                        return [4 /*yield*/, this.intrastatService.updateItem(declarationId, itemId, dto)];
                    case 2:
                        updated = _b.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('IntrastatItem', itemId, oldItem, updated, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    IntrastatController.prototype.markAsReady = function (id, req) {
        return __awaiter(this, void 0, void 0, function () {
            var oldDeclaration, updated;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.intrastatService.findOne(id)];
                    case 1:
                        oldDeclaration = _b.sent();
                        return [4 /*yield*/, this.intrastatService.markAsReady(id)];
                    case 2:
                        updated = _b.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('IntrastatDeclaration', id, oldDeclaration, updated, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    IntrastatController.prototype.markAsSent = function (id, req) {
        return __awaiter(this, void 0, void 0, function () {
            var oldDeclaration, updated;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.intrastatService.findOne(id)];
                    case 1:
                        oldDeclaration = _b.sent();
                        return [4 /*yield*/, this.intrastatService.markAsSent(id)];
                    case 2:
                        updated = _b.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('IntrastatDeclaration', id, oldDeclaration, updated, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    IntrastatController.prototype.deleteItem = function (declarationId, itemId, req) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.intrastatService.deleteItem(declarationId, itemId)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.auditService.logDelete('IntrastatItem', itemId, {}, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, { message: 'INTRASTAT tétel törölve' }];
                }
            });
        });
    };
    IntrastatController.prototype.delete = function (id, req) {
        return __awaiter(this, void 0, void 0, function () {
            var oldDeclaration;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.intrastatService.findOne(id)];
                    case 1:
                        oldDeclaration = _b.sent();
                        return [4 /*yield*/, this.intrastatService.delete(id)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.auditService.logDelete('IntrastatDeclaration', id, oldDeclaration, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, { message: 'INTRASTAT bejelentés törölve' }];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.STOCK_VIEW),
        __param(0, (0, common_1.Query)('skip')),
        __param(1, (0, common_1.Query)('take')),
        __param(2, (0, common_1.Query)('ev')),
        __param(3, (0, common_1.Query)('honap')),
        __param(4, (0, common_1.Query)('allapot')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String, String, String]),
        __metadata("design:returntype", void 0)
    ], IntrastatController.prototype, "findAll", null);
    __decorate([
        (0, common_1.Get)('ev/:ev/honap/:honap'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.STOCK_VIEW),
        __param(0, (0, common_1.Param)('ev')),
        __param(1, (0, common_1.Param)('honap')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", void 0)
    ], IntrastatController.prototype, "findByEvHonap", null);
    __decorate([
        (0, common_1.Get)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.STOCK_VIEW),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], IntrastatController.prototype, "findOne", null);
    __decorate([
        (0, common_1.Get)(':id/export/nav'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.STOCK_VIEW),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Res)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], IntrastatController.prototype, "exportNav", null);
    __decorate([
        (0, common_1.Get)(':id/export/xml'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.STOCK_VIEW),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Res)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], IntrastatController.prototype, "exportXml", null);
    __decorate([
        (0, common_1.Post)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.STOCK_EDIT),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], IntrastatController.prototype, "create", null);
    __decorate([
        (0, common_1.Post)(':id/items'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.STOCK_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], IntrastatController.prototype, "addItem", null);
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
    ], IntrastatController.prototype, "updateItem", null);
    __decorate([
        (0, common_1.Post)(':id/mark-ready'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.STOCK_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], IntrastatController.prototype, "markAsReady", null);
    __decorate([
        (0, common_1.Post)(':id/mark-sent'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.STOCK_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], IntrastatController.prototype, "markAsSent", null);
    __decorate([
        (0, common_1.Delete)(':id/items/:itemId'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.LOGISTICS_DELETE),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Param)('itemId')),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, Object]),
        __metadata("design:returntype", Promise)
    ], IntrastatController.prototype, "deleteItem", null);
    __decorate([
        (0, common_1.Delete)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.LOGISTICS_DELETE),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], IntrastatController.prototype, "delete", null);
    IntrastatController = __decorate([
        (0, common_1.Controller)('logistics/intrastat'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [intrastat_service_1.IntrastatService,
            audit_service_1.AuditService])
    ], IntrastatController);
    return IntrastatController;
}());
exports.IntrastatController = IntrastatController;
