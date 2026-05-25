import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardAggregationService } from './dashboard-aggregation.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';

@Controller('controlling/dashboard')
@UseGuards(RbacGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardAggregationService) {}

  @Get()
  @Permissions(Permission.CONTROLLING_VIEW, Permission.REPORT_VIEW)
  getDashboard(
    @Query('module') module?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.dashboardService.getDashboard({ module, dateFrom, dateTo });
  }

  @Get('refresh')
  @Permissions(Permission.CONTROLLING_VIEW, Permission.REPORT_VIEW)
  refresh(
    @Query('module') module?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.dashboardService.getDashboard({ module, dateFrom, dateTo });
  }
}
