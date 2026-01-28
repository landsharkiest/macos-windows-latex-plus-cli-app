// Advanced icon generator using sharp library
// Install: npm install --save-dev sharp
// Run: node assets/generate-icons-sharp.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'icons', 'logo.svg');
const outputDir = path.join(__dirname, 'icons');
const sizes = [16, 32, 64, 128, 256, 512, 1024];

async function generateIcons() {
  console.log('Generating PNG icons from SVG...\n');

  try {
    const svgBuffer = fs.readFileSync(svgPath);

    for (const size of sizes) {
      const outputPath = path.join(outputDir, `icon-${size}.png`);
      
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`Generated: icon-${size}.png`);
    }

    // Generate favicon.png
    const faviconSvg = fs.readFileSync(path.join(outputDir, 'favicon.svg'));
    await sharp(faviconSvg)
      .resize(32, 32)
      .png()
      .toFile(path.join(outputDir, 'favicon.png'));
    
    console.log('Generated: favicon.png');

    console.log('\nAll icons generated successfully!');
    console.log('\nNext steps:');
    console.log('1. For Windows: Install png-to-ico and run:');
    console.log('   npx png-to-ico assets/icons/icon-256.png > assets/icons/icon.ico');
    console.log('\n2. For macOS: Install png2icons and run:');
    console.log('   npx png2icons assets/icons/icon-1024.png assets/icons/icon.icns');
    
  } catch (error) {
    console.error('Error generating icons:', error.message);
    console.log('\nMake sure sharp is installed: npm install --save-dev sharp');
  }
}

generateIcons();
