import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ActivityService, TaskActivityType } from '../activity/activity.service';

@Injectable()
export class CommentService {
  constructor(
    private prisma: PrismaService,
    private activityService: ActivityService,
  ) {}

  async getTaskComments(taskId: string) {
    return this.prisma.taskComment.findMany({
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

  async create(taskId: string, dto: CreateCommentDto, userId: string) {
    // Ellenőrizzük, hogy a task létezik
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        board: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Feladat nem található');
    }

    // Jogosultság ellenőrzés: csak board tag vagy admin kommentelhet
    // Egyszerűsített ellenőrzés - a task service-ben részletesebb
    const canComment = task.board
      ? task.board.members.some((m) => m.userId === userId)
      : true;

    if (!canComment) {
      throw new ForbiddenException('Nincs jogosultságod kommenteléshez');
    }

    const comment = await this.prisma.taskComment.create({
      data: {
        taskId,
        userId,
        szoveg: dto.szoveg,
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

    // Activity log
    await this.activityService.createActivity(
      taskId,
      userId,
      TaskActivityType.COMMENTED,
      `Hozzászólás hozzáadva`,
    );

    return comment;
  }

  async update(id: string, dto: UpdateCommentDto, userId: string) {
    const comment = await this.prisma.taskComment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Komment nem található');
    }

    // Csak a saját kommentet szerkesztheti
    if (comment.userId !== userId) {
      throw new ForbiddenException('Nincs jogosultságod a komment szerkesztéséhez');
    }

    return this.prisma.taskComment.update({
      where: { id },
      data: dto,
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

  async delete(id: string, userId: string) {
    const comment = await this.prisma.taskComment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Komment nem található');
    }

    // Csak a saját kommentet törölheti
    if (comment.userId !== userId) {
      throw new ForbiddenException('Nincs jogosultságod a komment törléséhez');
    }

    await this.prisma.taskComment.delete({
      where: { id },
    });

    return { success: true };
  }
}

