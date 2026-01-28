# LaTeX Plus - Complete Reference Guide

## Quick Command Reference

### Installation
```bash
# Clone repository
git clone https://github.com/landsharkiest/macos-windows-latex-plus-cli-app.git
cd macos-windows-latex-plus-cli-app

# Install dependencies
npm install
```

### Icon Generation
```bash
# Install icon generation tools
npm install --save-dev sharp png-to-ico png2icons

# Generate PNG files from SVG
node assets/generate-icons-sharp.js

# Create Windows .ico file
npx png-to-ico assets/icons/icon-256.png > assets/icons/icon.ico

# Create macOS .icns file (macOS only)
npx png2icons assets/icons/icon-1024.png assets/icons/icon.icns
```

### Development
```bash
# Run in development mode
npm start

# Run with dev environment
npm run dev
```

### Building
```bash
# Build for current platform
npm run build

# Build for macOS
npm run build:mac

# Build for Windows  
npm run build:win

# Build for all platforms
npm run build:all
```

### Build Output Locations
```
dist/
├── LaTeX Plus-1.0.0.dmg              # macOS DMG installer
├── LaTeX Plus-1.0.0.pkg              # macOS PKG installer
├── LaTeX Plus-1.0.0-arm64.dmg        # macOS Apple Silicon
├── LaTeX Plus-1.0.0-x64.dmg          # macOS Intel
├── LaTeX Plus Setup 1.0.0.exe        # Windows NSIS installer
├── LaTeX Plus-1.0.0.msi              # Windows MSI installer
└── LaTeX Plus 1.0.0.exe              # Windows portable
```

---

## Environment Configuration

### AI Provider Setup

#### Option 1: OpenAI (Cloud)

**macOS/Linux:**
```bash
export AI_PROVIDER=openai
export OPENAI_API_KEY="sk-your-api-key-here"
```

**Windows PowerShell:**
```powershell
$env:AI_PROVIDER="openai"
$env:OPENAI_API_KEY="sk-your-api-key-here"
```

**Windows CMD:**
```cmd
set AI_PROVIDER=openai
set OPENAI_API_KEY=sk-your-api-key-here
```

#### Option 2: Ollama (Local)

**Install and Setup:**
```bash
# Install Ollama (visit https://ollama.ai)

# Pull a model
ollama pull codellama

# Start service
ollama serve
```

**Environment Variables (macOS/Linux):**
```bash
export AI_PROVIDER=ollama
export OLLAMA_MODEL=codellama
```

**Environment Variables (Windows PowerShell):**
```powershell
$env:AI_PROVIDER="ollama"
$env:OLLAMA_MODEL="codellama"
```

### LaTeX Installation

**macOS:**
```bash
# MacTeX (full, ~4GB)
brew install --cask mactex

# BasicTeX (minimal, ~100MB)
brew install --cask basictex
```

**Windows:**
- Download MiKTeX: https://miktex.org/download
- Or TeX Live: https://www.tug.org/texlive/windows.html

**Verify Installation:**
```bash
pdflatex --version
```

---

## Code Signing (Production)

### macOS Code Signing

**Prerequisites:**
- Apple Developer Account ($99/year)
- Developer ID Application certificate

**Setup:**
```bash
# Set identity
export CSC_NAME="Developer ID Application: Your Name (TEAM_ID)"

# For notarization
export APPLE_ID="your-apple-id@email.com"
export APPLE_ID_PASSWORD="app-specific-password"
export APPLE_TEAM_ID="YOUR_TEAM_ID"

# Build with signing
npm run build:mac
```

**Alternative (no signing for testing):**
```bash
export CSC_IDENTITY_AUTO_DISCOVERY=false
npm run build:mac
```

### Windows Code Signing

**Prerequisites:**
- Code signing certificate (.pfx file)
- Certificate password

**Setup:**
```bash
# Windows CMD
set CSC_LINK=path\to\certificate.pfx
set CSC_KEY_PASSWORD=your-password

# Windows PowerShell
$env:CSC_LINK="path\to\certificate.pfx"
$env:CSC_KEY_PASSWORD="your-password"

# Build with signing
npm run build:win
```

