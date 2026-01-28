# Quick Start Guide - LaTeX Plus

## Installation & First Launch

### macOS
1. Download `LaTeX Plus-1.0.0.dmg`
2. Open the DMG file
3. Drag "LaTeX Plus" to Applications folder
4. Launch from Applications or Launchpad
5. First launch: Right-click → Open (for unsigned builds)

### Windows
1. Download `LaTeX Plus Setup 1.0.0.exe`
2. Run the installer
3. Follow installation wizard
4. Check "Create Desktop Shortcut"
5. Launch from Desktop or Start Menu

## First Time Setup

### 1. Install LaTeX Distribution

LaTeX Plus requires a LaTeX distribution to compile documents:

**macOS:**
```bash
# Install MacTeX (recommended)
brew install --cask mactex

# Or BasicTeX (smaller, ~100MB)
brew install --cask basictex
```

**Windows:**
- Download MiKTeX: https://miktex.org/download
- Or TeX Live: https://www.tug.org/texlive/

### 2. Configure AI (Optional)

Choose one of the following:

**Option A: OpenAI (Cloud)**

Windows PowerShell:
```powershell
$env:AI_PROVIDER="openai"
$env:OPENAI_API_KEY="your-api-key-here"
```

macOS/Linux:
```bash
export AI_PROVIDER=openai
export OPENAI_API_KEY="your-api-key-here"
```

**Option B: Ollama (Local/Private)**

1. Install Ollama: https://ollama.ai
2. Pull a model:
```bash
ollama pull codellama
```

3. Set environment:
```bash
# macOS/Linux
export AI_PROVIDER=ollama
export OLLAMA_MODEL=codellama

# Windows PowerShell
$env:AI_PROVIDER="ollama"
$env:OLLAMA_MODEL="codellama"
```

**Note:** Restart LaTeX Plus after setting environment variables.

## Quick Tutorial

### Creating Your First Document

1. **Launch LaTeX Plus**
   - Splash screen appears while loading
   - Main window opens after 2-3 seconds

2. **Check Status**
   - Top right shows LaTeX and AI status
   - Green = Ready, Red/Orange = Not configured

3. **Write LaTeX Code**
   ```latex
   \documentclass{article}
   \title{My First Document}
   \author{Your Name}
   \date{\today}
   
   \begin{document}
   \maketitle
   
   \section{Introduction}
   Hello, LaTeX Plus!
   
   \end{document}
   ```

4. **Compile to PDF**
   - Click "Compile to PDF" button
   - Or press `Ctrl+B` (Windows) / `Cmd+B` (macOS)
   - Output panel shows compilation status
   - PDF opens automatically on success

5. **Save Your Work**
   - Click "Save" button
   - Or press `Ctrl+S` / `Cmd+S`
   - Choose filename and location

### Using AI Generation

1. **Click "AI Generate"** button
2. **Enter a description**, for example:
   ```
   Create a research paper template with abstract, introduction, 
   methodology, results, and conclusion sections
   ```
3. **Click "Generate"**
4. **Edit the generated LaTeX code** as needed
5. **Compile to see the result**

### Opening Existing Files

1. **Click "Open"** button
2. **Select a .tex file**
3. **Edit and compile**

## Keyboard Shortcuts

| Action | Windows | macOS |
|--------|---------|-------|
| Save | `Ctrl+S` | `Cmd+S` |
| Open | `Ctrl+O` | `Cmd+O` |
| Compile | `Ctrl+B` | `Cmd+B` |
| Close Modal | `Esc` | `Esc` |

## Tips & Tricks

### 1. Check LaTeX Installation
- Click Settings button
- View LaTeX distribution and path
- If not found, install MacTeX/MiKTeX and restart app

### 2. AI Provider Status
- Settings shows current AI configuration
- If "Not configured", set environment variables
- Restart app after changing environment

### 3. Error Handling
- Compilation errors appear in output panel
- Common issues:
  - Missing packages: Install via MiKTeX/MacTeX
  - Syntax errors: Check LaTeX code
  - LaTeX not found: Check installation

### 4. Output Location
- Compiled PDFs are saved in same folder as .tex file
- For unsaved files: Check temp directory

### 5. Best Practices
- Save frequently (Ctrl/Cmd+S)
- Use descriptive filenames
- Keep LaTeX packages updated
- Test AI output before using

## Example Projects

### Academic Paper
```latex
\documentclass[12pt]{article}
\usepackage{amsmath,graphicx}
\title{Research Title}
\author{Author Name}
\begin{document}
\maketitle
\begin{abstract}
Your abstract here...
\end{abstract}
\section{Introduction}
...
\end{document}
```

### Presentation (Beamer)
```latex
\documentclass{beamer}
\title{Presentation Title}
\author{Your Name}
\begin{document}
\frame{\titlepage}
\begin{frame}{Slide Title}
Content here...
\end{frame}
\end{document}
```

### Resume
```latex
\documentclass{article}
\usepackage{geometry}
\geometry{margin=1in}
\begin{document}
\begin{center}
{\LARGE \textbf{Your Name}}\\
\end{center}
\section*{Education}
...
\end{document}
```

## Troubleshooting

### App Won't Launch
- **macOS:** Remove quarantine: `xattr -cr "/Applications/LaTeX Plus.app"`
- **Windows:** Run as administrator or disable antivirus temporarily

### LaTeX Not Detected
1. Install MacTeX (macOS) or MiKTeX (Windows)
2. Verify installation: `pdflatex --version` in terminal
3. Restart LaTeX Plus

### AI Not Working
1. Check environment variables are set
2. For OpenAI: Verify API key is valid
3. For Ollama: Ensure service is running (`ollama serve`)
4. Restart LaTeX Plus

### Compilation Fails
- Check output panel for specific errors
- Ensure all required packages are installed
- Verify LaTeX syntax is correct
- Try compiling a simple document first

## Getting Help

- **Settings**: Click Settings to view system status
- **GitHub**: https://github.com/landsharkiest/macos-windows-latex-plus-cli-app
- **Issues**: Report bugs on GitHub Issues
- **Documentation**: See README.md for detailed info

## Next Steps

1. Install LaTeX distribution
2. Set up AI (optional)
3. Create your first document
4. Explore AI generation
5. Check out example templates
6. Configure preferences
7. Start your projects!

---

**Enjoy using LaTeX Plus!**
