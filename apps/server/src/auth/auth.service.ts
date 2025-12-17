import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { roles: { include: { role: true } } },
    });

    if (!user) {
      throw new UnauthorizedException('Érvénytelen bejelentkezési adatok');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Érvénytelen bejelentkezési adatok');
    }

    if (!user.aktiv) {
      throw new UnauthorizedException('A fiók inaktív');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles.map(ur => ur.role.nev),
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        nev: user.nev,
        roles: user.roles.map(ur => ur.role.nev),
      },
    };
  }

  async register(email: string, password: string, nev: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nev,
      },
    });

    const userRole = await this.prisma.role.findUnique({
      where: { nev: 'User' },
    });

    if (userRole) {
      await this.prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: userRole.id,
        },
      });
    }

    return this.login(email, password);
  }

  async getAdminEmail() {
    // Find admin user by Admin role
    const adminRole = await this.prisma.role.findUnique({
      where: { nev: 'Admin' },
    });

    if (!adminRole) {
      console.log('[AuthService] Admin role not found, returning default email');
      return { email: 'admin@mbit.hu' };
    }

    const adminUser = await this.prisma.user.findFirst({
      where: {
        roles: {
          some: {
            roleId: adminRole.id,
          },
        },
        aktiv: true,
      },
      orderBy: {
        createdAt: 'asc', // Get the first admin user (usually the default one)
      },
    });

    if (!adminUser) {
      console.log('[AuthService] Admin user not found, returning default email');
      return { email: 'admin@mbit.hu' };
    }

    console.log('[AuthService] Found admin user:', { id: adminUser.id, email: adminUser.email });
    return { email: adminUser.email };
  }
}
