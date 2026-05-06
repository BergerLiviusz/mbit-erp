import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HrTimeTrackingService {
  constructor(private prisma: PrismaService) {}

  async listEntries(employeeId: string, from?: string, to?: string) {
    const where: any = { employeeId };
    if (from || to) {
      where.datum = {};
      if (from) where.datum.gte = new Date(from);
      if (to) where.datum.lte = new Date(to);
    }
    return this.prisma.timeEntry.findMany({
      where,
      orderBy: { datum: 'asc' },
      include: { importBatch: true },
    });
  }

  async createEntry(dto: {
    employeeId: string;
    datum: string;
    ora: number;
    tipus?: string;
    megjegyzes?: string;
    forras?: string;
  }) {
    if (dto.ora <= 0 || dto.ora > 24) throw new BadRequestException('Óra 0 és 24 között legyen');
    await this.prisma.employee.findUniqueOrThrow({ where: { id: dto.employeeId } });
    return this.prisma.timeEntry.create({
      data: {
        employeeId: dto.employeeId,
        datum: new Date(dto.datum),
        ora: dto.ora,
        tipus: dto.tipus || 'NORMAL',
        megjegyzes: dto.megjegyzes,
        forras: dto.forras || 'KEZI',
      },
    });
  }

  async deleteEntry(id: string) {
    await this.prisma.timeEntry.findUniqueOrThrow({ where: { id } });
    return this.prisma.timeEntry.delete({ where: { id } });
  }

  /** Egyszerű beléptető CSV: sorok employee_azonosito;yyyy-mm-dd;ora.tizedes */
  async importAccessCsvBuffer(buf: Buffer, fajlNev: string) {
    const text = buf.toString('utf-8').replace(/^\uFEFF/, '');
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    const batch = await this.prisma.timeImportBatch.create({
      data: { fajlNev, sikeres: false },
    });
    let rekordok = 0;
    try {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith('#')) continue;
        const parts = line.split(/[;,\t]/).map((p) => p.trim());
        if (parts.length < 3) continue;
        const [azon, dStr, oStr] = parts;
        const emp = await this.prisma.employee.findFirst({ where: { azonosito: azon, aktiv: true } });
        if (!emp) continue;
        const ora = parseFloat(oStr.replace(',', '.'));
        if (Number.isNaN(ora)) continue;
        await this.prisma.timeEntry.create({
          data: {
            employeeId: emp.id,
            datum: new Date(dStr),
            ora,
            tipus: 'NORMAL',
            forras: 'BELTPTO_IMPORT',
            importBatchId: batch.id,
          },
        });
        rekordok++;
      }
      await this.prisma.timeImportBatch.update({
        where: { id: batch.id },
        data: { sikeres: true, rekordok },
      });
      return { batchId: batch.id, rekordok };
    } catch (e) {
      await this.prisma.timeImportBatch.update({
        where: { id: batch.id },
        data: { sikeres: false, hibaUzenet: String(e) },
      });
      throw e;
    }
  }

  async listImportBatches() {
    return this.prisma.timeImportBatch.findMany({ orderBy: { letrehozva: 'desc' }, take: 50 });
  }
}
