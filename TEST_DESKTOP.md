# Testing Electron Desktop App Locally

You can test the packaged Electron app locally without running CI! This is much faster.

## Quick Test (Recommended)

```bash
# From project root
npm run test:desktop
```

This will:
1. Build all components (electron, backend, frontend)
2. Generate Prisma client (needed for database)
3. Create the packaged directory structure (like CI does)
4. **Automatically launch the app** (macOS only)
5. Output location: `apps/desktop/release/`

**Manual launch** (if auto-launch doesn't work):
- **macOS**: `open apps/desktop/release/mac-arm64/Mbit\ ERP.app`
- **Windows**: `apps/desktop/release/win-unpacked/Mbit\ ERP.exe`
- **Linux**: `apps/desktop/release/linux-unpacked/mbit-erp`

Or just **double-click the `.app` file** in Finder (macOS).

## Alternative: Use the shell script

```bash
./test-desktop-local.sh
```

## Check Logs

If something doesn't work, check the logs:

- **macOS**: `~/Library/Application Support/Mbit-ERP/logs/app.log`
- **Windows**: `%APPDATA%\Mbit-ERP\logs\app.log`
- **Linux**: `~/.config/Mbit-ERP/logs/app.log`

## What This Tests

✅ Backend startup in packaged mode
✅ Database initialization (schema creation)
✅ CORS configuration for Electron
✅ Frontend loading from file:// protocol
✅ All the fixes we made for Windows CI

## Development Mode (Different)

If you want to test in development mode (with hot reload):

```bash
# Terminal 1: Backend
npm run server

# Terminal 2: Frontend  
npm run web

# Terminal 3: Electron
cd apps/desktop && npm run dev
```

This uses `localhost:5000` and is faster for development, but doesn't test the packaged behavior.
