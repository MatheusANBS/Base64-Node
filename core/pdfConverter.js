/**
 * PDF to Base64 Converter
 * Handles PDF encoding and decoding operations
 */

const fs = require('fs').promises;
const path = require('path');

class PDFConversionError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PDFConversionError';
    }
}

class PDFConverter {
    /**
     * Read PDF file and convert to Base64
     * @param {string} filePath - Path to PDF file
     * @param {boolean} includeMime - Whether to include MIME type prefix
     * @returns {Promise<Object>} Result object with base64 data
     */
    static async pdfToBase64(filePath, includeMime = true) {
        try {
            // Verify file exists
            const stats = await fs.stat(filePath);
            
            if (!stats.isFile()) {
                throw new PDFConversionError('Path is not a file');
            }

            // Read file
            const buffer = await fs.readFile(filePath);
            
            // Verify it's a PDF file (check magic numbers)
            if (!this.isPDF(buffer)) {
                throw new PDFConversionError('File is not a valid PDF');
            }

            // Convert to Base64
            const base64 = buffer.toString('base64');
            
            const result = {
                success: true,
                data: includeMime ? `data:application/pdf;base64,${base64}` : base64,
                size: buffer.length,
                sizeKB: (buffer.length / 1024).toFixed(2),
                sizeMB: (buffer.length / (1024 * 1024)).toFixed(2),
                fileName: path.basename(filePath)
            };

            return result;
        } catch (error) {
            if (error instanceof PDFConversionError) {
                throw error;
            }
            throw new PDFConversionError(`Failed to read PDF: ${error.message}`);
        }
    }

    /**
     * Convert Base64 string to PDF file
     * @param {string} base64String - Base64 encoded PDF data
     * @param {string} outputPath - Output file path
     * @returns {Promise<Object>} Result object
     */
    static async base64ToPDF(base64String, outputPath) {
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
                throw new PDFConversionError('Invalid Base64 string');
            }

            // Convert to buffer
            const buffer = Buffer.from(cleanBase64, 'base64');

            // Verify it's a PDF
            if (!this.isPDF(buffer)) {
                throw new PDFConversionError('Decoded data is not a valid PDF');
            }

            // Write to file
            await fs.writeFile(outputPath, buffer);

            const stats = await fs.stat(outputPath);

            return {
                success: true,
                path: outputPath,
                size: stats.size,
                sizeKB: (stats.size / 1024).toFixed(2),
                sizeMB: (stats.size / (1024 * 1024)).toFixed(2),
                fileName: path.basename(outputPath)
            };
        } catch (error) {
            if (error instanceof PDFConversionError) {
                throw error;
            }
            throw new PDFConversionError(`Failed to create PDF: ${error.message}`);
        }
    }

    /**
     * Check if buffer is a valid PDF
     * @param {Buffer} buffer - Buffer to check
     * @returns {boolean} True if valid PDF
     */
    static isPDF(buffer) {
        if (!buffer || buffer.length < 5) {
            return false;
        }

        // Check PDF magic number (%PDF-)
        const header = buffer.toString('ascii', 0, 5);
        return header === '%PDF-';
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
     * Get PDF metadata (basic info)
     * @param {Buffer} buffer - PDF buffer
     * @returns {Object} Metadata object
     */
    static getPDFInfo(buffer) {
        try {
            const text = buffer.toString('utf8', 0, Math.min(buffer.length, 1024));
            
            // Extract version
            const versionMatch = text.match(/%PDF-(\d+\.\d+)/);
            const version = versionMatch ? versionMatch[1] : 'Unknown';

            return {
                version,
                size: buffer.length,
                sizeKB: (buffer.length / 1024).toFixed(2),
                sizeMB: (buffer.length / (1024 * 1024)).toFixed(2),
                isValid: this.isPDF(buffer)
            };
        } catch {
            return {
                version: 'Unknown',
                size: buffer.length,
                sizeKB: (buffer.length / 1024).toFixed(2),
                sizeMB: (buffer.length / (1024 * 1024)).toFixed(2),
                isValid: false
            };
        }
    }
}

module.exports = PDFConverter;
