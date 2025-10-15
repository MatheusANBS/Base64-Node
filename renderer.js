/**
 * Renderer Process
 * UI Logic for Base64 Converter
 */

// State
let currentImagePath = null;
let selectedFiles = [];
let outputDirectory = null;

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all tabs
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab
        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab') + '-tab';
        document.getElementById(tabId).classList.add('active');
    });
});

// ============ ENCODE TAB ============

// Select image button
document.getElementById('select-image-btn').addEventListener('click', async () => {
    const filePath = await window.electronAPI.selectImageFile();
    if (filePath) {
        currentImagePath = filePath;
        const fileInfo = await window.electronAPI.getFileInfo(filePath);
        
        document.getElementById('selected-image-name').textContent = fileInfo.name;
        document.getElementById('encode-btn').disabled = false;
        
        // Show preview
        const result = await window.electronAPI.readFile(filePath);
        if (result.success) {
            const preview = document.getElementById('encode-preview');
            preview.innerHTML = `<img src="data:image/png;base64,${result.data}" alt="Preview">`;
        }
    }
});

// Encode button
document.getElementById('encode-btn').addEventListener('click', async () => {
    if (!currentImagePath) return;
    
    const includeMime = document.getElementById('include-mime-encode').checked;
    
    try {
        const result = await window.electronAPI.readFile(currentImagePath);
        if (!result.success) {
            showInfo('encode-info', 'Error reading file: ' + result.error, 'error');
            return;
        }
        
        let base64String = result.data;
        
        if (includeMime) {
            const fileInfo = await window.electronAPI.getFileInfo(currentImagePath);
            const ext = fileInfo.extension.toLowerCase();
            let mimeType = 'image/png';
            
            if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
            else if (ext === '.gif') mimeType = 'image/gif';
            else if (ext === '.webp') mimeType = 'image/webp';
            else if (ext === '.bmp') mimeType = 'image/bmp';
            
            base64String = `data:${mimeType};base64,${base64String}`;
        }
        
        document.getElementById('base64-output').value = base64String;
        
        const sizeKB = (base64String.length / 1024).toFixed(2);
        showInfo('encode-info', `✅ Conversion successful! Size: ${sizeKB} KB`, 'success');
        
    } catch (error) {
        showInfo('encode-info', 'Error: ' + error.message, 'error');
    }
});

// Copy Base64 button
document.getElementById('copy-base64-btn').addEventListener('click', () => {
    const textarea = document.getElementById('base64-output');
    textarea.select();
    document.execCommand('copy');
    showInfo('encode-info', '📋 Copied to clipboard!', 'success');
});

// Save Base64 button
document.getElementById('save-base64-btn').addEventListener('click', async () => {
    const base64Text = document.getElementById('base64-output').value;
    if (!base64Text) return;
    
    const filePath = await window.electronAPI.selectSaveLocation('base64.txt', [
        { name: 'Text Files', extensions: ['txt'] },
        { name: 'All Files', extensions: ['*'] }
    ]);
    
    if (filePath) {
        const result = await window.electronAPI.writeTextFile(filePath, base64Text);
        if (result.success) {
            showInfo('encode-info', '💾 File saved successfully!', 'success');
        } else {
            showInfo('encode-info', 'Error saving file: ' + result.error, 'error');
        }
    }
});

// ============ DECODE TAB ============

// Quality slider
document.getElementById('quality-slider').addEventListener('input', (e) => {
    document.getElementById('quality-value').textContent = e.target.value;
});

