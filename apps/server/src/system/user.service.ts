import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export interface CreateUserDto {
  email: string;
  password: string;
  nev: string;
  aktiv?: boolean;
}

export interface UpdateUserDto {
  email?: string;
  nev?: string;
  aktiv?: boolean;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip = 0, take = 50) {
    const [total, items] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.findMany({
        skip,
        take,
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, items };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Felhasználó nem található');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async create(dto: CreateUserDto) {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Ez az email cím már használatban van');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        nev: dto.nev,
        aktiv: dto.aktiv !== undefined ? dto.aktiv : true,
      },
    });

    // Assign default "User" role (non-admin)
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

    return this.findOne(user.id);
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findOne(id);

    // Check if email is being changed and if it's already taken
    if (dto.email && dto.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new BadRequestException('Ez az email cím már használatban van');
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: dto,
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.findOne(userId);

    const isPasswordValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('A jelenlegi jelszó nem megfelelő');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });
  }

  async adminChangePassword(userId: string, newPassword: string) {
    if (!newPassword || newPassword.length < 4) {
      throw new BadRequestException('A jelszónak legalább 4 karakternek kell lennie');
    }

    const user = await this.findOne(userId);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });
  }

  async delete(id: string) {
    const user = await this.findOne(id);

    // Prevent deleting the default admin user
    if (user.email === 'admin@mbit.hu') {
      throw new BadRequestException('Az alapértelmezett admin felhasználó nem törölhető');
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }
}

