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
exports.AccountImportService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var AccountImportService = /** @class */ (function () {
    function AccountImportService(prisma) {
        this.prisma = prisma;
    }
    AccountImportService.prototype.parseCsv = function (content) {
        var lines = content.replace(/^\ufeff/, '').split(/\r?\n/).filter(function (l) { return l.trim(); });
        if (lines.length < 2)
            return [];
        var headers = this.splitCsvLine(lines[0]).map(function (h) { return h.trim().toLowerCase(); });
        var rows = [];
        var _loop_1 = function (i) {
            var cells = this_1.splitCsvLine(lines[i]);
            var map = {};
            headers.forEach(function (h, idx) {
                map[h] = (cells[idx] || '').trim();
            });
            if (!map.azonosito && !map.nev)
                return "continue";
            rows.push({
                azonosito: map.azonosito || map['egyedi azonosító'] || "IMP-".concat(i),
                nev: map.nev || map['ügyfél neve'] || map.name || '',
                tipus: map.tipus || 'vallalat',
                adoszam: map.adoszam,
                szamlazasiCim: map.szamlazasicim || map['számlázási cím'],
                szallitasiCim: map.szallitasicim || map['szállítási cím'],
                cim: map.cim,
                email: map.email,
                telefon: map.telefon,
                iparag: map.iparag,
                regio: map.regio,
                kapcsolatNev: map.kapcsolatnev || map['kapcsolattartó'],
                kapcsolatEmail: map.kapcsolatemail,
                kapcsolatTelefon: map.kapcsolattelefon,
            });
        };
        var this_1 = this;
        for (var i = 1; i < lines.length; i++) {
            _loop_1(i);
        }
        return rows;
    };
    AccountImportService.prototype.preview = function (rows) {
        return __awaiter(this, void 0, void 0, function () {
            var valid, duplicates, errors, i, row, existing;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        valid = [];
                        duplicates = [];
                        errors = [];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < rows.length)) return [3 /*break*/, 4];
                        row = rows[i];
                        if (!row.azonosito || !row.nev) {
                            errors.push({ row: i + 1, message: 'azonosito és nev kötelező' });
                            return [3 /*break*/, 3];
                        }
                        return [4 /*yield*/, this.prisma.account.findUnique({
                                where: { azonosito: row.azonosito },
                            })];
                    case 2:
                        existing = _a.sent();
                        if (existing) {
                            duplicates.push({ row: row, existingId: existing.id, action: 'update' });
                        }
                        else {
                            valid.push(row);
                        }
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, { valid: valid, duplicates: duplicates, errors: errors }];
                }
            });
        });
    };
    AccountImportService.prototype.importRows = function (rows_1) {
        return __awaiter(this, arguments, void 0, function (rows, options) {
            var created, updated, skipped, _i, rows_2, row, existing, accountData, account;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        created = 0;
                        updated = 0;
                        skipped = 0;
                        _i = 0, rows_2 = rows;
                        _a.label = 1;
                    case 1:
                        if (!(_i < rows_2.length)) return [3 /*break*/, 9];
                        row = rows_2[_i];
                        return [4 /*yield*/, this.prisma.account.findUnique({
                                where: { azonosito: row.azonosito },
                            })];
                    case 2:
                        existing = _a.sent();
                        accountData = {
                            nev: row.nev,
                            tipus: row.tipus || 'vallalat',
                            adoszam: row.adoszam,
                            cim: row.cim || row.szamlazasiCim,
                            szamlazasiCim: row.szamlazasiCim || row.cim,
                            szallitasiCim: row.szallitasiCim || row.cim,
                            email: row.email,
                            telefon: row.telefon,
                            iparag: row.iparag,
                            regio: row.regio,
                        };
                        if (!existing) return [3 /*break*/, 4];
                        if (!options.updateDuplicates) {
                            skipped++;
                            return [3 /*break*/, 8];
                        }
                        return [4 /*yield*/, this.prisma.account.update({
                                where: { id: existing.id },
                                data: accountData,
                            })];
                    case 3:
                        _a.sent();
                        updated++;
                        return [3 /*break*/, 8];
                    case 4: return [4 /*yield*/, this.prisma.account.create({
                            data: __assign({ azonosito: row.azonosito }, accountData),
                        })];
                    case 5:
                        account = _a.sent();
                        if (!row.kapcsolatNev) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.prisma.contact.create({
                                data: {
                                    accountId: account.id,
                                    nev: row.kapcsolatNev,
                                    email: row.kapcsolatEmail,
                                    telefon: row.kapcsolatTelefon,
                                    elsodleges: true,
                                },
                            })];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        created++;
                        _a.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 1];
                    case 9: return [2 /*return*/, { created: created, updated: updated, skipped: skipped }];
                }
            });
        });
    };
    AccountImportService.prototype.splitCsvLine = function (line) {
        var result = [];
        var current = '';
        var inQuotes = false;
        for (var _i = 0, line_1 = line; _i < line_1.length; _i++) {
            var char = line_1[_i];
            if (char === '"') {
                inQuotes = !inQuotes;
            }
            else if ((char === ',' || char === ';') && !inQuotes) {
                result.push(current);
                current = '';
            }
            else {
                current += char;
            }
        }
        result.push(current);
        return result;
    };
    AccountImportService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], AccountImportService);
    return AccountImportService;
}());
exports.AccountImportService = AccountImportService;
