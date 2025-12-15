import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { WorkflowService, CreateWorkflowDto, UpdateWorkflowDto, CreateWorkflowStepDto, UpdateWorkflowStepDto } from './workflow.service';
import { Permissions } from '../../common/rbac/rbac.decorator';
import { Permission } from '../../common/rbac/permission.enum';
import { RbacGuard } from '../../common/rbac/rbac.guard';

@Controller('team/workflows')
@UseGuards(RbacGuard)
export class WorkflowController {
  constructor(private workflowService: WorkflowService) {}

  @Get()
  @Permissions(Permission.CRM_VIEW) // Using CRM_VIEW as team permission
  async findAll(@Request() req: any) {
    const userId = req?.user?.id;
    const isAdmin = req?.user?.roles?.includes('Admin') || false;
    return await this.workflowService.findAll(userId, isAdmin);
  }

  @Get(':id')
  @Permissions(Permission.CRM_VIEW)
  async findOne(@Param('id') id: string, @Request() req: any) {
    const userId = req?.user?.id;
    const isAdmin = req?.user?.roles?.includes('Admin') || false;
    return await this.workflowService.findOne(id, userId, isAdmin);
  }

  @Post()
  @Permissions(Permission.CRM_CREATE)
  async create(@Body() dto: CreateWorkflowDto, @Request() req: any) {
    const userId = req?.user?.id;
    return await this.workflowService.create(dto, userId);
  }

  @Put(':id')
  @Permissions(Permission.CRM_EDIT)
  async update(@Param('id') id: string, @Body() dto: UpdateWorkflowDto, @Request() req: any) {
    const userId = req?.user?.id;
    const isAdmin = req?.user?.roles?.includes('Admin') || false;
    return await this.workflowService.update(id, dto, userId, isAdmin);
  }

  @Delete(':id')
  @Permissions(Permission.CRM_DELETE)
  async delete(@Param('id') id: string) {
    return await this.workflowService.delete(id);
  }

  @Post(':id/steps')
  @Permissions(Permission.CRM_EDIT)
  async addStep(@Param('id') id: string, @Body() dto: CreateWorkflowStepDto) {
    return await this.workflowService.addStep(id, dto);
  }

  @Put(':id/steps/:stepId')
  @Permissions(Permission.CRM_EDIT)
  async updateStep(
    @Param('id') id: string,
    @Param('stepId') stepId: string,
    @Body() dto: UpdateWorkflowStepDto,
  ) {
    return await this.workflowService.updateStep(id, stepId, dto);
  }

  @Delete(':id/steps/:stepId')
  @Permissions(Permission.CRM_DELETE)
  async deleteStep(@Param('id') id: string, @Param('stepId') stepId: string) {
    return await this.workflowService.deleteStep(id, stepId);
  }
}

