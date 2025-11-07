# Mbit ERP System

## Overview
Mbit ERP is a comprehensive, modular enterprise resource planning system developed for **MB-IT Kft.** It features a desktop application (Electron) and a Browser PWA, with full Hungarian localization for both UI and documentation. The system currently includes core modules for CRM, DMS (with OCR capabilities), and Logistics, with a scalable architecture designed for future expansion into HR, BI, Manufacturing, E-commerce, and Marketing. A key focus is on-premise deployment capability and adherence to GDPR and other compliance standards relevant to the Hungarian market.

## User Preferences
- Language: Hungarian (Magyar)
- Company: MB-IT Kft.
- Focus: Enterprise ERP with compliance readiness

## System Architecture
The project utilizes a monorepo structure managed by Turborepo, encompassing a React 18 frontend (Vite, TypeScript, TailwindCSS, React Router) and a NestJS backend (TypeScript). Development uses SQLite for ease of setup, while production is geared towards PostgreSQL, with Prisma as the ORM.

**Key Architectural Decisions & Features:**
- **Monorepo Structure**: Facilitates efficient builds and dependency management across `web`, `server`, and `shared` packages.
- **Hungarian-First Design**: All UI, documentation, and internal messages are localized in Hungarian.
- **Modular Design**: Core modules like CRM, DMS, and Logistics are implemented with a scaffold for future expansion.
- **Role-Based Access Control (RBAC)**: A robust, granular RBAC system protects all endpoints using `@Permissions()` decorators and `RbacGuard`.
- **System Settings Service**: Centralized management for organizational info, numbering patterns, backup schedules, and feature toggles.
- **Storage Service**: Configurable data directory for managing uploads, files, backups, and logs with safe path handling.
- **Audit Service**: Comprehensive logging for create, update, and delete operations, with export capabilities.
- **Backup/Restore Service**: Supports scheduled backups with retention policies and manual triggers, including both database and file backups.
- **Health Check & Diagnostics**: Endpoints for detailed system health, backup statistics, and log downloads.
- **UI/UX**: Frontend pages for Documents, Warehouses, Opportunities, Quotes, and System Settings, all with Hungarian UI, summary cards, data tables, and filtering capabilities.
- **Deployment**: Configured for concurrent execution of both frontend (port 5000) and backend (port 3000) for seamless Replit deployment.

## Recent Changes (November 7, 2025)
**Sprint 4 - Production-Ready CRUD & OCR Implementation:**
- ✅ **CRM Module Complete**: Account, Campaign, Ticket controllers with full CRUD, RBAC guards, audit logging, auto-generated identifiers
- ✅ **File Upload System**: Multer middleware (50MB max), mimetype validation, path traversal protection via filename sanitization
- ✅ **Document Upload**: Real file handling with StorageService integration, security hardening
- ✅ **OCR Service**: Tesseract.js implementation with Hungarian language support, async processing, results persisted to Document.tartalom field
- ✅ **Frontend CRUD Modals**: Reusable Modal & FileUpload components, 4 production-ready modals (Documents, Accounts, Campaigns, Tickets) with RBAC error handling (401/403/400/500)
- ✅ **Database Schema**: Document.tartalom field added, CAMPAIGN/TICKET permissions added to enum, schema pushed to SQLite dev database
- ✅ **Security Fixes**: Path traversal vulnerability resolved, RBAC guards on all CRM endpoints, proper error handling in frontend
- ✅ **Health Endpoint**: Fixed to match frontend interface expectations (Settings/Rendszer section loads correctly)

## External Dependencies
- **React 18**: Frontend library.
- **Vite**: Frontend build tool.
- **TypeScript**: Programming language for both frontend and backend.
- **TailwindCSS**: CSS framework.
- **React Router**: Frontend routing.
- **NestJS**: Backend framework.
- **SQLite**: Development database.
- **PostgreSQL**: Production-capable database.
- **Prisma**: ORM for database interaction.
- **Turborepo**: Monorepo management tool.
- **Node-cron**: For scheduling tasks (e.g., backups).
- **Archiver library**: For ZIP compression during backups.
- **dotenv**: For environment variable management.