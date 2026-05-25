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
exports.BugReportService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var BugReportService = /** @class */ (function () {
    function BugReportService(prisma) {
        this.prisma = prisma;
    }
    BugReportService.prototype.findAll = function () {
        return __awaiter(this, arguments, void 0, function (skip, take, filters) {
            var where, _a, total, items;
            if (skip === void 0) { skip = 0; }
            if (take === void 0) { take = 50; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        where = {};
                        if (filters === null || filters === void 0 ? void 0 : filters.allapot) {
                            where.allapot = filters.allapot;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.prioritas) {
                            where.prioritas = filters.prioritas;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.kategoria) {
                            where.kategoria = filters.kategoria;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.userId) {
                            where.userId = filters.userId;
                        }
                        return [4 /*yield*/, Promise.all([
                                this.prisma.bugReport.count({ where: where }),
                                this.prisma.bugReport.findMany({
                                    where: where,
                                    skip: skip,
                                    take: take,
                                    include: {
                                        user: {
                                            select: {
                                                id: true,
                                                nev: true,
                                                email: true,
                                            },
                                        },
                                        comments: {
                                            include: {
                                                user: {
                                                    select: {
                                                        id: true,
                                                        nev: true,
                                                        email: true,
                                                    },
                                                },
                                            },
                                            orderBy: {
                                                createdAt: 'asc',
                                            },
                                        },
                                        _count: {
                                            select: {
                                                comments: true,
                                            },
                                        },
                                    },
                                    orderBy: {
                                        createdAt: 'desc',
                                    },
                                }),
                            ])];
                    case 1:
                        _a = _b.sent(), total = _a[0], items = _a[1];
                        return [2 /*return*/, { total: total, items: items }];
                }
            });
        });
    };
    BugReportService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var bugReport;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.bugReport.findUnique({
                            where: { id: id },
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        nev: true,
                                        email: true,
                                    },
                                },
                                comments: {
                                    include: {
                                        user: {
                                            select: {
                                                id: true,
                                                nev: true,
                                                email: true,
                                            },
                                        },
                                    },
                                    orderBy: {
                                        createdAt: 'asc',
                                    },
                                },
                            },
                        })];
                    case 1:
                        bugReport = _a.sent();
                        if (!bugReport) {
                            throw new common_1.NotFoundException('Hibabejelentés nem található');
                        }
                        return [2 /*return*/, bugReport];
                }
            });
        });
    };
    BugReportService.prototype.create = function (dto, userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.bugReport.create({
                        data: __assign(__assign({}, dto), { userId: userId || undefined, prioritas: dto.prioritas || 'MEDIUM', allapot: 'OPEN' }),
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    nev: true,
                                    email: true,
                                },
                            },
                        },
                    })];
            });
        });
    };
    BugReportService.prototype.update = function (id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var bugReport;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        bugReport = _a.sent();
                        return [2 /*return*/, this.prisma.bugReport.update({
                                where: { id: id },
                                data: dto,
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            nev: true,
                                            email: true,
                                        },
                                    },
                                },
                            })];
                }
            });
        });
    };
    BugReportService.prototype.addComment = function (bugReportId, dto, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var bugReport;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(bugReportId)];
                    case 1:
                        bugReport = _a.sent();
                        return [2 /*return*/, this.prisma.bugReportComment.create({
                                data: {
                                    bugReportId: bugReportId,
                                    szoveg: dto.szoveg,
                                    userId: userId || undefined,
                                },
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            nev: true,
                                            email: true,
                                        },
                                    },
                                },
                            })];
                }
            });
        });
    };
    BugReportService.prototype.getStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, total, open, inProgress, resolved, closed;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            this.prisma.bugReport.count(),
                            this.prisma.bugReport.count({ where: { allapot: 'OPEN' } }),
                            this.prisma.bugReport.count({ where: { allapot: 'IN_PROGRESS' } }),
                            this.prisma.bugReport.count({ where: { allapot: 'RESOLVED' } }),
                            this.prisma.bugReport.count({ where: { allapot: 'CLOSED' } }),
                        ])];
                    case 1:
                        _a = _b.sent(), total = _a[0], open = _a[1], inProgress = _a[2], resolved = _a[3], closed = _a[4];
                        return [2 /*return*/, {
                                total: total,
                                open: open,
                                inProgress: inProgress,
                                resolved: resolved,
                                closed: closed,
                            }];
                }
            });
        });
    };
    BugReportService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], BugReportService);
    return BugReportService;
}());
exports.BugReportService = BugReportService;
