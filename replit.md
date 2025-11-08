# Mbit ERP System

## Overview
Mbit ERP is a comprehensive, modular enterprise resource planning system developed for **MB-IT Kft.** It aims to provide a desktop application (Electron) and a Browser PWA, with full Hungarian localization for both UI and documentation. The system currently includes core modules for CRM, DMS (with OCR capabilities), and Logistics, with a scalable architecture designed for future expansion into HR, BI, Manufacturing, E-commerce, and Marketing. A key focus is on-premise deployment capability and adherence to GDPR and other compliance standards relevant to the Hungarian market.

## User Preferences
- Language: Hungarian (Magyar)
- Company: MB-IT Kft.
- Focus: Enterprise ERP with compliance readiness

## System Architecture
The project utilizes a monorepo structure managed by Turborepo, encompassing a React 18 frontend (Vite, TypeScript, TailwindCSS, React Router) and a NestJS backend (TypeScript). Development uses SQLite, while production is geared towards PostgreSQL, with Prisma as the ORM.

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
- **Electron Desktop Application**: Features an embedded NestJS backend, local SQLite database, and multi-platform installers (Windows, macOS, Linux AppImage).
- **UI/UX**: Frontend pages for Documents, Warehouses, Opportunities, Quotes, and System Settings, all with Hungarian UI, summary cards, data tables, and filtering capabilities. Includes comprehensive modal suites for CRUD operations and an inline document category creation feature.
- **OCR Functionality**: Integration of Tesseract.js for document content extraction with Hungarian language support.
- **Deployment**: Configured for concurrent execution of both frontend (port 5000) and backend (port 3000) for seamless Replit deployment. GitHub Actions CI/CD pipeline implemented for automated multi-platform desktop application builds with code signing and notarization.

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
- **Tesseract.js**: For OCR functionality.

## Recent Changes (November 8, 2025)
**Sprint 9 - Windows Build Dependency Bundling Fix (CRITICAL) - FINAL SOLUTION:**
- ✅ **ROOT CAUSE IDENTIFIED**: Windows junction points/hardlinks in npm dependencies
  - Initial diagnosis: npm workspace hoisted dependencies create symlinks (v1.0.0-v1.0.2)
  - DEEPER ISSUE: npm uses Windows **junction points** AND **hardlinks** even with `--install-strategy=nested`
  - electron-builder copies junctions/hardlinks AS-IS → broken references in packaged app
  - Evidence: Installer 83-152 MB (vs. expected 250-300 MB), "Cannot find module 'dotenv'/'es-object-atoms'" errors
  - Git Bash `test -L` cannot detect Windows junctions → false positive verification in v1.0.3
- ✅ **THE REAL FIX (v1.0.4+)**: `--install-links=false` flag
  - Forces npm to copy ACTUAL FILES instead of creating junctions/hardlinks
  - PowerShell verification using `(Get-Item).Attributes -match 'ReparsePoint'` to detect junctions
  - Verifies both shallow (dotenv) and deep (es-object-atoms) dependencies
  - Expected installer size: 250-300 MB with real files
- ✅ **GitHub Actions CI/CD Complete Fix**:
  - Changed shell to PowerShell (`pwsh`) for accurate Windows junction detection
  - Install command: `npm install --omit=dev --install-strategy=nested --install-links=false --workspaces=false`
  - ReparsePoint attribute verification (PowerShell can detect junctions, bash cannot)
  - File size calculation to confirm ~100-150 MB node_modules (not hollow junction tree)
  - Added `permissions: contents: write` for GitHub releases (fixes 403 errors)
  - Fixed release asset list (only .exe files, removed non-existent .msi/.dmg)
- ✅ **Alternative Distribution Strategies (DISTRIBUTION_ALTERNATIVES.md)**:
  - ZIP Distribution (RECOMMENDED): Local build + win-unpacked folder distribution
  - Repo Distribution + Starter Script (NOT recommended - requires Node.js on every machine)
  - Configurable Storage Paths UI implementation guide
  - Comparison table with operational trade-offs
  - Step-by-step PowerShell verification for local builds
- ✅ **Documentation Updates (BUILD_DESKTOP.md)**:
  - Detailed junction/hardlink explanation with visual examples
  - PowerShell verification scripts with ReparsePoint checks
  - Why Git Bash verification failed (cannot detect Windows junctions)
  - Updated expected installer size: 250-300 MB
  - Clear warning about npm's default hardlink behavior
- ✅ **Architect Review Process**: Multi-iteration debugging with final approval
  - v1.0.0-v1.0.2: Symlink diagnosis (incorrect)
  - v1.0.3: Nested install (incomplete - still used hardlinks)
  - v1.0.4: Junction/hardlink root cause + `--install-links=false` (CORRECT)
  - Debug responsibility used for deep analysis
  - PASS: All changes architect-approved - production ready