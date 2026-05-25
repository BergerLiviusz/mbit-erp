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
exports.PermissionSyncService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../../prisma/prisma.service");
var permission_enum_1 = require("./permission.enum");
/** Szerepkör → jogosultság kódok (meglévő DB-k automatikus szinkronjához). */
var ROLE_PERMISSION_CODES = {
    Admin: [], // üres = minden permission
    'Logistics Admin': [
        permission_enum_1.Permission.LOGISTICS_VIEW,
        permission_enum_1.Permission.LOGISTICS_CREATE,
        permission_enum_1.Permission.LOGISTICS_EDIT,
        permission_enum_1.Permission.LOGISTICS_UPDATE,
        permission_enum_1.Permission.LOGISTICS_DELETE,
        permission_enum_1.Permission.LOGISTICS_EXPORT,
        permission_enum_1.Permission.LOGISTICS_ADMIN,
        permission_enum_1.Permission.INVENTORY_MANAGE,
        permission_enum_1.Permission.PURCHASE_MANAGE,
        permission_enum_1.Permission.PRODUCT_VIEW,
        permission_enum_1.Permission.PRODUCT_CREATE,
        permission_enum_1.Permission.PRODUCT_EDIT,
        permission_enum_1.Permission.PRODUCT_DELETE,
        permission_enum_1.Permission.WAREHOUSE_VIEW,
        permission_enum_1.Permission.WAREHOUSE_CREATE,
        permission_enum_1.Permission.WAREHOUSE_EDIT,
        permission_enum_1.Permission.WAREHOUSE_DELETE,
        permission_enum_1.Permission.WAREHOUSE_MANAGE_LOCATIONS,
        permission_enum_1.Permission.STOCK_VIEW,
        permission_enum_1.Permission.STOCK_EDIT,
        permission_enum_1.Permission.STOCK_MOVE,
        permission_enum_1.Permission.STOCK_ADJUST,
        permission_enum_1.Permission.STOCK_INVENTORY,
        permission_enum_1.Permission.STOCK_TRANSFER,
        permission_enum_1.Permission.PURCHASE_ORDER_VIEW,
        permission_enum_1.Permission.PURCHASE_ORDER_CREATE,
        permission_enum_1.Permission.PURCHASE_ORDER_EDIT,
        permission_enum_1.Permission.PURCHASE_ORDER_DELETE,
        permission_enum_1.Permission.PURCHASE_ORDER_APPROVE,
        permission_enum_1.Permission.PURCHASE_ORDER_RECEIVE,
        permission_enum_1.Permission.SUPPLIER_VIEW,
        permission_enum_1.Permission.SUPPLIER_CREATE,
        permission_enum_1.Permission.SUPPLIER_EDIT,
        permission_enum_1.Permission.SUPPLIER_DELETE,
        permission_enum_1.Permission.PRICE_LIST_VIEW,
        permission_enum_1.Permission.PRICE_LIST_CREATE,
        permission_enum_1.Permission.PRICE_LIST_EDIT,
        permission_enum_1.Permission.PRICE_LIST_DELETE,
        permission_enum_1.Permission.PRICE_LIST_IMPORT,
        permission_enum_1.Permission.PRICE_LIST_EXPORT,
        permission_enum_1.Permission.RETURN_VIEW,
        permission_enum_1.Permission.RETURN_CREATE,
        permission_enum_1.Permission.RETURN_EDIT,
        permission_enum_1.Permission.RETURN_APPROVE,
        permission_enum_1.Permission.RETURN_COMPLETE,
        permission_enum_1.Permission.INVENTORY_REPORT_PRINT,
        permission_enum_1.Permission.REPORT_VIEW,
        permission_enum_1.Permission.REPORT_EXPORT,
        permission_enum_1.Permission.SYSTEM_AUDIT_VIEW,
    ],
    'Warehouse User': [
        permission_enum_1.Permission.LOGISTICS_VIEW,
        permission_enum_1.Permission.PRODUCT_VIEW,
        permission_enum_1.Permission.WAREHOUSE_VIEW,
        permission_enum_1.Permission.STOCK_VIEW,
        permission_enum_1.Permission.STOCK_MOVE,
        permission_enum_1.Permission.STOCK_ADJUST,
        permission_enum_1.Permission.STOCK_INVENTORY,
        permission_enum_1.Permission.STOCK_TRANSFER,
        permission_enum_1.Permission.INVENTORY_MANAGE,
        permission_enum_1.Permission.RETURN_VIEW,
        permission_enum_1.Permission.RETURN_CREATE,
        permission_enum_1.Permission.INVENTORY_REPORT_PRINT,
    ],
    'Controlling Admin': [
        permission_enum_1.Permission.CONTROLLING_VIEW,
        permission_enum_1.Permission.CONTROLLING_EXPORT,
        permission_enum_1.Permission.CONTROLLING_ADMIN,
        permission_enum_1.Permission.KPI_MANAGE,
        permission_enum_1.Permission.REPORT_MANAGE,
        permission_enum_1.Permission.REPORT_VIEW,
        permission_enum_1.Permission.REPORT_CREATE,
        permission_enum_1.Permission.REPORT_EDIT,
        permission_enum_1.Permission.REPORT_DELETE,
        permission_enum_1.Permission.REPORT_EXPORT,
        permission_enum_1.Permission.SYSTEM_AUDIT_VIEW,
        permission_enum_1.Permission.SYSTEM_AUDIT_EXPORT,
        permission_enum_1.Permission.CRM_VIEW,
        permission_enum_1.Permission.DMS_VIEW,
        permission_enum_1.Permission.HR_VIEW,
        permission_enum_1.Permission.LOGISTICS_VIEW,
    ],
    Manager: [
        permission_enum_1.Permission.CONTROLLING_VIEW,
        permission_enum_1.Permission.CONTROLLING_EXPORT,
        permission_enum_1.Permission.REPORT_VIEW,
        permission_enum_1.Permission.REPORT_EXPORT,
        permission_enum_1.Permission.CRM_VIEW,
        permission_enum_1.Permission.DMS_VIEW,
        permission_enum_1.Permission.HR_VIEW,
        permission_enum_1.Permission.HR_REPORT,
        permission_enum_1.Permission.LOGISTICS_VIEW,
        permission_enum_1.Permission.SYSTEM_AUDIT_VIEW,
    ],
    Viewer: [
        permission_enum_1.Permission.CONTROLLING_VIEW,
        permission_enum_1.Permission.CRM_VIEW,
        permission_enum_1.Permission.DMS_VIEW,
        permission_enum_1.Permission.HR_VIEW,
        permission_enum_1.Permission.LOGISTICS_VIEW,
        permission_enum_1.Permission.PRODUCT_VIEW,
        permission_enum_1.Permission.WAREHOUSE_VIEW,
        permission_enum_1.Permission.STOCK_VIEW,
        permission_enum_1.Permission.PURCHASE_ORDER_VIEW,
        permission_enum_1.Permission.SUPPLIER_VIEW,
        permission_enum_1.Permission.PRICE_LIST_VIEW,
        permission_enum_1.Permission.RETURN_VIEW,
        permission_enum_1.Permission.REPORT_VIEW,
        permission_enum_1.Permission.SYSTEM_AUDIT_VIEW,
    ],
};
var PermissionSyncService = /** @class */ (function () {
    function PermissionSyncService(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(PermissionSyncService_1.name);
    }
    PermissionSyncService_1 = PermissionSyncService;
    PermissionSyncService.prototype.onModuleInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.syncAll()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        this.logger.warn("Permission sync skipped: ".concat(e_1.message));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PermissionSyncService.prototype.syncAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.syncPermissions()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.syncRoles()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.ensureControllingRoles()];
                    case 3:
                        _a.sent();
                        this.logger.log('Permission sync completed');
                        return [2 /*return*/];
                }
            });
        });
    };
    PermissionSyncService.prototype.syncPermissions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var entries, _i, entries_1, perm;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        entries = Object.values(permission_enum_1.Permission).map(function (kod) { return (__assign({ kod: kod }, permission_enum_1.PermissionDescriptions[kod])); });
                        _i = 0, entries_1 = entries;
                        _a.label = 1;
                    case 1:
                        if (!(_i < entries_1.length)) return [3 /*break*/, 4];
                        perm = entries_1[_i];
                        return [4 /*yield*/, this.prisma.permission.upsert({
                                where: { kod: perm.kod },
                                update: { nev: perm.nev, modulo: perm.modulo, leiras: perm.leiras },
                                create: perm,
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PermissionSyncService.prototype.ensureControllingRoles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, _b, nev, leiras;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _i = 0, _a = [
                            ['Controlling Admin', 'Kontrolling modul teljes kezelése'],
                            ['Manager', 'Vezetői riportok és export'],
                        ];
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        _b = _a[_i], nev = _b[0], leiras = _b[1];
                        return [4 /*yield*/, this.prisma.role.upsert({
                                where: { nev: nev },
                                update: {},
                                create: { nev: nev, leiras: leiras, permissions: JSON.stringify([]) },
                            })];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PermissionSyncService.prototype.syncRoles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var allPerms, permByCode, adminRole, adminModules_1, _i, _a, p, _b, _c, _d, roleName, codes, role, _e, codes_1, kod, pid, hrAdmin, _f, _g, p;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, this.prisma.permission.findMany()];
                    case 1:
                        allPerms = _h.sent();
                        permByCode = new Map(allPerms.map(function (p) { return [p.kod, p.id]; }));
                        return [4 /*yield*/, this.prisma.role.findFirst({ where: { nev: 'Admin' } })];
                    case 2:
                        adminRole = _h.sent();
                        if (!adminRole) return [3 /*break*/, 6];
                        adminModules_1 = ['CRM', 'DMS', 'Logisztika', 'HR', 'Kontrolling', 'Rendszer', 'Jelentések', 'Felhasználók', 'Szerepkörök', 'Csapat kommunikáció'];
                        _i = 0, _a = allPerms.filter(function (x) { return adminModules_1.includes(x.modulo); });
                        _h.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        p = _a[_i];
                        return [4 /*yield*/, this.linkRolePermission(adminRole.id, p.id)];
                    case 4:
                        _h.sent();
                        _h.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        _b = 0, _c = Object.entries(ROLE_PERMISSION_CODES);
                        _h.label = 7;
                    case 7:
                        if (!(_b < _c.length)) return [3 /*break*/, 13];
                        _d = _c[_b], roleName = _d[0], codes = _d[1];
                        if (roleName === 'Admin' && codes.length === 0)
                            return [3 /*break*/, 12];
                        return [4 /*yield*/, this.prisma.role.findFirst({ where: { nev: roleName } })];
                    case 8:
                        role = _h.sent();
                        if (!role)
                            return [3 /*break*/, 12];
                        _e = 0, codes_1 = codes;
                        _h.label = 9;
                    case 9:
                        if (!(_e < codes_1.length)) return [3 /*break*/, 12];
                        kod = codes_1[_e];
                        pid = permByCode.get(kod);
                        if (!pid) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.linkRolePermission(role.id, pid)];
                    case 10:
                        _h.sent();
                        _h.label = 11;
                    case 11:
                        _e++;
                        return [3 /*break*/, 9];
                    case 12:
                        _b++;
                        return [3 /*break*/, 7];
                    case 13: return [4 /*yield*/, this.prisma.role.findFirst({ where: { nev: 'HR Admin' } })];
                    case 14:
                        hrAdmin = _h.sent();
                        if (!hrAdmin) return [3 /*break*/, 18];
                        _f = 0, _g = allPerms.filter(function (x) { return x.modulo === 'HR'; });
                        _h.label = 15;
                    case 15:
                        if (!(_f < _g.length)) return [3 /*break*/, 18];
                        p = _g[_f];
                        return [4 /*yield*/, this.linkRolePermission(hrAdmin.id, p.id)];
                    case 16:
                        _h.sent();
                        _h.label = 17;
                    case 17:
                        _f++;
                        return [3 /*break*/, 15];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    PermissionSyncService.prototype.linkRolePermission = function (roleId, permissionId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.rolePermission.upsert({
                            where: {
                                roleId_permissionId: { roleId: roleId, permissionId: permissionId },
                            },
                            update: {},
                            create: { roleId: roleId, permissionId: permissionId },
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    var PermissionSyncService_1;
    PermissionSyncService = PermissionSyncService_1 = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], PermissionSyncService);
    return PermissionSyncService;
}());
exports.PermissionSyncService = PermissionSyncService;
