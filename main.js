/**
 * Electron Main Process
 * Base64 Converter Desktop App
 */

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const PDFConverter = require('./core/pdfConverter');
const { ImageConverter } = require('./core/imageConverter');
const { ExcelConverter } = require('./core/excelConverter');
const PDFSearcher = require('./core/pdfSearcher');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        },
        title: 'Base64 Converter',
        icon: path.join(__dirname, 'assets', 'icon.ico'),
        backgroundColor: '#1e1e1e'
    });

    mainWindow.loadFile('index.html');

    // Open DevTools in development
    if (process.argv.includes('--dev')) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// IPC Handlers

// Select image file
ipcMain.handle('select-image-file', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [
            { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff', 'ico', 'avif'] }
        ]
    });

    if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths[0];
    }
    return null;
});

// Select multiple image files
ipcMain.handle('select-image-files', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile', 'multiSelections'],
        filters: [
            { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff', 'ico', 'avif'] }
        ]
    });

    if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths;
    }
    return [];
});

// Select directory
ipcMain.handle('select-directory', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    });

    if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths[0];
    }
    return null;
});

// Select save location
ipcMain.handle('select-save-location', async (event, defaultName, filters) => {
    const result = await dialog.showSaveDialog(mainWindow, {
        defaultPath: defaultName,
        filters: filters || [
            { name: 'All Files', extensions: ['*'] }
        ]
    });

    if (!result.canceled) {
        return result.filePath;
    }
    return null;
});

