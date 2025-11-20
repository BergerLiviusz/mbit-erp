import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { ActivityService, TaskActivityType } from '../activity/activity.service';
import { AuditService } from '../../common/audit/audit.service';

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
    private activityService: ActivityService,
    private auditService: AuditService,
  ) {}

  async findAll(userId: string, isAdmin: boolean, filters: TaskFilterDto, skip = 0, take = 50) {
    const where: any = {};

    // Jogosultság ellenőrzés: Admin mindent lát, User csak saját + hozzárendelt + board tagként látható
    if (!isAdmin) {
      where.OR = [
        { assignedToId: userId },
        { createdById: userId },
        { board: { members: { some: { userId } } } },
      ];
    }

    // Szűrők alkalmazása
    if (filters.assignedToId) {
      where.assignedToId = filters.assignedToId;
    }

    if (filters.allapot) {
      where.allapot = filters.allapot;
    }

    if (filters.prioritas) {
      where.prioritas = filters.prioritas;
    }

    if (filters.boardId) {
      where.boardId = filters.boardId;
    }

    if (filters.accountId) {
      where.accountId = filters.accountId;
    }

    if (filters.opportunityId) {
      where.opportunityId = filters.opportunityId;
    }

    if (filters.leadId) {
      where.leadId = filters.leadId;
    }

    if (filters.quoteId) {
      where.quoteId = filters.quoteId;
    }

    if (filters.orderId) {
      where.orderId = filters.orderId;
    }

    if (filters.ticketId) {
      where.ticketId = filters.ticketId;
    }

    if (filters.documentId) {
      where.documentId = filters.documentId;
    }

    if (filters.search) {
      where.OR = [
        ...(where.OR || []),
        { cim: { contains: filters.search } },
        { leiras: { contains: filters.search } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.task.count({ where }),
      this.prisma.task.findMany({
        where,
        skip,
        take,
        include: {
          assignedTo: {
            select: {
              id: true,
              nev: true,
              email: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              nev: true,
              email: true,
            },
          },
          board: {
            select: {
              id: true,
              nev: true,
            },
          },
          account: {
            select: {
              id: true,
              nev: true,
              azonosito: true,
            },
          },
          opportunity: {
            select: {
              id: true,
              nev: true,
            },
          },
          lead: {
            select: {
              id: true,
              allapot: true,
            },
          },
          quote: {
            select: {
              id: true,
              azonosito: true,
            },
          },
          order: {
            select: {
              id: true,
              azonosito: true,
            },
          },
          ticket: {
            select: {
              id: true,
              azonosito: true,
            },
          },
          document: {
            select: {
              id: true,
              nev: true,
            },
          },
          _count: {
            select: {
              comments: true,
              attachments: true,
            },
          },
        },
        orderBy: [
          { position: 'asc' },
          { createdAt: 'desc' },
        ],
      }),
    ]);

    return { total, items };
  }

  async findOne(id: string, userId: string, isAdmin: boolean) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
        board: {
          include: {
            columns: {
              orderBy: { pozicio: 'asc' },
            },
            members: true,
          },
        },
        account: true,
        opportunity: true,
        lead: true,
        quote: true,
        order: true,
        ticket: true,
        document: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                nev: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        activities: {
          include: {
            user: {
              select: {
                id: true,
                nev: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        attachments: {
          include: {
            uploadedBy: {
              select: {
                id: true,
                nev: true,
              },
            },
          },
        },
        watchers: {
          include: {
            user: {
              select: {
                id: true,
                nev: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Feladat nem található');
    }

    // Jogosultság ellenőrzés
    if (!isAdmin) {
      const canView =
        task.assignedToId === userId ||
        task.createdById === userId ||
        (task.board && task.board.members?.some((m: any) => m.userId === userId));

      if (!canView) {
        throw new ForbiddenException('Nincs jogosultságod a feladat megtekintéséhez');
      }
    }

    return task;
  }

  async create(dto: CreateTaskDto, userId: string | null) {
    // Validate userId exists if provided
    let validUserId = userId;
    if (userId) {
      const userExists = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!userExists) {
        // If user doesn't exist, try to find admin user
        const adminUser = await this.prisma.user.findFirst({
          where: {
            email: 'admin@mbit.hu',
            aktiv: true,
          },
        });
        if (adminUser) {
          validUserId = adminUser.id;
        } else {
          validUserId = null;
        }
      }
    }

    const task = await this.prisma.task.create({
      data: {
        ...dto,
        createdById: validUserId || undefined,
        hataridoDatum: dto.hataridoDatum ? new Date(dto.hataridoDatum) : null,
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            nev: true,
            email: true,
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

    // Activity log (only if userId exists)
    if (validUserId) {
      await this.activityService.createActivity(
        task.id,
        validUserId,
        TaskActivityType.CREATED,
        `Feladat létrehozva: ${task.cim}`,
      );
    }

    // Audit log
    await this.auditService.logCreate('Task', task.id, task, validUserId);

    // Ha van assignedTo, akkor watcher hozzáadása
    if (task.assignedToId) {
      await this.prisma.taskWatcher.upsert({
        where: {
          taskId_userId: {
            taskId: task.id,
            userId: task.assignedToId,
          },
        },
        create: {
          taskId: task.id,
          userId: task.assignedToId,
        },
        update: {},
      });
    }

    return task;
  }

  async update(id: string, dto: UpdateTaskDto, userId: string, isAdmin: boolean) {
    const task = await this.findOne(id, userId, isAdmin);

    // Jogosultság ellenőrzés: csak admin vagy létrehozó vagy assignedTo szerkeszthet
    if (!isAdmin && task.createdById !== userId && task.assignedToId !== userId) {
      throw new ForbiddenException('Nincs jogosultságod a feladat szerkesztéséhez');
    }

    const oldData = { ...task };
    const updateData: any = { ...dto };

    if (dto.hataridoDatum) {
      updateData.hataridoDatum = new Date(dto.hataridoDatum);
    }

    // Ha státusz változott, completedAt beállítása
    if (dto.allapot && dto.allapot !== task.allapot) {
      if (dto.allapot === 'DONE' && !task.completedAt) {
        updateData.completedAt = new Date();
      } else if (dto.allapot !== 'DONE') {
        updateData.completedAt = null;
      }
    }

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        assignedTo: {
          select: {
            id: true,
            nev: true,
            email: true,
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

    // Activity log változásokról
    const changes: string[] = [];
    if (dto.allapot && dto.allapot !== oldData.allapot) {
      changes.push(`Státusz: ${oldData.allapot} → ${dto.allapot}`);
      await this.activityService.createActivity(
        id,
        userId,
        TaskActivityType.STATUS_CHANGED,
        `Státusz változott: ${oldData.allapot} → ${dto.allapot}`,
        { allapot: oldData.allapot },
        { allapot: dto.allapot },
      );
    }

    if (dto.assignedToId && dto.assignedToId !== oldData.assignedToId) {
      changes.push(`Felelős változott`);
      await this.activityService.createActivity(
        id,
        userId,
        TaskActivityType.ASSIGNED,
        `Feladat hozzárendelve`,
        { assignedToId: oldData.assignedToId },
        { assignedToId: dto.assignedToId },
      );

      // Watcher hozzáadása új assignedTo-hoz
      if (dto.assignedToId) {
        await this.prisma.taskWatcher.upsert({
          where: {
            taskId_userId: {
              taskId: id,
              userId: dto.assignedToId,
            },
          },
          create: {
            taskId: id,
            userId: dto.assignedToId,
          },
          update: {},
        });
      }
    }

    if (changes.length === 0) {
      await this.activityService.createActivity(
        id,
        userId,
        TaskActivityType.UPDATED,
        'Feladat frissítve',
        oldData,
        updatedTask,
      );
    }

    // Audit log
    await this.auditService.logUpdate('Task', id, oldData, updatedTask, userId);

    return updatedTask;
  }

  async delete(id: string, userId: string, isAdmin: boolean) {
    const task = await this.findOne(id, userId, isAdmin);

    // Jogosultság ellenőrzés: csak admin vagy létrehozó törölhet
    if (!isAdmin && task.createdById !== userId) {
      throw new ForbiddenException('Nincs jogosultságod a feladat törléséhez');
    }

    await this.prisma.task.delete({
      where: { id },
    });

    // Audit log
    await this.auditService.logDelete('Task', id, task, userId);

    return { success: true };
  }

  async move(id: string, dto: MoveTaskDto, userId: string, isAdmin: boolean) {
    const task = await this.findOne(id, userId, isAdmin);

    // Jogosultság ellenőrzés
    if (!isAdmin && task.createdById !== userId && task.assignedToId !== userId) {
      throw new ForbiddenException('Nincs jogosultságod a feladat mozgatásához');
    }

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: {
        boardId: dto.boardId,
        allapot: dto.allapot,
        position: dto.position,
      },
    });

    // Activity log
    await this.activityService.createActivity(
      id,
      userId,
      TaskActivityType.MOVED,
      `Feladat mozgatva: ${task.allapot} → ${dto.allapot}`,
      { boardId: task.boardId, allapot: task.allapot, position: task.position },
      { boardId: dto.boardId, allapot: dto.allapot, position: dto.position },
    );

    return updatedTask;
  }

  async getMyTasks(userId: string, skip = 0, take = 50) {
    return this.findAll(
      userId,
      false,
      { assignedToId: userId },
      skip,
      take,
    );
  }

  async getAssignedToTasks(userId: string, skip = 0, take = 50) {
    return this.findAll(
      userId,
      false,
      { assignedToId: userId },
      skip,
      take,
    );
  }

  async getDashboardStats(userId: string, isAdmin: boolean) {
    const where: any = {};

    if (!isAdmin) {
      where.OR = [
        { assignedToId: userId },
        { createdById: userId },
        { board: { members: { some: { userId } } } },
      ];
    }

    const [total, byStatus, byPriority, overdue] = await Promise.all([
      this.prisma.task.count({ where }),
      this.prisma.task.groupBy({
        by: ['allapot'],
        where,
        _count: true,
      }),
      this.prisma.task.groupBy({
        by: ['prioritas'],
        where,
        _count: true,
      }),
      this.prisma.task.count({
        where: {
          ...where,
          hataridoDatum: {
            lt: new Date(),
          },
          allapot: {
            not: 'DONE',
          },
        },
      }),
    ]);

    return {
      total,
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.allapot] = item._count;
        return acc;
      }, {} as Record<string, number>),
      byPriority: byPriority.reduce((acc, item) => {
        acc[item.prioritas] = item._count;
        return acc;
      }, {} as Record<string, number>),
      overdue,
    };
  }

  async getUpcomingDeadlines(userId: string, isAdmin: boolean, days: number = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);

    const where: any = {
      hataridoDatum: {
        not: null,
        lte: cutoffDate,
        gte: new Date(),
      },
      allapot: {
        notIn: ['DONE', 'CANCELLED'],
      },
    };

    // Jogosultság ellenőrzés: Admin mindent lát, User csak saját + hozzárendelt + board tagként látható
    if (!isAdmin) {
      where.OR = [
        { assignedToId: userId },
        { createdById: userId },
        { board: { members: { some: { userId } } } },
      ];
    }

    const tasks = await this.prisma.task.findMany({
      where,
      include: {
        assignedTo: {
          select: {
            id: true,
            nev: true,
            email: true,
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
      orderBy: {
        hataridoDatum: 'asc',
      },
    });

    return tasks.map(task => ({
      id: task.id,
      cim: task.cim,
      hataridoDatum: task.hataridoDatum?.toISOString(),
      daysUntilDeadline: task.hataridoDatum 
        ? Math.ceil((task.hataridoDatum.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : null,
      prioritas: task.prioritas,
      allapot: task.allapot,
      assignedTo: task.assignedTo,
      createdBy: task.createdBy,
    }));
  }
}

