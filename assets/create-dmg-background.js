const sharp = require('sharp');
const fs = require('fs');

const width = 540;
const height = 380;

// Create SVG for the DMG background
const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background gradient -->
  <rect width="${width}" height="${height}" fill="url(#grad)" opacity="0.15"/>
  
  <!-- Light background -->
  <rect width="${width}" height="${height}" fill="#f8f9fa" opacity="0.95"/>
  
  <!-- Title area -->
  <rect x="0" y="0" width="${width}" height="80" fill="url(#grad)" opacity="0.1"/>
  
  <!-- Title text -->
  <text x="${width/2}" y="40" font-family="Arial, sans-serif" font-size="28" font-weight="bold" 
        text-anchor="middle" fill="#667eea">LaTeX Plus</text>
  <text x="${width/2}" y="65" font-family="Arial, sans-serif" font-size="14" 
        text-anchor="middle" fill="#666">Drag to Applications to Install</text>
  
  <!-- Arrow from left to right -->
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#667eea" />
    </marker>
  </defs>
  <line x1="200" y1="240" x2="340" y2="240" stroke="#667eea" stroke-width="3" 
        marker-end="url(#arrowhead)" stroke-dasharray="5,5">
    <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite"/>
  </line>
  
  <!-- Instructions text -->
  <text x="${width/2}" y="310" font-family="Arial, sans-serif" font-size="12" 
        text-anchor="middle" fill="#999">Drag the app icon to the Applications folder</text>
</svg>
`;

// Convert SVG to PNG
sharp(Buffer.from(svg))
  .png()
  .toFile('dmg-background.png')
  .then(() => {
    console.log('DMG background created successfully: dmg-background.png');
  })
  .catch(err => {
    console.error('Error creating DMG background:', err);
    process.exit(1);
  });
