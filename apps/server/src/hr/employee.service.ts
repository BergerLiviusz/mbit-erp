import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateEmployeeDto {
  azonosito: string;
  vezetekNev: string;
  keresztNev: string;
  szuletesiDatum?: string;
  szuletesiHely?: string;
  tajSzam?: string;
  szemelyiIgazolvanySzam?: string;
  lakcim?: string;
  tartozkodasiCim?: string;
  telefon?: string;
  email?: string;
  munkaviszonyKezdete?: string;
  munkaviszonyVege?: string;
  munkaviszonyTipusa?: string;
  jobPositionId?: string;
  osztaly?: string;
  reszleg?: string;
}

export interface UpdateEmployeeDto {
  vezetekNev?: string;
  keresztNev?: string;
  szuletesiDatum?: string;
  szuletesiHely?: string;
  tajSzam?: string;
  szemelyiIgazolvanySzam?: string;
  lakcim?: string;
  tartozkodasiCim?: string;
  telefon?: string;
  email?: string;
  munkaviszonyKezdete?: string;
  munkaviszonyVege?: string;
  munkaviszonyTipusa?: string;
  jobPositionId?: string;
  osztaly?: string;
  reszleg?: string;
  aktiv?: boolean;
}

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip = 0, take = 50, filters?: {
    jobPositionId?: string;
    osztaly?: string;
    reszleg?: string;
    aktiv?: boolean;
    search?: string;
  }) {
    const where: any = {};

    if (filters?.jobPositionId) {
      where.jobPositionId = filters.jobPositionId;
    }

    if (filters?.osztaly) {
      where.osztaly = filters.osztaly;
    }

    if (filters?.reszleg) {
      where.reszleg = filters.reszleg;
    }

    if (filters?.aktiv !== undefined) {
      where.aktiv = filters.aktiv;
    }

    if (filters?.search) {
      where.OR = [
        { vezetekNev: { contains: filters.search } },
        { keresztNev: { contains: filters.search } },
        { azonosito: { contains: filters.search } },
        { email: { contains: filters.search } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.employee.count({ where }),
      this.prisma.employee.findMany({
        where,
        skip,
        take,
        include: {
          jobPosition: {
            select: {
              id: true,
              nev: true,
              azonosito: true,
            },
          },
          _count: {
            select: {
              educations: true,
              languageSkills: true,
              medicalExaminations: true,
              disciplinaryActions: true,
              studyContracts: true,
              employmentContracts: true,
            },
          },
        },
        orderBy: [
          { vezetekNev: 'asc' },
          { keresztNev: 'asc' },
        ],
      }),
    ]);

    return { total, items };
  }

  async findOne(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        jobPosition: true,
        educations: {
          orderBy: {
            vegzesEve: 'desc',
          },
        },
        languageSkills: {
          orderBy: {
            nyelv: 'asc',
          },
        },
        medicalExaminations: {
          orderBy: {
            vizsgalatDatuma: 'desc',
          },
        },
        disciplinaryActions: {
          orderBy: {
            datum: 'desc',
          },
        },
        studyContracts: {
          orderBy: {
            kezdetDatum: 'desc',
          },
        },
        employmentContracts: {
          include: {
            amendments: {
              orderBy: {
                datum: 'desc',
              },
            },
          },
          orderBy: {
            kezdetDatum: 'desc',
          },
        },
      },
    });

    if (!employee) {
      throw new NotFoundException('Dolgozó nem található');
    }

    return employee;
  }

  async create(dto: CreateEmployeeDto) {
    // Check if azonosito already exists
    const existing = await this.prisma.employee.findUnique({
      where: { azonosito: dto.azonosito },
    });

    if (existing) {
      throw new BadRequestException('Ez az azonosító már használatban van');
    }

    // Check if TAJ number already exists (if provided)
    if (dto.tajSzam) {
      const existingTaj = await this.prisma.employee.findUnique({
        where: { tajSzam: dto.tajSzam },
      });

      if (existingTaj) {
        throw new BadRequestException('Ez a TAJ szám már használatban van');
      }
    }

    const data: any = {
      ...dto,
      szuletesiDatum: dto.szuletesiDatum ? new Date(dto.szuletesiDatum) : undefined,
      munkaviszonyKezdete: dto.munkaviszonyKezdete ? new Date(dto.munkaviszonyKezdete) : undefined,
      munkaviszonyVege: dto.munkaviszonyVege ? new Date(dto.munkaviszonyVege) : undefined,
    };

    return this.prisma.employee.create({
      data,
      include: {
        jobPosition: true,
      },
    });
  }

  async update(id: string, dto: UpdateEmployeeDto) {
    const employee = await this.findOne(id);

    // Check if TAJ number is being changed and if it's already taken
    if (dto.tajSzam && dto.tajSzam !== employee.tajSzam) {
      const existingTaj = await this.prisma.employee.findUnique({
        where: { tajSzam: dto.tajSzam },
      });

      if (existingTaj) {
        throw new BadRequestException('Ez a TAJ szám már használatban van');
      }
    }

    const data: any = {
      ...dto,
      szuletesiDatum: dto.szuletesiDatum ? new Date(dto.szuletesiDatum) : undefined,
      munkaviszonyKezdete: dto.munkaviszonyKezdete ? new Date(dto.munkaviszonyKezdete) : undefined,
      munkaviszonyVege: dto.munkaviszonyVege ? new Date(dto.munkaviszonyVege) : undefined,
    };

    return this.prisma.employee.update({
      where: { id },
      data,
      include: {
        jobPosition: true,
      },
    });
  }

  async delete(id: string) {
    const employee = await this.findOne(id);
    return this.prisma.employee.delete({
      where: { id },
    });
  }
}

