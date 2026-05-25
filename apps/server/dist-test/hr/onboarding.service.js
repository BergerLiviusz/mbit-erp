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
exports.HrOnboardingService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var workflow_instance_service_1 = require("../team/workflow/workflow-instance.service");
var hr_mail_service_1 = require("./hr-mail.service");
var HrOnboardingService = /** @class */ (function () {
    function HrOnboardingService(prisma, workflowInstance, mail) {
        this.prisma = prisma;
        this.workflowInstance = workflowInstance;
        this.mail = mail;
    }
    HrOnboardingService.prototype.listTemplates = function (aktiv) {
        return __awaiter(this, void 0, void 0, function () {
            var where;
            return __generator(this, function (_a) {
                where = {};
                if (aktiv !== undefined)
                    where.aktiv = aktiv;
                return [2 /*return*/, this.prisma.onboardingTemplate.findMany({ where: where, orderBy: { nev: 'asc' } })];
            });
        });
    };
    HrOnboardingService.prototype.createTemplate = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.onboardingTemplate.create({ data: dto })];
            });
        });
    };
    HrOnboardingService.prototype.updateTemplate = function (id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.onboardingTemplate.findUniqueOrThrow({ where: { id: id } })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.prisma.onboardingTemplate.update({ where: { id: id }, data: dto })];
                }
            });
        });
    };
    HrOnboardingService.prototype.deleteTemplate = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.onboardingTemplate.findUniqueOrThrow({ where: { id: id } })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.prisma.onboardingTemplate.delete({ where: { id: id } })];
                }
            });
        });
    };
    HrOnboardingService.prototype.startInstance = function (dto, actingUserId) {
        return __awaiter(this, void 0, void 0, function () {
            var tpl, emp, workflowInstanceId, res, inst, lines;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.prisma.onboardingTemplate.findUniqueOrThrow({ where: { id: dto.templateId } })];
                    case 1:
                        tpl = _b.sent();
                        return [4 /*yield*/, this.prisma.employee.findUniqueOrThrow({
                                where: { id: dto.employeeId },
                                include: { jobPosition: { include: { jobDescriptionDocument: true } } },
                            })];
                    case 2:
                        emp = _b.sent();
                        workflowInstanceId = null;
                        if (!(dto.workflowId && actingUserId)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.workflowInstance.create({
                                workflowId: dto.workflowId,
                                nev: "Bel\u00E9ptet\u00E9s \u2013 ".concat(emp.vezetekNev, " ").concat(emp.keresztNev),
                                subjectEmployeeId: dto.employeeId,
                            }, actingUserId)];
                    case 3:
                        res = _b.sent();
                        workflowInstanceId = res.id;
                        _b.label = 4;
                    case 4: return [4 /*yield*/, this.prisma.onboardingInstance.create({
                            data: {
                                employeeId: dto.employeeId,
                                templateId: dto.templateId,
                                workflowInstanceId: workflowInstanceId,
                                megjegyzes: dto.megjegyzes,
                                allapot: 'FOLYAMATBAN',
                            },
                            include: { template: true },
                        })];
                    case 5:
                        inst = _b.sent();
                        lines = ["Bel\u00E9ptet\u00E9si csomag: ".concat(tpl.nev)];
                        if (tpl.dokLista)
                            lines.push(tpl.dokLista);
                        if ((_a = emp.jobPosition) === null || _a === void 0 ? void 0 : _a.jobDescriptionDocument) {
                            lines.push("Munkak\u00F6ri le\u00EDr\u00E1s dokumentum: ".concat(emp.jobPosition.jobDescriptionDocument.nev, " (DMS)"));
                        }
                        if (!emp.email) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.mail.sendMail(emp.email, 'Üdvözöljük – beléptetési információk', lines.join('\n\n'))];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7: return [2 /*return*/, inst];
                }
            });
        });
    };
    HrOnboardingService.prototype.listInstances = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var where;
            return __generator(this, function (_a) {
                where = {};
                if (filters === null || filters === void 0 ? void 0 : filters.employeeId)
                    where.employeeId = filters.employeeId;
                if (filters === null || filters === void 0 ? void 0 : filters.allapot)
                    where.allapot = filters.allapot;
                return [2 /*return*/, this.prisma.onboardingInstance.findMany({
                        where: where,
                        include: {
                            employee: { select: { id: true, azonosito: true, vezetekNev: true, keresztNev: true } },
                            template: true,
                            workflowInstance: { select: { id: true, allapot: true, nev: true } },
                        },
                        orderBy: { megkezdve: 'desc' },
                    })];
            });
        });
    };
    HrOnboardingService.prototype.completeInstance = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var o;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.onboardingInstance.findUnique({ where: { id: id } })];
                    case 1:
                        o = _a.sent();
                        if (!o)
                            throw new common_1.NotFoundException('Beléptetés nem található');
                        return [2 /*return*/, this.prisma.onboardingInstance.update({
                                where: { id: id },
                                data: { allapot: 'BEFEJEZVE', befejezve: new Date() },
                            })];
                }
            });
        });
    };
    HrOnboardingService.prototype.analytics = function () {
        return this.prisma.onboardingInstance.groupBy({
            by: ['allapot'],
            _count: { allapot: true },
        });
    };
    HrOnboardingService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService,
            workflow_instance_service_1.WorkflowInstanceService,
            hr_mail_service_1.HrMailService])
    ], HrOnboardingService);
    return HrOnboardingService;
}());
exports.HrOnboardingService = HrOnboardingService;
