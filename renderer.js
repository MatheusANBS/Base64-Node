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

// ============ IMAGE TAB (Unified Encode/Decode) ============

// Select image for encoding
document.getElementById('select-image-encode-btn').addEventListener('click', async () => {
    const filePath = await window.electronAPI.selectImageFile();
    if (filePath) {
        currentImagePath = filePath;
        const fileInfo = await window.electronAPI.getFileInfo(filePath);
        
        document.getElementById('selected-image-name').textContent = fileInfo.name;
        document.getElementById('image-encode-btn').disabled = false;
        
        // Show preview
        const result = await window.electronAPI.readFile(filePath);
        if (result.success) {
            const preview = document.getElementById('image-encode-preview');
            preview.innerHTML = `<img src="data:image/png;base64,${result.data}" alt="Preview" style="max-width: 100%; max-height: 300px; object-fit: contain;">`;
        }
    }
});

// Image to Base64 conversion
document.getElementById('image-encode-btn').addEventListener('click', async () => {
    if (!currentImagePath) return;
    
    const includeMime = document.getElementById('include-mime-image-encode').checked;
    
    try {
        showInfo('image-encode-info', '⏳ Converting image to Base64...', 'info');
        
        const result = await window.electronAPI.imageToBase64(currentImagePath, includeMime);
        
        if (!result.success) {
            showInfo('image-encode-info', 'Error: ' + result.error, 'error');
            return;
        }
        
        document.getElementById('image-base64-output').value = result.data;
        
        const sizeInfo = result.sizeMB > 1 
            ? `${result.sizeMB} MB` 
            : `${result.sizeKB} KB`;
        
        showInfo('image-encode-info', 
            `✅ Conversion successful! File: ${result.fileName}, Format: ${result.format}, Size: ${sizeInfo}, Dimensions: ${result.width}x${result.height}`, 
            'success');
        
    } catch (error) {
        showInfo('image-encode-info', 'Error: ' + error.message, 'error');
    }
});

// Copy Base64 button
document.getElementById('copy-image-base64-btn').addEventListener('click', () => {
    const textarea = document.getElementById('image-base64-output');
    if (!textarea.value) {
        showInfo('image-encode-info', '⚠️ No Base64 data to copy', 'error');
        return;
    }
    textarea.select();
    document.execCommand('copy');
    showInfo('image-encode-info', '📋 Copied to clipboard!', 'success');
});

// Save Base64 button
document.getElementById('save-image-base64-btn').addEventListener('click', async () => {
    const base64Text = document.getElementById('image-base64-output').value;
    if (!base64Text) {
        showInfo('image-encode-info', '⚠️ No Base64 data to save', 'error');
        return;
    }
    
    const filePath = await window.electronAPI.selectSaveLocation('image-base64.txt', [
        { name: 'Text Files', extensions: ['txt'] },
        { name: 'All Files', extensions: ['*'] }
    ]);
    
    if (filePath) {
        const result = await window.electronAPI.writeTextFile(filePath, base64Text);
        if (result.success) {
            showInfo('image-encode-info', '💾 Base64 saved successfully!', 'success');
        } else {
            showInfo('image-encode-info', 'Error saving file: ' + result.error, 'error');
        }
    }
});

// Quality slider for image decode
document.getElementById('image-quality-slider').addEventListener('input', (e) => {
    document.getElementById('image-quality-value').textContent = e.target.value;
});

// Image Preview button
document.getElementById('image-preview-btn').addEventListener('click', async () => {
    const base64Input = document.getElementById('image-base64-input').value.trim();
    
    if (!base64Input) {
        showInfo('image-decode-info', '⚠️ Please paste Base64 string first', 'error');
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
        const dataUrl = `data:image/png;base64,${cleanBase64}`;
        
        // Show preview container
        const previewContainer = document.getElementById('image-decode-preview');
        const previewImg = document.getElementById('image-preview-img');
        
        previewImg.src = dataUrl;
        previewContainer.style.display = 'block';
        
        showInfo('image-decode-info', '👁️ Image preview loaded successfully!', 'success');
        
    } catch (error) {
        showInfo('image-decode-info', 'Error loading preview: ' + error.message, 'error');
    }
});

// Base64 to Image conversion
document.getElementById('image-decode-btn').addEventListener('click', async () => {
    const base64Input = document.getElementById('image-base64-input').value.trim();
    
    if (!base64Input) {
        showInfo('image-decode-info', '⚠️ Please paste Base64 string', 'error');
        return;
    }
    
    try {
        showInfo('image-decode-info', '⏳ Converting Base64 to image...', 'info');
        
        // Get settings
        const format = document.getElementById('image-output-format').value;
        const quality = parseInt(document.getElementById('image-quality-slider').value);
        
        // Ask for save location
        const filePath = await window.electronAPI.selectSaveLocation('converted' + format, [
            { name: 'Image Files', extensions: [format.replace('.', '')] },
            { name: 'All Files', extensions: ['*'] }
        ]);
        
        if (!filePath) {
            showInfo('image-decode-info', '❌ Conversion cancelled', 'error');
            return;
        }
        
        const result = await window.electronAPI.base64ToImage(base64Input, filePath, quality);
        
        if (!result.success) {
            showInfo('image-decode-info', 'Error: ' + result.error, 'error');
            return;
        }
        
        const sizeInfo = result.sizeMB > 1 
            ? `${result.sizeMB} MB` 
            : `${result.sizeKB} KB`;
        
        showInfo('image-decode-info', 
            `✅ Image saved successfully! File: ${result.fileName}, Format: ${result.format}, Size: ${sizeInfo}, Dimensions: ${result.width}x${result.height}`, 
            'success');
        
        // Clear input and preview
        document.getElementById('image-base64-input').value = '';
        document.getElementById('image-decode-preview').style.display = 'none';
        
    } catch (error) {
        showInfo('image-decode-info', 'Error: ' + error.message, 'error');
    }
});