// Preview button
document.getElementById('preview-btn').addEventListener('click', async () => {
    const base64Input = document.getElementById('base64-input').value.trim();
    if (!base64Input) {
        showInfo('decode-info', 'Please enter a Base64 string', 'error');
        return;
    }
    
    try {
        // Remove data URL prefix if present
        let base64Data = base64Input;
        if (base64Data.includes(',') && base64Data.toLowerCase().startsWith('data:')) {
            base64Data = base64Data.split(',')[1];
        }
        
        // Create preview
        const preview = document.getElementById('decode-preview');
        preview.innerHTML = `<img src="data:image/png;base64,${base64Data}" alt="Preview" style="max-width: 100%; max-height: 400px; object-fit: contain;">`;
        
        showInfo('decode-info', '👁️ Preview loaded successfully!', 'success');
    } catch (error) {
        showInfo('decode-info', `Error creating preview: ${error.message}`, 'error');
    }
});

// Decode button
document.getElementById('decode-btn').addEventListener('click', async () => {
    const base64Input = document.getElementById('base64-input').value.trim();
    if (!base64Input) {
        showInfo('decode-info', 'Please enter a Base64 string', 'error');
        return;
    }
    
    try {
        // Remove data URL prefix if present
        let base64Data = base64Input;
        if (base64Data.includes(',') && base64Data.toLowerCase().startsWith('data:')) {
            base64Data = base64Data.split(',')[1];
        }
        
        // Select save location
        const format = document.getElementById('output-format').value;
        const filePath = await window.electronAPI.selectSaveLocation('image' + format, [
            { name: 'Image Files', extensions: [format.replace('.', '')] },
            { name: 'All Files', extensions: ['*'] }
        ]);
        
        if (!filePath) return;
        
        // Save file
        const result = await window.electronAPI.writeFile(filePath, base64Data);
        
        if (result.success) {
            showInfo('decode-info', '✅ Image saved successfully!', 'success');
            
            // Show preview
            const preview = document.getElementById('decode-preview');
            preview.innerHTML = `<img src="data:image/png;base64,${base64Data}" alt="Decoded Image">`;
        } else {
            showInfo('decode-info', 'Error saving image: ' + result.error, 'error');
        }
        
    } catch (error) {
        showInfo('decode-info', 'Error: ' + error.message, 'error');
    }
});

// ============ BATCH TAB ============

// Select multiple images
document.getElementById('select-multiple-images-btn').addEventListener('click', async () => {
    const filePaths = await window.electronAPI.selectImageFiles();
    if (filePaths && filePaths.length > 0) {
        selectedFiles = filePaths;
        document.getElementById('selected-count').textContent = `${filePaths.length} file(s) selected`;
        
        // Display file list
        const listContainer = document.getElementById('batch-list');
        listContainer.innerHTML = '';
        
        filePaths.forEach(filePath => {
            const item = document.createElement('div');
            item.className = 'batch-item';
            const fileName = filePath.split('\\').pop().split('/').pop();
            item.innerHTML = `
                <span>${fileName}</span>
                <span style="color: #666; font-size: 0.9rem;">${filePath}</span>
            `;
            listContainer.appendChild(item);
        });
        
        updateBatchButton();
    }
});

// Select output directory
document.getElementById('select-output-dir-btn').addEventListener('click', async () => {
    const dirPath = await window.electronAPI.selectDirectory();
    if (dirPath) {
        outputDirectory = dirPath;
        const dirName = dirPath.split('\\').pop().split('/').pop();
        document.getElementById('output-dir-name').textContent = dirName;
        updateBatchButton();
    }
});

function updateBatchButton() {
    const canConvert = selectedFiles.length > 0 && outputDirectory;
    document.getElementById('batch-convert-btn').disabled = !canConvert;
}

