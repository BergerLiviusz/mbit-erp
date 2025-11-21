import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateKPIDto {
  azonosito: string;
  nev: string;
  leiras?: string;
  tipus: string;
  formula?: string;
  parameterek?: string;
  egyseg?: string;
  celErtek?: number;
}

export interface UpdateKPIDto {
  nev?: string;
  leiras?: string;
  tipus?: string;
  formula?: string;
  parameterek?: string;
  egyseg?: string;
  celErtek?: number;
  aktualisErtek?: number;
  aktiv?: boolean;
}

@Injectable()
export class KpiService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip = 0, take = 50, filters?: {
    aktiv?: boolean;
    tipus?: string;
  }) {
    const where: any = {};

    if (filters?.aktiv !== undefined) {
      where.aktiv = filters.aktiv;
    }

    if (filters?.tipus) {
      where.tipus = filters.tipus;
    }

    const [total, items] = await Promise.all([
      this.prisma.kPI.count({ where }),
      this.prisma.kPI.findMany({
        where,
        skip,
        take,
        orderBy: {
          nev: 'asc',
        },
      }),
    ]);

    return { total, items };
  }

  async findOne(id: string) {
    const kpi = await this.prisma.kPI.findUnique({
      where: { id },
    });

    if (!kpi) {
      throw new NotFoundException('KPI nem található');
    }

    return kpi;
  }

  async create(dto: CreateKPIDto) {
    // Check if azonosito already exists
    const existing = await this.prisma.kPI.findUnique({
      where: { azonosito: dto.azonosito },
    });

    if (existing) {
      throw new BadRequestException('Ez az azonosító már használatban van');
    }

    // Validate tipus
    const validTypes = ['NUMBER', 'PERCENTAGE', 'CURRENCY', 'NATURAL'];
    if (!validTypes.includes(dto.tipus.toUpperCase())) {
      throw new BadRequestException('Érvénytelen KPI típus');
    }

    return this.prisma.kPI.create({
      data: {
        ...dto,
        tipus: dto.tipus.toUpperCase(),
      },
    });
  }

  async update(id: string, dto: UpdateKPIDto) {
    const kpi = await this.findOne(id);

    if (dto.tipus) {
      const validTypes = ['NUMBER', 'PERCENTAGE', 'CURRENCY', 'NATURAL'];
      if (!validTypes.includes(dto.tipus.toUpperCase())) {
        throw new BadRequestException('Érvénytelen KPI típus');
      }
    }

    return this.prisma.kPI.update({
      where: { id },
      data: {
        ...dto,
        tipus: dto.tipus ? dto.tipus.toUpperCase() : undefined,
        utolsoFrissites: dto.aktualisErtek !== undefined ? new Date() : undefined,
      },
    });
  }

  async calculateKPI(id: string): Promise<number> {
    const kpi = await this.findOne(id);

    if (!kpi.formula) {
      throw new BadRequestException('A KPI-nak nincs képlete');
    }

    // Simple formula evaluation - in production, use a proper formula parser
    // This is a placeholder implementation
    try {
      // For now, return a placeholder value
      // In production, parse the formula and evaluate it against actual data
      return 0;
    } catch (error: any) {
      throw new BadRequestException(`Hiba a KPI számításakor: ${error.message}`);
    }
  }

  async delete(id: string) {
    const kpi = await this.findOne(id);
    return this.prisma.kPI.delete({
      where: { id },
    });
  }
}

