import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateChatRoomDto {
  accountId: string;
  nev?: string;
  participantUserIds?: string[];
  externalParticipants?: string[];
}

export interface CreateChatMessageDto {
  szoveg: string;
  tipus?: string;
  fajlUtvonal?: string;
  felhaszCsak?: string;
}

export interface UpdateChatRoomDto {
  nev?: string;
  allapot?: string;
}

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async findAllRooms(skip = 0, take = 50, filters?: {
    accountId?: string;
    allapot?: string;
    userId?: string;
  }) {
    const where: any = {};

    if (filters?.accountId) {
      where.accountId = filters.accountId;
    }

    if (filters?.allapot) {
      where.allapot = filters.allapot;
    }

    if (filters?.userId) {
      where.participants = {
        some: {
          userId: filters.userId,
          elhagyott: null,
        },
      };
    }

    const [total, items] = await Promise.all([
      this.prisma.chatRoom.count({ where }),
      this.prisma.chatRoom.findMany({
        where,
        skip,
        take,
        include: {
          account: {
            select: {
              id: true,
              nev: true,
              azonosito: true,
            },
          },
          messages: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
            include: {
              user: {
                select: {
                  id: true,
                  nev: true,
                },
              },
            },
          },
          participants: {
            where: {
              elhagyott: null,
            },
            include: {
              user: {
                select: {
                  id: true,
                  nev: true,
                },
              },
            },
          },
          _count: {
            select: {
              messages: true,
              participants: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      }),
    ]);

    return { total, items };
  }

  async findRoom(id: string) {
    const room = await this.prisma.chatRoom.findUnique({
      where: { id },
      include: {
        account: true,
        messages: {
          include: {
            user: {
              select: {
                id: true,
                nev: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        participants: {
          where: {
            elhagyott: null,
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
        },
      },
    });

    if (!room) {
      throw new NotFoundException('Chat szoba nem található');
    }

    return room;
  }

  async createRoom(dto: CreateChatRoomDto, createdByUserId?: string) {
    // Validate account
    const account = await this.prisma.account.findUnique({
      where: { id: dto.accountId },
    });

    if (!account) {
      throw new NotFoundException('Ügyfél nem található');
    }

    // Create room
    const room = await this.prisma.chatRoom.create({
      data: {
        accountId: dto.accountId,
        nev: dto.nev || `Chat - ${account.nev}`,
        participants: {
          create: [
            // Add creator if provided
            ...(createdByUserId ? [{
              userId: createdByUserId,
              szerep: 'ADMIN',
            }] : []),
            // Add user participants
            ...(dto.participantUserIds || []).map(userId => ({
              userId,
              szerep: 'PARTICIPANT',
            })),
            // Add external participants
            ...(dto.externalParticipants || []).map(name => ({
              felhaszCsak: name,
              szerep: 'PARTICIPANT',
            })),
          ],
        },
      },
      include: {
        account: true,
        participants: true,
      },
    });

    return room;
  }

  async updateRoom(id: string, dto: UpdateChatRoomDto) {
    const room = await this.findRoom(id);

    return this.prisma.chatRoom.update({
      where: { id },
      data: {
        nev: dto.nev,
        allapot: dto.allapot,
      },
      include: {
        account: true,
        participants: true,
      },
    });
  }

  async addParticipant(roomId: string, userId?: string, externalName?: string) {
    const room = await this.findRoom(roomId);

    if (room.allapot === 'LEZART') {
      throw new BadRequestException('Lezárt chat szobához nem adható hozzá résztvevő');
    }

    // Check if already participant
    if (userId) {
      const existing = await this.prisma.chatParticipant.findUnique({
        where: {
          chatRoomId_userId: {
            chatRoomId: roomId,
            userId,
          },
        },
      });

      if (existing && !existing.elhagyott) {
        throw new BadRequestException('A felhasználó már résztvevő');
      }

      if (existing && existing.elhagyott) {
        // Rejoin
        return this.prisma.chatParticipant.update({
          where: { id: existing.id },
          data: {
            elhagyott: null,
          },
        });
      }
    }

    return this.prisma.chatParticipant.create({
      data: {
        chatRoomId: roomId,
        userId,
        felhaszCsak: externalName,
      },
    });
  }

  async removeParticipant(roomId: string, userId?: string, externalName?: string) {
    const room = await this.findRoom(roomId);

    if (userId) {
      const participant = await this.prisma.chatParticipant.findUnique({
        where: {
          chatRoomId_userId: {
            chatRoomId: roomId,
            userId,
          },
        },
      });

      if (!participant || participant.elhagyott) {
        throw new NotFoundException('Résztvevő nem található');
      }

      return this.prisma.chatParticipant.update({
        where: { id: participant.id },
        data: {
          elhagyott: new Date(),
        },
      });
    }

    // Handle external participant removal
    const participant = await this.prisma.chatParticipant.findFirst({
      where: {
        chatRoomId: roomId,
        felhaszCsak: externalName,
        elhagyott: null,
      },
    });

    if (!participant) {
      throw new NotFoundException('Résztvevő nem található');
    }

    return this.prisma.chatParticipant.update({
      where: { id: participant.id },
      data: {
        elhagyott: new Date(),
      },
    });
  }

  async sendMessage(roomId: string, dto: CreateChatMessageDto, userId?: string) {
    const room = await this.findRoom(roomId);

    if (room.allapot === 'LEZART') {
      throw new BadRequestException('Lezárt chat szobába nem küldhető üzenet');
    }

    // Verify user is participant
    if (userId) {
      const participant = await this.prisma.chatParticipant.findFirst({
        where: {
          chatRoomId: roomId,
          userId,
          elhagyott: null,
        },
      });

      if (!participant) {
        throw new BadRequestException('Nem vagy résztvevő ebben a chat szobában');
      }
    }

    const message = await this.prisma.chatMessage.create({
      data: {
        chatRoomId: roomId,
        userId,
        felhaszCsak: dto.felhaszCsak,
        szoveg: dto.szoveg,
        tipus: dto.tipus || 'TEXT',
        fajlUtvonal: dto.fajlUtvonal,
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

    // Update room's last message timestamp
    await this.prisma.chatRoom.update({
      where: { id: roomId },
      data: {
        updatedAt: new Date(),
      },
    });

    return message;
  }

  async markMessagesAsRead(roomId: string, userId: string) {
    const room = await this.findRoom(roomId);

    await this.prisma.chatMessage.updateMany({
      where: {
        chatRoomId: roomId,
        userId: {
          not: userId,
        },
        olvasva: false,
      },
      data: {
        olvasva: true,
        olvasvaDatum: new Date(),
      },
    });

    return { success: true };
  }

  async getUnreadCount(roomId: string, userId: string) {
    const count = await this.prisma.chatMessage.count({
      where: {
        chatRoomId: roomId,
        userId: {
          not: userId,
        },
        olvasva: false,
      },
    });

    return { count };
  }

  async closeRoom(id: string) {
    const room = await this.findRoom(id);

    return this.prisma.chatRoom.update({
      where: { id },
      data: {
        allapot: 'LEZART',
      },
    });
  }

  async deleteRoom(id: string) {
    const room = await this.findRoom(id);

    if (room.allapot !== 'LEZART') {
      throw new BadRequestException('Csak lezárt chat szoba törölhető');
    }

    return this.prisma.chatRoom.delete({
      where: { id },
    });
  }
}

