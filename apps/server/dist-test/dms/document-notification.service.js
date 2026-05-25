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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentNotificationService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var settings_service_1 = require("../system/settings.service");
var cron = __importStar(require("node-cron"));
var DocumentNotificationService = /** @class */ (function () {
    function DocumentNotificationService(prisma, systemSettings) {
        this.prisma = prisma;
        this.systemSettings = systemSettings;
        this.logger = new common_1.Logger(DocumentNotificationService_1.name);
        this.checkTask = null;
    }
    DocumentNotificationService_1 = DocumentNotificationService;
    DocumentNotificationService.prototype.onModuleInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // Run check daily at 8:00 AM
                this.checkTask = cron.schedule('0 8 * * *', function () { return __awaiter(_this, void 0, void 0, function () {
                    var error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                this.logger.log('Running scheduled document deadline check');
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, this.checkDocumentDeadlines()];
                            case 2:
                                _a.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                error_1 = _a.sent();
                                this.logger.error('Document deadline check failed:', error_1);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                this.logger.log('Document deadline notification scheduler initialized');
                return [2 /*return*/];
            });
        });
    };
    /**
     * Check documents with upcoming deadlines and return notifications
     */
    DocumentNotificationService.prototype.checkDocumentDeadlines = function () {
        return __awaiter(this, void 0, void 0, function () {
            var now, notifications, thresholds, thirtyDaysFromNow, documents, _i, documents_1, doc, deadline, daysUntilDeadline;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = new Date();
                        notifications = [];
                        return [4 /*yield*/, this.getNotificationThresholds()];
                    case 1:
                        thresholds = _a.sent();
                        thirtyDaysFromNow = new Date(now);
                        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                        return [4 /*yield*/, this.prisma.document.findMany({
                                where: {
                                    OR: [
                                        { ervenyessegVeg: { gte: now, lte: thirtyDaysFromNow } },
                                        { lejarat: { gte: now, lte: thirtyDaysFromNow } },
                                    ],
                                },
                                include: {
                                    createdBy: {
                                        select: {
                                            id: true,
                                            nev: true,
                                            email: true,
                                        },
                                    },
                                },
                            })];
                    case 2:
                        documents = _a.sent();
                        for (_i = 0, documents_1 = documents; _i < documents_1.length; _i++) {
                            doc = documents_1[_i];
                            deadline = doc.ervenyessegVeg || doc.lejarat;
                            if (!deadline)
                                continue;
                            daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                            // Check if deadline matches any threshold
                            if (thresholds.includes(daysUntilDeadline)) {
                                notifications.push({
                                    id: doc.id,
                                    documentId: doc.id,
                                    documentNev: doc.nev,
                                    iktatoSzam: doc.iktatoSzam,
                                    lejaratDatum: deadline,
                                    napokHatra: daysUntilDeadline,
                                    felelos: doc.felelos,
                                    createdBy: doc.createdBy,
                                });
                            }
                        }
                        this.logger.log("Found ".concat(notifications.length, " documents with upcoming deadlines"));
                        return [2 /*return*/, notifications];
                }
            });
        });
    };
    /**
     * Get documents expiring soon for a specific user
     */
    DocumentNotificationService.prototype.getExpiringDocumentsForUser = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var now, thresholds, maxDays, futureDate, documents, notifications, _i, documents_2, doc, deadline, daysUntilDeadline;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = new Date();
                        return [4 /*yield*/, this.getNotificationThresholds()];
                    case 1:
                        thresholds = _a.sent();
                        maxDays = Math.max.apply(Math, thresholds);
                        futureDate = new Date(now);
                        futureDate.setDate(futureDate.getDate() + maxDays);
                        return [4 /*yield*/, this.prisma.document.findMany({
                                where: {
                                    AND: [
                                        {
                                            OR: [
                                                { createdById: userId },
                                                { access: { some: { userId: userId } } },
                                            ],
                                        },
                                        {
                                            OR: [
                                                { ervenyessegVeg: { gte: now, lte: futureDate } },
                                                { lejarat: { gte: now, lte: futureDate } },
                                            ],
                                        },
                                    ],
                                },
                                include: {
                                    createdBy: {
                                        select: {
                                            id: true,
                                            nev: true,
                                            email: true,
                                        },
                                    },
                                },
                            })];
                    case 2:
                        documents = _a.sent();
                        notifications = [];
                        for (_i = 0, documents_2 = documents; _i < documents_2.length; _i++) {
                            doc = documents_2[_i];
                            deadline = doc.ervenyessegVeg || doc.lejarat;
                            if (!deadline)
                                continue;
                            daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                            if (thresholds.includes(daysUntilDeadline)) {
                                notifications.push({
                                    id: doc.id,
                                    documentId: doc.id,
                                    documentNev: doc.nev,
                                    iktatoSzam: doc.iktatoSzam,
                                    lejaratDatum: deadline,
                                    napokHatra: daysUntilDeadline,
                                    felelos: doc.felelos,
                                    createdBy: doc.createdBy,
                                });
                            }
                        }
                        return [2 /*return*/, notifications];
                }
            });
        });
    };
    /**
     * Get notification thresholds from system settings
     */
    DocumentNotificationService.prototype.getNotificationThresholds = function () {
        return __awaiter(this, void 0, void 0, function () {
            var setting, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.systemSettings.get('dms.deadline_notification_days')];
                    case 1:
                        setting = _a.sent();
                        if (setting) {
                            // Parse comma-separated values: "7,3,1"
                            return [2 /*return*/, setting
                                    .split(',')
                                    .map(function (s) { return parseInt(s.trim()); })
                                    .filter(function (n) { return !isNaN(n) && n > 0; })
                                    .sort(function (a, b) { return b - a; })]; // Sort descending
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        this.logger.warn('Could not load notification thresholds, using defaults');
                        return [3 /*break*/, 3];
                    case 3: 
                    // Default: 7, 3, 1 days before deadline
                    return [2 /*return*/, [7, 3, 1]];
                }
            });
        });
    };
    /**
     * Manually trigger deadline check (for testing or manual execution)
     */
    DocumentNotificationService.prototype.manualCheck = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.log('Manual document deadline check triggered');
                        return [4 /*yield*/, this.checkDocumentDeadlines()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    var DocumentNotificationService_1;
    DocumentNotificationService = DocumentNotificationService_1 = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService,
            settings_service_1.SystemSettingsService])
    ], DocumentNotificationService);
    return DocumentNotificationService;
}());
exports.DocumentNotificationService = DocumentNotificationService;