// ============ IMAGE BATCH TAB ============

let selectedImageFiles = [];
let imageOutputDirectory = null;

// Select multiple images for batch conversion
document.getElementById('select-multiple-images-btn').addEventListener('click', async () => {
    const filePaths = await window.electronAPI.selectImageFiles();
    if (filePaths && filePaths.length > 0) {
        selectedImageFiles = filePaths;
        document.getElementById('selected-image-count').textContent = `${filePaths.length} file(s) selected`;
        
        // Display file list
        const listContainer = document.getElementById('image-batch-list');
        listContainer.innerHTML = '';
        
        for (const filePath of filePaths) {
            const fileInfo = await window.electronAPI.getFileInfo(filePath);
            const fileItem = document.createElement('div');
            fileItem.className = 'batch-item';
            fileItem.innerHTML = `
                <span class="file-icon">🖼️</span>
                <span class="file-name">${fileInfo.name}</span>
                <span class="file-size">${(fileInfo.size / 1024).toFixed(2)} KB</span>
            `;
            listContainer.appendChild(fileItem);
        }
        
        // Enable convert button if output directory is selected
        if (imageOutputDirectory) {
            document.getElementById('image-batch-convert-btn').disabled = false;
        }
    }
});

// Select output directory for image batch
document.getElementById('select-image-output-dir-btn').addEventListener('click', async () => {
    const dirPath = await window.electronAPI.selectDirectory();
    if (dirPath) {
        imageOutputDirectory = dirPath;
        document.getElementById('image-output-dir-name').textContent = dirPath;
        
        // Enable convert button if files are selected
        if (selectedImageFiles.length > 0) {
            document.getElementById('image-batch-convert-btn').disabled = false;
        }
    }
});

