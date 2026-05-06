import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface NavPayrollReportDto {
  ev: number;
  honap: number;
  employeeIds?: string[];
}

export interface NavTaxReportDto {
  ev: number;
  quarter?: number; // 1-4
}

export interface KshReportDto {
  ev: number;
  honap?: number;
  reportType: 'EMPLOYMENT' | 'WAGE' | 'CONTRACT';
}

@Injectable()
export class HrReportService {
  /** Első sor a generált TXT riportokban: emlékeztető, hogy nem helyettesíti a hatósági formátumot. */
  private readonly statutoryExportNote =
    'MBIT_SPEC_MEGJEGYZES:Belső strukturált összesítő export. A tényleges NAV/KSH bevallási fájlforma és mezők egyeztetése a bérszámfejtővel / hatósági előírásokkal szükséges.';

  constructor(private prisma: PrismaService) {}

  async generateNavPayrollReport(dto: NavPayrollReportDto): Promise<string> {
    // NAV bérkifizetési jegyzék formátum generálása
    const where: any = {
      aktiv: true,
    };

    if (dto.employeeIds && dto.employeeIds.length > 0) {
      where.id = { in: dto.employeeIds };
    }

    const employees = await this.prisma.employee.findMany({
      where,
      include: {
        jobPosition: true,
        employmentContracts: {
          where: {
            kezdetDatum: {
              lte: new Date(dto.ev, dto.honap - 1, 31),
            },
            OR: [
              { vegDatum: null },
              { vegDatum: { gte: new Date(dto.ev, dto.honap - 1, 1) } },
            ],
          },
        },
      },
    });

    const lines: string[] = [];
    lines.push(this.statutoryExportNote);
    lines.push('NAV_BERKIFIZETESI_JEGYZEK');
    lines.push(`EV:${dto.ev}`);
    lines.push(`HONAP:${dto.honap}`);
    lines.push(``);

    lines.push('TETELEK:');
    for (const employee of employees) {
      const contract = employee.employmentContracts[0];
      if (!contract) continue;

      const line = [
        employee.azonosito,
        employee.vezetekNev,
        employee.keresztNev,
        employee.tajSzam || '',
        contract.szerzodesSzam,
        contract.fizetes?.toFixed(2) || '0.00',
        dto.ev.toString(),
        String(dto.honap).padStart(2, '0'),
      ].join('|');
      lines.push(line);
    }

    return lines.join('\n');
  }

  async generateNavTaxReport(dto: NavTaxReportDto): Promise<string> {
    // NAV SZJA bevallás formátum generálása
    const startDate = dto.quarter
      ? new Date(dto.ev, (dto.quarter - 1) * 3, 1)
      : new Date(dto.ev, 0, 1);
    const endDate = dto.quarter
      ? new Date(dto.ev, dto.quarter * 3, 0)
      : new Date(dto.ev, 11, 31);

    const employees = await this.prisma.employee.findMany({
      where: {
        aktiv: true,
        munkaviszonyKezdete: {
          lte: endDate,
        },
        OR: [
          { munkaviszonyVege: null },
          { munkaviszonyVege: { gte: startDate } },
        ],
      },
      include: {
        employmentContracts: {
          where: {
            kezdetDatum: {
              lte: endDate,
            },
            OR: [
              { vegDatum: null },
              { vegDatum: { gte: startDate } },
            ],
          },
        },
      },
    });

    const lines: string[] = [];
    lines.push(this.statutoryExportNote);
    lines.push('NAV_SZJA_BEVALLAS');
    lines.push(`EV:${dto.ev}`);
    if (dto.quarter) {
      lines.push(`NEGYEDEV:${dto.quarter}`);
    }
    lines.push(``);

    lines.push('TETELEK:');
    let totalTax = 0;
    for (const employee of employees) {
      const contract = employee.employmentContracts[0];
      if (!contract || !contract.fizetes) continue;

      // Egyszerűsített adószámítás (15% SZJA)
      const annualSalary = contract.fizetes * 12;
      const tax = annualSalary * 0.15;
      totalTax += tax;

      const line = [
        employee.azonosito,
        employee.vezetekNev,
        employee.keresztNev,
        employee.tajSzam || '',
        annualSalary.toFixed(2),
        tax.toFixed(2),
      ].join('|');
      lines.push(line);
    }

    lines.push(``);
    lines.push(`OSSZES_ADO:${totalTax.toFixed(2)}`);

    return lines.join('\n');
  }

