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
exports.ContractService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var ContractService = /** @class */ (function () {
    function ContractService(prisma) {
        this.prisma = prisma;
    }
    ContractService.prototype.findAll = function () {
        return __awaiter(this, arguments, void 0, function (skip, take, filters) {
            var where, _a, total, items;
            if (skip === void 0) { skip = 0; }
            if (take === void 0) { take = 50; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        where = {};
                        if (filters === null || filters === void 0 ? void 0 : filters.employeeId) {
                            where.employeeId = filters.employeeId;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.tipus) {
                            where.tipus = filters.tipus;
                        }
                        if ((filters === null || filters === void 0 ? void 0 : filters.aktiv) !== undefined) {
                            where.aktiv = filters.aktiv;
                        }
                        return [4 /*yield*/, Promise.all([
                                this.prisma.employmentContract.count({ where: where }),
                                this.prisma.employmentContract.findMany({
                                    where: where,
                                    skip: skip,
                                    take: take,
                                    include: {
                                        employee: {
                                            select: {
                                                id: true,
                                                azonosito: true,
                                                vezetekNev: true,
                                                keresztNev: true,
                                            },
                                        },
                                        amendments: {
                                            orderBy: {
                                                datum: 'desc',
                                            },
                                        },
                                        _count: {
                                            select: {
                                                amendments: true,
                                            },
                                        },
                                    },
                                    orderBy: {
                                        kezdetDatum: 'desc',
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
    ContractService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var contract;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.employmentContract.findUnique({
                            where: { id: id },
                            include: {
                                employee: true,
                                amendments: {
                                    orderBy: {
                                        datum: 'desc',
                                    },
                                },
                            },
                        })];
                    case 1:
                        contract = _a.sent();
                        if (!contract) {
                            throw new common_1.NotFoundException('Munkaszerződés nem található');
                        }
                        return [2 /*return*/, contract];
                }
            });
        });
    };
    ContractService.prototype.create = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var employee, existing, kezdetDatum, vegDatum, probaidoVege;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.employee.findUnique({
                            where: { id: dto.employeeId },
                        })];
                    case 1:
                        employee = _a.sent();
                        if (!employee) {
                            throw new common_1.NotFoundException('Dolgozó nem található');
                        }
                        return [4 /*yield*/, this.prisma.employmentContract.findUnique({
                                where: { szerzodesSzam: dto.szerzodesSzam },
                            })];
                    case 2:
                        existing = _a.sent();
                        if (existing) {
                            throw new common_1.BadRequestException('Ez a szerződésszám már használatban van');
                        }
                        kezdetDatum = new Date(dto.kezdetDatum);
                        vegDatum = dto.vegDatum ? new Date(dto.vegDatum) : null;
                        probaidoVege = dto.probaidoVege ? new Date(dto.probaidoVege) : null;
                        if (vegDatum && vegDatum < kezdetDatum) {
                            throw new common_1.BadRequestException('A végdátum nem lehet korábbi, mint a kezdetdátum');
                        }
                        if (probaidoVege && probaidoVege < kezdetDatum) {
                            throw new common_1.BadRequestException('A próbaidő vége nem lehet korábbi, mint a kezdetdátum');
                        }
                        return [2 /*return*/, this.prisma.employmentContract.create({
                                data: {
                                    employeeId: dto.employeeId,
                                    szerzodesSzam: dto.szerzodesSzam,
                                    tipus: dto.tipus,
                                    kezdetDatum: kezdetDatum,
                                    vegDatum: vegDatum,
                                    probaidoVege: probaidoVege,
                                    fizetes: dto.fizetes,
                                    munkaido: dto.munkaido,
                                    documentId: dto.documentId,
                                    aktiv: dto.aktiv !== undefined ? dto.aktiv : true,
                                    megjegyzesek: dto.megjegyzesek,
                                },
                                include: {
                                    employee: true,
                                    amendments: true,
                                },
                            })];
                }
            });
        });
    };
    ContractService.prototype.update = function (id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var contract, vegDatum, probaidoVege, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        contract = _a.sent();
                        vegDatum = dto.vegDatum ? new Date(dto.vegDatum) : undefined;
                        probaidoVege = dto.probaidoVege ? new Date(dto.probaidoVege) : undefined;
                        if (vegDatum && vegDatum < contract.kezdetDatum) {
                            throw new common_1.BadRequestException('A végdátum nem lehet korábbi, mint a kezdetdátum');
                        }
                        if (probaidoVege && probaidoVege < contract.kezdetDatum) {
                            throw new common_1.BadRequestException('A próbaidő vége nem lehet korábbi, mint a kezdetdátum');
                        }
                        if (!(dto.aktiv === true)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.prisma.employmentContract.updateMany({
                                where: { employeeId: contract.employeeId, id: { not: id } },
                                data: { aktiv: false },
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        data = __assign(__assign({}, dto), { vegDatum: dto.vegDatum ? new Date(dto.vegDatum) : undefined, probaidoVege: dto.probaidoVege ? new Date(dto.probaidoVege) : undefined });
                        return [2 /*return*/, this.prisma.employmentContract.update({
                                where: { id: id },
                                data: data,
                                include: {
                                    employee: true,
                                    amendments: {
                                        orderBy: {
                                            datum: 'desc',
                                        },
                                    },
                                },
                            })];
                }
            });
        });
    };
    ContractService.prototype.addAmendment = function (contractId, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var contract, datum, amendment, updateData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(contractId)];
                    case 1:
                        contract = _a.sent();
                        datum = new Date(dto.datum);
                        if (datum < contract.kezdetDatum) {
                            throw new common_1.BadRequestException('A módosítás dátuma nem lehet korábbi, mint a szerződés kezdetdátuma');
                        }
                        return [4 /*yield*/, this.prisma.contractAmendment.create({
                                data: {
                                    employmentContractId: contractId,
                                    datum: datum,
                                    tipus: dto.tipus,
                                    leiras: dto.leiras,
                                    ujFizetes: dto.ujFizetes,
                                    ujVegDatum: dto.ujVegDatum ? new Date(dto.ujVegDatum) : undefined,
                                    megjegyzesek: dto.megjegyzesek,
                                },
                            })];
                    case 2:
                        amendment = _a.sent();
                        updateData = {};
                        if (dto.ujFizetes !== undefined) {
                            updateData.fizetes = dto.ujFizetes;
                        }
                        if (dto.ujVegDatum) {
                            updateData.vegDatum = new Date(dto.ujVegDatum);
                        }
                        if (!(Object.keys(updateData).length > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.prisma.employmentContract.update({
                                where: { id: contractId },
                                data: updateData,
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, amendment];
                }
            });
        });
    };
    ContractService.prototype.getExpiringContracts = function () {
        return __awaiter(this, arguments, void 0, function (days) {
            var futureDate, contracts;
            if (days === void 0) { days = 30; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        futureDate = new Date();
                        futureDate.setDate(futureDate.getDate() + days);
                        return [4 /*yield*/, this.prisma.employmentContract.findMany({
                                where: {
                                    vegDatum: {
                                        not: null,
                                        lte: futureDate,
                                        gte: new Date(),
                                    },
                                },
                                include: {
                                    employee: {
                                        select: {
                                            id: true,
                                            azonosito: true,
                                            vezetekNev: true,
                                            keresztNev: true,
                                            email: true,
                                        },
                                    },
                                },
                                orderBy: {
                                    vegDatum: 'asc',
                                },
                            })];
                    case 1:
                        contracts = _a.sent();
                        return [2 /*return*/, contracts];
                }
            });
        });
    };
    ContractService.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var contract, amendmentCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        contract = _a.sent();
                        return [4 /*yield*/, this.prisma.contractAmendment.count({
                                where: { employmentContractId: id },
                            })];
                    case 2:
                        amendmentCount = _a.sent();
                        if (amendmentCount > 0) {
                            throw new common_1.BadRequestException('Nem törölhető szerződés, mert vannak hozzá tartozó módosítások');
                        }
                        return [2 /*return*/, this.prisma.employmentContract.delete({
                                where: { id: id },
                            })];
                }
            });
        });
    };
    ContractService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], ContractService);
    return ContractService;
}());
exports.ContractService = ContractService;