**Alternative (no signing for testing):**
```bash
set CSC_IDENTITY_AUTO_DISCOVERY=false
npm run build:win
```

---

## Keyboard Shortcuts

| Action | Windows | macOS |
|--------|---------|-------|
| Save | `Ctrl + S` | `Cmd + S` |
| Open | `Ctrl + O` | `Cmd + O` |
| Compile | `Ctrl + B` | `Cmd + B` |
| Close Modal | `Esc` | `Esc` |
| Dev Tools | `Ctrl + Shift + I` | `Cmd + Option + I` |

---

## Package.json Key Sections

### Scripts
```json
{
  "scripts": {
    "start": "electron .",
    "dev": "NODE_ENV=development electron .",
    "build": "electron-builder",
    "build:mac": "electron-builder --mac",
    "build:win": "electron-builder --win",
    "build:all": "electron-builder -mw",
    "generate-icons": "node assets/generate-icons-sharp.js"
  }
}
```

### Build Configuration
```json
{
  "build": {
    "appId": "com.latexplus.app",
    "productName": "LaTeX Plus",
    "directories": {
      "output": "dist",
      "buildResources": "assets"
    },
    "mac": {
      "category": "public.app-category.productivity",
      "icon": "assets/icons/icon.icns",
      "target": ["dmg", "pkg"]
    },
    "win": {
      "icon": "assets/icons/icon.ico",
      "target": ["nsis", "msi", "portable"]
    }
  }
}
```

---

## File Structure Reference

```
project/
├── assets/
│   ├── icons/
│   │   ├── logo.svg                  # Main logo (512x512)
│   │   ├── favicon.svg               # Small icon (32x32)
│   │   ├── icon-{16,32,64,128,256,512,1024}.png
│   │   ├── icon.ico                  # Windows icon
│   │   └── icon.icns                 # macOS icon
│   ├── entitlements.mac.plist        # macOS permissions
│   ├── generate-icons-sharp.js       # Icon generator
│   └── DMG_BACKGROUND_README.md
├── src/
│   ├── main.js                       # Electron main process
│   ├── renderer.html                 # Main window UI
│   ├── renderer.js                   # Main window logic
│   ├── splash.html                   # Splash screen
│   ├── styles.css                    # Application styles
│   ├── compiler.js                   # LaTeX compiler
│   └── ai-generator.js               # AI integration
├── cli/
│   └── latex-cli.js                  # Command-line tool
├── config/
│   └── default.json                  # App configuration
├── dist/                             # Build output (generated)
├── package.json                      # Project config
├── BUILD.md                          # Build instructions
├── QUICKSTART.md                     # User guide
├── IMPLEMENTATION_SUMMARY.md         # This document
└── README.md                         # Project overview
```

---

## Troubleshooting Commands

### Clear npm cache
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Rebuild native modules
```bash
npm rebuild
```

### Check Electron version
```bash
npx electron --version
```

### Test LaTeX installation
```bash
# Check if pdflatex is available
pdflatex --version

# Find LaTeX location
which pdflatex      # macOS/Linux
where pdflatex      # Windows
```

### Debug build issues
```bash
# Enable verbose logging
DEBUG=electron-builder npm run build

# Build without code signing
CSC_IDENTITY_AUTO_DISCOVERY=false npm run build
```

### macOS app won't open
```bash
# Remove quarantine attribute
xattr -cr "/Applications/LaTeX Plus.app"

# Check what's blocking
spctl --assess --verbose "/Applications/LaTeX Plus.app"
```

### Windows SmartScreen
```powershell
# Check file signature
Get-AuthenticodeSignature "LaTeX Plus Setup 1.0.0.exe"
```

---

## Example LaTeX Documents

### Basic Article
```latex
\documentclass{article}
\usepackage[utf8]{inputenc}

\title{My Document}
\author{Your Name}
\date{\today}

\begin{document}

\maketitle

\section{Introduction}
Your introduction here.

\section{Conclusion}
Your conclusion here.

\end{document}
```

