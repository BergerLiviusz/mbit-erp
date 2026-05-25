"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.PrismaService = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var path_1 = require("path");
var fs_1 = require("fs");
var PrismaService = /** @class */ (function (_super) {
    __extends(PrismaService, _super);
    function PrismaService() {
        var _this = this;
        // Resolve relative DATABASE_URL to absolute path for consistency across environments
        var datasourceUrl = process.env.DATABASE_URL;
        if (datasourceUrl === null || datasourceUrl === void 0 ? void 0 : datasourceUrl.startsWith('file:./')) {
            var relativePath = datasourceUrl.replace('file:./', '');
            var absolutePath = (0, path_1.join)(process.cwd(), 'apps', 'server', relativePath);
            datasourceUrl = "file:".concat(absolutePath);
        }
        // For Electron desktop mode, ensure the database file path is properly formatted
        // Prisma SQLite expects forward slashes even on Windows
        // Ensure directory exists before Prisma tries to connect
        if (datasourceUrl === null || datasourceUrl === void 0 ? void 0 : datasourceUrl.startsWith('file:')) {
            var dbPath = datasourceUrl.replace('file:', '');
            // Ensure directory exists - handle both forward and backslashes
            var lastSlash = Math.max(dbPath.lastIndexOf('/'), dbPath.lastIndexOf('\\'));
            var dbDir = lastSlash > 0 ? dbPath.substring(0, lastSlash) : '';
            if (dbDir && !(0, fs_1.existsSync)(dbDir)) {
                var fs = require('fs');
                fs.mkdirSync(dbDir, { recursive: true });
                // Can't use this.logger here, super() not called yet
                console.log("[PrismaService] Created database directory: ".concat(dbDir));
            }
        }
        // super() must be called before accessing 'this'
        _this = _super.call(this, {
            datasources: {
                db: {
                    url: datasourceUrl,
                },
            },
        }) || this;
        _this.logger = new common_1.Logger(PrismaService_1.name);
        _this.$use(function (params, next) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, next(params)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        }); });
        return _this;
    }
    PrismaService_1 = PrismaService;
    PrismaService.prototype.onModuleInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var isElectron, error_1, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.$connect()];
                    case 1:
                        _a.sent();
                        this.logger.log('✅ Adatbázis kapcsolat létrejött');
                        isElectron = process.env.ELECTRON_RUN_AS_NODE === '1';
                        if (!isElectron) return [3 /*break*/, 5];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.ensureSchema()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        this.logger.warn('Schema initialization check failed:', error_1);
                        return [3 /*break*/, 5];
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, this.applyMigrations()];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        error_2 = _a.sent();
                        this.logger.warn('Migration check failed:', error_2);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    PrismaService.prototype.applyMigrations = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tableInfo, hasTxtFajlUtvonal, ocrError_1, boardError_1, isElectron, migrateError_1, error_3;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 14, , 15]);
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, this.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n          PRAGMA table_info(ocr_feladatok);\n        "], ["\n          PRAGMA table_info(ocr_feladatok);\n        "])))];
                    case 2:
                        tableInfo = _d.sent();
                        hasTxtFajlUtvonal = tableInfo.some(function (col) { return col.name === 'txtFajlUtvonal'; });
                        if (!!hasTxtFajlUtvonal) return [3 /*break*/, 4];
                        this.logger.log('Adding missing column txtFajlUtvonal to ocr_feladatok table...');
                        return [4 /*yield*/, this.$executeRaw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n            ALTER TABLE ocr_feladatok ADD COLUMN txtFajlUtvonal TEXT;\n          "], ["\n            ALTER TABLE ocr_feladatok ADD COLUMN txtFajlUtvonal TEXT;\n          "])))];
                    case 3:
                        _d.sent();
                        this.logger.log('✅ Column txtFajlUtvonal added successfully');
                        _d.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        ocrError_1 = _d.sent();
                        // OCR table might not exist yet, which is fine
                        if (!((_a = ocrError_1.message) === null || _a === void 0 ? void 0 : _a.includes('no such table'))) {
                            this.logger.warn('OCR table migration check error:', ocrError_1.message);
                        }
                        return [3 /*break*/, 6];
                    case 6:
                        _d.trys.push([6, 8, , 13]);
                        return [4 /*yield*/, this.$queryRaw(templateObject_3 || (templateObject_3 = __makeTemplateObject(["SELECT 1 FROM task_boardok LIMIT 1"], ["SELECT 1 FROM task_boardok LIMIT 1"])))];
                    case 7:
                        _d.sent();
                        this.logger.debug('Task board table exists');
                        return [3 /*break*/, 13];
                    case 8:
                        boardError_1 = _d.sent();
                        if (!(((_b = boardError_1.message) === null || _b === void 0 ? void 0 : _b.includes('no such table')) || ((_c = boardError_1.message) === null || _c === void 0 ? void 0 : _c.includes('does not exist')))) return [3 /*break*/, 12];
                        this.logger.warn('⚠️ Task board table does not exist - migrations may not have run');
                        this.logger.warn('This may cause errors when creating boards. Please run: npx prisma migrate deploy');
                        isElectron = process.env.ELECTRON_RUN_AS_NODE === '1';
                        if (!isElectron) return [3 /*break*/, 12];
                        _d.label = 9;
                    case 9:
                        _d.trys.push([9, 11, , 12]);
                        return [4 /*yield*/, this.runMigrationsProgrammatically()];
                    case 10:
                        _d.sent();
                        return [3 /*break*/, 12];
                    case 11:
                        migrateError_1 = _d.sent();
                        this.logger.error('Failed to run migrations programmatically:', migrateError_1.message);
                        return [3 /*break*/, 12];
                    case 12: return [3 /*break*/, 13];
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        error_3 = _d.sent();
                        this.logger.warn('Migration check error:', error_3.message);
                        return [3 /*break*/, 15];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    PrismaService.prototype.runMigrationsProgrammatically = function () {
        return __awaiter(this, void 0, void 0, function () {
            var execSync, join_1, isElectron, resourcesPath, prismaDir, nodeModulesDir, prismaCliJs, env, command;
            return __generator(this, function (_a) {
                try {
                    execSync = require('child_process').execSync;
                    join_1 = require('path').join;
                    isElectron = process.env.ELECTRON_RUN_AS_NODE === '1';
                    resourcesPath = process.resourcesPath;
                    prismaDir = isElectron && resourcesPath
                        ? join_1(resourcesPath, 'backend', 'prisma')
                        : join_1(__dirname, '..', '..', 'prisma');
                    nodeModulesDir = isElectron && resourcesPath
                        ? join_1(resourcesPath, 'backend', 'node_modules')
                        : join_1(__dirname, '..', '..', 'node_modules');
                    prismaCliJs = join_1(nodeModulesDir, 'prisma', 'build', 'index.js');
                    if (!(0, fs_1.existsSync)(prismaCliJs)) {
                        this.logger.warn('Prisma CLI not found, skipping migrations');
                        return [2 /*return*/];
                    }
                    this.logger.log('Running prisma migrate deploy...');
                    env = __assign(__assign({}, process.env), { DATABASE_URL: process.env.DATABASE_URL });
                    command = "\"".concat(process.execPath, "\" \"").concat(prismaCliJs, "\" migrate deploy");
                    execSync(command, {
                        cwd: prismaDir,
                        stdio: 'pipe',
                        env: env,
                        shell: true,
                    });
                    this.logger.log('✅ Migrations applied successfully');
                }
                catch (error) {
                    this.logger.warn('Failed to run migrations:', error.message);
                    throw error;
                }
                return [2 /*return*/];
            });
        });
    };
    PrismaService.prototype.ensureSchema = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_4, execSync, join_2, isElectron, resourcesPath, schemaDir, schemaPath, nodeModulesDir, prismaCliJs, escapedPrismaCli, escapedExecPath, env, command, pushError_1, altError_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 10]);
                        // Try to query a table to see if schema exists
                        return [4 /*yield*/, this.$queryRaw(templateObject_4 || (templateObject_4 = __makeTemplateObject(["SELECT 1 FROM felhasznalok LIMIT 1"], ["SELECT 1 FROM felhasznalok LIMIT 1"])))];
                    case 1:
                        // Try to query a table to see if schema exists
                        _a.sent();
                        this.logger.debug('Database schema already initialized');
                        return [2 /*return*/];
                    case 2:
                        error_4 = _a.sent();
                        // Tables don't exist - need to create schema
                        this.logger.log('🌱 New database detected - initializing schema...');
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 4, , 9]);
                        execSync = require('child_process').execSync;
                        join_2 = require('path').join;
                        isElectron = process.env.ELECTRON_RUN_AS_NODE === '1';
                        resourcesPath = process.resourcesPath;
                        schemaDir = isElectron && resourcesPath
                            ? join_2(resourcesPath, 'backend', 'prisma')
                            : join_2(__dirname, '..', '..', 'prisma');
                        schemaPath = join_2(schemaDir, 'schema.prisma');
                        // Check if schema file exists
                        if (!(0, fs_1.existsSync)(schemaPath)) {
                            this.logger.error('Prisma schema file not found at:', schemaPath);
                            this.logger.error('Tried directory:', schemaDir);
                            throw new Error('Schema file not found');
                        }
                        nodeModulesDir = isElectron && resourcesPath
                            ? join_2(resourcesPath, 'backend', 'node_modules')
                            : join_2(__dirname, '..', '..', 'node_modules');
                        prismaCliJs = join_2(nodeModulesDir, 'prisma', 'build', 'index.js');
                        if (!(0, fs_1.existsSync)(prismaCliJs)) {
                            this.logger.error('Prisma CLI not found at:', prismaCliJs);
                            throw new Error('Prisma CLI not found in node_modules');
                        }
                        this.logger.log('Running prisma db push to create tables...');
                        this.logger.log('Schema path:', schemaPath);
                        this.logger.log('Working directory:', schemaDir);
                        this.logger.log('Prisma CLI:', prismaCliJs);
                        this.logger.log('Node executable:', process.execPath);
                        escapedPrismaCli = prismaCliJs.replace(/\\/g, '/');
                        escapedExecPath = process.execPath.replace(/\\/g, '/');
                        env = __assign(__assign({}, process.env), { DATABASE_URL: process.env.DATABASE_URL });
                        command = "\"".concat(process.execPath, "\" \"").concat(prismaCliJs, "\" db push --skip-generate --accept-data-loss");
                        this.logger.log('Executing command:', command);
                        execSync(command, {
                            cwd: schemaDir,
                            stdio: 'inherit',
                            env: env,
                            shell: true,
                        });
                        this.logger.log('✅ Database schema created successfully');
                        return [3 /*break*/, 9];
                    case 4:
                        pushError_1 = _a.sent();
                        this.logger.error('Failed to push schema:', pushError_1.message);
                        if (pushError_1.stdout) {
                            this.logger.error('stdout:', pushError_1.stdout.toString());
                        }
                        if (pushError_1.stderr) {
                            this.logger.error('stderr:', pushError_1.stderr.toString());
                        }
                        // Try alternative: use Prisma's programmatic API
                        this.logger.log('Attempting alternative schema push method...');
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, this.pushSchemaProgrammatically()];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        altError_1 = _a.sent();
                        this.logger.error('Alternative schema push also failed:', altError_1.message);
                        return [3 /*break*/, 8];
                    case 8: return [3 /*break*/, 9];
                    case 9: return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    PrismaService.prototype.pushSchemaProgrammatically = function () {
        return __awaiter(this, void 0, void 0, function () {
            var prismaPackagePath, prismaCli, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        prismaPackagePath = process.env.ELECTRON_RUN_AS_NODE === '1' && process.resourcesPath
                            ? (0, path_1.join)(process.resourcesPath, 'backend', 'node_modules', 'prisma')
                            : (0, path_1.join)(__dirname, '..', '..', '..', 'node_modules', 'prisma');
                        prismaCli = require(prismaPackagePath);
                        // Execute db push programmatically
                        return [4 /*yield*/, prismaCli.main(['db', 'push', '--skip-generate', '--accept-data-loss'])];
                    case 1:
                        // Execute db push programmatically
                        _a.sent();
                        this.logger.log('✅ Database schema created successfully (programmatic method)');
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        this.logger.error('Programmatic schema push failed:', error_5.message);
                        throw error_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PrismaService.prototype.onModuleDestroy = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.$disconnect()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    var PrismaService_1;
    PrismaService = PrismaService_1 = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [])
    ], PrismaService);
    return PrismaService;
}(client_1.PrismaClient));
exports.PrismaService = PrismaService;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
