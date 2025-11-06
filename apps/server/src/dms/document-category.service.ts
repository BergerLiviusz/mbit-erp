import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateDocumentCategoryDto {
  nev: string;
  leiras?: string;
  szulo?: string;
  aktiv?: boolean;
}

export interface UpdateDocumentCategoryDto {
  nev?: string;
  leiras?: string;
  szulo?: string;
  aktiv?: boolean;
}

@Injectable()
export class DocumentCategoryService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip = 0, take = 50) {
    const [total, data] = await Promise.all([
      this.prisma.documentCategory.count(),
      this.prisma.documentCategory.findMany({
        skip,
        take,
        orderBy: { nev: 'asc' },
      }),
    ]);

    const page = Math.floor(skip / take) + 1;
    const pageSize = take;

    return { data, total, page, pageSize };
  }

  async findOne(id: string) {
    return this.prisma.documentCategory.findUnique({
      where: { id },
      include: {
        documents: {
          select: {
            id: true,
            nev: true,
            iktatoSzam: true,
            allapot: true,
          },
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async create(dto: CreateDocumentCategoryDto) {
    return this.prisma.documentCategory.create({
      data: {
        nev: dto.nev,
        leiras: dto.leiras,
        szulo: dto.szulo,
        aktiv: dto.aktiv ?? true,
      },
    });
  }

  async update(id: string, dto: UpdateDocumentCategoryDto) {
    return this.prisma.documentCategory.update({
      where: { id },
      data: dto,
    });
  }
}
