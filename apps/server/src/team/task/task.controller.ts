import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { Permissions } from '../../common/rbac/rbac.decorator';
import { Permission } from '../../common/rbac/permission.enum';
import { RbacGuard } from '../../common/rbac/rbac.guard';

@Controller('team/tasks')
@UseGuards(RbacGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  @Permissions(Permission.TASK_VIEW)
  async findAll(
    @Request() req: any,
    @Query() filters: TaskFilterDto,
    @Query('skip') skipParam?: string,
    @Query('take') takeParam?: string,
  ) {
    const skip = skipParam ? parseInt(skipParam, 10) : 0;
    const take = takeParam ? parseInt(takeParam, 10) : 50;

    if (isNaN(skip) || skip < 0) {
      throw new BadRequestException('Invalid skip parameter');
    }
    if (isNaN(take) || take < 1) {
      throw new BadRequestException('Invalid take parameter');
    }

    const userId = req.user.id;
    const isAdmin = req.user.roles?.includes('Admin') || false;

    return await this.taskService.findAll(userId, isAdmin, filters, skip, take);
  }

  @Get('my')
  @Permissions(Permission.TASK_VIEW)
  async getMyTasks(
    @Request() req: any,
    @Query('skip') skipParam?: string,
    @Query('take') takeParam?: string,
  ) {
    const skip = skipParam ? parseInt(skipParam, 10) : 0;
    const take = takeParam ? parseInt(takeParam, 10) : 50;

    return await this.taskService.getMyTasks(req.user.id, skip, take);
  }

  @Get('assigned-to/:userId')
  @Permissions(Permission.TASK_VIEW)
  async getAssignedToTasks(
    @Param('userId') userId: string,
    @Query('skip') skipParam?: string,
    @Query('take') takeParam?: string,
  ) {
    const skip = skipParam ? parseInt(skipParam, 10) : 0;
    const take = takeParam ? parseInt(takeParam, 10) : 50;

    return await this.taskService.getAssignedToTasks(userId, skip, take);
  }

  @Get(':id')
  @Permissions(Permission.TASK_VIEW)
  async findOne(@Request() req: any, @Param('id') id: string) {
    const userId = req.user.id;
    const isAdmin = req.user.roles?.includes('Admin') || false;

    return await this.taskService.findOne(id, userId, isAdmin);
  }

  @Post()
  @Permissions(Permission.TASK_CREATE)
  async create(@Request() req: any, @Body() dto: CreateTaskDto) {
    return await this.taskService.create(dto, req.user.id);
  }

  @Put(':id')
  @Permissions(Permission.TASK_EDIT)
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    const userId = req.user.id;
    const isAdmin = req.user.roles?.includes('Admin') || false;

    return await this.taskService.update(id, dto, userId, isAdmin);
  }

  @Delete(':id')
  @Permissions(Permission.TASK_DELETE)
  async delete(@Request() req: any, @Param('id') id: string) {
    const userId = req.user.id;
    const isAdmin = req.user.roles?.includes('Admin') || false;

    return await this.taskService.delete(id, userId, isAdmin);
  }

  @Patch(':id/status')
  @Permissions(Permission.TASK_EDIT)
  async updateStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { allapot: string },
  ) {
    const userId = req.user.id;
    const isAdmin = req.user.roles?.includes('Admin') || false;

    return await this.taskService.update(id, { allapot: body.allapot as any }, userId, isAdmin);
  }

  @Patch(':id/assign')
  @Permissions(Permission.TASK_ASSIGN)
  async assign(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { assignedToId: string },
  ) {
    const userId = req.user.id;
    const isAdmin = req.user.roles?.includes('Admin') || false;

    return await this.taskService.update(id, { assignedToId: body.assignedToId }, userId, isAdmin);
  }

  @Patch(':id/move')
  @Permissions(Permission.TASK_EDIT)
  async move(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: MoveTaskDto,
  ) {
    const userId = req.user.id;
    const isAdmin = req.user.roles?.includes('Admin') || false;

    return await this.taskService.move(id, dto, userId, isAdmin);
  }
}

@Controller('team/dashboard')
@UseGuards(RbacGuard)
export class DashboardController {
  constructor(private taskService: TaskService) {}

  @Get('stats')
  @Permissions(Permission.TASK_VIEW)
  async getStats(@Request() req: any) {
    const userId = req.user.id;
    const isAdmin = req.user.roles?.includes('Admin') || false;

    return await this.taskService.getDashboardStats(userId, isAdmin);
  }

  @Get('my-tasks')
  @Permissions(Permission.TASK_VIEW)
  async getMyTasks(@Request() req: any) {
    return await this.taskService.getMyTasks(req.user.id, 0, 10);
  }
}

