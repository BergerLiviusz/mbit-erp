import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SystemModule } from '../system/system.module';
import { TaskController, DashboardController } from './task/task.controller';
import { TaskService } from './task/task.service';
import { TaskNotificationService } from './task/task-notification.service';
import { BoardController } from './board/board.controller';
import { BoardService } from './board/board.service';
import { CommentController } from './comment/comment.controller';
import { CommentService } from './comment/comment.service';
import { ActivityService } from './activity/activity.service';
import { WorkflowController } from './workflow/workflow.controller';
import { WorkflowService } from './workflow/workflow.service';
import { WorkflowInstanceController } from './workflow/workflow-instance.controller';
import { WorkflowInstanceService } from './workflow/workflow-instance.service';

@Module({
  imports: [PrismaModule, SystemModule],
  controllers: [
    TaskController,
    DashboardController,
    BoardController,
    CommentController,
    WorkflowController,
    WorkflowInstanceController,
  ],
  providers: [
    TaskService,
    TaskNotificationService,
    BoardService,
    CommentService,
    ActivityService,
    WorkflowService,
    WorkflowInstanceService,
  ],
  exports: [TaskService, BoardService, CommentService, ActivityService],
})
export class TeamModule {}