### Academic Paper with Math
```latex
\documentclass[12pt]{article}
\usepackage{amsmath,amssymb,graphicx}
\usepackage[margin=1in]{geometry}

\title{Research Paper Title}
\author{Author Name \\ Institution}
\date{\today}

\begin{document}
\maketitle

\begin{abstract}
Your abstract here.
\end{abstract}

\section{Introduction}
The equation is:
\begin{equation}
    E = mc^2
\end{equation}

\section{Methodology}
More content...

\bibliographystyle{plain}
\bibliography{references}

\end{document}
```

### Beamer Presentation
```latex
\documentclass{beamer}
\usetheme{Madrid}

\title{Presentation Title}
\author{Your Name}
\date{\today}

\begin{document}

\frame{\titlepage}

\begin{frame}
\frametitle{Introduction}
\begin{itemize}
    \item Point one
    \item Point two
\end{itemize}
\end{frame}

\begin{frame}
\frametitle{Conclusion}
Thank you!
\end{frame}

\end{document}
```

---

## CI/CD Integration (GitHub Actions)

### Create `.github/workflows/build.yml`

```yaml
name: Build and Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build-macos:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Generate icons
        run: node assets/generate-icons-sharp.js
      
      - name: Build for macOS
        run: npm run build:mac
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: macos-installers
          path: dist/*.dmg

  build-windows:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Generate icons
        run: node assets/generate-icons-sharp.js
      
      - name: Build for Windows
        run: npm run build:win
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: windows-installers
          path: dist/*.exe

  release:
    needs: [build-macos, build-windows]
    runs-on: ubuntu-latest
    steps:
      - name: Download all artifacts
        uses: actions/download-artifact@v3
      
      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          files: |
            macos-installers/*
            windows-installers/*
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## Distribution Checklist

### Pre-Release
- [ ] Update version in package.json
- [ ] Test on fresh macOS and Windows systems
- [ ] Verify all features work
- [ ] Check LaTeX detection
- [ ] Test AI integration
- [ ] Generate all icons
- [ ] Update CHANGELOG.md
- [ ] Update documentation

### Building
- [ ] Build for macOS (DMG + PKG)
- [ ] Build for Windows (NSIS + MSI)
- [ ] Test installers on clean systems
- [ ] Verify desktop shortcuts work
- [ ] Check uninstaller works
- [ ] Sign builds (if certificates available)

### Release
- [ ] Create GitHub release
- [ ] Upload installers
- [ ] Write release notes
- [ ] Tag version in git
- [ ] Update README with download links
- [ ] Announce on social media/forums
- [ ] Submit to app directories (optional)

---

## Useful Links

### Official Resources
- Electron: https://www.electronjs.org/
- electron-builder: https://www.electron.build/
- Node.js: https://nodejs.org/

### LaTeX Resources
- MacTeX: https://www.tug.org/mactex/
- MiKTeX: https://miktex.org/
- TeX Live: https://www.tug.org/texlive/
- LaTeX Documentation: https://www.latex-project.org/

### AI Resources
- OpenAI API: https://platform.openai.com/
- Ollama: https://ollama.ai/

### Tools
- Sharp (image processing): https://sharp.pixelplumbing.com/
- png-to-ico: https://www.npmjs.com/package/png-to-ico
- png2icons: https://www.npmjs.com/package/png2icons

### Design Tools
- Figma: https://www.figma.com/
- Inkscape: https://inkscape.org/
- SVGOMG (SVG optimizer): https://jakearchibald.github.io/svgomg/

---

## Support and Contributing

### Getting Help
- GitHub Issues: Report bugs and request features
- Discussions: Ask questions and share ideas
- Documentation: Check BUILD.md and QUICKSTART.md

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### License
MIT License - See LICENSE file for details

---

**Last Updated**: January 2026  
**Version**: 1.0.0  
**Status**: Production Ready