// Batch convert button
document.getElementById('batch-convert-btn').addEventListener('click', async () => {
    if (selectedFiles.length === 0 || !outputDirectory) return;
    
    const format = document.getElementById('batch-format').value;
    const includeMime = document.getElementById('include-mime-batch').checked;
    
    // Show progress
    const progressContainer = document.getElementById('batch-progress');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    progressContainer.style.display = 'block';
    progressFill.style.width = '0%';
    progressText.textContent = 'Starting...';
    
    try {
        const total = selectedFiles.length;
        let completed = 0;
        const results = [];
        
        for (const filePath of selectedFiles) {
            const fileInfo = await window.electronAPI.getFileInfo(filePath);
            const result = await window.electronAPI.readFile(filePath);
            
            if (result.success) {
                let base64String = result.data;
                
                if (includeMime) {
                    const ext = fileInfo.extension.toLowerCase();
                    let mimeType = 'image/png';
                    if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
                    else if (ext === '.gif') mimeType = 'image/gif';
                    else if (ext === '.webp') mimeType = 'image/webp';
                    
                    base64String = `data:${mimeType};base64,${base64String}`;
                }
                
                results.push({
                    filename: fileInfo.name,
                    base64: base64String,
                    extension: fileInfo.extension
                });
            }
            
            completed++;
            const percent = Math.round((completed / total) * 100);
            progressFill.style.width = percent + '%';
            progressText.textContent = `Processing ${completed}/${total} (${percent}%)`;
        }
        
        // Save results based on format
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
        
        if (format === 'txt') {
            // Save separate files
            for (const item of results) {
                const baseName = item.filename.replace(/\.[^/.]+$/, '');
                const outputPath = `${outputDirectory}\\${baseName}.txt`;
                await window.electronAPI.writeTextFile(outputPath, item.base64);
            }
        } else if (format === 'json') {
            const outputPath = `${outputDirectory}\\batch_${timestamp}.json`;
            await window.electronAPI.writeTextFile(outputPath, JSON.stringify(results, null, 2));
        } else if (format === 'csv') {
            let csv = 'filename,extension,base64\n';
            results.forEach(item => {
                csv += `"${item.filename}","${item.extension}","${item.base64}"\n`;
            });
            const outputPath = `${outputDirectory}\\batch_${timestamp}.csv`;
            await window.electronAPI.writeTextFile(outputPath, csv);
        } else if (format === 'xml') {
            let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<images>\n';
            results.forEach(item => {
                xml += '  <image>\n';
                xml += `    <filename>${item.filename}</filename>\n`;
                xml += `    <extension>${item.extension}</extension>\n`;
                xml += `    <base64>${item.base64}</base64>\n`;
                xml += '  </image>\n';
            });
            xml += '</images>\n';
            const outputPath = `${outputDirectory}\\batch_${timestamp}.xml`;
            await window.electronAPI.writeTextFile(outputPath, xml);
        }
        
        progressText.textContent = `✅ Completed! ${completed} file(s) converted`;
        showInfo('batch-info', `✅ Successfully converted ${completed} file(s) to ${format.toUpperCase()}!`, 'success');
        
    } catch (error) {
        showInfo('batch-info', 'Error: ' + error.message, 'error');
        progressContainer.style.display = 'none';
    }
});

// Helper function to show info messages
function showInfo(elementId, message, type = 'info') {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = 'info-text';
    if (type === 'success') element.classList.add('success');
    if (type === 'error') element.classList.add('error');
    element.style.display = 'block';
}

// ============ PDF TAB ============

let currentPDFPath = null;

// Select PDF file for encoding
document.getElementById('select-pdf-encode-btn').addEventListener('click', async () => {
    const filePath = await window.electronAPI.selectPDFFile();
    if (filePath) {
        currentPDFPath = filePath;
        const fileInfo = await window.electronAPI.getFileInfo(filePath);
        
        document.getElementById('selected-pdf-name').textContent = fileInfo.name;
        document.getElementById('pdf-encode-btn').disabled = false;
    }
});

