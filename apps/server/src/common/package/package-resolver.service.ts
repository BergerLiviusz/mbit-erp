import { Injectable } from '@nestjs/common';
import {
  APP_VERSION,
  ErpModuleKey,
  ErpPackageDefinition,
  getActivePackageIdFromEnv,
  getPackageDefinition,
  isPackageModuleEnabled,
  isPermissionAllowedInPackage,
  formatVersionLabel,
  getVersionInfoFromEnv,
} from '@mbit-erp/config';

@Injectable()
export class PackageResolverService {
  getActivePackageId(): string {
    return getActivePackageIdFromEnv();
  }

  getActivePackage(): ErpPackageDefinition {
    return getPackageDefinition(this.getActivePackageId());
  }

  isModuleEnabled(module: ErpModuleKey): boolean {
    return isPackageModuleEnabled(module, this.getActivePackageId());
  }

  isPermissionAllowed(permissionCode: string): boolean {
    return isPermissionAllowedInPackage(permissionCode, this.getActivePackageId());
  }

  getVersionInfo() {
    const info = getVersionInfoFromEnv();
    const pkg = this.getActivePackage();
    return {
      appName: 'MBIT ERP',
      version: info.version || APP_VERSION,
      buildSha: info.buildSha,
      buildDate: info.buildDate,
      packageId: pkg.id,
      packageDisplayName: pkg.displayName,
      editionLabel: pkg.editionLabel,
      environment: info.environment,
      versionLabel: formatVersionLabel({
        version: info.version || APP_VERSION,
        packageEdition: pkg.editionLabel,
        environment: info.environment,
        buildSha: info.buildSha,
      }),
      enabledModules: pkg.modules,
    };
  }
}
