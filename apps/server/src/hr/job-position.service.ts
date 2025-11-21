import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateJobPositionDto {
  azonosito: string;
  nev: string;
  leiras?: string;
  feladatok?: string;
  hataskorok?: string;
  osztaly?: string;
  reszleg?: string;
}

export interface UpdateJobPositionDto {
  nev?: string;
  leiras?: string;
  feladatok?: string;
  hataskorok?: string;
  osztaly?: string;
  reszleg?: string;
  aktiv?: boolean;
}

@Injectable()
export class JobPositionService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip = 0, take = 50, filters?: {
    osztaly?: string;
    reszleg?: string;
    aktiv?: boolean;
  }) {
    const where: any = {};

    if (filters?.osztaly) {
      where.osztaly = filters.osztaly;
    }

    if (filters?.reszleg) {
      where.reszleg = filters.reszleg;
    }

    if (filters?.aktiv !== undefined) {
      where.aktiv = filters.aktiv;
    }

    const [total, items] = await Promise.all([
      this.prisma.jobPosition.count({ where }),
      this.prisma.jobPosition.findMany({
        where,
        skip,
        take,
        include: {
          _count: {
            select: {
              employees: true,
            },
          },
        },
        orderBy: {
          nev: 'asc',
        },
      }),
    ]);

    return { total, items };
  }

  async findOne(id: string) {
    const position = await this.prisma.jobPosition.findUnique({
      where: { id },
      include: {
        employees: {
          select: {
            id: true,
            azonosito: true,
            vezetekNev: true,
            keresztNev: true,
            aktiv: true,
          },
        },
        _count: {
          select: {
            employees: true,
          },
        },
      },
    });

    if (!position) {
      throw new NotFoundException('Munkakör nem található');
    }

    return position;
  }

  async create(dto: CreateJobPositionDto) {
    // Check if azonosito already exists
    const existing = await this.prisma.jobPosition.findUnique({
      where: { azonosito: dto.azonosito },
    });

    if (existing) {
      throw new BadRequestException('Ez az azonosító már használatban van');
    }

    return this.prisma.jobPosition.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateJobPositionDto) {
    const position = await this.findOne(id);

    return this.prisma.jobPosition.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    const position = await this.findOne(id);

    // Check if there are employees with this position
    const employeeCount = await this.prisma.employee.count({
      where: { jobPositionId: id },
    });

    if (employeeCount > 0) {
      throw new BadRequestException('Nem törölhető munkakör, mert vannak hozzárendelt dolgozók');
    }

    return this.prisma.jobPosition.delete({
      where: { id },
    });
  }
}

