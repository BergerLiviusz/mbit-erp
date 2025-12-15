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
  lepesTipus?: string; // Szabadon beírható lépés típusa
  szin?: string; // Szín hex kódban
  kotelezo?: boolean;
  assignedToId?: string; // Hozzárendelt felhasználó
  roleId?: string; // Szerepkör
}

export interface UpdateWorkflowDto {
  nev?: string;
  leiras?: string;
  aktiv?: boolean;
  steps?: Array<{
    id?: string; // Ha van id, akkor frissítés, ha nincs, akkor új lépés
    nev?: string;
    leiras?: string;
    sorrend?: number;
    lepesTipus?: string;
    szin?: string;
    kotelezo?: boolean;
    assignedToId?: string;
    roleId?: string;
  }>;
}

export interface UpdateWorkflowStepDto {
  nev?: string;
  leiras?: string;
  sorrend?: number;
  lepesTipus?: string;
  szin?: string;
  kotelezo?: boolean;
  assignedToId?: string; // Hozzárendelt felhasználó
  roleId?: string; // Szerepkör
}

@Injectable()
export class WorkflowService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId?: string, isAdmin: boolean = false) {
    const where: any = {};

    // Non-admin users only see workflows they created
    if (!isAdmin && userId) {
      where.createdById = userId;
    }

    return this.prisma.workflow.findMany({
      where,
      include: {
        steps: {
          orderBy: { sorrend: 'asc' },
          include: {
            assignedTo: {
              select: {
                id: true,
                nev: true,
                email: true,
              },
            },
            Role: {
              select: {
                id: true,
                nev: true,
                leiras: true,
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
            assignedTo: {
              select: {
                id: true,
                nev: true,
                email: true,
              },
            },
            Role: {
              select: {
                id: true,
                nev: true,
                leiras: true,
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

    // Check permissions: admin can see all, others only if they created it
    if (!isAdmin && userId && workflow.createdById !== userId) {
      throw new NotFoundException('Nincs hozzáférése ehhez a workflow-hoz');
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
            lepesTipus: step.lepesTipus,
            szin: step.szin || '#3B82F6',
            kotelezo: step.kotelezo ?? false,
            assignedToId: step.assignedToId,
            roleId: step.roleId,
          })),
        },
      },
      include: {
        steps: {
          orderBy: { sorrend: 'asc' },
          include: {
            assignedTo: {
              select: {
                id: true,
                nev: true,
                email: true,
              },
            },
            Role: {
              select: {
                id: true,
                nev: true,
                leiras: true,
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

  async update(id: string, dto: UpdateWorkflowDto, userId?: string, isAdmin: boolean = false) {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id },
      include: { steps: true },
    });

    if (!workflow) {
      throw new NotFoundException('Workflow nem található');
    }

    // Check permissions: admin can edit all, others only if they created it
    if (!isAdmin && userId && workflow.createdById !== userId) {
      throw new NotFoundException('Nincs jogosultsága ehhez a workflow-hoz');
    }

    // If steps are provided, update them
    if (dto.steps && dto.steps.length > 0) {
      // Validate minimum 5 steps
      if (dto.steps.length < 5) {
        throw new BadRequestException('A workflow-nak legalább 5 lépésnek kell lennie');
      }

      // Get existing step IDs
      const existingStepIds = workflow.steps.map(s => s.id);
      const updatedStepIds = dto.steps.filter(s => s.id).map(s => s.id!);
      const stepsToDelete = existingStepIds.filter(id => !updatedStepIds.includes(id));

      // Delete removed steps
      if (stepsToDelete.length > 0) {
        await this.prisma.workflowStep.deleteMany({
          where: {
            id: { in: stepsToDelete },
            workflowId: id,
          },
        });
      }

      // Update or create steps
      for (const stepDto of dto.steps) {
        if (stepDto.id && existingStepIds.includes(stepDto.id)) {
          // Update existing step
          await this.prisma.workflowStep.update({
            where: { id: stepDto.id },
            data: {
              nev: stepDto.nev,
              leiras: stepDto.leiras,
              sorrend: stepDto.sorrend,
              lepesTipus: stepDto.lepesTipus,
              szin: stepDto.szin,
              kotelezo: stepDto.kotelezo,
              assignedToId: stepDto.assignedToId,
              roleId: stepDto.roleId,
            },
          });
        } else {
          // Create new step
          await this.prisma.workflowStep.create({
            data: {
              workflowId: id,
              nev: stepDto.nev!,
              leiras: stepDto.leiras,
              sorrend: stepDto.sorrend!,
              lepesTipus: stepDto.lepesTipus,
              szin: stepDto.szin || '#3B82F6',
              kotelezo: stepDto.kotelezo ?? false,
              assignedToId: stepDto.assignedToId,
              roleId: stepDto.roleId,
            },
          });
        }
      }
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
            assignedTo: {
              select: {
                id: true,
                nev: true,
                email: true,
              },
            },
            Role: {
              select: {
                id: true,
                nev: true,
                leiras: true,
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
        lepesTipus: dto.lepesTipus,
        szin: dto.szin || '#3B82F6',
        kotelezo: dto.kotelezo ?? false,
        assignedToId: dto.assignedToId,
        roleId: dto.roleId,
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
        Role: {
          select: {
            id: true,
            nev: true,
            leiras: true,
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
        lepesTipus: dto.lepesTipus,
        szin: dto.szin,
        kotelezo: dto.kotelezo,
        assignedToId: dto.assignedToId,
        roleId: dto.roleId,
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
        Role: {
          select: {
            id: true,
            nev: true,
            leiras: true,
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

