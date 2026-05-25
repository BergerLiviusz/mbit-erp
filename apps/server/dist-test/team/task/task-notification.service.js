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
exports.TaskNotificationService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../../prisma/prisma.service");
var TaskNotificationService = /** @class */ (function () {
    function TaskNotificationService(prisma) {
        this.prisma = prisma;
    }
    TaskNotificationService.prototype.generateMailtoLink = function (taskId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var task, recipientId, recipient, subject, body, mailtoUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.task.findUnique({
                            where: { id: taskId },
                            include: {
                                assignedTo: {
                                    select: {
                                        id: true,
                                        email: true,
                                        nev: true,
                                    },
                                },
                                createdBy: {
                                    select: {
                                        id: true,
                                        email: true,
                                        nev: true,
                                    },
                                },
                                board: {
                                    select: {
                                        id: true,
                                        nev: true,
                                    },
                                },
                            },
                        })];
                    case 1:
                        task = _a.sent();
                        if (!task) {
                            throw new common_1.NotFoundException('Feladat nem található');
                        }
                        recipientId = userId || task.assignedToId;
                        if (!recipientId) {
                            throw new common_1.NotFoundException('Nincs címzett megadva a feladathoz');
                        }
                        return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { id: recipientId },
                                select: {
                                    email: true,
                                    nev: true,
                                },
                            })];
                    case 2:
                        recipient = _a.sent();
                        if (!recipient || !recipient.email) {
                            throw new common_1.NotFoundException('Címzett email címe nem található');
                        }
                        subject = this.generateEmailSubject(task);
                        body = this.generateEmailBody(task);
                        mailtoUrl = "mailto:".concat(encodeURIComponent(recipient.email), "?subject=").concat(encodeURIComponent(subject), "&body=").concat(encodeURIComponent(body));
                        return [2 /*return*/, {
                                mailtoUrl: mailtoUrl,
                                subject: subject,
                                body: body,
                                recipient: {
                                    email: recipient.email,
                                    nev: recipient.nev,
                                },
                            }];
                }
            });
        });
    };
    TaskNotificationService.prototype.generateEmailSubject = function (task) {
        return 'Új feladat az Mbit rendszerben!';
    };
    TaskNotificationService.prototype.generateEmailBody = function (task) {
        var _a;
        var body = '';
        // Header
        body += 'Kedves Kolléga!\n\n';
        body += 'Új feladatot rendeltem hozzá Önhöz az Mbit ERP rendszerben.\n\n';
        // Task title
        body += '═══════════════════════════════════════\n';
        body += "FELADAT: ".concat(task.cim, "\n");
        body += '═══════════════════════════════════════\n\n';
        // Description
        if (task.leiras) {
            body += "Le\u00EDr\u00E1s:\n".concat(task.leiras, "\n\n");
        }
        // Details
        body += 'Részletek:\n';
        body += '───────────────────────────────────────\n';
        if (task.board) {
            body += "Board: ".concat(task.board.nev, "\n");
        }
        if (task.prioritas) {
            var priorityMap = {
                LOW: 'Alacsony',
                MEDIUM: 'Közepes',
                HIGH: 'Magas',
                URGENT: 'Sürgős',
            };
            body += "Priorit\u00E1s: ".concat(priorityMap[task.prioritas] || task.prioritas, "\n");
        }
        if (task.hataridoDatum) {
            var deadline = new Date(task.hataridoDatum);
            body += "Hat\u00E1rid\u0151: ".concat(deadline.toLocaleDateString('hu-HU'), "\n");
        }
        if (task.createdBy) {
            body += "L\u00E9trehozta: ".concat(task.createdBy.nev, "\n");
        }
        body += '───────────────────────────────────────\n\n';
        // Footer
        body += 'Kérjük, hogy tekintse át a feladatot a rendszerben.\n\n';
        body += 'Üdvözlettel,\n';
        body += ((_a = task.createdBy) === null || _a === void 0 ? void 0 : _a.nev) || 'Mbit ERP Rendszer';
        return body;
    };
    TaskNotificationService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], TaskNotificationService);
    return TaskNotificationService;
}());
exports.TaskNotificationService = TaskNotificationService;
