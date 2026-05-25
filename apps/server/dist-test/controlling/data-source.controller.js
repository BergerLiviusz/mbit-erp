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
exports.DataSourceController = void 0;
var common_1 = require("@nestjs/common");
var data_source_service_1 = require("./data-source.service");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var permission_enum_1 = require("../common/rbac/permission.enum");
var rbac_guard_1 = require("../common/rbac/rbac.guard");
var audit_service_1 = require("../common/audit/audit.service");
var DataSourceController = /** @class */ (function () {
    function DataSourceController(dataSourceService, auditService) {
        this.dataSourceService = dataSourceService;
        this.auditService = auditService;
    }
    DataSourceController.prototype.findAllDataSources = function (skip, take, aktiv, tipus) {
        return this.dataSourceService.findAllDataSources(skip ? parseInt(skip) : 0, take ? parseInt(take) : 50, {
            aktiv: aktiv === 'true' ? true : aktiv === 'false' ? false : undefined,
            tipus: tipus,
        });
    };
    DataSourceController.prototype.findDataSource = function (id) {
        return this.dataSourceService.findDataSource(id);
    };
    DataSourceController.prototype.createDataSource = function (dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var source;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.dataSourceService.createDataSource(dto)];
                    case 1:
                        source = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('DataSource', source.id, source, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, source];
                }
            });
        });
    };
    DataSourceController.prototype.updateDataSource = function (id, dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var oldSource, updated;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.dataSourceService.findDataSource(id)];
                    case 1:
                        oldSource = _b.sent();
                        return [4 /*yield*/, this.dataSourceService.updateDataSource(id, dto)];
                    case 2:
                        updated = _b.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('DataSource', id, oldSource, updated, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    DataSourceController.prototype.deleteDataSource = function (id, req) {
        return __awaiter(this, void 0, void 0, function () {
            var oldSource;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.dataSourceService.findDataSource(id)];
                    case 1:
                        oldSource = _b.sent();
                        return [4 /*yield*/, this.dataSourceService.deleteDataSource(id)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.auditService.logDelete('DataSource', id, oldSource, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, { message: 'Adatforrás törölve' }];
                }
            });
        });
    };
    // Data Load Jobs
    DataSourceController.prototype.findAllDataLoadJobs = function (id, skip, take, allapot) {
        return this.dataSourceService.findAllDataLoadJobs(skip ? parseInt(skip) : 0, take ? parseInt(take) : 50, {
            dataSourceId: id,
            allapot: allapot,
        });
    };
    DataSourceController.prototype.findDataLoadJob = function (jobId) {
        return this.dataSourceService.findDataLoadJob(jobId);
    };
    DataSourceController.prototype.createDataLoadJob = function (id, dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var job;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.dataSourceService.createDataLoadJob(__assign(__assign({}, dto), { dataSourceId: id }))];
                    case 1:
                        job = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('DataLoadJob', job.id, job, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, job];
                }
            });
        });
    };
    DataSourceController.prototype.updateDataLoadJob = function (jobId, dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var oldJob, updated;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.dataSourceService.findDataLoadJob(jobId)];
                    case 1:
                        oldJob = _b.sent();
                        return [4 /*yield*/, this.dataSourceService.updateDataLoadJob(jobId, dto)];
                    case 2:
                        updated = _b.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('DataLoadJob', jobId, oldJob, updated, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    DataSourceController.prototype.deleteDataLoadJob = function (jobId, req) {
        return __awaiter(this, void 0, void 0, function () {
            var oldJob;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.dataSourceService.findDataLoadJob(jobId)];
                    case 1:
                        oldJob = _b.sent();
                        return [4 /*yield*/, this.dataSourceService.deleteDataLoadJob(jobId)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.auditService.logDelete('DataLoadJob', jobId, oldJob, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, { message: 'Adatbetöltési feladat törölve' }];
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
        __param(3, (0, common_1.Query)('tipus')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String, String]),
        __metadata("design:returntype", void 0)
    ], DataSourceController.prototype, "findAllDataSources", null);
    __decorate([
        (0, common_1.Get)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.REPORT_VIEW),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], DataSourceController.prototype, "findDataSource", null);
    __decorate([
        (0, common_1.Post)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.REPORT_CREATE),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], DataSourceController.prototype, "createDataSource", null);
    __decorate([
        (0, common_1.Put)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.REPORT_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], DataSourceController.prototype, "updateDataSource", null);
    __decorate([
        (0, common_1.Delete)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.REPORT_DELETE),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], DataSourceController.prototype, "deleteDataSource", null);
    __decorate([
        (0, common_1.Get)(':id/jobs'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.REPORT_VIEW),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Query)('skip')),
        __param(2, (0, common_1.Query)('take')),
        __param(3, (0, common_1.Query)('allapot')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String, String]),
        __metadata("design:returntype", void 0)
    ], DataSourceController.prototype, "findAllDataLoadJobs", null);
    __decorate([
        (0, common_1.Get)('jobs/:jobId'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.REPORT_VIEW),
        __param(0, (0, common_1.Param)('jobId')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], DataSourceController.prototype, "findDataLoadJob", null);
    __decorate([
        (0, common_1.Post)(':id/jobs'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.REPORT_CREATE),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], DataSourceController.prototype, "createDataLoadJob", null);
    __decorate([
        (0, common_1.Put)('jobs/:jobId'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.REPORT_EDIT),
        __param(0, (0, common_1.Param)('jobId')),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], DataSourceController.prototype, "updateDataLoadJob", null);
    __decorate([
        (0, common_1.Delete)('jobs/:jobId'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.REPORT_DELETE),
        __param(0, (0, common_1.Param)('jobId')),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], DataSourceController.prototype, "deleteDataLoadJob", null);
    DataSourceController = __decorate([
        (0, common_1.Controller)('controlling/data-sources'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [data_source_service_1.DataSourceService,
            audit_service_1.AuditService])
    ], DataSourceController);
    return DataSourceController;
}());
exports.DataSourceController = DataSourceController;
