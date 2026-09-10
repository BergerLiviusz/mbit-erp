import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

function optionalText(value?: string | null): string | undefined {
  if (value == null) return undefined;
  const trimmed = String(value).trim();
  return trimmed === '' ? undefined : trimmed;
}

function optionalDate(value?: string | null): Date | undefined {
  const text = optionalText(value);
  if (!text) return undefined;
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

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
              previousEmployments: true,
              awards: true,
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
        previousEmployments: {
          orderBy: { kezdet: 'desc' },
        },
        awards: {
          orderBy: { datum: 'desc' },
        },
      },
    });

    if (!employee) {
      throw new NotFoundException('Dolgoz? nem tal?lhat?');
    }

    return employee;
  }

  async create(dto: CreateEmployeeDto) {
    // Check if azonosito already exists
    const existing = await this.prisma.employee.findUnique({
      where: { azonosito: dto.azonosito },
    });

    if (existing) {
      throw new BadRequestException('Ez az azonos?t? m?r haszn?latban van');
    }

    const tajSzam = optionalText(dto.tajSzam);
    const jobPositionId = optionalText(dto.jobPositionId);

    // Check if TAJ number already exists (if provided)
    if (tajSzam) {
      const existingTaj = await this.prisma.employee.findUnique({
        where: { tajSzam },
      });

      if (existingTaj) {
        throw new BadRequestException('Ez a TAJ sz?m m?r haszn?latban van');
      }
    }

    if (jobPositionId) {
      const position = await this.prisma.jobPosition.findUnique({
        where: { id: jobPositionId },
      });
      if (!position) {
        throw new BadRequestException('A megadott munkakör nem található');
      }
    }

    const data = {
      azonosito: dto.azonosito.trim(),
      vezetekNev: dto.vezetekNev.trim(),
      keresztNev: dto.keresztNev.trim(),
      szuletesiDatum: optionalDate(dto.szuletesiDatum),
      szuletesiHely: optionalText(dto.szuletesiHely),
      tajSzam: tajSzam ?? null,
      szemelyiIgazolvanySzam: optionalText(dto.szemelyiIgazolvanySzam),
      lakcim: optionalText(dto.lakcim),
      tartozkodasiCim: optionalText(dto.tartozkodasiCim),
      telefon: optionalText(dto.telefon),
      email: optionalText(dto.email),
      munkaviszonyKezdete: optionalDate(dto.munkaviszonyKezdete),
      munkaviszonyVege: optionalDate(dto.munkaviszonyVege),
      munkaviszonyTipusa: optionalText(dto.munkaviszonyTipusa),
      jobPositionId: jobPositionId ?? null,
      osztaly: optionalText(dto.osztaly),
      reszleg: optionalText(dto.reszleg),
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

    const tajSzam = dto.tajSzam !== undefined ? optionalText(dto.tajSzam) ?? null : undefined;
    const jobPositionId =
      dto.jobPositionId !== undefined ? optionalText(dto.jobPositionId) ?? null : undefined;

    // Check if TAJ number is being changed and if it's already taken
    if (tajSzam && tajSzam !== employee.tajSzam) {
      const existingTaj = await this.prisma.employee.findUnique({
        where: { tajSzam },
      });

      if (existingTaj) {
        throw new BadRequestException('Ez a TAJ sz?m m?r használatban van');
      }
    }

    if (jobPositionId) {
      const position = await this.prisma.jobPosition.findUnique({
        where: { id: jobPositionId },
      });
      if (!position) {
        throw new BadRequestException('A megadott munkakör nem található');
      }
    }

    const data: any = {
      ...dto,
      tajSzam,
      jobPositionId,
      szuletesiDatum:
        dto.szuletesiDatum !== undefined
          ? optionalDate(dto.szuletesiDatum) ?? null
          : undefined,
      munkaviszonyKezdete:
        dto.munkaviszonyKezdete !== undefined
          ? optionalDate(dto.munkaviszonyKezdete) ?? null
          : undefined,
      munkaviszonyVege:
        dto.munkaviszonyVege !== undefined
          ? optionalDate(dto.munkaviszonyVege) ?? null
          : undefined,
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

  async createPreviousEmployment(
    employeeId: string,
    dto: {
      munkaadoNev: string;
      munkakor?: string;
      kezdet?: string;
      veg?: string;
      megjegyzes?: string;
    },
  ) {
    await this.findOne(employeeId);
    return this.prisma.previousEmployment.create({
      data: {
        employeeId,
        munkaadoNev: dto.munkaadoNev,
        munkakor: dto.munkakor,
        kezdet: dto.kezdet ? new Date(dto.kezdet) : undefined,
        veg: dto.veg ? new Date(dto.veg) : undefined,
        megjegyzes: dto.megjegyzes,
      },
    });
  }

  async updatePreviousEmployment(
    id: string,
    dto: {
      munkaadoNev?: string;
      munkakor?: string;
      kezdet?: string;
      veg?: string;
      megjegyzes?: string;
    },
  ) {
    const row = await this.prisma.previousEmployment.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Kor?bbi munkahely nem tal?lhat?');
    return this.prisma.previousEmployment.update({
      where: { id },
      data: {
        munkaadoNev: dto.munkaadoNev,
        munkakor: dto.munkakor,
        kezdet: dto.kezdet !== undefined ? (dto.kezdet ? new Date(dto.kezdet) : null) : undefined,
        veg: dto.veg !== undefined ? (dto.veg ? new Date(dto.veg) : null) : undefined,
        megjegyzes: dto.megjegyzes,
      },
    });
  }

  async deletePreviousEmployment(id: string) {
    const row = await this.prisma.previousEmployment.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Kor?bbi munkahely nem tal?lhat?');
    return this.prisma.previousEmployment.delete({ where: { id } });
  }

  async createAward(
    employeeId: string,
    dto: { megnevezes: string; datum: string; intezmeny?: string; megjegyzes?: string },
  ) {
    await this.findOne(employeeId);
    return this.prisma.employeeAward.create({
      data: {
        employeeId,
        megnevezes: dto.megnevezes,
        datum: new Date(dto.datum),
        intezmeny: dto.intezmeny,
        megjegyzes: dto.megjegyzes,
      },
    });
  }

  async updateAward(
    id: string,
    dto: { megnevezes?: string; datum?: string; intezmeny?: string; megjegyzes?: string },
  ) {
    const row = await this.prisma.employeeAward.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Kit?ntet?s nem tal?lhat?');
    return this.prisma.employeeAward.update({
      where: { id },
      data: {
        megnevezes: dto.megnevezes,
        datum: dto.datum ? new Date(dto.datum) : undefined,
        intezmeny: dto.intezmeny,
        megjegyzes: dto.megjegyzes,
      },
    });
  }

  async deleteAward(id: string) {
    const row = await this.prisma.employeeAward.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Kit?ntet?s nem tal?lhat?');
    return this.prisma.employeeAward.delete({ where: { id } });
  }
}

