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
exports.SystemSettingsController = void 0;
var common_1 = require("@nestjs/common");
var settings_service_1 = require("./settings.service");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var permission_enum_1 = require("../common/rbac/permission.enum");
var audit_service_1 = require("../common/audit/audit.service");
var SystemSettingsController = /** @class */ (function () {
    function SystemSettingsController(settingsService, auditService) {
        this.settingsService = settingsService;
        this.auditService = auditService;
    }
    SystemSettingsController.prototype.getAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.settingsService.getAll()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SystemSettingsController.prototype.getByCategory = function (category) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.settingsService.getAllByCategory(category)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SystemSettingsController.prototype.get = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.settingsService.get(key)];
                    case 1:
                        value = _a.sent();
                        return [2 /*return*/, { kulcs: key, ertek: value }];
                }
            });
        });
    };
    SystemSettingsController.prototype.create = function (body) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.settingsService.set(body.kulcs, body.ertek, body.kategoria, body.tipus, body.leiras)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.auditService.logCreate('SystemSetting', body.kulcs, body)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { message: 'Beállítás létrehozva' }];
                }
            });
        });
    };
    SystemSettingsController.prototype.update = function (key, body) {
        return __awaiter(this, void 0, void 0, function () {
            var oldValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.settingsService.get(key)];
                    case 1:
                        oldValue = _a.sent();
                        return [4 /*yield*/, this.settingsService.set(key, body.ertek)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('SystemSetting', key, { ertek: oldValue }, body)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, { message: 'Beállítás frissítve' }];
                }
            });
        });
    };
    SystemSettingsController.prototype.updateMany = function (body) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.settingsService.updateMany(body.settings)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.auditService.logCreate('SystemSetting', 'bulk-update', body)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { message: 'Beállítások frissítve' }];
                }
            });
        });
    };
    SystemSettingsController.prototype.delete = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var oldValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.settingsService.get(key)];
                    case 1:
                        oldValue = _a.sent();
                        return [4 /*yield*/, this.settingsService.delete(key)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.auditService.logDelete('SystemSetting', key, { ertek: oldValue })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, { message: 'Beállítás törölve' }];
                }
            });
        });
    };
    SystemSettingsController.prototype.initializeDefaults = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.settingsService.initializeDefaults()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { message: 'Alapértelmezett beállítások inicializálva' }];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.SYSTEM_SETTINGS),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], SystemSettingsController.prototype, "getAll", null);
    __decorate([
        (0, common_1.Get)('category/:category'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.SYSTEM_SETTINGS),
        __param(0, (0, common_1.Param)('category')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], SystemSettingsController.prototype, "getByCategory", null);
    __decorate([
        (0, common_1.Get)(':key'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.SYSTEM_SETTINGS),
        __param(0, (0, common_1.Param)('key')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], SystemSettingsController.prototype, "get", null);
    __decorate([
        (0, common_1.Post)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.SYSTEM_SETTINGS),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], SystemSettingsController.prototype, "create", null);
    __decorate([
        (0, common_1.Put)(':key'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.SYSTEM_SETTINGS),
        __param(0, (0, common_1.Param)('key')),
        __param(1, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], SystemSettingsController.prototype, "update", null);
    __decorate([
        (0, common_1.Post)('bulk'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.SYSTEM_SETTINGS),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], SystemSettingsController.prototype, "updateMany", null);
    __decorate([
        (0, common_1.Delete)(':key'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.SYSTEM_SETTINGS),
        __param(0, (0, common_1.Param)('key')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], SystemSettingsController.prototype, "delete", null);
    __decorate([
        (0, common_1.Post)('initialize'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.SYSTEM_SETTINGS),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], SystemSettingsController.prototype, "initializeDefaults", null);
    SystemSettingsController = __decorate([
        (0, common_1.Controller)('system/settings'),
        __metadata("design:paramtypes", [settings_service_1.SystemSettingsService,
            audit_service_1.AuditService])
    ], SystemSettingsController);
    return SystemSettingsController;
}());
exports.SystemSettingsController = SystemSettingsController;
