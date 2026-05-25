import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  API_ALWAYS_ALLOWED_PREFIXES,
  API_ROUTE_MODULE_MAP,
} from '@mbit-erp/config';
import { PackageResolverService } from './package-resolver.service';

@Injectable()
export class PackageModuleGuard implements CanActivate {
  constructor(private readonly packages: PackageResolverService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const path: string = (request.path || request.url || '').replace(/^\//, '');
    const segments = path.split('/').filter(Boolean);
    const prefix = segments[0];

    if (!prefix || API_ALWAYS_ALLOWED_PREFIXES.includes(prefix)) {
      return true;
    }

    const moduleKey = API_ROUTE_MODULE_MAP[prefix];
    if (!moduleKey) {
      return true;
    }

    if (!this.packages.isModuleEnabled(moduleKey)) {
      throw new ForbiddenException(
        `A(z) "${this.packages.getActivePackage().displayName}" csomag nem tartalmazza a kért modult (${prefix}).`,
      );
    }

    return true;
  }
}
