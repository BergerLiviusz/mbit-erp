import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../common/audit/audit.module';
import { RbacModule } from '../common/rbac/rbac.module';
import { JobPositionController } from './job-position.controller';
import { JobPositionService } from './job-position.service';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';
import { HrReportController } from './report.controller';
import { HrReportService } from './report.service';

@Module({
  imports: [PrismaModule, AuditModule, RbacModule],
  controllers: [JobPositionController, EmployeeController, ContractController, HrReportController],
  providers: [JobPositionService, EmployeeService, ContractService, HrReportService],
  exports: [JobPositionService, EmployeeService, ContractService, HrReportService],
})
export class HrModule {}

