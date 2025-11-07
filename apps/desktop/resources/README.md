# App Icons

## Current Icons

- `icon.png` - Base icon image (1024x1024)
- `icon.svg` - Mbit vector logo

## Required Icon Formats

For proper distribution, you need to convert the base PNG to platform-specific formats:

### Windows (.ico)
```bash
# Using online converter or ImageMagick
convert icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico
```

### macOS (.icns)
```bash
# Using iconutil (macOS only)
mkdir icon.iconset
sips -z 16 16     icon.png --out icon.iconset/icon_16x16.png
sips -z 32 32     icon.png --out icon.iconset/icon_16x16@2x.png
sips -z 32 32     icon.png --out icon.iconset/icon_32x32.png
sips -z 64 64     icon.png --out icon.iconset/icon_32x32@2x.png
sips -z 128 128   icon.png --out icon.iconset/icon_128x128.png
sips -z 256 256   icon.png --out icon.iconset/icon_128x128@2x.png
sips -z 256 256   icon.png --out icon.iconset/icon_256x256.png
sips -z 512 512   icon.png --out icon.iconset/icon_256x256@2x.png
sips -z 512 512   icon.png --out icon.iconset/icon_512x512.png
sips -z 1024 1024 icon.png --out icon.iconset/icon_512x512@2x.png
iconutil -c icns icon.iconset
rm -rf icon.iconset
```

## Temporary Solution

For now, electron-builder will automatically convert icon.png to the required formats during the build process if platform-specific icons are missing.

## Note

Replace the generated placeholder icon with your actual brand logo for production builds.