  async generateKshEmploymentReport(dto: KshReportDto): Promise<string> {
    // KSH foglalkoztatotti statisztika
    const startDate = dto.honap
      ? new Date(dto.ev, dto.honap - 1, 1)
      : new Date(dto.ev, 0, 1);
    const endDate = dto.honap
      ? new Date(dto.ev, dto.honap, 0)
      : new Date(dto.ev, 11, 31);

    const employees = await this.prisma.employee.findMany({
      where: {
        aktiv: true,
        munkaviszonyKezdete: {
          lte: endDate,
        },
        OR: [
          { munkaviszonyVege: null },
          { munkaviszonyVege: { gte: startDate } },
        ],
      },
      include: {
        jobPosition: true,
      },
    });

    const lines: string[] = [];
    lines.push(this.statutoryExportNote);
    lines.push('KSH_FOGLALKOZATOTTI_STATISZTIKA');
    lines.push(`EV:${dto.ev}`);
    if (dto.honap) {
      lines.push(`HONAP:${dto.honap}`);
    }
    lines.push(``);

    // Statisztikák munkakör szerint
    const byJobPosition: { [key: string]: number } = {};
    const byDepartment: { [key: string]: number } = {};
    const byType: { [key: string]: number } = {};

    for (const employee of employees) {
      const jobPosition = employee.jobPosition?.nev || 'Nincs munkakör';
      byJobPosition[jobPosition] = (byJobPosition[jobPosition] || 0) + 1;

      const department = employee.reszleg || employee.osztaly || 'Nincs részleg';
      byDepartment[department] = (byDepartment[department] || 0) + 1;

      const type = employee.munkaviszonyTipusa || 'Nincs típus';
      byType[type] = (byType[type] || 0) + 1;
    }

    lines.push('MUNKAKOR_SZERINT:');
    for (const [jobPosition, count] of Object.entries(byJobPosition)) {
      lines.push(`${jobPosition}|${count}`);
    }

    lines.push(``);
    lines.push('RESZLEG_SZERINT:');
    for (const [department, count] of Object.entries(byDepartment)) {
      lines.push(`${department}|${count}`);
    }

    lines.push(``);
    lines.push('TIPUS_SZERINT:');
    for (const [type, count] of Object.entries(byType)) {
      lines.push(`${type}|${count}`);
    }

    lines.push(``);
    lines.push(`OSSZESEN:${employees.length}`);

    return lines.join('\n');
  }

  async generateKshWageReport(dto: KshReportDto): Promise<string> {
    // KSH bérstatisztika
    const startDate = dto.honap
      ? new Date(dto.ev, dto.honap - 1, 1)
      : new Date(dto.ev, 0, 1);
    const endDate = dto.honap
      ? new Date(dto.ev, dto.honap, 0)
      : new Date(dto.ev, 11, 31);

    const employees = await this.prisma.employee.findMany({
      where: {
        aktiv: true,
        munkaviszonyKezdete: {
          lte: endDate,
        },
        OR: [
          { munkaviszonyVege: null },
          { munkaviszonyVege: { gte: startDate } },
        ],
      },
      include: {
        employmentContracts: {
          where: {
            kezdetDatum: {
              lte: endDate,
            },
            OR: [
              { vegDatum: null },
              { vegDatum: { gte: startDate } },
            ],
          },
        },
        jobPosition: true,
      },
    });

    const lines: string[] = [];
    lines.push(this.statutoryExportNote);
    lines.push('KSH_BERSTATISZTIKA');
    lines.push(`EV:${dto.ev}`);
    if (dto.honap) {
      lines.push(`HONAP:${dto.honap}`);
    }
    lines.push(``);

    let totalWage = 0;
    let count = 0;

    lines.push('TETELEK:');
    for (const employee of employees) {
      const contract = employee.employmentContracts[0];
      if (!contract || !contract.fizetes) continue;

      totalWage += contract.fizetes;
      count++;

      const line = [
        employee.azonosito,
        employee.vezetekNev,
        employee.keresztNev,
        employee.jobPosition?.nev || '',
        contract.fizetes.toFixed(2),
      ].join('|');
      lines.push(line);
    }

    lines.push(``);
    lines.push(`OSSZES_BER:${totalWage.toFixed(2)}`);
    lines.push(`ATLAG_BER:${count > 0 ? (totalWage / count).toFixed(2) : '0.00'}`);
    lines.push(`DOLGOZO_SZAM:${count}`);

    return lines.join('\n');
  }

  async generateKshContractReport(dto: KshReportDto): Promise<string> {
    // KSH szerződés statisztika
    const startDate = dto.honap
      ? new Date(dto.ev, dto.honap - 1, 1)
      : new Date(dto.ev, 0, 1);
    const endDate = dto.honap
      ? new Date(dto.ev, dto.honap, 0)
      : new Date(dto.ev, 11, 31);

    const contracts = await this.prisma.employmentContract.findMany({
      where: {
        kezdetDatum: {
          lte: endDate,
        },
        OR: [
          { vegDatum: null },
          { vegDatum: { gte: startDate } },
        ],
      },
      include: {
        employee: true,
      },
    });

    const lines: string[] = [];
    lines.push(this.statutoryExportNote);
    lines.push('KSH_SZERZODES_STATISZTIKA');
    lines.push(`EV:${dto.ev}`);
    if (dto.honap) {
      lines.push(`HONAP:${dto.honap}`);
    }
    lines.push(``);

    const byType: { [key: string]: number } = {};
    let totalContracts = 0;

    for (const contract of contracts) {
      byType[contract.tipus] = (byType[contract.tipus] || 0) + 1;
      totalContracts++;
    }

    lines.push('TIPUS_SZERINT:');
    for (const [type, count] of Object.entries(byType)) {
      lines.push(`${type}|${count}`);
    }

    lines.push(``);
    lines.push(`OSSZES_SZERZODES:${totalContracts}`);

    return lines.join('\n');
  }

