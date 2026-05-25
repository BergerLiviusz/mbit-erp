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
exports.IntrastatService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var IntrastatService = /** @class */ (function () {
    function IntrastatService(prisma) {
        this.prisma = prisma;
    }
    IntrastatService.prototype.findAll = function () {
        return __awaiter(this, arguments, void 0, function (skip, take, filters) {
            var where, _a, total, items;
            if (skip === void 0) { skip = 0; }
            if (take === void 0) { take = 50; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        where = {};
                        if (filters === null || filters === void 0 ? void 0 : filters.ev) {
                            where.ev = filters.ev;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.honap) {
                            where.honap = filters.honap;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.allapot) {
                            where.allapot = filters.allapot;
                        }
                        return [4 /*yield*/, Promise.all([
                                this.prisma.intrastatDeclaration.count({ where: where }),
                                this.prisma.intrastatDeclaration.findMany({
                                    where: where,
                                    skip: skip,
                                    take: take,
                                    include: {
                                        _count: {
                                            select: {
                                                items: true,
                                            },
                                        },
                                    },
                                    orderBy: [
                                        { ev: 'desc' },
                                        { honap: 'desc' },
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
    IntrastatService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var declaration;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.intrastatDeclaration.findUnique({
                            where: { id: id },
                            include: {
                                items: {
                                    include: {
                                        item: {
                                            select: {
                                                id: true,
                                                nev: true,
                                                azonosito: true,
                                            },
                                        },
                                    },
                                    orderBy: {
                                        partnerOrszagKod: 'asc',
                                    },
                                },
                            },
                        })];
                    case 1:
                        declaration = _a.sent();
                        if (!declaration) {
                            throw new common_1.NotFoundException('INTRASTAT bejelentés nem található');
                        }
                        return [2 /*return*/, declaration];
                }
            });
        });
    };
    IntrastatService.prototype.findByEvHonap = function (ev, honap) {
        return __awaiter(this, void 0, void 0, function () {
            var declaration;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.intrastatDeclaration.findUnique({
                            where: {
                                ev_honap: {
                                    ev: ev,
                                    honap: honap,
                                },
                            },
                            include: {
                                items: {
                                    include: {
                                        item: true,
                                    },
                                },
                            },
                        })];
                    case 1:
                        declaration = _a.sent();
                        return [2 /*return*/, declaration];
                }
            });
        });
    };
    IntrastatService.prototype.create = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var existing;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.intrastatDeclaration.findFirst({
                            where: {
                                ev: dto.ev,
                                honap: dto.honap,
                            },
                        })];
                    case 1:
                        existing = _a.sent();
                        if (existing) {
                            throw new common_1.BadRequestException('Ez a hónapra már létezik INTRASTAT bejelentés');
                        }
                        // Validate month
                        if (dto.honap < 1 || dto.honap > 12) {
                            throw new common_1.BadRequestException('Érvénytelen hónap');
                        }
                        return [2 /*return*/, this.prisma.intrastatDeclaration.create({
                                data: {
                                    ev: dto.ev,
                                    honap: dto.honap,
                                    megjegyzesek: dto.megjegyzesek,
                                    allapot: 'NYITOTT',
                                },
                                include: {
                                    items: true,
                                },
                            })];
                }
            });
        });
    };
    IntrastatService.prototype.addItem = function (declarationId, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var declaration, szallitasiModNum;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(declarationId)];
                    case 1:
                        declaration = _a.sent();
                        if (declaration.allapot !== 'NYITOTT') {
                            throw new common_1.BadRequestException('Csak nyitott bejelentéshez lehet tételt hozzáadni');
                        }
                        // Validate irany
                        if (dto.irany !== 'BEVETEL' && dto.irany !== 'KIVETEL') {
                            throw new common_1.BadRequestException('Érvénytelen irány. Használjon BEVETEL vagy KIVETEL értéket');
                        }
                        // Validate partner country code (ISO 3166-1 alpha-2)
                        if (!/^[A-Z]{2}$/.test(dto.partnerOrszagKod)) {
                            throw new common_1.BadRequestException('Érvénytelen országkód. Használjon ISO 3166-1 alpha-2 formátumot (pl. DE, FR)');
                        }
                        szallitasiModNum = parseInt(dto.szallitasiMod);
                        if (isNaN(szallitasiModNum) || szallitasiModNum < 1 || szallitasiModNum > 9) {
                            throw new common_1.BadRequestException('Érvénytelen szállítási mód. Használjon 1-9 közötti számot');
                        }
                        return [2 /*return*/, this.prisma.intrastatItem.create({
                                data: {
                                    intrastatDeclarationId: declarationId,
                                    itemId: dto.itemId || undefined,
                                    irany: dto.irany,
                                    partnerOrszagKod: dto.partnerOrszagKod,
                                    szallitasiMod: dto.szallitasiMod,
                                    statisztikaiErtek: dto.statisztikaiErtek,
                                    nettoSuly: dto.nettoSuly || undefined,
                                    kiegeszitoEgyseg: dto.kiegeszitoEgyseg || undefined,
                                    kiegeszitoMennyiseg: dto.kiegeszitoMennyiseg || undefined,
                                    termekkod: dto.termekkod || undefined,
                                    megjegyzesek: dto.megjegyzesek,
                                },
                                include: {
                                    item: true,
                                },
                            })];
                }
            });
        });
    };
    IntrastatService.prototype.updateItem = function (declarationId, itemId, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var declaration, item, szallitasiModNum;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(declarationId)];
                    case 1:
                        declaration = _a.sent();
                        if (declaration.allapot !== 'NYITOTT') {
                            throw new common_1.BadRequestException('Csak nyitott bejelentés módosítható');
                        }
                        return [4 /*yield*/, this.prisma.intrastatItem.findFirst({
                                where: {
                                    id: itemId,
                                    intrastatDeclarationId: declarationId,
                                },
                            })];
                    case 2:
                        item = _a.sent();
                        if (!item) {
                            throw new common_1.NotFoundException('INTRASTAT tétel nem található');
                        }
                        // Validate partner country code if provided
                        if (dto.partnerOrszagKod && !/^[A-Z]{2}$/.test(dto.partnerOrszagKod)) {
                            throw new common_1.BadRequestException('Érvénytelen országkód');
                        }
                        // Validate szallitasiMod if provided
                        if (dto.szallitasiMod) {
                            szallitasiModNum = parseInt(dto.szallitasiMod);
                            if (isNaN(szallitasiModNum) || szallitasiModNum < 1 || szallitasiModNum > 9) {
                                throw new common_1.BadRequestException('Érvénytelen szállítási mód');
                            }
                        }
                        return [2 /*return*/, this.prisma.intrastatItem.update({
                                where: { id: itemId },
                                data: dto,
                                include: {
                                    item: true,
                                },
                            })];
                }
            });
        });
    };
    IntrastatService.prototype.markAsReady = function (declarationId) {
        return __awaiter(this, void 0, void 0, function () {
            var declaration, itemCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(declarationId)];
                    case 1:
                        declaration = _a.sent();
                        if (declaration.allapot !== 'NYITOTT') {
                            throw new common_1.BadRequestException('Csak nyitott bejelentés jelölhető küldésre késznek');
                        }
                        return [4 /*yield*/, this.prisma.intrastatItem.count({
                                where: { intrastatDeclarationId: declarationId },
                            })];
                    case 2:
                        itemCount = _a.sent();
                        if (itemCount === 0) {
                            throw new common_1.BadRequestException('Nem lehet küldésre késznek jelölni üres bejelentést');
                        }
                        return [2 /*return*/, this.prisma.intrastatDeclaration.update({
                                where: { id: declarationId },
                                data: {
                                    allapot: 'KULDESRE_KESZ',
                                },
                                include: {
                                    items: {
                                        include: {
                                            item: true,
                                        },
                                    },
                                },
                            })];
                }
            });
        });
    };
    IntrastatService.prototype.markAsSent = function (declarationId) {
        return __awaiter(this, void 0, void 0, function () {
            var declaration;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(declarationId)];
                    case 1:
                        declaration = _a.sent();
                        if (declaration.allapot !== 'KULDESRE_KESZ') {
                            throw new common_1.BadRequestException('Csak küldésre kész bejelentés jelölhető elküldöttnek');
                        }
                        return [2 /*return*/, this.prisma.intrastatDeclaration.update({
                                where: { id: declarationId },
                                data: {
                                    allapot: 'KULDOOTT',
                                    kuldesDatuma: new Date(),
                                },
                                include: {
                                    items: {
                                        include: {
                                            item: true,
                                        },
                                    },
                                },
                            })];
                }
            });
        });
    };
    IntrastatService.prototype.generateNavFormat = function (declarationId) {
        return __awaiter(this, void 0, void 0, function () {
            var declaration, lines, _i, _a, item, line;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.findOne(declarationId)];
                    case 1:
                        declaration = _e.sent();
                        lines = [];
                        // Header
                        lines.push("INTRASTAT_BEJELENTES");
                        lines.push("EV:".concat(declaration.ev));
                        lines.push("HONAP:".concat(declaration.honap));
                        lines.push("ALLAPOT:".concat(declaration.allapot));
                        lines.push("");
                        // Items
                        lines.push("TETELEK:");
                        for (_i = 0, _a = declaration.items; _i < _a.length; _i++) {
                            item = _a[_i];
                            line = [
                                item.irany,
                                item.partnerOrszagKod,
                                item.szallitasiMod,
                                item.statisztikaiErtek.toFixed(2),
                                ((_b = item.nettoSuly) === null || _b === void 0 ? void 0 : _b.toFixed(2)) || '',
                                item.kiegeszitoEgyseg || '',
                                ((_c = item.kiegeszitoMennyiseg) === null || _c === void 0 ? void 0 : _c.toFixed(2)) || '',
                                item.termekkod || '',
                                ((_d = item.item) === null || _d === void 0 ? void 0 : _d.azonosito) || '',
                            ].join('|');
                            lines.push(line);
                        }
                        return [2 /*return*/, lines.join('\n')];
                }
            });
        });
    };
    IntrastatService.prototype.generateXmlFormat = function (declarationId) {
        return __awaiter(this, void 0, void 0, function () {
            var declaration, xml, _i, _a, item;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.findOne(declarationId)];
                    case 1:
                        declaration = _b.sent();
                        xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
                        xml += '<IntrastatDeclaration>\n';
                        xml += "  <Year>".concat(declaration.ev, "</Year>\n");
                        xml += "  <Month>".concat(declaration.honap, "</Month>\n");
                        xml += "  <Status>".concat(declaration.allapot, "</Status>\n");
                        xml += '  <Items>\n';
                        for (_i = 0, _a = declaration.items; _i < _a.length; _i++) {
                            item = _a[_i];
                            xml += '    <Item>\n';
                            xml += "      <Direction>".concat(item.irany, "</Direction>\n");
                            xml += "      <PartnerCountry>".concat(item.partnerOrszagKod, "</PartnerCountry>\n");
                            xml += "      <TransportMode>".concat(item.szallitasiMod, "</TransportMode>\n");
                            xml += "      <StatisticalValue>".concat(item.statisztikaiErtek, "</StatisticalValue>\n");
                            if (item.nettoSuly) {
                                xml += "      <NetWeight>".concat(item.nettoSuly, "</NetWeight>\n");
                            }
                            if (item.kiegeszitoEgyseg) {
                                xml += "      <SupplementaryUnit>".concat(item.kiegeszitoEgyseg, "</SupplementaryUnit>\n");
                            }
                            if (item.kiegeszitoMennyiseg) {
                                xml += "      <SupplementaryQuantity>".concat(item.kiegeszitoMennyiseg, "</SupplementaryQuantity>\n");
                            }
                            if (item.termekkod) {
                                xml += "      <ProductCode>".concat(item.termekkod, "</ProductCode>\n");
                            }
                            if (item.item) {
                                xml += "      <ItemId>".concat(item.item.azonosito, "</ItemId>\n");
                            }
                            xml += '    </Item>\n';
                        }
                        xml += '  </Items>\n';
                        xml += '</IntrastatDeclaration>\n';
                        return [2 /*return*/, xml];
                }
            });
        });
    };
    IntrastatService.prototype.deleteItem = function (declarationId, itemId) {
        return __awaiter(this, void 0, void 0, function () {
            var declaration;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(declarationId)];
                    case 1:
                        declaration = _a.sent();
                        if (declaration.allapot !== 'NYITOTT') {
                            throw new common_1.BadRequestException('Csak nyitott bejelentésből lehet tételt törölni');
                        }
                        return [2 /*return*/, this.prisma.intrastatItem.delete({
                                where: { id: itemId },
                            })];
                }
            });
        });
    };
    IntrastatService.prototype.delete = function (declarationId) {
        return __awaiter(this, void 0, void 0, function () {
            var declaration;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(declarationId)];
                    case 1:
                        declaration = _a.sent();
                        if (declaration.allapot === 'KULDOOTT' || declaration.allapot === 'VISSZAIGAZOLT') {
                            throw new common_1.BadRequestException('Elküldött vagy visszaigazolt bejelentés nem törölhető');
                        }
                        return [2 /*return*/, this.prisma.intrastatDeclaration.delete({
                                where: { id: declarationId },
                            })];
                }
            });
        });
    };
    IntrastatService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], IntrastatService);
    return IntrastatService;
}());
exports.IntrastatService = IntrastatService;
