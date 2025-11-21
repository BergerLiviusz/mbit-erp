import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateEmploymentContractDto {
  employeeId: string;
  szerzodesSzam: string;
  tipus: string;
  kezdetDatum: string;
  vegDatum?: string;
  probaidoVege?: string;
  fizetes?: number;
  megjegyzesek?: string;
}

export interface UpdateEmploymentContractDto {
  tipus?: string;
  vegDatum?: string;
  probaidoVege?: string;
  fizetes?: number;
  megjegyzesek?: string;
}

export interface CreateContractAmendmentDto {
  datum: string;
  tipus: string;
  leiras: string;
  ujFizetes?: number;
  ujVegDatum?: string;
  megjegyzesek?: string;
}

@Injectable()
export class ContractService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip = 0, take = 50, filters?: {
    employeeId?: string;
    tipus?: string;
    aktiv?: boolean;
  }) {
    const where: any = {};

    if (filters?.employeeId) {
      where.employeeId = filters.employeeId;
    }

    if (filters?.tipus) {
      where.tipus = filters.tipus;
    }

    if (filters?.aktiv !== undefined) {
      if (filters.aktiv) {
        where.vegDatum = null;
      } else {
        where.vegDatum = { not: null };
      }
    }

    const [total, items] = await Promise.all([
      this.prisma.employmentContract.count({ where }),
      this.prisma.employmentContract.findMany({
        where,
        skip,
        take,
        include: {
          employee: {
            select: {
              id: true,
              azonosito: true,
              vezetekNev: true,
              keresztNev: true,
            },
          },
          amendments: {
            orderBy: {
              datum: 'desc',
            },
          },
          _count: {
            select: {
              amendments: true,
            },
          },
        },
        orderBy: {
          kezdetDatum: 'desc',
        },
      }),
    ]);

    return { total, items };
  }

  async findOne(id: string) {
    const contract = await this.prisma.employmentContract.findUnique({
      where: { id },
      include: {
        employee: true,
        amendments: {
          orderBy: {
            datum: 'desc',
          },
        },
      },
    });

    if (!contract) {
      throw new NotFoundException('Munkaszerződés nem található');
    }

    return contract;
  }

  async create(dto: CreateEmploymentContractDto) {
    // Check if employee exists
    const employee = await this.prisma.employee.findUnique({
      where: { id: dto.employeeId },
    });

    if (!employee) {
      throw new NotFoundException('Dolgozó nem található');
    }

    // Check if szerzodesSzam already exists
    const existing = await this.prisma.employmentContract.findUnique({
      where: { szerzodesSzam: dto.szerzodesSzam },
    });

    if (existing) {
      throw new BadRequestException('Ez a szerződésszám már használatban van');
    }

    // Validate dates
    const kezdetDatum = new Date(dto.kezdetDatum);
    const vegDatum = dto.vegDatum ? new Date(dto.vegDatum) : null;
    const probaidoVege = dto.probaidoVege ? new Date(dto.probaidoVege) : null;

    if (vegDatum && vegDatum < kezdetDatum) {
      throw new BadRequestException('A végdátum nem lehet korábbi, mint a kezdetdátum');
    }

    if (probaidoVege && probaidoVege < kezdetDatum) {
      throw new BadRequestException('A próbaidő vége nem lehet korábbi, mint a kezdetdátum');
    }

    return this.prisma.employmentContract.create({
      data: {
        employeeId: dto.employeeId,
        szerzodesSzam: dto.szerzodesSzam,
        tipus: dto.tipus,
        kezdetDatum,
        vegDatum,
        probaidoVege,
        fizetes: dto.fizetes,
        megjegyzesek: dto.megjegyzesek,
      },
      include: {
        employee: true,
        amendments: true,
      },
    });
  }

  async update(id: string, dto: UpdateEmploymentContractDto) {
    const contract = await this.findOne(id);

    const vegDatum = dto.vegDatum ? new Date(dto.vegDatum) : undefined;
    const probaidoVege = dto.probaidoVege ? new Date(dto.probaidoVege) : undefined;

    if (vegDatum && vegDatum < contract.kezdetDatum) {
      throw new BadRequestException('A végdátum nem lehet korábbi, mint a kezdetdátum');
    }

    if (probaidoVege && probaidoVege < contract.kezdetDatum) {
      throw new BadRequestException('A próbaidő vége nem lehet korábbi, mint a kezdetdátum');
    }

    const data: any = {
      ...dto,
      vegDatum: dto.vegDatum ? new Date(dto.vegDatum) : undefined,
      probaidoVege: dto.probaidoVege ? new Date(dto.probaidoVege) : undefined,
    };

    return this.prisma.employmentContract.update({
      where: { id },
      data,
      include: {
        employee: true,
        amendments: {
          orderBy: {
            datum: 'desc',
          },
        },
      },
    });
  }

  async addAmendment(contractId: string, dto: CreateContractAmendmentDto) {
    const contract = await this.findOne(contractId);

    const datum = new Date(dto.datum);

    if (datum < contract.kezdetDatum) {
      throw new BadRequestException('A módosítás dátuma nem lehet korábbi, mint a szerződés kezdetdátuma');
    }

    const amendment = await this.prisma.contractAmendment.create({
      data: {
        employmentContractId: contractId,
        datum,
        tipus: dto.tipus,
        leiras: dto.leiras,
        ujFizetes: dto.ujFizetes,
        ujVegDatum: dto.ujVegDatum ? new Date(dto.ujVegDatum) : undefined,
        megjegyzesek: dto.megjegyzesek,
      },
    });

    // If amendment includes new salary or end date, update contract
    const updateData: any = {};
    if (dto.ujFizetes !== undefined) {
      updateData.fizetes = dto.ujFizetes;
    }
    if (dto.ujVegDatum) {
      updateData.vegDatum = new Date(dto.ujVegDatum);
    }

    if (Object.keys(updateData).length > 0) {
      await this.prisma.employmentContract.update({
        where: { id: contractId },
        data: updateData,
      });
    }

    return amendment;
  }

  async getExpiringContracts(days: number = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const contracts = await this.prisma.employmentContract.findMany({
      where: {
        vegDatum: {
          not: null,
          lte: futureDate,
          gte: new Date(),
        },
      },
      include: {
        employee: {
          select: {
            id: true,
            azonosito: true,
            vezetekNev: true,
            keresztNev: true,
            email: true,
          },
        },
      },
      orderBy: {
        vegDatum: 'asc',
      },
    });

    return contracts;
  }

  async delete(id: string) {
    const contract = await this.findOne(id);

    // Check if there are amendments
    const amendmentCount = await this.prisma.contractAmendment.count({
      where: { employmentContractId: id },
    });

    if (amendmentCount > 0) {
      throw new BadRequestException('Nem törölhető szerződés, mert vannak hozzá tartozó módosítások');
    }

    return this.prisma.employmentContract.delete({
      where: { id },
    });
  }
}

