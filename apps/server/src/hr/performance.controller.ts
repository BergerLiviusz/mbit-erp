import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { HrPerformanceService } from './performance.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';

@Controller('hr/performance')
@UseGuards(RbacGuard)
export class HrPerformanceController {
  constructor(private svc: HrPerformanceService) {}

  @Get('goals')
  @Permissions(Permission.HR_VIEW)
  listGoals(@Query('employeeId') employeeId: string) {
    return this.svc.listGoals(employeeId);
  }

  @Get('analytics/goals')
  @Permissions(Permission.HR_VIEW)
  analytics() {
    return this.svc.summaryByGoalStatus();
  }

  @Post('goals')
  @Permissions(Permission.HR_CREATE)
  createGoal(@Body() body: any, @Request() req: any) {
    const uid = req.user?.id || req.user?.userId;
    return this.svc.createGoal(body, uid || undefined);
  }

  @Put('goals/:id')
  @Permissions(Permission.HR_EDIT)
  updateGoal(@Param('id') id: string, @Body() body: any) {
    return this.svc.updateGoal(id, body);
  }

  @Post('goals/:id/activities')
  @Permissions(Permission.HR_EDIT)
  addActivity(@Param('id') id: string, @Body() body: { megjegyzes: string }) {
    return this.svc.addActivity(id, body.megjegyzes);
  }

  @Delete('goals/:id')
  @Permissions(Permission.HR_DELETE)
  deleteGoal(@Param('id') id: string) {
    return this.svc.deleteGoal(id);
  }
}
