import { Injectable } from '@nestjs/common';
import {
  APP_VERSION,
  formatVersionLabel,
  getActivePackageIdFromEnv,
  getPackageDefinition,
  getVersionInfoFromEnv,
  isPackageModuleEnabled,
  isPermissionAllowedInPackage,
  PackageDefinition,
  PackageModuleKey,
} from '@mbit-erp/config';

@Injectable()
export class PackageResolverService {
  getActivePackageId(): string {
    return getActivePackageIdFromEnv();
  }

  getActivePackage(): PackageDefinition {
    return getPackageDefinition(this.getActivePackageId());
  }

  isModuleEnabled(module: PackageModuleKey): boolean {
    return isPackageModuleEnabled(module, this.getActivePackageId());
  }

  isPermissionAllowed(permissionCode: string): boolean {
    return isPermissionAllowedInPackage(permissionCode, this.getActivePackageId());
  }

  getVersionInfo() {
    const info = getVersionInfoFromEnv();
    const pkg = this.getActivePackage();
    const version = info.version || APP_VERSION;
    return {
      appName: 'MBIT ERP',
      version,
      buildSha: info.buildSha,
      buildDate: info.buildDate,
      packageId: pkg.id,
      packageDisplayName: pkg.displayName,
      editionLabel: pkg.editionLabel,
      environment: info.environment,
      versionLabel: formatVersionLabel({
        version,
        packageEdition: pkg.editionLabel,
        environment: info.environment,
        buildSha: info.buildSha,
      }),
      enabledModules: pkg.modules,
    };
  }
}
