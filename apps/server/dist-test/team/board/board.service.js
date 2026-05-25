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
exports.BoardService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../../prisma/prisma.service");
var add_member_dto_1 = require("./dto/add-member.dto");
var audit_service_1 = require("../../common/audit/audit.service");
var BoardService = /** @class */ (function () {
    function BoardService(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    BoardService.prototype.findUserBoards = function (userId, isAdmin) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (isAdmin) {
                    return [2 /*return*/, this.prisma.taskBoard.findMany({
                            include: {
                                createdBy: {
                                    select: {
                                        id: true,
                                        nev: true,
                                        email: true,
                                    },
                                },
                                _count: {
                                    select: {
                                        tasks: true,
                                        members: true,
                                    },
                                },
                            },
                            orderBy: [
                                { isDefault: 'desc' },
                                { createdAt: 'desc' },
                            ],
                        })];
                }
                return [2 /*return*/, this.prisma.taskBoard.findMany({
                        where: {
                            OR: [
                                { createdById: userId },
                                { members: { some: { userId: userId } } },
                            ],
                        },
                        include: {
                            createdBy: {
                                select: {
                                    id: true,
                                    nev: true,
                                    email: true,
                                },
                            },
                            _count: {
                                select: {
                                    tasks: true,
                                    members: true,
                                },
                            },
                        },
                        orderBy: [
                            { isDefault: 'desc' },
                            { createdAt: 'desc' },
                        ],
                    })];
            });
        });
    };
    BoardService.prototype.findOne = function (id, userId, isAdmin) {
        return __awaiter(this, void 0, void 0, function () {
            var board, canView;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.taskBoard.findUnique({
                            where: { id: id },
                            include: {
                                createdBy: {
                                    select: {
                                        id: true,
                                        nev: true,
                                        email: true,
                                    },
                                },
                                columns: {
                                    orderBy: { pozicio: 'asc' },
                                },
                                members: {
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
                                tasks: {
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
                                },
                            },
                        })];
                    case 1:
                        board = _a.sent();
                        if (!board) {
                            throw new common_1.NotFoundException('Board nem található');
                        }
                        // Jogosultság ellenőrzés
                        if (!isAdmin) {
                            canView = board.createdById === userId ||
                                board.members.some(function (m) { return m.userId === userId; });
                            if (!canView) {
                                throw new common_1.ForbiddenException('Nincs jogosultságod a board megtekintéséhez');
                            }
                        }
                        return [2 /*return*/, board];
                }
            });
        });
    };
    BoardService.prototype.create = function (dto, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var userExists, adminUser, board, defaultColumns;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
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
                            userId = adminUser.id;
                        }
                        else {
                            userId = null;
                        }
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.prisma.taskBoard.create({
                            data: __assign(__assign({}, dto), { createdById: userId || undefined }),
                            include: {
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
                        board = _a.sent();
                        defaultColumns = [
                            { nev: 'Teendők', allapot: 'TODO', pozicio: 0 },
                            { nev: 'Folyamatban', allapot: 'IN_PROGRESS', pozicio: 1 },
                            { nev: 'Kész', allapot: 'DONE', pozicio: 2 },
                        ];
                        return [4 /*yield*/, Promise.all(defaultColumns.map(function (col) {
                                return _this.prisma.taskColumn.create({
                                    data: __assign({ boardId: board.id }, col),
                                });
                            }))];
                    case 5:
                        _a.sent();
                        if (!userId) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.prisma.taskBoardMember.create({
                                data: {
                                    boardId: board.id,
                                    userId: userId,
                                    jogosultsag: add_member_dto_1.BoardMemberPermission.ADMIN,
                                },
                            })];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: 
                    // Audit log
                    return [4 /*yield*/, this.auditService.logCreate('TaskBoard', board.id, board, userId)];
                    case 8:
                        // Audit log
                        _a.sent();
                        return [2 /*return*/, this.findOne(board.id, userId, true)];
                }
            });
        });
    };
    BoardService.prototype.update = function (id, dto, userId, isAdmin) {
        return __awaiter(this, void 0, void 0, function () {
            var board, member, oldData, updatedBoard;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id, userId, isAdmin)];
                    case 1:
                        board = _a.sent();
                        // Jogosultság ellenőrzés: csak admin vagy board admin szerkeszthet
                        if (!isAdmin) {
                            member = board.members.find(function (m) { return m.userId === userId; });
                            if (!member || member.jogosultsag !== add_member_dto_1.BoardMemberPermission.ADMIN) {
                                throw new common_1.ForbiddenException('Nincs jogosultságod a board szerkesztéséhez');
                            }
                        }
                        oldData = __assign({}, board);
                        return [4 /*yield*/, this.prisma.taskBoard.update({
                                where: { id: id },
                                data: dto,
                            })];
                    case 2:
                        updatedBoard = _a.sent();
                        // Audit log
                        return [4 /*yield*/, this.auditService.logUpdate('TaskBoard', id, oldData, updatedBoard, userId)];
                    case 3:
                        // Audit log
                        _a.sent();
                        return [2 /*return*/, this.findOne(id, userId, isAdmin)];
                }
            });
        });
    };
    BoardService.prototype.delete = function (id, userId, isAdmin) {
        return __awaiter(this, void 0, void 0, function () {
            var board;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id, userId, isAdmin)];
                    case 1:
                        board = _a.sent();
                        // Jogosultság ellenőrzés: csak admin vagy board létrehozó törölhet
                        if (!isAdmin && board.createdById !== userId) {
                            throw new common_1.ForbiddenException('Nincs jogosultságod a board törléséhez');
                        }
                        return [4 /*yield*/, this.prisma.taskBoard.delete({
                                where: { id: id },
                            })];
                    case 2:
                        _a.sent();
                        // Audit log
                        return [4 /*yield*/, this.auditService.logDelete('TaskBoard', id, board, userId)];
                    case 3:
                        // Audit log
                        _a.sent();
                        return [2 /*return*/, { success: true }];
                }
            });
        });
    };
    BoardService.prototype.addMember = function (id, dto, userId, isAdmin) {
        return __awaiter(this, void 0, void 0, function () {
            var board, member_1, member;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id, userId, isAdmin)];
                    case 1:
                        board = _a.sent();
                        // Jogosultság ellenőrzés: csak admin vagy board admin adhat hozzá tagot
                        if (!isAdmin) {
                            member_1 = board.members.find(function (m) { return m.userId === userId; });
                            if (!member_1 || member_1.jogosultsag !== add_member_dto_1.BoardMemberPermission.ADMIN) {
                                throw new common_1.ForbiddenException('Nincs jogosultságod tag hozzáadásához');
                            }
                        }
                        return [4 /*yield*/, this.prisma.taskBoardMember.upsert({
                                where: {
                                    boardId_userId: {
                                        boardId: id,
                                        userId: dto.userId,
                                    },
                                },
                                create: {
                                    boardId: id,
                                    userId: dto.userId,
                                    jogosultsag: dto.jogosultsag,
                                },
                                update: {
                                    jogosultsag: dto.jogosultsag,
                                },
                            })];
                    case 2:
                        member = _a.sent();
                        return [2 /*return*/, member];
                }
            });
        });
    };
    BoardService.prototype.removeMember = function (id, memberUserId, userId, isAdmin) {
        return __awaiter(this, void 0, void 0, function () {
            var board, member;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id, userId, isAdmin)];
                    case 1:
                        board = _a.sent();
                        // Jogosultság ellenőrzés: csak admin vagy board admin távolíthat el tagot
                        if (!isAdmin) {
                            member = board.members.find(function (m) { return m.userId === userId; });
                            if (!member || member.jogosultsag !== add_member_dto_1.BoardMemberPermission.ADMIN) {
                                throw new common_1.ForbiddenException('Nincs jogosultságod tag eltávolításához');
                            }
                        }
                        // Létrehozó nem távolítható el
                        if (board.createdById === memberUserId) {
                            throw new common_1.ForbiddenException('A board létrehozója nem távolítható el');
                        }
                        return [4 /*yield*/, this.prisma.taskBoardMember.delete({
                                where: {
                                    boardId_userId: {
                                        boardId: id,
                                        userId: memberUserId,
                                    },
                                },
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { success: true }];
                }
            });
        });
    };
    BoardService.prototype.getColumns = function (boardId, userId, isAdmin) {
        return __awaiter(this, void 0, void 0, function () {
            var board;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(boardId, userId, isAdmin)];
                    case 1:
                        board = _a.sent();
                        return [2 /*return*/, board.columns];
                }
            });
        });
    };
    BoardService.prototype.createColumn = function (boardId, data, userId, isAdmin) {
        return __awaiter(this, void 0, void 0, function () {
            var board, member, column;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(boardId, userId, isAdmin)];
                    case 1:
                        board = _a.sent();
                        // Jogosultság ellenőrzés
                        if (!isAdmin) {
                            member = board.members.find(function (m) { return m.userId === userId; });
                            if (!member || member.jogosultsag !== add_member_dto_1.BoardMemberPermission.ADMIN) {
                                throw new common_1.ForbiddenException('Nincs jogosultságod oszlop létrehozásához');
                            }
                        }
                        return [4 /*yield*/, this.prisma.taskColumn.create({
                                data: __assign({ boardId: boardId }, data),
                            })];
                    case 2:
                        column = _a.sent();
                        return [2 /*return*/, column];
                }
            });
        });
    };
    BoardService.prototype.updateColumn = function (boardId, columnId, data, userId, isAdmin) {
        return __awaiter(this, void 0, void 0, function () {
            var board, member, column;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(boardId, userId, isAdmin)];
                    case 1:
                        _a.sent();
                        if (!!isAdmin) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.findOne(boardId, userId, isAdmin)];
                    case 2:
                        board = _a.sent();
                        member = board.members.find(function (m) { return m.userId === userId; });
                        if (!member || member.jogosultsag !== add_member_dto_1.BoardMemberPermission.ADMIN) {
                            throw new common_1.ForbiddenException('Nincs jogosultságod oszlop szerkesztéséhez');
                        }
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.prisma.taskColumn.update({
                            where: { id: columnId },
                            data: data,
                        })];
                    case 4:
                        column = _a.sent();
                        return [2 /*return*/, column];
                }
            });
        });
    };
    BoardService.prototype.deleteColumn = function (boardId, columnId, userId, isAdmin) {
        return __awaiter(this, void 0, void 0, function () {
            var board, member;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(boardId, userId, isAdmin)];
                    case 1:
                        _a.sent();
                        if (!!isAdmin) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.findOne(boardId, userId, isAdmin)];
                    case 2:
                        board = _a.sent();
                        member = board.members.find(function (m) { return m.userId === userId; });
                        if (!member || member.jogosultsag !== add_member_dto_1.BoardMemberPermission.ADMIN) {
                            throw new common_1.ForbiddenException('Nincs jogosultságod oszlop törléséhez');
                        }
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.prisma.taskColumn.delete({
                            where: { id: columnId },
                        })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, { success: true }];
                }
            });
        });
    };
    BoardService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService,
            audit_service_1.AuditService])
    ], BoardService);
    return BoardService;
}());
exports.BoardService = BoardService;
