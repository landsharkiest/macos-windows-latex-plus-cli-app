const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const LaTeXCompiler = require('./compiler');
const AIGenerator = require('./ai-generator');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('src/renderer.html');

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

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
  return generator.isAvailable();
});
