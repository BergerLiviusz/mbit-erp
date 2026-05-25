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
exports.TicketService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var TicketService = /** @class */ (function () {
    function TicketService(prisma) {
        this.prisma = prisma;
    }
    TicketService.prototype.findAll = function () {
        return __awaiter(this, arguments, void 0, function (skip, take) {
            var _a, total, items;
            if (skip === void 0) { skip = 0; }
            if (take === void 0) { take = 50; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            this.prisma.ticket.count(),
                            this.prisma.ticket.findMany({
                                skip: skip,
                                take: take,
                                include: {
                                    account: true,
                                    createdBy: { select: { id: true, nev: true } },
                                },
                                orderBy: { createdAt: 'desc' },
                            }),
                        ])];
                    case 1:
                        _a = _b.sent(), total = _a[0], items = _a[1];
                        return [2 /*return*/, { total: total, items: items }];
                }
            });
        });
    };
    TicketService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.ticket.findUnique({
                        where: { id: id },
                        include: {
                            account: true,
                            messages: true,
                        },
                    })];
            });
        });
    };
    TicketService.prototype.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var ticketCount, azonosito;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.ticket.count()];
                    case 1:
                        ticketCount = _a.sent();
                        azonosito = "T-".concat(new Date().getFullYear(), "-").concat(String(ticketCount + 1).padStart(5, '0'));
                        return [2 /*return*/, this.prisma.ticket.create({
                                data: __assign(__assign({}, data), { azonosito: azonosito }),
                            })];
                }
            });
        });
    };
    TicketService.prototype.update = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.ticket.update({
                        where: { id: id },
                        data: data,
                    })];
            });
        });
    };
    TicketService.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.ticket.delete({
                        where: { id: id },
                    })];
            });
        });
    };
    TicketService.prototype.assign = function (id, assignedToId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.ticket.update({
                        where: { id: id },
                        data: { assignedToId: assignedToId, allapot: 'folyamatban' },
                        include: { assignedTo: { select: { id: true, nev: true } }, account: true },
                    })];
            });
        });
    };
    TicketService.prototype.escalate = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.ticket.update({
                        where: { id: id },
                        data: { eszkalalva: true, allapot: 'eszkalalt', prioritas: 'magas' },
                    })];
            });
        });
    };
    TicketService.prototype.changeStatus = function (id, allapot) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                data = { allapot: allapot };
                if (allapot === 'lezart')
                    data.lezarasDatum = new Date();
                return [2 /*return*/, this.prisma.ticket.update({ where: { id: id }, data: data })];
            });
        });
    };
    TicketService.prototype.exportReport = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.ticket.findMany({
                        include: {
                            account: { select: { nev: true, azonosito: true } },
                            assignedTo: { select: { nev: true } },
                        },
                        orderBy: { createdAt: 'desc' },
                    })];
            });
        });
    };
    TicketService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], TicketService);
    return TicketService;
}());
exports.TicketService = TicketService;
