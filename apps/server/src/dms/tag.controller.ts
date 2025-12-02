import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';

@Controller('dms/tags')
@UseGuards(RbacGuard)
export class TagController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @Permissions(Permission.DOCUMENT_VIEW)
  async findAll() {
    const tags = await this.prisma.tag.findMany({
      orderBy: { nev: 'asc' },
      include: {
        _count: {
          select: {
            documents: true,
          },
        },
      },
    });
    return tags;
  }

  @Post()
  @Permissions(Permission.DOCUMENT_CREATE)
  async create(@Body() data: { nev: string; szin?: string }) {
    return this.prisma.tag.create({
      data: {
        nev: data.nev,
        szin: data.szin,
      },
    });
  }

  @Put(':id')
  @Permissions(Permission.DOCUMENT_EDIT)
  async update(@Param('id') id: string, @Body() data: { nev?: string; szin?: string }) {
    return this.prisma.tag.update({
      where: { id },
      data: {
        nev: data.nev,
        szin: data.szin,
      },
    });
  }

  @Delete(':id')
  @Permissions(Permission.DOCUMENT_DELETE)
  async delete(@Param('id') id: string) {
    await this.prisma.tag.delete({
      where: { id },
    });
    return { success: true };
  }
}

