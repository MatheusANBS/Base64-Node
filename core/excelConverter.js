/**
 * Excel/CSV to JSON Converter
 * Handles Excel and CSV file conversion operations
 */

const fs = require('fs').promises;
const path = require('path');
const XLSX = require('xlsx');

class ExcelConversionError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ExcelConversionError';
    }
}

class ExcelConverter {
    /**
     * Read Excel/CSV file and convert to JSON
     * @param {string} filePath - Path to Excel/CSV file
     * @param {string} sheetName - Name of sheet to read (null for first sheet)
     * @returns {Promise<Object>} Result object with JSON data
     */
    static async excelToJson(filePath, sheetName = null) {
        try {
            // Verify file exists
            const stats = await fs.stat(filePath);
            
            if (!stats.isFile()) {
                throw new ExcelConversionError('Path is not a file');
            }

            // Read file
            const fileBuffer = await fs.readFile(filePath);
            
            // Parse workbook
            const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
            
            // Get sheet name
            const targetSheet = sheetName || workbook.SheetNames[0];
            
            if (!workbook.Sheets[targetSheet]) {
                throw new ExcelConversionError(`Sheet "${targetSheet}" not found`);
            }

            // Convert sheet to JSON
            const worksheet = workbook.Sheets[targetSheet];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            // Get sheet info
            const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
            const rowCount = range.e.r - range.s.r + 1;
            const colCount = range.e.c - range.s.c + 1;

            const result = {
                success: true,
                data: jsonData,
                fileName: path.basename(filePath),
                sheetName: targetSheet,
                availableSheets: workbook.SheetNames,
                rowCount: jsonData.length,
                columnCount: colCount,
                totalCells: rowCount * colCount,
                size: stats.size,
                sizeKB: (stats.size / 1024).toFixed(2),
                sizeMB: (stats.size / (1024 * 1024)).toFixed(2)
            };

            return result;
        } catch (error) {
            if (error instanceof ExcelConversionError) {
                throw error;
            }
            throw new ExcelConversionError(`Failed to read Excel/CSV: ${error.message}`);
        }
    }

