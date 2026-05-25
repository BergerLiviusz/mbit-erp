"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
exports.HealthController = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var storage_service_1 = require("../common/storage/storage.service");
var backup_service_1 = require("../common/backup/backup.service");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var package_resolver_service_1 = require("../common/package/package-resolver.service");
var fs = __importStar(require("fs/promises"));
var HealthController = /** @class */ (function () {
    function HealthController(prisma, storage, backupService, packages) {
        this.prisma = prisma;
        this.storage = storage;
        this.backupService = backupService;
        this.packages = packages;
    }
    HealthController.prototype.getBasicHealth = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        status: 'ok',
                        timestamp: new Date().toISOString(),
                    }];
            });
        });
    };
    HealthController.prototype.getDetailedHealth = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dbStatus, dbLatency, dbStartTime, error_1, storageStatus, storageAvailable, dataDir, error_2, overallStatus, ocrEnabled, ocrSetting, _a, backupRaw, _b, orgName, org, _c, versionInfo;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        dbStatus = 'healthy';
                        dbLatency = 0;
                        dbStartTime = Date.now();
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SELECT 1"], ["SELECT 1"])))];
                    case 2:
                        _e.sent();
                        dbLatency = Date.now() - dbStartTime;
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _e.sent();
                        dbStatus = 'unhealthy';
                        dbLatency = -1;
                        return [3 /*break*/, 4];
                    case 4:
                        storageStatus = 'ok';
                        storageAvailable = true;
                        dataDir = this.storage.getBasePath();
                        _e.label = 5;
                    case 5:
                        _e.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, fs.access(dataDir)];
                    case 6:
                        _e.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        error_2 = _e.sent();
                        storageStatus = 'error';
                        storageAvailable = false;
                        return [3 /*break*/, 8];
                    case 8:
                        overallStatus = dbStatus === 'healthy' && storageAvailable ? 'ok' : 'degraded';
                        ocrEnabled = false;
                        _e.label = 9;
                    case 9:
                        _e.trys.push([9, 11, , 12]);
                        return [4 /*yield*/, this.prisma.systemSetting.findUnique({
                                where: { kulcs: 'dms.ocr.enabled' },
                            })];
                    case 10:
                        ocrSetting = _e.sent();
                        ocrEnabled = (ocrSetting === null || ocrSetting === void 0 ? void 0 : ocrSetting.ertek) === 'true';
                        return [3 /*break*/, 12];
                    case 11:
                        _a = _e.sent();
                        ocrEnabled = false;
                        return [3 /*break*/, 12];
                    case 12:
                        backupRaw = {
                            total: 0,
                            latest: null,
                        };
                        _e.label = 13;
                    case 13:
                        _e.trys.push([13, 15, , 16]);
                        return [4 /*yield*/, this.backupService.getBackupStats()];
                    case 14:
                        backupRaw = _e.sent();
                        return [3 /*break*/, 16];
                    case 15:
                        _b = _e.sent();
                        backupRaw = { total: 0, latest: null };
                        return [3 /*break*/, 16];
                    case 16:
                        orgName = '';
                        _e.label = 17;
                    case 17:
                        _e.trys.push([17, 19, , 20]);
                        return [4 /*yield*/, this.prisma.systemSetting.findUnique({
                                where: { kulcs: 'organization.name' },
                            })];
                    case 18:
                        org = _e.sent();
                        orgName = (org === null || org === void 0 ? void 0 : org.ertek) || '';
                        return [3 /*break*/, 20];
                    case 19:
                        _c = _e.sent();
                        orgName = '';
                        return [3 /*break*/, 20];
                    case 20:
                        versionInfo = this.packages.getVersionInfo();
                        return [2 /*return*/, {
                                status: overallStatus,
                                timestamp: new Date().toISOString(),
                                version: versionInfo.version,
                                versionLabel: versionInfo.versionLabel,
                                packageId: versionInfo.packageId,
                                packageDisplayName: versionInfo.packageDisplayName,
                                editionLabel: versionInfo.editionLabel,
                                buildSha: versionInfo.buildSha,
                                buildDate: versionInfo.buildDate,
                                environment: versionInfo.environment,
                                enabledModules: versionInfo.enabledModules,
                                runtime: 'electron-desktop-on-premise',
                                database: {
                                    type: 'sqlite',
                                    status: dbStatus,
                                    latency: dbLatency,
                                },
                                storage: {
                                    status: storageStatus,
                                    dataDir: dataDir,
                                    available: storageAvailable,
                                },
                                ocr: { enabled: ocrEnabled },
                                backup: {
                                    totalBackups: backupRaw.total,
                                    lastBackup: ((_d = backupRaw.latest) === null || _d === void 0 ? void 0 : _d.inditas) || null,
                                },
                                organizationName: orgName,
                            }];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)(),
        (0, rbac_decorator_1.Public)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], HealthController.prototype, "getBasicHealth", null);
    __decorate([
        (0, common_1.Get)('detailed'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], HealthController.prototype, "getDetailedHealth", null);
    HealthController = __decorate([
        (0, common_1.Controller)('health'),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService,
            storage_service_1.StorageService,
            backup_service_1.BackupService,
            package_resolver_service_1.PackageResolverService])
    ], HealthController);
    return HealthController;
}());
exports.HealthController = HealthController;
var templateObject_1;
