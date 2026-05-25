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
exports.HrTimeTrackingService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var HrTimeTrackingService = /** @class */ (function () {
    function HrTimeTrackingService(prisma) {
        this.prisma = prisma;
    }
    HrTimeTrackingService.prototype.listEntries = function (employeeId, from, to) {
        return __awaiter(this, void 0, void 0, function () {
            var where;
            return __generator(this, function (_a) {
                where = { employeeId: employeeId };
                if (from || to) {
                    where.datum = {};
                    if (from)
                        where.datum.gte = new Date(from);
                    if (to)
                        where.datum.lte = new Date(to);
                }
                return [2 /*return*/, this.prisma.timeEntry.findMany({
                        where: where,
                        orderBy: { datum: 'asc' },
                        include: { importBatch: true },
                    })];
            });
        });
    };
    HrTimeTrackingService.prototype.createEntry = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (dto.ora <= 0 || dto.ora > 24)
                            throw new common_1.BadRequestException('Óra 0 és 24 között legyen');
                        return [4 /*yield*/, this.prisma.employee.findUniqueOrThrow({ where: { id: dto.employeeId } })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.prisma.timeEntry.create({
                                data: {
                                    employeeId: dto.employeeId,
                                    datum: new Date(dto.datum),
                                    ora: dto.ora,
                                    tipus: dto.tipus || 'NORMAL',
                                    megjegyzes: dto.megjegyzes,
                                    forras: dto.forras || 'KEZI',
                                },
                            })];
                }
            });
        });
    };
    HrTimeTrackingService.prototype.deleteEntry = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.timeEntry.findUniqueOrThrow({ where: { id: id } })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.prisma.timeEntry.delete({ where: { id: id } })];
                }
            });
        });
    };
    /** Egyszerű beléptető CSV: sorok employee_azonosito;yyyy-mm-dd;ora.tizedes */
    HrTimeTrackingService.prototype.importAccessCsvBuffer = function (buf, fajlNev) {
        return __awaiter(this, void 0, void 0, function () {
            var text, lines, batch, rekordok, i, line, parts, azon, dStr, oStr, emp, ora, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        text = buf.toString('utf-8').replace(/^\uFEFF/, '');
                        lines = text.split(/\r?\n/).filter(function (l) { return l.trim(); });
                        return [4 /*yield*/, this.prisma.timeImportBatch.create({
                                data: { fajlNev: fajlNev, sikeres: false },
                            })];
                    case 1:
                        batch = _a.sent();
                        rekordok = 0;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 9, , 11]);
                        i = 0;
                        _a.label = 3;
                    case 3:
                        if (!(i < lines.length)) return [3 /*break*/, 7];
                        line = lines[i].trim();
                        if (!line || line.startsWith('#'))
                            return [3 /*break*/, 6];
                        parts = line.split(/[;,\t]/).map(function (p) { return p.trim(); });
                        if (parts.length < 3)
                            return [3 /*break*/, 6];
                        azon = parts[0], dStr = parts[1], oStr = parts[2];
                        return [4 /*yield*/, this.prisma.employee.findFirst({ where: { azonosito: azon, aktiv: true } })];
                    case 4:
                        emp = _a.sent();
                        if (!emp)
                            return [3 /*break*/, 6];
                        ora = parseFloat(oStr.replace(',', '.'));
                        if (Number.isNaN(ora))
                            return [3 /*break*/, 6];
                        return [4 /*yield*/, this.prisma.timeEntry.create({
                                data: {
                                    employeeId: emp.id,
                                    datum: new Date(dStr),
                                    ora: ora,
                                    tipus: 'NORMAL',
                                    forras: 'BELTPTO_IMPORT',
                                    importBatchId: batch.id,
                                },
                            })];
                    case 5:
                        _a.sent();
                        rekordok++;
                        _a.label = 6;
                    case 6:
                        i++;
                        return [3 /*break*/, 3];
                    case 7: return [4 /*yield*/, this.prisma.timeImportBatch.update({
                            where: { id: batch.id },
                            data: { sikeres: true, rekordok: rekordok },
                        })];
                    case 8:
                        _a.sent();
                        return [2 /*return*/, { batchId: batch.id, rekordok: rekordok }];
                    case 9:
                        e_1 = _a.sent();
                        return [4 /*yield*/, this.prisma.timeImportBatch.update({
                                where: { id: batch.id },
                                data: { sikeres: false, hibaUzenet: String(e_1) },
                            })];
                    case 10:
                        _a.sent();
                        throw e_1;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    HrTimeTrackingService.prototype.listImportBatches = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.timeImportBatch.findMany({ orderBy: { letrehozva: 'desc' }, take: 50 })];
            });
        });
    };
    HrTimeTrackingService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], HrTimeTrackingService);
    return HrTimeTrackingService;
}());
exports.HrTimeTrackingService = HrTimeTrackingService;
