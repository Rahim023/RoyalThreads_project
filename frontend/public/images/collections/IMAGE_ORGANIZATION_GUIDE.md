# Image Organization Guide

## Folder Structure Required

Your images need to be organized in the following structure:

```
frontend/public/images/collections/
├── women/
│   ├── women-1.jpg
│   ├── women-2.jpg
│   ├── women-3.jpg
│   └── women-4.jpg
├── men/
│   ├── men-1.jpg
│   └── men-2.jpg
├── signature/
│   ├── signature-1.jpg
│   ├── signature-2.jpg
│   ├── signature-3.jpg
│   └── signature-4.jpg
└── wedding/
    ├── wedding-1.jpg
    ├── wedding-2.jpg
    └── wedding-3.jpg
```

## Image Naming Convention

- **Format**: `{collection}-{number}.jpg`
- **Examples**: `women-1.jpg`, `men-2.jpg`, `signature-3.jpg`, `wedding-1.jpg`

## Your Images Mapping

Based on your provided images, organize them as follows:

### Women's Collection (4 images)
1. `women-1.jpg` - Wedding dress or formal gown
2. `women-2.jpg` - Casual/evening wear
3. `women-3.jpg` - Elegant dress
4. `women-4.jpg` - Modern style outfit

### Men's Collection (2 images)
1. `men-1.jpg` - Formal/blazer style
2. `men-2.jpg` - Casual style

### Signature Collection (4 images)
1. `signature-1.jpg` - Bridal lehenga
2. `signature-2.jpg` - Embroidered piece
3. `signature-3.jpg` - Premium dress
4. `signature-4.jpg` - Luxury gown

### Wedding Collection (3 images)
1. `wedding-1.jpg` - Red/gold bridal outfit
2. `wedding-2.jpg` - White bridal dress
3. `wedding-3.jpg` - Elegant wedding ensemble

## How to Add Your Images

1. Copy your image files to the appropriate folders
2. Rename them following the convention: `{collection}-{number}.jpg`
3. Save them as JPG or PNG format
4. The Home page slideshow will automatically display them

## Configuration File

The image paths are defined in: `frontend/src/data/collectionImages.js`

This file maps collection names to image folders and is automatically used by the `CollectionSlideshow` component.

## Supported Image Formats

- `.jpg` / `.jpeg`
- `.png`
- `.webp`
- `.gif`

## Image Size Recommendations

- **Width**: 800px - 1200px
- **Height**: 600px - 900px
- **Aspect Ratio**: 4:3 or 16:9 recommended
- **File Size**: < 2MB per image for optimal performance
