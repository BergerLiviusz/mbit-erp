import { TicketService } from './ticket.service';

describe('TicketService', () => {
  it('escalates ticket', async () => {
    const prisma = {
      ticket: {
        update: jest.fn().mockResolvedValue({
          id: 't1',
          eszkalalva: true,
          allapot: 'eszkalalt',
        }),
      },
    };
    const svc = new TicketService(prisma as any);
    const result = await svc.escalate('t1');
    expect(result.eszkalalva).toBe(true);
    expect(prisma.ticket.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ allapot: 'eszkalalt' }),
      }),
    );
  });
});
