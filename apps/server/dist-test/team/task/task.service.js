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
exports.TaskService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../../prisma/prisma.service");
var activity_service_1 = require("../activity/activity.service");
var audit_service_1 = require("../../common/audit/audit.service");
var TaskService = /** @class */ (function () {
    function TaskService(prisma, activityService, auditService) {
        this.prisma = prisma;
        this.activityService = activityService;
        this.auditService = auditService;
    }
    TaskService.prototype.findAll = function (userId_1, isAdmin_1, filters_1) {
        return __awaiter(this, arguments, void 0, function (userId, isAdmin, filters, skip, take) {
            var where, _a, total, items;
            if (skip === void 0) { skip = 0; }
            if (take === void 0) { take = 50; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        where = {};
                        // Jogosultság ellenőrzés: Admin mindent lát, User csak saját + hozzárendelt + board tagként látható
                        if (!isAdmin) {
                            where.OR = [
                                { assignedToId: userId },
                                { createdById: userId },
                                { board: { members: { some: { userId: userId } } } },
                            ];
                        }
                        // Szűrők alkalmazása
                        if (filters.assignedToId) {
                            where.assignedToId = filters.assignedToId;
                        }
                        if (filters.allapot) {
                            where.allapot = filters.allapot;
                        }
                        if (filters.prioritas) {
                            where.prioritas = filters.prioritas;
                        }
                        if (filters.boardId) {
                            where.boardId = filters.boardId;
                        }
                        if (filters.accountId) {
                            where.accountId = filters.accountId;
                        }
                        if (filters.opportunityId) {
                            where.opportunityId = filters.opportunityId;
                        }
                        if (filters.leadId) {
                            where.leadId = filters.leadId;
                        }
                        if (filters.quoteId) {
                            where.quoteId = filters.quoteId;
                        }
                        if (filters.orderId) {
                            where.orderId = filters.orderId;
                        }
                        if (filters.ticketId) {
                            where.ticketId = filters.ticketId;
                        }
                        if (filters.documentId) {
                            where.documentId = filters.documentId;
                        }
                        if (filters.search) {
                            where.OR = __spreadArray(__spreadArray([], (where.OR || []), true), [
                                { cim: { contains: filters.search } },
                                { leiras: { contains: filters.search } },
                            ], false);
                        }
                        return [4 /*yield*/, Promise.all([
                                this.prisma.task.count({ where: where }),
                                this.prisma.task.findMany({
                                    where: where,
                                    skip: skip,
                                    take: take,
                                    include: {
                                        assignedTo: {
                                            select: {
                                                id: true,
                                                nev: true,
                                                email: true,
                                            },
                                        },
                                        createdBy: {
                                            select: {
                                                id: true,
                                                nev: true,
                                                email: true,
                                            },
                                        },
                                        board: {
                                            select: {
                                                id: true,
                                                nev: true,
                                            },
                                        },
                                        account: {
                                            select: {
                                                id: true,
                                                nev: true,
                                                azonosito: true,
                                            },
                                        },
                                        opportunity: {
                                            select: {
                                                id: true,
                                                nev: true,
                                            },
                                        },
                                        lead: {
                                            select: {
                                                id: true,
                                                allapot: true,
                                            },
                                        },
                                        quote: {
                                            select: {
                                                id: true,
                                                azonosito: true,
                                            },
                                        },
                                        order: {
                                            select: {
                                                id: true,
                                                azonosito: true,
                                            },
                                        },
                                        ticket: {
                                            select: {
                                                id: true,
                                                azonosito: true,
                                            },
                                        },
                                        document: {
                                            select: {
                                                id: true,
                                                nev: true,
                                            },
                                        },
                                        _count: {
                                            select: {
                                                comments: true,
                                                attachments: true,
                                            },
                                        },
                                    },
                                    orderBy: [
                                        { position: 'asc' },
                                        { createdAt: 'desc' },
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
    TaskService.prototype.findOne = function (id, userId, isAdmin) {
        return __awaiter(this, void 0, void 0, function () {
            var task, canView;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.prisma.task.findUnique({
                            where: { id: id },
                            include: {
                                assignedTo: {
                                    select: {
                                        id: true,
                                        nev: true,
                                        email: true,
                                    },
                                },
                                createdBy: {
                                    select: {
                                        id: true,
                                        nev: true,
                                        email: true,
                                    },
                                },
                                board: {
                                    include: {
                                        columns: {
                                            orderBy: { pozicio: 'asc' },
                                        },
                                        members: true,
                                    },
                                },
                                account: true,
                                opportunity: true,
                                lead: true,
                                quote: true,
                                order: true,
                                ticket: true,
                                document: true,
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
                                    orderBy: { createdAt: 'desc' },
                                },
                                activities: {
                                    include: {
                                        user: {
                                            select: {
                                                id: true,
                                                nev: true,
                                                email: true,
                                            },
                                        },
                                    },
                                    orderBy: { createdAt: 'desc' },
                                },
                                attachments: {
                                    include: {
                                        uploadedBy: {
                                            select: {
                                                id: true,
                                                nev: true,
                                            },
                                        },
                                    },
                                },
                                watchers: {
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
                        task = _b.sent();
                        if (!task) {
                            throw new common_1.NotFoundException('Feladat nem található');
                        }
                        // Jogosultság ellenőrzés
                        if (!isAdmin) {
                            canView = task.assignedToId === userId ||
                                task.createdById === userId ||
                                (task.board && ((_a = task.board.members) === null || _a === void 0 ? void 0 : _a.some(function (m) { return m.userId === userId; })));
                            if (!canView) {
                                throw new common_1.ForbiddenException('Nincs jogosultságod a feladat megtekintéséhez');
                            }
                        }
                        return [2 /*return*/, task];
                }
            });
        });
    };
    TaskService.prototype.create = function (dto, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var validUserId, userExists, adminUser, task;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validUserId = userId;
                        if (!userId) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { id: userId },
                            })];
                    case 1:
                        userExists = _a.sent();
                        if (!!userExists) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.prisma.user.findFirst({
                                where: {
                                    email: 'admin@mbit.hu',
                                    aktiv: true,
                                },
                            })];
                    case 2:
                        adminUser = _a.sent();
                        if (adminUser) {
                            validUserId = adminUser.id;
                        }
                        else {
                            validUserId = null;
                        }
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.prisma.task.create({
                            data: __assign(__assign({}, dto), { createdById: validUserId || undefined, hataridoDatum: dto.hataridoDatum ? new Date(dto.hataridoDatum) : null }),
                            include: {
                                assignedTo: {
                                    select: {
                                        id: true,
                                        nev: true,
                                        email: true,
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
                    case 4:
                        task = _a.sent();
                        if (!validUserId) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.activityService.createActivity(task.id, validUserId, activity_service_1.TaskActivityType.CREATED, "Feladat l\u00E9trehozva: ".concat(task.cim))];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: 
                    // Audit log
                    return [4 /*yield*/, this.auditService.logCreate('Task', task.id, task, validUserId)];
                    case 7:
                        // Audit log
                        _a.sent();
                        if (!task.assignedToId) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.prisma.taskWatcher.upsert({
                                where: {
                                    taskId_userId: {
                                        taskId: task.id,
                                        userId: task.assignedToId,
                                    },
                                },
                                create: {
                                    taskId: task.id,
                                    userId: task.assignedToId,
                                },
                                update: {},
                            })];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [2 /*return*/, task];
                }
            });
        });
    };
    TaskService.prototype.update = function (id, dto, userId, isAdmin) {
        return __awaiter(this, void 0, void 0, function () {
            var task, oldData, updateData, updatedTask, changes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id, userId, isAdmin)];
                    case 1:
                        task = _a.sent();
                        // Jogosultság ellenőrzés: csak admin vagy létrehozó vagy assignedTo szerkeszthet
                        if (!isAdmin && task.createdById !== userId && task.assignedToId !== userId) {
                            throw new common_1.ForbiddenException('Nincs jogosultságod a feladat szerkesztéséhez');
                        }
                        oldData = __assign({}, task);
                        updateData = __assign({}, dto);
                        if (dto.hataridoDatum) {
                            updateData.hataridoDatum = new Date(dto.hataridoDatum);
                        }
                        // Ha státusz változott, completedAt beállítása
                        if (dto.allapot && dto.allapot !== task.allapot) {
                            if (dto.allapot === 'DONE' && !task.completedAt) {
                                updateData.completedAt = new Date();
                            }
                            else if (dto.allapot !== 'DONE') {
                                updateData.completedAt = null;
                            }
                        }
                        return [4 /*yield*/, this.prisma.task.update({
                                where: { id: id },
                                data: updateData,
                                include: {
                                    assignedTo: {
                                        select: {
                                            id: true,
                                            nev: true,
                                            email: true,
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
                    case 2:
                        updatedTask = _a.sent();
                        changes = [];
                        if (!(dto.allapot && dto.allapot !== oldData.allapot)) return [3 /*break*/, 4];
                        changes.push("St\u00E1tusz: ".concat(oldData.allapot, " \u2192 ").concat(dto.allapot));
                        return [4 /*yield*/, this.activityService.createActivity(id, userId, activity_service_1.TaskActivityType.STATUS_CHANGED, "St\u00E1tusz v\u00E1ltozott: ".concat(oldData.allapot, " \u2192 ").concat(dto.allapot), { allapot: oldData.allapot }, { allapot: dto.allapot })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!(dto.assignedToId && dto.assignedToId !== oldData.assignedToId)) return [3 /*break*/, 7];
                        changes.push("Felel\u0151s v\u00E1ltozott");
                        return [4 /*yield*/, this.activityService.createActivity(id, userId, activity_service_1.TaskActivityType.ASSIGNED, "Feladat hozz\u00E1rendelve", { assignedToId: oldData.assignedToId }, { assignedToId: dto.assignedToId })];
                    case 5:
                        _a.sent();
                        if (!dto.assignedToId) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.prisma.taskWatcher.upsert({
                                where: {
                                    taskId_userId: {
                                        taskId: id,
                                        userId: dto.assignedToId,
                                    },
                                },
                                create: {
                                    taskId: id,
                                    userId: dto.assignedToId,
                                },
                                update: {},
                            })];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        if (!(changes.length === 0)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.activityService.createActivity(id, userId, activity_service_1.TaskActivityType.UPDATED, 'Feladat frissítve', oldData, updatedTask)];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: 
                    // Audit log
                    return [4 /*yield*/, this.auditService.logUpdate('Task', id, oldData, updatedTask, userId)];
                    case 10:
                        // Audit log
                        _a.sent();
                        return [2 /*return*/, updatedTask];
                }
            });
        });
    };
    TaskService.prototype.delete = function (id, userId, isAdmin) {
        return __awaiter(this, void 0, void 0, function () {
            var task;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id, userId, isAdmin)];
                    case 1:
                        task = _a.sent();
                        // Jogosultság ellenőrzés: csak admin vagy létrehozó törölhet
                        if (!isAdmin && task.createdById !== userId) {
                            throw new common_1.ForbiddenException('Nincs jogosultságod a feladat törléséhez');
                        }
                        return [4 /*yield*/, this.prisma.task.delete({
                                where: { id: id },
                            })];
                    case 2:
                        _a.sent();
                        // Audit log
                        return [4 /*yield*/, this.auditService.logDelete('Task', id, task, userId)];
                    case 3:
                        // Audit log
                        _a.sent();
                        return [2 /*return*/, { success: true }];
                }
            });
        });
    };
    TaskService.prototype.move = function (id, dto, userId, isAdmin) {
        return __awaiter(this, void 0, void 0, function () {
            var task, updatedTask;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id, userId, isAdmin)];
                    case 1:
                        task = _a.sent();
                        // Jogosultság ellenőrzés
                        if (!isAdmin && task.createdById !== userId && task.assignedToId !== userId) {
                            throw new common_1.ForbiddenException('Nincs jogosultságod a feladat mozgatásához');
                        }
                        return [4 /*yield*/, this.prisma.task.update({
                                where: { id: id },
                                data: {
                                    boardId: dto.boardId,
                                    allapot: dto.allapot,
                                    position: dto.position,
                                },
                            })];
                    case 2:
                        updatedTask = _a.sent();
                        // Activity log
                        return [4 /*yield*/, this.activityService.createActivity(id, userId, activity_service_1.TaskActivityType.MOVED, "Feladat mozgatva: ".concat(task.allapot, " \u2192 ").concat(dto.allapot), { boardId: task.boardId, allapot: task.allapot, position: task.position }, { boardId: dto.boardId, allapot: dto.allapot, position: dto.position })];
                    case 3:
                        // Activity log
                        _a.sent();
                        return [2 /*return*/, updatedTask];
                }
            });
        });
    };
    TaskService.prototype.getMyTasks = function (userId_1) {
        return __awaiter(this, arguments, void 0, function (userId, skip, take) {
            if (skip === void 0) { skip = 0; }
            if (take === void 0) { take = 50; }
            return __generator(this, function (_a) {
                return [2 /*return*/, this.findAll(userId, false, { assignedToId: userId }, skip, take)];
            });
        });
    };
    TaskService.prototype.getAssignedToTasks = function (userId_1) {
        return __awaiter(this, arguments, void 0, function (userId, skip, take) {
            if (skip === void 0) { skip = 0; }
            if (take === void 0) { take = 50; }
            return __generator(this, function (_a) {
                return [2 /*return*/, this.findAll(userId, false, { assignedToId: userId }, skip, take)];
            });
        });
    };
    TaskService.prototype.getDashboardStats = function (userId, isAdmin) {
        return __awaiter(this, void 0, void 0, function () {
            var where, _a, total, byStatus, byPriority, overdue;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        where = {};
                        if (!isAdmin) {
                            where.OR = [
                                { assignedToId: userId },
                                { createdById: userId },
                                { board: { members: { some: { userId: userId } } } },
                            ];
                        }
                        return [4 /*yield*/, Promise.all([
                                this.prisma.task.count({ where: where }),
                                this.prisma.task.groupBy({
                                    by: ['allapot'],
                                    where: where,
                                    _count: true,
                                }),
                                this.prisma.task.groupBy({
                                    by: ['prioritas'],
                                    where: where,
                                    _count: true,
                                }),
                                this.prisma.task.count({
                                    where: __assign(__assign({}, where), { hataridoDatum: {
                                            lt: new Date(),
                                        }, allapot: {
                                            not: 'DONE',
                                        } }),
                                }),
                            ])];
                    case 1:
                        _a = _b.sent(), total = _a[0], byStatus = _a[1], byPriority = _a[2], overdue = _a[3];
                        return [2 /*return*/, {
                                total: total,
                                byStatus: byStatus.reduce(function (acc, item) {
                                    acc[item.allapot] = item._count;
                                    return acc;
                                }, {}),
                                byPriority: byPriority.reduce(function (acc, item) {
                                    acc[item.prioritas] = item._count;
                                    return acc;
                                }, {}),
                                overdue: overdue,
                            }];
                }
            });
        });
    };
    TaskService.prototype.getUpcomingDeadlines = function (userId_1, isAdmin_1) {
        return __awaiter(this, arguments, void 0, function (userId, isAdmin, days) {
            var cutoffDate, where, tasks;
            if (days === void 0) { days = 7; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cutoffDate = new Date();
                        cutoffDate.setDate(cutoffDate.getDate() + days);
                        where = {
                            hataridoDatum: {
                                not: null,
                                lte: cutoffDate,
                                gte: new Date(),
                            },
                            allapot: {
                                notIn: ['DONE', 'CANCELLED'],
                            },
                        };
                        // Jogosultság ellenőrzés: Admin mindent lát, User csak saját + hozzárendelt + board tagként látható
                        if (!isAdmin) {
                            where.OR = [
                                { assignedToId: userId },
                                { createdById: userId },
                                { board: { members: { some: { userId: userId } } } },
                            ];
                        }
                        return [4 /*yield*/, this.prisma.task.findMany({
                                where: where,
                                include: {
                                    assignedTo: {
                                        select: {
                                            id: true,
                                            nev: true,
                                            email: true,
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
                                orderBy: {
                                    hataridoDatum: 'asc',
                                },
                            })];
                    case 1:
                        tasks = _a.sent();
                        return [2 /*return*/, tasks.map(function (task) {
                                var _a;
                                return ({
                                    id: task.id,
                                    cim: task.cim,
                                    hataridoDatum: (_a = task.hataridoDatum) === null || _a === void 0 ? void 0 : _a.toISOString(),
                                    daysUntilDeadline: task.hataridoDatum
                                        ? Math.ceil((task.hataridoDatum.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                                        : null,
                                    prioritas: task.prioritas,
                                    allapot: task.allapot,
                                    assignedTo: task.assignedTo,
                                    createdBy: task.createdBy,
                                });
                            })];
                }
            });
        });
    };
    TaskService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService,
            activity_service_1.ActivityService,
            audit_service_1.AuditService])
    ], TaskService);
    return TaskService;
}());
exports.TaskService = TaskService;
