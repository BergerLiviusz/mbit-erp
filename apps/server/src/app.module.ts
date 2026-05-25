import { Module, Type } from '@nestjs/common';
import { isPackageModuleEnabled, getActivePackageIdFromEnv } from '@mbit-erp/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CrmModule } from './crm/crm.module';
import { DmsModule } from './dms/dms.module';
import { LogisticsModule } from './logistics/logistics.module';
import { AuditModule as OldAuditModule } from './audit/audit.module';
import { StorageModule } from './common/storage/storage.module';
import { RbacModule } from './common/rbac/rbac.module';
import { AuditModule } from './common/audit/audit.module';
import { BackupModule } from './common/backup/backup.module';
import { PackageModule } from './common/package/package.module';
import { SystemModule } from './system/system.module';
import { SeedModule } from './seed/seed.module';
import { TeamModule } from './team/team.module';
import { HrModule } from './hr/hr.module';
import { ControllingModule } from './controlling/controlling.module';

const activePackageId = getActivePackageIdFromEnv();

function moduleIfEnabled(
  moduleKey: Parameters<typeof isPackageModuleEnabled>[0],
  nestModule: Type<unknown>,
): Type<unknown>[] {
  return isPackageModuleEnabled(moduleKey, activePackageId) ? [nestModule] : [];
}

@Module({
  imports: [
    PrismaModule,
    PackageModule,
    SeedModule,
    StorageModule,
    RbacModule,
    AuditModule,
    BackupModule,
    AuthModule,
    ...moduleIfEnabled('crm', CrmModule),
    ...moduleIfEnabled('documents', DmsModule),
    ...moduleIfEnabled('logistics', LogisticsModule),
    OldAuditModule,
    SystemModule,
    ...moduleIfEnabled('team', TeamModule),
    ...moduleIfEnabled('hr', HrModule),
    ...moduleIfEnabled('controlling', ControllingModule),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
