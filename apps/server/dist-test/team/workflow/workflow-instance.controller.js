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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowInstanceController = void 0;
var common_1 = require("@nestjs/common");
var workflow_instance_service_1 = require("./workflow-instance.service");
var rbac_decorator_1 = require("../../common/rbac/rbac.decorator");
var permission_enum_1 = require("../../common/rbac/permission.enum");
var rbac_guard_1 = require("../../common/rbac/rbac.guard");
var WorkflowInstanceController = /** @class */ (function () {
    function WorkflowInstanceController(workflowInstanceService) {
        this.workflowInstanceService = workflowInstanceService;
    }
    WorkflowInstanceController.prototype.create = function (dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var userId;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                        return [4 /*yield*/, this.workflowInstanceService.create(dto, userId)];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    WorkflowInstanceController.prototype.findAll = function (req, workflowId) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, isAdmin;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                        isAdmin = ((_c = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.roles) === null || _c === void 0 ? void 0 : _c.includes('Admin')) || false;
                        return [4 /*yield*/, this.workflowInstanceService.findAll(workflowId, userId, isAdmin)];
                    case 1: return [2 /*return*/, _d.sent()];
                }
            });
        });
    };
    WorkflowInstanceController.prototype.findOne = function (id, req) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, isAdmin;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                        isAdmin = ((_c = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.roles) === null || _c === void 0 ? void 0 : _c.includes('Admin')) || false;
                        return [4 /*yield*/, this.workflowInstanceService.findOne(id, userId, isAdmin)];
                    case 1: return [2 /*return*/, _d.sent()];
                }
            });
        });
    };
    WorkflowInstanceController.prototype.updateStepLog = function (instanceId, stepLogId, dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var userId;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                        return [4 /*yield*/, this.workflowInstanceService.updateStepLog(instanceId, stepLogId, dto, userId)];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    WorkflowInstanceController.prototype.cancel = function (id, req) {
        return __awaiter(this, void 0, void 0, function () {
            var userId;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                        return [4 /*yield*/, this.workflowInstanceService.cancel(id, userId)];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    WorkflowInstanceController.prototype.delegateStep = function (instanceId, stepId, dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var userId;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                        return [4 /*yield*/, this.workflowInstanceService.delegateStep(instanceId, stepId, dto, userId)];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Post)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.CRM_CREATE),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], WorkflowInstanceController.prototype, "create", null);
    __decorate([
        (0, common_1.Get)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.CRM_VIEW),
        __param(0, (0, common_1.Request)()),
        __param(1, (0, common_1.Query)('workflowId')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String]),
        __metadata("design:returntype", Promise)
    ], WorkflowInstanceController.prototype, "findAll", null);
    __decorate([
        (0, common_1.Get)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.CRM_VIEW),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], WorkflowInstanceController.prototype, "findOne", null);
    __decorate([
        (0, common_1.Put)(':instanceId/step-logs/:stepLogId'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.CRM_EDIT),
        __param(0, (0, common_1.Param)('instanceId')),
        __param(1, (0, common_1.Param)('stepLogId')),
        __param(2, (0, common_1.Body)()),
        __param(3, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], WorkflowInstanceController.prototype, "updateStepLog", null);
    __decorate([
        (0, common_1.Put)(':id/cancel'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.CRM_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], WorkflowInstanceController.prototype, "cancel", null);
    __decorate([
        (0, common_1.Put)(':instanceId/steps/:stepId/delegate'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.CRM_EDIT),
        __param(0, (0, common_1.Param)('instanceId')),
        __param(1, (0, common_1.Param)('stepId')),
        __param(2, (0, common_1.Body)()),
        __param(3, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], WorkflowInstanceController.prototype, "delegateStep", null);
    WorkflowInstanceController = __decorate([
        (0, common_1.Controller)('team/workflow-instances'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [workflow_instance_service_1.WorkflowInstanceService])
    ], WorkflowInstanceController);
    return WorkflowInstanceController;
}());
exports.WorkflowInstanceController = WorkflowInstanceController;
