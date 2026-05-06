import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HrMailService } from './hr-mail.service';

@Injectable()
export class HrLeaveService {
  constructor(
    private prisma: PrismaService,
    private mail: HrMailService,
  ) {}

  async listForEmployee(employeeId: string) {
    return this.prisma.leaveRequest.findMany({
      where: { employeeId },
      include: {
        approvals: {
          orderBy: { sorrend: 'asc' },
          include: { approver: { select: { id: true, nev: true, email: true } } },
        },
        workflowInstance: { select: { id: true, allapot: true, nev: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async listAll(filters?: { allapot?: string; employeeId?: string }) {
    const where: any = {};
    if (filters?.allapot) where.allapot = filters.allapot;
    if (filters?.employeeId) where.employeeId = filters.employeeId;
    return this.prisma.leaveRequest.findMany({
      where,
      include: {
        employee: { select: { id: true, azonosito: true, vezetekNev: true, keresztNev: true } },
        approvals: { orderBy: { sorrend: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async listPendingForApprover(userId: string) {
    return this.prisma.leaveRequest.findMany({
      where: {
        allapot: 'FOLYAMATBAN',
        approvals: {
          some: { approverUserId: userId, allapot: 'VAR' },
        },
      },
      include: {
        employee: { select: { id: true, azonosito: true, vezetekNev: true, keresztNev: true } },
        approvals: { orderBy: { sorrend: 'asc' } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async summaryByStatus(ev?: number) {
    const requests = await this.prisma.leaveRequest.findMany({
      where: ev ? { kezdet: { gte: new Date(ev, 0, 1), lte: new Date(ev, 11, 31) } } : {},
    });
    const by: Record<string, number> = {};
    for (const r of requests) {
      by[r.allapot] = (by[r.allapot] || 0) + 1;
    }
    return Object.entries(by).map(([allapot, db]) => ({ allapot, db }));
  }

  async createRequest(dto: {
    employeeId: string;
    tipus: string;
    kezdet: string;
    veg: string;
    indoklas?: string;
    approverUserIds: string[];
    workflowId?: string;
  }, actingUserId?: string) {
    if (new Date(dto.kezdet) > new Date(dto.veg)) {
      throw new BadRequestException('Kezdő dátum nem lehet későbbi a végénél');
    }
    if (!dto.approverUserIds?.length) {
      throw new BadRequestException('Legalább egy jóváhagyó szükséges');
    }
    const employee = await this.prisma.employee.findUniqueOrThrow({ where: { id: dto.employeeId } });

    let workflowInstanceId: string | null = null;
    if (dto.workflowId && actingUserId) {
      const wf = await this.prisma.workflow.findFirst({
        where: { id: dto.workflowId, aktiv: true },
        include: { steps: { orderBy: { sorrend: 'asc' } } },
      });
      if (!wf?.steps.length) throw new BadRequestException('Workflow nem indítható');
      const inst = await this.prisma.workflowInstance.create({
        data: {
          workflowId: wf.id,
          nev: `Távollét – ${dto.tipus}`,
          allapot: 'aktív',
          aktualisLepesId: wf.steps[0].id,
          createdById: actingUserId,
          subjectEmployeeId: dto.employeeId,
        },
      });
      await Promise.all(
        wf.steps.map((step, index) =>
          this.prisma.workflowStepLog.create({
            data: {
              instanceId: inst.id,
              stepId: step.id,
              allapot: index === 0 ? 'folyamatban' : 'várakozik',
            },
          }),
        ),
      );
      workflowInstanceId = inst.id;
    }

    const req = await this.prisma.leaveRequest.create({
      data: {
        employeeId: dto.employeeId,
        tipus: dto.tipus,
        kezdet: new Date(dto.kezdet),
        veg: new Date(dto.veg),
        indoklas: dto.indoklas,
        allapot: 'FOLYAMATBAN',
        workflowInstanceId,
        approvals: {
          create: dto.approverUserIds.map((uid, i) => ({
            sorrend: i + 1,
            approverUserId: uid,
            allapot: 'VAR',
          })),
        },
      },
      include: { approvals: true },
    });

    const empEmail = employee.email;
    const firstApprover = dto.approverUserIds[0];
    await this.mail.notifyUserIds(
      [firstApprover],
      `Új távollét kérelem: ${employee.vezetekNev} ${employee.keresztNev}`,
      `Kérelem típus: ${dto.tipus}\nIdőtartam: ${dto.kezdet} – ${dto.veg}\nJóváhagyás szükséges a rendszerben.`,
    );

    if (empEmail) {
      await this.mail.sendMail(
        empEmail,
        'Távollét kérelem rögzítve',
        `Kérelmét rögzítettük (${dto.tipus}). Értesítjük a jóváhagyásról.`,
      );
    }

    return this.prisma.leaveRequest.findUnique({
      where: { id: req.id },
      include: { approvals: { include: { approver: { select: { nev: true, email: true } } } } },
    });
  }

  async decide(
    leaveId: string,
    userId: string,
    dto: { elfogadva: boolean; megjegyzes?: string },
  ) {
    const req = await this.prisma.leaveRequest.findUnique({
      where: { id: leaveId },
      include: { approvals: true, employee: true },
    });
    if (!req) throw new NotFoundException('Kérelem nem található');
    if (req.allapot !== 'FOLYAMATBAN') throw new BadRequestException('A kérelem már lezárult');

    const pendingRows = await this.prisma.leaveApproval.findMany({
      where: { leaveRequestId: leaveId, allapot: 'VAR' },
      orderBy: { sorrend: 'asc' },
    });
    const next = pendingRows[0];
    if (!next || next.approverUserId !== userId) {
      throw new ForbiddenException('Nincs jóváhagyási jog ebben a lépésben');
    }

    await this.prisma.leaveApproval.update({
      where: { id: next.id },
      data: {
        allapot: dto.elfogadva ? 'JOVAHAGYVA' : 'ELUTASITVA',
        dontesDatum: new Date(),
        megjegyzes: dto.megjegyzes,
      },
    });

    if (!dto.elfogadva) {
      await this.prisma.leaveRequest.update({
        where: { id: leaveId },
        data: { allapot: 'ELUTASITVA' },
      });
      if (req.employee.email) {
        await this.mail.sendMail(
          req.employee.email,
          'Távollét elutasítva',
          'Az Ön távollét kérelme elutasításra került.',
        );
      }
      return this.prisma.leaveRequest.findUnique({
        where: { id: leaveId },
        include: { approvals: true },
      });
    }

    const stillPending = await this.prisma.leaveApproval.findFirst({
      where: { leaveRequestId: leaveId, allapot: 'VAR' },
      orderBy: { sorrend: 'asc' },
    });

    if (!stillPending) {
      await this.prisma.leaveRequest.update({
        where: { id: leaveId },
        data: { allapot: 'JOVAHAGYVA' },
      });
      if (req.employee.email) {
        await this.mail.sendMail(
          req.employee.email,
          'Távollét jóváhagyva',
          `Távollét kérelmét jóváhagyták (${req.tipus}, ${req.kezdet.toISOString().slice(0, 10)} – ${req.veg.toISOString().slice(0, 10)}).`,
        );
      }
    } else if (stillPending.approverUserId) {
      await this.mail.notifyUserIds(
        [stillPending.approverUserId],
        'Távollét jóváhagyás (következő lépés)',
        `Új távollét kérelem vár jóváhagyásra: ${req.employee.vezetekNev} ${req.employee.keresztNev}`,
      );
    }

    return this.prisma.leaveRequest.findUnique({
      where: { id: leaveId },
      include: { approvals: { include: { approver: { select: { nev: true, email: true } } } } },
    });
  }
}
