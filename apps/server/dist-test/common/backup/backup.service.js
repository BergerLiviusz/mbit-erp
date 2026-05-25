"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../../prisma/prisma.service");
var storage_service_1 = require("../storage/storage.service");
var archiver_1 = __importDefault(require("archiver"));
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var fsp = __importStar(require("fs/promises"));
var BackupService = /** @class */ (function () {
    function BackupService(prisma, storage) {
        this.prisma = prisma;
        this.storage = storage;
        this.logger = new common_1.Logger(BackupService_1.name);
    }
    BackupService_1 = BackupService;
    BackupService.prototype.createBackup = function () {
        return __awaiter(this, arguments, void 0, function (tipus, options) {
            var backupJob, timestamp, backupFileName, backupPath, manifest, output_1, archive, dbPath, dbStats, error_1, filesDir, files, error_2, backupStats, relativePath, error_3, errorMessage;
            var _a, _b, _c, _d;
            if (tipus === void 0) { tipus = 'manual'; }
            if (options === void 0) { options = {}; }
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.prisma.backupJob.create({
                            data: {
                                tipus: tipus,
                                allapot: 'folyamatban',
                                inditas: new Date(),
                            },
                        })];
                    case 1:
                        backupJob = _e.sent();
                        _e.label = 2;
                    case 2:
                        _e.trys.push([2, 17, , 19]);
                        timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                        backupFileName = "backup-".concat(timestamp, ".zip");
                        backupPath = this.storage.getPath('backups', backupFileName);
                        return [4 /*yield*/, this.storage.ensureDir(this.storage.getPath('backups'))];
                    case 3:
                        _e.sent();
                        manifest = {
                            version: '1.0.0',
                            timestamp: new Date().toISOString(),
                            database: (_a = options.includeDatabase) !== null && _a !== void 0 ? _a : true,
                            files: (_b = options.includeFiles) !== null && _b !== void 0 ? _b : true,
                            fileCount: 0,
                            databaseSize: 0,
                            totalSize: 0,
                        };
                        output_1 = fs.createWriteStream(backupPath);
                        archive = (0, archiver_1.default)('zip', {
                            zlib: { level: 9 },
                        });
                        if (options.password) {
                            this.logger.warn('Password protection not yet implemented');
                        }
                        archive.pipe(output_1);
                        if (!((_c = options.includeDatabase) !== null && _c !== void 0 ? _c : true)) return [3 /*break*/, 7];
                        dbPath = path.join(process.cwd(), 'apps', 'server', 'prisma', 'dev.db');
                        _e.label = 4;
                    case 4:
                        _e.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, fsp.stat(dbPath)];
                    case 5:
                        dbStats = _e.sent();
                        manifest.databaseSize = dbStats.size;
                        archive.file(dbPath, { name: 'database.db' });
                        this.logger.log("Added database to backup: ".concat(dbStats.size, " bytes"));
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _e.sent();
                        this.logger.error('Failed to add database to backup:', error_1);
                        return [3 /*break*/, 7];
                    case 7:
                        if (!((_d = options.includeFiles) !== null && _d !== void 0 ? _d : true)) return [3 /*break*/, 11];
                        filesDir = this.storage.getPath('files');
                        _e.label = 8;
                    case 8:
                        _e.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, this.storage.listFiles('files')];
                    case 9:
                        files = _e.sent();
                        manifest.fileCount = files.length;
                        if (files.length > 0) {
                            archive.directory(filesDir, 'files');
                            this.logger.log("Added ".concat(files.length, " files to backup"));
                        }
                        return [3 /*break*/, 11];
                    case 10:
                        error_2 = _e.sent();
                        this.logger.error('Failed to add files to backup:', error_2);
                        return [3 /*break*/, 11];
                    case 11:
                        archive.append(JSON.stringify(manifest, null, 2), {
                            name: 'manifest.json',
                        });
                        return [4 /*yield*/, archive.finalize()];
                    case 12:
                        _e.sent();
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                output_1.on('close', function () { return resolve(); });
                                output_1.on('error', reject);
                            })];
                    case 13:
                        _e.sent();
                        return [4 /*yield*/, fsp.stat(backupPath)];
                    case 14:
                        backupStats = _e.sent();
                        manifest.totalSize = backupStats.size;
                        relativePath = path.relative(this.storage.getBasePath(), backupPath);
                        return [4 /*yield*/, this.prisma.backupJob.update({
                                where: { id: backupJob.id },
                                data: {
                                    allapot: 'kesz',
                                    fajlUtvonal: relativePath,
                                    fajlNev: backupFileName,
                                    meret: backupStats.size,
                                    tartalomManifeszt: JSON.stringify(manifest),
                                    befejezes: new Date(),
                                },
                            })];
                    case 15:
                        _e.sent();
                        this.logger.log("Backup created successfully: ".concat(backupFileName, " (").concat(backupStats.size, " bytes)"));
                        return [4 /*yield*/, this.cleanupOldBackups()];
                    case 16:
                        _e.sent();
                        return [2 /*return*/, {
                                id: backupJob.id,
                                fajlUtvonal: relativePath,
                                meret: backupStats.size,
                            }];
                    case 17:
                        error_3 = _e.sent();
                        this.logger.error('Backup failed:', error_3);
                        errorMessage = error_3 instanceof Error ? error_3.message : 'Unknown error';
                        return [4 /*yield*/, this.prisma.backupJob.update({
                                where: { id: backupJob.id },
                                data: {
                                    allapot: 'hiba',
                                    hibaUzenet: errorMessage,
                                    befejezes: new Date(),
                                },
                            })];
                    case 18:
                        _e.sent();
                        throw error_3;
                    case 19: return [2 /*return*/];
                }
            });
        });
    };
    BackupService.prototype.listBackups = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.backupJob.findMany({
                            where: {
                                allapot: 'kesz',
                            },
                            orderBy: {
                                inditas: 'desc',
                            },
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    BackupService.prototype.getBackup = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.backupJob.findUnique({
                            where: { id: id },
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    BackupService.prototype.deleteBackup = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var backup, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.backupJob.findUnique({
                            where: { id: id },
                        })];
                    case 1:
                        backup = _a.sent();
                        if (!backup) {
                            throw new Error('Backup not found');
                        }
                        if (!backup.fajlUtvonal) return [3 /*break*/, 5];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.storage.deleteFile(backup.fajlUtvonal)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_4 = _a.sent();
                        this.logger.error('Failed to delete backup file:', error_4);
                        return [3 /*break*/, 5];
                    case 5: return [4 /*yield*/, this.prisma.backupJob.delete({
                            where: { id: id },
                        })];
                    case 6:
                        _a.sent();
                        this.logger.log("Backup deleted: ".concat(id));
                        return [2 /*return*/];
                }
            });
        });
    };
    BackupService.prototype.cleanupOldBackups = function () {
        return __awaiter(this, void 0, void 0, function () {
            var retentionCount, backups, toDelete, _i, toDelete_1, backup, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        retentionCount = parseInt(process.env.BACKUP_RETENTION_COUNT || '10', 10);
                        return [4 /*yield*/, this.prisma.backupJob.findMany({
                                where: {
                                    allapot: 'kesz',
                                },
                                orderBy: {
                                    inditas: 'desc',
                                },
                            })];
                    case 1:
                        backups = _a.sent();
                        if (!(backups.length > retentionCount)) return [3 /*break*/, 8];
                        toDelete = backups.slice(retentionCount);
                        _i = 0, toDelete_1 = toDelete;
                        _a.label = 2;
                    case 2:
                        if (!(_i < toDelete_1.length)) return [3 /*break*/, 7];
                        backup = toDelete_1[_i];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.deleteBackup(backup.id)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_5 = _a.sent();
                        this.logger.error("Failed to delete old backup ".concat(backup.id, ":"), error_5);
                        return [3 /*break*/, 6];
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7:
                        this.logger.log("Cleaned up ".concat(toDelete.length, " old backups"));
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    BackupService.prototype.getBackupStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var backups, totalSize;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.backupJob.findMany({
                            where: {
                                allapot: 'kesz',
                            },
                            orderBy: {
                                inditas: 'desc',
                            },
                        })];
                    case 1:
                        backups = _a.sent();
                        totalSize = backups.reduce(function (sum, b) { return sum + (b.meret || 0); }, 0);
                        return [2 /*return*/, {
                                total: backups.length,
                                totalSize: totalSize,
                                latest: backups[0] || null,
                            }];
                }
            });
        });
    };
    var BackupService_1;
    BackupService = BackupService_1 = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService,
            storage_service_1.StorageService])
    ], BackupService);
    return BackupService;
}());
exports.BackupService = BackupService;
