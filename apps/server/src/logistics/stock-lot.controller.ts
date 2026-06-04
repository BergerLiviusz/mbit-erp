import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { AuditService } from '../common/audit/audit.service';

@Controller('logistics/stock-lots')
@UseGuards(RbacGuard)
export class StockLotController {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  @Patch(':id')
  @Permissions(Permission.STOCK_EDIT, Permission.PRODUCT_EDIT)
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      sarzsGyartasiSzam?: string | null;
      lejarat?: string | null;
      beszerzesiAr?: number;
      mennyiseg?: number;
    },
    @Request() req: any,
  ) {
    const lot = await this.prisma.stockLot.findUnique({ where: { id } });
    if (!lot) {
      throw new NotFoundException('Sarzs nem található');
    }

    const data: Record<string, unknown> = {};
    if (body.sarzsGyartasiSzam !== undefined) {
      data.sarzsGyartasiSzam = body.sarzsGyartasiSzam?.trim() || null;
    }
    if (body.lejarat !== undefined) {
      data.lejarat = body.lejarat ? new Date(body.lejarat) : null;
    }
    if (body.beszerzesiAr !== undefined) {
      data.beszerzesiAr = body.beszerzesiAr;
    }
    if (body.mennyiseg !== undefined) {
      data.mennyiseg = body.mennyiseg;
    }

    const updated = await this.prisma.stockLot.update({
      where: { id },
      data,
      include: { warehouse: true, item: true },
    });

    await this.auditService.logUpdate(
      'StockLot',
      id,
      {
        sarzsGyartasiSzam: lot.sarzsGyartasiSzam,
        lejarat: lot.lejarat,
        beszerzesiAr: lot.beszerzesiAr,
        mennyiseg: lot.mennyiseg,
      },
      {
        sarzsGyartasiSzam: updated.sarzsGyartasiSzam,
        lejarat: updated.lejarat,
        beszerzesiAr: updated.beszerzesiAr,
        mennyiseg: updated.mennyiseg,
      },
      req.user?.id,
    );

    return updated;
  }
}
