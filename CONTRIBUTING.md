# Contributing to LaTeX Plus

Thank you for considering contributing to LaTeX Plus! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/macos-windows-latex-plus-cli-app.git`
3. Install dependencies: `npm install`
4. Create a new branch: `git checkout -b feature/your-feature-name`

## Development

### Project Structure

- `src/` - Electron application source code
  - `main.js` - Electron main process
  - `renderer.html/js/css` - GUI interface
  - `compiler.js` - LaTeX compilation logic
  - `ai-generator.js` - AI integration
- `cli/` - Command-line interface
- `config/` - Configuration files

### Running the Application

```bash
# Start GUI
npm start

# Test CLI
node cli/latex-cli.js --help
```

### Code Style

- Use ES6+ syntax
- Add comments for complex logic
- Follow existing code patterns
- Use meaningful variable names

## Testing

Before submitting a pull request:

1. Test the CLI commands
2. Test the GUI functionality
3. Ensure error handling works correctly
4. Test on both macOS and Windows if possible

## Submitting Changes

1. Commit your changes with clear, descriptive messages
2. Push to your fork
3. Submit a pull request with:
   - Clear title describing the change
   - Description of what was changed and why
   - Screenshots for UI changes
   - Test results

## Reporting Issues

When reporting issues, please include:

- Operating system and version
- Node.js version
- LaTeX distribution installed
- Steps to reproduce
- Expected vs actual behavior
- Error messages or logs

## Feature Requests

We welcome feature requests! Please:

- Check if the feature already exists or is requested
- Clearly describe the feature and use case
- Explain why it would be beneficial

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help create a welcoming environment

## Questions?

Feel free to open an issue for questions or discussions.

Thank you for contributing!
