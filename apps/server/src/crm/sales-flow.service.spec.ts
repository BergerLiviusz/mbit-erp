import { SalesFlowService } from './sales-flow.service';
import { BadRequestException } from '@nestjs/common';

describe('SalesFlowService', () => {
  const mockPrisma = () => ({
    quote: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    order: { create: jest.fn(), findFirst: jest.fn(), count: jest.fn() },
    invoiceStub: { count: jest.fn(), create: jest.fn() },
    shipment: { create: jest.fn(), findUnique: jest.fn() },
  });

  it('rejects convert when quote not approved', async () => {
    const prisma = mockPrisma();
    prisma.quote.findUnique.mockResolvedValue({
      id: 'q1',
      allapot: 'tervezet',
      items: [],
      order: null,
      discounts: [],
    });
    const svc = new SalesFlowService(prisma as any, { get: jest.fn() } as any);
    await expect(svc.convertQuoteToOrder('q1')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('creates order from approved quote', async () => {
    const prisma = mockPrisma();
    prisma.quote.findUnique.mockResolvedValue({
      id: 'q1',
      accountId: 'a1',
      azonosito: 'AJ-1',
      allapot: 'jovahagyott',
      osszeg: 100,
      afa: 27,
      vegosszeg: 127,
      items: [{ itemId: 'i1', mennyiseg: 1, egysegAr: 100, kedvezmeny: 0, osszeg: 100 }],
      order: null,
      discounts: [],
    });
    prisma.order.findFirst.mockResolvedValue(null);
    prisma.order.create.mockResolvedValue({ id: 'o1', azonosito: 'REND-1' });
    prisma.quote.update.mockResolvedValue({});
    const svc = new SalesFlowService(prisma as any, {
      get: jest.fn().mockResolvedValue('REND'),
    } as any);
    const order = await svc.convertQuoteToOrder('q1');
    expect(order.id).toBe('o1');
    expect(prisma.order.create).toHaveBeenCalled();
  });
});
