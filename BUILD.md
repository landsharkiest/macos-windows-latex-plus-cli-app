# Building LaTeX Plus Desktop Application

This guide provides comprehensive instructions for building installable desktop applications for macOS and Windows.

## Prerequisites

### Required Software
- **Node.js** (v16 or higher)
- **npm** (v7 or higher)
- **Git** (for cloning the repository)

### Platform-Specific Requirements

#### For macOS Builds
- macOS 10.13 or higher
- Xcode Command Line Tools: `xcode-select --install`
- For code signing (optional): Apple Developer Account

#### For Windows Builds
- Windows 10 or higher
- Windows Build Tools (optional): `npm install --global windows-build-tools`
- For code signing (optional): Code signing certificate

## Setup

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/landsharkiest/macos-windows-latex-plus-cli-app.git
cd macos-windows-latex-plus-cli-app

# Install dependencies
npm install
```

### 2. Generate Application Icons

The project includes SVG logo files. Generate platform-specific icons:

```bash
# Install sharp for PNG generation
npm install --save-dev sharp

# Generate PNG files from SVG
node assets/generate-icons-sharp.js

# Install icon conversion tools
npm install --save-dev png-to-ico png2icons

# Generate Windows .ico file
npx png-to-ico assets/icons/icon-256.png > assets/icons/icon.ico

# Generate macOS .icns file (macOS only)
npx png2icons assets/icons/icon-1024.png assets/icons/icon.icns
```

**Alternative:** Use online converters if you encounter issues:
- PNG generation: https://cloudconvert.com/svg-to-png
- ICO conversion: https://convertio.co/png-ico/
- ICNS conversion: https://cloudconvert.com/png-to-icns

### 3. Test the Application

Before building, test the app in development mode:

```bash
npm start
```

The application should launch with the splash screen followed by the main window.

## Building for Distribution

### Build for Current Platform

```bash
# Build for your current platform (Windows or macOS)
npm run build
```

The installer will be created in the `dist/` folder.

### Build for macOS

**From macOS:**
```bash
npm run build:mac
```

**Output Files (in `dist/` folder):**
- `LaTeX Plus-1.0.0.dmg` - DMG installer (recommended)
- `LaTeX Plus-1.0.0.pkg` - PKG installer
- `LaTeX Plus-1.0.0-arm64.dmg` - Apple Silicon version
- `LaTeX Plus-1.0.0-x64.dmg` - Intel version

**DMG Features:**
- Drag-and-drop installation
- Custom background image
- Application shortcut
- Automatic link to Applications folder

**Installing on macOS:**
1. Double-click the `.dmg` file
2. Drag "LaTeX Plus" to the Applications folder
3. Open from Applications or Launchpad
4. On first launch, right-click and select "Open" (for unsigned builds)

### Build for Windows

**From Windows:**
```bash
npm run build:win
```

**Output Files (in `dist/` folder):**
- `LaTeX Plus Setup 1.0.0.exe` - NSIS installer (recommended)
- `LaTeX Plus-1.0.0.msi` - MSI installer
- `LaTeX Plus 1.0.0.exe` - Portable version (no installation required)

**Installer Features:**
- Custom installation directory
- Desktop shortcut creation
- Start Menu entry
- Uninstaller
- Run after installation option

**Installing on Windows:**
1. Double-click the installer `.exe` file
2. Follow the installation wizard
3. Choose installation directory (default: `C:\Users\<Username>\AppData\Local\Programs\LaTeX Plus`)
4. Select "Create Desktop Shortcut"
5. Click "Install"
6. Launch from Desktop or Start Menu

### Build for All Platforms

To build for both macOS and Windows (requires appropriate OS):

```bash
npm run build:all
```

## Advanced Configuration

### Code Signing

#### macOS Code Signing

1. **Get an Apple Developer Certificate:**
   - Enroll in Apple Developer Program
   - Create certificates in Xcode or Apple Developer portal
   - Install certificate in Keychain

2. **Configure signing in package.json:**

```json
"build": {
  "mac": {
    "identity": "Developer ID Application: Your Name (TEAM_ID)",
    "hardenedRuntime": true
  }
}
```

3. **Build with signing:**
```bash
export CSC_NAME="Developer ID Application: Your Name"
npm run build:mac
```

4. **Notarize (macOS 10.14+):**
```bash
export APPLE_ID="your-apple-id@email.com"
export APPLE_ID_PASSWORD="app-specific-password"
npm run build:mac
```

#### Windows Code Signing

1. **Get a code signing certificate** (e.g., from DigiCert, Sectigo)

2. **Configure signing:**

```json
"build": {
  "win": {
    "certificateFile": "path/to/certificate.pfx",
    "certificatePassword": "your-password"
  }
}
```

3. **Build with signing:**
```bash
set CSC_LINK=path\to\certificate.pfx
set CSC_KEY_PASSWORD=your-password
npm run build:win
```

### Customizing the Build

Edit `package.json` under the `"build"` section:

**Change App Name:**
```json
"productName": "Your App Name"
```

**Change App ID:**
```json
"appId": "com.yourcompany.yourapp"
```

**Add File Associations:**
```json
"fileAssociations": [
  {
    "ext": "tex",
    "name": "LaTeX Document",
    "icon": "assets/icons/tex-file-icon.icns"
  }
]
```

**Modify Installer Options:**
```json
"nsis": {
  "oneClick": false,
  "perMachine": true,
  "allowToChangeInstallationDirectory": true
}
```

## Distribution

### macOS Distribution

**Option 1: Direct Download**
- Upload `.dmg` file to your website/GitHub releases
- Users download and install manually

**Option 2: Mac App Store** (requires Apple Developer Program)
- Build with specific entitlements
- Submit through App Store Connect
- Goes through Apple review process

### Windows Distribution

**Option 1: Direct Download**
- Provide `.exe` installer on website/GitHub releases
- Users may see SmartScreen warning (for unsigned apps)

**Option 2: Microsoft Store**
- Package as MSIX/AppX
- Submit through Partner Center
- Requires Microsoft Partner account

### GitHub Releases

1. Create a new release on GitHub
2. Upload built installers:
   - `LaTeX Plus-1.0.0.dmg` (macOS)
   - `LaTeX Plus Setup 1.0.0.exe` (Windows)
3. Write release notes
4. Mark as latest release

Example release notes:
```markdown
## LaTeX Plus v1.0.0

