import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PackageModuleGuard } from './package-module.guard';

@Global()
@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: PackageModuleGuard,
    },
  ],
})
export class PackageGuardModule {}
