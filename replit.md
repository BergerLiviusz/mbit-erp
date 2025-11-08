# Mbit ERP System

## Overview
Mbit ERP is a comprehensive, modular enterprise resource planning system for MB-IT Kft. It provides a desktop application (Electron) and a Browser PWA, fully localized in Hungarian, with core modules for CRM, DMS (with OCR), and Logistics. The system is designed for scalability to include HR, BI, Manufacturing, E-commerce, and Marketing, emphasizing on-premise deployment and compliance with GDPR and Hungarian market standards.

## User Preferences
- Language: Hungarian (Magyar)
- Company: MB-IT Kft.
- Focus: Enterprise ERP with compliance readiness

## System Architecture
The project employs a monorepo managed by Turborepo, featuring a React 18 frontend (Vite, TypeScript, TailwindCSS, React Router) and a NestJS backend (TypeScript). Development uses SQLite, while production targets PostgreSQL, with Prisma as the ORM.

**Key Architectural Decisions & Features:**
- **Monorepo Structure**: Enables efficient management of `web`, `server`, and `shared` packages.
- **Hungarian-First Design**: All UI, documentation, and internal messages are localized.
- **Modular Design**: Core modules (CRM, DMS, Logistics) are implemented with an extensible scaffold.
- **Role-Based Access Control (RBAC)**: Granular security for all endpoints using `@Permissions()` decorators and `RbacGuard`.
- **System Settings Service**: Centralized management for organizational data, numbering, backups, and feature toggles.
- **Storage Service**: Configurable data directory for uploads, files, backups, and logs with secure path handling.
- **Audit Service**: Comprehensive logging of CUD operations with export functionality.
- **Backup/Restore Service**: Supports scheduled and manual backups with retention policies for databases and files.
- **Health Check & Diagnostics**: Endpoints for system health, backup statistics, and log downloads.
- **Electron Desktop Application**: Features an embedded NestJS backend, local SQLite, and multi-platform installers.
- **UI/UX**: Hungarian-localized frontend pages for Documents, Warehouses, Opportunities, Quotes, and System Settings, featuring summary cards, data tables, filtering, CRUD modals, and inline category creation.
- **OCR Functionality**: Integrates Tesseract.js for document content extraction with Hungarian language support.
- **Deployment**: Configured for concurrent frontend (port 5000) and backend (port 3000) execution for Replit. GitHub Actions CI/CD automates multi-platform desktop application builds with code signing and notarization.

## External Dependencies
- **React 18**: Frontend library.
- **Vite**: Frontend build tool.
- **TypeScript**: Programming language.
- **TailwindCSS**: CSS framework.
- **React Router**: Frontend routing.
- **NestJS**: Backend framework.
- **SQLite**: Development database.
- **PostgreSQL**: Production database.
- **Prisma**: ORM.
- **Turborepo**: Monorepo management.
- **Node-cron**: Task scheduling.
- **Archiver library**: ZIP compression.
- **dotenv**: Environment variable management.
- **Tesseract.js**: OCR functionality.