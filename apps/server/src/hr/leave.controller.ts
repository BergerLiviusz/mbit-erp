import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { HrLeaveService } from './leave.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';

@Controller('hr/leave')
@UseGuards(RbacGuard)
export class HrLeaveController {
  constructor(private svc: HrLeaveService) {}

  @Get('requests')
  @Permissions(Permission.HR_VIEW)
  listAll(@Query('allapot') allapot?: string, @Query('employeeId') employeeId?: string) {
    return this.svc.listAll({ allapot, employeeId });
  }

  @Get('employees/:employeeId/requests')
  @Permissions(Permission.HR_VIEW)
  forEmployee(@Param('employeeId') employeeId: string) {
    return this.svc.listForEmployee(employeeId);
  }

  @Get('pending/my')
  @Permissions(Permission.HR_APPROVE)
  pendingForMe(@Request() req: any) {
    const uid = req.user?.id || req.user?.userId;
    return this.svc.listPendingForApprover(uid);
  }

  @Get('analytics/summary')
  @Permissions(Permission.HR_VIEW)
  summary(@Query('ev') ev?: string) {
    return this.svc.summaryByStatus(ev ? parseInt(ev, 10) : undefined);
  }

  @Post('requests')
  @Permissions(Permission.HR_CREATE)
  create(@Body() body: any, @Request() req: any) {
    const uid = req.user?.id || req.user?.userId;
    return this.svc.createRequest(body, uid || undefined);
  }

  @Post('requests/:id/decide')
  @Permissions(Permission.HR_APPROVE)
  decide(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    const uid = req.user?.id || req.user?.userId;
    return this.svc.decide(id, uid, body);
  }
}
