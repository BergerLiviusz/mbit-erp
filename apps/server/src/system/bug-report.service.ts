import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateBugReportDto {
  cim: string;
  leiras: string;
  lepesek?: string;
  vartEredmeny?: string;
  tenylegesEredmeny?: string;
  prioritas?: string;
  kategoria?: string;
  modul?: string;
  bongeszo?: string;
  operaciosRendszer?: string;
  screenshotUtvonal?: string;
}

export interface UpdateBugReportDto {
  cim?: string;
  leiras?: string;
  lepesek?: string;
  vartEredmeny?: string;
  tenylegesEredmeny?: string;
  prioritas?: string;
  allapot?: string;
  kategoria?: string;
  modul?: string;
}

export interface CreateBugReportCommentDto {
  szoveg: string;
}

@Injectable()
export class BugReportService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip = 0, take = 50, filters?: {
    allapot?: string;
    prioritas?: string;
    kategoria?: string;
    userId?: string;
  }) {
    const where: any = {};

    if (filters?.allapot) {
      where.allapot = filters.allapot;
    }

    if (filters?.prioritas) {
      where.prioritas = filters.prioritas;
    }

    if (filters?.kategoria) {
      where.kategoria = filters.kategoria;
    }

    if (filters?.userId) {
      where.userId = filters.userId;
    }

    const [total, items] = await Promise.all([
      this.prisma.bugReport.count({ where }),
      this.prisma.bugReport.findMany({
        where,
        skip,
        take,
        include: {
          user: {
            select: {
              id: true,
              nev: true,
              email: true,
            },
          },
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  nev: true,
                  email: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
          _count: {
            select: {
              comments: true,
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

  async findOne(id: string) {
    const bugReport = await this.prisma.bugReport.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                nev: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!bugReport) {
      throw new NotFoundException('Hibabejelentés nem található');
    }

    return bugReport;
  }

  async create(dto: CreateBugReportDto, userId?: string) {
    return this.prisma.bugReport.create({
      data: {
        ...dto,
        userId: userId || undefined,
        prioritas: dto.prioritas || 'MEDIUM',
        allapot: 'OPEN',
      },
      include: {
        user: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
      },
    });
  }

  async update(id: string, dto: UpdateBugReportDto) {
    const bugReport = await this.findOne(id);

    return this.prisma.bugReport.update({
      where: { id },
      data: dto,
      include: {
        user: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
      },
    });
  }

  async addComment(bugReportId: string, dto: CreateBugReportCommentDto, userId?: string) {
    const bugReport = await this.findOne(bugReportId);

    return this.prisma.bugReportComment.create({
      data: {
        bugReportId,
        szoveg: dto.szoveg,
        userId: userId || undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
      },
    });
  }

  async getStats() {
    const [total, open, inProgress, resolved, closed] = await Promise.all([
      this.prisma.bugReport.count(),
      this.prisma.bugReport.count({ where: { allapot: 'OPEN' } }),
      this.prisma.bugReport.count({ where: { allapot: 'IN_PROGRESS' } }),
      this.prisma.bugReport.count({ where: { allapot: 'RESOLVED' } }),
      this.prisma.bugReport.count({ where: { allapot: 'CLOSED' } }),
    ]);

    return {
      total,
      open,
      inProgress,
      resolved,
      closed,
    };
  }
}

