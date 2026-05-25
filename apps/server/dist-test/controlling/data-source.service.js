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
exports.DataSourceService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var DataSourceService = /** @class */ (function () {
    function DataSourceService(prisma) {
        this.prisma = prisma;
    }
    DataSourceService.prototype.findAllDataSources = function () {
        return __awaiter(this, arguments, void 0, function (skip, take, filters) {
            var where, _a, total, items;
            if (skip === void 0) { skip = 0; }
            if (take === void 0) { take = 50; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        where = {};
                        if ((filters === null || filters === void 0 ? void 0 : filters.aktiv) !== undefined) {
                            where.aktiv = filters.aktiv;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.tipus) {
                            where.tipus = filters.tipus;
                        }
                        return [4 /*yield*/, Promise.all([
                                this.prisma.dataSource.count({ where: where }),
                                this.prisma.dataSource.findMany({
                                    where: where,
                                    skip: skip,
                                    take: take,
                                    include: {
                                        connection: {
                                            select: {
                                                id: true,
                                                nev: true,
                                                tipus: true,
                                            },
                                        },
                                    },
                                    orderBy: {
                                        nev: 'asc',
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
    DataSourceService.prototype.findDataSource = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var source;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.dataSource.findUnique({
                            where: { id: id },
                            include: {
                                connection: true,
                            },
                        })];
                    case 1:
                        source = _a.sent();
                        if (!source) {
                            throw new common_1.NotFoundException('Adatforrás nem található');
                        }
                        return [2 /*return*/, source];
                }
            });
        });
    };
    DataSourceService.prototype.createDataSource = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var validTypes, connection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validTypes = ['DATABASE', 'FILE', 'API', 'MANUAL'];
                        if (!validTypes.includes(dto.tipus.toUpperCase())) {
                            throw new common_1.BadRequestException('Érvénytelen adatforrás típus');
                        }
                        if (!dto.connectionId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.prisma.databaseConnection.findUnique({
                                where: { id: dto.connectionId },
                            })];
                    case 1:
                        connection = _a.sent();
                        if (!connection) {
                            throw new common_1.NotFoundException('Adatbázis kapcsolat nem található');
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.prisma.dataSource.create({
                            data: __assign(__assign({}, dto), { tipus: dto.tipus.toUpperCase() }),
                            include: {
                                connection: true,
                            },
                        })];
                }
            });
        });
    };
    DataSourceService.prototype.updateDataSource = function (id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var source, validTypes, connection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findDataSource(id)];
                    case 1:
                        source = _a.sent();
                        if (dto.tipus) {
                            validTypes = ['DATABASE', 'FILE', 'API', 'MANUAL'];
                            if (!validTypes.includes(dto.tipus.toUpperCase())) {
                                throw new common_1.BadRequestException('Érvénytelen adatforrás típus');
                            }
                        }
                        if (!dto.connectionId) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.prisma.databaseConnection.findUnique({
                                where: { id: dto.connectionId },
                            })];
                    case 2:
                        connection = _a.sent();
                        if (!connection) {
                            throw new common_1.NotFoundException('Adatbázis kapcsolat nem található');
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/, this.prisma.dataSource.update({
                            where: { id: id },
                            data: __assign(__assign({}, dto), { tipus: dto.tipus ? dto.tipus.toUpperCase() : undefined }),
                            include: {
                                connection: true,
                            },
                        })];
                }
            });
        });
    };
    DataSourceService.prototype.deleteDataSource = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var source;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findDataSource(id)];
                    case 1:
                        source = _a.sent();
                        return [2 /*return*/, this.prisma.dataSource.delete({
                                where: { id: id },
                            })];
                }
            });
        });
    };
    // Data Load Jobs
    DataSourceService.prototype.findAllDataLoadJobs = function () {
        return __awaiter(this, arguments, void 0, function (skip, take, filters) {
            var where, _a, total, items;
            if (skip === void 0) { skip = 0; }
            if (take === void 0) { take = 50; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        where = {};
                        if (filters === null || filters === void 0 ? void 0 : filters.dataSourceId) {
                            where.dataSourceId = filters.dataSourceId;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.allapot) {
                            where.allapot = filters.allapot;
                        }
                        return [4 /*yield*/, Promise.all([
                                this.prisma.dataLoadJob.count({ where: where }),
                                this.prisma.dataLoadJob.findMany({
                                    where: where,
                                    skip: skip,
                                    take: take,
                                    include: {
                                        dataSource: {
                                            select: {
                                                id: true,
                                                nev: true,
                                                tipus: true,
                                            },
                                        },
                                    },
                                    orderBy: {
                                        nev: 'asc',
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
    DataSourceService.prototype.findDataLoadJob = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.dataLoadJob.findUnique({
                            where: { id: id },
                            include: {
                                dataSource: true,
                            },
                        })];
                    case 1:
                        job = _a.sent();
                        if (!job) {
                            throw new common_1.NotFoundException('Adatbetöltési feladat nem található');
                        }
                        return [2 /*return*/, job];
                }
            });
        });
    };
    DataSourceService.prototype.createDataLoadJob = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var source, kovetkezoFuttatas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.dataSource.findUnique({
                            where: { id: dto.dataSourceId },
                        })];
                    case 1:
                        source = _a.sent();
                        if (!source) {
                            throw new common_1.NotFoundException('Adatforrás nem található');
                        }
                        kovetkezoFuttatas = null;
                        if (dto.schedule && dto.schedule !== 'MANUAL') {
                            // Simple cron parsing - in production use a proper cron library
                            kovetkezoFuttatas = new Date(Date.now() + 24 * 60 * 60 * 1000); // Default: tomorrow
                        }
                        return [2 /*return*/, this.prisma.dataLoadJob.create({
                                data: __assign(__assign({}, dto), { schedule: dto.schedule || 'MANUAL', kovetkezoFuttatas: kovetkezoFuttatas, allapot: dto.schedule && dto.schedule !== 'MANUAL' ? 'ACTIVE' : 'INACTIVE' }),
                                include: {
                                    dataSource: true,
                                },
                            })];
                }
            });
        });
    };
    DataSourceService.prototype.updateDataLoadJob = function (id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var job, kovetkezoFuttatas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findDataLoadJob(id)];
                    case 1:
                        job = _a.sent();
                        kovetkezoFuttatas = job.kovetkezoFuttatas;
                        if (dto.schedule && dto.schedule !== 'MANUAL' && dto.schedule !== job.schedule) {
                            kovetkezoFuttatas = new Date(Date.now() + 24 * 60 * 60 * 1000);
                        }
                        return [2 /*return*/, this.prisma.dataLoadJob.update({
                                where: { id: id },
                                data: __assign(__assign({}, dto), { kovetkezoFuttatas: kovetkezoFuttatas }),
                                include: {
                                    dataSource: true,
                                },
                            })];
                }
            });
        });
    };
    DataSourceService.prototype.deleteDataLoadJob = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findDataLoadJob(id)];
                    case 1:
                        job = _a.sent();
                        return [2 /*return*/, this.prisma.dataLoadJob.delete({
                                where: { id: id },
                            })];
                }
            });
        });
    };
    DataSourceService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], DataSourceService);
    return DataSourceService;
}());
exports.DataSourceService = DataSourceService;
