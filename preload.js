/**
 * Electron Preload Script
 * Exposes safe APIs to renderer process
 */

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    // File dialogs
    selectImageFile: () => ipcRenderer.invoke('select-image-file'),
    selectImageFiles: () => ipcRenderer.invoke('select-image-files'),
    selectDirectory: () => ipcRenderer.invoke('select-directory'),
    selectSaveLocation: (defaultName, filters) => ipcRenderer.invoke('select-save-location', defaultName, filters),
    selectPDFFile: () => ipcRenderer.invoke('select-pdf-file'),
    selectPDFFiles: () => ipcRenderer.invoke('select-pdf-files'),
    selectJSONFile: () => ipcRenderer.invoke('select-json-file'),
    selectExcelFile: () => ipcRenderer.invoke('select-excel-file'),
    selectExcelFiles: () => ipcRenderer.invoke('select-excel-files'),
    
    // File operations
    readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
    readJSONFile: (filePath) => ipcRenderer.invoke('read-json-file', filePath),
    writeFile: (filePath, data) => ipcRenderer.invoke('write-file', filePath, data),
    writeTextFile: (filePath, text) => ipcRenderer.invoke('write-text-file', filePath, text),
    getFileInfo: (filePath) => ipcRenderer.invoke('get-file-info', filePath),
    
    // PDF operations
    pdfToBase64: (filePath, includeMime) => ipcRenderer.invoke('pdf-to-base64', filePath, includeMime),
    base64ToPDF: (base64String, outputPath) => ipcRenderer.invoke('base64-to-pdf', base64String, outputPath),
    
    // Image operations
    imageToBase64: (filePath, includeMime, resize, quality) => ipcRenderer.invoke('image-to-base64', filePath, includeMime, resize, quality),
    base64ToImage: (base64String, outputPath, quality, optimize) => ipcRenderer.invoke('base64-to-image', base64String, outputPath, quality, optimize),
    batchImagesToJson: (imagePaths, outputPath, includeMime) => ipcRenderer.invoke('batch-images-to-json', imagePaths, outputPath, includeMime),
    batchJsonToImages: (jsonData, outputDir) => ipcRenderer.invoke('batch-json-to-images', jsonData, outputDir),
    exportImagesTo: (imagePaths, outputPath, format, includeMime) => ipcRenderer.invoke('export-images-to', imagePaths, outputPath, format, includeMime),
    
    // Excel operations
    excelToJson: (filePath, sheetName) => ipcRenderer.invoke('excel-to-json', filePath, sheetName),
    jsonToExcel: (jsonData, outputPath, sheetName) => ipcRenderer.invoke('json-to-excel', jsonData, outputPath, sheetName),
    getWorkbookInfo: (filePath) => ipcRenderer.invoke('get-workbook-info', filePath),
    batchExcelToJson: (filePaths, outputPath) => ipcRenderer.invoke('batch-excel-to-json', filePaths, outputPath),
    batchJsonToExcel: (jsonData, outputDir, format) => ipcRenderer.invoke('batch-json-to-excel', jsonData, outputDir, format),
    
    // PDF AI Search operations
    initOpenAI: (apiKey) => ipcRenderer.invoke('init-openai', apiKey),
    isOpenAIInitialized: () => ipcRenderer.invoke('is-openai-initialized'),
    extractPDFText: (filePath) => ipcRenderer.invoke('extract-pdf-text', filePath),
    searchPDFWithAI: (pdfText, question, options) => ipcRenderer.invoke('search-pdf-ai', pdfText, question, options),
    extractAndSearchPDF: (filePath, question, options) => ipcRenderer.invoke('extract-and-search-pdf', filePath, question, options),
    clearPDFCache: () => ipcRenderer.invoke('clear-pdf-cache'),
    
    // Dialogs
    showMessage: (type, title, message) => ipcRenderer.invoke('show-message', type, title, message)
});

console.log('Preload script loaded');
