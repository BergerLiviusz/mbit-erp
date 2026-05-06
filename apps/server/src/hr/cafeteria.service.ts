import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CafeteriaService {
  constructor(private prisma: PrismaService) {}

  async listGroups(aktiv?: boolean) {
    const where: any = {};
    if (aktiv !== undefined) where.aktiv = aktiv;
    return this.prisma.cafeteriaBenefitGroup.findMany({
      where,
      include: { items: { where: aktiv === false ? undefined : { aktiv: true } } },
      orderBy: { nev: 'asc' },
    });
  }

  async createGroup(dto: { nev: string; leiras?: string; ev?: number; aktiv?: boolean }) {
    return this.prisma.cafeteriaBenefitGroup.create({ data: dto });
  }

  async updateGroup(id: string, dto: Partial<{ nev: string; leiras: string; ev: number; aktiv: boolean }>) {
    await this.ensureGroup(id);
    return this.prisma.cafeteriaBenefitGroup.update({ where: { id }, data: dto });
  }

  async deleteGroup(id: string) {
    await this.ensureGroup(id);
    return this.prisma.cafeteriaBenefitGroup.delete({ where: { id } });
  }

  async createItem(groupId: string, dto: { nev: string; kod?: string; maxDb?: number; aktiv?: boolean }) {
    await this.ensureGroup(groupId);
    return this.prisma.cafeteriaBenefitItem.create({
      data: { groupId, ...dto },
    });
  }

  async updateItem(id: string, dto: Partial<{ nev: string; kod: string; maxDb: number; aktiv: boolean }>) {
    await this.ensureItem(id);
    return this.prisma.cafeteriaBenefitItem.update({ where: { id }, data: dto });
  }

  async deleteItem(id: string) {
    await this.ensureItem(id);
    return this.prisma.cafeteriaBenefitItem.delete({ where: { id } });
  }

  async listSelections(employeeId: string, ev?: number) {
    const where: any = { employeeId };
    if (ev !== undefined) where.ev = ev;
    return this.prisma.employeeCafeteriaSelection.findMany({
      where,
      include: { benefitItem: { include: { group: true } } },
    });
  }

  async upsertSelection(dto: {
    employeeId: string;
    benefitItemId: string;
    ev: number;
    darab?: number;
    megjegyzes?: string;
  }) {
    const item = await this.prisma.cafeteriaBenefitItem.findFirst({
      where: { id: dto.benefitItemId, aktiv: true },
      include: { group: true },
    });
    if (!item) throw new NotFoundException('Cafeteria elem nem található');
    if (item.maxDb != null && (dto.darab ?? 1) > item.maxDb) {
      throw new BadRequestException(`Max választható: ${item.maxDb}`);
    }
    await this.prisma.employee.findUniqueOrThrow({ where: { id: dto.employeeId } });

    return this.prisma.employeeCafeteriaSelection.upsert({
      where: {
        employeeId_benefitItemId_ev: {
          employeeId: dto.employeeId,
          benefitItemId: dto.benefitItemId,
          ev: dto.ev,
        },
      },
      create: {
        employeeId: dto.employeeId,
        benefitItemId: dto.benefitItemId,
        ev: dto.ev,
        darab: dto.darab ?? 1,
        megjegyzes: dto.megjegyzes,
      },
      update: {
        darab: dto.darab ?? 1,
        megjegyzes: dto.megjegyzes,
      },
      include: { benefitItem: { include: { group: true } } },
    });
  }

  private async ensureGroup(id: string) {
    const g = await this.prisma.cafeteriaBenefitGroup.findUnique({ where: { id } });
    if (!g) throw new NotFoundException('Cafeteria csoport nem található');
    return g;
  }

  private async ensureItem(id: string) {
    const i = await this.prisma.cafeteriaBenefitItem.findUnique({ where: { id } });
    if (!i) throw new NotFoundException('Cafeteria elem nem található');
    return i;
  }
}
