#!/usr/bin/env node

/**
 * Image Organization Helper Script
 * 
 * Usage:
 * 1. Place all your image files in a temporary folder
 * 2. Update the mapping below with your image filenames
 * 3. Run this script to organize them into collection folders
 * 
 * Example:
 * node organize-images.js
 */

const fs = require('fs');
const path = require('path');

// Configuration: Map your image filenames to their target locations
const imageMapping = {
  // Women Collection - Update with your actual filenames
  women: [
    // { source: 'your-wedding-dress.jpg', target: 'women-1.jpg' },
    // { source: 'your-casual-wear.jpg', target: 'women-2.jpg' },
    // { source: 'your-elegant-dress.jpg', target: 'women-3.jpg' },
    // { source: 'your-modern-style.jpg', target: 'women-4.jpg' },
  ],

  // Men Collection
  men: [
    // { source: 'your-formal-wear.jpg', target: 'men-1.jpg' },
    // { source: 'your-casual-style.jpg', target: 'men-2.jpg' },
  ],

  // Signature Collection
  signature: [
    // { source: 'your-bridal-lehenga.jpg', target: 'signature-1.jpg' },
    // { source: 'your-embroidered-piece.jpg', target: 'signature-2.jpg' },
    // { source: 'your-premium-dress.jpg', target: 'signature-3.jpg' },
    // { source: 'your-luxury-gown.jpg', target: 'signature-4.jpg' },
  ],

  // Wedding Collection
  wedding: [
    // { source: 'your-red-gold-bride.jpg', target: 'wedding-1.jpg' },
    // { source: 'your-white-wedding.jpg', target: 'wedding-2.jpg' },
    // { source: 'your-elegant-ensemble.jpg', target: 'wedding-3.jpg' },
  ],
};

const sourceDir = path.join(__dirname, 'images-to-organize');
const collectionDir = path.join(__dirname, 'public', 'images', 'collections');

console.log('📁 Image Organization Helper');
console.log('============================\n');

// Instructions
console.log('How to use this script:\n');
console.log('1. Place your images in the "images-to-organize" folder');
console.log('2. Update the imageMapping object above with your filenames');
console.log('3. Run: node organize-images.js\n');

console.log('Example mapping:');
console.log(`{
  women: [
    { source: 'my-wedding-dress.jpg', target: 'women-1.jpg' },
  ],
  men: [
    { source: 'my-formal.jpg', target: 'men-1.jpg' },
  ],
  // ... etc
}\n`);

console.log('Target locations:');
Object.keys(imageMapping).forEach(collection => {
  const folder = path.join(collectionDir, collection);
  console.log(`  ${collection}: ${folder}`);
});

console.log('\n✅ Ready to organize images when you update the mapping above!');
