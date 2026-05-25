"use strict";
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
exports.SeedService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var bcrypt = __importStar(require("bcrypt"));
var permission_enum_1 = require("../common/rbac/permission.enum");
var SeedService = /** @class */ (function () {
    function SeedService(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(SeedService_1.name);
    }
    SeedService_1 = SeedService;
    SeedService.prototype.onModuleInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.seedDatabaseIfEmpty()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SeedService.prototype.seedDatabaseIfEmpty = function () {
        return __awaiter(this, void 0, void 0, function () {
            var schemaError_1, userCount, error_1;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 7, , 8]);
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SELECT 1 FROM felhasznalok LIMIT 1"], ["SELECT 1 FROM felhasznalok LIMIT 1"])))];
                    case 2:
                        _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        schemaError_1 = _c.sent();
                        // If tables don't exist, we need to initialize the schema first
                        this.logger.error('❌ Adatbázis séma nem található! A táblák létrehozása szükséges.');
                        this.logger.error('Futtassa: npx prisma db push (fejlesztői módban) vagy');
                        this.logger.error('ellenőrizze, hogy az adatbázis fájl létezik és helyes formátumú.');
                        this.logger.error('Hiba részletei:', schemaError_1.message);
                        return [2 /*return*/];
                    case 4: return [4 /*yield*/, this.prisma.user.count()];
                    case 5:
                        userCount = _c.sent();
                        if (userCount > 0) {
                            this.logger.log('✅ Adatbázis már tartalmaz felhasználókat, seed kihagyva');
                            return [2 /*return*/];
                        }
                        this.logger.log('🌱 Üres adatbázis észlelve, seed indítása...');
                        return [4 /*yield*/, this.runSeed()];
                    case 6:
                        _c.sent();
                        this.logger.log('🎉 Adatbázis seed sikeres!');
                        return [3 /*break*/, 8];
                    case 7:
                        error_1 = _c.sent();
                        this.logger.error('❌ Seed hiba:', error_1.message);
                        if (((_a = error_1.message) === null || _a === void 0 ? void 0 : _a.includes('no such table')) || ((_b = error_1.message) === null || _b === void 0 ? void 0 : _b.includes('does not exist'))) {
                            this.logger.error('Az adatbázis séma nincs inicializálva. Futtassa: npx prisma db push');
                        }
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    SeedService.prototype.runSeed = function () {
        return __awaiter(this, void 0, void 0, function () {
            var roles, adminUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.seedPermissions()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.seedRoles()];
                    case 2:
                        roles = _a.sent();
                        return [4 /*yield*/, this.seedAdminUser(roles[0].id)];
                    case 3:
                        adminUser = _a.sent();
                        return [4 /*yield*/, this.seedSystemSettings()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.seedDefaultBoard(adminUser.id)];
                    case 5:
                        _a.sent();
                        this.logger.log("\u2705 Admin felhaszn\u00E1l\u00F3 l\u00E9trehozva: admin / 1234");
                        return [2 /*return*/];
                }
            });
        });
    };
    SeedService.prototype.seedPermissions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var permissionEntries, _i, permissionEntries_1, perm;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.log('🔑 Jogosultságok létrehozása...');
                        permissionEntries = Object.entries(permission_enum_1.Permission).map(function (_a) {
                            var key = _a[0], value = _a[1];
                            return (__assign({ kod: value }, permission_enum_1.PermissionDescriptions[value]));
                        });
                        _i = 0, permissionEntries_1 = permissionEntries;
                        _a.label = 1;
                    case 1:
                        if (!(_i < permissionEntries_1.length)) return [3 /*break*/, 4];
                        perm = permissionEntries_1[_i];
                        return [4 /*yield*/, this.prisma.permission.upsert({
                                where: { kod: perm.kod },
                                update: {
                                    nev: perm.nev,
                                    modulo: perm.modulo,
                                    leiras: perm.leiras,
                                },
                                create: perm,
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this.logger.log("\u2705 ".concat(permissionEntries.length, " jogosults\u00E1g l\u00E9trehozva"));
                        return [4 /*yield*/, this.prisma.permission.findMany()];
                    case 5: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SeedService.prototype.seedRoles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var roles, permissions, adminPermissions, _i, adminPermissions_1, perm;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.log('👥 Szerepkörök létrehozása...');
                        return [4 /*yield*/, Promise.all([
                                this.prisma.role.upsert({
                                    where: { nev: 'Admin' },
                                    update: {},
                                    create: {
                                        nev: 'Admin',
                                        leiras: 'Rendszergazda - teljes hozzáférés',
                                        permissions: JSON.stringify(['*']),
                                    },
                                }),
                                this.prisma.role.upsert({
                                    where: { nev: 'PowerUser' },
                                    update: {},
                                    create: {
                                        nev: 'PowerUser',
                                        leiras: 'Haladó felhasználó - osztott erőforrások',
                                        permissions: JSON.stringify(['crm.*', 'dms.*', 'logistics.*']),
                                    },
                                }),
                                this.prisma.role.upsert({
                                    where: { nev: 'User' },
                                    update: {},
                                    create: {
                                        nev: 'User',
                                        leiras: 'Felhasználó - saját hozzáférések',
                                        permissions: JSON.stringify(['crm.read', 'dms.read']),
                                    },
                                }),
                            ])];
                    case 1:
                        roles = _a.sent();
                        return [4 /*yield*/, this.prisma.permission.findMany()];
                    case 2:
                        permissions = _a.sent();
                        adminPermissions = permissions.filter(function (p) {
                            return p.modulo === 'CRM' || p.modulo === 'DMS' || p.modulo === 'Logisztika' ||
                                p.modulo === 'Rendszer' || p.modulo === 'Felhasználók' || p.modulo === 'Szerepkörök' ||
                                p.modulo === 'Jelentések';
                        });
                        _i = 0, adminPermissions_1 = adminPermissions;
                        _a.label = 3;
                    case 3:
                        if (!(_i < adminPermissions_1.length)) return [3 /*break*/, 6];
                        perm = adminPermissions_1[_i];
                        return [4 /*yield*/, this.prisma.rolePermission.upsert({
                                where: {
                                    roleId_permissionId: {
                                        roleId: roles[0].id,
                                        permissionId: perm.id,
                                    },
                                },
                                update: {},
                                create: {
                                    roleId: roles[0].id,
                                    permissionId: perm.id,
                                },
                            })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        this.logger.log('✅ Szerepkörök létrehozva');
                        return [2 /*return*/, roles];
                }
            });
        });
    };
    SeedService.prototype.seedAdminUser = function (adminRoleId) {
        return __awaiter(this, void 0, void 0, function () {
            var hashedPassword, adminUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.log('👤 Admin felhasználó létrehozása...');
                        return [4 /*yield*/, bcrypt.hash('1234', 10)];
                    case 1:
                        hashedPassword = _a.sent();
                        return [4 /*yield*/, this.prisma.user.upsert({
                                where: { email: 'admin@mbit.hu' },
                                update: {
                                    // Update password if user exists but password is different
                                    password: hashedPassword,
                                },
                                create: {
                                    email: 'admin@mbit.hu',
                                    password: hashedPassword,
                                    nev: 'Rendszergazda',
                                    aktiv: true,
                                },
                            })];
                    case 2:
                        adminUser = _a.sent();
                        return [4 /*yield*/, this.prisma.userRole.upsert({
                                where: {
                                    userId_roleId: {
                                        userId: adminUser.id,
                                        roleId: adminRoleId,
                                    },
                                },
                                update: {},
                                create: {
                                    userId: adminUser.id,
                                    roleId: adminRoleId,
                                },
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, adminUser];
                }
            });
        });
    };
    SeedService.prototype.seedSystemSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var settings, _i, settings_1, setting;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.log('⚙️ Rendszerbeállítások inicializálása...');
                        settings = [
                            { kulcs: 'organization.name', ertek: 'MB-IT Kft.', tipus: 'string', kategoria: 'organization', leiras: 'Szervezet neve' },
                            { kulcs: 'organization.address', ertek: '', tipus: 'string', kategoria: 'organization', leiras: 'Szervezet címe' },
                            { kulcs: 'organization.tax_number', ertek: '', tipus: 'string', kategoria: 'organization', leiras: 'Adószám' },
                            { kulcs: 'organization.email', ertek: 'admin@mbit.hu', tipus: 'string', kategoria: 'organization', leiras: 'Kapcsolattartói email' },
                            { kulcs: 'organization.phone', ertek: '', tipus: 'string', kategoria: 'organization', leiras: 'Telefonszám' },
                            { kulcs: 'numbering.quote.pattern', ertek: 'AJ-{YYYY}-{####}', tipus: 'string', kategoria: 'numbering', leiras: 'Árajánlat számozási minta' },
                            { kulcs: 'numbering.order.pattern', ertek: 'R-{YYYY}-{####}', tipus: 'string', kategoria: 'numbering', leiras: 'Rendelés számozási minta' },
                            { kulcs: 'numbering.document.pattern', ertek: 'MBIT/{YYYY}/{####}', tipus: 'string', kategoria: 'numbering', leiras: 'Dokumentum iktatószám minta' },
                            { kulcs: 'numbering.purchase_order.pattern', ertek: 'BR-{YYYY}-{####}', tipus: 'string', kategoria: 'numbering', leiras: 'Beszerzési rendelés számozási minta' },
                            { kulcs: 'numbering.delivery_note.pattern', ertek: 'SZL-{YYYY}-{####}', tipus: 'string', kategoria: 'numbering', leiras: 'Szállítólevél számozási minta' },
                            { kulcs: 'backup.daily.enabled', ertek: 'false', tipus: 'boolean', kategoria: 'backup', leiras: 'Napi mentés engedélyezése' },
                            { kulcs: 'backup.daily.schedule', ertek: '0 2 * * *', tipus: 'string', kategoria: 'backup', leiras: 'Napi mentés időpontja (cron)' },
                            { kulcs: 'backup.weekly.enabled', ertek: 'false', tipus: 'boolean', kategoria: 'backup', leiras: 'Heti mentés engedélyezése' },
                            { kulcs: 'backup.weekly.schedule', ertek: '0 3 * * 0', tipus: 'string', kategoria: 'backup', leiras: 'Heti mentés időpontja (cron)' },
                            { kulcs: 'backup.retention.count', ertek: '10', tipus: 'number', kategoria: 'backup', leiras: 'Megőrzendő mentések száma' },
                            { kulcs: 'quote.approval.threshold', ertek: '1000000', tipus: 'number', kategoria: 'crm', leiras: 'Árajánlat jóváhagyási küszöb (HUF)' },
                            { kulcs: 'dms.ocr.enabled', ertek: 'true', tipus: 'boolean', kategoria: 'dms', leiras: 'OCR szövegfelismerés engedélyezése' },
                            { kulcs: 'dms.default_retention_years', ertek: '7', tipus: 'number', kategoria: 'dms', leiras: 'Alapértelmezett megőrzési idő (év)' },
                            { kulcs: 'dms.auto_archive_enabled', ertek: 'true', tipus: 'boolean', kategoria: 'dms', leiras: 'Automatikus archiválás engedélyezése' },
                            { kulcs: 'logistics.low_stock_threshold', ertek: '10', tipus: 'number', kategoria: 'logistics', leiras: 'Alacsony készlet riasztási küszöb (%)' },
                            { kulcs: 'logistics.valuation_method', ertek: 'FIFO', tipus: 'string', kategoria: 'logistics', leiras: 'Készlet értékelési módszer (FIFO/AVG)' },
                            { kulcs: 'logistics.auto_location_assign', ertek: 'false', tipus: 'boolean', kategoria: 'logistics', leiras: 'Automatikus raktári hely hozzárendelés' },
                            { kulcs: 'logistics.allow_negative_stock', ertek: 'false', tipus: 'boolean', kategoria: 'logistics', leiras: 'Negatív készlet engedélyezése' },
                            { kulcs: 'purchase_order.approval.threshold', ertek: '500000', tipus: 'number', kategoria: 'logistics', leiras: 'Beszerzési rendelés jóváhagyási küszöb (HUF)' },
                            { kulcs: 'system.lan.enabled', ertek: 'false', tipus: 'boolean', kategoria: 'system', leiras: 'LAN együttműködés engedélyezése' },
                        ];
                        _i = 0, settings_1 = settings;
                        _a.label = 1;
                    case 1:
                        if (!(_i < settings_1.length)) return [3 /*break*/, 4];
                        setting = settings_1[_i];
                        return [4 /*yield*/, this.prisma.systemSetting.upsert({
                                where: { kulcs: setting.kulcs },
                                update: setting,
                                create: setting,
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this.logger.log("\u2705 ".concat(settings.length, " rendszerbe\u00E1ll\u00EDt\u00E1s inicializ\u00E1lva"));
                        return [2 /*return*/];
                }
            });
        });
    };
    SeedService.prototype.seedDefaultBoard = function (adminUserId) {
        return __awaiter(this, void 0, void 0, function () {
            var existingBoard, defaultBoard;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.log('📋 Alapértelmezett board létrehozása...');
                        return [4 /*yield*/, this.prisma.taskBoard.findFirst({
                                where: { isDefault: true },
                            })];
                    case 1:
                        existingBoard = _a.sent();
                        if (existingBoard) {
                            this.logger.log('✅ Alapértelmezett board már létezik');
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.prisma.taskBoard.create({
                                data: {
                                    nev: 'Fő board',
                                    leiras: 'Alapértelmezett feladat board',
                                    szin: '#3B82F6',
                                    aktiv: true,
                                    isDefault: true,
                                    createdById: adminUserId,
                                    columns: {
                                        create: [
                                            { nev: 'Teendők', allapot: 'TODO', pozicio: 0, limit: 0 },
                                            { nev: 'Folyamatban', allapot: 'IN_PROGRESS', pozicio: 1, limit: 0 },
                                            { nev: 'Áttekintés alatt', allapot: 'IN_REVIEW', pozicio: 2, limit: 0 },
                                            { nev: 'Kész', allapot: 'DONE', pozicio: 3, limit: 0 },
                                        ],
                                    },
                                },
                            })];
                    case 2:
                        defaultBoard = _a.sent();
                        this.logger.log('✅ Alapértelmezett board létrehozva');
                        return [2 /*return*/];
                }
            });
        });
    };
    var SeedService_1;
    SeedService = SeedService_1 = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], SeedService);
    return SeedService;
}());
exports.SeedService = SeedService;
var templateObject_1;