### Features
- Cross-platform LaTeX editor for macOS and Windows
- AI-powered LaTeX code generation
- PDF compilation with pdflatex
- Modern, intuitive interface

### Installation
- **macOS**: Download and open the DMG file, drag to Applications
- **Windows**: Download and run the installer

### Requirements
- LaTeX distribution (MacTeX/MiKTeX)
- Optional: OpenAI API key or Ollama for AI features
```

## Troubleshooting

### Build Errors

**Error: "Cannot find module 'electron'"**
```bash
npm install
```

**Error: "Icon file not found"**
```bash
# Generate icons first
node assets/generate-icons-sharp.js
```

**Error: "Code signing failed"**
- Remove signing configuration for testing:
```bash
export CSC_IDENTITY_AUTO_DISCOVERY=false
npm run build
```

### Runtime Issues

**App won't open on macOS:**
```bash
# Remove quarantine attribute
xattr -cr "/Applications/LaTeX Plus.app"
```

**Windows SmartScreen warning:**
- Click "More info" → "Run anyway"
- Or get app code-signed to avoid warning

**LaTeX not detected:**
- Ensure MacTeX (macOS) or MiKTeX (Windows) is installed
- Check PATH includes LaTeX binaries
- Restart application after installing LaTeX

### Size Optimization

Reduce installer size by excluding unnecessary files:

```json
"files": [
  "!**/node_modules/**/{CHANGELOG.md,README.md}",
  "!**/node_modules/**/{test,__tests__,tests,powered-test}/**",
  "!**/*.{md,markdown}",
  "!**/._*"
]
```

## Automated Builds (CI/CD)

### GitHub Actions Example

Create `.github/workflows/build.yml`:

```yaml
name: Build

on:
  push:
    tags:
      - 'v*'

jobs:
  build-mac:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build:mac
      - uses: actions/upload-artifact@v3
        with:
          name: macos-dmg
          path: dist/*.dmg

  build-windows:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build:win
      - uses: actions/upload-artifact@v3
        with:
          name: windows-installer
          path: dist/*.exe
```

## Next Steps

1. **Test thoroughly** on target platforms
2. **Get code signing certificates** for production
3. **Set up auto-updates** using electron-updater
4. **Create user documentation**
5. **Submit to app stores** (optional)

## Support

For issues or questions:
- GitHub Issues: https://github.com/landsharkiest/macos-windows-latex-plus-cli-app/issues
- Documentation: See README.md

---

**Built using Electron and electron-builder**
