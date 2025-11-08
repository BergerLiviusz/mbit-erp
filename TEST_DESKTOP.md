# Testing Electron Desktop App Locally

You can test the packaged Electron app locally without running CI! This is much faster.

## Quick Test (Recommended)

```bash
# From project root
npm run test:desktop
```

This will:
1. Build all components (electron, backend, frontend)
2. Create the packaged directory structure (like CI does)
3. Output location: `apps/desktop/dist/`

Then run the app:
- **macOS**: `open apps/desktop/dist/mac-*/Mbit\ ERP.app`
- **Windows**: `apps/desktop/dist/win-unpacked/Mbit\ ERP.exe`
- **Linux**: `apps/desktop/dist/linux-unpacked/mbit-erp`

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
