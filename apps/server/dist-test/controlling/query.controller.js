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
exports.QueryController = void 0;
var common_1 = require("@nestjs/common");
var query_service_1 = require("./query.service");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var permission_enum_1 = require("../common/rbac/permission.enum");
var rbac_guard_1 = require("../common/rbac/rbac.guard");
var audit_service_1 = require("../common/audit/audit.service");
var QueryController = /** @class */ (function () {
    function QueryController(queryService, auditService) {
        this.queryService = queryService;
        this.auditService = auditService;
    }
    QueryController.prototype.findAllTemplates = function (skip, take, kategoria, aktiv) {
        return this.queryService.findAllTemplates(skip ? parseInt(skip) : 0, take ? parseInt(take) : 50, {
            kategoria: kategoria,
            aktiv: aktiv === 'true' ? true : aktiv === 'false' ? false : undefined,
        });
    };
    QueryController.prototype.findTemplate = function (id) {
        return this.queryService.findTemplate(id);
    };
    QueryController.prototype.createTemplate = function (dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var template;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.queryService.createTemplate(dto)];
                    case 1:
                        template = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('QueryTemplate', template.id, template, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, template];
                }
            });
        });
    };
    QueryController.prototype.updateTemplate = function (id, dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var oldTemplate, updated;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.queryService.findTemplate(id)];
                    case 1:
                        oldTemplate = _b.sent();
                        return [4 /*yield*/, this.queryService.updateTemplate(id, dto)];
                    case 2:
                        updated = _b.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('QueryTemplate', id, oldTemplate, updated, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    QueryController.prototype.deleteTemplate = function (id, req) {
        return __awaiter(this, void 0, void 0, function () {
            var oldTemplate;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.queryService.findTemplate(id)];
                    case 1:
                        oldTemplate = _b.sent();
                        return [4 /*yield*/, this.queryService.deleteTemplate(id)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.auditService.logDelete('QueryTemplate', id, oldTemplate, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, { message: 'Lekérdezés sablon törölve' }];
                }
            });
        });
    };
    QueryController.prototype.findAllAdHocQueries = function (skip, take) {
        return this.queryService.findAllAdHocQueries(skip ? parseInt(skip) : 0, take ? parseInt(take) : 50);
    };
    QueryController.prototype.findAdHocQuery = function (id) {
        return this.queryService.findAdHocQuery(id);
    };
    QueryController.prototype.createAdHocQuery = function (dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.queryService.createAdHocQuery(dto, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 1:
                        query = _c.sent();
                        return [4 /*yield*/, this.auditService.logCreate('AdHocQuery', query.id, query, (_b = req.user) === null || _b === void 0 ? void 0 : _b.id)];
                    case 2:
                        _c.sent();
                        return [2 /*return*/, query];
                }
            });
        });
    };
    QueryController.prototype.executeQuery = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.queryService.executeQuery(dto)];
            });
        });
    };
    QueryController.prototype.deleteAdHocQuery = function (id, req) {
        return __awaiter(this, void 0, void 0, function () {
            var oldQuery;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.queryService.findAdHocQuery(id)];
                    case 1:
                        oldQuery = _b.sent();
                        return [4 /*yield*/, this.queryService.deleteAdHocQuery(id)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.auditService.logDelete('AdHocQuery', id, oldQuery, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, { message: 'Ad-hoc lekérdezés törölve' }];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)('templates'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.REPORT_VIEW),
        __param(0, (0, common_1.Query)('skip')),
        __param(1, (0, common_1.Query)('take')),
        __param(2, (0, common_1.Query)('kategoria')),
        __param(3, (0, common_1.Query)('aktiv')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String, String]),
        __metadata("design:returntype", void 0)
    ], QueryController.prototype, "findAllTemplates", null);
    __decorate([
        (0, common_1.Get)('templates/:id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.REPORT_VIEW),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], QueryController.prototype, "findTemplate", null);
    __decorate([
        (0, common_1.Post)('templates'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.REPORT_CREATE),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], QueryController.prototype, "createTemplate", null);
    __decorate([
        (0, common_1.Put)('templates/:id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.REPORT_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], QueryController.prototype, "updateTemplate", null);
    __decorate([
        (0, common_1.Delete)('templates/:id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.REPORT_DELETE),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], QueryController.prototype, "deleteTemplate", null);
    __decorate([
        (0, common_1.Get)('ad-hoc'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.REPORT_VIEW),
        __param(0, (0, common_1.Query)('skip')),
        __param(1, (0, common_1.Query)('take')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", void 0)
    ], QueryController.prototype, "findAllAdHocQueries", null);
    __decorate([
        (0, common_1.Get)('ad-hoc/:id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.REPORT_VIEW),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], QueryController.prototype, "findAdHocQuery", null);
    __decorate([
        (0, common_1.Post)('ad-hoc'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.REPORT_CREATE),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], QueryController.prototype, "createAdHocQuery", null);
    __decorate([
        (0, common_1.Post)('execute'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.REPORT_VIEW),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], QueryController.prototype, "executeQuery", null);
    __decorate([
        (0, common_1.Delete)('ad-hoc/:id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.REPORT_DELETE),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], QueryController.prototype, "deleteAdHocQuery", null);
    QueryController = __decorate([
        (0, common_1.Controller)('controlling/queries'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [query_service_1.QueryService,
            audit_service_1.AuditService])
    ], QueryController);
    return QueryController;
}());
exports.QueryController = QueryController;
