import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PackageModuleGuard } from './package-module.guard';
import { PackageResolverService } from './package-resolver.service';

@Global()
@Module({
  providers: [
    PackageResolverService,
    {
      provide: APP_GUARD,
      useClass: PackageModuleGuard,
    },
  ],
  exports: [PackageResolverService],
})
export class PackageGuardModule {}
