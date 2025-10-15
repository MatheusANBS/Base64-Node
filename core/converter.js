/**
 * Advanced Base64 Converter with robust error handling and format support
 */

import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

class ConversionError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConversionError';
    }
}

class Base64Converter {
    static SUPPORTED_FORMATS = {
        'PNG': 'image/png',
        'JPEG': 'image/jpeg',
        'JPG': 'image/jpeg',
        'GIF': 'image/gif',
        'BMP': 'image/bmp',
        'WEBP': 'image/webp',
        'TIFF': 'image/tiff',
        'ICO': 'image/x-icon',
        'AVIF': 'image/avif'
    };

    /**
     * Decode Base64 string to Buffer
     * @param {string} b64Text - Base64 string or data URL
     * @returns {Buffer} Decoded buffer
     * @throws {ConversionError} If decoding fails
     */
    static decodeBase64(b64Text) {
        if (!b64Text || !b64Text.trim()) {
            throw new ConversionError('Input is empty');
        }

        // Remove data URL prefix if present
        if (b64Text.includes(',') && b64Text.trim().toLowerCase().startsWith('data:')) {
            b64Text = b64Text.split(',')[1];
        }

        // Clean whitespace
        b64Text = b64Text.trim();

        try {
            return Buffer.from(b64Text, 'base64');
        } catch (error) {
            throw new ConversionError(`Invalid Base64 data: ${error.message}`);
        }
    }

    /**
     * Encode Buffer to Base64 string
     * @param {Buffer} data - Buffer to encode
     * @param {boolean} includeMime - Whether to include data URL prefix
     * @param {string} mimeType - MIME type for data URL
     * @returns {string} Base64 encoded string
     */
    static encodeToBase64(data, includeMime = false, mimeType = 'image/png') {
        const b64 = data.toString('base64');
        
        if (includeMime) {
            return `data:${mimeType};base64,${b64}`;
        }
        
        return b64;
    }

