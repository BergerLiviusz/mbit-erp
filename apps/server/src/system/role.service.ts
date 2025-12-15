import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip = 0, take = 50) {
    const [total, items] = await Promise.all([
      this.prisma.role.count(),
      this.prisma.role.findMany({
        skip,
        take,
        orderBy: { nev: 'asc' },
      }),
    ]);

    return { total, items };
  }

  async findOne(id: string) {
    return this.prisma.role.findUnique({
      where: { id },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }
}

