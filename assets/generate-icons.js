// Script to generate PNG icons from SVG for different sizes
// Run with: node assets/generate-icons.js

const fs = require('fs');
const path = require('path');

console.log('Icon Generation Script');
console.log('======================\n');

console.log('To generate PNG icons from SVG, you need to install a SVG-to-PNG converter:');
console.log('\nOption 1: Using sharp (recommended):');
console.log('  npm install --save-dev sharp');
console.log('  Then run: node assets/generate-icons-sharp.js\n');

console.log('Option 2: Using Inkscape (command-line):');
console.log('  Install Inkscape from https://inkscape.org/');
console.log('  Then run the commands below:\n');

const svgPath = path.join(__dirname, 'icons', 'logo.svg');
const sizes = [16, 32, 64, 128, 256, 512, 1024];

sizes.forEach(size => {
  console.log(`inkscape -w ${size} -h ${size} ${svgPath} -o assets/icons/icon-${size}.png`);
});

console.log('\nOption 3: Using electron-icon-builder:');
console.log('  npm install --save-dev electron-icon-builder');
console.log('  electron-icon-builder --input=./assets/icons/logo.svg --output=./assets/icons/ --flatten\n');

console.log('Option 4: Online converters:');
console.log('  - https://cloudconvert.com/svg-to-png');
console.log('  - https://www.aconvert.com/image/svg-to-png/');
console.log('  Download and save as: icon-16.png, icon-32.png, etc.\n');

console.log('After generating PNGs, for Windows .ico and macOS .icns:');
console.log('  npm install --save-dev png-to-ico');
console.log('  npm install --save-dev png2icons\n');

console.log('SVG logo available at: assets/icons/logo.svg');
console.log('Favicon available at: assets/icons/favicon.svg');
