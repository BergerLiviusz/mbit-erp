import { Module } from '@nestjs/common';
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
import { SystemModule } from './system/system.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    PrismaModule,
    SeedModule,
    StorageModule,
    RbacModule,
    AuditModule,
    BackupModule,
    AuthModule,
    CrmModule,
    DmsModule,
    LogisticsModule,
    OldAuditModule,
    SystemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
