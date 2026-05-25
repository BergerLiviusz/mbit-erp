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
exports.ProductCategoryService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var ProductCategoryService = /** @class */ (function () {
    function ProductCategoryService(prisma) {
        this.prisma = prisma;
    }
    ProductCategoryService.prototype.findTree = function () {
        return __awaiter(this, void 0, void 0, function () {
            var all, byParent, _i, all_1, c, key, build;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.prisma.productCategory.findMany({
                            where: { aktiv: true },
                            orderBy: { nev: 'asc' },
                            include: { _count: { select: { items: true, children: true } } },
                        })];
                    case 1:
                        all = _b.sent();
                        byParent = new Map();
                        for (_i = 0, all_1 = all; _i < all_1.length; _i++) {
                            c = all_1[_i];
                            key = (_a = c.parentId) !== null && _a !== void 0 ? _a : null;
                            if (!byParent.has(key))
                                byParent.set(key, []);
                            byParent.get(key).push(c);
                        }
                        build = function (parentId) {
                            return (byParent.get(parentId) || []).map(function (cat) { return (__assign(__assign({}, cat), { children: build(cat.id) })); });
                        };
                        return [2 /*return*/, build(null)];
                }
            });
        });
    };
    ProductCategoryService.prototype.findAll = function () {
        return __awaiter(this, arguments, void 0, function (skip, take) {
            var _a, total, data;
            if (skip === void 0) { skip = 0; }
            if (take === void 0) { take = 200; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            this.prisma.productCategory.count(),
                            this.prisma.productCategory.findMany({
                                skip: skip,
                                take: take,
                                orderBy: { nev: 'asc' },
                                include: {
                                    parent: { select: { id: true, nev: true } },
                                    _count: { select: { items: true } },
                                },
                            }),
                        ])];
                    case 1:
                        _a = _b.sent(), total = _a[0], data = _a[1];
                        return [2 /*return*/, { total: total, data: data }];
                }
            });
        });
    };
    ProductCategoryService.prototype.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var parent_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!data.parentId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.prisma.productCategory.findUnique({
                                where: { id: data.parentId },
                            })];
                    case 1:
                        parent_1 = _a.sent();
                        if (!parent_1)
                            throw new common_1.NotFoundException('Szülő kategória nem található');
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.prisma.productCategory.create({ data: data })];
                }
            });
        });
    };
    ProductCategoryService.prototype.update = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var parent_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (data.parentId === id) {
                            throw new common_1.BadRequestException('A kategória nem lehet saját gyermeke');
                        }
                        if (!data.parentId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.prisma.productCategory.findUnique({
                                where: { id: data.parentId },
                            })];
                    case 1:
                        parent_2 = _a.sent();
                        if (!parent_2)
                            throw new common_1.NotFoundException('Szülő kategória nem található');
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.prisma.productCategory.update({ where: { id: id }, data: data })];
                }
            });
        });
    };
    ProductCategoryService.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var childCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.productCategory.count({
                            where: { parentId: id },
                        })];
                    case 1:
                        childCount = _a.sent();
                        if (childCount > 0) {
                            throw new common_1.BadRequestException('Előbb törölje vagy helyezze át az alkategóriákat');
                        }
                        return [4 /*yield*/, this.prisma.item.updateMany({
                                where: { categoryId: id },
                                data: { categoryId: null },
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, this.prisma.productCategory.delete({ where: { id: id } })];
                }
            });
        });
    };
    ProductCategoryService.prototype.reportByCategory = function () {
        return __awaiter(this, void 0, void 0, function () {
            var categories;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.productCategory.findMany({
                            include: {
                                items: {
                                    include: {
                                        stockLevels: { include: { warehouse: true } },
                                    },
                                },
                            },
                        })];
                    case 1:
                        categories = _a.sent();
                        return [2 /*return*/, categories.map(function (cat) {
                                var totalQty = 0;
                                var totalValue = 0;
                                for (var _i = 0, _a = cat.items; _i < _a.length; _i++) {
                                    var item = _a[_i];
                                    for (var _b = 0, _c = item.stockLevels; _b < _c.length; _b++) {
                                        var sl = _c[_b];
                                        totalQty += sl.mennyiseg;
                                        totalValue += sl.mennyiseg * (item.beszerzesiAr || 0);
                                    }
                                }
                                return {
                                    categoryId: cat.id,
                                    categoryName: cat.nev,
                                    itemCount: cat.items.length,
                                    totalQty: totalQty,
                                    totalValue: totalValue,
                                };
                            })];
                }
            });
        });
    };
    ProductCategoryService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], ProductCategoryService);
    return ProductCategoryService;
}());
exports.ProductCategoryService = ProductCategoryService;
