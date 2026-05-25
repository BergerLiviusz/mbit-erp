import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReportExportService, ExportData } from './report-export.service';

const DEFAULT_TEMPLATES = [
  { kod: 'crm.pipeline', nev: 'CRM pipeline', kategoria: 'CRM', exportFormats: 'csv,xlsx' },
  { kod: 'crm.campaigns', nev: 'Kampány összesítő', kategoria: 'CRM', exportFormats: 'csv,xlsx' },
  { kod: 'crm.tickets', nev: 'Reklamációk', kategoria: 'CRM', exportFormats: 'csv,xlsx' },
  { kod: 'dms.status', nev: 'Dokumentum állapot', kategoria: 'DMS', exportFormats: 'csv,xlsx' },
  { kod: 'dms.ocr', nev: 'OCR státusz', kategoria: 'DMS', exportFormats: 'csv,xlsx' },
  { kod: 'hr.employees', nev: 'Dolgozói lista', kategoria: 'HR', exportFormats: 'csv,xlsx' },
  { kod: 'hr.medical', nev: 'Orvosi lejárat', kategoria: 'HR', exportFormats: 'csv,xlsx' },
  { kod: 'logistics.stock', nev: 'Aktuális készlet', kategoria: 'LOGISTICS', exportFormats: 'csv,xlsx' },
  { kod: 'logistics.purchase', nev: 'Beszerzési rendelések', kategoria: 'LOGISTICS', exportFormats: 'csv,xlsx' },
  { kod: 'system.audit', nev: 'Audit napló', kategoria: 'SYSTEM', exportFormats: 'csv,xlsx' },
];

