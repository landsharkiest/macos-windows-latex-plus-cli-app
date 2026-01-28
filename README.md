# LaTeX Plus - Cross-Platform LaTeX Editor with AI

An open-source macOS/Windows application for LaTeX with integrated AI capabilities. Compile `.tex` files to PDF and generate LaTeX code from natural language prompts.

## Features

- 🖥️ **Cross-Platform**: Works on macOS and Windows
- 📝 **GUI Editor**: Electron-based graphical interface with syntax highlighting
- ⚡ **CLI Tool**: Command-line interface for automated workflows
- 🤖 **AI Integration**: Generate LaTeX code from text prompts (OpenAI)
- 📄 **PDF Compilation**: Compile LaTeX documents to PDF
- 🎨 **Modern UI**: Clean, user-friendly interface

## Prerequisites

### Required
- **Node.js** (v16 or higher)
- **npm** (v7 or higher)
- **LaTeX Distribution**:
  - **macOS**: [MacTeX](https://www.tug.org/mactex/) or BasicTeX
  - **Windows**: [MiKTeX](https://miktex.org/) or [TeX Live](https://www.tug.org/texlive/)

### Optional
- **OpenAI API Key**: For AI-powered LaTeX generation (set `OPENAI_API_KEY` environment variable)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/landsharkiest/macos-windows-latex-plus-cli-app.git
   cd macos-windows-latex-plus-cli-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up OpenAI API Key** (optional):
   ```bash
   # macOS/Linux
   export OPENAI_API_KEY="your-api-key-here"
   
   # Windows (Command Prompt)
   set OPENAI_API_KEY=your-api-key-here
   
   # Windows (PowerShell)
   $env:OPENAI_API_KEY="your-api-key-here"
   ```

## Usage

### GUI Application

Start the Electron GUI:
```bash
npm start
```

**Features**:
- Open and edit `.tex` files
- Compile LaTeX to PDF
- Generate LaTeX code from AI prompts
- Save your work

**Keyboard Shortcuts**:
- `Ctrl/Cmd + S`: Save file
- `Ctrl/Cmd + B`: Compile to PDF

### CLI Commands

#### 1. Create a Sample File
```bash
node cli/latex-cli.js init [filename]
```
Creates a sample LaTeX document.

**Example**:
```bash
node cli/latex-cli.js init my-document.tex
```

#### 2. Compile LaTeX to PDF
```bash
node cli/latex-cli.js compile <file> [options]
```

**Options**:
- `-o, --output <dir>`: Output directory (default: `./output`)
- `-c, --compiler <name>`: LaTeX compiler (default: `pdflatex`)
- `--clean`: Clean auxiliary files after compilation

**Examples**:
```bash
# Basic compilation
node cli/latex-cli.js compile document.tex

# Custom output directory
node cli/latex-cli.js compile document.tex -o ./pdf-output

# Clean auxiliary files
node cli/latex-cli.js compile document.tex --clean
```

#### 3. Generate LaTeX with AI
```bash
node cli/latex-cli.js generate "<prompt>" [options]
```

**Options**:
- `-o, --output <file>`: Output file path (default: `./generated.tex`)
- `--compile`: Automatically compile the generated LaTeX

**Examples**:
```bash
# Generate LaTeX
node cli/latex-cli.js generate "Create a research paper with abstract and introduction"

# Generate and compile
node cli/latex-cli.js generate "Create a resume template" --compile -o resume.tex
```

## Project Structure

```
macos-windows-latex-plus-cli-app/
├── src/
│   ├── main.js          # Electron main process
│   ├── renderer.html    # GUI HTML
│   ├── renderer.js      # GUI JavaScript
│   ├── styles.css       # GUI styles
│   ├── compiler.js      # LaTeX compiler module
│   └── ai-generator.js  # AI integration module
├── cli/
│   └── latex-cli.js     # CLI application
├── config/
│   └── default.json     # Configuration file
├── output/              # Compiled PDFs (created automatically)
├── package.json         # Project dependencies
└── README.md           # This file
```

## Configuration

Edit `config/default.json` to customize settings:

```json
{
  "latex": {
    "compiler": "pdflatex",
    "outputDir": "./output",
    "options": [
      "-interaction=nonstopmode",
      "-halt-on-error"
    ]
  },
  "ai": {
    "provider": "openai",
    "model": "gpt-4",
    "enabled": false
  }
}
```

## Building Executables

Build platform-specific executables:

```bash
# Build for current platform
npm run build

# Build for macOS
npm run build:mac

# Build for Windows
npm run build:win
```

Executables will be created in the `dist/` directory.

## Error Handling

The application includes comprehensive error handling:

- **Missing LaTeX Compiler**: Provides installation instructions
- **Invalid Files**: Validates file extensions and existence
- **Compilation Errors**: Displays detailed error messages
- **AI Errors**: Handles API key issues and quota limits

## Troubleshooting

### LaTeX compiler not found
**Error**: `LaTeX compiler 'pdflatex' not found`

**Solution**: Install a LaTeX distribution:
- **macOS**: `brew install --cask mactex-no-gui`
- **Windows**: Download and install [MiKTeX](https://miktex.org/download)

### AI features not working
**Error**: `AI integration not available`

**Solution**: Set the `OPENAI_API_KEY` environment variable with your API key.

### Permission errors on CLI
**Error**: `Permission denied`

**Solution**: 
```bash
chmod +x cli/latex-cli.js
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with [Electron](https://www.electronjs.org/)
- CLI powered by [Commander.js](https://github.com/tj/commander.js)
- AI integration via [OpenAI API](https://openai.com/api/)

## Support

For issues and questions, please open an issue on GitHub.
