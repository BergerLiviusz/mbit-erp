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
exports.WorkflowService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../../prisma/prisma.service");
var WorkflowService = /** @class */ (function () {
    function WorkflowService(prisma) {
        this.prisma = prisma;
    }
    WorkflowService.prototype.findAll = function (userId_1) {
        return __awaiter(this, arguments, void 0, function (userId, isAdmin) {
            var where;
            if (isAdmin === void 0) { isAdmin = false; }
            return __generator(this, function (_a) {
                where = {};
                // Non-admin users only see workflows they created
                if (!isAdmin && userId) {
                    where.createdById = userId;
                }
                return [2 /*return*/, this.prisma.workflow.findMany({
                        where: where,
                        include: {
                            steps: {
                                orderBy: { sorrend: 'asc' },
                                include: {
                                    assignedTo: {
                                        select: {
                                            id: true,
                                            nev: true,
                                            email: true,
                                        },
                                    },
                                    Role: {
                                        select: {
                                            id: true,
                                            nev: true,
                                            leiras: true,
                                        },
                                    },
                                },
                            },
                            createdBy: {
                                select: {
                                    id: true,
                                    nev: true,
                                    email: true,
                                },
                            },
                        },
                        orderBy: { createdAt: 'desc' },
                    })];
            });
        });
    };
    WorkflowService.prototype.findOne = function (id_1, userId_1) {
        return __awaiter(this, arguments, void 0, function (id, userId, isAdmin) {
            var workflow;
            if (isAdmin === void 0) { isAdmin = false; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.workflow.findUnique({
                            where: { id: id },
                            include: {
                                steps: {
                                    orderBy: { sorrend: 'asc' },
                                    include: {
                                        assignedTo: {
                                            select: {
                                                id: true,
                                                nev: true,
                                                email: true,
                                            },
                                        },
                                        Role: {
                                            select: {
                                                id: true,
                                                nev: true,
                                                leiras: true,
                                            },
                                        },
                                    },
                                },
                                createdBy: {
                                    select: {
                                        id: true,
                                        nev: true,
                                        email: true,
                                    },
                                },
                            },
                        })];
                    case 1:
                        workflow = _a.sent();
                        if (!workflow) {
                            throw new common_1.NotFoundException('Workflow nem található');
                        }
                        // Check permissions: admin can see all, others only if they created it
                        if (!isAdmin && userId && workflow.createdById !== userId) {
                            throw new common_1.NotFoundException('Nincs hozzáférése ehhez a workflow-hoz');
                        }
                        return [2 /*return*/, workflow];
                }
            });
        });
    };
    WorkflowService.prototype.create = function (dto, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var sortedSteps, i;
            var _a;
            return __generator(this, function (_b) {
                if (!dto.steps || dto.steps.length < 5) {
                    throw new common_1.BadRequestException('A workflow-nak legalább 5 lépésnek kell lennie');
                }
                sortedSteps = __spreadArray([], dto.steps, true).sort(function (a, b) { return a.sorrend - b.sorrend; });
                for (i = 0; i < sortedSteps.length; i++) {
                    if (sortedSteps[i].sorrend !== i + 1) {
                        throw new common_1.BadRequestException("A l\u00E9p\u00E9sek sorrendje nem helyes. V\u00E1rhat\u00F3: ".concat(i + 1, ", kapott: ").concat(sortedSteps[i].sorrend));
                    }
                }
                return [2 /*return*/, this.prisma.workflow.create({
                        data: {
                            nev: dto.nev,
                            leiras: dto.leiras,
                            aktiv: (_a = dto.aktiv) !== null && _a !== void 0 ? _a : true,
                            createdById: userId,
                            steps: {
                                create: dto.steps.map(function (step) {
                                    var _a;
                                    return ({
                                        nev: step.nev,
                                        leiras: step.leiras,
                                        sorrend: step.sorrend,
                                        lepesTipus: step.lepesTipus,
                                        szin: step.szin || '#3B82F6',
                                        kotelezo: (_a = step.kotelezo) !== null && _a !== void 0 ? _a : false,
                                        assignedToId: step.assignedToId,
                                        roleId: step.roleId,
                                    });
                                }),
                            },
                        },
                        include: {
                            steps: {
                                orderBy: { sorrend: 'asc' },
                                include: {
                                    assignedTo: {
                                        select: {
                                            id: true,
                                            nev: true,
                                            email: true,
                                        },
                                    },
                                    Role: {
                                        select: {
                                            id: true,
                                            nev: true,
                                            leiras: true,
                                        },
                                    },
                                },
                            },
                            createdBy: {
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
    WorkflowService.prototype.update = function (id_1, dto_1, userId_1) {
        return __awaiter(this, arguments, void 0, function (id, dto, userId, isAdmin) {
            var workflow, existingStepIds, updatedStepIds_1, stepsToDelete, _i, _a, stepDto;
            var _b;
            if (isAdmin === void 0) { isAdmin = false; }
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.prisma.workflow.findUnique({
                            where: { id: id },
                            include: { steps: true },
                        })];
                    case 1:
                        workflow = _c.sent();
                        if (!workflow) {
                            throw new common_1.NotFoundException('Workflow nem található');
                        }
                        // Check permissions: admin can edit all, others only if they created it
                        if (!isAdmin && userId && workflow.createdById !== userId) {
                            throw new common_1.NotFoundException('Nincs jogosultsága ehhez a workflow-hoz');
                        }
                        if (!(dto.steps && dto.steps.length > 0)) return [3 /*break*/, 9];
                        // Validate minimum 5 steps
                        if (dto.steps.length < 5) {
                            throw new common_1.BadRequestException('A workflow-nak legalább 5 lépésnek kell lennie');
                        }
                        existingStepIds = workflow.steps.map(function (s) { return s.id; });
                        updatedStepIds_1 = dto.steps.filter(function (s) { return s.id; }).map(function (s) { return s.id; });
                        stepsToDelete = existingStepIds.filter(function (id) { return !updatedStepIds_1.includes(id); });
                        if (!(stepsToDelete.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.prisma.workflowStep.deleteMany({
                                where: {
                                    id: { in: stepsToDelete },
                                    workflowId: id,
                                },
                            })];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _i = 0, _a = dto.steps;
                        _c.label = 4;
                    case 4:
                        if (!(_i < _a.length)) return [3 /*break*/, 9];
                        stepDto = _a[_i];
                        if (!(stepDto.id && existingStepIds.includes(stepDto.id))) return [3 /*break*/, 6];
                        // Update existing step
                        return [4 /*yield*/, this.prisma.workflowStep.update({
                                where: { id: stepDto.id },
                                data: {
                                    nev: stepDto.nev,
                                    leiras: stepDto.leiras,
                                    sorrend: stepDto.sorrend,
                                    lepesTipus: stepDto.lepesTipus,
                                    szin: stepDto.szin,
                                    kotelezo: stepDto.kotelezo,
                                    assignedToId: stepDto.assignedToId,
                                    roleId: stepDto.roleId,
                                },
                            })];
                    case 5:
                        // Update existing step
                        _c.sent();
                        return [3 /*break*/, 8];
                    case 6: 
                    // Create new step
                    return [4 /*yield*/, this.prisma.workflowStep.create({
                            data: {
                                workflowId: id,
                                nev: stepDto.nev,
                                leiras: stepDto.leiras,
                                sorrend: stepDto.sorrend,
                                lepesTipus: stepDto.lepesTipus,
                                szin: stepDto.szin || '#3B82F6',
                                kotelezo: (_b = stepDto.kotelezo) !== null && _b !== void 0 ? _b : false,
                                assignedToId: stepDto.assignedToId,
                                roleId: stepDto.roleId,
                            },
                        })];
                    case 7:
                        // Create new step
                        _c.sent();
                        _c.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 4];
                    case 9: return [2 /*return*/, this.prisma.workflow.update({
                            where: { id: id },
                            data: {
                                nev: dto.nev,
                                leiras: dto.leiras,
                                aktiv: dto.aktiv,
                            },
                            include: {
                                steps: {
                                    orderBy: { sorrend: 'asc' },
                                    include: {
                                        assignedTo: {
                                            select: {
                                                id: true,
                                                nev: true,
                                                email: true,
                                            },
                                        },
                                        Role: {
                                            select: {
                                                id: true,
                                                nev: true,
                                                leiras: true,
                                            },
                                        },
                                    },
                                },
                                createdBy: {
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
    WorkflowService.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var workflow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.workflow.findUnique({
                            where: { id: id },
                        })];
                    case 1:
                        workflow = _a.sent();
                        if (!workflow) {
                            throw new common_1.NotFoundException('Workflow nem található');
                        }
                        return [4 /*yield*/, this.prisma.workflow.delete({
                                where: { id: id },
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { success: true }];
                }
            });
        });
    };
    WorkflowService.prototype.addStep = function (workflowId, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var workflow, existingStep;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.prisma.workflow.findUnique({
                            where: { id: workflowId },
                            include: {
                                steps: true,
                            },
                        })];
                    case 1:
                        workflow = _b.sent();
                        if (!workflow) {
                            throw new common_1.NotFoundException('Workflow nem található');
                        }
                        existingStep = workflow.steps.find(function (s) { return s.sorrend === dto.sorrend; });
                        if (existingStep) {
                            throw new common_1.BadRequestException("M\u00E1r l\u00E9tezik l\u00E9p\u00E9s a ".concat(dto.sorrend, ". poz\u00EDci\u00F3ban"));
                        }
                        return [2 /*return*/, this.prisma.workflowStep.create({
                                data: {
                                    workflowId: workflowId,
                                    nev: dto.nev,
                                    leiras: dto.leiras,
                                    sorrend: dto.sorrend,
                                    lepesTipus: dto.lepesTipus,
                                    szin: dto.szin || '#3B82F6',
                                    kotelezo: (_a = dto.kotelezo) !== null && _a !== void 0 ? _a : false,
                                    assignedToId: dto.assignedToId,
                                    roleId: dto.roleId,
                                },
                                include: {
                                    assignedTo: {
                                        select: {
                                            id: true,
                                            nev: true,
                                            email: true,
                                        },
                                    },
                                    Role: {
                                        select: {
                                            id: true,
                                            nev: true,
                                            leiras: true,
                                        },
                                    },
                                },
                            })];
                }
            });
        });
    };
    WorkflowService.prototype.updateStep = function (workflowId, stepId, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var step;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.workflowStep.findUnique({
                            where: { id: stepId },
                        })];
                    case 1:
                        step = _a.sent();
                        if (!step || step.workflowId !== workflowId) {
                            throw new common_1.NotFoundException('Workflow lépés nem található');
                        }
                        return [2 /*return*/, this.prisma.workflowStep.update({
                                where: { id: stepId },
                                data: {
                                    nev: dto.nev,
                                    leiras: dto.leiras,
                                    sorrend: dto.sorrend,
                                    lepesTipus: dto.lepesTipus,
                                    szin: dto.szin,
                                    kotelezo: dto.kotelezo,
                                    assignedToId: dto.assignedToId,
                                    roleId: dto.roleId,
                                },
                                include: {
                                    assignedTo: {
                                        select: {
                                            id: true,
                                            nev: true,
                                            email: true,
                                        },
                                    },
                                    Role: {
                                        select: {
                                            id: true,
                                            nev: true,
                                            leiras: true,
                                        },
                                    },
                                },
                            })];
                }
            });
        });
    };
    WorkflowService.prototype.deleteStep = function (workflowId, stepId) {
        return __awaiter(this, void 0, void 0, function () {
            var step;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.workflowStep.findUnique({
                            where: { id: stepId },
                        })];
                    case 1:
                        step = _a.sent();
                        if (!step || step.workflowId !== workflowId) {
                            throw new common_1.NotFoundException('Workflow lépés nem található');
                        }
                        return [4 /*yield*/, this.prisma.workflowStep.delete({
                                where: { id: stepId },
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { success: true }];
                }
            });
        });
    };
    WorkflowService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], WorkflowService);
    return WorkflowService;
}());
exports.WorkflowService = WorkflowService;
