import { Module, Global } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RbacGuard } from './rbac.guard';
import { PrismaModule } from '../../prisma/prisma.module';
import { PackageGuardModule } from '../package/package.module';

@Global()
@Module({
  imports: [PrismaModule, PackageGuardModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RbacGuard,
    },
  ],
})
export class RbacModule {}
