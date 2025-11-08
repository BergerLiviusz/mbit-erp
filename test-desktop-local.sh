# Test Electron Desktop App Locally (Packaged Mode Simulation)
# This builds the packaged app structure without creating an installer

set -e

echo "🧪 Testing Electron Desktop App Locally"
echo "=========================================="
echo ""

# Navigate to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "apps/desktop" ]; then
  echo "❌ Error: Must run from project root directory"
  exit 1
fi

echo "📦 Step 1: Building all components..."
cd apps/desktop
npm run build

echo ""
echo "📦 Step 2: Creating packaged directory structure..."
echo "   (This simulates what CI does, but faster - no installer)"
npm run package -- --dir

echo ""
echo "✅ Build complete!"
echo ""
echo "📁 Packaged app is in: apps/desktop/release/"
echo ""
echo "🚀 To test the packaged app:"
echo ""
echo "   macOS:"
echo "   open apps/desktop/release/mac-arm64/Mbit\\ ERP.app"
echo ""
echo "   Or double-click the .app file in Finder"
echo ""
echo "📝 Logs location:"
echo "   macOS: ~/Library/Application Support/Mbit-ERP/logs/app.log"
echo "   Windows: %APPDATA%\\Mbit-ERP\\logs\\app.log"
echo "   Linux: ~/.config/Mbit-ERP/logs/app.log"
echo ""
echo "💡 Tip: Check the logs if the app doesn't start correctly"
echo ""
