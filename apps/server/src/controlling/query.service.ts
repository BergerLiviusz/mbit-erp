import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateQueryTemplateDto {
  azonosito: string;
  nev: string;
  leiras?: string;
  query: string;
  parameterek?: string;
  kategoria?: string;
}

export interface UpdateQueryTemplateDto {
  nev?: string;
  leiras?: string;
  query?: string;
  parameterek?: string;
  kategoria?: string;
  aktiv?: boolean;
}

export interface CreateAdHocQueryDto {
  nev: string;
  leiras?: string;
  query: string;
  parameterek?: string;
}

export interface ExecuteQueryDto {
  query: string;
  parameterek?: any;
}

@Injectable()
export class QueryService {
  constructor(private prisma: PrismaService) {}

  // Query Templates
  async findAllTemplates(skip = 0, take = 50, filters?: {
    kategoria?: string;
    aktiv?: boolean;
  }) {
    const where: any = {};

    if (filters?.kategoria) {
      where.kategoria = filters.kategoria;
    }

    if (filters?.aktiv !== undefined) {
      where.aktiv = filters.aktiv;
    }

    const [total, items] = await Promise.all([
      this.prisma.queryTemplate.count({ where }),
      this.prisma.queryTemplate.findMany({
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

  async findTemplate(id: string) {
    const template = await this.prisma.queryTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Lekérdezés sablon nem található');
    }

    return template;
  }

  async createTemplate(dto: CreateQueryTemplateDto) {
    // Check if azonosito already exists
    const existing = await this.prisma.queryTemplate.findUnique({
      where: { azonosito: dto.azonosito },
    });

    if (existing) {
      throw new BadRequestException('Ez az azonosító már használatban van');
    }

    return this.prisma.queryTemplate.create({
      data: dto,
    });
  }

  async updateTemplate(id: string, dto: UpdateQueryTemplateDto) {
    const template = await this.findTemplate(id);
    return this.prisma.queryTemplate.update({
      where: { id },
      data: dto,
    });
  }

  async deleteTemplate(id: string) {
    const template = await this.findTemplate(id);
    return this.prisma.queryTemplate.delete({
      where: { id },
    });
  }

  // Ad-hoc Queries
  async findAllAdHocQueries(skip = 0, take = 50) {
    const [total, items] = await Promise.all([
      this.prisma.adHocQuery.count(),
      this.prisma.adHocQuery.findMany({
        skip,
        take,
        include: {
          createdBy: {
            select: {
              id: true,
              nev: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    return { total, items };
  }

  async findAdHocQuery(id: string) {
    const query = await this.prisma.adHocQuery.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
      },
    });

    if (!query) {
      throw new NotFoundException('Ad-hoc lekérdezés nem található');
    }

    return query;
  }

  async createAdHocQuery(dto: CreateAdHocQueryDto, userId?: string) {
    return this.prisma.adHocQuery.create({
      data: {
        ...dto,
        createdById: userId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
      },
    });
  }

  async executeQuery(dto: ExecuteQueryDto): Promise<any[]> {
    // WARNING: This is a simplified implementation
    // In production, you should:
    // 1. Validate the query to prevent SQL injection
    // 2. Use parameterized queries
    // 3. Limit query execution time
    // 4. Restrict to SELECT queries only
    
    try {
      // For now, return empty array as placeholder
      // In production, execute against the database connection
      return [];
    } catch (error: any) {
      throw new BadRequestException(`Hiba a lekérdezés végrehajtásakor: ${error.message}`);
    }
  }

  async deleteAdHocQuery(id: string) {
    const query = await this.findAdHocQuery(id);
    return this.prisma.adHocQuery.delete({
      where: { id },
    });
  }
}

