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
exports.SystemSettingsService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var SystemSettingsService = /** @class */ (function () {
    function SystemSettingsService(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(SystemSettingsService_1.name);
    }
    SystemSettingsService_1 = SystemSettingsService;
    SystemSettingsService.prototype.get = function (kulcs) {
        return __awaiter(this, void 0, void 0, function () {
            var setting;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.systemSetting.findUnique({
                            where: { kulcs: kulcs },
                        })];
                    case 1:
                        setting = _a.sent();
                        return [2 /*return*/, (setting === null || setting === void 0 ? void 0 : setting.ertek) || null];
                }
            });
        });
    };
    SystemSettingsService.prototype.set = function (kulcs_1, ertek_1) {
        return __awaiter(this, arguments, void 0, function (kulcs, ertek, kategoria, tipus, leiras) {
            var existing;
            if (kategoria === void 0) { kategoria = 'general'; }
            if (tipus === void 0) { tipus = 'string'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.systemSetting.findUnique({
                            where: { kulcs: kulcs },
                        })];
                    case 1:
                        existing = _a.sent();
                        if (!existing) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.prisma.systemSetting.update({
                                where: { kulcs: kulcs },
                                data: { ertek: ertek },
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.prisma.systemSetting.create({
                            data: {
                                kulcs: kulcs,
                                ertek: ertek,
                                tipus: tipus,
                                kategoria: kategoria,
                                leiras: leiras,
                            },
                        })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        this.logger.log("Setting updated: ".concat(kulcs, " = ").concat(ertek));
                        return [2 /*return*/];
                }
            });
        });
    };
    SystemSettingsService.prototype.getAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.systemSetting.findMany({
                            orderBy: [{ kategoria: 'asc' }, { kulcs: 'asc' }],
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SystemSettingsService.prototype.getAllByCategory = function (kategoria) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.systemSetting.findMany({
                            where: { kategoria: kategoria },
                            orderBy: { kulcs: 'asc' },
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SystemSettingsService.prototype.initializeDefaults = function () {
        return __awaiter(this, void 0, void 0, function () {
            var defaults, _i, defaults_1, setting, existing;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        defaults = [
                            {
                                kulcs: 'organization.name',
                                ertek: 'MB-IT Kft.',
                                tipus: 'string',
                                kategoria: 'organization',
                                leiras: 'Szervezet neve',
                            },
                            {
                                kulcs: 'organization.address',
                                ertek: '',
                                tipus: 'string',
                                kategoria: 'organization',
                                leiras: 'Szervezet címe',
                            },
                            {
                                kulcs: 'organization.tax_number',
                                ertek: '',
                                tipus: 'string',
                                kategoria: 'organization',
                                leiras: 'Adószám',
                            },
                            {
                                kulcs: 'organization.email',
                                ertek: 'admin@mbit.hu',
                                tipus: 'string',
                                kategoria: 'organization',
                                leiras: 'Kapcsolattartói email',
                            },
                            {
                                kulcs: 'organization.phone',
                                ertek: '',
                                tipus: 'string',
                                kategoria: 'organization',
                                leiras: 'Telefonszám',
                            },
                            {
                                kulcs: 'organization.registration_number',
                                ertek: '',
                                tipus: 'string',
                                kategoria: 'organization',
                                leiras: 'Cégjegyzékszám',
                            },
                            {
                                kulcs: 'organization.website',
                                ertek: '',
                                tipus: 'string',
                                kategoria: 'organization',
                                leiras: 'Weboldal',
                            },
                            {
                                kulcs: 'numbering.quote.pattern',
                                ertek: 'AJ-{YYYY}-{####}',
                                tipus: 'string',
                                kategoria: 'numbering',
                                leiras: 'Árajánlat számozási minta',
                            },
                            {
                                kulcs: 'numbering.order.pattern',
                                ertek: 'R-{YYYY}-{####}',
                                tipus: 'string',
                                kategoria: 'numbering',
                                leiras: 'Rendelés számozási minta',
                            },
                            {
                                kulcs: 'numbering.document.pattern',
                                ertek: 'MBIT/{YYYY}/{####}',
                                tipus: 'string',
                                kategoria: 'numbering',
                                leiras: 'Dokumentum iktatószám minta',
                            },
                            {
                                kulcs: 'numbering.purchase_order.pattern',
                                ertek: 'PO-{YYYY}-{####}',
                                tipus: 'string',
                                kategoria: 'numbering',
                                leiras: 'Beszerzési rendelés számozási minta',
                            },
                            {
                                kulcs: 'logistics.low_stock_threshold',
                                ertek: '10',
                                tipus: 'number',
                                kategoria: 'logistics',
                                leiras: 'Alacsony készlet küszöbérték',
                            },
                            {
                                kulcs: 'backup.daily.enabled',
                                ertek: 'true',
                                tipus: 'boolean',
                                kategoria: 'backup',
                                leiras: 'Napi mentés engedélyezése',
                            },
                            {
                                kulcs: 'backup.daily.schedule',
                                ertek: '02:00',
                                tipus: 'string',
                                kategoria: 'backup',
                                leiras: 'Napi mentés időpontja (HH:mm)',
                            },
                            {
                                kulcs: 'backup.weekly.enabled',
                                ertek: 'false',
                                tipus: 'boolean',
                                kategoria: 'backup',
                                leiras: 'Heti mentés engedélyezése',
                            },
                            {
                                kulcs: 'backup.weekly.schedule',
                                ertek: '03:00',
                                tipus: 'string',
                                kategoria: 'backup',
                                leiras: 'Heti mentés időpontja (HH:mm)',
                            },
                            {
                                kulcs: 'backup.retention.count',
                                ertek: '10',
                                tipus: 'number',
                                kategoria: 'backup',
                                leiras: 'Megőrzendő mentések száma',
                            },
                            {
                                kulcs: 'quote.approval.threshold',
                                ertek: '1000000',
                                tipus: 'number',
                                kategoria: 'crm',
                                leiras: 'Árajánlat jóváhagyási küszöb (HUF)',
                            },
                            {
                                kulcs: 'system.lan.enabled',
                                ertek: 'false',
                                tipus: 'boolean',
                                kategoria: 'system',
                                leiras: 'LAN együttműködés engedélyezése',
                            },
                        ];
                        _i = 0, defaults_1 = defaults;
                        _a.label = 1;
                    case 1:
                        if (!(_i < defaults_1.length)) return [3 /*break*/, 5];
                        setting = defaults_1[_i];
                        return [4 /*yield*/, this.prisma.systemSetting.findUnique({
                                where: { kulcs: setting.kulcs },
                            })];
                    case 2:
                        existing = _a.sent();
                        if (!!existing) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.prisma.systemSetting.create({
                                data: setting,
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5:
                        this.logger.log('Default settings initialized');
                        return [2 /*return*/];
                }
            });
        });
    };
    SystemSettingsService.prototype.delete = function (kulcs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.systemSetting.delete({
                            where: { kulcs: kulcs },
                        })];
                    case 1:
                        _a.sent();
                        this.logger.log("Setting deleted: ".concat(kulcs));
                        return [2 /*return*/];
                }
            });
        });
    };
    SystemSettingsService.prototype.updateMany = function (settings) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, settings_1, setting, existing;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, settings_1 = settings;
                        _a.label = 1;
                    case 1:
                        if (!(_i < settings_1.length)) return [3 /*break*/, 5];
                        setting = settings_1[_i];
                        return [4 /*yield*/, this.prisma.systemSetting.findUnique({
                                where: { kulcs: setting.kulcs },
                            })];
                    case 2:
                        existing = _a.sent();
                        if (!existing) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.prisma.systemSetting.update({
                                where: { kulcs: setting.kulcs },
                                data: { ertek: setting.ertek },
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5:
                        this.logger.log("Updated ".concat(settings.length, " settings"));
                        return [2 /*return*/];
                }
            });
        });
    };
    var SystemSettingsService_1;
    SystemSettingsService = SystemSettingsService_1 = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], SystemSettingsService);
    return SystemSettingsService;
}());
exports.SystemSettingsService = SystemSettingsService;
