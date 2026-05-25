import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/rbac/rbac.decorator';
import { PackageResolverService } from '../common/package/package-resolver.service';

@Controller('system/version')
export class VersionController {
  constructor(private readonly packages: PackageResolverService) {}

  @Get()
  @Public()
  getVersion() {
    return this.packages.getVersionInfo();
  }
}
