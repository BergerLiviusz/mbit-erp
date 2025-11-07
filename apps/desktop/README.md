# Mbit ERP Desktop Application

Electron desktop wrapper for the Mbit ERP system, providing a fully on-premise capable enterprise application for MB-IT Kft.

## Features

- **100% On-Premise**: All data stored locally, no external dependencies
- **Cross-Platform**: Windows, macOS, and Linux support
- **Embedded Backend**: NestJS server runs inside the app
- **Local Database**: SQLite database in user data directory
- **OCR Processing**: Local Tesseract.js for document scanning
- **Complete ERP**: CRM, DMS, and Logistics modules included

## Architecture

```
Electron App
├── Main Process (Node.js)
│   ├── Backend Server (NestJS - embedded)
│   ├── Database (SQLite)
│   └── File Storage (local filesystem)
└── Renderer Process (Chromium)
    └── Frontend (React + Vite)
```

## User Data Location

### Windows
```
C:\Users\{username}\AppData\Roaming\Mbit-ERP\
├── data/
│   ├── mbit-erp.db         # SQLite database
│   ├── uploads/            # Document uploads
│   ├── backups/            # System backups
│   └── logs/               # Application logs
```

### macOS
```
~/Library/Application Support/Mbit-ERP/
├── data/
│   ├── mbit-erp.db
│   ├── uploads/
│   ├── backups/
│   └── logs/
```

### Linux
```
~/.config/Mbit-ERP/
├── data/
│   ├── mbit-erp.db
│   ├── uploads/
│   ├── backups/
│   └── logs/
```

## Development

### Prerequisites

- Node.js 20+
- npm 10+

### Setup

```bash
# Install all dependencies
npm install

# Build the desktop app
cd apps/desktop
npm run build
```

### Run in Development Mode

```bash
# Terminal 1: Start backend server
cd apps/server
npm run start:dev

# Terminal 2: Start frontend
cd apps/web
npm run dev

# Terminal 3: Start Electron
cd apps/desktop
npm run dev
```

## Building Installers

### Windows Installer

```bash
cd apps/desktop
npm run package:win
```

**Output:**
- `release/Mbit-ERP-Setup-{version}.exe` - NSIS installer
- `release/Mbit-ERP-{version}.exe` - Portable version

### macOS Installer

```bash
cd apps/desktop
npm run package:mac
```

**Output:**
- `release/Mbit-ERP-{version}-x64.dmg` - Intel Mac
- `release/Mbit-ERP-{version}-arm64.dmg` - Apple Silicon

### Linux Packages

```bash
cd apps/desktop
npm run package:linux
```

**Output:**
- `release/Mbit-ERP-{version}-x64.AppImage` - AppImage
- `release/Mbit-ERP-{version}_amd64.deb` - Debian package

### Build All Platforms

```bash
cd apps/desktop
npm run package:all
```

## Configuration

### Environment Variables

The desktop app uses these environment variables (set automatically):

- `PORT` - Backend server port (default: 3000)
- `DATA_DIR` - User data directory path
- `DATABASE_URL` - SQLite database file path
- `NODE_ENV` - Environment (development/production)
- `JWT_SECRET` - JWT secret for authentication

### Custom Configuration

Create `.env` file in user data directory for custom settings:

```env
# Custom JWT secret
JWT_SECRET=your-secret-key-here

# Custom backend port (if 3000 is taken)
PORT=3001
```

## Code Signing (Optional)

For production releases, code signing prevents "Unknown Developer" warnings:

### Windows (Authenticode)

1. Obtain code signing certificate
2. Set environment variables:
   ```
   CSC_LINK=path/to/certificate.pfx
   CSC_KEY_PASSWORD=certificate-password
   ```
3. Build: `npm run package:win`

### macOS (Apple Developer)

1. Join Apple Developer Program
2. Obtain Developer ID certificate
3. Set environment variables:
   ```
   CSC_LINK=path/to/certificate.p12
   CSC_KEY_PASSWORD=certificate-password
   APPLE_ID=your-apple-id@email.com
   APPLE_ID_PASSWORD=app-specific-password
   ```
4. Build: `npm run package:mac`

## CI/CD (GitHub Actions)

The project includes automated builds via GitHub Actions:

1. Push to `main` branch or create a tag (`v1.0.0`)
2. GitHub Actions builds Windows and macOS installers
3. Artifacts available in Actions tab
4. Tagged releases create GitHub Releases automatically

### Manual Trigger

Go to Actions → Build Desktop App → Run workflow

## Distribution

### Internal Distribution

1. Build installers: `npm run package:all`
2. Upload to internal file server
3. Share download links with users

### GitHub Releases

1. Create git tag: `git tag v1.0.0`
2. Push tag: `git push origin v1.0.0`
3. GitHub Actions creates release automatically
4. Download installers from Releases page

## Troubleshooting

### Backend doesn't start

- Check logs in user data directory
- Ensure port 3000 is available
- Verify SQLite database is accessible

### App won't launch

- Check antivirus/firewall settings
- Run as administrator (Windows)
- Check security settings (macOS)

### Database errors

- Delete database file to reset
- Check file permissions
- Verify disk space

## Security

- All data stored locally
- No internet connection required
- JWT authentication for API
- RBAC (Role-Based Access Control)
- Audit logging enabled

## Support

For issues and questions:
- GitHub Issues: Create issue in repository
- Documentation: `/docs` folder
- Contact: MB-IT Kft.

## License

Proprietary - MB-IT Kft.
