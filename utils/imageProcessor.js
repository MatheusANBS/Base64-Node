/**
 * Image processing utilities
 */

import sharp from 'sharp';
import fs from 'fs/promises';

class ImageProcessor {
    /**
     * Create thumbnail from image file
     * @param {string} imagePath - Path to image
     * @param {Array<number>} size - [width, height]
     * @returns {Promise<Buffer>} Thumbnail buffer
     */
    static async createThumbnail(imagePath, size = [150, 150]) {
        try {
            return await sharp(imagePath)
                .resize(size[0], size[1], {
                    fit: 'inside',
                    withoutEnlargement: false
                })
                .toBuffer();
        } catch (error) {
            // Return placeholder if fails
            return await sharp({
                create: {
                    width: size[0],
                    height: size[1],
                    channels: 3,
                    background: { r: 40, g: 40, b: 45 }
                }
            }).png().toBuffer();
        }
    }

    /**
     * Create thumbnail from image buffer
     * @param {Buffer} data - Image buffer
     * @param {Array<number>} size - [width, height]
     * @returns {Promise<Buffer|null>} Thumbnail buffer or null
     */
    static async createThumbnailFromBytes(data, size = [150, 150]) {
        try {
            return await sharp(data)
                .resize(size[0], size[1], {
                    fit: 'inside',
                    withoutEnlargement: false
                })
                .toBuffer();
        } catch (error) {
            return null;
        }
    }

    /**
     * Optimize image for web/storage
     * @param {string} imagePath - Path to image
     * @param {Array<number>|null} maxSize - Optional [maxWidth, maxHeight]
     * @param {number} quality - Quality (1-100)
     * @returns {Promise<Buffer>} Optimized image buffer
     */
    static async optimizeImage(imagePath, maxSize = null, quality = 85) {
        let image = sharp(imagePath);
        const metadata = await image.metadata();

        // Resize if needed
        if (maxSize && (metadata.width > maxSize[0] || metadata.height > maxSize[1])) {
            image = image.resize(maxSize[0], maxSize[1], {
                fit: 'inside',
                withoutEnlargement: false
            });
        }

        // Convert to JPEG for better compression
        return await image
            .jpeg({ quality, mozjpeg: true })
            .toBuffer();
    }

    /**
     * Apply filter to image
     * @param {Buffer} imageBuffer - Image buffer
     * @param {string} filterName - Filter name
     * @returns {Promise<Buffer>} Filtered image buffer
     */
    static async applyFilter(imageBuffer, filterName) {
        let image = sharp(imageBuffer);

        switch (filterName.toLowerCase()) {
            case 'blur':
                image = image.blur(3);
                break;
            case 'sharpen':
                image = image.sharpen();
                break;
            case 'grayscale':
                image = image.grayscale();
                break;
            case 'negate':
                image = image.negate();
                break;
            case 'normalize':
                image = image.normalize();
                break;
            default:
                // No filter applied
                break;
        }

        return await image.toBuffer();
    }

    /**
     * Adjust brightness
     * @param {Buffer} imageBuffer - Image buffer
     * @param {number} factor - Brightness factor (0.0 = black, 1.0 = original, 2.0 = twice as bright)
     * @returns {Promise<Buffer>} Adjusted image buffer
     */
    static async adjustBrightness(imageBuffer, factor) {
        return await sharp(imageBuffer)
            .modulate({ brightness: factor })
            .toBuffer();
    }

    /**
     * Adjust contrast (not directly supported by sharp, using linear operation)
     * @param {Buffer} imageBuffer - Image buffer
     * @param {number} factor - Contrast factor
     * @returns {Promise<Buffer>} Adjusted image buffer
     */
    static async adjustContrast(imageBuffer, factor) {
        // Sharp doesn't have direct contrast control like PIL
        // We can use linear operation or normalize
        return await sharp(imageBuffer)
            .linear(factor, -(128 * factor) + 128)
            .toBuffer();
    }

    /**
     * Get dominant color from image
     * @param {Buffer} imageBuffer - Image buffer
     * @returns {Promise<Array<number>>} RGB color [r, g, b]
     */
    static async getDominantColor(imageBuffer) {
        try {
            // Resize to speed up and get raw pixel data
            const { data, info } = await sharp(imageBuffer)
                .resize(100, 100, { fit: 'inside' })
                .raw()
                .toBuffer({ resolveWithObject: true });

            let r = 0, g = 0, b = 0;
            const pixels = data.length / info.channels;

            for (let i = 0; i < data.length; i += info.channels) {
                r += data[i];
                g += data[i + 1];
                b += data[i + 2];
            }

            return [
                Math.round(r / pixels),
                Math.round(g / pixels),
                Math.round(b / pixels)
            ];
        } catch (error) {
            return [128, 128, 128]; // Default gray
        }
    }

    /**
     * Rotate image
     * @param {Buffer} imageBuffer - Image buffer
     * @param {number} angle - Rotation angle (90, 180, 270, etc.)
     * @returns {Promise<Buffer>} Rotated image buffer
     */
    static async rotateImage(imageBuffer, angle) {
        return await sharp(imageBuffer)
            .rotate(angle)
            .toBuffer();
    }

    /**
     * Flip image
     * @param {Buffer} imageBuffer - Image buffer
     * @param {boolean} horizontal - Flip horizontally
     * @param {boolean} vertical - Flip vertically
     * @returns {Promise<Buffer>} Flipped image buffer
     */
    static async flipImage(imageBuffer, horizontal = false, vertical = false) {
        let image = sharp(imageBuffer);
        
        if (horizontal) {
            image = image.flop();
        }
        if (vertical) {
            image = image.flip();
        }

        return await image.toBuffer();
    }
}

export { ImageProcessor };
