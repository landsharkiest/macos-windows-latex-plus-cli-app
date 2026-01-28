# LaTeX Plus Logo

## Design Concept

The logo combines elements that represent:
- **LaTeX**: Stylized "T_e_X" typography (the classic TeX notation)
- **AI Integration**: Circuit-inspired connections and neural network nodes
- **Document Creation**: Pen/pencil with document lines
- **Modern Tech**: Gradient colors and clean geometric design

## Color Palette

### Primary Colors
- **Purple Gradient**: `#667eea` → `#764ba2` (Sophisticated, tech-inspired)
- **Accent Gold**: `#ffd700` → `#ffed4e` (Represents excellence and AI intelligence)
- **White**: `#ffffff` (Clean, professional contrast)

### Design Rationale
- Purple: Associated with creativity, wisdom, and technology
- Gold: Premium feel, highlights AI and advanced features
- White: Clarity, simplicity, document focus

## Files Included

### Vector Graphics
- `logo.svg` (512x512): Full-resolution scalable logo for marketing and documentation
- `favicon.svg` (32x32): Simplified version for browser icons

### PNG Generation
Use the provided scripts to generate PNG files:
- `icon-16.png` through `icon-1024.png`: Various sizes for application icons
- `favicon.png`: 32x32 favicon for web/electron

### Platform-Specific Icons
After generating PNGs:
- `icon.ico`: Windows icon (generated from PNG)
- `icon.icns`: macOS icon (generated from PNG)

## Generation Instructions

### Quick Start
```bash
# Install sharp for PNG generation
npm install --save-dev sharp

# Generate PNG files
node assets/generate-icons-sharp.js

# Generate Windows .ico (requires png-to-ico)
npm install --save-dev png-to-ico
npx png-to-ico assets/icons/icon-256.png > assets/icons/icon.ico

# Generate macOS .icns (requires png2icons)
npm install --save-dev png2icons  
npx png2icons assets/icons/icon-1024.png assets/icons/icon.icns
```

### Alternative Methods
See `generate-icons.js` for alternative generation methods using:
- Inkscape (command-line)
- electron-icon-builder
- Online converters

## Usage in Application

### Electron Main Process (main.js)
```javascript
const icon = path.join(__dirname, '../assets/icons/icon-512.png');
mainWindow = new BrowserWindow({
  icon: icon,
  // ...other options
});
```

### HTML Favicon (renderer.html)
```html
<link rel="icon" type="image/svg+xml" href="../assets/icons/favicon.svg">
<link rel="icon" type="image/png" href="../assets/icons/favicon.png">
```

### electron-builder Configuration (package.json)
```json
"build": {
  "mac": {
    "icon": "assets/icons/icon.icns"
  },
  "win": {
    "icon": "assets/icons/icon.ico"
  }
}
```

## Design Specifications

### Logo Elements
1. **Background Circle**: Gradient-filled circle with drop shadow
2. **T (LaTeX T)**: Bold vertical and horizontal strokes, rounded corners
3. **e (subscript)**: Teardrop shape with circuit connections in gold
4. **X (superscript)**: Crossed strokes with neural node dots
5. **Pen**: Stylized writing instrument with gold tip
6. **Document Lines**: Representing document creation
7. **Circuit Elements**: Decorative nodes and connections suggesting AI/tech

### Typography Influence
Based on the classic TeX logo typography but modernized with:
- Rounded rectangles for softer, more approachable feel
- Circuit and AI motifs for modern tech association
- Bold, confident strokes for professional appearance

## License
MIT License - Free to use and modify as per project LICENSE file.
