import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(skip = 0, take = 50) {
    try {
      const [total, items] = await Promise.all([
        this.prisma.account.count(),
        this.prisma.account.findMany({
          skip,
          take,
          include: {
            contacts: true,
            owner: { select: { id: true, nev: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      return { total, items };
    } catch (error) {
      this.logger.error('Error in findAll:', error);
      throw error;
    }
  }

  async findOne(id: string) {
    return this.prisma.account.findUnique({
      where: { id },
      include: {
        contacts: true,
        owner: true,
        customFields: true,
        documents: true,
      },
    });
  }

  async create(data: any) {
    if (!data.azonosito) {
      const accountCount = await this.prisma.account.count();
      data.azonosito = `U-${new Date().getFullYear()}-${String(accountCount + 1).padStart(5, '0')}`;
    }
    
    return this.prisma.account.create({
      data,
      include: { contacts: true },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.account.update({
      where: { id },
      data,
      include: { contacts: true },
    });
  }

  async delete(id: string) {
    return this.prisma.account.delete({
      where: { id },
    });
  }
}
