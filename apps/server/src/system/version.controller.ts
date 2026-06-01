import { Controller, Get } from '@nestjs/common';
import {
  formatVersionLabel,
  getActivePackageIdFromEnv,
  getPackageDefinition,
} from '@mbit-erp/config';
import { Public } from '../common/rbac/rbac.decorator';

@Controller('system')
export class VersionController {
  @Get('version')
  @Public()
  getVersion() {
    const packageId = getActivePackageIdFromEnv();
    const pkg = getPackageDefinition(packageId);
    const version = process.env.APP_VERSION || pkg.version;

    return {
      name: 'MBIT ERP',
      version,
      packageId: pkg.id,
      edition: pkg.editionLabel,
      label: formatVersionLabel({ version, packageEdition: pkg.editionLabel }),
      buildDate: process.env.BUILD_DATE || null,
      buildSha: process.env.BUILD_SHA || process.env.GITHUB_SHA || null,
    };
  }
}
