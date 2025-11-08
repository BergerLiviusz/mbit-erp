import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Permission } from './permission.enum';
import { PERMISSIONS_KEY, IS_PUBLIC_KEY } from './rbac.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RbacGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Bypass authentication completely when running in Electron desktop mode
    // This allows the desktop app to work without requiring user login
    const isElectronDesktop = process.env.ELECTRON_RUN_AS_NODE === '1';
    if (isElectronDesktop) {
      // Create a mock user object for Electron desktop mode
      const request = context.switchToHttp().getRequest();
      request.user = {
        id: 'electron-desktop-user',
        userId: 'electron-desktop-user',
        email: 'desktop@mbit.local',
        roles: ['Admin', 'User'],
      };
      return true;
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const jwtAuthenticated = await super.canActivate(context);
    if (!jwtAuthenticated) {
      throw new ForbiddenException('Nincs bejelentkezve');
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Nincs bejelentkezve');
    }

    const userRoles = await this.prisma.userRole.findMany({
      where: { userId: user.id },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!userRoles || userRoles.length === 0) {
      throw new ForbiddenException(
        'Felhasználóhoz nem tartoznak szerepkörök. Kérjük, lépjen kapcsolatba a rendszergazdával.',
      );
    }

    const userPermissions = new Set<string>();

    for (const userRole of userRoles) {
      for (const rolePermission of userRole.role.rolePermissions) {
        userPermissions.add(rolePermission.permission.kod);
      }
    }

    const hasPermission = requiredPermissions.some((permission) =>
      userPermissions.has(permission),
    );

    if (!hasPermission) {
      const permissionNames = requiredPermissions.join(', ');
      throw new ForbiddenException(
        `Nincs megfelelő jogosultság. Szükséges: ${permissionNames}`,
      );
    }

    return true;
  }
}
