"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamModule = void 0;
var common_1 = require("@nestjs/common");
var prisma_module_1 = require("../prisma/prisma.module");
var system_module_1 = require("../system/system.module");
var task_controller_1 = require("./task/task.controller");
var task_service_1 = require("./task/task.service");
var task_notification_service_1 = require("./task/task-notification.service");
var board_controller_1 = require("./board/board.controller");
var board_service_1 = require("./board/board.service");
var comment_controller_1 = require("./comment/comment.controller");
var comment_service_1 = require("./comment/comment.service");
var activity_service_1 = require("./activity/activity.service");
var workflow_controller_1 = require("./workflow/workflow.controller");
var workflow_service_1 = require("./workflow/workflow.service");
var workflow_instance_controller_1 = require("./workflow/workflow-instance.controller");
var workflow_instance_service_1 = require("./workflow/workflow-instance.service");
var TeamModule = /** @class */ (function () {
    function TeamModule() {
    }
    TeamModule = __decorate([
        (0, common_1.Module)({
            imports: [prisma_module_1.PrismaModule, system_module_1.SystemModule],
            controllers: [
                task_controller_1.TaskController,
                task_controller_1.DashboardController,
                board_controller_1.BoardController,
                comment_controller_1.CommentController,
                workflow_controller_1.WorkflowController,
                workflow_instance_controller_1.WorkflowInstanceController,
            ],
            providers: [
                task_service_1.TaskService,
                task_notification_service_1.TaskNotificationService,
                board_service_1.BoardService,
                comment_service_1.CommentService,
                activity_service_1.ActivityService,
                workflow_service_1.WorkflowService,
                workflow_instance_service_1.WorkflowInstanceService,
            ],
            exports: [
                task_service_1.TaskService,
                board_service_1.BoardService,
                comment_service_1.CommentService,
                activity_service_1.ActivityService,
                workflow_instance_service_1.WorkflowInstanceService,
            ],
        })
    ], TeamModule);
    return TeamModule;
}());
exports.TeamModule = TeamModule;
