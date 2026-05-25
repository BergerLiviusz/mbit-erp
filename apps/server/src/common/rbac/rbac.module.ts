import { Module, Global } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RbacGuard } from './rbac.guard';
import { PermissionSyncService } from './permission-sync.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [
    PermissionSyncService,
    {
      provide: APP_GUARD,
      useClass: RbacGuard,
    },
  ],
  exports: [PermissionSyncService],
})
export class RbacModule {}