// PDF to Base64 conversion
document.getElementById('pdf-encode-btn').addEventListener('click', async () => {
    if (!currentPDFPath) return;
    
    const includeMime = document.getElementById('include-mime-pdf-encode').checked;
    
    try {
        showInfo('pdf-encode-info', '⏳ Converting PDF to Base64...', 'info');
        
        const result = await window.electronAPI.pdfToBase64(currentPDFPath, includeMime);
        
        if (!result.success) {
            showInfo('pdf-encode-info', 'Error: ' + result.error, 'error');
            return;
        }
        
        document.getElementById('pdf-base64-output').value = result.data;
        
        const sizeInfo = result.sizeMB > 1 
            ? `${result.sizeMB} MB` 
            : `${result.sizeKB} KB`;
        
        showInfo('pdf-encode-info', 
            `✅ Conversion successful! File: ${result.fileName}, Size: ${sizeInfo}`, 
            'success');
        
    } catch (error) {
        showInfo('pdf-encode-info', 'Error: ' + error.message, 'error');
    }
});

// Copy PDF Base64 button
document.getElementById('copy-pdf-base64-btn').addEventListener('click', () => {
    const textarea = document.getElementById('pdf-base64-output');
    if (!textarea.value) {
        showInfo('pdf-encode-info', '⚠️ No Base64 data to copy', 'error');
        return;
    }
    textarea.select();
    document.execCommand('copy');
    showInfo('pdf-encode-info', '📋 Copied to clipboard!', 'success');
});

// Save PDF Base64 button
document.getElementById('save-pdf-base64-btn').addEventListener('click', async () => {
    const base64Text = document.getElementById('pdf-base64-output').value;
    if (!base64Text) {
        showInfo('pdf-encode-info', '⚠️ No Base64 data to save', 'error');
        return;
    }
    
    const filePath = await window.electronAPI.selectSaveLocation('pdf-base64.txt', [
        { name: 'Text Files', extensions: ['txt'] },
        { name: 'All Files', extensions: ['*'] }
    ]);
    
    if (filePath) {
        const result = await window.electronAPI.writeTextFile(filePath, base64Text);
        if (result.success) {
            showInfo('pdf-encode-info', '💾 Base64 saved successfully!', 'success');
        } else {
            showInfo('pdf-encode-info', 'Error saving file: ' + result.error, 'error');
        }
    }
});

// PDF Preview button
document.getElementById('pdf-preview-btn').addEventListener('click', async () => {
    const base64Input = document.getElementById('pdf-base64-input').value.trim();
    
    if (!base64Input) {
        showInfo('pdf-decode-info', '⚠️ Please paste Base64 string first', 'error');
        return;
    }
    
    try {
        // Clean base64 string
        let cleanBase64 = base64Input;
        
        // Remove data URL prefix if present
        if (cleanBase64.includes(',') && cleanBase64.toLowerCase().startsWith('data:')) {
            cleanBase64 = cleanBase64.split(',')[1];
        }
        
        // Create data URL for preview
        const dataUrl = `data:application/pdf;base64,${cleanBase64}`;
        
        // Show preview container
        const previewContainer = document.getElementById('pdf-decode-preview');
        const previewEmbed = document.getElementById('pdf-preview-embed');
        
        previewEmbed.src = dataUrl;
        previewContainer.style.display = 'block';
        
        showInfo('pdf-decode-info', '👁️ PDF preview loaded successfully!', 'success');
        
    } catch (error) {
        showInfo('pdf-decode-info', 'Error loading preview: ' + error.message, 'error');
    }
});