    /**
     * Convert JSON to Excel file
     * @param {Array<Object>} jsonData - Array of objects to convert
     * @param {string} outputPath - Output file path
     * @param {string} sheetName - Name for the sheet
     * @returns {Promise<Object>} Result object
     */
    static async jsonToExcel(jsonData, outputPath, sheetName = 'Sheet1') {
        try {
            // Validate JSON data
            if (!Array.isArray(jsonData) || jsonData.length === 0) {
                throw new ExcelConversionError('JSON data must be a non-empty array');
            }

            // Create workbook and worksheet
            const worksheet = XLSX.utils.json_to_sheet(jsonData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

            // Ensure output directory exists
            const dir = path.dirname(outputPath);
            await fs.mkdir(dir, { recursive: true });

            // Determine file type from extension
            const ext = path.extname(outputPath).toLowerCase();
            let bookType = 'xlsx';
            
            if (ext === '.csv') bookType = 'csv';
            else if (ext === '.xls') bookType = 'xls';
            else if (ext === '.xlsb') bookType = 'xlsb';
            else if (ext === '.ods') bookType = 'ods';

            // Write file
            XLSX.writeFile(workbook, outputPath, { bookType });

            const stats = await fs.stat(outputPath);

            return {
                success: true,
                path: outputPath,
                fileName: path.basename(outputPath),
                sheetName: sheetName,
                rowCount: jsonData.length,
                columnCount: Object.keys(jsonData[0] || {}).length,
                format: bookType.toUpperCase(),
                size: stats.size,
                sizeKB: (stats.size / 1024).toFixed(2),
                sizeMB: (stats.size / (1024 * 1024)).toFixed(2)
            };
        } catch (error) {
            if (error instanceof ExcelConversionError) {
                throw error;
            }
            throw new ExcelConversionError(`Failed to create Excel/CSV: ${error.message}`);
        }
    }

    /**
     * Convert CSV to JSON
     * @param {string} filePath - Path to CSV file
     * @returns {Promise<Object>} Result object with JSON data
     */
    static async csvToJson(filePath) {
        return await this.excelToJson(filePath);
    }

    /**
     * Convert JSON to CSV
     * @param {Array<Object>} jsonData - Array of objects to convert
     * @param {string} outputPath - Output file path
     * @returns {Promise<Object>} Result object
     */
    static async jsonToCsv(jsonData, outputPath) {
        // Ensure .csv extension
        if (!outputPath.toLowerCase().endsWith('.csv')) {
            outputPath = outputPath.replace(/\.[^.]+$/, '') + '.csv';
        }
        return await this.jsonToExcel(jsonData, outputPath, 'Data');
    }

    /**
     * Get workbook information
     * @param {string} filePath - Path to Excel file
     * @returns {Promise<Object>} Workbook info
     */
    static async getWorkbookInfo(filePath) {
        try {
            const fileBuffer = await fs.readFile(filePath);
            const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
            
            const sheetsInfo = workbook.SheetNames.map(name => {
                const worksheet = workbook.Sheets[name];
                const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
                const rowCount = range.e.r - range.s.r + 1;
                const colCount = range.e.c - range.s.c + 1;
                
                return {
                    name,
                    rowCount,
                    columnCount: colCount,
                    cellCount: rowCount * colCount
                };
            });

            return {
                success: true,
                fileName: path.basename(filePath),
                sheetCount: workbook.SheetNames.length,
                sheets: sheetsInfo
            };
        } catch (error) {
            throw new ExcelConversionError(`Failed to read workbook info: ${error.message}`);
        }
    }

    /**
     * Batch convert Excel/CSV files to JSON
     * @param {Array<string>} filePaths - Array of file paths
     * @param {string} outputPath - Output JSON file path
     * @returns {Promise<Object>} Result object with batch info
     */
    static async batchExcelToJson(filePaths, outputPath) {
        try {
            const results = [];
            const errors = [];

            for (let i = 0; i < filePaths.length; i++) {
                const filePath = filePaths[i];
                
                try {
                    const result = await this.excelToJson(filePath);
                    
                    results.push({
                        filename: result.fileName,
                        originalPath: filePath,
                        sheetName: result.sheetName,
                        availableSheets: result.availableSheets,
                        data: result.data,
                        rowCount: result.rowCount,
                        columnCount: result.columnCount,
                        size: result.size,
                        sizeKB: result.sizeKB,
                        sizeMB: result.sizeMB,
                        index: i
                    });
                } catch (error) {
                    errors.push({
                        file: filePath,
                        error: error.message,
                        index: i
                    });
                }
            }

            // Prepare JSON data
            const jsonData = {
                type: 'excel-json-batch',
                created: new Date().toISOString(),
                totalFiles: filePaths.length,
                successful: results.length,
                failed: errors.length,
                files: results,
                errors: errors
            };

            // Write JSON file
            await fs.writeFile(outputPath, JSON.stringify(jsonData, null, 2), 'utf-8');

            return {
                success: true,
                outputPath: outputPath,
                totalFiles: filePaths.length,
                successful: results.length,
                failed: errors.length,
                errors: errors
            };
        } catch (error) {
            throw new ExcelConversionError(`Failed to create batch JSON: ${error.message}`);
        }
    }

    /**
     * Batch convert JSON to Excel/CSV files
     * @param {string} jsonPath - Path to JSON file with batch data
     * @param {string} outputDir - Output directory for Excel/CSV files
     * @param {string} format - Output format (xlsx, csv, xls)
     * @returns {Promise<Object>} Result object with conversion info
     */
    static async batchJsonToExcel(jsonPath, outputDir, format = 'xlsx') {
        try {
            // Read and parse JSON file
            const jsonContent = await fs.readFile(jsonPath, 'utf-8');
            const jsonData = JSON.parse(jsonContent);

            // Validate JSON structure
            if (jsonData.type !== 'excel-json-batch' || !Array.isArray(jsonData.files)) {
                throw new ExcelConversionError('Invalid JSON format. Expected excel-json-batch type.');
            }

            // Ensure output directory exists
            await fs.mkdir(outputDir, { recursive: true });

            const results = [];
            const errors = [];

            for (const fileData of jsonData.files) {
                try {
                    // Validate data
                    if (!fileData.data || !Array.isArray(fileData.data) || fileData.data.length === 0) {
                        throw new Error('Invalid or empty data array');
                    }

                    // Determine output filename
                    const baseName = path.parse(fileData.filename).name;
                    const outputFileName = `${baseName}.${format}`;
                    const outputPath = path.join(outputDir, outputFileName);

                    // Convert JSON to Excel/CSV
                    const result = await this.jsonToExcel(
                        fileData.data,
                        outputPath,
                        fileData.sheetName || 'Sheet1'
                    );
                    
                    results.push({
                        originalFilename: fileData.filename,
                        outputPath: result.path,
                        outputFilename: result.fileName,
                        format: result.format,
                        rowCount: result.rowCount,
                        columnCount: result.columnCount,
                        size: result.size,
                        sizeKB: result.sizeKB,
                        sizeMB: result.sizeMB
                    });
                } catch (error) {
                    errors.push({
                        filename: fileData.filename,
                        error: error.message
                    });
                }
            }

            return {
                success: true,
                outputDir: outputDir,
                totalFiles: jsonData.files.length,
                successful: results.length,
                failed: errors.length,
                results: results,
                errors: errors
            };
        } catch (error) {
            if (error instanceof ExcelConversionError) {
                throw error;
            }
            throw new ExcelConversionError(`Failed to process JSON batch: ${error.message}`);
        }
    }

    /**
     * Validate Excel/CSV file
     * @param {Buffer} buffer - File buffer
     * @returns {boolean} True if valid
     */
    static isValidExcel(buffer) {
        try {
            XLSX.read(buffer, { type: 'buffer' });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Get supported formats
     * @returns {Array<string>} Array of supported formats
     */
    static getSupportedFormats() {
        return ['xlsx', 'xls', 'csv', 'xlsb', 'ods'];
    }
}

module.exports = { ExcelConverter, ExcelConversionError };
