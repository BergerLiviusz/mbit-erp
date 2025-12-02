import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreateWorkflowDto {
  nev: string;
  leiras?: string;
  aktiv?: boolean;
  steps: CreateWorkflowStepDto[];
}

export interface CreateWorkflowStepDto {
  nev: string;
  leiras?: string;
  sorrend: number;
  szerepkorId?: string;
  jogosultsag?: string; // READ, WRITE, APPROVE
  kotelezo?: boolean;
}

export interface UpdateWorkflowDto {
  nev?: string;
  leiras?: string;
  aktiv?: boolean;
}

export interface UpdateWorkflowStepDto {
  nev?: string;
  leiras?: string;
  sorrend?: number;
  szerepkorId?: string;
  jogosultsag?: string;
  kotelezo?: boolean;
}

@Injectable()
export class WorkflowService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId?: string, isAdmin: boolean = false) {
    const where: any = {};

    // Non-admin users only see workflows they participate in (via role)
    if (!isAdmin && userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      if (user) {
        const roleIds = user.roles.map(ur => ur.roleId);
        where.steps = {
          some: {
            szerepkorId: {
              in: roleIds,
            },
          },
        };
      }
    }

    return this.prisma.workflow.findMany({
      where,
      include: {
        steps: {
          orderBy: { sorrend: 'asc' },
          include: {
            szerepkor: {
              select: {
                id: true,
                nev: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId?: string, isAdmin: boolean = false) {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id },
      include: {
        steps: {
          orderBy: { sorrend: 'asc' },
          include: {
            szerepkor: {
              select: {
                id: true,
                nev: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
      },
    });

    if (!workflow) {
      throw new NotFoundException('Workflow nem található');
    }

    // Check permissions: admin can see all, others only if they participate
    if (!isAdmin && userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      if (user) {
        const roleIds = user.roles.map(ur => ur.roleId);
        const hasAccess = workflow.steps.some(step => 
          step.szerepkorId && roleIds.includes(step.szerepkorId)
        );

        if (!hasAccess) {
          throw new NotFoundException('Nincs hozzáférése ehhez a workflow-hoz');
        }
      }
    }

    return workflow;
  }

  async create(dto: CreateWorkflowDto, userId?: string) {
    if (!dto.steps || dto.steps.length < 5) {
      throw new BadRequestException('A workflow-nak legalább 5 lépésnek kell lennie');
    }

    // Validate step order
    const sortedSteps = [...dto.steps].sort((a, b) => a.sorrend - b.sorrend);
    for (let i = 0; i < sortedSteps.length; i++) {
      if (sortedSteps[i].sorrend !== i + 1) {
        throw new BadRequestException(`A lépések sorrendje nem helyes. Várható: ${i + 1}, kapott: ${sortedSteps[i].sorrend}`);
      }
    }

    return this.prisma.workflow.create({
      data: {
        nev: dto.nev,
        leiras: dto.leiras,
        aktiv: dto.aktiv ?? true,
        createdById: userId,
        steps: {
          create: dto.steps.map(step => ({
            nev: step.nev,
            leiras: step.leiras,
            sorrend: step.sorrend,
            szerepkorId: step.szerepkorId,
            jogosultsag: step.jogosultsag || 'READ',
            kotelezo: step.kotelezo ?? false,
          })),
        },
      },
      include: {
        steps: {
          orderBy: { sorrend: 'asc' },
          include: {
            szerepkor: {
              select: {
                id: true,
                nev: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
      },
    });
  }

  async update(id: string, dto: UpdateWorkflowDto) {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id },
    });

    if (!workflow) {
      throw new NotFoundException('Workflow nem található');
    }

    return this.prisma.workflow.update({
      where: { id },
      data: {
        nev: dto.nev,
        leiras: dto.leiras,
        aktiv: dto.aktiv,
      },
      include: {
        steps: {
          orderBy: { sorrend: 'asc' },
          include: {
            szerepkor: {
              select: {
                id: true,
                nev: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id },
    });

    if (!workflow) {
      throw new NotFoundException('Workflow nem található');
    }

    await this.prisma.workflow.delete({
      where: { id },
    });

    return { success: true };
  }

  async addStep(workflowId: string, dto: CreateWorkflowStepDto) {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id: workflowId },
      include: {
        steps: true,
      },
    });

    if (!workflow) {
      throw new NotFoundException('Workflow nem található');
    }

    // Check if step order already exists
    const existingStep = workflow.steps.find(s => s.sorrend === dto.sorrend);
    if (existingStep) {
      throw new BadRequestException(`Már létezik lépés a ${dto.sorrend}. pozícióban`);
    }

    return this.prisma.workflowStep.create({
      data: {
        workflowId,
        nev: dto.nev,
        leiras: dto.leiras,
        sorrend: dto.sorrend,
        szerepkorId: dto.szerepkorId,
        jogosultsag: dto.jogosultsag || 'READ',
        kotelezo: dto.kotelezo ?? false,
      },
      include: {
        szerepkor: {
          select: {
            id: true,
            nev: true,
          },
        },
      },
    });
  }

  async updateStep(workflowId: string, stepId: string, dto: UpdateWorkflowStepDto) {
    const step = await this.prisma.workflowStep.findUnique({
      where: { id: stepId },
    });

    if (!step || step.workflowId !== workflowId) {
      throw new NotFoundException('Workflow lépés nem található');
    }

    return this.prisma.workflowStep.update({
      where: { id: stepId },
      data: {
        nev: dto.nev,
        leiras: dto.leiras,
        sorrend: dto.sorrend,
        szerepkorId: dto.szerepkorId,
        jogosultsag: dto.jogosultsag,
        kotelezo: dto.kotelezo,
      },
      include: {
        szerepkor: {
          select: {
            id: true,
            nev: true,
          },
        },
      },
    });
  }

  async deleteStep(workflowId: string, stepId: string) {
    const step = await this.prisma.workflowStep.findUnique({
      where: { id: stepId },
    });

    if (!step || step.workflowId !== workflowId) {
      throw new NotFoundException('Workflow lépés nem található');
    }

    await this.prisma.workflowStep.delete({
      where: { id: stepId },
    });

    return { success: true };
  }
}

