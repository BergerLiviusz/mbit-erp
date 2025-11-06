import * as dotenv from 'dotenv';
import { join } from 'path';
import { existsSync } from 'fs';

// Load .env from server directory - try multiple paths with override=true to override system env vars
const possibleEnvPaths = [
  join(process.cwd(), 'apps', 'server', '.env'),
  join(__dirname, '..', '.env'),
  join(process.cwd(), '.env'),
];

for (const envPath of possibleEnvPaths) {
  if (existsSync(envPath)) {
    dotenv.config({ path: envPath, override: true });
    console.log(`📄 Loaded .env from: ${envPath} (with override)`);
    break;
  }
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
  console.log(`🚀 Mbit ERP szerver fut: http://0.0.0.0:${port}`);
}

bootstrap();
