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
exports.WorkflowInstanceService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../../prisma/prisma.service");
var WorkflowInstanceService = /** @class */ (function () {
    function WorkflowInstanceService(prisma) {
        this.prisma = prisma;
    }
    WorkflowInstanceService.prototype.create = function (dto, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var workflow, firstStep, instance, stepLogs;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.workflow.findUnique({
                            where: { id: dto.workflowId },
                            include: { steps: { orderBy: { sorrend: 'asc' } } },
                        })];
                    case 1:
                        workflow = _a.sent();
                        if (!workflow) {
                            throw new common_1.NotFoundException('Workflow nem található');
                        }
                        if (!workflow.aktiv) {
                            throw new common_1.BadRequestException('Az inaktív workflow-k nem indíthatók');
                        }
                        if (workflow.steps.length === 0) {
                            throw new common_1.BadRequestException('A workflow-nak legalább egy lépésnek kell lennie');
                        }
                        firstStep = workflow.steps[0];
                        return [4 /*yield*/, this.prisma.workflowInstance.create({
                                data: {
                                    workflowId: dto.workflowId,
                                    nev: dto.nev || "".concat(workflow.nev, " - ").concat(new Date().toLocaleDateString('hu-HU')),
                                    allapot: 'aktív',
                                    aktualisLepesId: firstStep.id,
                                    createdById: userId,
                                    subjectEmployeeId: dto.subjectEmployeeId || null,
                                },
                                include: {
                                    workflow: {
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
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                    aktualisLepes: true,
                                    createdBy: {
                                        select: {
                                            id: true,
                                            nev: true,
                                            email: true,
                                        },
                                    },
                                },
                            })];
                    case 2:
                        instance = _a.sent();
                        return [4 /*yield*/, Promise.all(workflow.steps.map(function (step, index) {
                                return _this.prisma.workflowStepLog.create({
                                    data: {
                                        instanceId: instance.id,
                                        stepId: step.id,
                                        allapot: index === 0 ? 'folyamatban' : 'várakozik',
                                    },
                                });
                            }))];
                    case 3:
                        stepLogs = _a.sent();
                        return [2 /*return*/, __assign(__assign({}, instance), { stepLogs: stepLogs })];
                }
            });
        });
    };
    WorkflowInstanceService.prototype.findAll = function (workflowId_1, userId_1) {
        return __awaiter(this, arguments, void 0, function (workflowId, userId, isAdmin) {
            var where;
            if (isAdmin === void 0) { isAdmin = false; }
            return __generator(this, function (_a) {
                where = {};
                if (workflowId) {
                    where.workflowId = workflowId;
                }
                if (!isAdmin && userId) {
                    where.createdById = userId;
                }
                return [2 /*return*/, this.prisma.workflowInstance.findMany({
                        where: where,
                        include: {
                            workflow: {
                                select: {
                                    id: true,
                                    nev: true,
                                    leiras: true,
                                },
                            },
                            aktualisLepes: {
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
                            stepLogs: {
                                include: {
                                    step: {
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
                                                },
                                            },
                                        },
                                    },
                                    completedBy: {
                                        select: {
                                            id: true,
                                            nev: true,
                                            email: true,
                                        },
                                    },
                                },
                                orderBy: {
                                    step: {
                                        sorrend: 'asc',
                                    },
                                },
                            },
                        },
                        orderBy: { createdAt: 'desc' },
                    })];
            });
        });
    };
    WorkflowInstanceService.prototype.findOne = function (id_1, userId_1) {
        return __awaiter(this, arguments, void 0, function (id, userId, isAdmin) {
            var instance;
            if (isAdmin === void 0) { isAdmin = false; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.workflowInstance.findUnique({
                            where: { id: id },
                            include: {
                                workflow: {
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
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                                aktualisLepes: {
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
                                stepLogs: {
                                    include: {
                                        step: {
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
                                                    },
                                                },
                                            },
                                        },
                                        completedBy: {
                                            select: {
                                                id: true,
                                                nev: true,
                                                email: true,
                                            },
                                        },
                                    },
                                    orderBy: {
                                        step: {
                                            sorrend: 'asc',
                                        },
                                    },
                                },
                            },
                        })];
                    case 1:
                        instance = _a.sent();
                        if (!instance) {
                            throw new common_1.NotFoundException('Workflow példány nem található');
                        }
                        // Check permissions
                        if (!isAdmin && userId && instance.createdById !== userId) {
                            throw new common_1.NotFoundException('Nincs hozzáférése ehhez a workflow példányhoz');
                        }
                        return [2 /*return*/, instance];
                }
            });
        });
    };
    WorkflowInstanceService.prototype.updateStepLog = function (instanceId, stepLogId, dto, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var instance, stepLog, updatedStepLog, currentStepIndex, nextStep_1, nextStepLog;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.workflowInstance.findUnique({
                            where: { id: instanceId },
                            include: {
                                workflow: {
                                    include: {
                                        steps: {
                                            orderBy: { sorrend: 'asc' },
                                        },
                                    },
                                },
                                stepLogs: {
                                    include: {
                                        step: true,
                                    },
                                },
                            },
                        })];
                    case 1:
                        instance = _a.sent();
                        if (!instance) {
                            throw new common_1.NotFoundException('Workflow példány nem található');
                        }
                        stepLog = instance.stepLogs.find(function (sl) { return sl.id === stepLogId; });
                        if (!stepLog) {
                            throw new common_1.NotFoundException('Lépés log nem található');
                        }
                        return [4 /*yield*/, this.prisma.workflowStepLog.update({
                                where: { id: stepLogId },
                                data: {
                                    allapot: dto.allapot,
                                    megjegyzes: dto.megjegyzes,
                                    completedById: dto.allapot === 'befejezve' ? userId : null,
                                    completedAt: dto.allapot === 'befejezve' ? new Date() : null,
                                },
                                include: {
                                    step: {
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
                                                },
                                            },
                                        },
                                    },
                                    completedBy: {
                                        select: {
                                            id: true,
                                            nev: true,
                                            email: true,
                                        },
                                    },
                                },
                            })];
                    case 2:
                        updatedStepLog = _a.sent();
                        if (!(dto.allapot === 'befejezve')) return [3 /*break*/, 8];
                        currentStepIndex = instance.workflow.steps.findIndex(function (s) { return s.id === stepLog.stepId; });
                        nextStep_1 = instance.workflow.steps[currentStepIndex + 1];
                        if (!nextStep_1) return [3 /*break*/, 6];
                        // Update instance to next step
                        return [4 /*yield*/, this.prisma.workflowInstance.update({
                                where: { id: instanceId },
                                data: {
                                    aktualisLepesId: nextStep_1.id,
                                },
                            })];
                    case 3:
                        // Update instance to next step
                        _a.sent();
                        nextStepLog = instance.stepLogs.find(function (sl) { return sl.stepId === nextStep_1.id; });
                        if (!nextStepLog) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.prisma.workflowStepLog.update({
                                where: { id: nextStepLog.id },
                                data: {
                                    allapot: 'folyamatban',
                                },
                            })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 8];
                    case 6: 
                    // All steps completed
                    return [4 /*yield*/, this.prisma.workflowInstance.update({
                            where: { id: instanceId },
                            data: {
                                allapot: 'befejezett',
                                completedAt: new Date(),
                            },
                        })];
                    case 7:
                        // All steps completed
                        _a.sent();
                        _a.label = 8;
                    case 8: return [2 /*return*/, updatedStepLog];
                }
            });
        });
    };
    WorkflowInstanceService.prototype.cancel = function (instanceId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var instance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.workflowInstance.findUnique({
                            where: { id: instanceId },
                        })];
                    case 1:
                        instance = _a.sent();
                        if (!instance) {
                            throw new common_1.NotFoundException('Workflow példány nem található');
                        }
                        return [2 /*return*/, this.prisma.workflowInstance.update({
                                where: { id: instanceId },
                                data: {
                                    allapot: 'megszakított',
                                    completedAt: new Date(),
                                },
                            })];
                }
            });
        });
    };
    WorkflowInstanceService.prototype.delegateStep = function (instanceId, stepId, dto, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var instance, step, stepLog;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.workflowInstance.findUnique({
                            where: { id: instanceId },
                            include: {
                                workflow: {
                                    include: {
                                        steps: true,
                                    },
                                },
                            },
                        })];
                    case 1:
                        instance = _a.sent();
                        if (!instance) {
                            throw new common_1.NotFoundException('Workflow példány nem található');
                        }
                        step = instance.workflow.steps.find(function (s) { return s.id === stepId; });
                        if (!step) {
                            throw new common_1.NotFoundException('Workflow lépés nem található');
                        }
                        // Check if user has permission to delegate (must be assigned to the step or admin)
                        if (!userId) {
                            throw new common_1.BadRequestException('Felhasználó azonosító szükséges');
                        }
                        // Update the step's assigned user
                        return [4 /*yield*/, this.prisma.workflowStep.update({
                                where: { id: stepId },
                                data: {
                                    assignedToId: dto.newAssignedToId,
                                },
                            })];
                    case 2:
                        // Update the step's assigned user
                        _a.sent();
                        return [4 /*yield*/, this.prisma.workflowStepLog.findFirst({
                                where: {
                                    instanceId: instanceId,
                                    stepId: stepId,
                                },
                            })];
                    case 3:
                        stepLog = _a.sent();
                        if (!stepLog) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.prisma.workflowStepLog.update({
                                where: { id: stepLog.id },
                                data: {
                                    megjegyzes: dto.megjegyzes || "Feladat deleg\u00E1lva \u00FAj felhaszn\u00E1l\u00F3nak",
                                },
                            })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, {
                            success: true,
                            message: 'Feladat sikeresen delegálva',
                        }];
                }
            });
        });
    };
    WorkflowInstanceService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], WorkflowInstanceService);
    return WorkflowInstanceService;
}());
exports.WorkflowInstanceService = WorkflowInstanceService;
