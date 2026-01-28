# DMG Background Image

This file serves as a placeholder for the DMG installer background image.

## Required Image

- **Filename**: `dmg-background.png`
- **Dimensions**: 540 x 380 pixels (matches DMG window size in package.json)
- **Format**: PNG with transparency support

## Design Recommendations

### Layout
The DMG window will display:
- Left side (x: 130, y: 220): LaTeX Plus application icon
- Right side (x: 410, y: 220): Applications folder link

### Design Elements
1. **Background**: Gradient matching app colors (#667eea to #764ba2)
2. **Instructions**: Visual arrow from app icon to Applications folder
3. **Text**: "Drag to Applications to Install"
4. **Branding**: LaTeX Plus logo/name at top
5. **Style**: Modern, clean, professional

### Creating the Image

**Option 1: Using design software**
- Photoshop, Sketch, Figma, or GIMP
- Template size: 540 x 380 px
- Export as PNG

**Option 2: Using online tools**
- Canva: https://www.canva.com/
- Figma: https://www.figma.com/
- Use provided brand colors and logo

**Option 3: Using provided SVG logo**
- Incorporate logo.svg from assets/icons/
- Add gradient background
- Add arrow graphics and text

### Quick Template

```
┌─────────────────────────────────────────┐
│         LaTeX Plus Installer            │
│                                         │
│    ┌──────┐          ┌──────────┐      │
│    │      │    ───>  │ Apps     │      │
│    │ TeX+ │          │ Folder   │      │
│    └──────┘          └──────────┘      │
│                                         │
│  Drag app icon to Applications folder  │
└─────────────────────────────────────────┘
```

## Installation

Once created, save as:
```
assets/dmg-background.png
```

The electron-builder will automatically use it during DMG creation.

## Fallback

If no image is provided, electron-builder will use a default plain background.
The installer will still function normally.

## Example Command to Create Simple Background

Using ImageMagick (if installed):
```bash
convert -size 540x380 \
  gradient:#667eea-#764ba2 \
  -font Arial -pointsize 24 -fill white \
  -gravity North -annotate +0+20 "LaTeX Plus" \
  -gravity Center -annotate +0+0 "→" \
  -gravity South -annotate +0+20 "Drag to Applications" \
  assets/dmg-background.png
```

## References

- electron-builder DMG docs: https://www.electron.build/configuration/dmg
- macOS DMG best practices: https://github.com/sindresorhus/create-dmg
