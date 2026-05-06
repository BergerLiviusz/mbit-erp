import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../common/audit/audit.module';
import { RbacModule } from '../common/rbac/rbac.module';
import { StorageModule } from '../common/storage/storage.module';
import { TeamModule } from '../team/team.module';
import { JobPositionController } from './job-position.controller';
import { JobPositionService } from './job-position.service';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';
import { HrReportController } from './report.controller';
import { HrReportService } from './report.service';
import { CafeteriaController } from './cafeteria.controller';
import { CafeteriaService } from './cafeteria.service';
import { RecruitmentController } from './recruitment.controller';
import { HrRecruitmentService } from './recruitment.service';
import { HrTimeTrackingController } from './time-tracking.controller';
import { HrTimeTrackingService } from './time-tracking.service';
import { HrLeaveController } from './leave.controller';
import { HrLeaveService } from './leave.service';
import { HrPerformanceController } from './performance.controller';
import { HrPerformanceService } from './performance.service';
import { HrOnboardingController } from './onboarding.controller';
import { HrOnboardingService } from './onboarding.service';
import { HrMailService } from './hr-mail.service';

@Module({
  imports: [PrismaModule, AuditModule, RbacModule, StorageModule, TeamModule],
  controllers: [
    JobPositionController,
    EmployeeController,
    ContractController,
    HrReportController,
    CafeteriaController,
    RecruitmentController,
    HrTimeTrackingController,
    HrLeaveController,
    HrPerformanceController,
    HrOnboardingController,
  ],
  providers: [
    JobPositionService,
    EmployeeService,
    ContractService,
    HrReportService,
    CafeteriaService,
    HrRecruitmentService,
    HrTimeTrackingService,
    HrLeaveService,
    HrPerformanceService,
    HrOnboardingService,
    HrMailService,
  ],
  exports: [JobPositionService, EmployeeService, ContractService, HrReportService, HrMailService],
})
export class HrModule {}