    /**
     * Detect image format from buffer
     * @param {Buffer} data - Image buffer
     * @returns {Promise<string|null>} Format name or null
     */
    static async detectImageFormat(data) {
        try {
            const metadata = await sharp(data).metadata();
            return metadata.format ? metadata.format.toUpperCase() : null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Get detailed image information
     * @param {Buffer} data - Image buffer
     * @returns {Promise<Object>} Image info object
     */
    static async getImageInfo(data) {
        try {
            const metadata = await sharp(data).metadata();
            return {
                format: metadata.format ? metadata.format.toUpperCase() : 'UNKNOWN',
                size: [metadata.width, metadata.height],
                width: metadata.width,
                height: metadata.height,
                channels: metadata.channels,
                space: metadata.space,
                hasAlpha: metadata.hasAlpha,
                density: metadata.density,
                chromaSubsampling: metadata.chromaSubsampling
            };
        } catch (error) {
            return { error: error.message };
        }
    }

    /**
     * Convert Base64 to image file
     * @param {string} b64Text - Base64 string
     * @param {string} outputPath - Output file path
     * @param {number} quality - JPEG/WebP quality (1-100)
     * @param {boolean} optimize - Optimize image size
     * @returns {Promise<string>} Path to saved file
     * @throws {ConversionError} If conversion fails
     */
    static async base64ToImage(b64Text, outputPath, quality = 95, optimize = true) {
        const data = this.decodeBase64(b64Text);
        
        // Ensure output directory exists
        const dir = path.dirname(outputPath);
        await fs.mkdir(dir, { recursive: true });

        const format = await this.detectImageFormat(data);
        if (!format) {
            throw new ConversionError('Decoded data is not a valid image');
        }

        // Determine target format from extension
        const ext = path.extname(outputPath).toLowerCase();
        let targetFormat = null;
        
        for (const [formatName, mime] of Object.entries(this.SUPPORTED_FORMATS)) {
            if (ext === `.${formatName.toLowerCase()}`) {
                targetFormat = formatName.toLowerCase();
                break;
            }
        }

        if (!targetFormat) {
            targetFormat = format.toLowerCase();
        }

        // Convert and save
        try {
            let image = sharp(data);

            // Apply format-specific options
            const saveOptions = {};
            
            if (targetFormat === 'jpeg' || targetFormat === 'jpg') {
                saveOptions.quality = quality;
                saveOptions.mozjpeg = optimize;
            } else if (targetFormat === 'webp') {
                saveOptions.quality = quality;
            } else if (targetFormat === 'png') {
                saveOptions.compressionLevel = optimize ? 9 : 6;
            }

            await image.toFormat(targetFormat, saveOptions).toFile(outputPath);
            
            return outputPath;
        } catch (error) {
            throw new ConversionError(`Failed to save image: ${error.message}`);
        }
    }

    /**
     * Convert image file to Base64 string
     * @param {string} imagePath - Path to image file
     * @param {boolean} includeMime - Include data URL prefix
     * @param {Array<number>|null} resize - Optional [width, height] to resize
     * @param {number} quality - JPEG/WebP quality if re-encoding
     * @returns {Promise<string>} Base64 encoded string
     * @throws {ConversionError} If conversion fails
     */
    static async imageToBase64(imagePath, includeMime = false, resize = null, quality = 95) {
        try {
            await fs.access(imagePath);
        } catch (error) {
            throw new ConversionError(`File not found: ${imagePath}`);
        }

        try {
            let image = sharp(imagePath);
            const metadata = await image.metadata();

            // Resize if requested
            if (resize && Array.isArray(resize) && resize.length === 2) {
                image = image.resize(resize[0], resize[1], {
                    fit: 'inside',
                    withoutEnlargement: false
                });
            }

            // Determine MIME type
            const formatName = metadata.format ? metadata.format.toUpperCase() : 'PNG';
            const mimeType = this.SUPPORTED_FORMATS[formatName] || 'image/png';

            // Get buffer
            const buffer = await image.toBuffer();
            
            return this.encodeToBase64(buffer, includeMime, mimeType);
        } catch (error) {
            throw new ConversionError(`Failed to read image: ${error.message}`);
        }
    }

    /**
     * Convert multiple images to Base64 text files
     * @param {Array<string>} imagePaths - List of image file paths
     * @param {string} outputDir - Output directory
     * @param {boolean} includeMime - Include data URL prefix
     * @param {boolean} singleFile - Save all to one file vs separate files
     * @returns {Promise<Array<string>>} List of output file paths
     */
    static async batchImagesToBase64(imagePaths, outputDir, includeMime = false, singleFile = false) {
        await fs.mkdir(outputDir, { recursive: true });
        const results = [];

        if (singleFile) {
            // All in one file
            const outputPath = path.join(outputDir, 'batch_base64.txt');
            let content = '';

            for (const imgPath of imagePaths) {
                try {
                    const b64 = await this.imageToBase64(imgPath, includeMime);
                    content += `# ${path.basename(imgPath)}\n`;
                    content += b64 + '\n\n';
                } catch (error) {
                    console.error(`Failed to convert ${imgPath}: ${error.message}`);
                    continue;
                }
            }

            await fs.writeFile(outputPath, content, 'utf-8');
            results.push(outputPath);
        } else {
            // Separate files
            for (const imgPath of imagePaths) {
                try {
                    const b64 = await this.imageToBase64(imgPath, includeMime);
                    const name = path.parse(imgPath).name;
                    const txtPath = path.join(outputDir, `${name}.txt`);
                    await fs.writeFile(txtPath, b64, 'utf-8');
                    results.push(txtPath);
                } catch (error) {
                    console.error(`Failed to convert ${imgPath}: ${error.message}`);
                    continue;
                }
            }
        }

        return results;
    }

    /**
     * Convert multiple Base64 strings to image files
     * @param {Array<string>} base64Texts - List of Base64 strings
     * @param {string} outputDir - Output directory
     * @param {string} prefix - Filename prefix
     * @param {string} formatExt - File extension
     * @returns {Promise<Array<string>>} List of saved file paths
     */
    static async batchBase64ToImages(base64Texts, outputDir, prefix = 'image', formatExt = '.png') {
        await fs.mkdir(outputDir, { recursive: true });
        const results = [];

        for (let idx = 0; idx < base64Texts.length; idx++) {
            try {
                const outputPath = path.join(outputDir, `${prefix}_${String(idx + 1).padStart(3, '0')}${formatExt}`);
                await this.base64ToImage(base64Texts[idx], outputPath);
                results.push(outputPath);
            } catch (error) {
                console.error(`Failed to convert item ${idx + 1}: ${error.message}`);
                continue;
            }
        }

        return results;
    }

    /**
     * Export images to JSON format
     * @param {Array<string>} imagePaths - List of image file paths
     * @param {string} outputPath - Output JSON file path
     * @param {boolean} includeMime - Include data URL prefix
     * @returns {Promise<string>} Path to saved JSON file
     */
    static async exportToJson(imagePaths, outputPath, includeMime = false) {
        const data = [];

        for (const imgPath of imagePaths) {
            try {
                const b64 = await this.imageToBase64(imgPath, includeMime);
                const info = await sharp(imgPath).metadata();

                data.push({
                    filename: path.basename(imgPath),
                    base64: b64,
                    format: info.format ? info.format.toUpperCase() : 'UNKNOWN',
                    width: info.width,
                    height: info.height,
                    channels: info.channels
                });
            } catch (error) {
                console.error(`Failed to process ${imgPath}: ${error.message}`);
                continue;
            }
        }

        await fs.writeFile(outputPath, JSON.stringify(data, null, 2), 'utf-8');
        return outputPath;
    }

    /**
     * Export images to CSV format
     * @param {Array<string>} imagePaths - List of image file paths
     * @param {string} outputPath - Output CSV file path
     * @param {boolean} includeMime - Include data URL prefix
     * @returns {Promise<string>} Path to saved CSV file
     */
    static async exportToCsv(imagePaths, outputPath, includeMime = false) {
        let csv = 'filename,base64,format,width,height,channels\n';

        for (const imgPath of imagePaths) {
            try {
                const b64 = await this.imageToBase64(imgPath, includeMime);
                const info = await sharp(imgPath).metadata();

                const row = [
                    path.basename(imgPath),
                    `"${b64}"`,
                    info.format ? info.format.toUpperCase() : 'UNKNOWN',
                    info.width,
                    info.height,
                    info.channels
                ].join(',');

                csv += row + '\n';
            } catch (error) {
                console.error(`Failed to process ${imgPath}: ${error.message}`);
                continue;
            }
        }

        await fs.writeFile(outputPath, csv, 'utf-8');
        return outputPath;
    }

    /**
     * Export images to XML format
     * @param {Array<string>} imagePaths - List of image file paths
     * @param {string} outputPath - Output XML file path
     * @param {boolean} includeMime - Include data URL prefix
     * @returns {Promise<string>} Path to saved XML file
     */
    static async exportToXml(imagePaths, outputPath, includeMime = false) {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<images>\n';

        for (const imgPath of imagePaths) {
            try {
                const b64 = await this.imageToBase64(imgPath, includeMime);
                const info = await sharp(imgPath).metadata();

                xml += '  <image>\n';
                xml += `    <filename>${path.basename(imgPath)}</filename>\n`;
                xml += `    <format>${info.format ? info.format.toUpperCase() : 'UNKNOWN'}</format>\n`;
                xml += `    <width>${info.width}</width>\n`;
                xml += `    <height>${info.height}</height>\n`;
                xml += `    <channels>${info.channels}</channels>\n`;
                xml += `    <base64>${b64}</base64>\n`;
                xml += '  </image>\n';
            } catch (error) {
                console.error(`Failed to process ${imgPath}: ${error.message}`);
                continue;
            }
        }

        xml += '</images>\n';
        await fs.writeFile(outputPath, xml, 'utf-8');
        return outputPath;
    }

    /**
     * Export images to specified format
     * @param {Array<string>} imagePaths - List of image file paths
     * @param {string} outputPath - Output file or directory path
     * @param {string} formatType - Export format ('txt', 'json', 'csv', 'xml')
     * @param {boolean} includeMime - Include data URL prefix
     * @param {boolean} singleFile - For TXT - save all to one file
     * @returns {Promise<string|Array<string>>} Path to saved file or list of paths
     */
    static async exportImages(imagePaths, outputPath, formatType = 'txt', includeMime = false, singleFile = false) {
        formatType = formatType.toLowerCase();

        switch (formatType) {
            case 'json':
                return await this.exportToJson(imagePaths, outputPath, includeMime);
            case 'csv':
                return await this.exportToCsv(imagePaths, outputPath, includeMime);
            case 'xml':
                return await this.exportToXml(imagePaths, outputPath, includeMime);
            case 'txt':
                const outputDir = singleFile ? path.dirname(outputPath) : outputPath;
                return await this.batchImagesToBase64(imagePaths, outputDir, includeMime, singleFile);
            default:
                throw new ConversionError(`Unsupported format: ${formatType}`);
        }
    }
}

export { Base64Converter, ConversionError };
