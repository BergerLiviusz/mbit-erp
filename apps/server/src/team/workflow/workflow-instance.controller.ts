import { Controller, Get, Post, Put, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { WorkflowInstanceService, CreateWorkflowInstanceDto, UpdateWorkflowStepLogDto, DelegateWorkflowStepDto } from './workflow-instance.service';
import { Permissions } from '../../common/rbac/rbac.decorator';
import { Permission } from '../../common/rbac/permission.enum';
import { RbacGuard } from '../../common/rbac/rbac.guard';

@Controller('team/workflow-instances')
@UseGuards(RbacGuard)
export class WorkflowInstanceController {
  constructor(private workflowInstanceService: WorkflowInstanceService) {}

  @Post()
  @Permissions(Permission.CRM_CREATE)
  async create(@Body() dto: CreateWorkflowInstanceDto, @Request() req: any) {
    const userId = req?.user?.id;
    return await this.workflowInstanceService.create(dto, userId);
  }

  @Get()
  @Permissions(Permission.CRM_VIEW)
  async findAll(
    @Query('workflowId') workflowId?: string,
    @Request() req: any,
  ) {
    const userId = req?.user?.id;
    const isAdmin = req?.user?.roles?.includes('Admin') || false;
    return await this.workflowInstanceService.findAll(workflowId, userId, isAdmin);
  }

  @Get(':id')
  @Permissions(Permission.CRM_VIEW)
  async findOne(@Param('id') id: string, @Request() req: any) {
    const userId = req?.user?.id;
    const isAdmin = req?.user?.roles?.includes('Admin') || false;
    return await this.workflowInstanceService.findOne(id, userId, isAdmin);
  }

  @Put(':instanceId/step-logs/:stepLogId')
  @Permissions(Permission.CRM_EDIT)
  async updateStepLog(
    @Param('instanceId') instanceId: string,
    @Param('stepLogId') stepLogId: string,
    @Body() dto: UpdateWorkflowStepLogDto,
    @Request() req: any,
  ) {
    const userId = req?.user?.id;
    return await this.workflowInstanceService.updateStepLog(instanceId, stepLogId, dto, userId);
  }

  @Put(':id/cancel')
  @Permissions(Permission.CRM_EDIT)
  async cancel(@Param('id') id: string, @Request() req: any) {
    const userId = req?.user?.id;
    return await this.workflowInstanceService.cancel(id, userId);
  }

  @Put(':instanceId/steps/:stepId/delegate')
  @Permissions(Permission.CRM_EDIT)
  async delegateStep(
    @Param('instanceId') instanceId: string,
    @Param('stepId') stepId: string,
    @Body() dto: DelegateWorkflowStepDto,
    @Request() req: any,
  ) {
    const userId = req?.user?.id;
    return await this.workflowInstanceService.delegateStep(instanceId, stepId, dto, userId);
  }
}

