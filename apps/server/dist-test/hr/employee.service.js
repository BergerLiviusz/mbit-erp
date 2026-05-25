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
exports.EmployeeService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var EmployeeService = /** @class */ (function () {
    function EmployeeService(prisma) {
        this.prisma = prisma;
    }
    EmployeeService.prototype.normalizeOptionalId = function (value) {
        if (value === undefined)
            return undefined;
        var trimmed = value.trim();
        return trimmed.length === 0 ? undefined : trimmed;
    };
    EmployeeService.prototype.findAll = function () {
        return __awaiter(this, arguments, void 0, function (skip, take, filters) {
            var where, normalized, _a, total, items;
            if (skip === void 0) { skip = 0; }
            if (take === void 0) { take = 50; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        where = {};
                        if (filters === null || filters === void 0 ? void 0 : filters.jobPositionId) {
                            normalized = this.normalizeOptionalId(filters.jobPositionId);
                            if (normalized)
                                where.jobPositionId = normalized;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.osztaly) {
                            where.osztaly = filters.osztaly;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.reszleg) {
                            where.reszleg = filters.reszleg;
                        }
                        if ((filters === null || filters === void 0 ? void 0 : filters.aktiv) !== undefined) {
                            where.aktiv = filters.aktiv;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.search) {
                            where.OR = [
                                { vezetekNev: { contains: filters.search } },
                                { keresztNev: { contains: filters.search } },
                                { azonosito: { contains: filters.search } },
                                { email: { contains: filters.search } },
                            ];
                        }
                        return [4 /*yield*/, Promise.all([
                                this.prisma.employee.count({ where: where }),
                                this.prisma.employee.findMany({
                                    where: where,
                                    skip: skip,
                                    take: take,
                                    include: {
                                        jobPosition: {
                                            select: {
                                                id: true,
                                                nev: true,
                                                azonosito: true,
                                            },
                                        },
                                        _count: {
                                            select: {
                                                educations: true,
                                                languageSkills: true,
                                                medicalExaminations: true,
                                                disciplinaryActions: true,
                                                studyContracts: true,
                                                employmentContracts: true,
                                                previousEmployments: true,
                                                awards: true,
                                            },
                                        },
                                    },
                                    orderBy: [
                                        { vezetekNev: 'asc' },
                                        { keresztNev: 'asc' },
                                    ],
                                }),
                            ])];
                    case 1:
                        _a = _b.sent(), total = _a[0], items = _a[1];
                        return [2 /*return*/, { total: total, items: items }];
                }
            });
        });
    };
    EmployeeService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var employee;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.employee.findUnique({
                            where: { id: id },
                            include: {
                                jobPosition: true,
                                educations: {
                                    orderBy: {
                                        vegzesEve: 'desc',
                                    },
                                },
                                languageSkills: {
                                    orderBy: {
                                        nyelv: 'asc',
                                    },
                                },
                                medicalExaminations: {
                                    orderBy: {
                                        vizsgalatDatuma: 'desc',
                                    },
                                },
                                disciplinaryActions: {
                                    orderBy: {
                                        datum: 'desc',
                                    },
                                },
                                studyContracts: {
                                    orderBy: {
                                        kezdetDatum: 'desc',
                                    },
                                },
                                employmentContracts: {
                                    include: {
                                        amendments: {
                                            orderBy: {
                                                datum: 'desc',
                                            },
                                        },
                                    },
                                    orderBy: {
                                        kezdetDatum: 'desc',
                                    },
                                },
                                previousEmployments: {
                                    orderBy: { kezdet: 'desc' },
                                },
                                awards: {
                                    orderBy: { datum: 'desc' },
                                },
                            },
                        })];
                    case 1:
                        employee = _a.sent();
                        if (!employee) {
                            throw new common_1.NotFoundException('Dolgoz? nem tal?lhat?');
                        }
                        return [2 /*return*/, employee];
                }
            });
        });
    };
    EmployeeService.prototype.create = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var existing, existingTaj, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.employee.findUnique({
                            where: { azonosito: dto.azonosito },
                        })];
                    case 1:
                        existing = _a.sent();
                        if (existing) {
                            throw new common_1.BadRequestException('Ez az azonos?t? m?r haszn?latban van');
                        }
                        if (!dto.tajSzam) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.prisma.employee.findUnique({
                                where: { tajSzam: dto.tajSzam },
                            })];
                    case 2:
                        existingTaj = _a.sent();
                        if (existingTaj) {
                            throw new common_1.BadRequestException('Ez a TAJ sz?m m?r haszn?latban van');
                        }
                        _a.label = 3;
                    case 3:
                        data = __assign(__assign({}, dto), { szuletesiDatum: dto.szuletesiDatum ? new Date(dto.szuletesiDatum) : undefined, munkaviszonyKezdete: dto.munkaviszonyKezdete ? new Date(dto.munkaviszonyKezdete) : undefined, munkaviszonyVege: dto.munkaviszonyVege ? new Date(dto.munkaviszonyVege) : undefined, jobPositionId: this.normalizeOptionalId(dto.jobPositionId) });
                        return [2 /*return*/, this.prisma.employee.create({
                                data: data,
                                include: {
                                    jobPosition: true,
                                },
                            })];
                }
            });
        });
    };
    EmployeeService.prototype.update = function (id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var employee, existingTaj, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        employee = _a.sent();
                        if (!(dto.tajSzam && dto.tajSzam !== employee.tajSzam)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.prisma.employee.findUnique({
                                where: { tajSzam: dto.tajSzam },
                            })];
                    case 2:
                        existingTaj = _a.sent();
                        if (existingTaj) {
                            throw new common_1.BadRequestException('Ez a TAJ sz?m m?r haszn?latban van');
                        }
                        _a.label = 3;
                    case 3:
                        data = __assign(__assign({}, dto), { szuletesiDatum: dto.szuletesiDatum ? new Date(dto.szuletesiDatum) : undefined, munkaviszonyKezdete: dto.munkaviszonyKezdete ? new Date(dto.munkaviszonyKezdete) : undefined, munkaviszonyVege: dto.munkaviszonyVege ? new Date(dto.munkaviszonyVege) : undefined, jobPositionId: dto.jobPositionId !== undefined ? this.normalizeOptionalId(dto.jobPositionId) : undefined });
                        return [2 /*return*/, this.prisma.employee.update({
                                where: { id: id },
                                data: data,
                                include: {
                                    jobPosition: true,
                                },
                            })];
                }
            });
        });
    };
    EmployeeService.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var employee;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        employee = _a.sent();
                        return [2 /*return*/, this.prisma.employee.delete({
                                where: { id: id },
                            })];
                }
            });
        });
    };
    EmployeeService.prototype.createPreviousEmployment = function (employeeId, dto) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(employeeId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.prisma.previousEmployment.create({
                                data: {
                                    employeeId: employeeId,
                                    munkaadoNev: dto.munkaadoNev,
                                    munkakor: dto.munkakor,
                                    kezdet: dto.kezdet ? new Date(dto.kezdet) : undefined,
                                    veg: dto.veg ? new Date(dto.veg) : undefined,
                                    megjegyzes: dto.megjegyzes,
                                },
                            })];
                }
            });
        });
    };
    EmployeeService.prototype.updatePreviousEmployment = function (id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.previousEmployment.findUnique({ where: { id: id } })];
                    case 1:
                        row = _a.sent();
                        if (!row)
                            throw new common_1.NotFoundException('Kor?bbi munkahely nem tal?lhat?');
                        return [2 /*return*/, this.prisma.previousEmployment.update({
                                where: { id: id },
                                data: {
                                    munkaadoNev: dto.munkaadoNev,
                                    munkakor: dto.munkakor,
                                    kezdet: dto.kezdet !== undefined ? (dto.kezdet ? new Date(dto.kezdet) : null) : undefined,
                                    veg: dto.veg !== undefined ? (dto.veg ? new Date(dto.veg) : null) : undefined,
                                    megjegyzes: dto.megjegyzes,
                                },
                            })];
                }
            });
        });
    };
    EmployeeService.prototype.deletePreviousEmployment = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.previousEmployment.findUnique({ where: { id: id } })];
                    case 1:
                        row = _a.sent();
                        if (!row)
                            throw new common_1.NotFoundException('Kor?bbi munkahely nem tal?lhat?');
                        return [2 /*return*/, this.prisma.previousEmployment.delete({ where: { id: id } })];
                }
            });
        });
    };
    EmployeeService.prototype.createAward = function (employeeId, dto) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(employeeId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.prisma.employeeAward.create({
                                data: {
                                    employeeId: employeeId,
                                    megnevezes: dto.megnevezes,
                                    datum: new Date(dto.datum),
                                    intezmeny: dto.intezmeny,
                                    megjegyzes: dto.megjegyzes,
                                },
                            })];
                }
            });
        });
    };
    EmployeeService.prototype.updateAward = function (id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.employeeAward.findUnique({ where: { id: id } })];
                    case 1:
                        row = _a.sent();
                        if (!row)
                            throw new common_1.NotFoundException('Kit?ntet?s nem tal?lhat?');
                        return [2 /*return*/, this.prisma.employeeAward.update({
                                where: { id: id },
                                data: {
                                    megnevezes: dto.megnevezes,
                                    datum: dto.datum ? new Date(dto.datum) : undefined,
                                    intezmeny: dto.intezmeny,
                                    megjegyzes: dto.megjegyzes,
                                },
                            })];
                }
            });
        });
    };
    EmployeeService.prototype.deleteAward = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.employeeAward.findUnique({ where: { id: id } })];
                    case 1:
                        row = _a.sent();
                        if (!row)
                            throw new common_1.NotFoundException('Kit?ntet?s nem tal?lhat?');
                        return [2 /*return*/, this.prisma.employeeAward.delete({ where: { id: id } })];
                }
            });
        });
    };
    EmployeeService.prototype.createEducation = function (employeeId, dto) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(employeeId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.prisma.education.create({
                                data: {
                                    employeeId: employeeId,
                                    tipus: String(dto.tipus || ''),
                                    iskolaNev: String(dto.iskolaNev || ''),
                                    szak: dto.szak,
                                    vegzesEve: dto.vegzesEve ? Number(dto.vegzesEve) : undefined,
                                    megjegyzesek: dto.megjegyzesek,
                                },
                            })];
                }
            });
        });
    };
    EmployeeService.prototype.updateEducation = function (id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.education.findUnique({ where: { id: id } })];
                    case 1:
                        row = _a.sent();
                        if (!row)
                            throw new common_1.NotFoundException('Végzettség nem található');
                        return [2 /*return*/, this.prisma.education.update({
                                where: { id: id },
                                data: {
                                    tipus: dto.tipus,
                                    iskolaNev: dto.iskolaNev,
                                    szak: dto.szak,
                                    vegzesEve: dto.vegzesEve !== undefined ? Number(dto.vegzesEve) : undefined,
                                    megjegyzesek: dto.megjegyzesek,
                                },
                            })];
                }
            });
        });
    };
    EmployeeService.prototype.deleteEducation = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.education.findUnique({ where: { id: id } })];
                    case 1:
                        row = _a.sent();
                        if (!row)
                            throw new common_1.NotFoundException('Végzettség nem található');
                        return [2 /*return*/, this.prisma.education.delete({ where: { id: id } })];
                }
            });
        });
    };
    EmployeeService.prototype.createLanguageSkill = function (employeeId, dto) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(employeeId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.prisma.languageSkill.create({
                                data: {
                                    employeeId: employeeId,
                                    nyelv: String(dto.nyelv || ''),
                                    szint: String(dto.szint || ''),
                                    nyelvvizsga: dto.nyelvvizsga,
                                    megjegyzesek: dto.megjegyzesek,
                                },
                            })];
                }
            });
        });
    };
    EmployeeService.prototype.updateLanguageSkill = function (id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.languageSkill.findUnique({ where: { id: id } })];
                    case 1:
                        row = _a.sent();
                        if (!row)
                            throw new common_1.NotFoundException('Nyelvtudás nem található');
                        return [2 /*return*/, this.prisma.languageSkill.update({
                                where: { id: id },
                                data: {
                                    nyelv: dto.nyelv,
                                    szint: dto.szint,
                                    nyelvvizsga: dto.nyelvvizsga,
                                    megjegyzesek: dto.megjegyzesek,
                                },
                            })];
                }
            });
        });
    };
    EmployeeService.prototype.deleteLanguageSkill = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.languageSkill.findUnique({ where: { id: id } })];
                    case 1:
                        row = _a.sent();
                        if (!row)
                            throw new common_1.NotFoundException('Nyelvtudás nem található');
                        return [2 /*return*/, this.prisma.languageSkill.delete({ where: { id: id } })];
                }
            });
        });
    };
    EmployeeService.prototype.createMedicalExamination = function (employeeId, dto) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(employeeId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.prisma.medicalExamination.create({
                                data: {
                                    employeeId: employeeId,
                                    vizsgalatTipusa: String(dto.vizsgalatTipusa || ''),
                                    vizsgalatDatuma: new Date(String(dto.vizsgalatDatuma)),
                                    ervenyessegVege: dto.ervenyessegVege
                                        ? new Date(String(dto.ervenyessegVege))
                                        : undefined,
                                    eredmeny: dto.eredmeny,
                                    megjegyzesek: dto.megjegyzesek,
                                },
                            })];
                }
            });
        });
    };
    EmployeeService.prototype.updateMedicalExamination = function (id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.medicalExamination.findUnique({ where: { id: id } })];
                    case 1:
                        row = _a.sent();
                        if (!row)
                            throw new common_1.NotFoundException('Orvosi vizsgálat nem található');
                        return [2 /*return*/, this.prisma.medicalExamination.update({
                                where: { id: id },
                                data: {
                                    vizsgalatTipusa: dto.vizsgalatTipusa,
                                    vizsgalatDatuma: dto.vizsgalatDatuma
                                        ? new Date(String(dto.vizsgalatDatuma))
                                        : undefined,
                                    ervenyessegVege: dto.ervenyessegVege !== undefined
                                        ? dto.ervenyessegVege
                                            ? new Date(String(dto.ervenyessegVege))
                                            : null
                                        : undefined,
                                    eredmeny: dto.eredmeny,
                                    megjegyzesek: dto.megjegyzesek,
                                },
                            })];
                }
            });
        });
    };
    EmployeeService.prototype.deleteMedicalExamination = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.medicalExamination.findUnique({ where: { id: id } })];
                    case 1:
                        row = _a.sent();
                        if (!row)
                            throw new common_1.NotFoundException('Orvosi vizsgálat nem található');
                        return [2 /*return*/, this.prisma.medicalExamination.delete({ where: { id: id } })];
                }
            });
        });
    };
    EmployeeService.prototype.createDisciplinaryAction = function (employeeId, dto) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(employeeId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.prisma.disciplinaryAction.create({
                                data: {
                                    employeeId: employeeId,
                                    datum: new Date(String(dto.datum)),
                                    tipus: String(dto.tipus || ''),
                                    indok: String(dto.indok || ''),
                                    hatarozatSzam: dto.hatarozatSzam,
                                    megjegyzesek: dto.megjegyzesek,
                                },
                            })];
                }
            });
        });
    };
    EmployeeService.prototype.updateDisciplinaryAction = function (id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.disciplinaryAction.findUnique({ where: { id: id } })];
                    case 1:
                        row = _a.sent();
                        if (!row)
                            throw new common_1.NotFoundException('Fegyelmi elem nem található');
                        return [2 /*return*/, this.prisma.disciplinaryAction.update({
                                where: { id: id },
                                data: {
                                    datum: dto.datum ? new Date(String(dto.datum)) : undefined,
                                    tipus: dto.tipus,
                                    indok: dto.indok,
                                    hatarozatSzam: dto.hatarozatSzam,
                                    megjegyzesek: dto.megjegyzesek,
                                },
                            })];
                }
            });
        });
    };
    EmployeeService.prototype.deleteDisciplinaryAction = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.disciplinaryAction.findUnique({ where: { id: id } })];
                    case 1:
                        row = _a.sent();
                        if (!row)
                            throw new common_1.NotFoundException('Fegyelmi elem nem található');
                        return [2 /*return*/, this.prisma.disciplinaryAction.delete({ where: { id: id } })];
                }
            });
        });
    };
    EmployeeService.prototype.createStudyContract = function (employeeId, dto) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(employeeId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.prisma.studyContract.create({
                                data: {
                                    employeeId: employeeId,
                                    szerzodesSzam: String(dto.szerzodesSzam || ''),
                                    kezdetDatum: new Date(String(dto.kezdetDatum)),
                                    vegDatum: dto.vegDatum ? new Date(String(dto.vegDatum)) : undefined,
                                    tanulmanyiIntezmeny: String(dto.tanulmanyiIntezmeny || ''),
                                    szak: dto.szak,
                                    koltseg: dto.koltseg ? Number(dto.koltseg) : undefined,
                                    visszafizetesiKotelezettseg: Boolean(dto.visszafizetesiKotelezettseg),
                                    megjegyzesek: dto.megjegyzesek,
                                },
                            })];
                }
            });
        });
    };
    EmployeeService.prototype.updateStudyContract = function (id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.studyContract.findUnique({ where: { id: id } })];
                    case 1:
                        row = _a.sent();
                        if (!row)
                            throw new common_1.NotFoundException('Tanulmányi szerződés nem található');
                        return [2 /*return*/, this.prisma.studyContract.update({
                                where: { id: id },
                                data: {
                                    szerzodesSzam: dto.szerzodesSzam,
                                    kezdetDatum: dto.kezdetDatum ? new Date(String(dto.kezdetDatum)) : undefined,
                                    vegDatum: dto.vegDatum !== undefined
                                        ? dto.vegDatum
                                            ? new Date(String(dto.vegDatum))
                                            : null
                                        : undefined,
                                    tanulmanyiIntezmeny: dto.tanulmanyiIntezmeny,
                                    szak: dto.szak,
                                    koltseg: dto.koltseg !== undefined ? Number(dto.koltseg) : undefined,
                                    visszafizetesiKotelezettseg: dto.visszafizetesiKotelezettseg,
                                    megjegyzesek: dto.megjegyzesek,
                                },
                            })];
                }
            });
        });
    };
    EmployeeService.prototype.deleteStudyContract = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.studyContract.findUnique({ where: { id: id } })];
                    case 1:
                        row = _a.sent();
                        if (!row)
                            throw new common_1.NotFoundException('Tanulmányi szerződés nem található');
                        return [2 /*return*/, this.prisma.studyContract.delete({ where: { id: id } })];
                }
            });
        });
    };
    EmployeeService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], EmployeeService);
    return EmployeeService;
}());
exports.EmployeeService = EmployeeService;
