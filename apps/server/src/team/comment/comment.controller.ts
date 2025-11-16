import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Permissions } from '../../common/rbac/rbac.decorator';
import { Permission } from '../../common/rbac/permission.enum';
import { RbacGuard } from '../../common/rbac/rbac.guard';

@Controller('team/tasks')
@UseGuards(RbacGuard)
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get(':taskId/comments')
  @Permissions(Permission.TASK_VIEW)
  async getTaskComments(@Param('taskId') taskId: string) {
    return await this.commentService.getTaskComments(taskId);
  }

  @Post(':taskId/comments')
  @Permissions(Permission.TASK_EDIT)
  async create(
    @Request() req: any,
    @Param('taskId') taskId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return await this.commentService.create(taskId, dto, req.user.id);
  }

  @Put('comments/:id')
  @Permissions(Permission.TASK_EDIT)
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateCommentDto,
  ) {
    return await this.commentService.update(id, dto, req.user.id);
  }

  @Delete('comments/:id')
  @Permissions(Permission.TASK_EDIT)
  async delete(@Request() req: any, @Param('id') id: string) {
    return await this.commentService.delete(id, req.user.id);
  }
}

