import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface DashboardKpiCard {
  code: string;
  name: string;
  category: string;
  value: number;
  unit?: string;
  status?: 'ok' | 'warning' | 'critical';
}

export interface DashboardChartSeries {
  name: string;
  data: Array<{ label: string; value: number }>;
}

@Injectable()
export class DashboardAggregationService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(filters?: {
    module?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const mod = filters?.module;
    const cards: DashboardKpiCard[] = [];

    if (!mod || mod === 'CRM') {
      cards.push(...(await this.crmKpis()));
    }
    if (!mod || mod === 'DMS') {
      cards.push(...(await this.dmsKpis()));
    }
    if (!mod || mod === 'HR') {
      cards.push(...(await this.hrKpis()));
    }
    if (!mod || mod === 'LOGISTICS') {
      cards.push(...(await this.logisticsKpis()));
    }
    if (!mod || mod === 'SYSTEM') {
      cards.push(...(await this.systemKpis()));
    }

    const charts = await this.buildCharts(mod);

    await this.saveSnapshots(cards);

    return {
      generatedAt: new Date().toISOString(),
      filters: filters || {},
      kpis: cards,
      charts,
    };
  }

  private async crmKpis(): Promise<DashboardKpiCard[]> {
    const closedStages = ['WON', 'LOST', 'CLOSED', 'lezart', 'vesztett', 'nyert'];
    const openOpps = await this.prisma.opportunity.findMany({
      where: { szakasz: { notIn: closedStages } },
    });
    const openValue = openOpps.reduce((s, o) => s + (o.ertek || 0), 0);
    const closed = await this.prisma.opportunity.count({
      where: { szakasz: { in: ['WON', 'CLOSED', 'nyert', 'lezart'] } },
    });
    const pipeline = await this.prisma.opportunity.aggregate({ _sum: { ertek: true } });
    const feedbackTotal = await this.prisma.campaignAccount.count();
    const positive = await this.prisma.campaignAccount.count({
      where: {
        visszajelzes: { in: ['POSITIVE', 'pozitiv', 'IGEN', 'erdeklodik', 'pozitív'] },
      },
    });
    const conversion = feedbackTotal > 0 ? Math.round((positive / feedbackTotal) * 100) : 0;

    return [
      { code: 'crm.open_opportunity_value', name: 'Nyitott opportunity érték', category: 'CRM', value: openValue, unit: 'HUF' },
      { code: 'crm.closed_opportunities', name: 'Lezárt opportunity', category: 'CRM', value: closed },
      { code: 'crm.pipeline_total', name: 'Pipeline összérték', category: 'CRM', value: pipeline._sum.ertek || 0, unit: 'HUF' },
      { code: 'crm.campaign_conversion', name: 'Kampány konverzió', category: 'CRM', value: conversion, unit: '%' },
    ];
  }

  private async dmsKpis(): Promise<DashboardKpiCard[]> {
    const openDocs = await this.prisma.document.count({
      where: { allapot: { notIn: ['ARCHIVED', 'SELEJT', 'CLOSED'] } },
    });
    const in30 = new Date();
    in30.setDate(in30.getDate() + 30);
    const expiring = await this.prisma.document.count({
      where: { lejarat: { lte: in30, gte: new Date() } },
    });
    const ocrErrors = await this.prisma.oCRJob.count({
      where: { allapot: { in: ['ERROR', 'FAILED', 'HIBA'] } },
    });

    return [
      { code: 'dms.open_documents', name: 'Nyitott dokumentumok', category: 'DMS', value: openDocs },
      { code: 'dms.expiring_documents', name: 'Lejáró dokumentumok (30 nap)', category: 'DMS', value: expiring, status: expiring > 0 ? 'warning' : 'ok' },
      { code: 'dms.ocr_errors', name: 'OCR hibák', category: 'DMS', value: ocrErrors, status: ocrErrors > 0 ? 'critical' : 'ok' },
    ];
  }

  private async hrKpis(): Promise<DashboardKpiCard[]> {
    const active = await this.prisma.employee.count({ where: { aktiv: true } });
    const in60 = new Date();
    in60.setDate(in60.getDate() + 60);
    const medical = await this.prisma.medicalExamination.count({
      where: {
        ervenyessegVege: { lte: in60, gte: new Date() },
      },
    });
    const contracts = await this.prisma.employmentContract.count({
      where: {
        aktiv: true,
        vegDatum: { lte: in60, gte: new Date() },
      },
    });

    return [
      { code: 'hr.active_employees', name: 'Aktív dolgozók', category: 'HR', value: active },
      { code: 'hr.medical_expiring', name: 'Lejáró orvosi vizsgálat', category: 'HR', value: medical, status: medical > 0 ? 'warning' : 'ok' },
      { code: 'hr.contract_expiring', name: 'Szerződés lejárat (60 nap)', category: 'HR', value: contracts, status: contracts > 0 ? 'warning' : 'ok' },
    ];
  }

  private async logisticsKpis(): Promise<DashboardKpiCard[]> {
    const levels = await this.prisma.stockLevel.findMany({
      include: { item: true },
    });
    let stockValue = 0;
    let belowMin = 0;
    for (const sl of levels) {
      stockValue += sl.mennyiseg * (sl.item?.beszerzesiAr || 0);
      const min = sl.minimum ?? sl.item?.minKeszlet;
      if (min != null && sl.mennyiseg < min) belowMin++;
    }
    const openPo = await this.prisma.purchaseOrder.count({
      where: { allapot: { in: ['draft', 'approved', 'ordered', 'partial', 'DRAFT', 'APPROVED', 'ORDERED', 'PARTIAL'] } },
    });
    const in30 = new Date();
    in30.setDate(in30.getDate() + 30);
    const expiringLots = await this.prisma.stockLot.count({
      where: { lejarat: { lte: in30, not: null } },
    });

    return [
      { code: 'logistics.stock_value', name: 'Készletérték', category: 'LOGISTICS', value: Math.round(stockValue), unit: 'HUF' },
      { code: 'logistics.below_min', name: 'Minimum alatti tétel', category: 'LOGISTICS', value: belowMin, status: belowMin > 0 ? 'warning' : 'ok' },
      { code: 'logistics.open_purchase_orders', name: 'Nyitott beszerzések', category: 'LOGISTICS', value: openPo },
      { code: 'logistics.expiring_batches', name: 'Lejáró sarzsok (30 nap)', category: 'LOGISTICS', value: expiringLots, status: expiringLots > 0 ? 'warning' : 'ok' },
    ];
  }

  private async systemKpis(): Promise<DashboardKpiCard[]> {
    const auditCount = await this.prisma.auditLog.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    });
    let backupStatus = 0;
    let lastBackup = '';
    try {
      const setting = await this.prisma.systemSetting.findUnique({
        where: { kulcs: 'backup.last_success' },
      });
      if (setting?.ertek) {
        backupStatus = 1;
        lastBackup = setting.ertek;
      }
    } catch {
      /* optional */
    }

    return [
      { code: 'system.backup_ok', name: 'Backup státusz', category: 'SYSTEM', value: backupStatus, unit: backupStatus ? 'OK' : 'Nincs adat' },
      { code: 'system.audit_events_7d', name: 'Audit események (7 nap)', category: 'SYSTEM', value: auditCount },
    ];
  }

  private async buildCharts(module?: string): Promise<DashboardChartSeries[]> {
    const charts: DashboardChartSeries[] = [];

    if (!module || module === 'CRM') {
      const byStage = await this.prisma.opportunity.groupBy({
        by: ['szakasz'],
        _count: { id: true },
        _sum: { ertek: true },
      });
      charts.push({
        name: 'Pipeline állapot',
        data: byStage.map((g) => ({
          label: g.szakasz,
          value: g._sum.ertek || g._count.id,
        })),
      });
    }

    if (!module || module === 'LOGISTICS') {
      const moves = await this.prisma.stockMove.findMany({
        take: 200,
        orderBy: { createdAt: 'desc' },
      });
      const byType: Record<string, number> = {};
      for (const m of moves) {
        byType[m.tipus] = (byType[m.tipus] || 0) + 1;
      }
      charts.push({
        name: 'Készletmozgások típus szerint',
        data: Object.entries(byType).map(([label, value]) => ({ label, value })),
      });
    }

    return charts;
  }

  private async saveSnapshots(cards: DashboardKpiCard[]) {
    const now = new Date();
    for (const c of cards) {
      try {
        await this.prisma.systemMetricSnapshot.create({
          data: {
            metricCode: c.code,
            metricValue: c.value,
            snapshotDate: now,
            sourceModule: c.category,
          },
        });
      } catch {
        /* table may not exist until migration */
      }
    }
  }
}
