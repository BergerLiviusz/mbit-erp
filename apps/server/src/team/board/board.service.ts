import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { AddMemberDto, BoardMemberPermission } from './dto/add-member.dto';
import { AuditService } from '../../common/audit/audit.service';

@Injectable()
export class BoardService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async findUserBoards(userId: string, isAdmin: boolean) {
    if (isAdmin) {
      return this.prisma.taskBoard.findMany({
        include: {
          createdBy: {
            select: {
              id: true,
              nev: true,
              email: true,
            },
          },
          _count: {
            select: {
              tasks: true,
              members: true,
            },
          },
        },
        orderBy: [
          { isDefault: 'desc' },
          { createdAt: 'desc' },
        ],
      });
    }

    return this.prisma.taskBoard.findMany({
      where: {
        OR: [
          { createdById: userId },
          { members: { some: { userId } } },
        ],
      },
      include: {
        createdBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
        _count: {
          select: {
            tasks: true,
            members: true,
          },
        },
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findOne(id: string, userId: string, isAdmin: boolean) {
    const board = await this.prisma.taskBoard.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
        columns: {
          orderBy: { pozicio: 'asc' },
        },
        members: {
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
        tasks: {
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
        },
      },
    });

    if (!board) {
      throw new NotFoundException('Board nem található');
    }

    // Jogosultság ellenőrzés
    if (!isAdmin) {
      const canView =
        board.createdById === userId ||
        board.members.some((m) => m.userId === userId);

      if (!canView) {
        throw new ForbiddenException('Nincs jogosultságod a board megtekintéséhez');
      }
    }

    return board;
  }

  async create(dto: CreateBoardDto, userId: string | null) {
    // Validate userId exists if provided
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
          userId = adminUser.id;
        } else {
          userId = null;
        }
      }
    }

    const board = await this.prisma.taskBoard.create({
      data: {
        ...dto,
        createdById: userId || undefined,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
      },
    });

    // Alapértelmezett oszlopok létrehozása
    const defaultColumns = [
      { nev: 'Teendők', allapot: 'TODO', pozicio: 0 },
      { nev: 'Folyamatban', allapot: 'IN_PROGRESS', pozicio: 1 },
      { nev: 'Kész', allapot: 'DONE', pozicio: 2 },
    ];

    await Promise.all(
      defaultColumns.map((col) =>
        this.prisma.taskColumn.create({
          data: {
            boardId: board.id,
            ...col,
          },
        }),
      ),
    );

    // Létrehozó automatikusan ADMIN tag (csak ha userId létezik)
    if (userId) {
      await this.prisma.taskBoardMember.create({
        data: {
          boardId: board.id,
          userId,
          jogosultsag: BoardMemberPermission.ADMIN,
        },
      });
    }

    // Audit log
    await this.auditService.logCreate('TaskBoard', board.id, board, userId);

    return this.findOne(board.id, userId, true);
  }

  async update(id: string, dto: UpdateBoardDto, userId: string, isAdmin: boolean) {
    const board = await this.findOne(id, userId, isAdmin);

    // Jogosultság ellenőrzés: csak admin vagy board admin szerkeszthet
    if (!isAdmin) {
      const member = board.members.find((m) => m.userId === userId);
      if (!member || member.jogosultsag !== BoardMemberPermission.ADMIN) {
        throw new ForbiddenException('Nincs jogosultságod a board szerkesztéséhez');
      }
    }

    const oldData = { ...board };
    const updatedBoard = await this.prisma.taskBoard.update({
      where: { id },
      data: dto,
    });

    // Audit log
    await this.auditService.logUpdate('TaskBoard', id, oldData, updatedBoard, userId);

    return this.findOne(id, userId, isAdmin);
  }

  async delete(id: string, userId: string, isAdmin: boolean) {
    const board = await this.findOne(id, userId, isAdmin);

    // Jogosultság ellenőrzés: csak admin vagy board létrehozó törölhet
    if (!isAdmin && board.createdById !== userId) {
      throw new ForbiddenException('Nincs jogosultságod a board törléséhez');
    }

    await this.prisma.taskBoard.delete({
      where: { id },
    });

    // Audit log
    await this.auditService.logDelete('TaskBoard', id, board, userId);

    return { success: true };
  }

  async addMember(id: string, dto: AddMemberDto, userId: string, isAdmin: boolean) {
    const board = await this.findOne(id, userId, isAdmin);

    // Jogosultság ellenőrzés: csak admin vagy board admin adhat hozzá tagot
    if (!isAdmin) {
      const member = board.members.find((m) => m.userId === userId);
      if (!member || member.jogosultsag !== BoardMemberPermission.ADMIN) {
        throw new ForbiddenException('Nincs jogosultságod tag hozzáadásához');
      }
    }

    const member = await this.prisma.taskBoardMember.upsert({
      where: {
        boardId_userId: {
          boardId: id,
          userId: dto.userId,
        },
      },
      create: {
        boardId: id,
        userId: dto.userId,
        jogosultsag: dto.jogosultsag,
      },
      update: {
        jogosultsag: dto.jogosultsag,
      },
    });

    return member;
  }

  async removeMember(id: string, memberUserId: string, userId: string, isAdmin: boolean) {
    const board = await this.findOne(id, userId, isAdmin);

    // Jogosultság ellenőrzés: csak admin vagy board admin távolíthat el tagot
    if (!isAdmin) {
      const member = board.members.find((m) => m.userId === userId);
      if (!member || member.jogosultsag !== BoardMemberPermission.ADMIN) {
        throw new ForbiddenException('Nincs jogosultságod tag eltávolításához');
      }
    }

    // Létrehozó nem távolítható el
    if (board.createdById === memberUserId) {
      throw new ForbiddenException('A board létrehozója nem távolítható el');
    }

    await this.prisma.taskBoardMember.delete({
      where: {
        boardId_userId: {
          boardId: id,
          userId: memberUserId,
        },
      },
    });

    return { success: true };
  }

  async getColumns(boardId: string, userId: string, isAdmin: boolean) {
    const board = await this.findOne(boardId, userId, isAdmin);
    return board.columns;
  }

  async createColumn(boardId: string, data: { nev: string; allapot: string; pozicio: number; limit?: number }, userId: string, isAdmin: boolean) {
    const board = await this.findOne(boardId, userId, isAdmin);

    // Jogosultság ellenőrzés
    if (!isAdmin) {
      const member = board.members.find((m) => m.userId === userId);
      if (!member || member.jogosultsag !== BoardMemberPermission.ADMIN) {
        throw new ForbiddenException('Nincs jogosultságod oszlop létrehozásához');
      }
    }

    const column = await this.prisma.taskColumn.create({
      data: {
        boardId,
        ...data,
      },
    });

    return column;
  }

  async updateColumn(boardId: string, columnId: string, data: { nev?: string; pozicio?: number; limit?: number }, userId: string, isAdmin: boolean) {
    await this.findOne(boardId, userId, isAdmin);

    // Jogosultság ellenőrzés
    if (!isAdmin) {
      const board = await this.findOne(boardId, userId, isAdmin);
      const member = board.members.find((m) => m.userId === userId);
      if (!member || member.jogosultsag !== BoardMemberPermission.ADMIN) {
        throw new ForbiddenException('Nincs jogosultságod oszlop szerkesztéséhez');
      }
    }

    const column = await this.prisma.taskColumn.update({
      where: { id: columnId },
      data,
    });

    return column;
  }

  async deleteColumn(boardId: string, columnId: string, userId: string, isAdmin: boolean) {
    await this.findOne(boardId, userId, isAdmin);

    // Jogosultság ellenőrzés
    if (!isAdmin) {
      const board = await this.findOne(boardId, userId, isAdmin);
      const member = board.members.find((m) => m.userId === userId);
      if (!member || member.jogosultsag !== BoardMemberPermission.ADMIN) {
        throw new ForbiddenException('Nincs jogosultságod oszlop törléséhez');
      }
    }

    await this.prisma.taskColumn.delete({
      where: { id: columnId },
    });

    return { success: true };
  }
}

