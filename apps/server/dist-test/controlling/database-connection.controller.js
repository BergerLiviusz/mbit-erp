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
exports.DatabaseConnectionController = void 0;
var common_1 = require("@nestjs/common");
var database_connection_service_1 = require("./database-connection.service");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var permission_enum_1 = require("../common/rbac/permission.enum");
var rbac_guard_1 = require("../common/rbac/rbac.guard");
var audit_service_1 = require("../common/audit/audit.service");
var DatabaseConnectionController = /** @class */ (function () {
    function DatabaseConnectionController(databaseConnectionService, auditService) {
        this.databaseConnectionService = databaseConnectionService;
        this.auditService = auditService;
    }
    DatabaseConnectionController.prototype.findAll = function (skip, take, aktiv) {
        return this.databaseConnectionService.findAll(skip ? parseInt(skip) : 0, take ? parseInt(take) : 50, {
            aktiv: aktiv === 'true' ? true : aktiv === 'false' ? false : undefined,
        });
    };
    DatabaseConnectionController.prototype.findOne = function (id) {
        return this.databaseConnectionService.findOne(id);
    };
    DatabaseConnectionController.prototype.testConnection = function (id) {
        return this.databaseConnectionService.testConnection(id);
    };
    DatabaseConnectionController.prototype.create = function (dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var connection;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.databaseConnectionService.create(dto)];
                    case 1:
                        connection = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('DatabaseConnection', connection.id, __assign(__assign({}, connection), { password: '***' }), (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, connection];
                }
            });
        });
    };
    DatabaseConnectionController.prototype.update = function (id, dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var oldConnection, updated;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.databaseConnectionService.findOne(id)];
                    case 1:
                        oldConnection = _b.sent();
                        return [4 /*yield*/, this.databaseConnectionService.update(id, dto)];
                    case 2:
                        updated = _b.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('DatabaseConnection', id, oldConnection, __assign(__assign({}, updated), { password: '***' }), (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    DatabaseConnectionController.prototype.delete = function (id, req) {
        return __awaiter(this, void 0, void 0, function () {
            var oldConnection;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.databaseConnectionService.findOne(id)];
                    case 1:
                        oldConnection = _b.sent();
                        return [4 /*yield*/, this.databaseConnectionService.delete(id)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.auditService.logDelete('DatabaseConnection', id, oldConnection, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, { message: 'Adatbázis kapcsolat törölve' }];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.REPORT_VIEW),
        __param(0, (0, common_1.Query)('skip')),
        __param(1, (0, common_1.Query)('take')),
        __param(2, (0, common_1.Query)('aktiv')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String]),
        __metadata("design:returntype", void 0)
    ], DatabaseConnectionController.prototype, "findAll", null);
    __decorate([
        (0, common_1.Get)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.REPORT_VIEW),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], DatabaseConnectionController.prototype, "findOne", null);
    __decorate([
        (0, common_1.Post)(':id/test'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.REPORT_VIEW),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], DatabaseConnectionController.prototype, "testConnection", null);
    __decorate([
        (0, common_1.Post)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.REPORT_CREATE),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], DatabaseConnectionController.prototype, "create", null);
    __decorate([
        (0, common_1.Put)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.REPORT_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], DatabaseConnectionController.prototype, "update", null);
    __decorate([
        (0, common_1.Delete)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.REPORT_DELETE),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], DatabaseConnectionController.prototype, "delete", null);
    DatabaseConnectionController = __decorate([
        (0, common_1.Controller)('controlling/database-connections'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [database_connection_service_1.DatabaseConnectionService,
            audit_service_1.AuditService])
    ], DatabaseConnectionController);
    return DatabaseConnectionController;
}());
exports.DatabaseConnectionController = DatabaseConnectionController;
