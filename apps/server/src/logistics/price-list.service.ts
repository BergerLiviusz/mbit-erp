import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePriceListDto } from './dto/create-price-list.dto';
import { UpdatePriceListDto } from './dto/update-price-list.dto';
import { AddPriceListItemDto } from './dto/add-price-list-item.dto';
import { UpdatePriceListItemDto } from './dto/update-price-list-item.dto';
import ExcelJS from 'exceljs';

export { CreatePriceListDto, UpdatePriceListDto, AddPriceListItemDto, UpdatePriceListItemDto };

@Injectable()
export class PriceListService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip = 0, take = 50, filters?: {
    supplierId?: string;
    aktiv?: boolean;
  }) {
    const where: any = {};

    if (filters?.supplierId) {
      where.supplierId = filters.supplierId;
    }

    if (filters?.aktiv !== undefined) {
      where.aktiv = filters.aktiv;
    }

    const [total, items] = await Promise.all([
      this.prisma.priceList.count({ where }),
      this.prisma.priceList.findMany({
        where,
        skip,
        take,
        include: {
          supplier: {
            select: {
              id: true,
              nev: true,
            },
          },
          _count: {
            select: {
              items: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    return { total, items };
  }

  async findOne(id: string) {
    const priceList = await this.prisma.priceList.findUnique({
      where: { id },
      include: {
        supplier: true,
        items: {
          include: {
            item: {
              select: {
                id: true,
                azonosito: true,
                nev: true,
                egyseg: true,
              },
            },
          },
          orderBy: {
            item: {
              nev: 'asc',
            },
          },
        },
      },
    });

    if (!priceList) {
      throw new NotFoundException('Árlista nem található');
    }

    return priceList;
  }

  async create(dto: CreatePriceListDto) {
    // Debug logging
    console.log('PriceListService.create - received dto:', JSON.stringify(dto, null, 2));
    console.log('PriceListService.create - dto.supplierId:', dto.supplierId);
    console.log('PriceListService.create - typeof dto.supplierId:', typeof dto.supplierId);
    
    // Validate supplierId - check for undefined, null, or empty string
    if (!dto.supplierId || (typeof dto.supplierId === 'string' && dto.supplierId.trim() === '')) {
      console.log('PriceListService.create - validation failed, supplierId is empty');
      throw new BadRequestException('Szállító megadása kötelező');
    }

    const supplier = await this.prisma.supplier.findUnique({
      where: { id: dto.supplierId },
    });

    if (!supplier) {
      throw new NotFoundException('Szállító nem található');
    }

    return this.prisma.priceList.create({
      data: {
        supplierId: dto.supplierId,
        nev: dto.nev,
        ervenyessegKezdet: new Date(dto.ervenyessegKezdet),
        ervenyessegVeg: dto.ervenyessegVeg ? new Date(dto.ervenyessegVeg) : null,
        aktiv: dto.aktiv !== undefined ? dto.aktiv : true,
      },
      include: {
        supplier: true,
      },
    });
  }

  async update(id: string, dto: UpdatePriceListDto) {
    const priceList = await this.findOne(id);

    return this.prisma.priceList.update({
      where: { id },
      data: {
        nev: dto.nev !== undefined ? dto.nev : priceList.nev,
        ervenyessegKezdet: dto.ervenyessegKezdet ? new Date(dto.ervenyessegKezdet) : priceList.ervenyessegKezdet,
        ervenyessegVeg: dto.ervenyessegVeg !== undefined ? (dto.ervenyessegVeg ? new Date(dto.ervenyessegVeg) : null) : priceList.ervenyessegVeg,
        aktiv: dto.aktiv !== undefined ? dto.aktiv : priceList.aktiv,
      },
      include: {
        supplier: true,
      },
    });
  }

  async delete(id: string) {
    const priceList = await this.findOne(id);
    
    return this.prisma.priceList.delete({
      where: { id },
    });
  }

  async addItem(priceListId: string, dto: AddPriceListItemDto) {
    const priceList = await this.findOne(priceListId);

    const item = await this.prisma.item.findUnique({
      where: { id: dto.itemId },
    });

    if (!item) {
      throw new NotFoundException('Áru nem található');
    }

    // Check if item already exists in price list
    const existingItem = await this.prisma.priceListItem.findUnique({
      where: {
        priceListId_itemId: {
          priceListId,
          itemId: dto.itemId,
        },
      },
    });

    if (existingItem) {
      throw new BadRequestException('Az áru már szerepel az árlistában');
    }

    return this.prisma.priceListItem.create({
      data: {
        priceListId,
        itemId: dto.itemId,
        ar: dto.ar,
        valuta: dto.valuta || 'HUF',
      },
      include: {
        item: {
          select: {
            id: true,
            azonosito: true,
            nev: true,
            egyseg: true,
          },
        },
      },
    });
  }

  async updateItem(priceListId: string, itemId: string, dto: UpdatePriceListItemDto) {
    const priceListItem = await this.prisma.priceListItem.findUnique({
      where: {
        priceListId_itemId: {
          priceListId,
          itemId,
        },
      },
    });

    if (!priceListItem) {
      throw new NotFoundException('Árlista tétel nem található');
    }

    return this.prisma.priceListItem.update({
      where: {
        priceListId_itemId: {
          priceListId,
          itemId,
        },
      },
      data: {
        ar: dto.ar !== undefined ? dto.ar : priceListItem.ar,
        valuta: dto.valuta !== undefined ? dto.valuta : priceListItem.valuta,
      },
      include: {
        item: {
          select: {
            id: true,
            azonosito: true,
            nev: true,
            egyseg: true,
          },
        },
      },
    });
  }

  async removeItem(priceListId: string, itemId: string) {
    const priceListItem = await this.prisma.priceListItem.findUnique({
      where: {
        priceListId_itemId: {
          priceListId,
          itemId,
        },
      },
    });

    if (!priceListItem) {
      throw new NotFoundException('Árlista tétel nem található');
    }

    return this.prisma.priceListItem.delete({
      where: {
        priceListId_itemId: {
          priceListId,
          itemId,
        },
      },
    });
  }

  async importFromExcel(priceListId: string, file: Express.Multer.File): Promise<{ success: number; errors: string[] }> {
    const priceList = await this.findOne(priceListId);
    const workbook = new ExcelJS.Workbook();
    const errors: string[] = [];
    let success = 0;

    await workbook.xlsx.load(file.buffer as any);

    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      throw new BadRequestException('Az Excel fájl nem tartalmaz munkalapot');
    }

    // Expected columns: Cikk azonosító, Ár, Valuta (opcionális)
    const rows = worksheet.getRows(2, worksheet.rowCount); // Skip header row

    for (const row of rows || []) {
      try {
        const itemAzonosito = row.getCell(1).value?.toString()?.trim();
        const arValue = row.getCell(2).value;
        const valuta = row.getCell(3).value?.toString()?.trim() || 'HUF';

        if (!itemAzonosito || !arValue) {
          continue; // Skip empty rows
        }

        const ar = typeof arValue === 'number' ? arValue : parseFloat(arValue.toString());

        if (isNaN(ar)) {
          errors.push(`Sor ${row.number}: Érvénytelen ár érték`);
          continue;
        }

        // Find item by azonosito
        const item = await this.prisma.item.findUnique({
          where: { azonosito: itemAzonosito },
        });

        if (!item) {
          errors.push(`Sor ${row.number}: Cikk nem található azonosítóval: ${itemAzonosito}`);
          continue;
        }

        // Check if item already exists in price list
        const existingItem = await this.prisma.priceListItem.findUnique({
          where: {
            priceListId_itemId: {
              priceListId,
              itemId: item.id,
            },
          },
        });

        if (existingItem) {
          // Update existing item
          await this.prisma.priceListItem.update({
            where: {
              priceListId_itemId: {
                priceListId,
                itemId: item.id,
              },
            },
            data: {
              ar,
              valuta,
            },
          });
        } else {
          // Create new item
          await this.prisma.priceListItem.create({
            data: {
              priceListId,
              itemId: item.id,
              ar,
              valuta,
            },
          });
        }

        success++;
      } catch (error: any) {
        errors.push(`Sor ${row.number}: ${error.message}`);
      }
    }

    return { success, errors };
  }

  async exportToExcel(priceListId: string): Promise<Buffer> {
    const priceList = await this.findOne(priceListId);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Árlista');

    // Header
    worksheet.mergeCells('A1:D1');
    worksheet.getCell('A1').value = priceList.nev;
    worksheet.getCell('A1').font = { size: 16, bold: true };
    worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };

    // Price list info
    let infoRow = 3;
    worksheet.getCell(`A${infoRow}`).value = 'Szállító:';
    worksheet.getCell(`B${infoRow}`).value = priceList.supplier.nev;
    infoRow++;

    worksheet.getCell(`A${infoRow}`).value = 'Érvényesség kezdete:';
    worksheet.getCell(`B${infoRow}`).value = new Date(priceList.ervenyessegKezdet).toLocaleDateString('hu-HU');
    infoRow++;

    if (priceList.ervenyessegVeg) {
      worksheet.getCell(`A${infoRow}`).value = 'Érvényesség vége:';
      worksheet.getCell(`B${infoRow}`).value = new Date(priceList.ervenyessegVeg).toLocaleDateString('hu-HU');
      infoRow++;
    }

    worksheet.getCell(`A${infoRow}`).value = 'Állapot:';
    worksheet.getCell(`B${infoRow}`).value = priceList.aktiv ? 'Aktív' : 'Inaktív';
    infoRow++;

    // Table header
    const headerRow = infoRow + 1;
    worksheet.getCell(`A${headerRow}`).value = 'Cikk azonosító';
    worksheet.getCell(`B${headerRow}`).value = 'Cikk név';
    worksheet.getCell(`C${headerRow}`).value = 'Ár';
    worksheet.getCell(`D${headerRow}`).value = 'Valuta';

    // Style header
    worksheet.getRow(headerRow).font = { bold: true };
    worksheet.getRow(headerRow).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };
    worksheet.getRow(headerRow).eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Data rows
    priceList.items.forEach((item, index) => {
      const row = headerRow + 1 + index;
      worksheet.getCell(`A${row}`).value = item.item.azonosito;
      worksheet.getCell(`B${row}`).value = item.item.nev;
      worksheet.getCell(`C${row}`).value = item.ar;
      worksheet.getCell(`C${row}`).numFmt = '#,##0';
      worksheet.getCell(`D${row}`).value = item.valuta;

      // Add borders to data rows
      worksheet.getRow(row).eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    // Auto-fit columns
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell!({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 0;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength + 2;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}