  /** Cafeteria választások CSV – bérszámfejtő interfészhez (partner egyeztetés szerint bővíthető) */
  async generateCafeteriaPayrollExport(ev: number): Promise<string> {
    const rows = await this.prisma.employeeCafeteriaSelection.findMany({
      where: { ev },
      include: {
        employee: { select: { azonosito: true, vezetekNev: true, keresztNev: true, tajSzam: true } },
        benefitItem: { select: { nev: true, kod: true, group: { select: { nev: true } } } },
      },
    });
    const header = ['azonosito', 'vezetek', 'kereszt', 'taj', 'juttatas_csoport', 'juttatas', 'partner_kod', 'ev', 'darab'].join(';');
    const lines = [header];
    for (const r of rows) {
      lines.push(
        [
          r.employee.azonosito,
          r.employee.vezetekNev,
          r.employee.keresztNev,
          r.employee.tajSzam || '',
          r.benefitItem.group?.nev || '',
          r.benefitItem.nev,
          r.benefitItem.kod || '',
          String(r.ev),
          String(r.darab),
        ].join(';'),
      );
    }
    return lines.join('\n');
  }

  /** Munkaidő összesítő CSV hónapra – bérszámfejtő export */
  async generateTimePayrollExport(ev: number, honap: number): Promise<string> {
    const start = new Date(ev, honap - 1, 1);
    const end = new Date(ev, honap, 0, 23, 59, 59);
    const entries = await this.prisma.timeEntry.findMany({
      where: { datum: { gte: start, lte: end } },
      include: {
        employee: { select: { azonosito: true, vezetekNev: true, keresztNev: true, tajSzam: true } },
      },
    });
    const sums = new Map<string, { employee: any; normal: number; tulora: number; egyeb: number }>();
    for (const e of entries) {
      const k = e.employeeId;
      if (!sums.has(k)) {
        sums.set(k, { employee: e.employee, normal: 0, tulora: 0, egyeb: 0 });
      }
      const s = sums.get(k)!;
      if (e.tipus === 'TULORA') s.tulora += e.ora;
      else if (e.tipus === 'KIEGESZITO') s.egyeb += e.ora;
      else s.normal += e.ora;
    }
    const header = ['azonosito', 'vezetek', 'kereszt', 'taj', 'ev', 'honap', 'normal_ora', 'tulora', 'egyeb_ora', 'osszes_ora'].join(';');
    const out = [header];
    for (const [, s] of sums) {
      const ossz = s.normal + s.tulora + s.egyeb;
      out.push(
        [
          s.employee.azonosito,
          s.employee.vezetekNev,
          s.employee.keresztNev,
          s.employee.tajSzam || '',
          String(ev),
          String(honap),
          s.normal.toFixed(2),
          s.tulora.toFixed(2),
          s.egyeb.toFixed(2),
          ossz.toFixed(2),
        ].join(';'),
      );
    }
    return out.join('\n');
  }

  /** Távollét riport (elemzés) – CSV */
  async generateLeaveAnalyticsExport(evFrom: number, evTo?: number): Promise<string> {
    const start = new Date(evFrom, 0, 1);
    const end = evTo ? new Date(evTo, 11, 31, 23, 59, 59) : new Date(evFrom, 11, 31, 23, 59, 59);
    const rows = await this.prisma.leaveRequest.findMany({
      where: {
        kezdet: { lte: end },
        veg: { gte: start },
      },
      include: {
        employee: { select: { azonosito: true, vezetekNev: true, keresztNev: true } },
        approvals: { orderBy: { sorrend: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
    const header = ['azonosito', 'nev', 'tipus', 'kezdet', 'veg', 'allapot', 'jovahagyasi_lepesek'].join(';');
    const lines = [header];
    for (const r of rows) {
      const nev = `${r.employee.vezetekNev} ${r.employee.keresztNev}`;
      const appr = r.approvals.map((a) => `${a.sorrend}:${a.allapot}`).join('|');
      lines.push(
        [r.employee.azonosito, nev, r.tipus, r.kezdet.toISOString(), r.veg.toISOString(), r.allapot, appr].join(';'),
      );
    }
    return lines.join('\n');
  }
}

