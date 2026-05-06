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

    // Check if TAJ number already exists (if provided)
    if (dto.tajSzam) {
      const existingTaj = await this.prisma.employee.findUnique({
        where: { tajSzam: dto.tajSzam },
      });

      if (existingTaj) {
        throw new BadRequestException('Ez a TAJ sz?m m?r haszn?latban van');
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
        throw new BadRequestException('Ez a TAJ sz?m m?r haszn?latban van');
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

