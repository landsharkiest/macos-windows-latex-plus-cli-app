const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const LaTeXCompiler = require('./compiler');
const AIGenerator = require('./ai-generator');
const fs = require('fs');

let mainWindow;
let splashWindow;

// Set app metadata
app.setName('LaTeX Plus');
if (process.platform === 'darwin') {
  app.setAboutPanelOptions({
    applicationName: 'LaTeX Plus',
    applicationVersion: app.getVersion(),
    version: app.getVersion(),
    copyright: 'Copyright © 2026 LaTeX Plus',
    credits: 'An open-source LaTeX editor with AI capabilities made specifically for students',
    website: 'https://github.com/landsharkiest/macos-windows-latex-plus-cli-app'
  });
}

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 500,
    height: 350,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  splashWindow.loadFile('src/splash.html');
  splashWindow.center();

  // Close splash after 2.5 seconds
  setTimeout(() => {
    if (splashWindow) {
      splashWindow.close();
      splashWindow = null;
    }
    if (mainWindow) {
      mainWindow.show();
    }
  }, 2500);
}

function createWindow() {
  // Determine icon path based on platform
  let iconPath;
  if (process.platform === 'win32') {
    iconPath = path.join(__dirname, '../assets/icons/icon.ico');
  } else if (process.platform === 'darwin') {
    iconPath = path.join(__dirname, '../assets/icons/icon.icns');
  } else {
    iconPath = path.join(__dirname, '../assets/icons/icon-512.png');
  }

  // Fallback to PNG if platform-specific icon doesn't exist
  if (!fs.existsSync(iconPath)) {
    iconPath = path.join(__dirname, '../assets/icons/icon-512.png');
  }

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    show: false, // Don't show until splash is done
    icon: iconPath,
    backgroundColor: '#f5f5f5',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    autoHideMenuBar: false
  });

  mainWindow.loadFile('src/renderer.html');

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    // Window will be shown after splash closes
  });

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createSplashWindow();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC Handlers

// Open file dialog
ipcMain.handle('open-file-dialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'LaTeX Files', extensions: ['tex'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    const content = fs.readFileSync(filePath, 'utf-8');
    return { filePath, content };
  }
  
  return null;
});

// Save file dialog
ipcMain.handle('save-file-dialog', async (event, content) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    filters: [
      { name: 'LaTeX Files', extensions: ['tex'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (!result.canceled && result.filePath) {
    fs.writeFileSync(result.filePath, content, 'utf-8');
    return result.filePath;
  }
  
  return null;
});

// Compile LaTeX file
ipcMain.handle('compile-latex', async (event, filePath, content) => {
  try {
    // If content is provided but no filePath, create a temporary file
    let fileToCompile = filePath;
    let isTemp = false;

    if (!filePath && content) {
      const tempDir = path.join(app.getPath('temp'), 'latex-plus');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      fileToCompile = path.join(tempDir, 'temp.tex');
      fs.writeFileSync(fileToCompile, content, 'utf-8');
      isTemp = true;
    }

    const compiler = new LaTeXCompiler();
    const result = await compiler.compile(fileToCompile);

    return {
      success: true,
      message: result.message,
      outputPath: result.outputPath
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
});

// Generate LaTeX with AI
ipcMain.handle('generate-latex', async (event, prompt) => {
  try {
    const generator = new AIGenerator();

    if (!generator.isAvailable()) {
      return {
        success: false,
        message: 'AI integration not available. Set OPENAI_API_KEY environment variable.'
      };
    }

    const latexCode = await generator.generate(prompt);

    return {
      success: true,
      latexCode
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
});

// Check AI availability
ipcMain.handle('check-ai-availability', async () => {
  const generator = new AIGenerator();
  return {
    available: generator.isAvailable(),
    provider: generator.getProvider(),
    model: generator.getProvider() === 'openai' ? generator.openaiModel : generator.ollamaModel
  };
});

// Check LaTeX availability
ipcMain.handle('check-latex-availability', async () => {
  const { exec } = require('child_process');
  const { promisify } = require('util');
  const execAsync = promisify(exec);

  try {
    // Try to find pdflatex
    const command = process.platform === 'win32' ? 'where pdflatex' : 'which pdflatex';
    const { stdout } = await execAsync(command);
    const latexPath = stdout.trim();
    
    // Detect distribution
    let distribution = 'LaTeX';
    if (latexPath.toLowerCase().includes('miktex')) {
      distribution = 'MiKTeX';
    } else if (latexPath.toLowerCase().includes('texlive')) {
      distribution = 'TeX Live';
    } else if (latexPath.toLowerCase().includes('mactex')) {
      distribution = 'MacTeX';
    }

    return {
      available: true,
      path: latexPath,
      distribution: distribution
    };
  } catch (error) {
    return {
      available: false,
      path: null,
      distribution: null
    };
  }
});
