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
exports.DashboardController = exports.TaskController = void 0;
var common_1 = require("@nestjs/common");
var task_service_1 = require("./task.service");
var task_notification_service_1 = require("./task-notification.service");
var create_task_dto_1 = require("./dto/create-task.dto");
var update_task_dto_1 = require("./dto/update-task.dto");
var task_filter_dto_1 = require("./dto/task-filter.dto");
var move_task_dto_1 = require("./dto/move-task.dto");
var rbac_decorator_1 = require("../../common/rbac/rbac.decorator");
var permission_enum_1 = require("../../common/rbac/permission.enum");
var rbac_guard_1 = require("../../common/rbac/rbac.guard");
var TaskController = /** @class */ (function () {
    function TaskController(taskService, notificationService) {
        this.taskService = taskService;
        this.notificationService = notificationService;
    }
    TaskController.prototype.findAll = function (req, filters, skipParam, takeParam) {
        return __awaiter(this, void 0, void 0, function () {
            var skip, take, userId, isAdmin;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        skip = skipParam ? parseInt(skipParam, 10) : 0;
                        take = takeParam ? parseInt(takeParam, 10) : 50;
                        if (isNaN(skip) || skip < 0) {
                            throw new common_1.BadRequestException('Invalid skip parameter');
                        }
                        if (isNaN(take) || take < 1) {
                            throw new common_1.BadRequestException('Invalid take parameter');
                        }
                        userId = req.user.id;
                        isAdmin = ((_a = req.user.roles) === null || _a === void 0 ? void 0 : _a.includes('Admin')) || false;
                        return [4 /*yield*/, this.taskService.findAll(userId, isAdmin, filters, skip, take)];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    TaskController.prototype.getMyTasks = function (req, skipParam, takeParam) {
        return __awaiter(this, void 0, void 0, function () {
            var skip, take;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        skip = skipParam ? parseInt(skipParam, 10) : 0;
                        take = takeParam ? parseInt(takeParam, 10) : 50;
                        return [4 /*yield*/, this.taskService.getMyTasks(req.user.id, skip, take)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TaskController.prototype.getAssignedToTasks = function (userId, skipParam, takeParam) {
        return __awaiter(this, void 0, void 0, function () {
            var skip, take;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        skip = skipParam ? parseInt(skipParam, 10) : 0;
                        take = takeParam ? parseInt(takeParam, 10) : 50;
                        return [4 /*yield*/, this.taskService.getAssignedToTasks(userId, skip, take)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TaskController.prototype.getUpcomingDeadlines = function (req, daysAhead) {
        return __awaiter(this, void 0, void 0, function () {
            var days, userId, isAdmin;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        days = daysAhead ? parseInt(daysAhead, 10) : 7;
                        userId = req.user.id;
                        isAdmin = ((_a = req.user.roles) === null || _a === void 0 ? void 0 : _a.includes('Admin')) || false;
                        return [4 /*yield*/, this.taskService.getUpcomingDeadlines(userId, isAdmin, days)];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    TaskController.prototype.findOne = function (req, id) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, isAdmin;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = req.user.id;
                        isAdmin = ((_a = req.user.roles) === null || _a === void 0 ? void 0 : _a.includes('Admin')) || false;
                        return [4 /*yield*/, this.taskService.findOne(id, userId, isAdmin)];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    TaskController.prototype.create = function (req, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.taskService.create(dto, ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || null)];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    TaskController.prototype.update = function (req, id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, isAdmin;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = req.user.id;
                        isAdmin = ((_a = req.user.roles) === null || _a === void 0 ? void 0 : _a.includes('Admin')) || false;
                        return [4 /*yield*/, this.taskService.update(id, dto, userId, isAdmin)];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    TaskController.prototype.delete = function (req, id) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, isAdmin;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = req.user.id;
                        isAdmin = ((_a = req.user.roles) === null || _a === void 0 ? void 0 : _a.includes('Admin')) || false;
                        return [4 /*yield*/, this.taskService.delete(id, userId, isAdmin)];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    TaskController.prototype.updateStatus = function (req, id, body) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, isAdmin;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = req.user.id;
                        isAdmin = ((_a = req.user.roles) === null || _a === void 0 ? void 0 : _a.includes('Admin')) || false;
                        return [4 /*yield*/, this.taskService.update(id, { allapot: body.allapot }, userId, isAdmin)];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    TaskController.prototype.assign = function (req, id, body) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, isAdmin;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = req.user.id;
                        isAdmin = ((_a = req.user.roles) === null || _a === void 0 ? void 0 : _a.includes('Admin')) || false;
                        return [4 /*yield*/, this.taskService.update(id, { assignedToId: body.assignedToId }, userId, isAdmin)];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    TaskController.prototype.move = function (req, id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, isAdmin;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = req.user.id;
                        isAdmin = ((_a = req.user.roles) === null || _a === void 0 ? void 0 : _a.includes('Admin')) || false;
                        return [4 /*yield*/, this.taskService.move(id, dto, userId, isAdmin)];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    TaskController.prototype.notify = function (id, userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.notificationService.generateMailtoLink(id, userId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.TASK_VIEW),
        __param(0, (0, common_1.Request)()),
        __param(1, (0, common_1.Query)()),
        __param(2, (0, common_1.Query)('skip')),
        __param(3, (0, common_1.Query)('take')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, task_filter_dto_1.TaskFilterDto, String, String]),
        __metadata("design:returntype", Promise)
    ], TaskController.prototype, "findAll", null);
    __decorate([
        (0, common_1.Get)('my'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.TASK_VIEW),
        __param(0, (0, common_1.Request)()),
        __param(1, (0, common_1.Query)('skip')),
        __param(2, (0, common_1.Query)('take')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String, String]),
        __metadata("design:returntype", Promise)
    ], TaskController.prototype, "getMyTasks", null);
    __decorate([
        (0, common_1.Get)('assigned-to/:userId'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.TASK_VIEW),
        __param(0, (0, common_1.Param)('userId')),
        __param(1, (0, common_1.Query)('skip')),
        __param(2, (0, common_1.Query)('take')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String]),
        __metadata("design:returntype", Promise)
    ], TaskController.prototype, "getAssignedToTasks", null);
    __decorate([
        (0, common_1.Get)('upcoming-deadlines'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.TASK_VIEW),
        __param(0, (0, common_1.Request)()),
        __param(1, (0, common_1.Query)('daysAhead')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String]),
        __metadata("design:returntype", Promise)
    ], TaskController.prototype, "getUpcomingDeadlines", null);
    __decorate([
        (0, common_1.Get)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.TASK_VIEW),
        __param(0, (0, common_1.Request)()),
        __param(1, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String]),
        __metadata("design:returntype", Promise)
    ], TaskController.prototype, "findOne", null);
    __decorate([
        (0, common_1.Post)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.TASK_CREATE),
        __param(0, (0, common_1.Request)()),
        __param(1, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, create_task_dto_1.CreateTaskDto]),
        __metadata("design:returntype", Promise)
    ], TaskController.prototype, "create", null);
    __decorate([
        (0, common_1.Put)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.TASK_EDIT),
        __param(0, (0, common_1.Request)()),
        __param(1, (0, common_1.Param)('id')),
        __param(2, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String, update_task_dto_1.UpdateTaskDto]),
        __metadata("design:returntype", Promise)
    ], TaskController.prototype, "update", null);
    __decorate([
        (0, common_1.Delete)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.TASK_DELETE),
        __param(0, (0, common_1.Request)()),
        __param(1, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String]),
        __metadata("design:returntype", Promise)
    ], TaskController.prototype, "delete", null);
    __decorate([
        (0, common_1.Patch)(':id/status'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.TASK_EDIT),
        __param(0, (0, common_1.Request)()),
        __param(1, (0, common_1.Param)('id')),
        __param(2, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String, Object]),
        __metadata("design:returntype", Promise)
    ], TaskController.prototype, "updateStatus", null);
    __decorate([
        (0, common_1.Patch)(':id/assign'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.TASK_ASSIGN),
        __param(0, (0, common_1.Request)()),
        __param(1, (0, common_1.Param)('id')),
        __param(2, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String, Object]),
        __metadata("design:returntype", Promise)
    ], TaskController.prototype, "assign", null);
    __decorate([
        (0, common_1.Patch)(':id/move'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.TASK_EDIT),
        __param(0, (0, common_1.Request)()),
        __param(1, (0, common_1.Param)('id')),
        __param(2, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String, move_task_dto_1.MoveTaskDto]),
        __metadata("design:returntype", Promise)
    ], TaskController.prototype, "move", null);
    __decorate([
        (0, common_1.Get)(':id/notify'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.TASK_NOTIFY),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Query)('userId')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", Promise)
    ], TaskController.prototype, "notify", null);
    TaskController = __decorate([
        (0, common_1.Controller)('team/tasks'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [task_service_1.TaskService,
            task_notification_service_1.TaskNotificationService])
    ], TaskController);
    return TaskController;
}());
exports.TaskController = TaskController;
var DashboardController = /** @class */ (function () {
    function DashboardController(taskService) {
        this.taskService = taskService;
    }
    DashboardController.prototype.getStats = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, isAdmin;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = req.user.id;
                        isAdmin = ((_a = req.user.roles) === null || _a === void 0 ? void 0 : _a.includes('Admin')) || false;
                        return [4 /*yield*/, this.taskService.getDashboardStats(userId, isAdmin)];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    DashboardController.prototype.getMyTasks = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.taskService.getMyTasks(req.user.id, 0, 10)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)('stats'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.TASK_VIEW),
        __param(0, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], DashboardController.prototype, "getStats", null);
    __decorate([
        (0, common_1.Get)('my-tasks'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.TASK_VIEW),
        __param(0, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], DashboardController.prototype, "getMyTasks", null);
    DashboardController = __decorate([
        (0, common_1.Controller)('team/dashboard'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [task_service_1.TaskService])
    ], DashboardController);
    return DashboardController;
}());
exports.DashboardController = DashboardController;
