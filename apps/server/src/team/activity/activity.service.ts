import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export enum TaskActivityType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  STATUS_CHANGED = 'STATUS_CHANGED',
  ASSIGNED = 'ASSIGNED',
  COMMENTED = 'COMMENTED',
  MOVED = 'MOVED',
  ATTACHMENT_ADDED = 'ATTACHMENT_ADDED',
}

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  async createActivity(
    taskId: string,
    userId: string | null,
    tipus: TaskActivityType,
    leiras?: string,
    regiErtek?: any,
    ujErtek?: any,
  ) {
    return this.prisma.taskActivity.create({
      data: {
        taskId,
        userId,
        tipus,
        leiras,
        regiErtek: regiErtek ? JSON.stringify(regiErtek) : null,
        ujErtek: ujErtek ? JSON.stringify(ujErtek) : null,
      },
      include: {
        user: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
      },
    });
  }

  async getTaskActivities(taskId: string) {
    return this.prisma.taskActivity.findMany({
      where: { taskId },
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
    });
  }
}

