import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { HrOnboardingService } from './onboarding.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';

@Controller('hr/onboarding')
@UseGuards(RbacGuard)
export class HrOnboardingController {
  constructor(private svc: HrOnboardingService) {}

  @Get('templates')
  @Permissions(Permission.HR_VIEW)
  listTemplates(@Query('aktiv') aktiv?: string) {
    return this.svc.listTemplates(aktiv === undefined ? undefined : aktiv === 'true');
  }

  @Post('templates')
  @Permissions(Permission.HR_CREATE)
  createTemplate(@Body() body: any) {
    return this.svc.createTemplate(body);
  }

  @Put('templates/:id')
  @Permissions(Permission.HR_EDIT)
  updateTemplate(@Param('id') id: string, @Body() body: any) {
    return this.svc.updateTemplate(id, body);
  }

  @Delete('templates/:id')
  @Permissions(Permission.HR_DELETE)
  deleteTemplate(@Param('id') id: string) {
    return this.svc.deleteTemplate(id);
  }

  @Post('instances')
  @Permissions(Permission.HR_CREATE)
  start(@Body() body: any, @Request() req: any) {
    const uid = req.user?.id || req.user?.userId;
    return this.svc.startInstance(body, uid || undefined);
  }

  @Get('instances')
  @Permissions(Permission.HR_VIEW)
  listInstances(@Query('employeeId') employeeId?: string, @Query('allapot') allapot?: string) {
    return this.svc.listInstances({ employeeId, allapot });
  }

  @Post('instances/:id/complete')
  @Permissions(Permission.HR_EDIT)
  complete(@Param('id') id: string) {
    return this.svc.completeInstance(id);
  }

  @Get('analytics')
  @Permissions(Permission.HR_VIEW)
  analytics() {
    return this.svc.analytics();
  }
}