// Base64 to PDF conversion
document.getElementById('pdf-decode-btn').addEventListener('click', async () => {
    const base64Input = document.getElementById('pdf-base64-input').value.trim();
    
    if (!base64Input) {
        showInfo('pdf-decode-info', '⚠️ Please paste Base64 string', 'error');
        return;
    }
    
    try {
        showInfo('pdf-decode-info', '⏳ Converting Base64 to PDF...', 'info');
        
        // Ask for save location
        const filePath = await window.electronAPI.selectSaveLocation('converted.pdf', [
            { name: 'PDF Files', extensions: ['pdf'] },
            { name: 'All Files', extensions: ['*'] }
        ]);
        
        if (!filePath) {
            showInfo('pdf-decode-info', '❌ Conversion cancelled', 'error');
            return;
        }
        
        const result = await window.electronAPI.base64ToPDF(base64Input, filePath);
        
        if (!result.success) {
            showInfo('pdf-decode-info', 'Error: ' + result.error, 'error');
            return;
        }
        
        const sizeInfo = result.sizeMB > 1 
            ? `${result.sizeMB} MB` 
            : `${result.sizeKB} KB`;
        
        showInfo('pdf-decode-info', 
            `✅ PDF saved successfully! File: ${result.fileName}, Size: ${sizeInfo}`, 
            'success');
        
        // Clear input and preview
        document.getElementById('pdf-base64-input').value = '';
        document.getElementById('pdf-decode-preview').style.display = 'none';
        
    } catch (error) {
        showInfo('pdf-decode-info', 'Error: ' + error.message, 'error');
    }
});

// ============ PDF BATCH TAB ============

let selectedPDFFiles = [];
let pdfOutputDirectory = null;

// Select multiple PDFs button
document.getElementById('select-multiple-pdfs-btn').addEventListener('click', async () => {
    const filePaths = await window.electronAPI.selectPDFFiles();
    if (filePaths && filePaths.length > 0) {
        selectedPDFFiles = filePaths;
        document.getElementById('selected-pdf-count').textContent = `${filePaths.length} file(s) selected`;
        
        // Display file list
        const listContainer = document.getElementById('pdf-batch-list');
        listContainer.innerHTML = '';
        
        for (const filePath of filePaths) {
            const fileInfo = await window.electronAPI.getFileInfo(filePath);
            const fileItem = document.createElement('div');
            fileItem.className = 'batch-item';
            fileItem.innerHTML = `
                <span class="file-icon">📄</span>
                <span class="file-name">${fileInfo.name}</span>
                <span class="file-size">${(fileInfo.size / 1024).toFixed(2)} KB</span>
            `;
            listContainer.appendChild(fileItem);
        }
        
        // Enable convert button if output directory is selected
        if (pdfOutputDirectory) {
            document.getElementById('pdf-batch-convert-btn').disabled = false;
        }
    }
});

// Select output directory for PDF batch
document.getElementById('select-pdf-output-dir-btn').addEventListener('click', async () => {
    const dirPath = await window.electronAPI.selectDirectory();
    if (dirPath) {
        pdfOutputDirectory = dirPath;
        document.getElementById('pdf-output-dir-name').textContent = dirPath;
        
        // Enable convert button if files are selected
        if (selectedPDFFiles.length > 0) {
            document.getElementById('pdf-batch-convert-btn').disabled = false;
        }
    }
});

