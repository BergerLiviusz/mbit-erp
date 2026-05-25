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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
var common_1 = require("@nestjs/common");
var fs = __importStar(require("fs/promises"));
var path = __importStar(require("path"));
var os = __importStar(require("os"));
var crypto = __importStar(require("crypto"));
var StorageService = /** @class */ (function () {
    function StorageService() {
        this.logger = new common_1.Logger(StorageService_1.name);
        this.baseDir = process.env.MBIT_DATA_DIR || path.join(os.homedir(), 'mbit-data');
        this.logger.log("Data directory: ".concat(this.baseDir));
        this.initializeDirectories();
    }
    StorageService_1 = StorageService;
    StorageService.prototype.initializeDirectories = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dirs, _i, dirs_1, dir, fullPath, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dirs = [
                            'uploads',
                            'files',
                            'backups',
                            'logs',
                            'exports',
                            'temp',
                            'ocr',
                        ];
                        _i = 0, dirs_1 = dirs;
                        _a.label = 1;
                    case 1:
                        if (!(_i < dirs_1.length)) return [3 /*break*/, 6];
                        dir = dirs_1[_i];
                        fullPath = path.join(this.baseDir, dir);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fs.mkdir(fullPath, { recursive: true })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        this.logger.error("Failed to create directory ".concat(fullPath, ":"), error_1);
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    StorageService.prototype.getBasePath = function () {
        return this.baseDir;
    };
    StorageService.prototype.getPath = function (subdir) {
        var segments = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            segments[_i - 1] = arguments[_i];
        }
        return path.join.apply(path, __spreadArray([this.baseDir, subdir], segments, false));
    };
    StorageService.prototype.ensureDir = function (dirPath) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs.mkdir(dirPath, { recursive: true })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StorageService.prototype.sanitizeFilename = function (filename) {
        return filename
            .replace(/[^a-zA-Z0-9áéíóöőúüűÁÉÍÓÖŐÚÜŰ\-_.]/g, '_')
            .replace(/_{2,}/g, '_')
            .substring(0, 200);
    };
    StorageService.prototype.generateUniqueFilename = function (originalName) {
        var ext = path.extname(originalName);
        var base = path.basename(originalName, ext);
        var sanitized = this.sanitizeFilename(base);
        var unique = crypto.randomBytes(8).toString('hex');
        return "".concat(sanitized, "-").concat(unique).concat(ext);
    };
    StorageService.prototype.saveFile = function (subdir, filename, buffer) {
        return __awaiter(this, void 0, void 0, function () {
            var dirPath, safeName, fullPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dirPath = this.getPath(subdir);
                        return [4 /*yield*/, this.ensureDir(dirPath)];
                    case 1:
                        _a.sent();
                        safeName = this.generateUniqueFilename(filename);
                        fullPath = path.join(dirPath, safeName);
                        return [4 /*yield*/, fs.writeFile(fullPath, buffer)];
                    case 2:
                        _a.sent();
                        this.logger.log("File saved: ".concat(fullPath));
                        return [2 /*return*/, path.relative(this.baseDir, fullPath)];
                }
            });
        });
    };
    /**
     * Normalizes DB-stored paths (e.g. legacy `/uploads/...`) to safe relative paths under MBIT_DATA_DIR.
     */
    StorageService.prototype.normalizeRelativePath = function (relativePath) {
        var p = relativePath.trim().replace(/\\/g, '/');
        while (p.startsWith('/')) {
            p = p.slice(1);
        }
        if (p.startsWith('mbit-data/')) {
            p = p.slice('mbit-data/'.length);
        }
        return p;
    };
    /** Candidate paths for legacy uploads and migrated files/ layout. */
    StorageService.prototype.resolveReadCandidates = function (relativePath) {
        var normalized = this.normalizeRelativePath(relativePath);
        var baseName = path.basename(normalized);
        var candidates = new Set();
        candidates.add(normalized);
        if (normalized.startsWith('uploads/')) {
            candidates.add(normalized.replace(/^uploads\//, 'files/'));
        }
        else if (!normalized.startsWith('files/') && baseName) {
            candidates.add("files/".concat(baseName));
            candidates.add("uploads/".concat(normalized));
            candidates.add("uploads/documents/".concat(baseName));
        }
        return __spreadArray([], candidates, true);
    };
    StorageService.prototype.resolveExistingRelativePath = function (relativePath) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, candidate;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = this.resolveReadCandidates(relativePath);
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        candidate = _a[_i];
                        return [4 /*yield*/, this.fileExists(candidate)];
                    case 2:
                        if (_b.sent()) {
                            return [2 /*return*/, candidate];
                        }
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, null];
                }
            });
        });
    };
    StorageService.prototype.readFile = function (relativePath) {
        return __awaiter(this, void 0, void 0, function () {
            var resolved, fullPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.resolveExistingRelativePath(relativePath)];
                    case 1:
                        resolved = _a.sent();
                        if (!resolved) {
                            throw new Error("F\u00E1jl nem tal\u00E1lhat\u00F3: ".concat(relativePath));
                        }
                        fullPath = path.join(this.baseDir, resolved);
                        if (!this.isPathSafe(fullPath)) {
                            throw new Error('Unsafe file path detected');
                        }
                        return [4 /*yield*/, fs.readFile(fullPath)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StorageService.prototype.deleteFile = function (relativePath) {
        return __awaiter(this, void 0, void 0, function () {
            var fullPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fullPath = path.join(this.baseDir, relativePath);
                        if (!this.isPathSafe(fullPath)) {
                            throw new Error('Unsafe file path detected');
                        }
                        return [4 /*yield*/, fs.unlink(fullPath)];
                    case 1:
                        _a.sent();
                        this.logger.log("File deleted: ".concat(fullPath));
                        return [2 /*return*/];
                }
            });
        });
    };
    StorageService.prototype.fileExists = function (relativePath) {
        return __awaiter(this, void 0, void 0, function () {
            var normalized, fullPath, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        normalized = this.normalizeRelativePath(relativePath);
                        fullPath = path.join(this.baseDir, normalized);
                        if (!this.isPathSafe(fullPath))
                            return [2 /*return*/, false];
                        return [4 /*yield*/, fs.access(fullPath)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, true];
                    case 2:
                        _a = _b.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StorageService.prototype.getFileSize = function (relativePath) {
        return __awaiter(this, void 0, void 0, function () {
            var fullPath, stats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fullPath = path.join(this.baseDir, relativePath);
                        return [4 /*yield*/, fs.stat(fullPath)];
                    case 1:
                        stats = _a.sent();
                        return [2 /*return*/, stats.size];
                }
            });
        });
    };
    StorageService.prototype.isPathSafe = function (fullPath) {
        var resolved = path.resolve(fullPath);
        var base = path.resolve(this.baseDir);
        return resolved.startsWith(base);
    };
    StorageService.prototype.listFiles = function (subdir) {
        return __awaiter(this, void 0, void 0, function () {
            var dirPath, files, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        dirPath = this.getPath(subdir);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs.readdir(dirPath)];
                    case 2:
                        files = _b.sent();
                        return [2 /*return*/, files];
                    case 3:
                        _a = _b.sent();
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    StorageService.prototype.copyFile = function (source, destination) {
        return __awaiter(this, void 0, void 0, function () {
            var srcPath, destPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        srcPath = path.join(this.baseDir, source);
                        destPath = path.join(this.baseDir, destination);
                        if (!this.isPathSafe(srcPath) || !this.isPathSafe(destPath)) {
                            throw new Error('Unsafe file path detected');
                        }
                        return [4 /*yield*/, fs.copyFile(srcPath, destPath)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StorageService.prototype.moveFile = function (source, destination) {
        return __awaiter(this, void 0, void 0, function () {
            var srcPath, destPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        srcPath = path.join(this.baseDir, source);
                        destPath = path.join(this.baseDir, destination);
                        if (!this.isPathSafe(srcPath) || !this.isPathSafe(destPath)) {
                            throw new Error('Unsafe file path detected');
                        }
                        return [4 /*yield*/, fs.rename(srcPath, destPath)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StorageService.prototype.getAbsolutePath = function (relativePath) {
        var normalized = this.normalizeRelativePath(relativePath);
        var fullPath = path.join(this.baseDir, normalized);
        if (!this.isPathSafe(fullPath)) {
            throw new Error('Unsafe file path detected');
        }
        return fullPath;
    };
    /** Returns absolute path if file exists (with legacy fallback), otherwise null. */
    StorageService.prototype.getResolvableAbsolutePath = function (relativePath) {
        return __awaiter(this, void 0, void 0, function () {
            var resolved;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.resolveExistingRelativePath(relativePath)];
                    case 1:
                        resolved = _a.sent();
                        if (!resolved)
                            return [2 /*return*/, null];
                        return [2 /*return*/, this.getAbsolutePath(resolved)];
                }
            });
        });
    };
    var StorageService_1;
    StorageService = StorageService_1 = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [])
    ], StorageService);
    return StorageService;
}());
exports.StorageService = StorageService;
