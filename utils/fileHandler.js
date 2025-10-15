/**
 * File handling utilities
 */

import fs from 'fs/promises';
import path from 'path';

class FileHandler {
    static SUPPORTED_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.tiff', '.ico', '.avif'];
    static SUPPORTED_TEXT_EXTENSIONS = ['.txt', '.b64'];

    /**
     * Check if file is a supported image
     * @param {string} filePath - Path to check
     * @returns {boolean}
     */
    static isImageFile(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        return this.SUPPORTED_IMAGE_EXTENSIONS.includes(ext);
    }

    /**
     * Check if file is a text file
     * @param {string} filePath - Path to check
     * @returns {boolean}
     */
    static isTextFile(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        return this.SUPPORTED_TEXT_EXTENSIONS.includes(ext);
    }

    /**
     * Get all image files in directory
     * @param {string} directory - Directory path
     * @returns {Promise<Array<string>>} List of image file paths
     */
    static async getImageFiles(directory) {
        try {
            const stats = await fs.stat(directory);
            if (!stats.isDirectory()) {
                return [];
            }

            const entries = await fs.readdir(directory, { withFileTypes: true });
            const images = [];

            for (const entry of entries) {
                if (entry.isFile()) {
                    const fullPath = path.join(directory, entry.name);
                    if (this.isImageFile(fullPath)) {
                        images.push(fullPath);
                    }
                }
            }

            return images.sort();
        } catch (error) {
            return [];
        }
    }

    /**
     * Validate and prepare output path
     * @param {string} filePath - Desired output path
     * @returns {Promise<string>} Valid output path (may be modified to avoid overwrites)
     */
    static async validateOutputPath(filePath) {
        // Create parent directory if needed
        const dir = path.dirname(filePath);
        await fs.mkdir(dir, { recursive: true });

        // Handle existing files
        let outputPath = filePath;
        const parsedPath = path.parse(filePath);
        let counter = 1;

        try {
            while (await fs.access(outputPath).then(() => true).catch(() => false)) {
                outputPath = path.join(parsedPath.dir, `${parsedPath.name}_${counter}${parsedPath.ext}`);
                counter++;
            }
        } catch (error) {
            // Path doesn't exist, it's safe to use
        }

        return outputPath;
    }

    /**
     * Save conversion history
     * @param {string} historyFile - Path to history file
     * @param {Array<Object>} entries - History entries
     */
    static async saveHistory(historyFile, entries) {
        const dir = path.dirname(historyFile);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(historyFile, JSON.stringify(entries, null, 2), 'utf-8');
    }

    /**
     * Load conversion history
     * @param {string} historyFile - Path to history file
     * @returns {Promise<Array<Object>>} History entries
     */
    static async loadHistory(historyFile) {
        try {
            const content = await fs.readFile(historyFile, 'utf-8');
            return JSON.parse(content);
        } catch (error) {
            return [];
        }
    }
}

export { FileHandler };
