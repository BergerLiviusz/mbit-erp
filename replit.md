# Mbit ERP System

## Project Overview
Comprehensive modular enterprise ERP system for **MB-IT Kft.** featuring:
- Desktop application (Electron) + Browser PWA
- Full Hungarian localization (UI and documentation)
- Core modules: CRM, DMS with OCR, Logistics
- Scaffold for future modules: HR, BI, Manufacturing, E-commerce, Marketing
- On-premise deployment capability
- GDPR and compliance-ready with extensive Hungarian documentation

## Tech Stack
- Frontend: React 18, Vite, TypeScript, TailwindCSS, React Router
- Backend: NestJS, TypeScript
- Database: SQLite (development), PostgreSQL (production capable)
- ORM: Prisma
- Build System: Turborepo (monorepo)

## Project Structure
```
mbit-erp/
├── apps/
│   ├── web/          # React frontend (runs on port 5000)
│   └── server/       # NestJS backend (runs on port 3000)
├── packages/
│   └── shared/       # Shared TypeScript types and utilities
└── docs/            # Hungarian documentation (9 files)
```

## Recent Changes (November 6, 2025)

### Complete Rebranding
- **From**: "Audit Institute" → **To**: "Mbit" / "MB-IT Kft."
- All package names updated from @audit-erp to @mbit-erp
- Email addresses updated: admin@audit.hu → admin@mbit.hu
- All 9 Hungarian documentation files updated with new branding
- Frontend UI updated to display "Mbit ERP"

### DATABASE_URL Configuration Fix
**Problem**: Backend server failing to start with error "the URL must start with the protocol `file:`"

**Root Cause**: Replit's PostgreSQL environment variable (DATABASE_URL) was overriding the .env file configuration.

**Solution Implemented**:
1. Updated `apps/server/src/main.ts` to load `.env` with `override: true` to explicitly override system environment variables
2. Updated `apps/server/src/prisma/prisma.service.ts` to resolve relative paths (`file:./prisma/dev.db`) to absolute paths at runtime
3. Set DATABASE_URL in `.env` to: `file:/home/runner/workspace/apps/server/prisma/dev.db`

**Key Code Changes**:
```typescript
// main.ts - Load .env with override
dotenv.config({ path: envPath, override: true });

// prisma.service.ts - Resolve relative paths
if (datasourceUrl?.startsWith('file:./')) {
  const relativePath = datasourceUrl.replace('file:./', '');
  const absolutePath = join(process.cwd(), 'apps', 'server', relativePath);
  datasourceUrl = `file:${absolutePath}`;
}
```

## Default Credentials
- **Email**: admin@mbit.hu
- **Password**: admin123

## Development Commands

### Install Dependencies
```bash
npm install
```

### Database Management
```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Sync schema to database
npm run db:seed      # Seed database with sample data
```

### Run Development Servers
Both workflows are configured and running automatically:
- **Backend Server**: `cd apps/server && npm run start:dev` (port 3000)
- **Frontend Web App**: `cd apps/web && npm run dev` (port 5000)

## User Preferences
- Language: Hungarian (Magyar)
- Company: MB-IT Kft.
- Focus: Enterprise ERP with compliance readiness

## Architecture Decisions
1. **Monorepo**: Using Turborepo for efficient builds and dependency management
2. **SQLite for Development**: Portable, file-based database for easy setup
3. **PostgreSQL Ready**: Schema designed for production PostgreSQL deployment
4. **Hungarian-First**: All UI, documentation, and error messages in Hungarian
5. **Modular Design**: Core modules (CRM, DMS, Logistics) with scaffolding for future expansion

## Important Notes
- The .env file MUST use `override: true` in dotenv.config() to avoid conflicts with Replit's system environment variables
- Database file location: `apps/server/prisma/dev.db`
- All Prisma commands should be run from the workspace root using the npm scripts
- Frontend must run on port 5000 (Replit requirement for web preview)
