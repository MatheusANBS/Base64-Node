/**
 * Image to Base64 Converter
 * Handles image encoding and decoding operations with batch support
 */

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

class ImageConversionError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ImageConversionError';
    }
}

class ImageConverter {
    static SUPPORTED_FORMATS = {
        'PNG': 'image/png',
        'JPEG': 'image/jpeg',
        'JPG': 'image/jpeg',
        'GIF': 'image/gif',
        'BMP': 'image/bmp',
        'WEBP': 'image/webp',
        'TIFF': 'image/tiff',
        'TIF': 'image/tiff',
        'ICO': 'image/x-icon',
        'AVIF': 'image/avif'
    };

    /**
     * Read image file and convert to Base64
     * @param {string} filePath - Path to image file
     * @param {boolean} includeMime - Whether to include MIME type prefix
     * @param {Array<number>|null} resize - Optional [width, height] to resize
     * @param {number} quality - Quality for JPEG/WebP compression
     * @returns {Promise<Object>} Result object with base64 data
     */
    static async imageToBase64(filePath, includeMime = true, resize = null, quality = 95) {
        try {
            // Verify file exists
            const stats = await fs.stat(filePath);
            
            if (!stats.isFile()) {
                throw new ImageConversionError('Path is not a file');
            }

            // Process image with sharp
            let image = sharp(filePath);
            const metadata = await image.metadata();

            // Verify it's a valid image
            if (!metadata.format) {
                throw new ImageConversionError('File is not a valid image');
            }

            // Resize if requested
            if (resize && Array.isArray(resize) && resize.length === 2) {
                image = image.resize(resize[0], resize[1], {
                    fit: 'inside',
                    withoutEnlargement: false
                });
            }

            // Get buffer
            const buffer = await image.toBuffer();
            
            // Convert to Base64
            const base64 = buffer.toString('base64');
            
            // Determine MIME type
            const formatName = metadata.format.toUpperCase();
            const mimeType = this.SUPPORTED_FORMATS[formatName] || 'image/png';

            const result = {
                success: true,
                data: includeMime ? `data:${mimeType};base64,${base64}` : base64,
                size: buffer.length,
                sizeKB: (buffer.length / 1024).toFixed(2),
                sizeMB: (buffer.length / (1024 * 1024)).toFixed(2),
                fileName: path.basename(filePath),
                format: formatName,
                width: metadata.width,
                height: metadata.height,
                channels: metadata.channels
            };

            return result;
        } catch (error) {
            if (error instanceof ImageConversionError) {
                throw error;
            }
            throw new ImageConversionError(`Failed to read image: ${error.message}`);
        }
    }

    /**
     * Convert Base64 string to image file
     * @param {string} base64String - Base64 encoded image data
     * @param {string} outputPath - Output file path
     * @param {number} quality - Quality for JPEG/WebP compression
     * @param {boolean} optimize - Whether to optimize the image
     * @returns {Promise<Object>} Result object
     */
    static async base64ToImage(base64String, outputPath, quality = 95, optimize = true) {
        try {
            // Clean base64 string
            let cleanBase64 = base64String.trim();
            
            // Remove data URL prefix if present
            if (cleanBase64.includes(',') && cleanBase64.toLowerCase().startsWith('data:')) {
                cleanBase64 = cleanBase64.split(',')[1];
            }

            // Remove whitespace
            cleanBase64 = cleanBase64.replace(/\s/g, '');

            // Validate base64
            if (!this.isValidBase64(cleanBase64)) {
                throw new ImageConversionError('Invalid Base64 string');
            }

            // Convert to buffer
            const buffer = Buffer.from(cleanBase64, 'base64');

            // Verify it's a valid image
            const format = await this.detectImageFormat(buffer);
            if (!format) {
                throw new ImageConversionError('Decoded data is not a valid image');
            }

            // Ensure output directory exists
            const dir = path.dirname(outputPath);
            await fs.mkdir(dir, { recursive: true });

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

            // Convert and save with sharp
            let image = sharp(buffer);
            const metadata = await image.metadata();

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

            const stats = await fs.stat(outputPath);

            return {
                success: true,
                path: outputPath,
                size: stats.size,
                sizeKB: (stats.size / 1024).toFixed(2),
                sizeMB: (stats.size / (1024 * 1024)).toFixed(2),
                fileName: path.basename(outputPath),
                format: targetFormat.toUpperCase(),
                width: metadata.width,
                height: metadata.height,
                channels: metadata.channels
            };
        } catch (error) {
            if (error instanceof ImageConversionError) {
                throw error;
            }
            throw new ImageConversionError(`Failed to create image: ${error.message}`);
        }
    }

