/**
 * Script para converter ícone .ico para outros formatos
 * Útil para compilação multiplataforma
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertIcon() {
    const iconPath = path.join(__dirname, 'assets', 'icon.ico');
    const pngPath = path.join(__dirname, 'assets', 'icon.png');

    try {
        // Converter ICO para PNG (256x256)
        await sharp(iconPath)
            .resize(256, 256)
            .png()
            .toFile(pngPath);

        console.log('✅ Ícone PNG criado:', pngPath);
        console.log('ℹ️  Para macOS (.icns), use ferramentas online ou:');
        console.log('   - macOS: iconutil (built-in)');
        console.log('   - Online: https://convertio.co/ico-icns/');
    } catch (error) {
        console.error('❌ Erro ao converter ícone:', error.message);
    }
}

convertIcon();
