import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HrRecruitmentService {
  constructor(private prisma: PrismaService) {}

  async listPostings(allapot?: string) {
    const where: any = {};
    if (allapot) where.allapot = allapot;
    return this.prisma.jobPosting.findMany({
      where,
      include: {
        jobPosition: { select: { id: true, nev: true, azonosito: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPosting(id: string) {
    const p = await this.prisma.jobPosting.findUnique({
      where: { id },
      include: {
        jobPosition: true,
        applications: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!p) throw new NotFoundException('Álláshirdetés nem található');
    return p;
  }

  async createPosting(dto: {
    cim: string;
    leiras?: string;
    jobPositionId?: string;
    allapot?: string;
  }) {
    return this.prisma.jobPosting.create({
      data: {
        cim: dto.cim,
        leiras: dto.leiras,
        jobPositionId: dto.jobPositionId,
        allapot: dto.allapot || 'PISZKOZAT',
      },
    });
  }

  async updatePosting(
    id: string,
    dto: Partial<{ cim: string; leiras: string; jobPositionId: string; allapot: string }>,
  ) {
    await this.getPosting(id);
    const data: any = { ...dto };
    if (dto.allapot === 'PUBLIKALT') {
      data.publikalva = new Date();
    }
    return this.prisma.jobPosting.update({ where: { id }, data });
  }

  async deletePosting(id: string) {
    await this.getPosting(id);
    return this.prisma.jobPosting.delete({ where: { id } });
  }

  async createApplication(dto: {
    postingId: string;
    jelentkezoNev: string;
    email: string;
    telefon?: string;
    cvFajlUtvonal?: string;
    cvFajlNev?: string;
    cvDocumentId?: string;
    megjegyzes?: string;
  }) {
    await this.getPosting(dto.postingId);
    return this.prisma.jobApplication.create({
      data: {
        postingId: dto.postingId,
        jelentkezoNev: dto.jelentkezoNev,
        email: dto.email,
        telefon: dto.telefon,
        cvFajlUtvonal: dto.cvFajlUtvonal,
        cvFajlNev: dto.cvFajlNev,
        cvDocumentId: dto.cvDocumentId,
        megjegyzes: dto.megjegyzes,
      },
    });
  }

  async updateApplication(id: string, dto: Partial<{ allapot: string; megjegyzes: string; hiredEmployeeId: string }>) {
    const a = await this.prisma.jobApplication.findUnique({ where: { id } });
    if (!a) throw new NotFoundException('Pályázat nem található');
    return this.prisma.jobApplication.update({ where: { id }, data: dto });
  }

  analyticsByStatus() {
    return this.prisma.jobApplication.groupBy({
      by: ['allapot'],
      _count: { allapot: true },
    });
  }
}
