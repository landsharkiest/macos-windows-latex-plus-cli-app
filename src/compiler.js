const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const config = require('../config/default.json');

class LaTeXCompiler {
  constructor(options = {}) {
    this.compiler = options.compiler || config.latex.compiler;
    this.outputDir = options.outputDir || config.latex.outputDir;
    this.compilerOptions = options.options || config.latex.options;
  }

  /**
   * Compile a LaTeX file to PDF
   * @param {string} filePath - Path to the .tex file
   * @returns {Promise<object>} - Compilation result
   */
  async compile(filePath) {
    return new Promise((resolve, reject) => {
      // Validate input file
      if (!fs.existsSync(filePath)) {
        return reject(new Error(`File not found: ${filePath}`));
      }

      if (!filePath.endsWith('.tex')) {
        return reject(new Error('File must have .tex extension'));
      }

      // Ensure output directory exists
      if (!fs.existsSync(this.outputDir)) {
        fs.mkdirSync(this.outputDir, { recursive: true });
      }

      const fileName = path.basename(filePath, '.tex');
      const outputPath = path.join(this.outputDir, `${fileName}.pdf`);
      
      // Build command arguments
      const args = [
        ...this.compilerOptions,
        `-output-directory=${this.outputDir}`,
        filePath
      ];

      console.log(`Compiling ${filePath} with ${this.compiler}...`);
      
      // Spawn LaTeX compiler process
      const process = spawn(this.compiler, args);
      
      let stdout = '';
      let stderr = '';

      process.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          // Check if PDF was created
          if (fs.existsSync(outputPath)) {
            resolve({
              success: true,
              message: `Successfully compiled to ${outputPath}`,
              outputPath,
              stdout
            });
          } else {
            reject(new Error('Compilation completed but PDF not found'));
          }
        } else {
          reject(new Error(`Compilation failed with code ${code}\n${stderr || stdout}`));
        }
      });

      process.on('error', (err) => {
        if (err.code === 'ENOENT') {
          reject(new Error(`LaTeX compiler '${this.compiler}' not found. Please install a LaTeX distribution (e.g., TeX Live, MiKTeX).`));
        } else {
          reject(err);
        }
      });
    });
  }

  /**
   * Clean auxiliary files generated during compilation
   * @param {string} baseName - Base name of the file (without extension)
   */
  cleanAuxFiles(baseName) {
    const extensions = ['.aux', '.log', '.out', '.toc', '.lof', '.lot'];
    extensions.forEach(ext => {
      const filePath = path.join(this.outputDir, `${baseName}${ext}`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  }
}

module.exports = LaTeXCompiler;
