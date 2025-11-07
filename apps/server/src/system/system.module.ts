import { Module } from '@nestjs/common';
import { SystemSettingsController } from './settings.controller';
import { SystemSettingsService } from './settings.service';
import { HealthController } from './health.controller';
import { DiagnosticsController } from './diagnostics.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { BackupModule } from '../common/backup/backup.module';
import { AuditModule } from '../common/audit/audit.module';
import { StorageModule } from '../common/storage/storage.module';
import { RbacModule } from '../common/rbac/rbac.module';

@Module({
  imports: [PrismaModule, BackupModule, AuditModule, StorageModule, RbacModule],
  controllers: [SystemSettingsController, HealthController, DiagnosticsController],
  providers: [SystemSettingsService],
  exports: [SystemSettingsService],
})
export class SystemModule {}
