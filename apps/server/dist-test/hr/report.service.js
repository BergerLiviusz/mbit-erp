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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HrReportService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var ExcelJS = __importStar(require("exceljs"));
var HrReportService = /** @class */ (function () {
    function HrReportService(prisma) {
        this.prisma = prisma;
        /** Első sor a generált TXT riportokban: emlékeztető, hogy nem helyettesíti a hatósági formátumot. */
        this.statutoryExportNote = 'MBIT_SPEC_MEGJEGYZES:Belső strukturált összesítő export. A tényleges NAV/KSH bevallási fájlforma és mezők egyeztetése a bérszámfejtővel / hatósági előírásokkal szükséges.';
    }
    HrReportService.prototype.generateNavPayrollReport = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var where, employees, lines, _i, employees_1, employee, contract, line;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        where = {
                            aktiv: true,
                        };
                        if (dto.employeeIds && dto.employeeIds.length > 0) {
                            where.id = { in: dto.employeeIds };
                        }
                        return [4 /*yield*/, this.prisma.employee.findMany({
                                where: where,
                                include: {
                                    jobPosition: true,
                                    employmentContracts: {
                                        where: {
                                            kezdetDatum: {
                                                lte: new Date(dto.ev, dto.honap - 1, 31),
                                            },
                                            OR: [
                                                { vegDatum: null },
                                                { vegDatum: { gte: new Date(dto.ev, dto.honap - 1, 1) } },
                                            ],
                                        },
                                    },
                                },
                            })];
                    case 1:
                        employees = _b.sent();
                        lines = [];
                        lines.push(this.statutoryExportNote);
                        lines.push('NAV_BERKIFIZETESI_JEGYZEK');
                        lines.push("EV:".concat(dto.ev));
                        lines.push("HONAP:".concat(dto.honap));
                        lines.push("");
                        lines.push('TETELEK:');
                        for (_i = 0, employees_1 = employees; _i < employees_1.length; _i++) {
                            employee = employees_1[_i];
                            contract = employee.employmentContracts[0];
                            if (!contract)
                                continue;
                            line = [
                                employee.azonosito,
                                employee.vezetekNev,
                                employee.keresztNev,
                                employee.tajSzam || '',
                                contract.szerzodesSzam,
                                ((_a = contract.fizetes) === null || _a === void 0 ? void 0 : _a.toFixed(2)) || '0.00',
                                dto.ev.toString(),
                                String(dto.honap).padStart(2, '0'),
                            ].join('|');
                            lines.push(line);
                        }
                        return [2 /*return*/, lines.join('\n')];
                }
            });
        });
    };
    HrReportService.prototype.generateNavTaxReport = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var startDate, endDate, employees, lines, totalTax, _i, employees_2, employee, contract, annualSalary, tax, line;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startDate = dto.quarter
                            ? new Date(dto.ev, (dto.quarter - 1) * 3, 1)
                            : new Date(dto.ev, 0, 1);
                        endDate = dto.quarter
                            ? new Date(dto.ev, dto.quarter * 3, 0)
                            : new Date(dto.ev, 11, 31);
                        return [4 /*yield*/, this.prisma.employee.findMany({
                                where: {
                                    aktiv: true,
                                    munkaviszonyKezdete: {
                                        lte: endDate,
                                    },
                                    OR: [
                                        { munkaviszonyVege: null },
                                        { munkaviszonyVege: { gte: startDate } },
                                    ],
                                },
                                include: {
                                    employmentContracts: {
                                        where: {
                                            kezdetDatum: {
                                                lte: endDate,
                                            },
                                            OR: [
                                                { vegDatum: null },
                                                { vegDatum: { gte: startDate } },
                                            ],
                                        },
                                    },
                                },
                            })];
                    case 1:
                        employees = _a.sent();
                        lines = [];
                        lines.push(this.statutoryExportNote);
                        lines.push('NAV_SZJA_BEVALLAS');
                        lines.push("EV:".concat(dto.ev));
                        if (dto.quarter) {
                            lines.push("NEGYEDEV:".concat(dto.quarter));
                        }
                        lines.push("");
                        lines.push('TETELEK:');
                        totalTax = 0;
                        for (_i = 0, employees_2 = employees; _i < employees_2.length; _i++) {
                            employee = employees_2[_i];
                            contract = employee.employmentContracts[0];
                            if (!contract || !contract.fizetes)
                                continue;
                            annualSalary = contract.fizetes * 12;
                            tax = annualSalary * 0.15;
                            totalTax += tax;
                            line = [
                                employee.azonosito,
                                employee.vezetekNev,
                                employee.keresztNev,
                                employee.tajSzam || '',
                                annualSalary.toFixed(2),
                                tax.toFixed(2),
                            ].join('|');
                            lines.push(line);
                        }
                        lines.push("");
                        lines.push("OSSZES_ADO:".concat(totalTax.toFixed(2)));
                        return [2 /*return*/, lines.join('\n')];
                }
            });
        });
    };
    HrReportService.prototype.generateKshEmploymentReport = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var startDate, endDate, employees, lines, byJobPosition, byDepartment, byType, _i, employees_3, employee, jobPosition, department, type, _a, _b, _c, jobPosition, count, _d, _e, _f, department, count, _g, _h, _j, type, count;
            var _k;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0:
                        startDate = dto.honap
                            ? new Date(dto.ev, dto.honap - 1, 1)
                            : new Date(dto.ev, 0, 1);
                        endDate = dto.honap
                            ? new Date(dto.ev, dto.honap, 0)
                            : new Date(dto.ev, 11, 31);
                        return [4 /*yield*/, this.prisma.employee.findMany({
                                where: {
                                    aktiv: true,
                                    munkaviszonyKezdete: {
                                        lte: endDate,
                                    },
                                    OR: [
                                        { munkaviszonyVege: null },
                                        { munkaviszonyVege: { gte: startDate } },
                                    ],
                                },
                                include: {
                                    jobPosition: true,
                                },
                            })];
                    case 1:
                        employees = _l.sent();
                        lines = [];
                        lines.push(this.statutoryExportNote);
                        lines.push('KSH_FOGLALKOZATOTTI_STATISZTIKA');
                        lines.push("EV:".concat(dto.ev));
                        if (dto.honap) {
                            lines.push("HONAP:".concat(dto.honap));
                        }
                        lines.push("");
                        byJobPosition = {};
                        byDepartment = {};
                        byType = {};
                        for (_i = 0, employees_3 = employees; _i < employees_3.length; _i++) {
                            employee = employees_3[_i];
                            jobPosition = ((_k = employee.jobPosition) === null || _k === void 0 ? void 0 : _k.nev) || 'Nincs munkakör';
                            byJobPosition[jobPosition] = (byJobPosition[jobPosition] || 0) + 1;
                            department = employee.reszleg || employee.osztaly || 'Nincs részleg';
                            byDepartment[department] = (byDepartment[department] || 0) + 1;
                            type = employee.munkaviszonyTipusa || 'Nincs típus';
                            byType[type] = (byType[type] || 0) + 1;
                        }
                        lines.push('MUNKAKOR_SZERINT:');
                        for (_a = 0, _b = Object.entries(byJobPosition); _a < _b.length; _a++) {
                            _c = _b[_a], jobPosition = _c[0], count = _c[1];
                            lines.push("".concat(jobPosition, "|").concat(count));
                        }
                        lines.push("");
                        lines.push('RESZLEG_SZERINT:');
                        for (_d = 0, _e = Object.entries(byDepartment); _d < _e.length; _d++) {
                            _f = _e[_d], department = _f[0], count = _f[1];
                            lines.push("".concat(department, "|").concat(count));
                        }
                        lines.push("");
                        lines.push('TIPUS_SZERINT:');
                        for (_g = 0, _h = Object.entries(byType); _g < _h.length; _g++) {
                            _j = _h[_g], type = _j[0], count = _j[1];
                            lines.push("".concat(type, "|").concat(count));
                        }
                        lines.push("");
                        lines.push("OSSZESEN:".concat(employees.length));
                        return [2 /*return*/, lines.join('\n')];
                }
            });
        });
    };
    HrReportService.prototype.generateKshWageReport = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var startDate, endDate, employees, lines, totalWage, count, _i, employees_4, employee, contract, line;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        startDate = dto.honap
                            ? new Date(dto.ev, dto.honap - 1, 1)
                            : new Date(dto.ev, 0, 1);
                        endDate = dto.honap
                            ? new Date(dto.ev, dto.honap, 0)
                            : new Date(dto.ev, 11, 31);
                        return [4 /*yield*/, this.prisma.employee.findMany({
                                where: {
                                    aktiv: true,
                                    munkaviszonyKezdete: {
                                        lte: endDate,
                                    },
                                    OR: [
                                        { munkaviszonyVege: null },
                                        { munkaviszonyVege: { gte: startDate } },
                                    ],
                                },
                                include: {
                                    employmentContracts: {
                                        where: {
                                            kezdetDatum: {
                                                lte: endDate,
                                            },
                                            OR: [
                                                { vegDatum: null },
                                                { vegDatum: { gte: startDate } },
                                            ],
                                        },
                                    },
                                    jobPosition: true,
                                },
                            })];
                    case 1:
                        employees = _b.sent();
                        lines = [];
                        lines.push(this.statutoryExportNote);
                        lines.push('KSH_BERSTATISZTIKA');
                        lines.push("EV:".concat(dto.ev));
                        if (dto.honap) {
                            lines.push("HONAP:".concat(dto.honap));
                        }
                        lines.push("");
                        totalWage = 0;
                        count = 0;
                        lines.push('TETELEK:');
                        for (_i = 0, employees_4 = employees; _i < employees_4.length; _i++) {
                            employee = employees_4[_i];
                            contract = employee.employmentContracts[0];
                            if (!contract || !contract.fizetes)
                                continue;
                            totalWage += contract.fizetes;
                            count++;
                            line = [
                                employee.azonosito,
                                employee.vezetekNev,
                                employee.keresztNev,
                                ((_a = employee.jobPosition) === null || _a === void 0 ? void 0 : _a.nev) || '',
                                contract.fizetes.toFixed(2),
                            ].join('|');
                            lines.push(line);
                        }
                        lines.push("");
                        lines.push("OSSZES_BER:".concat(totalWage.toFixed(2)));
                        lines.push("ATLAG_BER:".concat(count > 0 ? (totalWage / count).toFixed(2) : '0.00'));
                        lines.push("DOLGOZO_SZAM:".concat(count));
                        return [2 /*return*/, lines.join('\n')];
                }
            });
        });
    };
    HrReportService.prototype.generateKshContractReport = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var startDate, endDate, contracts, lines, byType, totalContracts, _i, contracts_1, contract, _a, _b, _c, type, count;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        startDate = dto.honap
                            ? new Date(dto.ev, dto.honap - 1, 1)
                            : new Date(dto.ev, 0, 1);
                        endDate = dto.honap
                            ? new Date(dto.ev, dto.honap, 0)
                            : new Date(dto.ev, 11, 31);
                        return [4 /*yield*/, this.prisma.employmentContract.findMany({
                                where: {
                                    kezdetDatum: {
                                        lte: endDate,
                                    },
                                    OR: [
                                        { vegDatum: null },
                                        { vegDatum: { gte: startDate } },
                                    ],
                                },
                                include: {
                                    employee: true,
                                },
                            })];
                    case 1:
                        contracts = _d.sent();
                        lines = [];
                        lines.push(this.statutoryExportNote);
                        lines.push('KSH_SZERZODES_STATISZTIKA');
                        lines.push("EV:".concat(dto.ev));
                        if (dto.honap) {
                            lines.push("HONAP:".concat(dto.honap));
                        }
                        lines.push("");
                        byType = {};
                        totalContracts = 0;
                        for (_i = 0, contracts_1 = contracts; _i < contracts_1.length; _i++) {
                            contract = contracts_1[_i];
                            byType[contract.tipus] = (byType[contract.tipus] || 0) + 1;
                            totalContracts++;
                        }
                        lines.push('TIPUS_SZERINT:');
                        for (_a = 0, _b = Object.entries(byType); _a < _b.length; _a++) {
                            _c = _b[_a], type = _c[0], count = _c[1];
                            lines.push("".concat(type, "|").concat(count));
                        }
                        lines.push("");
                        lines.push("OSSZES_SZERZODES:".concat(totalContracts));
                        return [2 /*return*/, lines.join('\n')];
                }
            });
        });
    };
    /** Cafeteria választások CSV – bérszámfejtő interfészhez (partner egyeztetés szerint bővíthető) */
    HrReportService.prototype.generateCafeteriaPayrollExport = function (ev) {
        return __awaiter(this, void 0, void 0, function () {
            var rows, header, lines, _i, rows_1, r;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.prisma.employeeCafeteriaSelection.findMany({
                            where: { ev: ev },
                            include: {
                                employee: { select: { azonosito: true, vezetekNev: true, keresztNev: true, tajSzam: true } },
                                benefitItem: { select: { nev: true, kod: true, group: { select: { nev: true } } } },
                            },
                        })];
                    case 1:
                        rows = _b.sent();
                        header = ['azonosito', 'vezetek', 'kereszt', 'taj', 'juttatas_csoport', 'juttatas', 'partner_kod', 'ev', 'darab'].join(';');
                        lines = [header];
                        for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                            r = rows_1[_i];
                            lines.push([
                                r.employee.azonosito,
                                r.employee.vezetekNev,
                                r.employee.keresztNev,
                                r.employee.tajSzam || '',
                                ((_a = r.benefitItem.group) === null || _a === void 0 ? void 0 : _a.nev) || '',
                                r.benefitItem.nev,
                                r.benefitItem.kod || '',
                                String(r.ev),
                                String(r.darab),
                            ].join(';'));
                        }
                        return [2 /*return*/, lines.join('\n')];
                }
            });
        });
    };
    /** Munkaidő összesítő CSV hónapra – bérszámfejtő export */
    HrReportService.prototype.generateTimePayrollExport = function (ev, honap) {
        return __awaiter(this, void 0, void 0, function () {
            var start, end, entries, sums, _i, entries_1, e, k, s, header, out, _a, sums_1, _b, s, ossz;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        start = new Date(ev, honap - 1, 1);
                        end = new Date(ev, honap, 0, 23, 59, 59);
                        return [4 /*yield*/, this.prisma.timeEntry.findMany({
                                where: { datum: { gte: start, lte: end } },
                                include: {
                                    employee: { select: { azonosito: true, vezetekNev: true, keresztNev: true, tajSzam: true } },
                                },
                            })];
                    case 1:
                        entries = _c.sent();
                        sums = new Map();
                        for (_i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                            e = entries_1[_i];
                            k = e.employeeId;
                            if (!sums.has(k)) {
                                sums.set(k, { employee: e.employee, normal: 0, tulora: 0, egyeb: 0 });
                            }
                            s = sums.get(k);
                            if (e.tipus === 'TULORA')
                                s.tulora += e.ora;
                            else if (e.tipus === 'KIEGESZITO')
                                s.egyeb += e.ora;
                            else
                                s.normal += e.ora;
                        }
                        header = ['azonosito', 'vezetek', 'kereszt', 'taj', 'ev', 'honap', 'normal_ora', 'tulora', 'egyeb_ora', 'osszes_ora'].join(';');
                        out = [header];
                        for (_a = 0, sums_1 = sums; _a < sums_1.length; _a++) {
                            _b = sums_1[_a], s = _b[1];
                            ossz = s.normal + s.tulora + s.egyeb;
                            out.push([
                                s.employee.azonosito,
                                s.employee.vezetekNev,
                                s.employee.keresztNev,
                                s.employee.tajSzam || '',
                                String(ev),
                                String(honap),
                                s.normal.toFixed(2),
                                s.tulora.toFixed(2),
                                s.egyeb.toFixed(2),
                                ossz.toFixed(2),
                            ].join(';'));
                        }
                        return [2 /*return*/, out.join('\n')];
                }
            });
        });
    };
    /** Távollét riport (elemzés) – CSV */
    HrReportService.prototype.generateLeaveAnalyticsExport = function (evFrom, evTo) {
        return __awaiter(this, void 0, void 0, function () {
            var start, end, rows, header, lines, _i, rows_2, r, nev, appr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        start = new Date(evFrom, 0, 1);
                        end = evTo ? new Date(evTo, 11, 31, 23, 59, 59) : new Date(evFrom, 11, 31, 23, 59, 59);
                        return [4 /*yield*/, this.prisma.leaveRequest.findMany({
                                where: {
                                    kezdet: { lte: end },
                                    veg: { gte: start },
                                },
                                include: {
                                    employee: { select: { azonosito: true, vezetekNev: true, keresztNev: true } },
                                    approvals: { orderBy: { sorrend: 'asc' } },
                                },
                                orderBy: { createdAt: 'desc' },
                            })];
                    case 1:
                        rows = _a.sent();
                        header = ['azonosito', 'nev', 'tipus', 'kezdet', 'veg', 'allapot', 'jovahagyasi_lepesek'].join(';');
                        lines = [header];
                        for (_i = 0, rows_2 = rows; _i < rows_2.length; _i++) {
                            r = rows_2[_i];
                            nev = "".concat(r.employee.vezetekNev, " ").concat(r.employee.keresztNev);
                            appr = r.approvals.map(function (a) { return "".concat(a.sorrend, ":").concat(a.allapot); }).join('|');
                            lines.push([r.employee.azonosito, nev, r.tipus, r.kezdet.toISOString(), r.veg.toISOString(), r.allapot, appr].join(';'));
                        }
                        return [2 /*return*/, lines.join('\n')];
                }
            });
        });
    };
    HrReportService.prototype.formatExport = function (headers, rows, format, baseName) {
        if (format === 'csv') {
            var escape_1 = function (v) {
                return "\"".concat((v !== null && v !== void 0 ? v : '').toString().replace(/"/g, '""'), "\"");
            };
            var lines = __spreadArray([
                headers.map(escape_1).join(';')
            ], rows.map(function (r) { return r.map(escape_1).join(';'); }), true);
            return Promise.resolve({
                contentType: 'text/csv; charset=utf-8',
                body: '\ufeff' + lines.join('\n'),
                filename: "".concat(baseName, ".csv"),
            });
        }
        var workbook = new ExcelJS.Workbook();
        var sheet = workbook.addWorksheet('Riport');
        sheet.addRow(headers);
        rows.forEach(function (r) { return sheet.addRow(r); });
        return workbook.xlsx.writeBuffer().then(function (buffer) { return ({
            contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            body: Buffer.from(buffer),
            filename: "".concat(baseName, ".xlsx"),
        }); });
    };
    HrReportService.prototype.employeeWhere = function (filters) {
        var where = {};
        if (filters === null || filters === void 0 ? void 0 : filters.jobPositionId)
            where.jobPositionId = filters.jobPositionId;
        if (filters === null || filters === void 0 ? void 0 : filters.osztaly)
            where.osztaly = filters.osztaly;
        if ((filters === null || filters === void 0 ? void 0 : filters.aktiv) === 'true')
            where.aktiv = true;
        if ((filters === null || filters === void 0 ? void 0 : filters.aktiv) === 'false')
            where.aktiv = false;
        if (filters === null || filters === void 0 ? void 0 : filters.allapot)
            where.allapot = filters.allapot;
        return where;
    };
    HrReportService.prototype.exportEmployeeMaster = function (format, filters) {
        return __awaiter(this, void 0, void 0, function () {
            var employees, headers, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.employee.findMany({
                            where: this.employeeWhere(filters),
                            include: { jobPosition: true },
                            orderBy: [{ vezetekNev: 'asc' }, { keresztNev: 'asc' }],
                        })];
                    case 1:
                        employees = _a.sent();
                        headers = [
                            'Azonosító',
                            'Vezetéknév',
                            'Keresztnév',
                            'TAJ',
                            'Adószám',
                            'Email',
                            'Állapot',
                            'Munkakör',
                            'Osztály',
                            'Részleg',
                            'Jogviszony kezdete',
                            'Jogviszony vége',
                        ];
                        rows = employees.map(function (e) {
                            var _a, _b, _c;
                            return [
                                e.azonosito,
                                e.vezetekNev,
                                e.keresztNev,
                                e.tajSzam,
                                e.adoszam,
                                e.email,
                                e.allapot,
                                (_a = e.jobPosition) === null || _a === void 0 ? void 0 : _a.nev,
                                e.osztaly,
                                e.reszleg,
                                (_b = e.munkaviszonyKezdete) === null || _b === void 0 ? void 0 : _b.toISOString().split('T')[0],
                                (_c = e.munkaviszonyVege) === null || _c === void 0 ? void 0 : _c.toISOString().split('T')[0],
                            ];
                        });
                        return [2 /*return*/, this.formatExport(headers, rows, format, 'dolgozoi_torzslista')];
                }
            });
        });
    };
    HrReportService.prototype.exportEmploymentRelations = function (format, filters) {
        return __awaiter(this, void 0, void 0, function () {
            var employees, headers, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.employee.findMany({
                            where: this.employeeWhere(filters),
                            include: { jobPosition: true },
                            orderBy: { munkaviszonyKezdete: 'desc' },
                        })];
                    case 1:
                        employees = _a.sent();
                        headers = [
                            'Azonosító',
                            'Név',
                            'Jogviszony típusa',
                            'Kezdet',
                            'Vége',
                            'Besorolás',
                            'Munkaidő',
                            'Munkakör',
                            'Állapot',
                        ];
                        rows = employees.map(function (e) {
                            var _a, _b, _c;
                            return [
                                e.azonosito,
                                "".concat(e.vezetekNev, " ").concat(e.keresztNev),
                                e.munkaviszonyTipusa,
                                (_a = e.munkaviszonyKezdete) === null || _a === void 0 ? void 0 : _a.toISOString().split('T')[0],
                                (_b = e.munkaviszonyVege) === null || _b === void 0 ? void 0 : _b.toISOString().split('T')[0],
                                e.besorolas,
                                e.munkaido,
                                (_c = e.jobPosition) === null || _c === void 0 ? void 0 : _c.nev,
                                e.allapot,
                            ];
                        });
                        return [2 /*return*/, this.formatExport(headers, rows, format, 'jogviszony_lista')];
                }
            });
        });
    };
    HrReportService.prototype.exportJobPositions = function (format) {
        return __awaiter(this, void 0, void 0, function () {
            var positions, headers, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.jobPosition.findMany({
                            include: { _count: { select: { employees: true } } },
                            orderBy: { nev: 'asc' },
                        })];
                    case 1:
                        positions = _a.sent();
                        headers = ['Azonosító', 'Név', 'Osztály', 'Részleg', 'Aktív', 'Dolgozók száma'];
                        rows = positions.map(function (p) { return [
                            p.azonosito,
                            p.nev,
                            p.osztaly,
                            p.reszleg,
                            p.aktiv ? 'Igen' : 'Nem',
                            p._count.employees,
                        ]; });
                        return [2 /*return*/, this.formatExport(headers, rows, format, 'munkakor_lista')];
                }
            });
        });
    };
    HrReportService.prototype.exportMedicalExpiry = function (format_1) {
        return __awaiter(this, arguments, void 0, function (format, withinDays) {
            var limit, exams, headers, rows;
            if (withinDays === void 0) { withinDays = 90; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        limit = new Date();
                        limit.setDate(limit.getDate() + withinDays);
                        return [4 /*yield*/, this.prisma.medicalExamination.findMany({
                                where: {
                                    ervenyessegVege: { lte: limit },
                                },
                                include: {
                                    employee: { select: { azonosito: true, vezetekNev: true, keresztNev: true } },
                                },
                                orderBy: { ervenyessegVege: 'asc' },
                            })];
                    case 1:
                        exams = _a.sent();
                        headers = [
                            'Dolgozó',
                            'Azonosító',
                            'Vizsgálat típusa',
                            'Vizsgálat dátuma',
                            'Érvényesség vége',
                            'Eredmény',
                        ];
                        rows = exams.map(function (x) {
                            var _a;
                            return [
                                "".concat(x.employee.vezetekNev, " ").concat(x.employee.keresztNev),
                                x.employee.azonosito,
                                x.vizsgalatTipusa,
                                x.vizsgalatDatuma.toISOString().split('T')[0],
                                (_a = x.ervenyessegVege) === null || _a === void 0 ? void 0 : _a.toISOString().split('T')[0],
                                x.eredmeny,
                            ];
                        });
                        return [2 /*return*/, this.formatExport(headers, rows, format, 'orvosi_vizsgalat_lejarat')];
                }
            });
        });
    };
    HrReportService.prototype.exportContractAmendments = function (format) {
        return __awaiter(this, void 0, void 0, function () {
            var amendments, headers, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.contractAmendment.findMany({
                            include: {
                                employmentContract: {
                                    include: {
                                        employee: { select: { azonosito: true, vezetekNev: true, keresztNev: true } },
                                    },
                                },
                            },
                            orderBy: { datum: 'desc' },
                        })];
                    case 1:
                        amendments = _a.sent();
                        headers = [
                            'Dolgozó',
                            'Szerződés szám',
                            'Módosítás dátuma',
                            'Típus',
                            'Leírás',
                            'Új fizetés',
                        ];
                        rows = amendments.map(function (a) { return [
                            "".concat(a.employmentContract.employee.vezetekNev, " ").concat(a.employmentContract.employee.keresztNev),
                            a.employmentContract.szerzodesSzam,
                            a.datum.toISOString().split('T')[0],
                            a.tipus,
                            a.leiras,
                            a.ujFizetes,
                        ]; });
                        return [2 /*return*/, this.formatExport(headers, rows, format, 'szerzodes_modositasok')];
                }
            });
        });
    };
    /** NAV/KSH HR alapadat analitika – strukturált export, nem hatósági beküldés. */
    HrReportService.prototype.exportNavKshHrAnalytics = function (format, filters) {
        return __awaiter(this, void 0, void 0, function () {
            var employees, headers, note, rows, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.employee.findMany({
                            where: this.employeeWhere(filters),
                            include: {
                                jobPosition: true,
                                employmentContracts: {
                                    where: { aktiv: true },
                                    orderBy: { kezdetDatum: 'desc' },
                                    take: 1,
                                },
                            },
                            orderBy: [{ vezetekNev: 'asc' }, { keresztNev: 'asc' }],
                        })];
                    case 1:
                        employees = _a.sent();
                        headers = [
                            'Név',
                            'Adóazonosító',
                            'TAJ',
                            'Jogviszony kezdete',
                            'Jogviszony vége',
                            'Munkakör',
                            'Foglalkoztatás típusa',
                            'Munkaidő',
                            'Besorolás',
                            'Szervezeti egység (osztály)',
                            'Szervezeti egység (részleg)',
                        ];
                        note = 'MEGJEGYZES: Belső HR analitika – nem minősül közvetlen NAV/KSH elektronikus beküldésnek.';
                        rows = employees.map(function (e) {
                            var _a, _b, _c;
                            var contract = e.employmentContracts[0];
                            return [
                                "".concat(e.vezetekNev, " ").concat(e.keresztNev),
                                e.adoszam || '',
                                e.tajSzam || '',
                                ((_a = e.munkaviszonyKezdete) === null || _a === void 0 ? void 0 : _a.toISOString().split('T')[0]) || '',
                                ((_b = e.munkaviszonyVege) === null || _b === void 0 ? void 0 : _b.toISOString().split('T')[0]) || '',
                                ((_c = e.jobPosition) === null || _c === void 0 ? void 0 : _c.nev) || '',
                                e.munkaviszonyTipusa || (contract === null || contract === void 0 ? void 0 : contract.tipus) || '',
                                e.munkaido || (contract === null || contract === void 0 ? void 0 : contract.munkaido) || '',
                                e.besorolas || '',
                                e.osztaly || '',
                                e.reszleg || '',
                            ];
                        });
                        return [4 /*yield*/, this.formatExport(headers, rows, format, 'nav_ksh_hr_alapadat_analitika')];
                    case 2:
                        result = _a.sent();
                        if (format === 'csv' && typeof result.body === 'string') {
                            result.body = "".concat(note, "\n").concat(result.body);
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    HrReportService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], HrReportService);
    return HrReportService;
}());
exports.HrReportService = HrReportService;
