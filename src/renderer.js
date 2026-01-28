const { ipcRenderer } = require('electron');

let currentFilePath = null;

// DOM elements
const editor = document.getElementById('editor');
const output = document.getElementById('output');
const openBtn = document.getElementById('openBtn');
const saveBtn = document.getElementById('saveBtn');
const compileBtn = document.getElementById('compileBtn');
const aiBtn = document.getElementById('aiBtn');
const aiModal = document.getElementById('aiModal');
const aiPrompt = document.getElementById('aiPrompt');
const generateBtn = document.getElementById('generateBtn');
const closeModal = document.querySelector('.close');

// Check AI availability on load
ipcRenderer.invoke('check-ai-availability').then((available) => {
  if (available) {
    aiBtn.disabled = false;
    aiBtn.title = 'Generate LaTeX with AI';
  } else {
    aiBtn.title = 'AI not available - Set OPENAI_API_KEY';
  }
});

// Open file
openBtn.addEventListener('click', async () => {
  const result = await ipcRenderer.invoke('open-file-dialog');
  if (result) {
    currentFilePath = result.filePath;
    editor.value = result.content;
    showOutput(`Loaded: ${currentFilePath}`, 'success');
  }
});

// Save file
saveBtn.addEventListener('click', async () => {
  const content = editor.value;
  const filePath = await ipcRenderer.invoke('save-file-dialog', content);
  if (filePath) {
    currentFilePath = filePath;
    showOutput(`Saved: ${filePath}`, 'success');
  }
});

// Compile LaTeX
compileBtn.addEventListener('click', async () => {
  const content = editor.value.trim();
  
  if (!content) {
    showOutput('Please enter LaTeX code to compile.', 'error');
    return;
  }

  showOutput('Compiling...', 'info');
  compileBtn.disabled = true;

  const result = await ipcRenderer.invoke('compile-latex', currentFilePath, content);
  
  compileBtn.disabled = false;

  if (result.success) {
    showOutput(result.message, 'success');
  } else {
    showOutput(`Compilation failed: ${result.message}`, 'error');
  }
});

// AI Generate button
aiBtn.addEventListener('click', () => {
  aiModal.style.display = 'flex';
  aiPrompt.focus();
});

// Close modal
closeModal.addEventListener('click', () => {
  aiModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === aiModal) {
    aiModal.style.display = 'none';
  }
});

// Generate LaTeX with AI
generateBtn.addEventListener('click', async () => {
  const prompt = aiPrompt.value.trim();
  
  if (!prompt) {
    alert('Please enter a prompt');
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
    showOutput('LaTeX code generated successfully! You can now compile it.', 'success');
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
  // Ctrl/Cmd + B to compile
  if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
    e.preventDefault();
    compileBtn.click();
  }
});
