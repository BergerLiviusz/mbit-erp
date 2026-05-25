import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductCategoryService {
  constructor(private prisma: PrismaService) {}

  async findTree() {
    const all = await this.prisma.productCategory.findMany({
      where: { aktiv: true },
      orderBy: { nev: 'asc' },
      include: { _count: { select: { items: true, children: true } } },
    });

    const byParent = new Map<string | null, typeof all>();
    for (const c of all) {
      const key = c.parentId ?? null;
      if (!byParent.has(key)) byParent.set(key, []);
      byParent.get(key)!.push(c);
    }

    const build = (parentId: string | null): any[] =>
      (byParent.get(parentId) || []).map((cat) => ({
        ...cat,
        children: build(cat.id),
      }));

    return build(null);
  }

  async findAll(skip = 0, take = 200) {
    const [total, data] = await Promise.all([
      this.prisma.productCategory.count(),
      this.prisma.productCategory.findMany({
        skip,
        take,
        orderBy: { nev: 'asc' },
        include: {
          parent: { select: { id: true, nev: true } },
          _count: { select: { items: true } },
        },
      }),
    ]);
    return { total, data };
  }

  async create(data: { nev: string; leiras?: string; parentId?: string }) {
    if (data.parentId) {
      const parent = await this.prisma.productCategory.findUnique({
        where: { id: data.parentId },
      });
      if (!parent) throw new NotFoundException('Szülő kategória nem található');
    }
    return this.prisma.productCategory.create({ data });
  }

  async update(
    id: string,
    data: { nev?: string; leiras?: string; parentId?: string | null; aktiv?: boolean },
  ) {
    if (data.parentId === id) {
      throw new BadRequestException('A kategória nem lehet saját gyermeke');
    }
    if (data.parentId) {
      const parent = await this.prisma.productCategory.findUnique({
        where: { id: data.parentId },
      });
      if (!parent) throw new NotFoundException('Szülő kategória nem található');
    }
    return this.prisma.productCategory.update({ where: { id }, data });
  }

  async delete(id: string) {
    const childCount = await this.prisma.productCategory.count({
      where: { parentId: id },
    });
    if (childCount > 0) {
      throw new BadRequestException('Előbb törölje vagy helyezze át az alkategóriákat');
    }
    await this.prisma.item.updateMany({
      where: { categoryId: id },
      data: { categoryId: null },
    });
    return this.prisma.productCategory.delete({ where: { id } });
  }

  async reportByCategory() {
    const categories = await this.prisma.productCategory.findMany({
      include: {
        items: {
          include: {
            stockLevels: { include: { warehouse: true } },
          },
        },
      },
    });

    return categories.map((cat) => {
      let totalQty = 0;
      let totalValue = 0;
      for (const item of cat.items) {
        for (const sl of item.stockLevels) {
          totalQty += sl.mennyiseg;
          totalValue += sl.mennyiseg * (item.beszerzesiAr || 0);
        }
      }
      return {
        categoryId: cat.id,
        categoryName: cat.nev,
        itemCount: cat.items.length,
        totalQty,
        totalValue,
      };
    });
  }
}
