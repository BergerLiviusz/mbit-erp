import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkflowInstanceService } from '../team/workflow/workflow-instance.service';
import { HrMailService } from './hr-mail.service';

@Injectable()
export class HrPerformanceService {
  constructor(
    private prisma: PrismaService,
    private workflowInstance: WorkflowInstanceService,
    private mail: HrMailService,
  ) {}

  async listGoals(employeeId: string) {
    return this.prisma.employeeGoal.findMany({
      where: { employeeId },
      include: {
        activities: { orderBy: { datum: 'desc' } },
        workflowInstance: { select: { id: true, allapot: true, nev: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async summaryByGoalStatus() {
    const rows = await this.prisma.employeeGoal.groupBy({
      by: ['allapot'],
      _count: { allapot: true },
    });
    return rows.map((r) => ({ allapot: r.allapot, db: r._count.allapot }));
  }

  async createGoal(
    dto: {
      employeeId: string;
      cim: string;
      leiras?: string;
      celErtek?: string;
      suly?: number;
      hatarido?: string;
      startWorkflowId?: string;
    },
    actingUserId?: string,
  ) {
    const emp = await this.prisma.employee.findUniqueOrThrow({ where: { id: dto.employeeId } });
    let workflowInstanceId: string | null = null;
    if (dto.startWorkflowId && actingUserId) {
      const res = await this.workflowInstance.create(
        {
          workflowId: dto.startWorkflowId,
          nev: `Teljesítmény cél: ${dto.cim}`,
          subjectEmployeeId: dto.employeeId,
        },
        actingUserId,
      );
      workflowInstanceId = res.id;
    }
    const goal = await this.prisma.employeeGoal.create({
      data: {
        employeeId: dto.employeeId,
        cim: dto.cim,
        leiras: dto.leiras,
        celErtek: dto.celErtek,
        suly: dto.suly,
        hatarido: dto.hatarido ? new Date(dto.hatarido) : undefined,
        workflowInstanceId,
      },
    });
    if (emp.email) {
      await this.mail.sendMail(emp.email, `Új teljesítmény cél: ${dto.cim}`, 'A vezetőség új célt rögzített Önnek az MBIT-ERP rendszerben.');
    }
    return goal;
  }

  async updateGoal(id: string, dto: Partial<{ leiras: string; celErtek: string; suly: number; allapot: string; hatarido: string }>) {
    await this.prisma.employeeGoal.findUniqueOrThrow({ where: { id } });
    const data: any = { ...dto };
    if (dto.hatarido) data.hatarido = new Date(dto.hatarido);
    return this.prisma.employeeGoal.update({ where: { id }, data });
  }

  async addActivity(goalId: string, megjegyzes: string) {
    await this.prisma.employeeGoal.findUniqueOrThrow({ where: { id: goalId } });
    return this.prisma.employeeGoalActivity.create({
      data: { goalId, megjegyzes },
    });
  }

  async deleteGoal(id: string) {
    await this.prisma.employeeGoal.findUniqueOrThrow({ where: { id } });
    return this.prisma.employeeGoal.delete({ where: { id } });
  }
}
