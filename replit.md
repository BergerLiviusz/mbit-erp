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
**Sprint 8 - GitHub Actions CI/CD & Production-Ready Build Pipeline:**
- ✅ **GitHub Actions CI/CD Implementáció**: Teljes automatizált build pipeline Windows + macOS installer-ekhez
  - Multi-OS build matrix (windows-latest, macos-latest) - Linux kihagyva (DEB build issue miatt)
  - Platform-specifikus code signing támogatás explicit platform check-kel
  - Conditional expression fix: Windows csak WINDOWS_CSC_LINK-et használ, macOS csak MACOS_CSC_LINK-et
  - Notarization support macOS-hez (APPLE_ID, APPLE_ID_PASSWORD, APPLE_TEAM_ID)
  - Automatic artifact upload (30 napos megőrzéssel)
  - GitHub Releases integration git tag push-ra
  - Prisma client generation minden build előtt
- ✅ **Code Signing Dokumentáció**: GITHUB_ACTIONS_SETUP.md teljes útmutató
  - README.md placeholder frissítési instrukciók
  - GitHub Secrets beállítási útmutató (Windows/macOS certificate-ek)
  - Base64 certificate encoding példák
  - Platform-specifikus secret táblázatok "Használat a workflow-ban" oszloppal
  - Build triggerek dokumentálása (tag push, branch push, PR, manual)
  - Troubleshooting section gyakori hibákra
  - Production release checklist 11 ponttal
  - Build időtartamok (~20-25 perc párhuzamos build-eléssel)
