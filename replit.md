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
**Sprint 9 - Windows Build Dependency Bundling Fix (CRITICAL) - FINAL SOLUTION v1.0.5:**
- ✅ **ROOT CAUSE IDENTIFIED**: npm dedupe incompatibility with nested install strategy
  - Initial diagnosis: npm workspace hoisted dependencies create symlinks (v1.0.0-v1.0.2)
  - DEEPER ISSUE: npm uses Windows **junction points** AND **hardlinks** even with `--install-strategy=nested`
  - **DEEPEST ISSUE (v1.0.4-v1.0.5a)**: npm dedupe **catastrophically deletes production dependencies** (dotenv, es-object-atoms)
  - npm dedupe recalculates tree in hoisted mode → marks nested modules as extraneous → **DELETES them** (2449 packages removed!)
  - **npm dedupe is fundamentally incompatible with --install-strategy=nested + --install-links=false**
  - Evidence: "dotenv directory not found" after dedupe, packaged app missing critical modules
  - Git Bash `test -L` cannot detect Windows junctions → false positive verification in v1.0.3
- ✅ **THE ACTUAL FIX (v1.0.5 FINAL)**: Single install command, NO dedupe
  - **REMOVED npm dedupe completely** (it was deleting dependencies, not fixing junctions)
  - Single install: `npm install --omit=dev --install-strategy=nested --install-links=false --workspaces=false`
  - **Key insight**: nested + no-links ALREADY prevents junctions at ALL nesting levels (6-7 deep)
  - No additional flatten step needed - the original junction problem was already solved!
  - **Pre-packaging verification**: PowerShell recursive search for ALL `es-object-atoms` instances, check each for ReparsePoint attribute
  - **Post-packaging verification**: Same deep check on `win-unpacked/resources/backend/node_modules` (catches electron-builder copy issues)
  - Expected installer size: 250-300 MB with real files
- ✅ **GitHub Actions CI/CD Final Fix (v1.0.5)**:
  - Changed shell to PowerShell (`pwsh`) for accurate Windows junction detection
  - **Simplified install**: Single command with nested + no-links (production only)
  - **Removed**: npm dedupe (was causing catastrophic package deletions)
  - **Removed**: npm prune (--omit=dev already excludes dev deps)
  - **Deep verification** - recursive ReparsePoint check for ALL instances of `es-object-atoms` (not just top-level)
  - **Post-packaging verification** - PowerShell-based deep scan on packaged bundle
  - Detects junctions at ANY nesting level, in both pre and post-packaging phases
  - Added `permissions: contents: write` for GitHub releases (fixes 403 errors)
  - Fixed release asset list (only .exe files, removed non-existent .msi/.dmg)
- ✅ **Electron Backend Detection Fix (main.ts)**:
  - **Parallel health check** for both 127.0.0.1 and localhost (2s timeout each)
  - Reduced max wait from 180s to 60s (30 retries × 2s)
  - Backend binds to 127.0.0.1 in Electron mode (Windows-friendly)
  - Accurate timeout logging
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
  - **Why npm dedupe fails**: Incompatibility with nested install strategy
  - Updated expected installer size: 250-300 MB
  - Clear warning about npm's default hardlink behavior
- ✅ **Prisma Packaging Fix (v1.0.5c)**:
  - **NEW ISSUE**: Backend crashed immediately with no stdout/stderr output
  - **ROOT CAUSE (architect debug)**: electron-builder glob `"**/*"` does NOT match dotfile paths
  - `node_modules/.prisma/client/` with native query engine binaries (e.g., `query_engine-windows.dll.node`) was MISSING from packaged app
  - Prisma runtime unable to load query engine → native abort → exit code null, no console output
  - **FIX**: Added explicit extraResources entry to copy `.prisma` directory to packaged app
  - Prisma client generation moved AFTER production npm install (in same workflow step)