// Image Batch convert button
document.getElementById('image-batch-convert-btn').addEventListener('click', async () => {
    if (selectedImageFiles.length === 0 || !imageOutputDirectory) return;
    
    const format = document.getElementById('image-batch-format').value;
    const includeMime = document.getElementById('include-mime-image-batch').checked;
    
    const progressContainer = document.getElementById('image-batch-progress');
    const progressFill = document.getElementById('image-progress-fill');
    const progressText = document.getElementById('image-progress-text');
    
    try {
        progressContainer.style.display = 'block';
        progressFill.style.width = '0%';
        progressText.textContent = 'Starting conversion...';
        
        const results = [];
        const total = selectedImageFiles.length;
        let completed = 0;
        
        for (const filePath of selectedImageFiles) {
            const fileInfo = await window.electronAPI.getFileInfo(filePath);
            const result = await window.electronAPI.imageToBase64(filePath, includeMime);
            
            if (result.success) {
                results.push({
                    filename: fileInfo.name,
                    originalPath: filePath,
                    base64: result.data,
                    format: result.format,
                    width: result.width,
                    height: result.height,
                    channels: result.channels,
                    size: result.size,
                    sizeKB: result.sizeKB,
                    sizeMB: result.sizeMB,
                    index: completed
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
                const outputPath = `${imageOutputDirectory}\\${baseName}.txt`;
                await window.electronAPI.writeTextFile(outputPath, item.base64);
            }
        } else if (format === 'json') {
            // Create JSON structure like the unified method
            const jsonData = {
                type: 'image-base64-batch',
                created: new Date().toISOString(),
                totalFiles: selectedImageFiles.length,
                successful: results.length,
                failed: selectedImageFiles.length - results.length,
                includeMimeType: includeMime,
                images: results,
                errors: []
            };
            
            const outputPath = `${imageOutputDirectory}\\image_batch_${timestamp}.json`;
            await window.electronAPI.writeTextFile(outputPath, JSON.stringify(jsonData, null, 2));
        } else if (format === 'csv') {
            let csv = 'filename,base64,format,width,height,channels,size,sizeKB,sizeMB\n';
            results.forEach(item => {
                csv += `"${item.filename}","${item.base64}","${item.format}","${item.width}","${item.height}","${item.channels}","${item.size}","${item.sizeKB}","${item.sizeMB}"\n`;
            });
            const outputPath = `${imageOutputDirectory}\\image_batch_${timestamp}.csv`;
            await window.electronAPI.writeTextFile(outputPath, csv);
        } else if (format === 'xml') {
            let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<images>\n';
            results.forEach(item => {
                xml += '  <image>\n';
                xml += `    <filename>${item.filename}</filename>\n`;
                xml += `    <format>${item.format}</format>\n`;
                xml += `    <width>${item.width}</width>\n`;
                xml += `    <height>${item.height}</height>\n`;
                xml += `    <channels>${item.channels}</channels>\n`;
                xml += `    <size>${item.size}</size>\n`;
                xml += `    <sizeKB>${item.sizeKB}</sizeKB>\n`;
                xml += `    <sizeMB>${item.sizeMB}</sizeMB>\n`;
                xml += `    <base64>${item.base64}</base64>\n`;
                xml += '  </image>\n';
            });
            xml += '</images>\n';
            const outputPath = `${imageOutputDirectory}\\image_batch_${timestamp}.xml`;
            await window.electronAPI.writeTextFile(outputPath, xml);
        }
        
        progressText.textContent = `✅ Completed! ${completed} image(s) converted`;
        showInfo('image-batch-info', `✅ Successfully converted ${completed} image(s) to ${format.toUpperCase()}!`, 'success');
        
    } catch (error) {
        showInfo('image-batch-info', 'Error: ' + error.message, 'error');
        progressContainer.style.display = 'none';
    }
});

// ============ IMAGE BATCH REVERSE (JSON to Images) ============

let imageJsonData = null;
let imageReverseOutputDirectory = null;

// Select JSON file for image reverse conversion
document.getElementById('select-image-json-file-btn').addEventListener('click', async () => {
    const filePath = await window.electronAPI.selectJSONFile();
    if (!filePath) return;
    
    try {
        const result = await window.electronAPI.readJSONFile(filePath);
        
        if (!result.success) {
            showInfo('image-batch-reverse-info', 'Error reading JSON: ' + result.error, 'error');
            return;
        }
        
        const data = result.data;
        
        // Validate JSON structure for image batch
        if (!data.type || data.type !== 'image-base64-batch' || !Array.isArray(data.images)) {
            showInfo('image-batch-reverse-info', '⚠️ Invalid JSON format. Expected image-base64-batch type with images array.', 'error');
            imageJsonData = null;
            return;
        }
        
        // Check if items have required fields
        const validItems = data.images.filter(item => item.filename && item.base64);
        
        if (validItems.length === 0) {
            showInfo('image-batch-reverse-info', '⚠️ No valid image data found in JSON. Each item needs "filename" and "base64" fields.', 'error');
            imageJsonData = null;
            return;
        }
        
        imageJsonData = data;
        
        const fileInfo = await window.electronAPI.getFileInfo(filePath);
        document.getElementById('selected-image-json-name').textContent = fileInfo.name;
        
        // Show preview
        const previewContainer = document.getElementById('image-json-preview');
        const itemsCount = document.getElementById('image-json-items-count');
        const itemsList = document.getElementById('image-json-items-list');
        
        itemsCount.textContent = `${validItems.length} image(s) found in JSON`;
        
        itemsList.innerHTML = '';
        validItems.forEach((item, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'batch-item';
            const sizeInfo = item.sizeKB ? `${item.sizeKB} KB` : 'Size unknown';
            const dimensionInfo = item.width && item.height ? `${item.width}x${item.height}` : 'Unknown dimensions';
            fileItem.innerHTML = `
                <span class="file-icon">🖼️</span>
                <span class="file-name">${item.filename}</span>
                <span class="file-info">${item.format || 'Unknown'} - ${sizeInfo} - ${dimensionInfo}</span>
            `;
            itemsList.appendChild(fileItem);
        });
        
        previewContainer.style.display = 'block';
        
        // Enable convert button if output directory is selected
        if (imageReverseOutputDirectory) {
            document.getElementById('image-batch-reverse-btn').disabled = false;
        }
        
        showInfo('image-batch-reverse-info', `✅ JSON loaded successfully! ${validItems.length} image(s) ready to convert.`, 'success');
        
    } catch (error) {
        showInfo('image-batch-reverse-info', 'Error: ' + error.message, 'error');
        imageJsonData = null;
    }
});

// Select output directory for image reverse conversion
document.getElementById('select-image-reverse-output-dir-btn').addEventListener('click', async () => {
    const dirPath = await window.electronAPI.selectDirectory();
    if (dirPath) {
        imageReverseOutputDirectory = dirPath;
        document.getElementById('image-reverse-output-dir-name').textContent = dirPath;
        
        // Enable convert button if JSON is loaded
        if (imageJsonData && imageJsonData.images && imageJsonData.images.length > 0) {
            document.getElementById('image-batch-reverse-btn').disabled = false;
        }
    }
});

// Image Batch Reverse (JSON to Images)
document.getElementById('image-batch-reverse-btn').addEventListener('click', async () => {
    if (!imageJsonData || !imageJsonData.images || imageJsonData.images.length === 0 || !imageReverseOutputDirectory) return;
    
    const progressContainer = document.getElementById('image-reverse-progress');
    const progressFill = document.getElementById('image-reverse-progress-fill');
    const progressText = document.getElementById('image-reverse-progress-text');
    
    try {
        progressContainer.style.display = 'block';
        progressFill.style.width = '0%';
        progressText.textContent = 'Starting reverse conversion...';
        
        const total = imageJsonData.images.length;
        let completed = 0;
        let successful = 0;
        const errors = [];
        
        for (const item of imageJsonData.images) {
            try {
                // Determine output filename and format
                let outputFilename = item.filename;
                const lastDotIndex = outputFilename.lastIndexOf('.');
                const originalExt = lastDotIndex >= 0 ? outputFilename.substring(lastDotIndex).toLowerCase() : '';
                
                // If no extension or unknown, use format from metadata
                if (!originalExt || !originalExt.match(/\.(png|jpg|jpeg|gif|bmp|webp|tiff|tif|ico|avif)$/)) {
                    const baseName = lastDotIndex >= 0 ? outputFilename.substring(0, lastDotIndex) : outputFilename;
                    outputFilename = `${baseName}.${item.format.toLowerCase()}`;
                }
                
                const outputPath = `${imageReverseOutputDirectory}\\${outputFilename}`;
                
                // Convert Base64 to Image
                const result = await window.electronAPI.base64ToImage(item.base64, outputPath);
                
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
        progressText.textContent = `✅ Completed! ${successful}/${total} image(s) converted successfully`;
        
        let message = `✅ Successfully converted ${successful} out of ${total} image(s)!`;
        if (errors.length > 0) {
            message += `\n\n⚠️ ${errors.length} error(s) occurred:\n${errors.slice(0, 3).join('\n')}`;
            if (errors.length > 3) {
                message += `\n... and ${errors.length - 3} more.`;
            }
        }
        
        showInfo('image-batch-reverse-info', message, successful === total ? 'success' : 'error');
        
    } catch (error) {
        showInfo('image-batch-reverse-info', 'Error: ' + error.message, 'error');
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

// ============ EXCEL TAB ============

let currentExcelPath = null;
let currentWorkbookInfo = null;

// Select Excel file for encoding
document.getElementById('select-excel-encode-btn').addEventListener('click', async () => {
    const filePath = await window.electronAPI.selectExcelFile();
    if (filePath) {
        currentExcelPath = filePath;
        const fileInfo = await window.electronAPI.getFileInfo(filePath);
        
        document.getElementById('selected-excel-name').textContent = fileInfo.name;
        
        // Get workbook info to show available sheets
        try {
            const workbookInfo = await window.electronAPI.getWorkbookInfo(filePath);
            
            if (workbookInfo.success) {
                currentWorkbookInfo = workbookInfo;
                
                // Populate sheet select
                const sheetSelect = document.getElementById('excel-sheet-select');
                sheetSelect.innerHTML = '';
                
                workbookInfo.sheets.forEach((sheet, index) => {
                    const option = document.createElement('option');
                    option.value = sheet.name;
                    option.textContent = `${sheet.name} (${sheet.rowCount} rows, ${sheet.columnCount} cols)`;
                    if (index === 0) option.selected = true;
                    sheetSelect.appendChild(option);
                });
                
                document.getElementById('excel-sheets-container').style.display = 'block';
                document.getElementById('excel-encode-btn').disabled = false;
            }
        } catch (error) {
            showInfo('excel-encode-info', 'Error reading file info: ' + error.message, 'error');
        }
    }
});

// Excel to JSON conversion
document.getElementById('excel-encode-btn').addEventListener('click', async () => {
    if (!currentExcelPath) return;
    
    const sheetName = document.getElementById('excel-sheet-select').value;
    
    try {
        showInfo('excel-encode-info', '⏳ Converting Excel/CSV to JSON...', 'info');
        
        const result = await window.electronAPI.excelToJson(currentExcelPath, sheetName);
        
        if (!result.success) {
            showInfo('excel-encode-info', 'Error: ' + result.error, 'error');
            return;
        }
        
        const jsonString = JSON.stringify(result.data, null, 2);
        document.getElementById('excel-json-output').value = jsonString;
        
        const sizeInfo = result.sizeMB > 1 ? `${result.sizeMB} MB` : `${result.sizeKB} KB`;
        
        showInfo('excel-encode-info', 
            `✅ Conversion successful! File: ${result.fileName}, Sheet: ${result.sheetName}, Rows: ${result.rowCount}, Size: ${sizeInfo}`, 
            'success');
        
    } catch (error) {
        showInfo('excel-encode-info', 'Error: ' + error.message, 'error');
    }
});

// Copy Excel JSON button
document.getElementById('copy-excel-json-btn').addEventListener('click', () => {
    const textarea = document.getElementById('excel-json-output');
    if (!textarea.value) {
        showInfo('excel-encode-info', '⚠️ No JSON data to copy', 'error');
        return;
    }
    textarea.select();
    document.execCommand('copy');
    showInfo('excel-encode-info', '📋 Copied to clipboard!', 'success');
});

// Save Excel JSON button
document.getElementById('save-excel-json-btn').addEventListener('click', async () => {
    const jsonText = document.getElementById('excel-json-output').value;
    if (!jsonText) {
        showInfo('excel-encode-info', '⚠️ No JSON data to save', 'error');
        return;
    }
    
    const filePath = await window.electronAPI.selectSaveLocation('data.json', [
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
    ]);
    
    if (filePath) {
        const result = await window.electronAPI.writeTextFile(filePath, jsonText);
        if (result.success) {
            showInfo('excel-encode-info', '💾 JSON saved successfully!', 'success');
        } else {
            showInfo('excel-encode-info', 'Error saving file: ' + result.error, 'error');
        }
    }
});

// Select JSON file for decode
let currentJsonDecodeData = null;

document.getElementById('select-json-decode-btn').addEventListener('click', async () => {
    const filePath = await window.electronAPI.selectJSONFile();
    if (!filePath) return;
    
    try {
        const result = await window.electronAPI.readJSONFile(filePath);
        
        if (!result.success) {
            showInfo('excel-decode-info', 'Error reading JSON: ' + result.error, 'error');
            return;
        }
        
        const jsonData = result.data;
        
        if (!Array.isArray(jsonData) || jsonData.length === 0) {
            showInfo('excel-decode-info', '⚠️ JSON must be a non-empty array', 'error');
            currentJsonDecodeData = null;
            return;
        }
        
        currentJsonDecodeData = jsonData;
        const fileInfo = await window.electronAPI.getFileInfo(filePath);
        document.getElementById('selected-json-decode-name').textContent = fileInfo.name;
        document.getElementById('excel-decode-btn').disabled = false;
        
        showInfo('excel-decode-info', `✅ JSON loaded successfully! ${jsonData.length} row(s) found`, 'success');
        
    } catch (error) {
        showInfo('excel-decode-info', 'Error: ' + error.message, 'error');
        currentJsonDecodeData = null;
    }
});

// JSON to Excel conversion
document.getElementById('excel-decode-btn').addEventListener('click', async () => {
    if (!currentJsonDecodeData) {
        showInfo('excel-decode-info', '⚠️ Please select a JSON file first', 'error');
        return;
    }
    
    try {
        showInfo('excel-decode-info', '⏳ Converting JSON to Excel/CSV...', 'info');
        
        const format = document.getElementById('excel-output-format').value;
        const sheetName = document.getElementById('excel-sheet-name').value || 'Sheet1';
        
        // Ask for save location
        const filePath = await window.electronAPI.selectSaveLocation(`data.${format}`, [
            { name: `${format.toUpperCase()} Files`, extensions: [format] },
            { name: 'All Files', extensions: ['*'] }
        ]);
        
        if (!filePath) {
            showInfo('excel-decode-info', '❌ Conversion cancelled', 'error');
            return;
        }
        
        const result = await window.electronAPI.jsonToExcel(currentJsonDecodeData, filePath, sheetName);
        
        if (!result.success) {
            showInfo('excel-decode-info', 'Error: ' + result.error, 'error');
            return;
        }
        
        const sizeInfo = result.sizeMB > 1 ? `${result.sizeMB} MB` : `${result.sizeKB} KB`;
        
        showInfo('excel-decode-info', 
            `✅ File saved successfully! Format: ${result.format}, Rows: ${result.rowCount}, Columns: ${result.columnCount}, Size: ${sizeInfo}`, 
            'success');
        
        // Clear selection
        currentJsonDecodeData = null;
        document.getElementById('selected-json-decode-name').textContent = 'No file selected';
        document.getElementById('excel-decode-btn').disabled = true;
        
    } catch (error) {
        showInfo('excel-decode-info', 'Error: ' + error.message, 'error');
    }
});

// ============ EXCEL BATCH TAB ============

let selectedExcelFiles = [];
let excelOutputDirectory = null;

// Select multiple Excel files
document.getElementById('select-multiple-excel-btn').addEventListener('click', async () => {
    const filePaths = await window.electronAPI.selectExcelFiles();
    if (filePaths && filePaths.length > 0) {
        selectedExcelFiles = filePaths;
        document.getElementById('selected-excel-count').textContent = `${filePaths.length} file(s) selected`;
        
        // Display file list
        const listContainer = document.getElementById('excel-batch-list');
        listContainer.innerHTML = '';
        
        for (const filePath of filePaths) {
            const fileInfo = await window.electronAPI.getFileInfo(filePath);
            const fileItem = document.createElement('div');
            fileItem.className = 'batch-item';
            fileItem.innerHTML = `
                <span class="file-icon">📊</span>
                <span class="file-name">${fileInfo.name}</span>
                <span class="file-size">${(fileInfo.size / 1024).toFixed(2)} KB</span>
            `;
            listContainer.appendChild(fileItem);
        }
        
        // Enable convert button if output directory is selected
        if (excelOutputDirectory) {
            document.getElementById('excel-batch-convert-btn').disabled = false;
        }
    }
});

// Select output directory for Excel batch
document.getElementById('select-excel-output-dir-btn').addEventListener('click', async () => {
    const dirPath = await window.electronAPI.selectDirectory();
    if (dirPath) {
        excelOutputDirectory = dirPath;
        document.getElementById('excel-output-dir-name').textContent = dirPath;
        
        // Enable convert button if files are selected
        if (selectedExcelFiles.length > 0) {
            document.getElementById('excel-batch-convert-btn').disabled = false;
        }
    }
});

// Excel Batch convert button
document.getElementById('excel-batch-convert-btn').addEventListener('click', async () => {
    if (selectedExcelFiles.length === 0 || !excelOutputDirectory) return;
    
    const progressContainer = document.getElementById('excel-batch-progress');
    const progressFill = document.getElementById('excel-progress-fill');
    const progressText = document.getElementById('excel-progress-text');
    
    try {
        progressContainer.style.display = 'block';
        progressFill.style.width = '0%';
        progressText.textContent = 'Starting conversion...';
        
        const results = [];
        const total = selectedExcelFiles.length;
        let completed = 0;
        
        for (const filePath of selectedExcelFiles) {
            const fileInfo = await window.electronAPI.getFileInfo(filePath);
            const result = await window.electronAPI.excelToJson(filePath, null);
            
            if (result.success) {
                results.push({
                    filename: fileInfo.name,
                    originalPath: filePath,
                    sheetName: result.sheetName,
                    availableSheets: result.availableSheets,
                    data: result.data,
                    rowCount: result.rowCount,
                    columnCount: result.columnCount,
                    size: result.size,
                    sizeKB: result.sizeKB,
                    sizeMB: result.sizeMB,
                    index: completed
                });
            }
            
            completed++;
            const percent = Math.round((completed / total) * 100);
            progressFill.style.width = percent + '%';
            progressText.textContent = `Processing ${completed}/${total} (${percent}%)`;
        }
        
        // Save results to JSON
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
        const jsonData = {
            type: 'excel-json-batch',
            created: new Date().toISOString(),
            totalFiles: selectedExcelFiles.length,
            successful: results.length,
            failed: selectedExcelFiles.length - results.length,
            files: results,
            errors: []
        };
        
        const outputPath = `${excelOutputDirectory}\\excel_batch_${timestamp}.json`;
        await window.electronAPI.writeTextFile(outputPath, JSON.stringify(jsonData, null, 2));
        
        progressText.textContent = `✅ Completed! ${completed} file(s) converted to JSON`;
        showInfo('excel-batch-info', `✅ Successfully converted ${completed} file(s) to JSON!`, 'success');
        
    } catch (error) {
        showInfo('excel-batch-info', 'Error: ' + error.message, 'error');
        progressContainer.style.display = 'none';
    }
});

// ============ EXCEL BATCH REVERSE (JSON to Excel/CSV) ============

let excelJsonData = null;
let excelReverseOutputDirectory = null;

// Select JSON file for Excel reverse conversion
document.getElementById('select-excel-json-file-btn').addEventListener('click', async () => {
    const filePath = await window.electronAPI.selectJSONFile();
    if (!filePath) return;
    
    try {
        const result = await window.electronAPI.readJSONFile(filePath);
        
        if (!result.success) {
            showInfo('excel-batch-reverse-info', 'Error reading JSON: ' + result.error, 'error');
            return;
        }
        
        const data = result.data;
        
        // Validate JSON structure for Excel batch
        if (!data.type || data.type !== 'excel-json-batch' || !Array.isArray(data.files)) {
            showInfo('excel-batch-reverse-info', '⚠️ Invalid JSON format. Expected excel-json-batch type with files array.', 'error');
            excelJsonData = null;
            return;
        }
        
        // Check if items have required fields
        const validItems = data.files.filter(item => item.filename && item.data && Array.isArray(item.data));
        
        if (validItems.length === 0) {
            showInfo('excel-batch-reverse-info', '⚠️ No valid data found in JSON.', 'error');
            excelJsonData = null;
            return;
        }
        
        excelJsonData = data;
        
        const fileInfo = await window.electronAPI.getFileInfo(filePath);
        document.getElementById('selected-excel-json-name').textContent = fileInfo.name;
        
        // Show preview
        const previewContainer = document.getElementById('excel-json-preview');
        const itemsCount = document.getElementById('excel-json-items-count');
        const itemsList = document.getElementById('excel-json-items-list');
        
        itemsCount.textContent = `${validItems.length} file(s) found in JSON`;
        
        itemsList.innerHTML = '';
        validItems.forEach((item, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'batch-item';
            const sizeInfo = item.sizeKB ? `${item.sizeKB} KB` : 'Size unknown';
            fileItem.innerHTML = `
                <span class="file-icon">📊</span>
                <span class="file-name">${item.filename}</span>
                <span class="file-info">Rows: ${item.rowCount || item.data.length} - ${sizeInfo}</span>
            `;
            itemsList.appendChild(fileItem);
        });
        
        previewContainer.style.display = 'block';
        
        // Enable convert button if output directory is selected
        if (excelReverseOutputDirectory) {
            document.getElementById('excel-batch-reverse-btn').disabled = false;
        }
        
        showInfo('excel-batch-reverse-info', `✅ JSON loaded successfully! ${validItems.length} file(s) ready to convert.`, 'success');
        
    } catch (error) {
        showInfo('excel-batch-reverse-info', 'Error: ' + error.message, 'error');
        excelJsonData = null;
    }
});

// Select output directory for Excel reverse conversion
document.getElementById('select-excel-reverse-output-dir-btn').addEventListener('click', async () => {
    const dirPath = await window.electronAPI.selectDirectory();
    if (dirPath) {
        excelReverseOutputDirectory = dirPath;
        document.getElementById('excel-reverse-output-dir-name').textContent = dirPath;
        
        // Enable convert button if JSON is loaded
        if (excelJsonData && excelJsonData.files && excelJsonData.files.length > 0) {
            document.getElementById('excel-batch-reverse-btn').disabled = false;
        }
    }
});

// Excel Batch Reverse (JSON to Excel/CSV)
document.getElementById('excel-batch-reverse-btn').addEventListener('click', async () => {
    if (!excelJsonData || !excelJsonData.files || excelJsonData.files.length === 0 || !excelReverseOutputDirectory) return;
    
    const progressContainer = document.getElementById('excel-reverse-progress');
    const progressFill = document.getElementById('excel-reverse-progress-fill');
    const progressText = document.getElementById('excel-reverse-progress-text');
    
    try {
        progressContainer.style.display = 'block';
        progressFill.style.width = '0%';
        progressText.textContent = 'Starting reverse conversion...';
        
        const format = document.getElementById('excel-reverse-format').value;
        
        const total = excelJsonData.files.length;
        let completed = 0;
        let successful = 0;
        const errors = [];
        
        for (const item of excelJsonData.files) {
            try {
                // Determine output filename
                const lastDotIndex = item.filename.lastIndexOf('.');
                const baseName = lastDotIndex >= 0 ? item.filename.substring(0, lastDotIndex) : item.filename;
                const outputFilename = `${baseName}.${format}`;
                const outputPath = `${excelReverseOutputDirectory}\\${outputFilename}`;
                
                // Convert JSON to Excel/CSV
                const result = await window.electronAPI.jsonToExcel(
                    item.data,
                    outputPath,
                    item.sheetName || 'Sheet1'
                );
                
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
        progressText.textContent = `✅ Completed! ${successful}/${total} file(s) converted successfully`;
        
        let message = `✅ Successfully converted ${successful} out of ${total} file(s)!`;
        if (errors.length > 0) {
            message += `\n\n⚠️ ${errors.length} error(s) occurred:\n${errors.slice(0, 3).join('\n')}`;
            if (errors.length > 3) {
                message += `\n... and ${errors.length - 3} more.`;
            }
        }
        
        showInfo('excel-batch-reverse-info', message, successful === total ? 'success' : 'error');
        
    } catch (error) {
        showInfo('excel-batch-reverse-info', 'Error: ' + error.message, 'error');
        progressContainer.style.display = 'none';
    }
});

// ============================================
// AI PDF SEARCH MODULE
// ============================================

let aiSearchPDFPath = null;
let aiSearchPDFText = null;
let searchHistory = [];

// Initialize OpenAI
document.getElementById('init-openai-btn').addEventListener('click', async () => {
    const apiKey = document.getElementById('openai-api-key').value.trim();
    const statusIndicator = document.getElementById('openai-status');
    
    if (!apiKey) {
        await electronAPI.showMessage('error', 'API Key Required', 'Please enter your OpenAI API key.');
        return;
    }
    
    try {
        const result = await electronAPI.initOpenAI(apiKey);
        
        if (result.success) {
            statusIndicator.textContent = '✓ Connected';
            statusIndicator.className = 'status-indicator connected';
            await electronAPI.showMessage('info', 'Success', 'OpenAI initialized successfully!');
            
            // Enable search functionality
            updateSearchButtonState();
        } else {
            statusIndicator.textContent = '✗ Failed';
            statusIndicator.className = 'status-indicator disconnected';
            await electronAPI.showMessage('error', 'Initialization Failed', result.error);
        }
    } catch (error) {
        statusIndicator.textContent = '✗ Error';
        statusIndicator.className = 'status-indicator disconnected';
        await electronAPI.showMessage('error', 'Error', 'Failed to initialize OpenAI: ' + error.message);
    }
});

// Select PDF for search
document.getElementById('select-pdf-search-btn').addEventListener('click', async () => {
    const filePath = await electronAPI.selectPDFFile();
    
    if (filePath) {
        aiSearchPDFPath = filePath;
        const fileName = filePath.split(/[\\/]/).pop();
        document.getElementById('selected-pdf-search-name').textContent = fileName;
        
        // Extract text from PDF
        try {
            const result = await electronAPI.extractPDFText(filePath);
            
            if (result.success) {
                aiSearchPDFText = result.text;
                
                // Display PDF info
                const infoContainer = document.getElementById('pdf-search-info');
                const detailsDiv = document.getElementById('pdf-search-details');
                
                detailsDiv.innerHTML = `
                    <div><strong>File:</strong> ${result.fileName}</div>
                    <div><strong>Pages:</strong> ${result.numPages}</div>
                    <div><strong>Words:</strong> ${result.wordCount.toLocaleString()}</div>
                    <div><strong>Characters:</strong> ${result.textLength.toLocaleString()}</div>
                `;
                
                infoContainer.style.display = 'block';
                
                // Enable search button if OpenAI is initialized
                updateSearchButtonState();
            } else {
                await electronAPI.showMessage('error', 'Extraction Failed', result.error);
            }
        } catch (error) {
            await electronAPI.showMessage('error', 'Error', 'Failed to extract text from PDF: ' + error.message);
        }
    }
});

// Update search button state
function updateSearchButtonState() {
    const searchBtn = document.getElementById('search-pdf-btn');
    const question = document.getElementById('ai-question-input').value.trim();
    
    electronAPI.isOpenAIInitialized().then(result => {
        searchBtn.disabled = !(result.initialized && aiSearchPDFPath && question);
    });
}

// Listen to question input
document.getElementById('ai-question-input').addEventListener('input', updateSearchButtonState);

// Search PDF with AI
document.getElementById('search-pdf-btn').addEventListener('click', async () => {
    const question = document.getElementById('ai-question-input').value.trim();
    const model = document.getElementById('ai-model-select').value;
    const maxTokens = parseInt(document.getElementById('ai-max-tokens').value);
    
    if (!question) {
        await electronAPI.showMessage('error', 'Question Required', 'Please enter a question.');
        return;
    }
    
    if (!aiSearchPDFPath || !aiSearchPDFText) {
        await electronAPI.showMessage('error', 'PDF Required', 'Please select a PDF file first.');
        return;
    }
    
    const loadingIndicator = document.getElementById('ai-search-loading');
    const resultContainer = document.getElementById('ai-search-result');
    
    try {
        // Show loading
        loadingIndicator.style.display = 'block';
        resultContainer.style.display = 'none';
        
        const options = {
            model: model,
            maxTokens: maxTokens,
            temperature: 0.7
        };
        
        const result = await electronAPI.extractAndSearchPDF(aiSearchPDFPath, question, options);
        
        // Hide loading
        loadingIndicator.style.display = 'none';
        
        if (result.success) {
            // Display answer
            const answerContent = document.getElementById('ai-answer-content');
            const metaInfo = document.getElementById('ai-meta-info');
            
            answerContent.textContent = result.answer;
            
            metaInfo.innerHTML = `
                <span><strong>Model:</strong> ${result.model}</span>
                <span><strong>Tokens Used:</strong> ${result.usage.totalTokens}</span>
                <span><strong>PDF:</strong> ${result.pdfInfo.fileName}</span>
                <span><strong>Pages:</strong> ${result.pdfInfo.numPages}</span>
                ${result.textTruncated ? '<span style="color: orange;"><strong>⚠️ Text was truncated</strong></span>' : ''}
            `;
            
            resultContainer.style.display = 'block';
            
            // Add to history
            addToSearchHistory({
                question: question,
                answer: result.answer,
                fileName: result.pdfInfo.fileName,
                model: result.model,
                timestamp: new Date().toLocaleString(),
                tokens: result.usage.totalTokens
            });
        } else {
            await electronAPI.showMessage('error', 'Search Failed', result.error);
        }
    } catch (error) {
        loadingIndicator.style.display = 'none';
        await electronAPI.showMessage('error', 'Error', 'Failed to search PDF: ' + error.message);
    }
});

// Copy AI answer
document.getElementById('copy-ai-answer-btn').addEventListener('click', async () => {
    const answer = document.getElementById('ai-answer-content').textContent;
    
    try {
        await navigator.clipboard.writeText(answer);
        const btn = document.getElementById('copy-ai-answer-btn');
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    } catch (error) {
        await electronAPI.showMessage('error', 'Copy Failed', 'Failed to copy answer to clipboard.');
    }
});

// Add to search history
function addToSearchHistory(item) {
    searchHistory.unshift(item); // Add to beginning
    
    // Limit history to 20 items
    if (searchHistory.length > 20) {
        searchHistory = searchHistory.slice(0, 20);
    }
    
    renderSearchHistory();
}

// Render search history
function renderSearchHistory() {
    const historyContainer = document.getElementById('search-history-container');
    
    if (searchHistory.length === 0) {
        historyContainer.innerHTML = '<p class="placeholder-text">No search history yet</p>';
        return;
    }
    
    historyContainer.innerHTML = searchHistory.map((item, index) => `
        <div class="history-item">
            <div class="history-item-header">
                <span><strong>#${searchHistory.length - index}</strong></span>
                <span>${item.timestamp}</span>
            </div>
            <div class="history-item-question">
                <strong>Q:</strong> ${escapeHtml(item.question)}
            </div>
            <div class="history-item-answer">
                <strong>A:</strong> ${escapeHtml(item.answer.substring(0, 200))}${item.answer.length > 200 ? '...' : ''}
            </div>
            <div class="history-item-meta">
                <span>📄 ${escapeHtml(item.fileName)}</span>
                <span>🤖 ${item.model}</span>
                <span>🎫 ${item.tokens} tokens</span>
            </div>
        </div>
    `).join('');
}

// Clear search history
document.getElementById('clear-search-history-btn').addEventListener('click', async () => {
    if (searchHistory.length === 0) {
        return;
    }
    
    searchHistory = [];
    renderSearchHistory();
    await electronAPI.showMessage('info', 'History Cleared', 'Search history has been cleared.');
});

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
