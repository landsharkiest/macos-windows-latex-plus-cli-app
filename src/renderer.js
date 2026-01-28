const { ipcRenderer, shell } = require('electron');

let currentFilePath = null;

// Add global error handler
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  showOutput(`JavaScript Error: ${e.error.message}`, 'error');
});

// Add unhandled promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
  showOutput(`Error: ${e.reason}`, 'error');
});

// DOM elements
const editor = document.getElementById('editor');
const output = document.getElementById('output');
const openBtn = document.getElementById('openBtn');
const saveBtn = document.getElementById('saveBtn');
const compileBtn = document.getElementById('compileBtn');
const aiBtn = document.getElementById('aiBtn');
const settingsBtn = document.getElementById('settingsBtn');
const clearOutputBtn = document.getElementById('clearOutput');
const fileInfo = document.getElementById('fileInfo');
const latexStatus = document.getElementById('latexStatus');
const aiStatusBadge = document.getElementById('aiStatusBadge');

// Modal elements
const aiModal = document.getElementById('aiModal');
const settingsModal = document.getElementById('settingsModal');
const aiPrompt = document.getElementById('aiPrompt');
const generateBtn = document.getElementById('generateBtn');
const cancelAiBtn = document.getElementById('cancelAiBtn');
const closeModal = document.querySelector('.close');
const closeSettingsModal = document.querySelector('.close-settings');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const providerInfo = document.getElementById('providerInfo');
const githubLink = document.getElementById('githubLink');

// Check LaTeX and AI availability on load
async function checkSystemStatus() {
  try {
    console.log('Checking AI availability...');
    // Check AI availability
    const aiResult = await ipcRenderer.invoke('check-ai-availability');
    console.log('AI result:', aiResult);
    
    if (aiResult.available) {
      aiBtn.disabled = false;
      aiBtn.title = `Generate LaTeX with AI (${aiResult.provider})`;
      aiStatusBadge.textContent = `AI: ${aiResult.provider}`;
      aiStatusBadge.style.background = 'rgba(76, 175, 80, 0.3)';
      aiStatusBadge.style.color = '#2e7d32';
    } else {
      aiBtn.title = 'AI not available - Configure AI provider in environment';
      aiStatusBadge.textContent = 'AI: Not configured';
      aiStatusBadge.style.background = 'rgba(244, 67, 54, 0.3)';
      aiStatusBadge.style.color = '#c62828';
    }

    console.log('Checking LaTeX availability...');
    // Check LaTeX installation
    const latexResult = await ipcRenderer.invoke('check-latex-availability');
    console.log('LaTeX result:', latexResult);
    
    if (latexResult.available) {
      latexStatus.textContent = `LaTeX: ${latexResult.distribution || 'Installed'}`;
      latexStatus.style.background = 'rgba(76, 175, 80, 0.3)';
      latexStatus.style.color = '#2e7d32';
    } else {
      latexStatus.textContent = 'LaTeX: Not found';
      latexStatus.style.background = 'rgba(255, 152, 0, 0.3)';
      latexStatus.style.color = '#e65100';
      showOutput('WARNING: LaTeX distribution not detected. Please install MiKTeX from https://miktex.org/download to compile documents.', 'warning');
    }

    // Update settings modal
    document.getElementById('latexPath').textContent = latexResult.available 
      ? (latexResult.path || 'Installed and available')
      : 'Not installed - Please install MiKTeX from https://miktex.org/download';
    
    document.getElementById('aiProvider').textContent = aiResult.available
      ? `${aiResult.provider}${aiResult.model ? ` (${aiResult.model})` : ''}`
      : 'Not configured - Set AI_PROVIDER and API keys in environment';
  } catch (error) {
    console.error('Error checking system status:', error);
    showOutput(`Error checking system: ${error.message}`, 'error');
  }
}

checkSystemStatus();

// Open file
openBtn.addEventListener('click', async () => {
  try {
    console.log('Open button clicked');
    const result = await ipcRenderer.invoke('open-file-dialog');
    console.log('Open file result:', result);
    if (result) {
      currentFilePath = result.filePath;
      editor.value = result.content;
      fileInfo.textContent = result.filePath.split(/[\\/]/).pop();
      showOutput(`Loaded: ${result.filePath}`, 'success');
    }
  } catch (error) {
    console.error('Error opening file:', error);
    showOutput(`Error opening file: ${error.message}`, 'error');
  }
});