    /**
     * Detect image format from buffer
     * @param {Buffer} buffer - Image buffer
     * @returns {Promise<string|null>} Format name or null
     */
    static async detectImageFormat(buffer) {
        try {
            const metadata = await sharp(buffer).metadata();
            return metadata.format ? metadata.format.toUpperCase() : null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Check if buffer is a valid image
     * @param {Buffer} buffer - Buffer to check
     * @returns {Promise<boolean>} True if valid image
     */
    static async isValidImage(buffer) {
        try {
            await sharp(buffer).metadata();
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Validate Base64 string
     * @param {string} str - String to validate
     * @returns {boolean} True if valid Base64
     */
    static isValidBase64(str) {
        if (!str || str.length === 0) {
            return false;
        }

        // Base64 regex pattern
        const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
        
        // Check if string matches base64 pattern
        if (!base64Regex.test(str)) {
            return false;
        }

        // Check if length is valid (must be multiple of 4)
        if (str.length % 4 !== 0) {
            return false;
        }

        try {
            // Try to decode
            Buffer.from(str, 'base64');
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Get image metadata (detailed info)
     * @param {Buffer} buffer - Image buffer
     * @returns {Promise<Object>} Metadata object
     */
    static async getImageInfo(buffer) {
        try {
            const metadata = await sharp(buffer).metadata();
            
            return {
                format: metadata.format ? metadata.format.toUpperCase() : 'UNKNOWN',
                width: metadata.width,
                height: metadata.height,
                channels: metadata.channels,
                space: metadata.space,
                hasAlpha: metadata.hasAlpha,
                density: metadata.density,
                size: buffer.length,
                sizeKB: (buffer.length / 1024).toFixed(2),
                sizeMB: (buffer.length / (1024 * 1024)).toFixed(2),
                isValid: true
            };
        } catch (error) {
            return {
                format: 'UNKNOWN',
                width: 0,
                height: 0,
                channels: 0,
                space: 'unknown',
                hasAlpha: false,
                density: 0,
                size: buffer.length,
                sizeKB: (buffer.length / 1024).toFixed(2),
                sizeMB: (buffer.length / (1024 * 1024)).toFixed(2),
                isValid: false,
                error: error.message
            };
        }
    }

    /**
     * Batch convert images to Base64 and export to JSON
     * @param {Array<string>} imagePaths - Array of image file paths
     * @param {string} outputPath - Output JSON file path
     * @param {boolean} includeMime - Whether to include MIME type prefix
     * @returns {Promise<Object>} Result object with export info
     */
    static async batchImagesToJson(imagePaths, outputPath, includeMime = true) {
        try {
            const results = [];
            const errors = [];

            for (let i = 0; i < imagePaths.length; i++) {
                const imagePath = imagePaths[i];
                
                try {
                    const result = await this.imageToBase64(imagePath, includeMime);
                    
                    results.push({
                        filename: result.fileName,
                        originalPath: imagePath,
                        base64: result.data,
                        format: result.format,
                        width: result.width,
                        height: result.height,
                        channels: result.channels,
                        size: result.size,
                        sizeKB: result.sizeKB,
                        sizeMB: result.sizeMB,
                        index: i
                    });
                } catch (error) {
                    errors.push({
                        file: imagePath,
                        error: error.message,
                        index: i
                    });
                }
            }

            // Prepare JSON data
            const jsonData = {
                type: 'image-base64-batch',
                created: new Date().toISOString(),
                totalFiles: imagePaths.length,
                successful: results.length,
                failed: errors.length,
                includeMimeType: includeMime,
                images: results,
                errors: errors
            };

            // Write JSON file
            await fs.writeFile(outputPath, JSON.stringify(jsonData, null, 2), 'utf-8');

            return {
                success: true,
                outputPath: outputPath,
                totalFiles: imagePaths.length,
                successful: results.length,
                failed: errors.length,
                errors: errors
            };
        } catch (error) {
            throw new ImageConversionError(`Failed to create batch JSON: ${error.message}`);
        }
    }

    /**
     * Batch convert Base64 from JSON to image files
     * @param {string} jsonPath - Path to JSON file with Base64 data
     * @param {string} outputDir - Output directory for images
     * @returns {Promise<Object>} Result object with conversion info
     */
    static async batchJsonToImages(jsonPath, outputDir) {
        try {
            // Read and parse JSON file
            const jsonContent = await fs.readFile(jsonPath, 'utf-8');
            const jsonData = JSON.parse(jsonContent);

            // Validate JSON structure
            if (jsonData.type !== 'image-base64-batch' || !Array.isArray(jsonData.images)) {
                throw new ImageConversionError('Invalid JSON format. Expected image-base64-batch type.');
            }

            // Ensure output directory exists
            await fs.mkdir(outputDir, { recursive: true });

            const results = [];
            const errors = [];

            for (const imageData of jsonData.images) {
                try {
                    // Determine output filename and format
                    const originalExt = path.extname(imageData.filename).toLowerCase();
                    let targetExt = originalExt;
                    
                    // If no extension or unknown, use format from metadata
                    if (!targetExt || !Object.values(this.SUPPORTED_FORMATS).some(mime => 
                        mime.includes(targetExt.substring(1)))) {
                        targetExt = `.${imageData.format.toLowerCase()}`;
                    }

                    const outputFileName = path.parse(imageData.filename).name + targetExt;
                    const outputPath = path.join(outputDir, outputFileName);

                    // Convert Base64 to image
                    const result = await this.base64ToImage(imageData.base64, outputPath);
                    
                    results.push({
                        originalFilename: imageData.filename,
                        outputPath: result.path,
                        outputFilename: result.fileName,
                        format: result.format,
                        size: result.size,
                        sizeKB: result.sizeKB,
                        sizeMB: result.sizeMB
                    });
                } catch (error) {
                    errors.push({
                        filename: imageData.filename,
                        error: error.message
                    });
                }
            }

            return {
                success: true,
                outputDir: outputDir,
                totalFiles: jsonData.images.length,
                successful: results.length,
                failed: errors.length,
                results: results,
                errors: errors
            };
        } catch (error) {
            if (error instanceof ImageConversionError) {
                throw error;
            }
            throw new ImageConversionError(`Failed to process JSON batch: ${error.message}`);
        }
    }

    /**
     * Export images to various formats (TXT, CSV, XML)
     * @param {Array<string>} imagePaths - Array of image file paths
     * @param {string} outputPath - Output file path
     * @param {string} format - Export format ('txt', 'csv', 'xml')
     * @param {boolean} includeMime - Whether to include MIME type prefix
     * @returns {Promise<Object>} Result object with export info
     */
    static async exportImagesTo(imagePaths, outputPath, format = 'txt', includeMime = true) {
        try {
            const results = [];
            const errors = [];

            // Convert all images to Base64
            for (const imagePath of imagePaths) {
                try {
                    const result = await this.imageToBase64(imagePath, includeMime);
                    results.push(result);
                } catch (error) {
                    errors.push({
                        file: imagePath,
                        error: error.message
                    });
                }
            }

            let content = '';

            switch (format.toLowerCase()) {
                case 'txt':
                    for (const result of results) {
                        content += `# ${result.fileName}\n`;
                        content += result.data + '\n\n';
                    }
                    break;

                case 'csv':
                    content = 'filename,base64,format,width,height,channels,size,sizeKB,sizeMB\n';
                    for (const result of results) {
                        content += [
                            result.fileName,
                            `"${result.data}"`,
                            result.format,
                            result.width,
                            result.height,
                            result.channels,
                            result.size,
                            result.sizeKB,
                            result.sizeMB
                        ].join(',') + '\n';
                    }
                    break;

                case 'xml':
                    content = '<?xml version="1.0" encoding="UTF-8"?>\n<images>\n';
                    for (const result of results) {
                        content += '  <image>\n';
                        content += `    <filename>${result.fileName}</filename>\n`;
                        content += `    <format>${result.format}</format>\n`;
                        content += `    <width>${result.width}</width>\n`;
                        content += `    <height>${result.height}</height>\n`;
                        content += `    <channels>${result.channels}</channels>\n`;
                        content += `    <size>${result.size}</size>\n`;
                        content += `    <sizeKB>${result.sizeKB}</sizeKB>\n`;
                        content += `    <sizeMB>${result.sizeMB}</sizeMB>\n`;
                        content += `    <base64>${result.data}</base64>\n`;
                        content += '  </image>\n';
                    }
                    content += '</images>\n';
                    break;

                default:
                    throw new ImageConversionError(`Unsupported export format: ${format}`);
            }

            // Write file
            await fs.writeFile(outputPath, content, 'utf-8');

            return {
                success: true,
                outputPath: outputPath,
                format: format.toLowerCase(),
                totalFiles: imagePaths.length,
                successful: results.length,
                failed: errors.length,
                errors: errors
            };
        } catch (error) {
            if (error instanceof ImageConversionError) {
                throw error;
            }
            throw new ImageConversionError(`Failed to export images: ${error.message}`);
        }
    }
}

module.exports = { ImageConverter, ImageConversionError };