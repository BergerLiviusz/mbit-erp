import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();
    
    this.$use(async (params, next) => {
      const result = await next(params);
      return result;
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Adatbázis kapcsolat létrejött');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