- ✅ **.gitignore Biztonsági Frissítések**: Érzékeny fájlok és build artifact-ok kizárása
  - Code signing certificate-ek: *.p12, *.pfx, *.cer, *.crt, *.key, *.pem
  - Generált icon-ok: apps/desktop/resources/*.ico, *.icns (+ legacy fallback)
  - Build artifact-ok: *.msi, *.dmg, *.exe, *.deb, *.rpm, *.AppImage
- ✅ **README.md Frissítések**: CI/CD státusz és linkek
  - GitHub Actions badge hozzáadva (ORG_NAME/REPO_NAME placeholder-rel)
  - GITHUB_ACTIONS_SETUP.md dokumentáció link
  - GitHub Releases letöltési link
- ✅ **Architect Review Process**: 3 iterációs review és javítási ciklus
  - 1. FAIL: Code signing env változók hiányoztak
  - 2. FAIL: macOS secret-ek nem kerültek injektálásra
  - 3. FAIL: Conditional expression logikai hiba (Windows build macOS cert-et kapott volna)
  - 4. PASS: Explicit platform check-kel minden scenario helyes (architect-approved)
**Sprint 8 - Electron Desktop Application & Build Fix:**
- ✅ **Replit Build Probléma Debug & Megoldás**: TypeScript incremental compilation cache (.tsbuildinfo fájlok) blokkolta a dist mappák generálását
  - Root cause: .tsbuildinfo cache fájlok megakadályozták az output generálást
  - Megoldás: Automatikus cache törlés build előtt (`prebuild` script módosítva)
  - Build script javítások: tsbuildinfo törlés backend/frontend build előtt
  - Prisma path javítás: ../../node_modules helyett monorepo hoisted paths
  - Package.json metadata kiegészítés: homepage, author email, Linux maintainer
  - Linux AppImage SIKERES build (119 MB) - teljes működőképes installer
  - DEB package sikertelen (Replit környezeti limitáció - FPM segfault)
  - Windows/macOS build ajánlás: GitHub Actions CI/CD használata
- ✅ **Electron Desktop App Implementation**: Complete desktop application setup
  - Electron main process with embedded NestJS backend
  - Preload script for secure IPC communication
  - Windows installer (NSIS + Portable)
  - macOS installer (DMG for Intel + Apple Silicon)
  - Linux support (AppImage + DEB)
  - 100% on-premise capable - all data stored locally
  - SQLite database in user data directory
  - Embedded backend server (port 3000)
  - Auto-generated app icons from Mbit logo
- ✅ **Build Configuration**: electron-builder setup for multi-platform builds
  - TypeScript compilation for Electron main process
  - Backend bundling into resources
  - Frontend build with Electron-specific base path
  - Cross-platform build scripts (Windows/Mac/Linux)
  - electron-builder configuration with proper file inclusion
- ✅ **Critical Production Fixes**: Architect-reviewed stability improvements
  - Backend Readiness Probe: Dynamic health check (30s timeout) instead of fixed 5s delay
  - Error Handling: Magyar dialog box with error details on backend startup failure
  - Graceful Shutdown: SIGTERM→SIGKILL fallback, proper process cleanup
  - Logging: Progresszív health check logging (every 5 attempts)
  - Endpoint Fix: Corrected health check path from `/api/health` to `/health`
  - Resource Management: No memory leaks, bounded timeouts, socket cleanup
- ✅ **Documentation**: Comprehensive build and usage guides
  - BUILD_DESKTOP.md - Complete build instructions + architecture section
  - apps/desktop/README.md - Architecture and configuration
  - GITHUB_ACTIONS_SETUP.md - CI/CD setup és troubleshooting
  - Updated main README.md with desktop app info + GitHub Actions badge
  - Icon conversion instructions
  - Code signing guidance

## Recent Changes (November 7, 2025)
**Sprint 7 - UX Improvements & Organization Management:**
- ✅ **Logo Update**: Replaced header logo with official mbitvector.svg from attached_assets, properly aligned and sized (h-10 w-auto)
- ✅ **Organization Data Management**: Complete implementation in Beállítások > Szervezet tab
  - Added 2 new organization fields: Cégjegyzékszám (registration_number), Weboldal (website)
  - Implemented grid-based form layout with 7 editable fields (név, cím, adószám, email, telefon, cégjegyzékszám, weboldal)
  - Auto-initialization of defaults when page loads via `/system/settings/initialize` endpoint
  - Batch save functionality with Promise.all and proper response validation
  - Comprehensive error handling (401/403/general errors) with user feedback
  - Success/error messages with automatic clearing
- ✅ **Navigation Reorganization**: Created dropdown menu structure for cleaner navigation
  - "Ügyfélkezelés" dropdown: Partnerek, Lehetőségek, Árajánlatok
  - "Logisztika" dropdown: Raktárak, Termékek
  - Hover-based dropdown with proper z-index and styling
  - Maintains direct links for Főoldal, Dokumentumok, Beállítások
- ✅ **Document Category Management**: Added inline category creation in document modal
  - "+ Új kategória" button next to category dropdown
  - Mini-modal for creating categories with Enter key support
  - Auto-selection of newly created category
  - Proper RBAC error handling (401/403/400)
  - Instant category list refresh after creation

**Sprint 6 - Product Management & Security Hardening:**
- ✅ **Header Redesign**: Removed "Mbit ERP" text from navigation header, keeping only logo SVG (h-10 w-auto sizing)
- ✅ **Product Management System**: Complete CRUD implementation for product catalog
  - Added PRODUCT_VIEW/CREATE/EDIT/DELETE permissions to RBAC enum with Hungarian descriptions
  - ItemController protected with @UseGuards(RbacGuard) and @Permissions decorators
  - New `/products` frontend route with full CRUD modals (név, leírás, egységár, egység, raktár fields)
  - Products navigation added between "Raktárak" and "Beállítások"
  - Admin role granted all 4 new product permissions (87 total permissions)
- ✅ **Quotes Integration**: Updated Quotes modal to fetch real products from `/api/logistics/items` instead of mock data, auto-populating egységár when product selected
- ✅ **Critical Security Fixes**: 
  - Fixed unauthenticated privilege-escalation vulnerability in DiagnosticsController
  - Removed @Public() decorators from permission diagnostic endpoints
  - Added @UseGuards(RbacGuard) to DiagnosticsController
  - Imported RbacModule in SystemModule to enable guard instantiation
  - All diagnostic endpoints now protected by @Permissions(Permission.SYSTEM_DIAGNOSTICS)
- ✅ **Permission Diagnostics**: Created diagnostic endpoints for admin permission verification (secured with RBAC)

**Sprint 5 - Complete Modal Suite & OCR Integration:**
- ✅ **API Proxy Migration**: All frontend pages now use `/api` relative paths (Documents, CRM, Opportunities, Quotes, Settings, Warehouses), eliminating CORS issues
- ✅ **Opportunities Modal**: Full CRUD with név, accountId, szakasz, érték, valószínűség, zárás dátum fields; account dropdown; validation; RBAC error handling
- ✅ **Quotes Modal**: Complex implementation with dynamic line items (itemId, mennyiség, egységár, kedvezmény), account/opportunity linking, auto-calculations, validation
- ✅ **Warehouses Modal**: CRUD modal with azonosító, név, cím structure (irányítószám/település/utca), aktív toggle, matching backend API limitations
- ✅ **OCR Functionality**: Backend endpoint POST `/dms/documents/:id/ocr`, frontend trigger button with expandable result panel, functional setState to prevent race conditions, user-visible error feedback (401/403/general)
- ✅ **Settings/Rendszer Fix**: Resolved infinite loading bug with separate systemLoading/healthError states, proper error handling, retry UI, tab-switch refresh via useEffect

**Sprint 4 - Production-Ready CRUD & OCR Implementation:**
- ✅ **CRM Module Complete**: Account, Campaign, Ticket controllers with full CRUD, RBAC guards, audit logging, auto-generated identifiers
- ✅ **File Upload System**: Multer middleware (50MB max), mimetype validation, path traversal protection via filename sanitization
- ✅ **Document Upload**: Real file handling with StorageService integration, security hardening
- ✅ **OCR Service**: Tesseract.js implementation with Hungarian language support, async processing, results persisted to Document.tartalom field
- ✅ **Frontend CRUD Modals**: Reusable Modal & FileUpload components, 4 production-ready modals (Documents, Accounts, Campaigns, Tickets) with RBAC error handling (401/403/400/500)
- ✅ **Database Schema**: Document.tartalom field added, CAMPAIGN/TICKET permissions added to enum, schema pushed to SQLite dev database
- ✅ **Security Fixes**: Path traversal vulnerability resolved, RBAC guards on all CRM endpoints, proper error handling in frontend

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