import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SystemSettingsService } from '../system/settings.service';

export interface CreateDocumentDto {
  nev: string;
  tipus: string;
  categoryId?: string;
  accountId?: string;
  allapot: string;
  fajlNev: string;
  fajlMeret: number;
  mimeType: string;
  megjegyzesek?: string;
  fajlUtvonal?: string;
}

export interface UpdateDocumentDto {
  nev?: string;
  tipus?: string;
  categoryId?: string;
  accountId?: string;
  allapot?: string;
  megjegyzesek?: string;
}

export interface DocumentFilters {
  categoryId?: string;
  allapot?: string;
  accountId?: string;
  search?: string;
}

@Injectable()
export class DocumentService {
  constructor(
    private prisma: PrismaService,
    private systemSettings: SystemSettingsService,
  ) {}

  async findAll(skip = 0, take = 50, filters?: DocumentFilters) {
    const where: any = {};

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.allapot) {
      where.allapot = filters.allapot;
    }

    if (filters?.accountId) {
      where.accountId = filters.accountId;
    }

    if (filters?.search) {
      where.OR = [
        { nev: { contains: filters.search } },
        { iktatoSzam: { contains: filters.search } },
      ];
    }

    const [total, data] = await Promise.all([
      this.prisma.document.count({ where }),
      this.prisma.document.findMany({
        where,
        skip,
        take,
        include: {
          category: {
            select: {
              id: true,
              nev: true,
            },
          },
          account: {
            select: {
              id: true,
              nev: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              nev: true,
              email: true,
            },
          },
          ocrJob: {
            select: {
              id: true,
              allapot: true,
              txtFajlUtvonal: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const page = Math.floor(skip / take) + 1;
    const pageSize = take;

    return { data, total, page, pageSize };
  }

  async findOne(id: string) {
    return this.prisma.document.findUnique({
      where: { id },
      include: {
        category: true,
        account: true,
        createdBy: {
          select: {
            id: true,
            nev: true,
            email: true,
          },
        },
        versions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        ocrJob: true,
        tags: { include: { tag: true } },
        access: { include: { user: true } },
      },
    });
  }

  async create(dto: CreateDocumentDto) {
    const iktatoSzam = await this.generateIktatoSzam();

    return this.prisma.document.create({
      data: {
        nev: dto.nev,
        tipus: dto.tipus,
        categoryId: dto.categoryId,
        accountId: dto.accountId,
        allapot: dto.allapot,
        fajlNev: dto.fajlNev,
        fajlMeret: dto.fajlMeret,
        fajlUtvonal: dto.fajlUtvonal || '',
        mimeType: dto.mimeType,
        megjegyzesek: dto.megjegyzesek,
        iktatoSzam,
      },
    });
  }

  async update(id: string, dto: UpdateDocumentDto) {
    return this.prisma.document.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    return this.prisma.document.delete({
      where: { id },
    });
  }

  async generateIktatoSzam(): Promise<string> {
    const pattern = await this.systemSettings.get('numbering.document.pattern');
    const defaultPattern = 'MBIT/{YYYY}/{####}';
    const template = pattern || defaultPattern;

    // Szervezet nevének lekérése a beállításokból
    const orgName = await this.systemSettings.get('organization.name');
    const orgPrefix = orgName ? orgName.replace(/[^A-Z0-9]/gi, '').toUpperCase() : 'MBIT';

    const now = new Date();
    const year = now.getFullYear();

    const countThisYear = await this.prisma.document.count({
      where: {
        createdAt: {
          gte: new Date(year, 0, 1),
          lt: new Date(year + 1, 0, 1),
        },
      },
    });

    const sequenceNumber = countThisYear + 1;

    let iktatoSzam = template
      .replace('{ORG}', orgPrefix)
      .replace('{YYYY}', year.toString())
      .replace('{YY}', year.toString().slice(-2))
      .replace('{####}', sequenceNumber.toString().padStart(4, '0'))
      .replace('{###}', sequenceNumber.toString().padStart(3, '0'))
      .replace('{##}', sequenceNumber.toString().padStart(2, '0'));

    // Ha még mindig tartalmazza a MBIT-et, cseréljük le
    iktatoSzam = iktatoSzam.replace(/MBIT/g, orgPrefix);

    return iktatoSzam;
  }
}
