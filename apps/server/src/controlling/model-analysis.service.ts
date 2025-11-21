import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateCostModelDto {
  azonosito: string;
  nev: string;
  leiras?: string;
  tipus: string;
  parameterek?: string;
  formula?: string;
}

export interface UpdateCostModelDto {
  nev?: string;
  leiras?: string;
  tipus?: string;
  parameterek?: string;
  formula?: string;
  aktiv?: boolean;
}

export interface CreateQuantityModelDto {
  azonosito: string;
  nev: string;
  leiras?: string;
  parameterek?: string;
  formula?: string;
}

export interface UpdateQuantityModelDto {
  nev?: string;
  leiras?: string;
  parameterek?: string;
  formula?: string;
  aktiv?: boolean;
}

export interface RunModelDto {
  parameterek?: any;
}

@Injectable()
export class ModelAnalysisService {
  constructor(private prisma: PrismaService) {}

  // Cost Models
  async findAllCostModels(skip = 0, take = 50, filters?: {
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
      this.prisma.costModel.count({ where }),
      this.prisma.costModel.findMany({
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

  async findCostModel(id: string) {
    const model = await this.prisma.costModel.findUnique({
      where: { id },
    });

    if (!model) {
      throw new NotFoundException('Költségmodell nem található');
    }

    return model;
  }

  async createCostModel(dto: CreateCostModelDto) {
    const existing = await this.prisma.costModel.findUnique({
      where: { azonosito: dto.azonosito },
    });

    if (existing) {
      throw new BadRequestException('Ez az azonosító már használatban van');
    }

    const validTypes = ['FIXED', 'VARIABLE', 'MIXED'];
    if (!validTypes.includes(dto.tipus.toUpperCase())) {
      throw new BadRequestException('Érvénytelen modell típus');
    }

    return this.prisma.costModel.create({
      data: {
        ...dto,
        tipus: dto.tipus.toUpperCase(),
      },
    });
  }

  async updateCostModel(id: string, dto: UpdateCostModelDto) {
    const model = await this.findCostModel(id);

    if (dto.tipus) {
      const validTypes = ['FIXED', 'VARIABLE', 'MIXED'];
      if (!validTypes.includes(dto.tipus.toUpperCase())) {
        throw new BadRequestException('Érvénytelen modell típus');
      }
    }

    return this.prisma.costModel.update({
      where: { id },
      data: {
        ...dto,
        tipus: dto.tipus ? dto.tipus.toUpperCase() : undefined,
      },
    });
  }

  async runCostModel(id: string, dto: RunModelDto): Promise<any> {
    const model = await this.findCostModel(id);

    if (!model.formula) {
      throw new BadRequestException('A modellnek nincs képlete');
    }

    // Placeholder implementation - in production, parse and evaluate formula
    try {
      return {
        modelId: id,
        modelNev: model.nev,
        eredmeny: 0,
        parameterek: dto.parameterek || {},
      };
    } catch (error: any) {
      throw new BadRequestException(`Hiba a modell futtatásakor: ${error.message}`);
    }
  }

  async deleteCostModel(id: string) {
    const model = await this.findCostModel(id);
    return this.prisma.costModel.delete({
      where: { id },
    });
  }

  // Quantity Models
  async findAllQuantityModels(skip = 0, take = 50, filters?: {
    aktiv?: boolean;
  }) {
    const where: any = {};

    if (filters?.aktiv !== undefined) {
      where.aktiv = filters.aktiv;
    }

    const [total, items] = await Promise.all([
      this.prisma.quantityModel.count({ where }),
      this.prisma.quantityModel.findMany({
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

  async findQuantityModel(id: string) {
    const model = await this.prisma.quantityModel.findUnique({
      where: { id },
    });

    if (!model) {
      throw new NotFoundException('Mennyiségi modell nem található');
    }

    return model;
  }

  async createQuantityModel(dto: CreateQuantityModelDto) {
    const existing = await this.prisma.quantityModel.findUnique({
      where: { azonosito: dto.azonosito },
    });

    if (existing) {
      throw new BadRequestException('Ez az azonosító már használatban van');
    }

    return this.prisma.quantityModel.create({
      data: dto,
    });
  }

  async updateQuantityModel(id: string, dto: UpdateQuantityModelDto) {
    const model = await this.findQuantityModel(id);
    return this.prisma.quantityModel.update({
      where: { id },
      data: dto,
    });
  }

  async runQuantityModel(id: string, dto: RunModelDto): Promise<any> {
    const model = await this.findQuantityModel(id);

    if (!model.formula) {
      throw new BadRequestException('A modellnek nincs képlete');
    }

    // Placeholder implementation
    try {
      return {
        modelId: id,
        modelNev: model.nev,
        eredmeny: 0,
        parameterek: dto.parameterek || {},
      };
    } catch (error: any) {
      throw new BadRequestException(`Hiba a modell futtatásakor: ${error.message}`);
    }
  }

  async deleteQuantityModel(id: string) {
    const model = await this.findQuantityModel(id);
    return this.prisma.quantityModel.delete({
      where: { id },
    });
  }
}

