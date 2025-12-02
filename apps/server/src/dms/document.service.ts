import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SystemSettingsService } from '../system/settings.service';

export interface CreateDocumentDto {
  nev: string;
  tipus: string;
  irany?: string; // "bejovo" vagy "kimeno"
  categoryId?: string;
  accountId?: string;
  allapot: string;
  fajlNev: string;
  fajlMeret: number;
  mimeType: string;
  megjegyzesek?: string;
  fajlUtvonal?: string;
  ervenyessegKezdet?: string;
  ervenyessegVeg?: string;
  lejarat?: string;
}

export interface UpdateDocumentDto {
  nev?: string;
  tipus?: string;
  irany?: string; // "bejovo" vagy "kimeno"
  categoryId?: string;
  accountId?: string;
  allapot?: string;
  megjegyzesek?: string;
  ervenyessegKezdet?: string;
  ervenyessegVeg?: string;
  lejarat?: string;
}

export interface DocumentFilters {
  categoryId?: string;
  allapot?: string;
  accountId?: string;
  irany?: string; // "bejovo" vagy "kimeno"
  search?: string;
  tagId?: string; // Címszó alapú szűrés
}

@Injectable()
export class DocumentService {
  constructor(
    private prisma: PrismaService,
    private systemSettings: SystemSettingsService,
  ) {}

  async findAll(skip = 0, take = 50, filters?: DocumentFilters, userId?: string, isAdmin: boolean = false) {
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

    if (filters?.irany) {
      where.irany = filters.irany;
    }

    if (filters?.tagId) {
      where.tags = {
        some: {
          tagId: filters.tagId,
        },
      };
    }

    // Permission-based filtering: non-admin users only see documents they created or have access to
    if (!isAdmin && userId) {
      where.OR = [
        { createdById: userId },
        { access: { some: { userId } } },
      ];
    }

    if (filters?.search) {
      const searchConditions = [
        { nev: { contains: filters.search, mode: 'insensitive' } },
        { iktatoSzam: { contains: filters.search, mode: 'insensitive' } },
        { tartalom: { contains: filters.search, mode: 'insensitive' } },
        { 
          tags: {
            some: {
              tag: {
                nev: { contains: filters.search, mode: 'insensitive' }
              }
            }
          }
        },
        {
          category: {
            nev: { contains: filters.search, mode: 'insensitive' }
          }
        },
        {
          account: {
            nev: { contains: filters.search, mode: 'insensitive' }
          }
        },
      ];

      // If we already have an OR condition for permissions, we need to combine them
      if (where.OR) {
        where.AND = [
          { OR: where.OR },
          { OR: searchConditions },
        ];
        delete where.OR;
      } else {
        where.OR = searchConditions;
      }
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
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  nev: true,
                  szin: true,
                },
              },
            },
          },
          access: {
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
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const page = Math.floor(skip / take) + 1;
    const pageSize = take;

    return { data, total, page, pageSize };
  }

  async findOne(id: string, userId?: string, isAdmin: boolean = false) {
    const document = await this.prisma.document.findUnique({
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
          include: {
            createdBy: {
              select: {
                id: true,
                nev: true,
                email: true,
              },
            },
          },
        },
        workflowLogs: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
        ocrJob: true,
        tags: { include: { tag: true } },
        access: {
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

    if (!document) {
      return null;
    }

    // Check permissions: admin can see all, others only if they created it or have access
    if (!isAdmin && userId) {
      const hasAccess = 
        document.createdById === userId ||
        document.access.some(acc => acc.userId === userId);
      
      if (!hasAccess) {
        return null;
      }
    }

    return document;
  }

  async create(dto: CreateDocumentDto, userId?: string) {
    const iktatoSzam = await this.generateIktatoSzam();

    const document = await this.prisma.document.create({
      data: {
        nev: dto.nev,
        tipus: dto.tipus,
        irany: dto.irany || null,
        categoryId: dto.categoryId,
        accountId: dto.accountId,
        allapot: dto.allapot,
        fajlNev: dto.fajlNev,
        fajlMeret: dto.fajlMeret,
        fajlUtvonal: dto.fajlUtvonal || '',
        mimeType: dto.mimeType,
        megjegyzesek: dto.megjegyzesek,
        ervenyessegKezdet: dto.ervenyessegKezdet ? new Date(dto.ervenyessegKezdet) : null,
        ervenyessegVeg: dto.ervenyessegVeg ? new Date(dto.ervenyessegVeg) : null,
        lejarat: dto.lejarat ? new Date(dto.lejarat) : null,
        iktatoSzam,
      },
    });
  }

  async update(id: string, dto: UpdateDocumentDto) {
    const updateData: any = { ...dto };
    
    // Convert date strings to Date objects if provided
    if (dto.ervenyessegKezdet !== undefined) {
      updateData.ervenyessegKezdet = dto.ervenyessegKezdet ? new Date(dto.ervenyessegKezdet) : null;
    }
    if (dto.ervenyessegVeg !== undefined) {
      updateData.ervenyessegVeg = dto.ervenyessegVeg ? new Date(dto.ervenyessegVeg) : null;
    }
    if (dto.lejarat !== undefined) {
      updateData.lejarat = dto.lejarat ? new Date(dto.lejarat) : null;
    }
    
    // Handle irany: empty string should be null
    if (dto.irany !== undefined) {
      updateData.irany = dto.irany || null;
    }

    return this.prisma.document.update({
      where: { id },
      data: updateData,
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
