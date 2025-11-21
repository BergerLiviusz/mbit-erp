import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateDataSourceDto {
  nev: string;
  tipus: string;
  connectionId?: string;
  konfiguracio?: string;
}

export interface UpdateDataSourceDto {
  nev?: string;
  tipus?: string;
  connectionId?: string;
  konfiguracio?: string;
  aktiv?: boolean;
}

export interface CreateDataLoadJobDto {
  dataSourceId: string;
  nev: string;
  schedule?: string;
}

export interface UpdateDataLoadJobDto {
  nev?: string;
  schedule?: string;
  allapot?: string;
}

@Injectable()
export class DataSourceService {
  constructor(private prisma: PrismaService) {}

  async findAllDataSources(skip = 0, take = 50, filters?: {
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
      this.prisma.dataSource.count({ where }),
      this.prisma.dataSource.findMany({
        where,
        skip,
        take,
        include: {
          connection: {
            select: {
              id: true,
              nev: true,
              tipus: true,
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

  async findDataSource(id: string) {
    const source = await this.prisma.dataSource.findUnique({
      where: { id },
      include: {
        connection: true,
      },
    });

    if (!source) {
      throw new NotFoundException('Adatforrás nem található');
    }

    return source;
  }

  async createDataSource(dto: CreateDataSourceDto) {
    const validTypes = ['DATABASE', 'FILE', 'API', 'MANUAL'];
    if (!validTypes.includes(dto.tipus.toUpperCase())) {
      throw new BadRequestException('Érvénytelen adatforrás típus');
    }

    if (dto.connectionId) {
      const connection = await this.prisma.databaseConnection.findUnique({
        where: { id: dto.connectionId },
      });

      if (!connection) {
        throw new NotFoundException('Adatbázis kapcsolat nem található');
      }
    }

    return this.prisma.dataSource.create({
      data: {
        ...dto,
        tipus: dto.tipus.toUpperCase(),
      },
      include: {
        connection: true,
      },
    });
  }

  async updateDataSource(id: string, dto: UpdateDataSourceDto) {
    const source = await this.findDataSource(id);

    if (dto.tipus) {
      const validTypes = ['DATABASE', 'FILE', 'API', 'MANUAL'];
      if (!validTypes.includes(dto.tipus.toUpperCase())) {
        throw new BadRequestException('Érvénytelen adatforrás típus');
      }
    }

    if (dto.connectionId) {
      const connection = await this.prisma.databaseConnection.findUnique({
        where: { id: dto.connectionId },
      });

      if (!connection) {
        throw new NotFoundException('Adatbázis kapcsolat nem található');
      }
    }

    return this.prisma.dataSource.update({
      where: { id },
      data: {
        ...dto,
        tipus: dto.tipus ? dto.tipus.toUpperCase() : undefined,
      },
      include: {
        connection: true,
      },
    });
  }

  async deleteDataSource(id: string) {
    const source = await this.findDataSource(id);
    return this.prisma.dataSource.delete({
      where: { id },
    });
  }

  // Data Load Jobs
  async findAllDataLoadJobs(skip = 0, take = 50, filters?: {
    dataSourceId?: string;
    allapot?: string;
  }) {
    const where: any = {};

    if (filters?.dataSourceId) {
      where.dataSourceId = filters.dataSourceId;
    }

    if (filters?.allapot) {
      where.allapot = filters.allapot;
    }

    const [total, items] = await Promise.all([
      this.prisma.dataLoadJob.count({ where }),
      this.prisma.dataLoadJob.findMany({
        where,
        skip,
        take,
        include: {
          dataSource: {
            select: {
              id: true,
              nev: true,
              tipus: true,
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

  async findDataLoadJob(id: string) {
    const job = await this.prisma.dataLoadJob.findUnique({
      where: { id },
      include: {
        dataSource: true,
      },
    });

    if (!job) {
      throw new NotFoundException('Adatbetöltési feladat nem található');
    }

    return job;
  }

  async createDataLoadJob(dto: CreateDataLoadJobDto) {
    const source = await this.prisma.dataSource.findUnique({
      where: { id: dto.dataSourceId },
    });

    if (!source) {
      throw new NotFoundException('Adatforrás nem található');
    }

    // Calculate next run time if schedule is provided
    let kovetkezoFuttatas: Date | null = null;
    if (dto.schedule && dto.schedule !== 'MANUAL') {
      // Simple cron parsing - in production use a proper cron library
      kovetkezoFuttatas = new Date(Date.now() + 24 * 60 * 60 * 1000); // Default: tomorrow
    }

    return this.prisma.dataLoadJob.create({
      data: {
        ...dto,
        schedule: dto.schedule || 'MANUAL',
        kovetkezoFuttatas,
        allapot: dto.schedule && dto.schedule !== 'MANUAL' ? 'ACTIVE' : 'INACTIVE',
      },
      include: {
        dataSource: true,
      },
    });
  }

  async updateDataLoadJob(id: string, dto: UpdateDataLoadJobDto) {
    const job = await this.findDataLoadJob(id);

    let kovetkezoFuttatas = job.kovetkezoFuttatas;
    if (dto.schedule && dto.schedule !== 'MANUAL' && dto.schedule !== job.schedule) {
      kovetkezoFuttatas = new Date(Date.now() + 24 * 60 * 60 * 1000);
    }

    return this.prisma.dataLoadJob.update({
      where: { id },
      data: {
        ...dto,
        kovetkezoFuttatas,
      },
      include: {
        dataSource: true,
      },
    });
  }

  async deleteDataLoadJob(id: string) {
    const job = await this.findDataLoadJob(id);
    return this.prisma.dataLoadJob.delete({
      where: { id },
    });
  }
}

