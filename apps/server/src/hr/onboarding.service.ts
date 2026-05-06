import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkflowInstanceService } from '../team/workflow/workflow-instance.service';
import { HrMailService } from './hr-mail.service';

@Injectable()
export class HrOnboardingService {
  constructor(
    private prisma: PrismaService,
    private workflowInstance: WorkflowInstanceService,
    private mail: HrMailService,
  ) {}

  async listTemplates(aktiv?: boolean) {
    const where: any = {};
    if (aktiv !== undefined) where.aktiv = aktiv;
    return this.prisma.onboardingTemplate.findMany({ where, orderBy: { nev: 'asc' } });
  }

  async createTemplate(dto: { nev: string; leiras?: string; dokLista?: string; aktiv?: boolean }) {
    return this.prisma.onboardingTemplate.create({ data: dto });
  }

  async updateTemplate(id: string, dto: Partial<{ nev: string; leiras: string; dokLista: string; aktiv: boolean }>) {
    await this.prisma.onboardingTemplate.findUniqueOrThrow({ where: { id } });
    return this.prisma.onboardingTemplate.update({ where: { id }, data: dto });
  }

  async deleteTemplate(id: string) {
    await this.prisma.onboardingTemplate.findUniqueOrThrow({ where: { id } });
    return this.prisma.onboardingTemplate.delete({ where: { id } });
  }

  async startInstance(
    dto: {
      employeeId: string;
      templateId: string;
      workflowId?: string;
      megjegyzes?: string;
    },
    actingUserId?: string,
  ) {
    const tpl = await this.prisma.onboardingTemplate.findUniqueOrThrow({ where: { id: dto.templateId } });
    const emp = await this.prisma.employee.findUniqueOrThrow({
      where: { id: dto.employeeId },
      include: { jobPosition: { include: { jobDescriptionDocument: true } } },
    });

    let workflowInstanceId: string | null = null;
    if (dto.workflowId && actingUserId) {
      const res = await this.workflowInstance.create(
        {
          workflowId: dto.workflowId,
          nev: `Beléptetés – ${emp.vezetekNev} ${emp.keresztNev}`,
          subjectEmployeeId: dto.employeeId,
        },
        actingUserId,
      );
      workflowInstanceId = res.id;
    }

    const inst = await this.prisma.onboardingInstance.create({
      data: {
        employeeId: dto.employeeId,
        templateId: dto.templateId,
        workflowInstanceId,
        megjegyzes: dto.megjegyzes,
        allapot: 'FOLYAMATBAN',
      },
      include: { template: true },
    });

    const lines: string[] = [`Beléptetési csomag: ${tpl.nev}`];
    if (tpl.dokLista) lines.push(tpl.dokLista);
    if (emp.jobPosition?.jobDescriptionDocument) {
      lines.push(`Munkaköri leírás dokumentum: ${emp.jobPosition.jobDescriptionDocument.nev} (DMS)`);
    }
    if (emp.email) {
      await this.mail.sendMail(
        emp.email,
        'Üdvözöljük – beléptetési információk',
        lines.join('\n\n'),
      );
    }

    return inst;
  }

  async listInstances(filters?: { employeeId?: string; allapot?: string }) {
    const where: any = {};
    if (filters?.employeeId) where.employeeId = filters.employeeId;
    if (filters?.allapot) where.allapot = filters.allapot;
    return this.prisma.onboardingInstance.findMany({
      where,
      include: {
        employee: { select: { id: true, azonosito: true, vezetekNev: true, keresztNev: true } },
        template: true,
        workflowInstance: { select: { id: true, allapot: true, nev: true } },
      },
      orderBy: { megkezdve: 'desc' },
    });
  }

  async completeInstance(id: string) {
    const o = await this.prisma.onboardingInstance.findUnique({ where: { id } });
    if (!o) throw new NotFoundException('Beléptetés nem található');
    return this.prisma.onboardingInstance.update({
      where: { id },
      data: { allapot: 'BEFEJEZVE', befejezve: new Date() },
    });
  }

  analytics() {
    return this.prisma.onboardingInstance.groupBy({
      by: ['allapot'],
      _count: { allapot: true },
    });
  }
}
