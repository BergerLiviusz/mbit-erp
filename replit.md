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

### ✅ Sprint 1 Complete - Enterprise Foundation (Latest)
**Status**: Production-ready backend infrastructure with Hungarian UI

**Backend Infrastructure Implemented**:
1. **RBAC System** (`apps/server/src/common/rbac/`)
   - 59 granular permissions across all modules (CRM, DMS, Logistics, System, Users, Roles, Reports)
   - Permission enum with Hungarian descriptions
   - `@Permissions()` decorator for endpoint protection
   - `RbacGuard` for role-based access control
   - Permission and RolePermission Prisma models

2. **Storage Service** (`apps/server/src/common/storage/`)
   - Configurable data directory via `MBIT_DATA_DIR` environment variable
   - Defaults to `~/mbit-data/`
   - Auto-creates subdirectories: uploads, files, backups, logs, exports, temp, ocr
   - Safe path handling with sanitization

3. **Enhanced Audit Service** (`apps/server/src/common/audit/`)
   - Helper methods: `logCreate()`, `logUpdate()`, `logDelete()`
   - Export audit logs by date range, entity type, or user
   - Activity timeline for entities

4. **Backup/Restore Service** (`apps/server/src/common/backup/`)
   - ZIP compression with archiver library
   - Scheduled backups via node-cron (daily/weekly)
   - Retention policy (keeps last N backups)
   - Backup manifest with metadata
   - Database + files backup

5. **System Settings Service** (`apps/server/src/system/`)
   - Organization info (name, address, tax number, email, phone)
   - Numbering patterns (quotes, orders, documents)
   - Backup schedules and retention
   - Quote approval thresholds
   - LAN cooperation toggle
   - **Fixed**: Metadata preservation on updates (category, type, description)

6. **Health Check & Diagnostics** (`apps/server/src/health/`, `apps/server/src/system/diagnostics.controller.ts`)
   - `/health/detailed` - System health with database and storage status
   - `/system/diagnostics/stats` - Backup statistics
   - `/system/diagnostics/backup/now` - Manual backup trigger
   - `/system/diagnostics/logs/download` - Download diagnostics ZIP

**Frontend Additions**:
- Settings page (`apps/web/src/pages/Settings.tsx`) with Hungarian UI
- Three tabs: Szervezet (Organization), Biztonsági mentések (Backups), Rendszer (System)
- Live health monitoring
- Settings management with category-based views
- One-click manual backups

**Database Updates**:
- New models: `Permission`, `RolePermission`, `SystemSetting`
- Enhanced `Audit` model with export capabilities
- `BackupJob` model with manifest and encryption flags
- Seeded 59 permissions with Hungarian descriptions
- Seeded 15 default system settings
- Admin role linked to all relevant permissions

**API Endpoints Added**:
```
GET    /system/settings                    # All settings
GET    /system/settings/category/:category # By category
GET    /system/settings/:key               # Single setting
POST   /system/settings                    # Create setting
PUT    /system/settings/:key               # Update setting (preserves metadata)
POST   /system/settings/bulk               # Bulk update
DELETE /system/settings/:key               # Delete setting
POST   /system/settings/initialize         # Load defaults
GET    /health/detailed                    # Detailed health check
GET    /system/diagnostics/stats           # Backup statistics
POST   /system/diagnostics/backup/now      # Manual backup
GET    /system/diagnostics/backup/list     # List backups
GET    /system/diagnostics/logs/download   # Download logs
```

**Key Files**:
- `apps/server/src/common/rbac/permission.enum.ts` - 59 permissions
- `apps/server/src/common/storage/storage.service.ts` - Data directory management
- `apps/server/src/common/backup/backup.service.ts` - Backup/restore logic
- `apps/server/src/system/settings.service.ts` - System settings with metadata preservation
- `apps/web/src/pages/Settings.tsx` - Hungarian Settings UI

### Deployment Configuration
**Problem**: Deployment was failing with health check errors because the run command was starting the backend (port 3000) instead of the frontend (port 5000).

**Solution Implemented**:
1. Added production `start` script to root package.json that runs both services concurrently using npm workspaces
2. Configured deployment build command to install dependencies, generate Prisma client, and build both apps
3. Configured deployment run command to execute the new start script

**Key Configuration**:
```json
// package.json
"start": "npm run start:prod --workspace=@mbit-erp/server & npm run preview --workspace=@mbit-erp/web"
```

**Deployment Commands**:
- Build: `npm install && DATABASE_URL='file:/home/runner/workspace/apps/server/prisma/dev.db' npm run db:generate && npm run build`
- Run: `npm run start` (starts both backend on port 3000 and frontend on port 5000)

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
