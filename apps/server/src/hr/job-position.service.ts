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
  jobDescriptionDocumentId?: string | null;
}

export interface UpdateJobPositionDto {
  nev?: string;
  leiras?: string;
  feladatok?: string;
  hataskorok?: string;
  osztaly?: string;
  reszleg?: string;
  aktiv?: boolean;
  jobDescriptionDocumentId?: string | null;
}

@Injectable()
export class JobPositionService {
  constructor(private prisma: PrismaService) {}

  private normalizeOptionalId(value: string | null | undefined): string | null | undefined {
    if (value === undefined) return undefined;
    if (value === null) return null;
    const trimmed = value.trim();
    return trimmed.length === 0 ? null : trimmed;
  }

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
          jobDescriptionDocument: {
            select: { id: true, nev: true, iktatoSzam: true },
          },
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

  async findEmployees(id: string) {
    await this.findOne(id);
    return this.prisma.employee.findMany({
      where: { jobPositionId: id },
      select: {
        id: true,
        azonosito: true,
        vezetekNev: true,
        keresztNev: true,
        email: true,
        telefon: true,
        allapot: true,
        aktiv: true,
        munkaviszonyKezdete: true,
        osztaly: true,
        reszleg: true,
      },
      orderBy: [{ vezetekNev: 'asc' }, { keresztNev: 'asc' }],
    });
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
        jobDescriptionDocument: {
          select: {
            id: true,
            nev: true,
            iktatoSzam: true,
            fajlNev: true,
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

    const data: CreateJobPositionDto = {
      ...dto,
      jobDescriptionDocumentId: this.normalizeOptionalId(dto.jobDescriptionDocumentId),
    };

    return this.prisma.jobPosition.create({
      data,
    });
  }

  async update(id: string, dto: UpdateJobPositionDto) {
    const position = await this.findOne(id);

    const data: UpdateJobPositionDto = {
      ...dto,
      jobDescriptionDocumentId:
        dto.jobDescriptionDocumentId !== undefined
          ? this.normalizeOptionalId(dto.jobDescriptionDocumentId)
          : undefined,
    };

    return this.prisma.jobPosition.update({
      where: { id },
      data,
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