// PDF Batch convert button
document.getElementById('pdf-batch-convert-btn').addEventListener('click', async () => {
    if (selectedPDFFiles.length === 0 || !pdfOutputDirectory) return;
    
    const format = document.getElementById('pdf-batch-format').value;
    const includeMime = document.getElementById('include-mime-pdf-batch').checked;
    
    const progressContainer = document.getElementById('pdf-batch-progress');
    const progressFill = document.getElementById('pdf-progress-fill');
    const progressText = document.getElementById('pdf-progress-text');
    
    try {
        progressContainer.style.display = 'block';
        progressFill.style.width = '0%';
        progressText.textContent = 'Starting conversion...';
        
        const results = [];
        const total = selectedPDFFiles.length;
        let completed = 0;
        
        for (const filePath of selectedPDFFiles) {
            const fileInfo = await window.electronAPI.getFileInfo(filePath);
            const result = await window.electronAPI.pdfToBase64(filePath, includeMime);
            
            if (result.success) {
                results.push({
                    filename: fileInfo.name,
                    base64: result.data,
                    size: result.size,
                    sizeKB: result.sizeKB,
                    sizeMB: result.sizeMB
                });
            }
            
            completed++;
            const percent = Math.round((completed / total) * 100);
            progressFill.style.width = percent + '%';
            progressText.textContent = `Processing ${completed}/${total} (${percent}%)`;
        }
        
        // Save results based on format
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
        
        if (format === 'txt') {
            // Save separate files
            for (const item of results) {
                const baseName = item.filename.replace(/\.[^/.]+$/, '');
                const outputPath = `${pdfOutputDirectory}\\${baseName}.txt`;
                await window.electronAPI.writeTextFile(outputPath, item.base64);
            }
        } else if (format === 'json') {
            const outputPath = `${pdfOutputDirectory}\\pdf_batch_${timestamp}.json`;
            await window.electronAPI.writeTextFile(outputPath, JSON.stringify(results, null, 2));
        } else if (format === 'csv') {
            let csv = 'filename,size_bytes,size_kb,size_mb,base64\n';
            results.forEach(item => {
                csv += `"${item.filename}","${item.size}","${item.sizeKB}","${item.sizeMB}","${item.base64}"\n`;
            });
            const outputPath = `${pdfOutputDirectory}\\pdf_batch_${timestamp}.csv`;
            await window.electronAPI.writeTextFile(outputPath, csv);
        } else if (format === 'xml') {
            let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<pdfs>\n';
            results.forEach(item => {
                xml += '  <pdf>\n';
                xml += `    <filename>${item.filename}</filename>\n`;
                xml += `    <size_bytes>${item.size}</size_bytes>\n`;
                xml += `    <size_kb>${item.sizeKB}</size_kb>\n`;
                xml += `    <size_mb>${item.sizeMB}</size_mb>\n`;
                xml += `    <base64>${item.base64}</base64>\n`;
                xml += '  </pdf>\n';
            });
            xml += '</pdfs>\n';
            const outputPath = `${pdfOutputDirectory}\\pdf_batch_${timestamp}.xml`;
            await window.electronAPI.writeTextFile(outputPath, xml);
        }
        
        progressText.textContent = `✅ Completed! ${completed} PDF(s) converted`;
        showInfo('pdf-batch-info', `✅ Successfully converted ${completed} PDF file(s) to ${format.toUpperCase()}!`, 'success');
        
    } catch (error) {
        showInfo('pdf-batch-info', 'Error: ' + error.message, 'error');
        progressContainer.style.display = 'none';
    }
});

// ============ PDF BATCH REVERSE (JSON to PDFs) ============

let jsonData = null;
let reverseOutputDirectory = null;

// Select JSON file
document.getElementById('select-json-file-btn').addEventListener('click', async () => {
    const filePath = await window.electronAPI.selectJSONFile();
    if (!filePath) return;
    
    try {
        const result = await window.electronAPI.readJSONFile(filePath);
        
        if (!result.success) {
            showInfo('pdf-batch-reverse-info', 'Error reading JSON: ' + result.error, 'error');
            return;
        }
        
        jsonData = result.data;
        
        // Validate JSON structure
        if (!Array.isArray(jsonData)) {
            showInfo('pdf-batch-reverse-info', '⚠️ Invalid JSON format. Expected an array of objects.', 'error');
            jsonData = null;
            return;
        }
        
        // Check if items have required fields
        const validItems = jsonData.filter(item => item.filename && item.base64);
        
        if (validItems.length === 0) {
            showInfo('pdf-batch-reverse-info', '⚠️ No valid PDF data found in JSON. Each item needs "filename" and "base64" fields.', 'error');
            jsonData = null;
            return;
        }
        
        jsonData = validItems;
        
        const fileInfo = await window.electronAPI.getFileInfo(filePath);
        document.getElementById('selected-json-name').textContent = fileInfo.name;
        
        // Show preview
        const previewContainer = document.getElementById('json-preview');
        const itemsCount = document.getElementById('json-items-count');
        const itemsList = document.getElementById('json-items-list');
        
        itemsCount.textContent = `${validItems.length} PDF(s) found in JSON`;
        
        itemsList.innerHTML = '';
        validItems.forEach((item, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'batch-item';
            const sizeInfo = item.sizeKB ? `${item.sizeKB} KB` : 'Size unknown';
            fileItem.innerHTML = `
                <span class="file-icon">📄</span>
                <span class="file-name">${item.filename}</span>
                <span class="file-size">${sizeInfo}</span>
            `;
            itemsList.appendChild(fileItem);
        });
        
        previewContainer.style.display = 'block';
        
        // Enable convert button if output directory is selected
        if (reverseOutputDirectory) {
            document.getElementById('pdf-batch-reverse-btn').disabled = false;
        }
        
        showInfo('pdf-batch-reverse-info', `✅ JSON loaded successfully! ${validItems.length} PDF(s) ready to convert.`, 'success');
        
    } catch (error) {
        showInfo('pdf-batch-reverse-info', 'Error: ' + error.message, 'error');
        jsonData = null;
    }
});

