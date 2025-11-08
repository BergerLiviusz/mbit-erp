import * as dotenv from 'dotenv';
import { join } from 'path';
import { existsSync } from 'fs';

// In Electron mode, skip .env loading - environment variables are set by Electron's main process
// This prevents Replit or other development .env files from overriding Electron's DATABASE_URL
const isElectron = process.env.ELECTRON_RUN_AS_NODE === '1';

if (!isElectron) {
  // Load .env from server directory - try multiple paths with override=false to respect existing env vars
  const possibleEnvPaths = [
    join(process.cwd(), 'apps', 'server', '.env'),
    join(__dirname, '..', '.env'),
    join(process.cwd(), '.env'),
  ];

  for (const envPath of possibleEnvPaths) {
    if (existsSync(envPath)) {
      // Use override=false to respect environment variables already set (e.g., by CI/CD)
      dotenv.config({ path: envPath, override: false });
      console.log(`📄 Loaded .env from: ${envPath}`);
      break;
    }
  }
} else {
  console.log('🔧 Electron mode detected - skipping .env file loading (using Electron-provided environment variables)');
}

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  // Log environment info for debugging
  console.log('🔍 Environment check:');
  console.log(`  - ELECTRON_RUN_AS_NODE: ${process.env.ELECTRON_RUN_AS_NODE || 'not set'}`);
  console.log(`  - DATABASE_URL: ${process.env.DATABASE_URL ? '***SET***' : 'NOT SET'}`);
  console.log(`  - PORT: ${process.env.PORT || '3000 (default)'}`);
  console.log(`  - NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
  
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: ['http://localhost:5000', 'http://127.0.0.1:5000', 'http://0.0.0.0:5000'],
    credentials: true,
  });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  const bindAddress = isElectron ? '127.0.0.1' : '0.0.0.0';
  
  await app.listen(port, bindAddress);
  console.log(`🚀 Mbit ERP szerver fut: http://${bindAddress}:${port}`);
}

bootstrap();
