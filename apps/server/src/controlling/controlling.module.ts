import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../common/audit/audit.module';
import { RbacModule } from '../common/rbac/rbac.module';

import { DatabaseConnectionController } from './database-connection.controller';
import { DatabaseConnectionService } from './database-connection.service';
import { KpiController } from './kpi.controller';
import { KpiService } from './kpi.service';
import { QueryController } from './query.controller';
import { QueryService } from './query.service';
import { ReportExportController } from './report-export.controller';
import { ReportExportService } from './report-export.service';
import { ModelAnalysisController } from './model-analysis.controller';
import { ModelAnalysisService } from './model-analysis.service';
import { DataSourceController } from './data-source.controller';
import { DataSourceService } from './data-source.service';
import { DashboardController } from './dashboard.controller';
import { DashboardAggregationService } from './dashboard-aggregation.service';
import { ReportCatalogController } from './report-catalog.controller';
import { ReportCatalogService } from './report-catalog.service';

@Module({
  imports: [PrismaModule, AuditModule, RbacModule],
  controllers: [
    DatabaseConnectionController,
    KpiController,
    QueryController,
    ReportExportController,
    ModelAnalysisController,
    DataSourceController,
    DashboardController,
    ReportCatalogController,
  ],
  providers: [
    DatabaseConnectionService,
    KpiService,
    QueryService,
    ReportExportService,
    ModelAnalysisService,
    DataSourceService,
    DashboardAggregationService,
    ReportCatalogService,
  ],
  exports: [
    DatabaseConnectionService,
    KpiService,
    QueryService,
    ReportExportService,
    ModelAnalysisService,
    DataSourceService,
    DashboardAggregationService,
    ReportCatalogService,
  ],
})
export class ControllingModule {}