// Select output directory for reverse conversion
document.getElementById('select-reverse-output-dir-btn').addEventListener('click', async () => {
    const dirPath = await window.electronAPI.selectDirectory();
    if (dirPath) {
        reverseOutputDirectory = dirPath;
        document.getElementById('reverse-output-dir-name').textContent = dirPath;
        
        // Enable convert button if JSON is loaded
        if (jsonData && jsonData.length > 0) {
            document.getElementById('pdf-batch-reverse-btn').disabled = false;
        }
    }
});

// PDF Batch Reverse (JSON to PDFs)
document.getElementById('pdf-batch-reverse-btn').addEventListener('click', async () => {
    if (!jsonData || jsonData.length === 0 || !reverseOutputDirectory) return;
    
    const progressContainer = document.getElementById('pdf-reverse-progress');
    const progressFill = document.getElementById('pdf-reverse-progress-fill');
    const progressText = document.getElementById('pdf-reverse-progress-text');
    
    try {
        progressContainer.style.display = 'block';
        progressFill.style.width = '0%';
        progressText.textContent = 'Starting reverse conversion...';
        
        const total = jsonData.length;
        let completed = 0;
        let successful = 0;
        const errors = [];
        
        for (const item of jsonData) {
            try {
                // Generate output filename
                let outputFilename = item.filename;
                
                // Ensure .pdf extension
                if (!outputFilename.toLowerCase().endsWith('.pdf')) {
                    outputFilename += '.pdf';
                }
                
                const outputPath = `${reverseOutputDirectory}\\${outputFilename}`;
                
                // Convert Base64 to PDF
                const result = await window.electronAPI.base64ToPDF(item.base64, outputPath);
                
                if (result.success) {
                    successful++;
                } else {
                    errors.push(`${outputFilename}: ${result.error}`);
                }
                
            } catch (error) {
                errors.push(`${item.filename}: ${error.message}`);
            }
            
            completed++;
            const percent = Math.round((completed / total) * 100);
            progressFill.style.width = percent + '%';
            progressText.textContent = `Converting ${completed}/${total} (${percent}%) - ${successful} successful`;
        }
        
        // Show final result
        progressText.textContent = `✅ Completed! ${successful}/${total} PDF(s) converted successfully`;
        
        let message = `✅ Successfully converted ${successful} out of ${total} PDF(s)!`;
        if (errors.length > 0) {
            message += `\n\n⚠️ ${errors.length} error(s) occurred:\n${errors.slice(0, 3).join('\n')}`;
            if (errors.length > 3) {
                message += `\n... and ${errors.length - 3} more.`;
            }
        }
        
        showInfo('pdf-batch-reverse-info', message, successful === total ? 'success' : 'error');
        
    } catch (error) {
        showInfo('pdf-batch-reverse-info', 'Error: ' + error.message, 'error');
        progressContainer.style.display = 'none';
    }
});
