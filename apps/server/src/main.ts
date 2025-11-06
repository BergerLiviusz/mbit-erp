import * as dotenv from 'dotenv';
import { resolve, join } from 'path';

// Load .env from correct location
const envPath = join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

// Resolve DATABASE_URL relative path to absolute for consistent behavior
if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('file:./')) {
  const relativePath = process.env.DATABASE_URL.replace('file:./', '');
  const absolutePath = join(__dirname, '..', relativePath);
  process.env.DATABASE_URL = `file:${absolutePath}`;
}

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: ['http://localhost:5000', 'http://0.0.0.0:5000'],
    credentials: true,
  });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Audit Institute ERP szerver fut: http://0.0.0.0:${port}`);
}

bootstrap();
