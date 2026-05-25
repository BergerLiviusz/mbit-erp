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
exports.CampaignService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var CampaignService = /** @class */ (function () {
    function CampaignService(prisma) {
        this.prisma = prisma;
    }
    CampaignService.prototype.findAll = function () {
        return __awaiter(this, arguments, void 0, function (skip, take, filters) {
            var where, _a, total, items;
            if (skip === void 0) { skip = 0; }
            if (take === void 0) { take = 50; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        where = {};
                        if (filters === null || filters === void 0 ? void 0 : filters.tipus) {
                            where.tipus = filters.tipus;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.allapot) {
                            where.allapot = filters.allapot;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.kezdetDatum) {
                            where.kezdetDatum = {
                                gte: new Date(filters.kezdetDatum),
                            };
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.befejezesDatum) {
                            where.befejezesDatum = {
                                lte: new Date(filters.befejezesDatum),
                            };
                        }
                        // Szűrés accountok alapján (iparág, régió)
                        if ((filters === null || filters === void 0 ? void 0 : filters.iparag) || (filters === null || filters === void 0 ? void 0 : filters.regio)) {
                            where.accounts = {
                                some: {
                                    account: __assign(__assign({}, (filters.iparag && { iparag: filters.iparag })), (filters.regio && { regio: filters.regio })),
                                },
                            };
                        }
                        return [4 /*yield*/, Promise.all([
                                this.prisma.campaign.count({ where: where }),
                                this.prisma.campaign.findMany({
                                    where: where,
                                    skip: skip,
                                    take: take,
                                    include: {
                                        createdBy: { select: { id: true, nev: true } },
                                        accounts: {
                                            include: {
                                                account: {
                                                    select: {
                                                        id: true,
                                                        nev: true,
                                                        tipus: true,
                                                        iparag: true,
                                                        regio: true,
                                                        email: true,
                                                    },
                                                },
                                            },
                                        },
                                        _count: {
                                            select: {
                                                accounts: true,
                                                leads: true,
                                            },
                                        },
                                    },
                                    orderBy: { createdAt: 'desc' },
                                }),
                            ])];
                    case 1:
                        _a = _b.sent(), total = _a[0], items = _a[1];
                        return [2 /*return*/, { total: total, items: items }];
                }
            });
        });
    };
    CampaignService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.campaign.findUnique({
                        where: { id: id },
                        include: {
                            accounts: {
                                include: {
                                    account: true,
                                },
                            },
                            leads: true,
                        },
                    })];
            });
        });
    };
    CampaignService.prototype.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.campaign.create({
                        data: data,
                    })];
            });
        });
    };
    CampaignService.prototype.update = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.campaign.update({
                        where: { id: id },
                        data: data,
                    })];
            });
        });
    };
    CampaignService.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.campaign.delete({
                        where: { id: id },
                    })];
            });
        });
    };
    CampaignService.prototype.close = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.campaign.update({
                        where: { id: id },
                        data: { allapot: 'lezart', befejezesDatum: new Date() },
                    })];
            });
        });
    };
    CampaignService.prototype.selectAudience = function (campaignId, filters) {
        return __awaiter(this, void 0, void 0, function () {
            var where, accounts, _i, accounts_1, account;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        where = { aktiv: true };
                        if (filters.iparag)
                            where.iparag = filters.iparag;
                        if (filters.regio)
                            where.regio = filters.regio;
                        if (filters.tipus)
                            where.tipus = filters.tipus;
                        return [4 /*yield*/, this.prisma.account.findMany({
                                where: where,
                                include: { contacts: { where: { elsodleges: true }, take: 1 } },
                            })];
                    case 1:
                        accounts = _a.sent();
                        _i = 0, accounts_1 = accounts;
                        _a.label = 2;
                    case 2:
                        if (!(_i < accounts_1.length)) return [3 /*break*/, 5];
                        account = accounts_1[_i];
                        return [4 /*yield*/, this.prisma.campaignAccount.upsert({
                                where: {
                                    campaignId_accountId: { campaignId: campaignId, accountId: account.id },
                                },
                                create: { campaignId: campaignId, accountId: account.id },
                                update: {},
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, this.findOne(campaignId)];
                }
            });
        });
    };
    CampaignService.prototype.setFeedback = function (campaignId, accountId, visszajelzes) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.campaignAccount.upsert({
                        where: {
                            campaignId_accountId: { campaignId: campaignId, accountId: accountId },
                        },
                        create: { campaignId: campaignId, accountId: accountId, visszajelzes: visszajelzes },
                        update: { visszajelzes: visszajelzes },
                    })];
            });
        });
    };
    CampaignService.prototype.getResultsReport = function (campaignId) {
        return __awaiter(this, void 0, void 0, function () {
            var campaigns;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.campaign.findMany({
                            where: campaignId ? { id: campaignId } : { allapot: 'lezart' },
                            include: {
                                accounts: { include: { account: true } },
                                _count: { select: { leads: true, accounts: true } },
                            },
                        })];
                    case 1:
                        campaigns = _a.sent();
                        return [2 /*return*/, campaigns.map(function (c) { return ({
                                id: c.id,
                                nev: c.nev,
                                allapot: c.allapot,
                                celcsoportSzam: c._count.accounts,
                                leadSzam: c._count.leads,
                                visszajelzesek: c.accounts.filter(function (a) { return a.visszajelzes; }).length,
                                pozitiv: c.accounts.filter(function (a) {
                                    return (a.visszajelzes || '').toLowerCase().includes('pozitiv');
                                }).length,
                            }); })];
                }
            });
        });
    };
    CampaignService.prototype.exportAudience = function (campaignId, format) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.campaignAccount.findMany({
                            where: { campaignId: campaignId },
                            include: {
                                account: {
                                    include: { contacts: true },
                                },
                            },
                        })];
                    case 1:
                        rows = _a.sent();
                        return [2 /*return*/, { rows: rows, format: format, campaignId: campaignId }];
                }
            });
        });
    };
    CampaignService.prototype.exportCampaigns = function (filters_1) {
        return __awaiter(this, arguments, void 0, function (filters, format) {
            var campaigns;
            if (format === void 0) { format = 'csv'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.campaign.findMany({
                            where: filters ? this.buildWhereClause(filters) : {},
                            include: {
                                createdBy: { select: { id: true, nev: true, email: true } },
                                accounts: {
                                    include: {
                                        account: {
                                            select: {
                                                id: true,
                                                nev: true,
                                                tipus: true,
                                                iparag: true,
                                                regio: true,
                                                email: true,
                                                telefon: true,
                                            },
                                        },
                                    },
                                },
                                _count: {
                                    select: {
                                        accounts: true,
                                        leads: true,
                                    },
                                },
                            },
                            orderBy: { createdAt: 'desc' },
                        })];
                    case 1:
                        campaigns = _a.sent();
                        return [2 /*return*/, campaigns];
                }
            });
        });
    };
    CampaignService.prototype.buildWhereClause = function (filters) {
        var where = {};
        if (filters.tipus) {
            where.tipus = filters.tipus;
        }
        if (filters.allapot) {
            where.allapot = filters.allapot;
        }
        if (filters.kezdetDatum) {
            where.kezdetDatum = {
                gte: new Date(filters.kezdetDatum),
            };
        }
        if (filters.befejezesDatum) {
            where.befejezesDatum = {
                lte: new Date(filters.befejezesDatum),
            };
        }
        if (filters.iparag || filters.regio) {
            where.accounts = {
                some: {
                    account: __assign(__assign({}, (filters.iparag && { iparag: filters.iparag })), (filters.regio && { regio: filters.regio })),
                },
            };
        }
        return where;
    };
    CampaignService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], CampaignService);
    return CampaignService;
}());
exports.CampaignService = CampaignService;