@Injectable()
export class ReportCatalogService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private exportService: ReportExportService,
  ) {}

  async onModuleInit() {
    try {
      await this.ensureDefaultTemplates();
    } catch {
      /* schema not ready */
    }
  }

  async ensureDefaultTemplates() {
    for (const t of DEFAULT_TEMPLATES) {
      await this.prisma.reportTemplate.upsert({
        where: { kod: t.kod },
        update: { nev: t.nev, kategoria: t.kategoria, exportFormats: t.exportFormats, aktiv: true },
        create: { ...t, leiras: `Előre definiált riport: ${t.nev}` },
      });
    }
  }

  async listTemplates(kategoria?: string) {
    return this.prisma.reportTemplate.findMany({
      where: {
        aktiv: true,
        ...(kategoria ? { kategoria } : {}),
      },
      orderBy: [{ kategoria: 'asc' }, { nev: 'asc' }],
    });
  }

  async runReport(
    kod: string,
    format: 'csv' | 'xlsx',
    userId?: string,
    params?: Record<string, string>,
  ): Promise<{ buffer: Buffer; contentType: string; filename: string }> {
    const template = await this.prisma.reportTemplate.findUnique({ where: { kod } });
    if (!template) throw new Error(`Ismeretlen riport: ${kod}`);

    const data = await this.buildReportData(kod, params);
    let buffer: Buffer;
    let contentType: string;
    if (format === 'csv') {
      const csv = await this.exportService.exportToCsv(data);
      buffer = Buffer.from('\uFEFF' + csv, 'utf-8');
      contentType = 'text/csv; charset=utf-8';
    } else {
      buffer = await this.exportService.exportToExcel(data);
      contentType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }

    const filename = `${kod}_${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : 'xlsx'}`;

    try {
      await this.prisma.reportExecution.create({
        data: {
          reportTemplateId: template.id,
          executedById: userId,
          parameterek: params ? JSON.stringify(params) : null,
          formatum: format,
        },
      });
    } catch {
      /* */
    }

    return { buffer, contentType, filename };
  }

  private async buildReportData(kod: string, _params?: Record<string, string>): Promise<ExportData> {
    switch (kod) {
      case 'crm.pipeline': {
        const rows = await this.prisma.opportunity.findMany({
          include: { account: { select: { nev: true } } },
          take: 5000,
        });
        return {
          title: 'CRM Pipeline',
          headers: ['Név', 'Ügyfél', 'Szakasz', 'Érték', 'Valószínűség'],
          rows: rows.map((o) => [
            o.nev,
            o.account?.nev || '',
            o.szakasz,
            o.ertek,
            o.valoszinuseg,
          ]),
        };
      }
      case 'crm.campaigns': {
        const rows = await this.prisma.campaign.findMany({ take: 1000 });
        return {
          title: 'Kampányok',
          headers: ['Név', 'Típus', 'Állapot', 'Kezdet'],
          rows: rows.map((c) => [c.nev, c.tipus, c.allapot, c.kezdetDatum.toISOString().split('T')[0]]),
        };
      }
      case 'crm.tickets': {
        const rows = await this.prisma.ticket.findMany({ take: 2000 });
        return {
          title: 'Reklamációk',
          headers: ['Azonosító', 'Tárgy', 'Típus', 'Állapot'],
          rows: rows.map((t) => [t.azonosito, t.targy, t.tipus, t.allapot]),
        };
      }
      case 'dms.status': {
        const rows = await this.prisma.document.findMany({ take: 3000 });
        return {
          title: 'Dokumentum állapot',
          headers: ['Név', 'Állapot', 'Lejárat', 'Iktatószám'],
          rows: rows.map((d) => [
            d.nev,
            d.allapot,
            d.lejarat ? d.lejarat.toISOString().split('T')[0] : '',
            d.iktatoSzam || '',
          ]),
        };
      }
      case 'dms.ocr': {
        const rows = await this.prisma.oCRJob.findMany({ include: { document: true }, take: 2000 });
        return {
          title: 'OCR állapot',
          headers: ['Dokumentum', 'Állapot', 'Pontosság'],
          rows: rows.map((j) => [j.document?.nev || '', j.allapot, j.pontossag ?? '']),
        };
      }
      case 'hr.employees': {
        const rows = await this.prisma.employee.findMany({
          where: { aktiv: true },
          include: { jobPosition: true },
        });
        return {
          title: 'Dolgozók',
          headers: ['Azonosító', 'Név', 'Munkakör', 'Állapot'],
          rows: rows.map((e) => [
            e.azonosito,
            `${e.vezetekNev} ${e.keresztNev}`,
            e.jobPosition?.nev || '',
            e.allapot,
          ]),
        };
      }
      case 'hr.medical': {
        const in60 = new Date();
        in60.setDate(in60.getDate() + 60);
        const rows = await this.prisma.medicalExamination.findMany({
          where: { ervenyessegVege: { lte: in60 } },
          include: { employee: true },
        });
        return {
          title: 'Orvosi lejárat',
          headers: ['Dolgozó', 'Lejárat', 'Eredmény'],
          rows: rows.map((m) => [
            m.employee ? `${m.employee.vezetekNev} ${m.employee.keresztNev}` : '',
            m.ervenyessegVege?.toISOString().split('T')[0] || '',
            m.eredmeny || '',
          ]),
        };
      }
      case 'logistics.stock': {
        const rows = await this.prisma.stockLevel.findMany({
          include: { item: true, warehouse: true },
        });
        return {
          title: 'Készlet',
          headers: ['Cikk', 'Raktár', 'Mennyiség'],
          rows: rows.map((s) => [s.item?.nev || '', s.warehouse?.nev || '', s.mennyiseg]),
        };
      }
      case 'logistics.purchase': {
        const rows = await this.prisma.purchaseOrder.findMany({
          include: { supplier: true },
        });
        return {
          title: 'Beszerzések',
          headers: ['Azonosító', 'Szállító', 'Állapot', 'Összeg'],
          rows: rows.map((p) => [p.azonosito, p.supplier?.nev || '', p.allapot, p.vegosszeg]),
        };
      }
      case 'system.audit': {
        const rows = await this.prisma.auditLog.findMany({
          take: 5000,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { nev: true, email: true } } },
        });
        return {
          title: 'Audit napló',
          headers: ['Idő', 'Esemény', 'Entitás', 'Felhasználó'],
          rows: rows.map((a) => [
            a.createdAt.toISOString(),
            a.esemeny,
            a.entitas,
            a.user?.nev || a.user?.email || '',
          ]),
        };
      }
      default:
        return { headers: ['Info'], rows: [['Nincs adat']] };
    }
  }

  async runAdHoc(
    config: {
      module: string;
      fields: string[];
      dateFrom?: string;
      dateTo?: string;
      status?: string;
    },
    format: 'csv' | 'xlsx',
  ) {
    const { headers, rows } = await this.buildAdHocRows(config);
    const data: ExportData = { title: `Ad-hoc ${config.module}`, headers, rows };
    if (format === 'csv') {
      const csv = await this.exportService.exportToCsv(data);
      return {
        buffer: Buffer.from('\uFEFF' + csv, 'utf-8'),
        contentType: 'text/csv; charset=utf-8',
        filename: `adhoc_${config.module}.csv`,
      };
    }
    return {
      buffer: await this.exportService.exportToExcel(data),
      contentType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      filename: `adhoc_${config.module}.xlsx`,
    };
  }

  private async buildAdHocRows(config: {
    module: string;
    fields: string[];
    dateFrom?: string;
    dateTo?: string;
    status?: string;
  }) {
    const kod = `${config.module.toLowerCase()}.pipeline`;
    const map: Record<string, string> = {
      CRM: 'crm.pipeline',
      DMS: 'dms.status',
      HR: 'hr.employees',
      LOGISTICS: 'logistics.stock',
      SYSTEM: 'system.audit',
    };
    const reportKod = map[config.module.toUpperCase()] || 'system.audit';
    const full = await this.buildReportData(reportKod);
    const fieldIdx = config.fields.map((f) => full.headers.indexOf(f)).filter((i) => i >= 0);
    const headers = fieldIdx.length ? config.fields : full.headers;
    const rows = full.rows.map((row) =>
      fieldIdx.length ? fieldIdx.map((i) => row[i]) : row,
    );
    return { headers, rows };
  }
}
