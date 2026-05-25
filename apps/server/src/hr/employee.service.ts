import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateEmployeeDto {
  azonosito: string;
  vezetekNev: string;
  keresztNev: string;
  szuletesiDatum?: string;
  szuletesiHely?: string;
  szuletesiNev?: string;
  adoszam?: string;
  anyjaNeve?: string;
  allapot?: string;
  besorolas?: string;
  munkaido?: string;
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
  szuletesiNev?: string;
  adoszam?: string;
  anyjaNeve?: string;
  allapot?: string;
  besorolas?: string;
  munkaido?: string;
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

  private normalizeOptionalId(value: string | undefined): string | undefined {
    if (value === undefined) return undefined;
    const trimmed = value.trim();
    return trimmed.length === 0 ? undefined : trimmed;
  }

  async findAll(skip = 0, take = 50, filters?: {
    jobPositionId?: string;
    osztaly?: string;
    reszleg?: string;
    aktiv?: boolean;
    search?: string;
  }) {
    const where: any = {};

    if (filters?.jobPositionId) {
      const normalized = this.normalizeOptionalId(filters.jobPositionId);
      if (normalized) where.jobPositionId = normalized;
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
      jobPositionId: this.normalizeOptionalId(dto.jobPositionId),
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
      jobPositionId: dto.jobPositionId !== undefined ? this.normalizeOptionalId(dto.jobPositionId) : undefined,
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

  async createEducation(employeeId: string, dto: Record<string, unknown>) {
    await this.findOne(employeeId);
    return this.prisma.education.create({
      data: {
        employeeId,
        tipus: String(dto.tipus || ''),
        iskolaNev: String(dto.iskolaNev || ''),
        szak: dto.szak as string | undefined,
        vegzesEve: dto.vegzesEve ? Number(dto.vegzesEve) : undefined,
        megjegyzesek: dto.megjegyzesek as string | undefined,
      },
    });
  }

  async updateEducation(id: string, dto: Record<string, unknown>) {
    const row = await this.prisma.education.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Végzettség nem található');
    return this.prisma.education.update({
      where: { id },
      data: {
        tipus: dto.tipus as string | undefined,
        iskolaNev: dto.iskolaNev as string | undefined,
        szak: dto.szak as string | undefined,
        vegzesEve: dto.vegzesEve !== undefined ? Number(dto.vegzesEve) : undefined,
        megjegyzesek: dto.megjegyzesek as string | undefined,
      },
    });
  }

  async deleteEducation(id: string) {
    const row = await this.prisma.education.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Végzettség nem található');
    return this.prisma.education.delete({ where: { id } });
  }

  async createLanguageSkill(employeeId: string, dto: Record<string, unknown>) {
    await this.findOne(employeeId);
    return this.prisma.languageSkill.create({
      data: {
        employeeId,
        nyelv: String(dto.nyelv || ''),
        szint: String(dto.szint || ''),
        nyelvvizsga: dto.nyelvvizsga as string | undefined,
        megjegyzesek: dto.megjegyzesek as string | undefined,
      },
    });
  }

  async updateLanguageSkill(id: string, dto: Record<string, unknown>) {
    const row = await this.prisma.languageSkill.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Nyelvtudás nem található');
    return this.prisma.languageSkill.update({
      where: { id },
      data: {
        nyelv: dto.nyelv as string | undefined,
        szint: dto.szint as string | undefined,
        nyelvvizsga: dto.nyelvvizsga as string | undefined,
        megjegyzesek: dto.megjegyzesek as string | undefined,
      },
    });
  }

  async deleteLanguageSkill(id: string) {
    const row = await this.prisma.languageSkill.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Nyelvtudás nem található');
    return this.prisma.languageSkill.delete({ where: { id } });
  }

  async createMedicalExamination(employeeId: string, dto: Record<string, unknown>) {
    await this.findOne(employeeId);
    return this.prisma.medicalExamination.create({
      data: {
        employeeId,
        vizsgalatTipusa: String(dto.vizsgalatTipusa || ''),
        vizsgalatDatuma: new Date(String(dto.vizsgalatDatuma)),
        ervenyessegVege: dto.ervenyessegVege
          ? new Date(String(dto.ervenyessegVege))
          : undefined,
        eredmeny: dto.eredmeny as string | undefined,
        megjegyzesek: dto.megjegyzesek as string | undefined,
      },
    });
  }

  async updateMedicalExamination(id: string, dto: Record<string, unknown>) {
    const row = await this.prisma.medicalExamination.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Orvosi vizsgálat nem található');
    return this.prisma.medicalExamination.update({
      where: { id },
      data: {
        vizsgalatTipusa: dto.vizsgalatTipusa as string | undefined,
        vizsgalatDatuma: dto.vizsgalatDatuma
          ? new Date(String(dto.vizsgalatDatuma))
          : undefined,
        ervenyessegVege:
          dto.ervenyessegVege !== undefined
            ? dto.ervenyessegVege
              ? new Date(String(dto.ervenyessegVege))
              : null
            : undefined,
        eredmeny: dto.eredmeny as string | undefined,
        megjegyzesek: dto.megjegyzesek as string | undefined,
      },
    });
  }

  async deleteMedicalExamination(id: string) {
    const row = await this.prisma.medicalExamination.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Orvosi vizsgálat nem található');
    return this.prisma.medicalExamination.delete({ where: { id } });
  }

  async createDisciplinaryAction(employeeId: string, dto: Record<string, unknown>) {
    await this.findOne(employeeId);
    return this.prisma.disciplinaryAction.create({
      data: {
        employeeId,
        datum: new Date(String(dto.datum)),
        tipus: String(dto.tipus || ''),
        indok: String(dto.indok || ''),
        hatarozatSzam: dto.hatarozatSzam as string | undefined,
        megjegyzesek: dto.megjegyzesek as string | undefined,
      },
    });
  }

  async updateDisciplinaryAction(id: string, dto: Record<string, unknown>) {
    const row = await this.prisma.disciplinaryAction.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Fegyelmi elem nem található');
    return this.prisma.disciplinaryAction.update({
      where: { id },
      data: {
        datum: dto.datum ? new Date(String(dto.datum)) : undefined,
        tipus: dto.tipus as string | undefined,
        indok: dto.indok as string | undefined,
        hatarozatSzam: dto.hatarozatSzam as string | undefined,
        megjegyzesek: dto.megjegyzesek as string | undefined,
      },
    });
  }

  async deleteDisciplinaryAction(id: string) {
    const row = await this.prisma.disciplinaryAction.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Fegyelmi elem nem található');
    return this.prisma.disciplinaryAction.delete({ where: { id } });
  }

  async createStudyContract(employeeId: string, dto: Record<string, unknown>) {
    await this.findOne(employeeId);
    return this.prisma.studyContract.create({
      data: {
        employeeId,
        szerzodesSzam: String(dto.szerzodesSzam || ''),
        kezdetDatum: new Date(String(dto.kezdetDatum)),
        vegDatum: dto.vegDatum ? new Date(String(dto.vegDatum)) : undefined,
        tanulmanyiIntezmeny: String(dto.tanulmanyiIntezmeny || ''),
        szak: dto.szak as string | undefined,
        koltseg: dto.koltseg ? Number(dto.koltseg) : undefined,
        visszafizetesiKotelezettseg: Boolean(dto.visszafizetesiKotelezettseg),
        megjegyzesek: dto.megjegyzesek as string | undefined,
      },
    });
  }

  async updateStudyContract(id: string, dto: Record<string, unknown>) {
    const row = await this.prisma.studyContract.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Tanulmányi szerződés nem található');
    return this.prisma.studyContract.update({
      where: { id },
      data: {
        szerzodesSzam: dto.szerzodesSzam as string | undefined,
        kezdetDatum: dto.kezdetDatum ? new Date(String(dto.kezdetDatum)) : undefined,
        vegDatum:
          dto.vegDatum !== undefined
            ? dto.vegDatum
              ? new Date(String(dto.vegDatum))
              : null
            : undefined,
        tanulmanyiIntezmeny: dto.tanulmanyiIntezmeny as string | undefined,
        szak: dto.szak as string | undefined,
        koltseg: dto.koltseg !== undefined ? Number(dto.koltseg) : undefined,
        visszafizetesiKotelezettseg: dto.visszafizetesiKotelezettseg as boolean | undefined,
        megjegyzesek: dto.megjegyzesek as string | undefined,
      },
    });
  }

  async deleteStudyContract(id: string) {
    const row = await this.prisma.studyContract.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Tanulmányi szerződés nem található');
    return this.prisma.studyContract.delete({ where: { id } });
  }
}

