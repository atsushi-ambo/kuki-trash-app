#!/usr/bin/env node

// Simple script to convert SVG icons to PNG using Canvas API in Node.js
// This requires installing canvas: npm install canvas

const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

async function convertSvgToPng(svgPath, pngPath, size) {
    try {
        // Read SVG file
        const svgContent = fs.readFileSync(svgPath, 'utf8');
        
        // Create a data URL
        const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`;
        
        // Create canvas
        const canvas = createCanvas(size, size);
        const ctx = canvas.getContext('2d');
        
        // Load and draw image
        const img = await loadImage(svgDataUrl);
        ctx.drawImage(img, 0, 0, size, size);
        
        // Save as PNG
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(pngPath, buffer);
        
        console.log(`✅ Converted ${svgPath} to ${pngPath}`);
    } catch (error) {
        console.error(`❌ Error converting ${svgPath}:`, error.message);
    }
}

async function main() {
    // Convert icon files
    await convertSvgToPng('icon-192x192.svg', 'icon-192x192.png', 192);
    await convertSvgToPng('icon-512x512.svg', 'icon-512x512.png', 512);
    await convertSvgToPng('favicon.svg', 'favicon.png', 32);
    
    console.log('🎉 Icon conversion completed!');
}

// Check if canvas is available
try {
    require('canvas');
    main().catch(console.error);
} catch (error) {
    console.log('📝 Canvas not installed. To convert SVG to PNG icons, run:');
    console.log('   npm install canvas');
    console.log('   node convert-icons.js');
    console.log('');
    console.log('For now, using SVG icons which work in most modern browsers.');
}
