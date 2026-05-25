"use strict";
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.AuditController = void 0;
var common_1 = require("@nestjs/common");
var audit_service_1 = require("./audit.service");
var rbac_decorator_1 = require("../rbac/rbac.decorator");
var permission_enum_1 = require("../rbac/permission.enum");
var rbac_guard_1 = require("../rbac/rbac.guard");
var ExcelJS = __importStar(require("exceljs"));
var AuditController = /** @class */ (function () {
    function AuditController(auditService) {
        this.auditService = auditService;
    }
    AuditController.prototype.findAll = function (startDate, endDate, entitas, entitasId, userId, limit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (entitas && entitasId) {
                    return [2 /*return*/, this.auditService.getActivityByEntity(entitas, entitasId)];
                }
                if (limit && !startDate) {
                    return [2 /*return*/, this.auditService.getRecentActivity(parseInt(limit, 10) || 50)];
                }
                return [2 /*return*/, this.auditService.export({
                        startDate: startDate ? new Date(startDate) : undefined,
                        endDate: endDate ? new Date(endDate) : undefined,
                        entitas: entitas,
                        userId: userId,
                    })];
            });
        });
    };
    AuditController.prototype.export = function (format, res, startDate, endDate, entitas) {
        return __awaiter(this, void 0, void 0, function () {
            var logs, header, rows, workbook, sheet, buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.auditService.export({
                            startDate: startDate ? new Date(startDate) : undefined,
                            endDate: endDate ? new Date(endDate) : undefined,
                            entitas: entitas,
                        })];
                    case 1:
                        logs = _a.sent();
                        if (format === 'csv') {
                            header = 'Datum,Felhasznalo,Esemeny,Entitas,EntitasId';
                            rows = logs.map(function (l) { var _a; return "".concat(l.createdAt, ",").concat(((_a = l.user) === null || _a === void 0 ? void 0 : _a.email) || '', ",").concat(l.esemeny, ",").concat(l.entitas, ",").concat(l.entitasId || ''); });
                            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
                            res.send('\ufeff' + __spreadArray([header], rows, true).join('\n'));
                            return [2 /*return*/];
                        }
                        workbook = new ExcelJS.Workbook();
                        sheet = workbook.addWorksheet('Audit');
                        sheet.addRow(['Dátum', 'Felhasználó', 'Esemény', 'Entitás', 'Entitás ID']);
                        logs.forEach(function (l) {
                            var _a, _b;
                            return sheet.addRow([
                                l.createdAt,
                                ((_a = l.user) === null || _a === void 0 ? void 0 : _a.nev) || ((_b = l.user) === null || _b === void 0 ? void 0 : _b.email),
                                l.esemeny,
                                l.entitas,
                                l.entitasId,
                            ]);
                        });
                        return [4 /*yield*/, workbook.xlsx.writeBuffer()];
                    case 2:
                        buffer = _a.sent();
                        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        res.end(buffer);
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.SYSTEM_AUDIT_VIEW),
        __param(0, (0, common_1.Query)('startDate')),
        __param(1, (0, common_1.Query)('endDate')),
        __param(2, (0, common_1.Query)('entitas')),
        __param(3, (0, common_1.Query)('entitasId')),
        __param(4, (0, common_1.Query)('userId')),
        __param(5, (0, common_1.Query)('limit')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String, String, String, String]),
        __metadata("design:returntype", Promise)
    ], AuditController.prototype, "findAll", null);
    __decorate([
        (0, common_1.Get)('export/:format'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.SYSTEM_AUDIT_EXPORT),
        __param(0, (0, common_1.Param)('format')),
        __param(1, (0, common_1.Res)()),
        __param(2, (0, common_1.Query)('startDate')),
        __param(3, (0, common_1.Query)('endDate')),
        __param(4, (0, common_1.Query)('entitas')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, String, String, String]),
        __metadata("design:returntype", Promise)
    ], AuditController.prototype, "export", null);
    AuditController = __decorate([
        (0, common_1.Controller)('system/audit'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [audit_service_1.AuditService])
    ], AuditController);
    return AuditController;
}());
exports.AuditController = AuditController;