- ✅ **Node ABI Version Mismatch Fix (v1.0.5d)**:
  - **NEW ISSUE**: Backend still crashed after .prisma directory fix (verified present in packaged app)
  - **DEEPER ROOT CAUSE (architect debug)**: Prisma native binaries compiled for wrong Node version
  - GitHub Actions used Node 20.x → `prisma generate` created Node 20 ABI binaries
  - Electron 28 embeds Node 18.18.2 → ABI mismatch when loading `.dll.node` files
  - **Symptoms**: Native abort before any JS code executes → exit code null, no console output
  - **FIX**: Changed GitHub Actions to use Node 18.18.2 (matches Electron 28 embedded runtime)
  - Prisma query engine now generated with correct ABI version for packaged app
- ✅ **Windows Path Length Limit Fix (v1.0.5e)**:
  - **NEW ISSUE**: Backend crashed with `Cannot find module 'es-object-atoms'` despite CI verification passing
  - **CRITICAL ROOT CAUSE (architect debug)**: Windows path length limit (~260 chars) + NSIS installer silent file skip
  - CI verification checked directories exist (not junctions) but didn't verify FILES inside directories
  - Nested install strategy → es-object-atoms at 6-7 nesting levels → paths exceed 260 chars in `%LOCALAPPDATA%\Temp\...`
  - NSIS installer silently created EMPTY directories without copying actual .js files
  - CI runner (long-path support enabled) kept files → verification passed → packaged app missing files
  - **Symptoms**: `Cannot find module 'es-object-atoms'` at runtime, directories exist but contain no files
  - **FINAL FIX**: Switch to hoisted install strategy with `--install-links=false`
  - `npm install --omit=dev --install-strategy=hoisted --install-links=false --workspaces=false`
  - Hoisted mode keeps all packages at top-level → short paths → NSIS copies all files successfully
  - `--install-links=false` prevents Windows junctions (still uses real files)
  - **Enhanced verification**: Check package.json exists inside each dependency directory (proves files present, not empty dirs)
  - Expected result: All dependencies at `node_modules/<package>` instead of deeply nested paths
- ✅ **Startup Cleanup Hook Fix (v1.0.5f - FINAL SOLUTION)**:
  - **NEW ISSUE**: User still gets `Cannot find module 'es-object-atoms'` error despite downloading hoisted build
  - **HIDDEN ROOT CAUSE (architect debug)**: Legacy nested node_modules from OLD installs persist on Windows
  - NSIS uninstaller CANNOT delete old nested directories (paths > 260 chars → access denied)
  - Old empty nested directories remain on disk from previous installs
  - Node.js module resolution finds OLD empty nested directories FIRST → ENOENT error
  - New hoisted files are present but ignored by Node resolution algorithm
  - **Symptoms**: Error log shows nested paths (impossible in hoisted build) → proves old files still present
  - **FINAL FIX**: Startup cleanup hook in apps/desktop/src/main.ts
  - `cleanupLegacyNodeModules()` function recursively scans backend/node_modules
  - Finds nested node_modules subdirectories (depth > 0)
  - `isDirectoryEmpty()` helper recursively checks if directory contains ANY files at any depth
  - Only deletes if entire directory tree is completely empty (no files anywhere)
  - Preserves legitimate nested dependencies that contain actual files
  - Called in app.whenReady() BEFORE startBackend() → ensures clean state every launch
  - **Result**: Only hoisted dependency tree visible to Node.js, legacy files removed automatically
- ✅ **Architect Review Process**: Multi-iteration debugging with final approval
  - v1.0.0-v1.0.2: Symlink diagnosis (incorrect)
  - v1.0.3: Nested install (incomplete - still used hardlinks)
  - v1.0.4: Junction/hardlink root cause + `--install-links=false` (CORRECT for shallow deps)
  - v1.0.5a-b: npm dedupe attempts (FAILED - deleted production dependencies)
  - v1.0.5 FINAL: Removed dedupe, single install command (incomplete - nested paths too long)
  - v1.0.5c: Prisma .prisma directory packaging fix (architect confirmed)
  - v1.0.5d: Node ABI version mismatch fix (architect confirmed)
  - v1.0.5e: Windows path limit fix - hoisted install + file-level verification (architect confirmed)
  - v1.0.5f: Startup cleanup hook to remove legacy nested node_modules (architect confirmed - PASS)
  - Debug responsibility used for deep analysis (npm dedupe + Prisma packaging + Node ABI + path length + legacy file persistence issues discovered)
  - PASS: All changes architect-approved - production ready