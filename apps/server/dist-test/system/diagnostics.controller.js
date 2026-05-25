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
exports.DiagnosticsController = void 0;
var common_1 = require("@nestjs/common");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var permission_enum_1 = require("../common/rbac/permission.enum");
var rbac_guard_1 = require("../common/rbac/rbac.guard");
var storage_service_1 = require("../common/storage/storage.service");
var backup_service_1 = require("../common/backup/backup.service");
var audit_service_1 = require("../common/audit/audit.service");
var prisma_service_1 = require("../prisma/prisma.service");
var archiver = __importStar(require("archiver"));
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var DiagnosticsController = /** @class */ (function () {
    function DiagnosticsController(storage, backupService, auditService, prisma) {
        this.storage = storage;
        this.backupService = backupService;
        this.auditService = auditService;
        this.prisma = prisma;
    }
    DiagnosticsController.prototype.downloadLogs = function (res) {
        return __awaiter(this, void 0, void 0, function () {
            var logsDir, timestamp, zipFileName, archive, manifest, logFiles, now, threeDaysAgo, _i, logFiles_1, file, filePath, stats, error_1, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logsDir = this.storage.getPath('logs');
                        timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                        zipFileName = "diagnostics-".concat(timestamp, ".zip");
                        res.setHeader('Content-Type', 'application/zip');
                        res.setHeader('Content-Disposition', "attachment; filename=\"".concat(zipFileName, "\""));
                        archive = archiver('zip', {
                            zlib: { level: 9 },
                        });
                        archive.pipe(res);
                        manifest = {
                            generated: new Date().toISOString(),
                            type: 'diagnostics',
                            version: '1.0.0',
                        };
                        archive.append(JSON.stringify(manifest, null, 2), {
                            name: 'manifest.json',
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, , 10]);
                        return [4 /*yield*/, this.storage.listFiles('logs')];
                    case 2:
                        logFiles = _a.sent();
                        now = Date.now();
                        threeDaysAgo = now - 3 * 24 * 60 * 60 * 1000;
                        _i = 0, logFiles_1 = logFiles;
                        _a.label = 3;
                    case 3:
                        if (!(_i < logFiles_1.length)) return [3 /*break*/, 8];
                        file = logFiles_1[_i];
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        filePath = path.join(logsDir, file);
                        return [4 /*yield*/, fs.promises.stat(filePath)];
                    case 5:
                        stats = _a.sent();
                        if (stats.mtimeMs >= threeDaysAgo) {
                            archive.file(filePath, { name: "logs/".concat(file) });
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        console.error("Failed to add log file ".concat(file, ":"), error_1);
                        return [3 /*break*/, 7];
                    case 7:
                        _i++;
                        return [3 /*break*/, 3];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_2 = _a.sent();
                        console.error('Failed to read log directory:', error_2);
                        return [3 /*break*/, 10];
                    case 10: return [4 /*yield*/, archive.finalize()];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, this.auditService.log({
                                esemeny: 'export',
                                entitas: 'Diagnostics',
                                entitasId: 'logs',
                            })];
                    case 12:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DiagnosticsController.prototype.getStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var backupStats, recentActivity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.backupService.getBackupStats()];
                    case 1:
                        backupStats = _a.sent();
                        return [4 /*yield*/, this.auditService.getRecentActivity(10)];
                    case 2:
                        recentActivity = _a.sent();
                        return [2 /*return*/, {
                                backup: backupStats,
                                recentActivity: recentActivity,
                            }];
                }
            });
        });
    };
    DiagnosticsController.prototype.runBackupNow = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.backupService.createBackup('manual')];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, this.auditService.log({
                                esemeny: 'create',
                                entitas: 'Backup',
                                entitasId: result.id,
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, __assign({ message: 'Biztonsági mentés elindítva' }, result)];
                }
            });
        });
    };
    DiagnosticsController.prototype.listBackups = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.backupService.listBackups()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DiagnosticsController.prototype.checkAdminPermissions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var adminUser, allPermissions, roles, _i, _a, userRole, rolePerms;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                            where: { email: 'admin@mbit.hu' },
                            include: {
                                roles: {
                                    include: {
                                        role: {
                                            include: {
                                                rolePermissions: {
                                                    include: {
                                                        permission: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        })];
                    case 1:
                        adminUser = _b.sent();
                        if (!adminUser) {
                            return [2 /*return*/, { error: 'Admin user not found' }];
                        }
                        allPermissions = new Set();
                        roles = [];
                        for (_i = 0, _a = adminUser.roles; _i < _a.length; _i++) {
                            userRole = _a[_i];
                            rolePerms = userRole.role.rolePermissions.map(function (rp) { return rp.permission.kod; });
                            roles.push({
                                name: userRole.role.nev,
                                permissionsCount: rolePerms.length,
                                permissions: rolePerms.sort(),
                            });
                            rolePerms.forEach(function (p) { return allPermissions.add(p); });
                        }
                        return [2 /*return*/, {
                                user: adminUser.email,
                                rolesCount: adminUser.roles.length,
                                roles: roles,
                                totalUniquePermissions: allPermissions.size,
                                hasCustomerCreate: allPermissions.has('customer:create'),
                                customerPermissions: Array.from(allPermissions).filter(function (p) { return p.startsWith('customer:'); }),
                                crmPermissions: Array.from(allPermissions).filter(function (p) { return p.startsWith('crm:'); }),
                            }];
                }
            });
        });
    };
    DiagnosticsController.prototype.fixAdminPermissions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var adminUser, adminRole, allPermissions, addedCount, _i, allPermissions_1, perm, exists;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                            where: { email: 'admin@mbit.hu' },
                            include: {
                                roles: {
                                    include: {
                                        role: true,
                                    },
                                },
                            },
                        })];
                    case 1:
                        adminUser = _a.sent();
                        if (!adminUser || adminUser.roles.length === 0) {
                            return [2 /*return*/, { error: 'Admin user or role not found' }];
                        }
                        adminRole = adminUser.roles[0].role;
                        return [4 /*yield*/, this.prisma.permission.findMany({
                                where: {
                                    OR: [
                                        { modulo: 'CRM' },
                                        { modulo: 'DMS' },
                                        { modulo: 'Logisztika' },
                                        { modulo: 'Rendszer' },
                                        { modulo: 'Felhasználók' },
                                        { modulo: 'Szerepkörök' },
                                        { modulo: 'Jelentések' },
                                    ],
                                },
                            })];
                    case 2:
                        allPermissions = _a.sent();
                        addedCount = 0;
                        _i = 0, allPermissions_1 = allPermissions;
                        _a.label = 3;
                    case 3:
                        if (!(_i < allPermissions_1.length)) return [3 /*break*/, 7];
                        perm = allPermissions_1[_i];
                        return [4 /*yield*/, this.prisma.rolePermission.findUnique({
                                where: {
                                    roleId_permissionId: {
                                        roleId: adminRole.id,
                                        permissionId: perm.id,
                                    },
                                },
                            })];
                    case 4:
                        exists = _a.sent();
                        if (!!exists) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.prisma.rolePermission.create({
                                data: {
                                    roleId: adminRole.id,
                                    permissionId: perm.id,
                                },
                            })];
                    case 5:
                        _a.sent();
                        addedCount++;
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 3];
                    case 7: return [2 /*return*/, {
                            message: 'Admin permissions updated successfully',
                            addedPermissions: addedCount,
                            totalPermissions: allPermissions.length,
                            adminRole: adminRole.nev,
                        }];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)('logs/download'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.SYSTEM_DIAGNOSTICS),
        __param(0, (0, common_1.Res)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], DiagnosticsController.prototype, "downloadLogs", null);
    __decorate([
        (0, common_1.Get)('stats'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.SYSTEM_DIAGNOSTICS),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], DiagnosticsController.prototype, "getStats", null);
    __decorate([
        (0, common_1.Post)('backup/now'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.SYSTEM_BACKUP),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], DiagnosticsController.prototype, "runBackupNow", null);
    __decorate([
        (0, common_1.Get)('backup/list'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.SYSTEM_BACKUP),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], DiagnosticsController.prototype, "listBackups", null);
    __decorate([
        (0, common_1.Get)('permissions/check-admin'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.SYSTEM_DIAGNOSTICS),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], DiagnosticsController.prototype, "checkAdminPermissions", null);
    __decorate([
        (0, common_1.Post)('permissions/fix-admin'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.SYSTEM_DIAGNOSTICS),
        (0, common_1.HttpCode)(common_1.HttpStatus.OK),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], DiagnosticsController.prototype, "fixAdminPermissions", null);
    DiagnosticsController = __decorate([
        (0, common_1.Controller)('system/diagnostics'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [storage_service_1.StorageService,
            backup_service_1.BackupService,
            audit_service_1.AuditService,
            prisma_service_1.PrismaService])
    ], DiagnosticsController);
    return DiagnosticsController;
}());
exports.DiagnosticsController = DiagnosticsController;
