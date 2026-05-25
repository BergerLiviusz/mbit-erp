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
exports.CustomerInteractionService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var ExcelJS = __importStar(require("exceljs"));
var CustomerInteractionService = /** @class */ (function () {
    function CustomerInteractionService(prisma) {
        this.prisma = prisma;
    }
    CustomerInteractionService.prototype.findByAccount = function (accountId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.customerInteraction.findMany({
                        where: { accountId: accountId },
                        include: { felelos: { select: { id: true, nev: true, email: true } } },
                        orderBy: { datum: 'desc' },
                    })];
            });
        });
    };
    CustomerInteractionService.prototype.getLifecycle = function (accountId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, interactions, messages, tickets, quotes, orders, tasks, timeline;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            this.findByAccount(accountId),
                            this.prisma.message.findMany({
                                where: { accountId: accountId },
                                include: { createdBy: { select: { nev: true } } },
                                orderBy: { createdAt: 'desc' },
                            }),
                            this.prisma.ticket.findMany({
                                where: { accountId: accountId },
                                orderBy: { createdAt: 'desc' },
                            }),
                            this.prisma.quote.findMany({
                                where: { accountId: accountId },
                                select: { id: true, azonosito: true, allapot: true, vegosszeg: true, createdAt: true },
                                orderBy: { createdAt: 'desc' },
                            }),
                            this.prisma.order.findMany({
                                where: { accountId: accountId },
                                select: { id: true, azonosito: true, allapot: true, vegosszeg: true, createdAt: true },
                                orderBy: { createdAt: 'desc' },
                            }),
                            this.prisma.task.findMany({
                                where: { accountId: accountId },
                                select: { id: true, cim: true, allapot: true, hataridoDatum: true, createdAt: true },
                                orderBy: { createdAt: 'desc' },
                            }),
                        ])];
                    case 1:
                        _a = _b.sent(), interactions = _a[0], messages = _a[1], tickets = _a[2], quotes = _a[3], orders = _a[4], tasks = _a[5];
                        timeline = __spreadArray(__spreadArray(__spreadArray([], interactions.map(function (i) { return ({
                            type: 'interaction',
                            date: i.datum,
                            id: i.id,
                            title: i.targy,
                            detail: i.tartalom,
                            meta: i,
                        }); }), true), messages.map(function (m) { return ({
                            type: 'communication',
                            date: m.createdAt,
                            id: m.id,
                            title: m.targy || m.channel,
                            detail: m.szoveg,
                            meta: m,
                        }); }), true), tickets.map(function (t) { return ({
                            type: 'ticket',
                            date: t.createdAt,
                            id: t.id,
                            title: t.targy,
                            detail: t.allapot,
                            meta: t,
                        }); }), true).sort(function (a, b) { return new Date(b.date).getTime() - new Date(a.date).getTime(); });
                        return [2 /*return*/, { timeline: timeline, interactions: interactions, messages: messages, tickets: tickets, quotes: quotes, orders: orders, tasks: tasks }];
                }
            });
        });
    };
    CustomerInteractionService.prototype.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.customerInteraction.create({
                        data: __assign(__assign({}, data), { datum: data.datum ? new Date(data.datum) : new Date(), kovetkezoHatarido: data.kovetkezoHatarido
                                ? new Date(data.kovetkezoHatarido)
                                : undefined }),
                        include: { felelos: { select: { id: true, nev: true } } },
                    })];
            });
        });
    };
    CustomerInteractionService.prototype.update = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var existing;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.customerInteraction.findUnique({ where: { id: id } })];
                    case 1:
                        existing = _a.sent();
                        if (!existing)
                            throw new common_1.NotFoundException('Interakció nem található');
                        return [2 /*return*/, this.prisma.customerInteraction.update({
                                where: { id: id },
                                data: __assign(__assign({}, data), (data.kovetkezoHatarido && {
                                    kovetkezoHatarido: new Date(data.kovetkezoHatarido),
                                })),
                            })];
                }
            });
        });
    };
    CustomerInteractionService.prototype.report = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (type) {
                    case 'by-account':
                        return [2 /*return*/, this.prisma.customerInteraction.groupBy({
                                by: ['accountId'],
                                _count: { id: true },
                            })];
                    case 'by-sales':
                        return [2 /*return*/, this.prisma.customerInteraction.groupBy({
                                by: ['felelosId'],
                                _count: { id: true },
                            })];
                    case 'open-followups':
                        return [2 /*return*/, this.prisma.customerInteraction.findMany({
                                where: { allapot: 'NYITOTT', kovetkezoHatarido: { not: null } },
                                include: {
                                    account: { select: { nev: true, azonosito: true } },
                                    felelos: { select: { nev: true } },
                                },
                            })];
                    case 'overdue':
                        return [2 /*return*/, this.prisma.customerInteraction.findMany({
                                where: {
                                    allapot: 'NYITOTT',
                                    kovetkezoHatarido: { lt: new Date() },
                                },
                                include: {
                                    account: { select: { nev: true, azonosito: true } },
                                    felelos: { select: { nev: true } },
                                },
                            })];
                    default:
                        return [2 /*return*/, []];
                }
                return [2 /*return*/];
            });
        });
    };
    CustomerInteractionService.prototype.exportReport = function (type, format) {
        return __awaiter(this, void 0, void 0, function () {
            var rows, workbook, sheet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.report(type)];
                    case 1:
                        rows = _a.sent();
                        if (format === 'csv') {
                            return [2 /*return*/, JSON.stringify(rows)];
                        }
                        workbook = new ExcelJS.Workbook();
                        sheet = workbook.addWorksheet('Riport');
                        sheet.addRow(['Adat']);
                        (Array.isArray(rows) ? rows : []).forEach(function (r) { return sheet.addRow([JSON.stringify(r)]); });
                        return [2 /*return*/, workbook.xlsx.writeBuffer()];
                }
            });
        });
    };
    CustomerInteractionService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], CustomerInteractionService);
    return CustomerInteractionService;
}());
exports.CustomerInteractionService = CustomerInteractionService;
