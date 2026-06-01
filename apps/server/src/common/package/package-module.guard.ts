import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  API_ALWAYS_ALLOWED_PREFIXES,
  API_ROUTE_MODULE_MAP,
  getActivePackageIdFromEnv,
  isPackageModuleEnabled,
  PackageModuleKey,
} from '@mbit-erp/config';

@Injectable()
export class PackageModuleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const path: string = request.url || request.path || '';
    const segments = path.replace(/^\//, '').split('/').filter(Boolean);
    const prefix = segments[0];

    if (!prefix || API_ALWAYS_ALLOWED_PREFIXES.includes(prefix)) {
      return true;
    }

    const module = API_ROUTE_MODULE_MAP[prefix] as PackageModuleKey | undefined;
    if (!module) {
      return true;
    }

    const packageId = getActivePackageIdFromEnv();
    if (!isPackageModuleEnabled(module, packageId)) {
      throw new ForbiddenException(
        `A(z) ${module} modul nem része az aktív csomagnak (${packageId}).`,
      );
    }

    return true;
  }
}