// Read file
ipcMain.handle('read-file', async (event, filePath) => {
    try {
        const data = await fs.readFile(filePath);
        return { success: true, data: data.toString('base64') };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Read JSON file
ipcMain.handle('read-json-file', async (event, filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        const json = JSON.parse(data);
        return { success: true, data: json };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Write file
ipcMain.handle('write-file', async (event, filePath, data) => {
    try {
        const buffer = Buffer.from(data, 'base64');
        await fs.writeFile(filePath, buffer);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Write text file
ipcMain.handle('write-text-file', async (event, filePath, text) => {
    try {
        await fs.writeFile(filePath, text, 'utf-8');
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Get file info
ipcMain.handle('get-file-info', async (event, filePath) => {
    try {
        const stats = await fs.stat(filePath);
        return {
            success: true,
            size: stats.size,
            name: path.basename(filePath),
            extension: path.extname(filePath)
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Show message dialog
ipcMain.handle('show-message', async (event, type, title, message) => {
    await dialog.showMessageBox(mainWindow, {
        type: type, // 'none', 'info', 'error', 'question', 'warning'
        title: title,
        message: message
    });
});

// Select PDF file
ipcMain.handle('select-pdf-file', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [
            { name: 'PDF Files', extensions: ['pdf'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    });

    if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths[0];
    }
    return null;
});

// Select multiple PDF files
ipcMain.handle('select-pdf-files', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile', 'multiSelections'],
        filters: [
            { name: 'PDF Files', extensions: ['pdf'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    });

    if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths;
    }
    return [];
});

// Select JSON file
ipcMain.handle('select-json-file', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [
            { name: 'JSON Files', extensions: ['json'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    });

    if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths[0];
    }
    return null;
});

// Select Excel/CSV file
ipcMain.handle('select-excel-file', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [
            { name: 'Excel/CSV Files', extensions: ['xlsx', 'xls', 'csv', 'xlsb', 'ods'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    });

    if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths[0];
    }
    return null;
});

// Select multiple Excel/CSV files
ipcMain.handle('select-excel-files', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile', 'multiSelections'],
        filters: [
            { name: 'Excel/CSV Files', extensions: ['xlsx', 'xls', 'csv', 'xlsb', 'ods'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    });

    if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths;
    }
    return [];
});

// PDF to Base64
ipcMain.handle('pdf-to-base64', async (event, filePath, includeMime) => {
    try {
        const result = await PDFConverter.pdfToBase64(filePath, includeMime);
        return result;
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Base64 to PDF
ipcMain.handle('base64-to-pdf', async (event, base64String, outputPath) => {
    try {
        const result = await PDFConverter.base64ToPDF(base64String, outputPath);
        return result;
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// ============ IMAGE CONVERTER IPC HANDLERS ============

// Image to Base64
ipcMain.handle('image-to-base64', async (event, filePath, includeMime, resize, quality) => {
    try {
        const result = await ImageConverter.imageToBase64(filePath, includeMime, resize, quality);
        return result;
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Base64 to Image
ipcMain.handle('base64-to-image', async (event, base64String, outputPath, quality, optimize) => {
    try {
        const result = await ImageConverter.base64ToImage(base64String, outputPath, quality, optimize);
        return result;
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Batch Images to JSON
ipcMain.handle('batch-images-to-json', async (event, imagePaths, outputPath, includeMime) => {
    try {
        const result = await ImageConverter.batchImagesToJson(imagePaths, outputPath, includeMime);
        return result;
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Batch JSON to Images (Reverse)
ipcMain.handle('batch-json-to-images', async (event, jsonData, outputDir) => {
    try {
        // Create temporary JSON file
        const tempJsonPath = path.join(__dirname, 'temp_batch.json');
        await fs.writeFile(tempJsonPath, JSON.stringify(jsonData, null, 2), 'utf-8');
        
        // Process the batch conversion
        const result = await ImageConverter.batchJsonToImages(tempJsonPath, outputDir);
        
        // Clean up temporary file
        try {
            await fs.unlink(tempJsonPath);
        } catch (cleanupError) {
            console.warn('Failed to clean up temporary file:', cleanupError.message);
        }
        
        return result;
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Export Images to Various Formats
ipcMain.handle('export-images-to', async (event, imagePaths, outputPath, format, includeMime) => {
    try {
        const result = await ImageConverter.exportImagesTo(imagePaths, outputPath, format, includeMime);
        return result;
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// ============ EXCEL CONVERTER IPC HANDLERS ============

// Excel/CSV to JSON
ipcMain.handle('excel-to-json', async (event, filePath, sheetName) => {
    try {
        const result = await ExcelConverter.excelToJson(filePath, sheetName);
        return result;
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// JSON to Excel/CSV
ipcMain.handle('json-to-excel', async (event, jsonData, outputPath, sheetName) => {
    try {
        const result = await ExcelConverter.jsonToExcel(jsonData, outputPath, sheetName);
        return result;
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Get Workbook Info
ipcMain.handle('get-workbook-info', async (event, filePath) => {
    try {
        const result = await ExcelConverter.getWorkbookInfo(filePath);
        return result;
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Batch Excel/CSV to JSON
ipcMain.handle('batch-excel-to-json', async (event, filePaths, outputPath) => {
    try {
        const result = await ExcelConverter.batchExcelToJson(filePaths, outputPath);
        return result;
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Batch JSON to Excel/CSV (Reverse)
ipcMain.handle('batch-json-to-excel', async (event, jsonData, outputDir, format) => {
    try {
        // Create temporary JSON file
        const tempJsonPath = path.join(__dirname, 'temp_excel_batch.json');
        await fs.writeFile(tempJsonPath, JSON.stringify(jsonData, null, 2), 'utf-8');
        
        // Process the batch conversion
        const result = await ExcelConverter.batchJsonToExcel(tempJsonPath, outputDir, format);
        
        // Clean up temporary file
        try {
            await fs.unlink(tempJsonPath);
        } catch (cleanupError) {
            console.warn('Failed to clean up temporary file:', cleanupError.message);
        }
        
        return result;
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// ============ PDF AI SEARCH IPC HANDLERS ============

// Initialize OpenAI with API key
ipcMain.handle('init-openai', async (event, apiKey) => {
    try {
        PDFSearcher.initializeOpenAI(apiKey);
        return { success: true, message: 'OpenAI initialized successfully' };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Check if OpenAI is initialized
ipcMain.handle('is-openai-initialized', async () => {
    return { initialized: PDFSearcher.isOpenAIInitialized() };
});

// Extract text from PDF
ipcMain.handle('extract-pdf-text', async (event, filePath) => {
    try {
        const result = await PDFSearcher.extractTextFromPDF(filePath);
        return result;
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Search PDF with AI
ipcMain.handle('search-pdf-ai', async (event, pdfText, question, options) => {
    try {
        const result = await PDFSearcher.searchWithAI(pdfText, question, options);
        return result;
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Extract and search in one call
ipcMain.handle('extract-and-search-pdf', async (event, filePath, question, options) => {
    try {
        const result = await PDFSearcher.extractAndSearch(filePath, question, options);
        return result;
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Clear PDF cache
ipcMain.handle('clear-pdf-cache', async () => {
    try {
        PDFSearcher.clearCache();
        return { success: true, message: 'Cache cleared' };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

console.log('Base64 Converter Electron App Started');
