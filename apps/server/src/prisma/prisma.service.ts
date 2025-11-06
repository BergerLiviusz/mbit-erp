import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { join } from 'path';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Resolve relative DATABASE_URL to absolute path for consistency across environments
    let datasourceUrl = process.env.DATABASE_URL;
    
    if (datasourceUrl?.startsWith('file:./')) {
      const relativePath = datasourceUrl.replace('file:./', '');
      const absolutePath = join(process.cwd(), 'apps', 'server', relativePath);
      datasourceUrl = `file:${absolutePath}`;
    }
    
    super({
      datasources: {
        db: {
          url: datasourceUrl,
        },
      },
    });
    
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
