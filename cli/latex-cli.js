#!/usr/bin/env node

const { Command } = require('commander');
const LaTeXCompiler = require('../src/compiler');
const AIGenerator = require('../src/ai-generator');
const fs = require('fs');
const path = require('path');

const program = new Command();

program
  .name('latex-cli')
  .description('LaTeX compiler with AI integration')
  .version('1.0.0');

// Compile command
program
  .command('compile <file>')
  .description('Compile a .tex file to PDF')
  .option('-o, --output <dir>', 'Output directory', './output')
  .option('-c, --compiler <name>', 'LaTeX compiler to use', 'pdflatex')
  .option('--clean', 'Clean auxiliary files after compilation')
  .action(async (file, options) => {
    try {
      const compiler = new LaTeXCompiler({
        compiler: options.compiler,
        outputDir: options.output
      });

      const result = await compiler.compile(file);
      console.log('✓', result.message);

      if (options.clean) {
        const baseName = path.basename(file, '.tex');
        compiler.cleanAuxFiles(baseName);
        console.log('✓ Cleaned auxiliary files');
      }

      process.exit(0);
    } catch (error) {
      console.error('✗ Error:', error.message);
      process.exit(1);
    }
  });

// Generate command
program
  .command('generate <prompt>')
  .description('Generate LaTeX code from a text prompt using AI')
  .option('-o, --output <file>', 'Output file path', './generated.tex')
  .option('--compile', 'Compile the generated LaTeX to PDF')
  .action(async (prompt, options) => {
    try {
      const generator = new AIGenerator();

      if (!generator.isAvailable()) {
        console.error('✗ AI integration not available.');
        console.error('  Set OPENAI_API_KEY environment variable to enable AI features.');
        console.error('  Example: export OPENAI_API_KEY="your-api-key"');
        process.exit(1);
      }

      console.log('Generating LaTeX from prompt:', prompt);
      const outputPath = await generator.generateToFile(prompt, options.output);
      console.log('✓ Generated LaTeX code saved to:', outputPath);

      if (options.compile) {
        console.log('Compiling generated LaTeX...');
        const compiler = new LaTeXCompiler();
        const result = await compiler.compile(outputPath);
        console.log('✓', result.message);
      }

      process.exit(0);
    } catch (error) {
      console.error('✗ Error:', error.message);
      process.exit(1);
    }
  });

// Init command - create a sample LaTeX file
program
  .command('init [filename]')
  .description('Create a sample LaTeX file')
  .action((filename) => {
    const outputFile = filename || 'sample.tex';
    
    const sampleContent = `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{graphicx}

\\title{Sample LaTeX Document}
\\author{LaTeX Plus}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{Introduction}
This is a sample LaTeX document created with LaTeX Plus.

\\section{Mathematics}
Here's an example equation:
\\begin{equation}
    E = mc^2
\\end{equation}

\\section{Conclusion}
You can now edit this file and compile it using the \\texttt{latex-cli compile} command.

\\end{document}
`;

    try {
      fs.writeFileSync(outputFile, sampleContent);
      console.log('✓ Created sample file:', outputFile);
      console.log('  Compile it with: latex-cli compile', outputFile);
    } catch (error) {
      console.error('✗ Error creating file:', error.message);
      process.exit(1);
    }
  });

program.parse();
