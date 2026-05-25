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
exports.ChatService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var ChatService = /** @class */ (function () {
    function ChatService(prisma) {
        this.prisma = prisma;
    }
    ChatService.prototype.findAllRooms = function () {
        return __awaiter(this, arguments, void 0, function (skip, take, filters) {
            var where, _a, total, items;
            if (skip === void 0) { skip = 0; }
            if (take === void 0) { take = 50; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        where = {};
                        if (filters === null || filters === void 0 ? void 0 : filters.accountId) {
                            where.accountId = filters.accountId;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.allapot) {
                            where.allapot = filters.allapot;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.userId) {
                            where.participants = {
                                some: {
                                    userId: filters.userId,
                                    elhagyott: null,
                                },
                            };
                        }
                        return [4 /*yield*/, Promise.all([
                                this.prisma.chatRoom.count({ where: where }),
                                this.prisma.chatRoom.findMany({
                                    where: where,
                                    skip: skip,
                                    take: take,
                                    include: {
                                        account: {
                                            select: {
                                                id: true,
                                                nev: true,
                                                azonosito: true,
                                            },
                                        },
                                        messages: {
                                            orderBy: {
                                                createdAt: 'desc',
                                            },
                                            take: 1,
                                            include: {
                                                user: {
                                                    select: {
                                                        id: true,
                                                        nev: true,
                                                    },
                                                },
                                            },
                                        },
                                        participants: {
                                            where: {
                                                elhagyott: null,
                                            },
                                            include: {
                                                user: {
                                                    select: {
                                                        id: true,
                                                        nev: true,
                                                    },
                                                },
                                            },
                                        },
                                        _count: {
                                            select: {
                                                messages: true,
                                                participants: true,
                                            },
                                        },
                                    },
                                    orderBy: {
                                        updatedAt: 'desc',
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
    ChatService.prototype.findRoom = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var room;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.chatRoom.findUnique({
                            where: { id: id },
                            include: {
                                account: true,
                                messages: {
                                    include: {
                                        user: {
                                            select: {
                                                id: true,
                                                nev: true,
                                                email: true,
                                            },
                                        },
                                    },
                                    orderBy: {
                                        createdAt: 'asc',
                                    },
                                },
                                participants: {
                                    where: {
                                        elhagyott: null,
                                    },
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
                        room = _a.sent();
                        if (!room) {
                            throw new common_1.NotFoundException('Chat szoba nem található');
                        }
                        return [2 /*return*/, room];
                }
            });
        });
    };
    ChatService.prototype.createRoom = function (dto, createdByUserId) {
        return __awaiter(this, void 0, void 0, function () {
            var account, room;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.account.findUnique({
                            where: { id: dto.accountId },
                        })];
                    case 1:
                        account = _a.sent();
                        if (!account) {
                            throw new common_1.NotFoundException('Ügyfél nem található');
                        }
                        return [4 /*yield*/, this.prisma.chatRoom.create({
                                data: {
                                    accountId: dto.accountId,
                                    nev: dto.nev || "Chat - ".concat(account.nev),
                                    participants: {
                                        create: __spreadArray(__spreadArray(__spreadArray([], (createdByUserId ? [{
                                                userId: createdByUserId,
                                                szerep: 'ADMIN',
                                            }] : []), true), (dto.participantUserIds || []).map(function (userId) { return ({
                                            userId: userId,
                                            szerep: 'PARTICIPANT',
                                        }); }), true), (dto.externalParticipants || []).map(function (name) { return ({
                                            felhaszCsak: name,
                                            szerep: 'PARTICIPANT',
                                        }); }), true),
                                    },
                                },
                                include: {
                                    account: true,
                                    participants: true,
                                },
                            })];
                    case 2:
                        room = _a.sent();
                        return [2 /*return*/, room];
                }
            });
        });
    };
    ChatService.prototype.updateRoom = function (id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var room;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findRoom(id)];
                    case 1:
                        room = _a.sent();
                        return [2 /*return*/, this.prisma.chatRoom.update({
                                where: { id: id },
                                data: {
                                    nev: dto.nev,
                                    allapot: dto.allapot,
                                },
                                include: {
                                    account: true,
                                    participants: true,
                                },
                            })];
                }
            });
        });
    };
    ChatService.prototype.addParticipant = function (roomId, userId, externalName) {
        return __awaiter(this, void 0, void 0, function () {
            var room, existing;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findRoom(roomId)];
                    case 1:
                        room = _a.sent();
                        if (room.allapot === 'LEZART') {
                            throw new common_1.BadRequestException('Lezárt chat szobához nem adható hozzá résztvevő');
                        }
                        if (!userId) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.prisma.chatParticipant.findUnique({
                                where: {
                                    chatRoomId_userId: {
                                        chatRoomId: roomId,
                                        userId: userId,
                                    },
                                },
                            })];
                    case 2:
                        existing = _a.sent();
                        if (existing && !existing.elhagyott) {
                            throw new common_1.BadRequestException('A felhasználó már résztvevő');
                        }
                        if (existing && existing.elhagyott) {
                            // Rejoin
                            return [2 /*return*/, this.prisma.chatParticipant.update({
                                    where: { id: existing.id },
                                    data: {
                                        elhagyott: null,
                                    },
                                })];
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/, this.prisma.chatParticipant.create({
                            data: {
                                chatRoomId: roomId,
                                userId: userId,
                                felhaszCsak: externalName,
                            },
                        })];
                }
            });
        });
    };
    ChatService.prototype.removeParticipant = function (roomId, userId, externalName) {
        return __awaiter(this, void 0, void 0, function () {
            var room, participant_1, participant;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findRoom(roomId)];
                    case 1:
                        room = _a.sent();
                        if (!userId) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.prisma.chatParticipant.findUnique({
                                where: {
                                    chatRoomId_userId: {
                                        chatRoomId: roomId,
                                        userId: userId,
                                    },
                                },
                            })];
                    case 2:
                        participant_1 = _a.sent();
                        if (!participant_1 || participant_1.elhagyott) {
                            throw new common_1.NotFoundException('Résztvevő nem található');
                        }
                        return [2 /*return*/, this.prisma.chatParticipant.update({
                                where: { id: participant_1.id },
                                data: {
                                    elhagyott: new Date(),
                                },
                            })];
                    case 3: return [4 /*yield*/, this.prisma.chatParticipant.findFirst({
                            where: {
                                chatRoomId: roomId,
                                felhaszCsak: externalName,
                                elhagyott: null,
                            },
                        })];
                    case 4:
                        participant = _a.sent();
                        if (!participant) {
                            throw new common_1.NotFoundException('Résztvevő nem található');
                        }
                        return [2 /*return*/, this.prisma.chatParticipant.update({
                                where: { id: participant.id },
                                data: {
                                    elhagyott: new Date(),
                                },
                            })];
                }
            });
        });
    };
    ChatService.prototype.sendMessage = function (roomId, dto, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var room, participant, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findRoom(roomId)];
                    case 1:
                        room = _a.sent();
                        if (room.allapot === 'LEZART') {
                            throw new common_1.BadRequestException('Lezárt chat szobába nem küldhető üzenet');
                        }
                        if (!userId) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.prisma.chatParticipant.findFirst({
                                where: {
                                    chatRoomId: roomId,
                                    userId: userId,
                                    elhagyott: null,
                                },
                            })];
                    case 2:
                        participant = _a.sent();
                        if (!participant) {
                            throw new common_1.BadRequestException('Nem vagy résztvevő ebben a chat szobában');
                        }
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.prisma.chatMessage.create({
                            data: {
                                chatRoomId: roomId,
                                userId: userId,
                                felhaszCsak: dto.felhaszCsak,
                                szoveg: dto.szoveg,
                                tipus: dto.tipus || 'TEXT',
                                fajlUtvonal: dto.fajlUtvonal,
                            },
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        nev: true,
                                        email: true,
                                    },
                                },
                            },
                        })];
                    case 4:
                        message = _a.sent();
                        // Update room's last message timestamp
                        return [4 /*yield*/, this.prisma.chatRoom.update({
                                where: { id: roomId },
                                data: {
                                    updatedAt: new Date(),
                                },
                            })];
                    case 5:
                        // Update room's last message timestamp
                        _a.sent();
                        return [2 /*return*/, message];
                }
            });
        });
    };
    ChatService.prototype.markMessagesAsRead = function (roomId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var room;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findRoom(roomId)];
                    case 1:
                        room = _a.sent();
                        return [4 /*yield*/, this.prisma.chatMessage.updateMany({
                                where: {
                                    chatRoomId: roomId,
                                    userId: {
                                        not: userId,
                                    },
                                    olvasva: false,
                                },
                                data: {
                                    olvasva: true,
                                    olvasvaDatum: new Date(),
                                },
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { success: true }];
                }
            });
        });
    };
    ChatService.prototype.getUnreadCount = function (roomId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.chatMessage.count({
                            where: {
                                chatRoomId: roomId,
                                userId: {
                                    not: userId,
                                },
                                olvasva: false,
                            },
                        })];
                    case 1:
                        count = _a.sent();
                        return [2 /*return*/, { count: count }];
                }
            });
        });
    };
    ChatService.prototype.closeRoom = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var room;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findRoom(id)];
                    case 1:
                        room = _a.sent();
                        return [2 /*return*/, this.prisma.chatRoom.update({
                                where: { id: id },
                                data: {
                                    allapot: 'LEZART',
                                },
                            })];
                }
            });
        });
    };
    ChatService.prototype.deleteRoom = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var room;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findRoom(id)];
                    case 1:
                        room = _a.sent();
                        if (room.allapot !== 'LEZART') {
                            throw new common_1.BadRequestException('Csak lezárt chat szoba törölhető');
                        }
                        return [2 /*return*/, this.prisma.chatRoom.delete({
                                where: { id: id },
                            })];
                }
            });
        });
    };
    ChatService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], ChatService);
    return ChatService;
}());
exports.ChatService = ChatService;
