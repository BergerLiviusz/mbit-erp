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
exports.DocumentService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var settings_service_1 = require("../system/settings.service");
var DocumentService = /** @class */ (function () {
    function DocumentService(prisma, systemSettings) {
        this.prisma = prisma;
        this.systemSettings = systemSettings;
    }
    DocumentService.prototype.findAll = function () {
        return __awaiter(this, arguments, void 0, function (skip, take, filters, userId, isAdmin) {
            var where, searchTerm, searchConditions, _a, total, data, page, pageSize;
            if (skip === void 0) { skip = 0; }
            if (take === void 0) { take = 50; }
            if (isAdmin === void 0) { isAdmin = false; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        where = {};
                        if (filters === null || filters === void 0 ? void 0 : filters.categoryId) {
                            where.categoryId = filters.categoryId;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.allapot) {
                            where.allapot = filters.allapot;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.accountId) {
                            where.accountId = filters.accountId;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.irany) {
                            if (filters.irany === 'null' || filters.irany === '') {
                                where.irany = null;
                            }
                            else {
                                where.irany = filters.irany;
                            }
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.tagId) {
                            where.tags = {
                                some: {
                                    tagId: filters.tagId,
                                },
                            };
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.opportunityId) {
                            where.opportunityId = filters.opportunityId;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.quoteId) {
                            where.quoteId = filters.quoteId;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.felelos) {
                            where.felelos = filters.felelos;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.typeId) {
                            where.typeId = filters.typeId;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.ocrAllapot) {
                            where.ocrJob = { allapot: filters.ocrAllapot };
                        }
                        // Permission-based filtering: non-admin users only see documents they created or have access to
                        if (!isAdmin && userId) {
                            where.OR = [
                                { createdById: userId },
                                { access: { some: { userId: userId } } },
                            ];
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.search) {
                            searchTerm = filters.search.trim();
                            if (searchTerm.length > 0) {
                                searchConditions = [
                                    { nev: { contains: searchTerm } },
                                    { iktatoSzam: { contains: searchTerm } },
                                    { fajlNev: { contains: searchTerm } },
                                    { megjegyzesek: { contains: searchTerm } },
                                    { felelos: { contains: searchTerm } },
                                    // Only search in tartalom if it's not null
                                    {
                                        AND: [
                                            { tartalom: { not: null } },
                                            { tartalom: { contains: searchTerm } }
                                        ]
                                    },
                                    {
                                        tags: {
                                            some: {
                                                tag: {
                                                    nev: { contains: searchTerm }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        category: {
                                            nev: { contains: searchTerm }
                                        }
                                    },
                                    {
                                        account: {
                                            nev: { contains: searchTerm }
                                        }
                                    },
                                ];
                                // If we already have an OR condition for permissions, we need to combine them
                                if (where.OR) {
                                    where.AND = [
                                        { OR: where.OR },
                                        { OR: searchConditions },
                                    ];
                                    delete where.OR;
                                }
                                else {
                                    where.OR = searchConditions;
                                }
                            }
                        }
                        return [4 /*yield*/, Promise.all([
                                this.prisma.document.count({ where: where }),
                                this.prisma.document.findMany({
                                    where: where,
                                    skip: skip,
                                    take: take,
                                    include: {
                                        category: {
                                            select: {
                                                id: true,
                                                nev: true,
                                            },
                                        },
                                        account: {
                                            select: {
                                                id: true,
                                                nev: true,
                                            },
                                        },
                                        opportunity: {
                                            select: {
                                                id: true,
                                                nev: true,
                                            },
                                        },
                                        quote: {
                                            select: {
                                                id: true,
                                                azonosito: true,
                                            },
                                        },
                                        createdBy: {
                                            select: {
                                                id: true,
                                                nev: true,
                                                email: true,
                                            },
                                        },
                                        ocrJob: {
                                            select: {
                                                id: true,
                                                allapot: true,
                                                txtFajlUtvonal: true,
                                            },
                                        },
                                        tags: {
                                            include: {
                                                tag: {
                                                    select: {
                                                        id: true,
                                                        nev: true,
                                                        szin: true,
                                                    },
                                                },
                                            },
                                        },
                                        access: {
                                            include: {
                                                user: {
                                                    select: {
                                                        id: true,
                                                        nev: true,
                                                        email: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                    orderBy: { createdAt: 'desc' },
                                }),
                            ])];
                    case 1:
                        _a = _b.sent(), total = _a[0], data = _a[1];
                        page = Math.floor(skip / take) + 1;
                        pageSize = take;
                        return [2 /*return*/, { data: data, total: total, page: page, pageSize: pageSize }];
                }
            });
        });
    };
    DocumentService.prototype.findOne = function (id_1, userId_1) {
        return __awaiter(this, arguments, void 0, function (id, userId, isAdmin) {
            var document, hasAccess;
            if (isAdmin === void 0) { isAdmin = false; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.document.findUnique({
                            where: { id: id },
                            include: {
                                category: true,
                                account: true,
                                opportunity: {
                                    select: {
                                        id: true,
                                        nev: true,
                                    },
                                },
                                quote: {
                                    select: {
                                        id: true,
                                        azonosito: true,
                                    },
                                },
                                createdBy: {
                                    select: {
                                        id: true,
                                        nev: true,
                                        email: true,
                                    },
                                },
                                versions: {
                                    orderBy: { createdAt: 'desc' },
                                    take: 10,
                                },
                                workflowLogs: {
                                    orderBy: { createdAt: 'desc' },
                                    take: 50,
                                },
                                ocrJob: true,
                                tags: { include: { tag: true } },
                                access: {
                                    include: {
                                        user: {
                                            select: {
                                                id: true,
                                                nev: true,
                                                email: true,
                                            },
                                        },
                                    },
                                },
                            },
                        })];
                    case 1:
                        document = _a.sent();
                        if (!document) {
                            return [2 /*return*/, null];
                        }
                        // Check permissions: admin can see all, others only if they created it or have access
                        if (!isAdmin && userId) {
                            hasAccess = document.createdById === userId ||
                                (document.access && document.access.some(function (acc) { return acc.userId === userId; }));
                            if (!hasAccess) {
                                return [2 /*return*/, null];
                            }
                        }
                        return [2 /*return*/, document];
                }
            });
        });
    };
    DocumentService.prototype.create = function (dto, userId, options) {
        return __awaiter(this, void 0, void 0, function () {
            var iktatoSzam, exists, document;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(dto.iktatoSzam && (options === null || options === void 0 ? void 0 : options.manualIktato) && (options === null || options === void 0 ? void 0 : options.isAdmin))) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.prisma.document.findUnique({
                                where: { iktatoSzam: dto.iktatoSzam },
                            })];
                    case 1:
                        exists = _a.sent();
                        if (exists) {
                            throw new Error('Az iktatószám már foglalt');
                        }
                        iktatoSzam = dto.iktatoSzam;
                        return [3 /*break*/, 4];
                    case 2:
                        if (dto.iktatoSzam && !(options === null || options === void 0 ? void 0 : options.isAdmin)) {
                            throw new Error('Manuális iktatószám csak admin jogosultsággal adható meg');
                        }
                        return [4 /*yield*/, this.generateIktatoSzam(dto.tipus)];
                    case 3:
                        iktatoSzam = _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, this.prisma.document.create({
                            data: {
                                nev: dto.nev,
                                tipus: dto.tipus,
                                typeId: dto.typeId,
                                felelos: dto.felelos,
                                irany: dto.irany || null,
                                categoryId: dto.categoryId,
                                accountId: dto.accountId,
                                opportunityId: dto.opportunityId,
                                quoteId: dto.quoteId,
                                allapot: dto.allapot,
                                fajlNev: dto.fajlNev,
                                fajlMeret: dto.fajlMeret,
                                fajlUtvonal: dto.fajlUtvonal || '',
                                mimeType: dto.mimeType,
                                megjegyzesek: dto.megjegyzesek,
                                ervenyessegKezdet: dto.ervenyessegKezdet ? new Date(dto.ervenyessegKezdet) : null,
                                ervenyessegVeg: dto.ervenyessegVeg ? new Date(dto.ervenyessegVeg) : null,
                                lejarat: dto.lejarat ? new Date(dto.lejarat) : null,
                                jelenlegiHely: dto.jelenlegiHely || null,
                                iktatoSzam: iktatoSzam,
                                createdById: userId,
                                access: userId ? {
                                    create: {
                                        userId: userId,
                                        jogosultsag: 'FULL_ACCESS',
                                    },
                                } : undefined,
                            },
                        })];
                    case 5:
                        document = _a.sent();
                        return [2 /*return*/, document];
                }
            });
        });
    };
    DocumentService.prototype.update = function (id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var updateData;
            return __generator(this, function (_a) {
                updateData = __assign({}, dto);
                // Convert date strings to Date objects if provided
                if (dto.ervenyessegKezdet !== undefined) {
                    updateData.ervenyessegKezdet = dto.ervenyessegKezdet ? new Date(dto.ervenyessegKezdet) : null;
                }
                if (dto.ervenyessegVeg !== undefined) {
                    updateData.ervenyessegVeg = dto.ervenyessegVeg ? new Date(dto.ervenyessegVeg) : null;
                }
                if (dto.lejarat !== undefined) {
                    updateData.lejarat = dto.lejarat ? new Date(dto.lejarat) : null;
                }
                // Handle irany: empty string should be null
                if (dto.irany !== undefined) {
                    updateData.irany = dto.irany || null;
                }
                return [2 /*return*/, this.prisma.document.update({
                        where: { id: id },
                        data: updateData,
                    })];
            });
        });
    };
    DocumentService.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.document.delete({
                        where: { id: id },
                    })];
            });
        });
    };
    DocumentService.prototype.generateIktatoSzam = function (tipus) {
        return __awaiter(this, void 0, void 0, function () {
            var pattern, defaultPattern, template, orgName, orgPrefix, now, year, countThisYear, sequenceNumber, tipusCode, iktatoSzam;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.systemSettings.get('numbering.document.pattern')];
                    case 1:
                        pattern = _a.sent();
                        defaultPattern = 'MBIT/{YYYY}/{####}';
                        template = pattern || defaultPattern;
                        return [4 /*yield*/, this.systemSettings.get('organization.name')];
                    case 2:
                        orgName = _a.sent();
                        orgPrefix = orgName ? orgName.replace(/[^A-Z0-9]/gi, '').toUpperCase() : 'MBIT';
                        now = new Date();
                        year = now.getFullYear();
                        return [4 /*yield*/, this.prisma.document.count({
                                where: {
                                    createdAt: {
                                        gte: new Date(year, 0, 1),
                                        lt: new Date(year + 1, 0, 1),
                                    },
                                },
                            })];
                    case 3:
                        countThisYear = _a.sent();
                        sequenceNumber = countThisYear + 1;
                        tipusCode = (tipus || 'DOC').toUpperCase().slice(0, 8);
                        iktatoSzam = template
                            .replace('{ORG}', orgPrefix)
                            .replace('{TIPUS}', tipusCode)
                            .replace('{YYYY}', year.toString())
                            .replace('{YY}', year.toString().slice(-2))
                            .replace('{####}', sequenceNumber.toString().padStart(4, '0'))
                            .replace('{###}', sequenceNumber.toString().padStart(3, '0'))
                            .replace('{##}', sequenceNumber.toString().padStart(2, '0'));
                        // Ha még mindig tartalmazza a MBIT-et, cseréljük le
                        iktatoSzam = iktatoSzam.replace(/MBIT/g, orgPrefix);
                        return [2 /*return*/, iktatoSzam];
                }
            });
        });
    };
    DocumentService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService,
            settings_service_1.SystemSettingsService])
    ], DocumentService);
    return DocumentService;
}());
exports.DocumentService = DocumentService;
