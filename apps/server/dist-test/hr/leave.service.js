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
exports.HrLeaveService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var hr_mail_service_1 = require("./hr-mail.service");
var HrLeaveService = /** @class */ (function () {
    function HrLeaveService(prisma, mail) {
        this.prisma = prisma;
        this.mail = mail;
    }
    HrLeaveService.prototype.listForEmployee = function (employeeId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.leaveRequest.findMany({
                        where: { employeeId: employeeId },
                        include: {
                            approvals: {
                                orderBy: { sorrend: 'asc' },
                                include: { approver: { select: { id: true, nev: true, email: true } } },
                            },
                            workflowInstance: { select: { id: true, allapot: true, nev: true } },
                        },
                        orderBy: { createdAt: 'desc' },
                    })];
            });
        });
    };
    HrLeaveService.prototype.listAll = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var where;
            return __generator(this, function (_a) {
                where = {};
                if (filters === null || filters === void 0 ? void 0 : filters.allapot)
                    where.allapot = filters.allapot;
                if (filters === null || filters === void 0 ? void 0 : filters.employeeId)
                    where.employeeId = filters.employeeId;
                return [2 /*return*/, this.prisma.leaveRequest.findMany({
                        where: where,
                        include: {
                            employee: { select: { id: true, azonosito: true, vezetekNev: true, keresztNev: true } },
                            approvals: { orderBy: { sorrend: 'asc' } },
                        },
                        orderBy: { createdAt: 'desc' },
                        take: 200,
                    })];
            });
        });
    };
    HrLeaveService.prototype.listPendingForApprover = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.leaveRequest.findMany({
                        where: {
                            allapot: 'FOLYAMATBAN',
                            approvals: {
                                some: { approverUserId: userId, allapot: 'VAR' },
                            },
                        },
                        include: {
                            employee: { select: { id: true, azonosito: true, vezetekNev: true, keresztNev: true } },
                            approvals: { orderBy: { sorrend: 'asc' } },
                        },
                        orderBy: { createdAt: 'asc' },
                    })];
            });
        });
    };
    HrLeaveService.prototype.summaryByStatus = function (ev) {
        return __awaiter(this, void 0, void 0, function () {
            var requests, by, _i, requests_1, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.leaveRequest.findMany({
                            where: ev ? { kezdet: { gte: new Date(ev, 0, 1), lte: new Date(ev, 11, 31) } } : {},
                        })];
                    case 1:
                        requests = _a.sent();
                        by = {};
                        for (_i = 0, requests_1 = requests; _i < requests_1.length; _i++) {
                            r = requests_1[_i];
                            by[r.allapot] = (by[r.allapot] || 0) + 1;
                        }
                        return [2 /*return*/, Object.entries(by).map(function (_a) {
                                var allapot = _a[0], db = _a[1];
                                return ({ allapot: allapot, db: db });
                            })];
                }
            });
        });
    };
    HrLeaveService.prototype.createRequest = function (dto, actingUserId) {
        return __awaiter(this, void 0, void 0, function () {
            var employee, workflowInstanceId, wf, inst_1, req, empEmail, firstApprover;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (new Date(dto.kezdet) > new Date(dto.veg)) {
                            throw new common_1.BadRequestException('Kezdő dátum nem lehet későbbi a végénél');
                        }
                        if (!((_a = dto.approverUserIds) === null || _a === void 0 ? void 0 : _a.length)) {
                            throw new common_1.BadRequestException('Legalább egy jóváhagyó szükséges');
                        }
                        return [4 /*yield*/, this.prisma.employee.findUniqueOrThrow({ where: { id: dto.employeeId } })];
                    case 1:
                        employee = _b.sent();
                        workflowInstanceId = null;
                        if (!(dto.workflowId && actingUserId)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.prisma.workflow.findFirst({
                                where: { id: dto.workflowId, aktiv: true },
                                include: { steps: { orderBy: { sorrend: 'asc' } } },
                            })];
                    case 2:
                        wf = _b.sent();
                        if (!(wf === null || wf === void 0 ? void 0 : wf.steps.length))
                            throw new common_1.BadRequestException('Workflow nem indítható');
                        return [4 /*yield*/, this.prisma.workflowInstance.create({
                                data: {
                                    workflowId: wf.id,
                                    nev: "T\u00E1voll\u00E9t \u2013 ".concat(dto.tipus),
                                    allapot: 'aktív',
                                    aktualisLepesId: wf.steps[0].id,
                                    createdById: actingUserId,
                                    subjectEmployeeId: dto.employeeId,
                                },
                            })];
                    case 3:
                        inst_1 = _b.sent();
                        return [4 /*yield*/, Promise.all(wf.steps.map(function (step, index) {
                                return _this.prisma.workflowStepLog.create({
                                    data: {
                                        instanceId: inst_1.id,
                                        stepId: step.id,
                                        allapot: index === 0 ? 'folyamatban' : 'várakozik',
                                    },
                                });
                            }))];
                    case 4:
                        _b.sent();
                        workflowInstanceId = inst_1.id;
                        _b.label = 5;
                    case 5: return [4 /*yield*/, this.prisma.leaveRequest.create({
                            data: {
                                employeeId: dto.employeeId,
                                tipus: dto.tipus,
                                kezdet: new Date(dto.kezdet),
                                veg: new Date(dto.veg),
                                indoklas: dto.indoklas,
                                allapot: 'FOLYAMATBAN',
                                workflowInstanceId: workflowInstanceId,
                                approvals: {
                                    create: dto.approverUserIds.map(function (uid, i) { return ({
                                        sorrend: i + 1,
                                        approverUserId: uid,
                                        allapot: 'VAR',
                                    }); }),
                                },
                            },
                            include: { approvals: true },
                        })];
                    case 6:
                        req = _b.sent();
                        empEmail = employee.email;
                        firstApprover = dto.approverUserIds[0];
                        return [4 /*yield*/, this.mail.notifyUserIds([firstApprover], "\u00DAj t\u00E1voll\u00E9t k\u00E9relem: ".concat(employee.vezetekNev, " ").concat(employee.keresztNev), "K\u00E9relem t\u00EDpus: ".concat(dto.tipus, "\nId\u0151tartam: ").concat(dto.kezdet, " \u2013 ").concat(dto.veg, "\nJ\u00F3v\u00E1hagy\u00E1s sz\u00FCks\u00E9ges a rendszerben."))];
                    case 7:
                        _b.sent();
                        if (!empEmail) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.mail.sendMail(empEmail, 'Távollét kérelem rögzítve', "K\u00E9relm\u00E9t r\u00F6gz\u00EDtett\u00FCk (".concat(dto.tipus, "). \u00C9rtes\u00EDtj\u00FCk a j\u00F3v\u00E1hagy\u00E1sr\u00F3l."))];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9: return [2 /*return*/, this.prisma.leaveRequest.findUnique({
                            where: { id: req.id },
                            include: { approvals: { include: { approver: { select: { nev: true, email: true } } } } },
                        })];
                }
            });
        });
    };
    HrLeaveService.prototype.decide = function (leaveId, userId, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var req, pendingRows, next, stillPending;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.leaveRequest.findUnique({
                            where: { id: leaveId },
                            include: { approvals: true, employee: true },
                        })];
                    case 1:
                        req = _a.sent();
                        if (!req)
                            throw new common_1.NotFoundException('Kérelem nem található');
                        if (req.allapot !== 'FOLYAMATBAN')
                            throw new common_1.BadRequestException('A kérelem már lezárult');
                        return [4 /*yield*/, this.prisma.leaveApproval.findMany({
                                where: { leaveRequestId: leaveId, allapot: 'VAR' },
                                orderBy: { sorrend: 'asc' },
                            })];
                    case 2:
                        pendingRows = _a.sent();
                        next = pendingRows[0];
                        if (!next || next.approverUserId !== userId) {
                            throw new common_1.ForbiddenException('Nincs jóváhagyási jog ebben a lépésben');
                        }
                        return [4 /*yield*/, this.prisma.leaveApproval.update({
                                where: { id: next.id },
                                data: {
                                    allapot: dto.elfogadva ? 'JOVAHAGYVA' : 'ELUTASITVA',
                                    dontesDatum: new Date(),
                                    megjegyzes: dto.megjegyzes,
                                },
                            })];
                    case 3:
                        _a.sent();
                        if (!!dto.elfogadva) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.prisma.leaveRequest.update({
                                where: { id: leaveId },
                                data: { allapot: 'ELUTASITVA' },
                            })];
                    case 4:
                        _a.sent();
                        if (!req.employee.email) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.mail.sendMail(req.employee.email, 'Távollét elutasítva', 'Az Ön távollét kérelme elutasításra került.')];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, this.prisma.leaveRequest.findUnique({
                            where: { id: leaveId },
                            include: { approvals: true },
                        })];
                    case 7: return [4 /*yield*/, this.prisma.leaveApproval.findFirst({
                            where: { leaveRequestId: leaveId, allapot: 'VAR' },
                            orderBy: { sorrend: 'asc' },
                        })];
                    case 8:
                        stillPending = _a.sent();
                        if (!!stillPending) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.prisma.leaveRequest.update({
                                where: { id: leaveId },
                                data: { allapot: 'JOVAHAGYVA' },
                            })];
                    case 9:
                        _a.sent();
                        if (!req.employee.email) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.mail.sendMail(req.employee.email, 'Távollét jóváhagyva', "T\u00E1voll\u00E9t k\u00E9relm\u00E9t j\u00F3v\u00E1hagyt\u00E1k (".concat(req.tipus, ", ").concat(req.kezdet.toISOString().slice(0, 10), " \u2013 ").concat(req.veg.toISOString().slice(0, 10), ")."))];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11: return [3 /*break*/, 14];
                    case 12:
                        if (!stillPending.approverUserId) return [3 /*break*/, 14];
                        return [4 /*yield*/, this.mail.notifyUserIds([stillPending.approverUserId], 'Távollét jóváhagyás (következő lépés)', "\u00DAj t\u00E1voll\u00E9t k\u00E9relem v\u00E1r j\u00F3v\u00E1hagy\u00E1sra: ".concat(req.employee.vezetekNev, " ").concat(req.employee.keresztNev))];
                    case 13:
                        _a.sent();
                        _a.label = 14;
                    case 14: return [2 /*return*/, this.prisma.leaveRequest.findUnique({
                            where: { id: leaveId },
                            include: { approvals: { include: { approver: { select: { nev: true, email: true } } } } },
                        })];
                }
            });
        });
    };
    HrLeaveService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService,
            hr_mail_service_1.HrMailService])
    ], HrLeaveService);
    return HrLeaveService;
}());
exports.HrLeaveService = HrLeaveService;