// Save file
saveBtn.addEventListener('click', async () => {
  try {
    console.log('Save button clicked');
    const content = editor.value;
    const filePath = await ipcRenderer.invoke('save-file-dialog', content);
    console.log('Save file result:', filePath);
    if (filePath) {
      currentFilePath = filePath;
      fileInfo.textContent = filePath.split(/[\\/]/).pop();
      showOutput(`Saved: ${filePath}`, 'success');
    }
  } catch (error) {
    console.error('Error saving file:', error);
    showOutput(`Error saving file: ${error.message}`, 'error');
  }
});

// Compile LaTeX
compileBtn.addEventListener('click', async () => {
  try {
    console.log('Compile button clicked');
    const content = editor.value.trim();
    
    if (!content) {
      showOutput('Please enter LaTeX code to compile.', 'error');
      return;
    }

    showOutput('Compiling LaTeX to PDF...', 'info');
    compileBtn.disabled = true;
    compileBtn.innerHTML = 'Compiling...';

    const result = await ipcRenderer.invoke('compile-latex', currentFilePath, content);
    console.log('Compile result:', result);
    
    compileBtn.disabled = false;
    compileBtn.innerHTML = 'Compile to PDF';

    if (result.success) {
      showOutput(result.message, 'success');
    } else {
      showOutput(`Compilation failed: ${result.message}`, 'error');
    }
  } catch (error) {
    console.error('Error compiling:', error);
    compileBtn.disabled = false;
    compileBtn.innerHTML = 'Compile to PDF';
    showOutput(`Compilation error: ${error.message}`, 'error');
  }
});

// AI Generate button
aiBtn.addEventListener('click', async () => {
  const result = await ipcRenderer.invoke('check-ai-availability');
  if (result.available) {
    let providerText = `<p class="provider-label">Using: <strong>${result.provider}</strong>`;
    if (result.model) {
      providerText += ` (${result.model})`;
    }
    providerText += '</p>';
    providerInfo.innerHTML = providerText;
  }
  aiModal.style.display = 'flex';
  aiPrompt.focus();
});

// Settings button
settingsBtn.addEventListener('click', () => {
  settingsModal.style.display = 'flex';
});

// Clear output
clearOutputBtn.addEventListener('click', () => {
  output.innerHTML = '<p class="info">Output cleared. Compile your LaTeX code to see results.</p>';
});

// Close modals
closeModal.addEventListener('click', () => {
  aiModal.style.display = 'none';
});

cancelAiBtn.addEventListener('click', () => {
  aiModal.style.display = 'none';
});

closeSettingsModal.addEventListener('click', () => {
  settingsModal.style.display = 'none';
});

closeSettingsBtn.addEventListener('click', () => {
  settingsModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === aiModal) {
    aiModal.style.display = 'none';
  }
  if (e.target === settingsModal) {
    settingsModal.style.display = 'none';
  }
});

// GitHub link
githubLink.addEventListener('click', (e) => {
  e.preventDefault();
  shell.openExternal('https://github.com/landsharkiest/macos-windows-latex-plus-cli-app');
});

// Generate LaTeX with AI
generateBtn.addEventListener('click', async () => {
  const prompt = aiPrompt.value.trim();
  
  if (!prompt) {
    showOutput('Please enter a prompt for AI generation.', 'error');
    return;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = 'Generating...';

  const result = await ipcRenderer.invoke('generate-latex', prompt);
  
  generateBtn.disabled = false;
  generateBtn.textContent = 'Generate';

  if (result.success) {
    editor.value = result.latexCode;
    aiModal.style.display = 'none';
    aiPrompt.value = '';
    fileInfo.textContent = 'AI Generated (Unsaved)';
    showOutput('LaTeX code generated successfully! You can now compile it or edit as needed.', 'success');
  } else {
    showOutput(`Generation failed: ${result.message}`, 'error');
  }
});

// Show output message
function showOutput(message, type = 'info') {
  output.innerHTML = `<p class="${type}">${escapeHtml(message)}</p>`;
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + S to save
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    saveBtn.click();
  }
  // Ctrl/Cmd + O to open
  if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
    e.preventDefault();
    openBtn.click();
  }
  // Ctrl/Cmd + B to compile
  if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
    e.preventDefault();
    compileBtn.click();
  }
  // Escape to close modals
  if (e.key === 'Escape') {
    aiModal.style.display = 'none';
    settingsModal.style.display = 'none';
  }
});
