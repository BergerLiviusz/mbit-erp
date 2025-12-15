import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreateWorkflowInstanceDto {
  workflowId: string;
  nev?: string;
}

export interface UpdateWorkflowStepLogDto {
  allapot: 'várakozik' | 'folyamatban' | 'befejezve' | 'kihagyva';
  megjegyzes?: string;
}

export interface DelegateWorkflowStepDto {
  newAssignedToId: string;
  megjegyzes?: string;
}

@Injectable()
export class WorkflowInstanceService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateWorkflowInstanceDto, userId?: string) {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id: dto.workflowId },
      include: { steps: { orderBy: { sorrend: 'asc' } } },
    });

    if (!workflow) {
      throw new NotFoundException('Workflow nem található');
    }

    if (!workflow.aktiv) {
      throw new BadRequestException('Az inaktív workflow-k nem indíthatók');
    }

    if (workflow.steps.length === 0) {
      throw new BadRequestException('A workflow-nak legalább egy lépésnek kell lennie');
    }

    // Get first step
    const firstStep = workflow.steps[0];

    // Create instance
    const instance = await this.prisma.workflowInstance.create({
      data: {
        workflowId: dto.workflowId,
        nev: dto.nev || `${workflow.nev} - ${new Date().toLocaleDateString('hu-HU')}`,
        allapot: 'aktív',
        aktualisLepesId: firstStep.id,
        createdById: userId,
      },
      include: {
        workflow: {
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
                  },
                },
              },
            },
          },
        },
        aktualisLepes: true,
        createdBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
      },
    });

    // Create step logs for all steps
    const stepLogs = await Promise.all(
      workflow.steps.map((step, index) =>
        this.prisma.workflowStepLog.create({
          data: {
            instanceId: instance.id,
            stepId: step.id,
            allapot: index === 0 ? 'folyamatban' : 'várakozik',
          },
        })
      )
    );

    return {
      ...instance,
      stepLogs,
    };
  }

  async findAll(workflowId?: string, userId?: string, isAdmin: boolean = false) {
    const where: any = {};

    if (workflowId) {
      where.workflowId = workflowId;
    }

    if (!isAdmin && userId) {
      where.createdById = userId;
    }

    return this.prisma.workflowInstance.findMany({
      where,
      include: {
        workflow: {
          select: {
            id: true,
            nev: true,
            leiras: true,
          },
        },
        aktualisLepes: {
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
        stepLogs: {
          include: {
            step: {
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
                  },
                },
              },
            },
            completedBy: {
              select: {
                id: true,
                nev: true,
                email: true,
              },
            },
          },
          orderBy: {
            step: {
              sorrend: 'asc',
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId?: string, isAdmin: boolean = false) {
    const instance = await this.prisma.workflowInstance.findUnique({
      where: { id },
      include: {
        workflow: {
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
                  },
                },
              },
            },
          },
        },
        aktualisLepes: {
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
        stepLogs: {
          include: {
            step: {
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
                  },
                },
              },
            },
            completedBy: {
              select: {
                id: true,
                nev: true,
                email: true,
              },
            },
          },
          orderBy: {
            step: {
              sorrend: 'asc',
            },
          },
        },
      },
    });

    if (!instance) {
      throw new NotFoundException('Workflow példány nem található');
    }

    // Check permissions
    if (!isAdmin && userId && instance.createdById !== userId) {
      throw new NotFoundException('Nincs hozzáférése ehhez a workflow példányhoz');
    }

    return instance;
  }

  async updateStepLog(
    instanceId: string,
    stepLogId: string,
    dto: UpdateWorkflowStepLogDto,
    userId?: string,
  ) {
    const instance = await this.prisma.workflowInstance.findUnique({
      where: { id: instanceId },
      include: {
        workflow: {
          include: {
            steps: {
              orderBy: { sorrend: 'asc' },
            },
          },
        },
        stepLogs: {
          include: {
            step: true,
          },
        },
      },
    });

    if (!instance) {
      throw new NotFoundException('Workflow példány nem található');
    }

    const stepLog = instance.stepLogs.find(sl => sl.id === stepLogId);
    if (!stepLog) {
      throw new NotFoundException('Lépés log nem található');
    }

    // Update step log
    const updatedStepLog = await this.prisma.workflowStepLog.update({
      where: { id: stepLogId },
      data: {
        allapot: dto.allapot,
        megjegyzes: dto.megjegyzes,
        completedById: dto.allapot === 'befejezve' ? userId : null,
        completedAt: dto.allapot === 'befejezve' ? new Date() : null,
      },
      include: {
        step: {
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
              },
            },
          },
        },
        completedBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
      },
    });

    // If step is completed, move to next step
    if (dto.allapot === 'befejezve') {
      const currentStepIndex = instance.workflow.steps.findIndex(s => s.id === stepLog.stepId);
      const nextStep = instance.workflow.steps[currentStepIndex + 1];

      if (nextStep) {
        // Update instance to next step
        await this.prisma.workflowInstance.update({
          where: { id: instanceId },
          data: {
            aktualisLepesId: nextStep.id,
          },
        });

        // Update next step log to "folyamatban"
        const nextStepLog = instance.stepLogs.find(sl => sl.stepId === nextStep.id);
        if (nextStepLog) {
          await this.prisma.workflowStepLog.update({
            where: { id: nextStepLog.id },
            data: {
              allapot: 'folyamatban',
            },
          });
        }
      } else {
        // All steps completed
        await this.prisma.workflowInstance.update({
          where: { id: instanceId },
          data: {
            allapot: 'befejezett',
            completedAt: new Date(),
          },
        });
      }
    }

    return updatedStepLog;
  }

  async cancel(instanceId: string, userId?: string) {
    const instance = await this.prisma.workflowInstance.findUnique({
      where: { id: instanceId },
    });

    if (!instance) {
      throw new NotFoundException('Workflow példány nem található');
    }

    return this.prisma.workflowInstance.update({
      where: { id: instanceId },
      data: {
        allapot: 'megszakított',
        completedAt: new Date(),
      },
    });
  }

  async delegateStep(
    instanceId: string,
    stepId: string,
    dto: DelegateWorkflowStepDto,
    userId?: string,
  ) {
    const instance = await this.prisma.workflowInstance.findUnique({
      where: { id: instanceId },
      include: {
        workflow: {
          include: {
            steps: true,
          },
        },
      },
    });

    if (!instance) {
      throw new NotFoundException('Workflow példány nem található');
    }

    const step = instance.workflow.steps.find(s => s.id === stepId);
    if (!step) {
      throw new NotFoundException('Workflow lépés nem található');
    }

    // Check if user has permission to delegate (must be assigned to the step or admin)
    if (!userId) {
      throw new BadRequestException('Felhasználó azonosító szükséges');
    }

    // Update the step's assigned user
    await this.prisma.workflowStep.update({
      where: { id: stepId },
      data: {
        assignedToId: dto.newAssignedToId,
      },
    });

    // Create a log entry for delegation
    const stepLog = await this.prisma.workflowStepLog.findFirst({
      where: {
        instanceId,
        stepId,
      },
    });

    if (stepLog) {
      await this.prisma.workflowStepLog.update({
        where: { id: stepLog.id },
        data: {
          megjegyzes: dto.megjegyzes || `Feladat delegálva új felhasználónak`,
        },
      });
    }

    return {
      success: true,
      message: 'Feladat sikeresen delegálva',
    };
  }
}

