import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateIntrastatDeclarationDto {
  ev: number;
  honap: number;
  megjegyzesek?: string;
}

export interface CreateIntrastatItemDto {
  itemId?: string;
  irany: string; // BEVETEL, KIVETEL
  partnerOrszagKod: string;
  szallitasiMod: string;
  statisztikaiErtek: number;
  nettoSuly?: number;
  kiegeszitoEgység?: string;
  kiegeszitoMennyiseg?: number;
  termekkod?: string;
  megjegyzesek?: string;
}

export interface UpdateIntrastatItemDto {
  partnerOrszagKod?: string;
  szallitasiMod?: string;
  statisztikaiErtek?: number;
  nettoSuly?: number;
  kiegeszitoEgység?: string;
  kiegeszitoMennyiseg?: number;
  termekkod?: string;
  megjegyzesek?: string;
}

@Injectable()
export class IntrastatService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip = 0, take = 50, filters?: {
    ev?: number;
    honap?: number;
    allapot?: string;
  }) {
    const where: any = {};

    if (filters?.ev) {
      where.ev = filters.ev;
    }

    if (filters?.honap) {
      where.honap = filters.honap;
    }

    if (filters?.allapot) {
      where.allapot = filters.allapot;
    }

    const [total, items] = await Promise.all([
      this.prisma.intrastatDeclaration.count({ where }),
      this.prisma.intrastatDeclaration.findMany({
        where,
        skip,
        take,
        include: {
          _count: {
            select: {
              items: true,
            },
          },
        },
        orderBy: [
          { ev: 'desc' },
          { honap: 'desc' },
        ],
      }),
    ]);

    return { total, items };
  }

  async findOne(id: string) {
    const declaration = await this.prisma.intrastatDeclaration.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            item: {
              select: {
                id: true,
                nev: true,
                azonosito: true,
              },
            },
          },
          orderBy: {
            partnerOrszagKod: 'asc',
          },
        },
      },
    });

    if (!declaration) {
      throw new NotFoundException('INTRASTAT bejelentés nem található');
    }

    return declaration;
  }

  async findByEvHonap(ev: number, honap: number) {
    const declaration = await this.prisma.intrastatDeclaration.findUnique({
      where: {
        ev_honap: {
          ev,
          honap,
        },
      },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    });

    return declaration;
  }

  async create(dto: CreateIntrastatDeclarationDto) {
    // Check if declaration already exists for this month
    const existing = await this.prisma.intrastatDeclaration.findFirst({
      where: {
        ev: dto.ev,
        honap: dto.honap,
      },
    });

    if (existing) {
      throw new BadRequestException('Ez a hónapra már létezik INTRASTAT bejelentés');
    }

    // Validate month
    if (dto.honap < 1 || dto.honap > 12) {
      throw new BadRequestException('Érvénytelen hónap');
    }

    return this.prisma.intrastatDeclaration.create({
      data: {
        ev: dto.ev,
        honap: dto.honap,
        megjegyzesek: dto.megjegyzesek,
        allapot: 'NYITOTT',
      },
      include: {
        items: true,
      },
    });
  }

  async addItem(declarationId: string, dto: CreateIntrastatItemDto) {
    const declaration = await this.findOne(declarationId);

    if (declaration.allapot !== 'NYITOTT') {
      throw new BadRequestException('Csak nyitott bejelentéshez lehet tételt hozzáadni');
    }

    // Validate irany
    if (dto.irany !== 'BEVETEL' && dto.irany !== 'KIVETEL') {
      throw new BadRequestException('Érvénytelen irány. Használjon BEVETEL vagy KIVETEL értéket');
    }

    // Validate partner country code (ISO 3166-1 alpha-2)
    if (!/^[A-Z]{2}$/.test(dto.partnerOrszagKod)) {
      throw new BadRequestException('Érvénytelen országkód. Használjon ISO 3166-1 alpha-2 formátumot (pl. DE, FR)');
    }

    // Validate szallitasiMod (1-9)
    const szallitasiModNum = parseInt(dto.szallitasiMod);
    if (isNaN(szallitasiModNum) || szallitasiModNum < 1 || szallitasiModNum > 9) {
      throw new BadRequestException('Érvénytelen szállítási mód. Használjon 1-9 közötti számot');
    }

    return this.prisma.intrastatItem.create({
      data: {
        intrastatDeclarationId: declarationId,
        itemId: dto.itemId || undefined,
        irany: dto.irany,
        partnerOrszagKod: dto.partnerOrszagKod,
        szallitasiMod: dto.szallitasiMod,
        statisztikaiErtek: dto.statisztikaiErtek,
        nettoSuly: dto.nettoSuly || undefined,
        kiegeszitoEgység: dto.kiegeszitoEgység || undefined,
        kiegeszitoMennyiseg: dto.kiegeszitoMennyiseg || undefined,
        termekkod: dto.termekkod || undefined,
        megjegyzesek: dto.megjegyzesek,
      },
      include: {
        item: true,
      },
    });
  }

  async updateItem(declarationId: string, itemId: string, dto: UpdateIntrastatItemDto) {
    const declaration = await this.findOne(declarationId);

    if (declaration.allapot !== 'NYITOTT') {
      throw new BadRequestException('Csak nyitott bejelentés módosítható');
    }

    const item = await this.prisma.intrastatItem.findFirst({
      where: {
        id: itemId,
        intrastatDeclarationId: declarationId,
      },
    });

    if (!item) {
      throw new NotFoundException('INTRASTAT tétel nem található');
    }

    // Validate partner country code if provided
    if (dto.partnerOrszagKod && !/^[A-Z]{2}$/.test(dto.partnerOrszagKod)) {
      throw new BadRequestException('Érvénytelen országkód');
    }

    // Validate szallitasiMod if provided
    if (dto.szallitasiMod) {
      const szallitasiModNum = parseInt(dto.szallitasiMod);
      if (isNaN(szallitasiModNum) || szallitasiModNum < 1 || szallitasiModNum > 9) {
        throw new BadRequestException('Érvénytelen szállítási mód');
      }
    }

    return this.prisma.intrastatItem.update({
      where: { id: itemId },
      data: dto,
      include: {
        item: true,
      },
    });
  }

  async markAsReady(declarationId: string) {
    const declaration = await this.findOne(declarationId);

    if (declaration.allapot !== 'NYITOTT') {
      throw new BadRequestException('Csak nyitott bejelentés jelölhető küldésre késznek');
    }

    // Check if there are items
    const itemCount = await this.prisma.intrastatItem.count({
      where: { intrastatDeclarationId: declarationId },
    });

    if (itemCount === 0) {
      throw new BadRequestException('Nem lehet küldésre késznek jelölni üres bejelentést');
    }

    return this.prisma.intrastatDeclaration.update({
      where: { id: declarationId },
      data: {
        allapot: 'KULDESRE_KESZ',
      },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    });
  }

  async markAsSent(declarationId: string) {
    const declaration = await this.findOne(declarationId);

    if (declaration.allapot !== 'KULDESRE_KESZ') {
      throw new BadRequestException('Csak küldésre kész bejelentés jelölhető elküldöttnek');
    }

    return this.prisma.intrastatDeclaration.update({
      where: { id: declarationId },
      data: {
        allapot: 'KULDOOTT',
        kuldesDatuma: new Date(),
      },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    });
  }

  async generateNavFormat(declarationId: string): Promise<string> {
    const declaration = await this.findOne(declarationId);

    // NAV INTRASTAT formátum generálása
    // Ez egy egyszerűsített formátum, a valós NAV formátum specifikusabb lehet
    const lines: string[] = [];

    // Header
    lines.push(`INTRASTAT_BEJELENTES`);
    lines.push(`EV:${declaration.ev}`);
    lines.push(`HONAP:${declaration.honap}`);
    lines.push(`ALLAPOT:${declaration.allapot}`);
    lines.push(``);

    // Items
    lines.push(`TETELEK:`);
    for (const item of declaration.items) {
      const line = [
        item.irany,
        item.partnerOrszagKod,
        item.szallitasiMod,
        item.statisztikaiErtek.toFixed(2),
        item.nettoSuly?.toFixed(2) || '',
        item.kiegeszitoEgység || '',
        item.kiegeszitoMennyiseg?.toFixed(2) || '',
        item.termekkod || '',
        item.item?.azonosito || '',
      ].join('|');
      lines.push(line);
    }

    return lines.join('\n');
  }

  async generateXmlFormat(declarationId: string): Promise<string> {
    const declaration = await this.findOne(declarationId);

    // XML formátum generálása NAV számára
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<IntrastatDeclaration>\n';
    xml += `  <Year>${declaration.ev}</Year>\n`;
    xml += `  <Month>${declaration.honap}</Month>\n`;
    xml += `  <Status>${declaration.allapot}</Status>\n`;
    xml += '  <Items>\n';

    for (const item of declaration.items) {
      xml += '    <Item>\n';
      xml += `      <Direction>${item.irany}</Direction>\n`;
      xml += `      <PartnerCountry>${item.partnerOrszagKod}</PartnerCountry>\n`;
      xml += `      <TransportMode>${item.szallitasiMod}</TransportMode>\n`;
      xml += `      <StatisticalValue>${item.statisztikaiErtek}</StatisticalValue>\n`;
      if (item.nettoSuly) {
        xml += `      <NetWeight>${item.nettoSuly}</NetWeight>\n`;
      }
      if (item.kiegeszitoEgység) {
        xml += `      <SupplementaryUnit>${item.kiegeszitoEgység}</SupplementaryUnit>\n`;
      }
      if (item.kiegeszitoMennyiseg) {
        xml += `      <SupplementaryQuantity>${item.kiegeszitoMennyiseg}</SupplementaryQuantity>\n`;
      }
      if (item.termekkod) {
        xml += `      <ProductCode>${item.termekkod}</ProductCode>\n`;
      }
      if (item.item) {
        xml += `      <ItemId>${item.item.azonosito}</ItemId>\n`;
      }
      xml += '    </Item>\n';
    }

    xml += '  </Items>\n';
    xml += '</IntrastatDeclaration>\n';

    return xml;
  }

  async deleteItem(declarationId: string, itemId: string) {
    const declaration = await this.findOne(declarationId);

    if (declaration.allapot !== 'NYITOTT') {
      throw new BadRequestException('Csak nyitott bejelentésből lehet tételt törölni');
    }

    return this.prisma.intrastatItem.delete({
      where: { id: itemId },
    });
  }

  async delete(declarationId: string) {
    const declaration = await this.findOne(declarationId);

    if (declaration.allapot === 'KULDOOTT' || declaration.allapot === 'VISSZAIGAZOLT') {
      throw new BadRequestException('Elküldött vagy visszaigazolt bejelentés nem törölhető');
    }

    return this.prisma.intrastatDeclaration.delete({
      where: { id: declarationId },
    });
  }
}

