import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PackageResolverService } from './package-resolver.service';
import { PackageModuleGuard } from './package-module.guard';

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
export class PackageModule {}
