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
    
    // File operations
    readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
    readJSONFile: (filePath) => ipcRenderer.invoke('read-json-file', filePath),
    writeFile: (filePath, data) => ipcRenderer.invoke('write-file', filePath, data),
    writeTextFile: (filePath, text) => ipcRenderer.invoke('write-text-file', filePath, text),
    getFileInfo: (filePath) => ipcRenderer.invoke('get-file-info', filePath),
    
    // PDF operations
    pdfToBase64: (filePath, includeMime) => ipcRenderer.invoke('pdf-to-base64', filePath, includeMime),
    base64ToPDF: (base64String, outputPath) => ipcRenderer.invoke('base64-to-pdf', base64String, outputPath),
    
    // Dialogs
    showMessage: (type, title, message) => ipcRenderer.invoke('show-message', type, title, message)
});

console.log('Preload script loaded');
