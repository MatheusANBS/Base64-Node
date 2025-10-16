# Base64 Converter

A high-performance desktop application for Base64 encoding and decoding, built with Electron and Node.js. This application provides comprehensive conversion capabilities for images, PDFs, and Excel/CSV files with both single-file and batch processing features.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Image Converter](#image-converter)
  - [PDF Converter](#pdf-converter)
  - [Excel/CSV Converter](#excelcsv-converter)
  - [Batch Processing](#batch-processing)
- [API Reference](#api-reference)
- [Supported Formats](#supported-formats)
- [Architecture](#architecture)
- [Performance](#performance)
- [Building](#building)
- [License](#license)

## Overview

Base64 Converter is a cross-platform desktop application that enables efficient conversion between various file formats and their Base64 representations. The application features a unified interface for single-file conversions, batch processing capabilities, and reverse conversion from structured JSON files.

### Key Highlights

- **Multi-format support**: Images (PNG, JPEG, GIF, BMP, WebP, TIFF, ICO, AVIF), PDFs, Excel (.xlsx, .xls, .csv, .xlsb, .ods)
- **Bidirectional conversion**: Encode to Base64 and decode back to original format
- **Batch processing**: Convert multiple files simultaneously with real-time progress tracking
- **Reverse conversion**: Restore files from JSON-structured data
- **High performance**: Optimized Node.js implementation (~35x faster than Python equivalent)
- **Professional UI**: Clean, intuitive Electron-based interface with unified conversion tabs
- **Modular architecture**: Separate converters for each file type with comprehensive error handling

## Features

### Core Capabilities

#### Image Converter
- Convert images to Base64 with optional MIME type prefix
- Decode Base64 strings to image files
- Support for 9 image formats: PNG, JPEG, GIF, BMP, WebP, TIFF, ICO, AVIF
- Image metadata extraction (dimensions, channels, format, size)
- Resize and quality options for conversion
- Real-time preview of source images
- Batch conversion with JSON export
- Batch reverse conversion (JSON to images)
- Export to multiple formats (TXT, CSV, XML, JSON)

#### PDF Converter
- Convert PDF files to Base64 encoding
- Decode Base64 strings to PDF files
- PDF validation with magic number verification
- File size reporting (bytes, KB, MB)
- Preview functionality for decoded PDFs
- Batch processing with progress tracking
- Batch reverse conversion (JSON to PDFs)

#### AI PDF Search 🤖 (NEW!)
- AI-powered question answering based on PDF content
- Automatic text extraction from PDF documents
- Integration with OpenAI GPT models (3.5-turbo, GPT-4, GPT-4-turbo)
- Smart context handling with automatic text truncation
- Configurable response length and model selection
- Search history tracking with metadata
- PDF content caching for improved performance
- Real-time status indicators and error handling
- Support for multi-page documents with word/character count display

#### Excel/CSV Converter
- Convert Excel/CSV files to JSON format
- Decode JSON data to Excel/CSV files
- Multi-sheet support with sheet selection
- Automatic format detection (.xlsx, .xls, .csv, .xlsb, .ods)
- Row and column count reporting
- Workbook information extraction
- Batch conversion to structured JSON
- Batch reverse conversion with format selection

### Batch Processing Features

- **Real-time progress tracking**: File-by-file progress bars with percentage and count
- **Structured JSON output**: Timestamped exports with metadata and error reporting
- **Batch reverse conversion**: Restore all files from a single JSON file
- **Error handling**: Individual file error tracking without stopping the entire batch
- **Format flexibility**: Export to JSON, TXT, CSV, or XML (where applicable)
- **Visual feedback**: File counters, success/failure reporting, and detailed logs

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Steps

```bash
# Clone the repository
git clone https://github.com/MatheusANBS/Base64-Node.git

# Navigate to the project directory
cd Base64-Node

# Install dependencies
npm install

# Run the application
npm start
```

### Development Mode

```bash
# Run with DevTools open
npm run dev
```

## Usage

### Image Converter

The Image Converter tab provides unified encode and decode functionality in a single interface.

#### Encoding (Image to Base64)

1. Click "Select Image" to choose an image file
2. Preview the selected image
3. Optionally enable "Include MIME type" for data URL format
4. Click "Convert to Base64"
5. Copy the output or save to a text file

#### Decoding (Base64 to Image)

1. Click "Select JSON File" to load a Base64-encoded image
2. Or manually paste Base64 string into the text area
3. Optionally adjust quality (1-100) and enable optimization
4. Click "Convert & Save Image"
5. Choose the output location and format

### PDF Converter

The PDF Converter tab enables bidirectional PDF and Base64 conversion.

#### Encoding (PDF to Base64)

1. Click "Select PDF File"
2. Optionally enable "Include MIME type"
3. Click "Convert to Base64"
4. View file information (size, name)
5. Copy or save the Base64 output

#### Decoding (Base64 to PDF)

1. Paste Base64 string into the text area
2. Click "Preview PDF" to verify the content (optional)
3. Click "Convert & Save PDF"
4. Select the output location

### Excel/CSV Converter

The Excel/CSV Converter tab supports multi-sheet Excel files and CSV conversion.

#### Encoding (Excel/CSV to JSON)

1. Click "Select Excel/CSV File"
2. Select the desired sheet from the dropdown (if multiple sheets exist)
3. View sheet information (row count, column count)
4. Click "Convert to JSON"
5. View the JSON output in the text area
6. Copy or save the JSON data

#### Decoding (JSON to Excel/CSV)

1. Click "Select JSON File" to load structured JSON data
2. Specify the sheet name (default: "Sheet1")
3. Click "Convert to Excel/CSV"
4. Choose the output location and format (.xlsx, .csv, etc.)

### AI PDF Search

The AI PDF Search feature enables intelligent question-answering based on uploaded PDF documents using OpenAI's GPT models.

#### Setup

1. Obtain an OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Navigate to the "🤖 AI PDF Search" tab
3. Enter your API key in the configuration section
4. Click "🔑 Initialize" to connect to OpenAI
5. Wait for the "✓ Connected" status indicator

#### Using AI PDF Search

1. **Upload PDF**: Click "📂 Select PDF File" to choose your document
2. **View PDF Info**: Review extracted information (pages, word count, character count)
3. **Ask Questions**: Type your question in the text area
   - Examples:
     - "What is the main topic of this document?"
     - "Summarize the key points"
     - "Who are the authors mentioned?"
     - "What conclusions are drawn?"
4. **Configure Options** (optional):
   - Select AI model: GPT-3.5 Turbo (fast), GPT-4 (better quality), or GPT-4 Turbo
   - Choose response length: Short (300 tokens), Medium (500), Long (1000), or Very Long (2000)
5. **Search**: Click "🔍 Search with AI"
6. **View Answer**: The AI will analyze the PDF and provide a contextual answer
7. **Copy Answer**: Use the "📋 Copy" button to copy the response
8. **Review History**: All searches are saved in the Search History section

#### Features & Tips

- **Automatic Text Extraction**: PDF content is automatically extracted and cached
- **Smart Truncation**: Long documents are intelligently truncated to fit context limits
- **Model Selection**: Choose between speed (GPT-3.5) or quality (GPT-4)
- **Token Tracking**: Monitor API usage with real-time token counts
- **Search History**: Review previous questions and answers
- **Multi-Page Support**: Works with documents of any length
- **Privacy**: API keys are stored only in memory during the session

#### Limitations

- Maximum context length varies by model (documents may be truncated)
- Requires active internet connection
- API usage is subject to OpenAI pricing
- Best results with text-based PDFs (scanned images may not work well)

### Batch Processing

All three converters support batch processing with advanced features.

#### Batch Conversion to JSON

1. Navigate to the corresponding "Batch" tab
2. Click "Select Multiple Files" (Images/PDFs/Excel files)
3. View the list of selected files
4. Configure options:
   - Include MIME type prefix (Images/PDFs)
   - Select sheet or "All Sheets" (Excel)
   - Choose export format: JSON (recommended for reverse conversion)
5. Select the output directory
6. Click "Start Batch Conversion"
7. Monitor real-time progress
8. View the completion summary

#### Batch Reverse Conversion (JSON to Files)

1. In the "Batch" tab, scroll to the "Reverse Conversion" section
2. Click "Select JSON File" (must be a JSON file generated by batch conversion)
3. Preview the files that will be generated
4. Select the output directory
5. For Excel: Choose the output format (.xlsx, .csv, etc.)
6. Click "Convert to Files"
7. Monitor progress and view results

## API Reference

### ImageConverter

Core module for image Base64 operations.

#### Methods

**`imageToBase64(filePath, includeMime, resize, quality)`**

Converts an image file to Base64.

- **Parameters:**
  - `filePath` (string): Path to the image file
  - `includeMime` (boolean): Include MIME type prefix (default: `true`)
  - `resize` (Array|null): Optional `[width, height]` for resizing
  - `quality` (number): Compression quality 1-100 (default: `95`)

- **Returns:** `Promise<Object>`
  ```javascript
  {
    success: true,
    data: "data:image/png;base64,iVBORw0KG...",
    size: 524288,
    sizeKB: "512.00",
    sizeMB: "0.50",
    fileName: "image.png",
    format: "PNG",
    width: 1920,
    height: 1080,
    channels: 4
  }
  ```

**`base64ToImage(base64String, outputPath, quality, optimize)`**

Converts Base64 string to an image file.

- **Parameters:**
  - `base64String` (string): Base64 encoded image data or data URL
  - `outputPath` (string): Output file path
  - `quality` (number): Quality for compression (default: `95`)
  - `optimize` (boolean): Enable optimization (default: `false`)

- **Returns:** `Promise<Object>`

**`batchImagesToJson(imagePaths, outputPath, includeMime)`**

Batch converts multiple images to a structured JSON file.

- **Returns:** JSON file with structure:
  ```json
  {
    "type": "image-base64-batch",
    "created": "2025-10-16T...",
    "totalFiles": 10,
    "successful": 10,
    "failed": 0,
    "includeMimeType": true,
    "images": [...],
    "errors": []
  }
  ```

**`batchJsonToImages(jsonPath, outputDir)`**

Restores images from batch JSON file.

**`exportImagesTo(imagePaths, outputPath, format, includeMime)`**

Exports images to TXT, CSV, or XML format.

- **Formats:** `'txt'`, `'csv'`, `'xml'`

### PDFConverter

Core module for PDF Base64 operations.

#### Methods

**`pdfToBase64(filePath, includeMime)`**

Converts a PDF file to Base64.

- **Parameters:**
  - `filePath` (string): Path to PDF file
  - `includeMime` (boolean): Include MIME type prefix (default: `true`)

- **Returns:** `Promise<Object>`
  ```javascript
  {
    success: true,
    data: "data:application/pdf;base64,JVBERi0x...",
    size: 1048576,
    sizeKB: "1024.00",
    sizeMB: "1.00",
    fileName: "document.pdf"
  }
  ```

**`base64ToPDF(base64String, outputPath)`**

Converts Base64 string to a PDF file.

**`isPDF(buffer)`**

Validates if a buffer is a valid PDF (checks magic number `%PDF-`).

- **Returns:** `boolean`

**`isValidBase64(str)`**

Validates Base64 string format.

- **Returns:** `boolean`

**`getPDFInfo(buffer)`**

Extracts PDF metadata (version, size).

### PDFSearcher

Core module for AI-powered PDF text extraction and question answering.

#### Methods

**`initializeOpenAI(apiKey)`**

Initializes the OpenAI client with an API key.

- **Parameters:**
  - `apiKey` (string): OpenAI API key

- **Throws:** `PDFSearchError` if API key is invalid

**`isOpenAIInitialized()`**

Checks if OpenAI client is initialized.

- **Returns:** `boolean`

**`extractTextFromPDF(filePath)`**

Extracts text content from a PDF file.

- **Parameters:**
  - `filePath` (string): Path to PDF file

- **Returns:** `Promise<Object>`
  ```javascript
  {
    success: true,
    text: "Full text content...",
    numPages: 10,
    info: {...},
    metadata: {...},
    fileName: "document.pdf",
    textLength: 50000,
    wordCount: 8500
  }
  ```

**`searchWithAI(pdfText, question, options)`**

Performs AI-powered search on PDF text content.

- **Parameters:**
  - `pdfText` (string): Extracted PDF text
  - `question` (string): User's question
  - `options` (Object): Optional configuration
    - `model` (string): OpenAI model (default: `'gpt-3.5-turbo'`)
    - `maxTokens` (number): Max response tokens (default: `500`)
    - `temperature` (number): Response creativity (default: `0.7`)

- **Returns:** `Promise<Object>`
  ```javascript
  {
    success: true,
    answer: "The AI's response...",
    model: "gpt-3.5-turbo",
    usage: {
      promptTokens: 1200,
      completionTokens: 150,
      totalTokens: 1350
    },
    textTruncated: false
  }
  ```

**`extractAndSearch(filePath, question, options)`**

Combined method that extracts PDF text and searches in one call.

- **Parameters:**
  - `filePath` (string): Path to PDF file
  - `question` (string): User's question
  - `options` (Object): Optional configuration (same as `searchWithAI`)

- **Returns:** `Promise<Object>`
  ```javascript
  {
    success: true,
    pdfInfo: {
      fileName: "document.pdf",
      numPages: 10,
      wordCount: 8500,
      textLength: 50000
    },
    question: "What is this about?",
    answer: "This document discusses...",
    model: "gpt-3.5-turbo",
    usage: {...},
    textTruncated: false
  }
  ```

**`clearCache()`**

Clears the internal PDF text cache.

**`getCacheStats()`**

Returns cache statistics.

- **Returns:** `Object`
  ```javascript
  {
    size: 5,
    keys: ["path1-timestamp", "path2-timestamp", ...]
  }
  ```

### ExcelConverter

Core module for Excel/CSV to JSON conversion.

#### Methods

**`excelToJson(filePath, sheetName)`**

Converts Excel/CSV file to JSON.

- **Parameters:**
  - `filePath` (string): Path to Excel/CSV file
  - `sheetName` (string|null): Sheet name or `null` for first sheet

- **Returns:** `Promise<Object>`
  ```javascript
  {
    success: true,
    data: [{...}, {...}],
    fileName: "data.xlsx",
    sheetName: "Sheet1",
    availableSheets: ["Sheet1", "Sheet2"],
    rowCount: 150,
    columnCount: 8,
    totalCells: 1200,
    size: 51200,
    sizeKB: "50.00",
    sizeMB: "0.05"
  }
  ```

**`jsonToExcel(jsonData, outputPath, sheetName)`**

Converts JSON array to Excel/CSV file.

- **Parameters:**
  - `jsonData` (Array): Array of objects
  - `outputPath` (string): Output file path (.xlsx, .csv, etc.)
  - `sheetName` (string): Name for the sheet (default: `'Sheet1'`)

**`getWorkbookInfo(filePath)`**

Retrieves workbook information (sheets, row counts, column counts).

**`batchExcelToJson(filePaths, outputPath)`**

Batch converts Excel/CSV files to structured JSON.

- **Returns:** JSON file with structure:
  ```json
  {
    "type": "excel-json-batch",
    "created": "2025-10-16T...",
    "totalFiles": 5,
    "successful": 5,
    "failed": 0,
    "files": [...],
    "errors": []
  }
  ```

**`batchJsonToExcel(jsonPath, outputDir, format)`**

Restores Excel/CSV files from batch JSON.

- **Parameters:**
  - `format` (string): Output format (`'xlsx'`, `'csv'`, `'xls'`, etc.)

**`isValidExcel(buffer)`**

Validates if a buffer is a valid Excel/CSV file.

**`getSupportedFormats()`**

Returns array of supported formats.

- **Returns:** `['xlsx', 'xls', 'csv', 'xlsb', 'ods']`

### ImageProcessor

Utility module for advanced image manipulation.

#### Methods

- `createThumbnail(imagePath, size)` - Creates thumbnail from file
- `createThumbnailFromBytes(data, size)` - Creates thumbnail from buffer
- `optimizeImage(imagePath, maxSize, quality)` - Optimizes image
- `applyFilter(imageBuffer, filterName)` - Applies filters (blur, sharpen, grayscale, negate)
- `adjustBrightness(imageBuffer, factor)` - Adjusts brightness
- `adjustContrast(imageBuffer, factor)` - Adjusts contrast
- `getDominantColor(imageBuffer)` - Extracts dominant color
- `rotateImage(imageBuffer, angle)` - Rotates image
- `flipImage(imageBuffer, horizontal, vertical)` - Flips image

### FileHandler

Utility module for file system operations.

#### Methods

- `isImageFile(filePath)` - Checks if file is a supported image
- `isTextFile(filePath)` - Checks if file is a text file
- `getImageFiles(directory)` - Retrieves all images from directory
- `validateOutputPath(filePath)` - Validates and prepares output path
- `saveHistory(historyFile, entries)` - Saves conversion history
- `loadHistory(historyFile)` - Loads conversion history

## Supported Formats

### Images
- **PNG** - Portable Network Graphics
- **JPEG/JPG** - Joint Photographic Experts Group
- **GIF** - Graphics Interchange Format
- **BMP** - Bitmap Image File
- **WebP** - Web Picture Format
- **TIFF** - Tagged Image File Format
- **ICO** - Icon Format
- **AVIF** - AV1 Image File Format

### Documents
- **PDF** - Portable Document Format

### Spreadsheets
- **XLSX** - Excel Workbook (2007+)
- **XLS** - Excel Workbook (97-2003)
- **CSV** - Comma-Separated Values
- **XLSB** - Excel Binary Workbook
- **ODS** - OpenDocument Spreadsheet

### Export Formats
- **JSON** - JavaScript Object Notation (structured, supports reverse conversion)
- **TXT** - Plain text
- **CSV** - Comma-Separated Values
- **XML** - Extensible Markup Language

## Architecture

### Project Structure

```
Base64-Node/
├── main.js                 # Electron main process
├── preload.js              # Preload script (context bridge)
├── renderer.js             # Renderer process (UI logic)
├── index.html              # Application UI
├── styles.css              # Application styles
├── core/
│   ├── converter.js        # Legacy Base64 converter (ES modules)
│   ├── imageConverter.js   # Image converter module
│   ├── pdfConverter.js     # PDF converter module
│   └── excelConverter.js   # Excel/CSV converter module
├── utils/
│   ├── imageProcessor.js   # Image manipulation utilities
│   └── fileHandler.js      # File system utilities
└── assets/
    └── icon.ico            # Application icon
```

### Technology Stack

- **Electron**: Cross-platform desktop framework
- **Node.js**: JavaScript runtime
- **Sharp**: High-performance image processing library
- **XLSX (SheetJS)**: Excel/CSV parsing and generation library
- **pdf-parse**: PDF text extraction library
- **OpenAI**: AI-powered natural language processing
- **IPC (Inter-Process Communication)**: Electron main/renderer communication

### Design Patterns

- **Modular architecture**: Separate converters for each file type
- **Error handling**: Custom error classes with descriptive messages
- **Context isolation**: Secure renderer process with context bridge
- **Promise-based APIs**: Async/await for all I/O operations
- **Validation layers**: Input validation at multiple levels
- **Batch processing**: Incremental processing with progress tracking

## Performance

### Benchmark Comparison

The Node.js implementation provides significant performance improvements over equivalent Python implementations:

- **Python**: ~7 seconds for 100M iterations
- **Node.js**: ~0.2 seconds for 100M iterations
- **Speedup**: ~35x faster

### Optimization Features

- **Sharp library**: Hardware-accelerated image processing
- **Asynchronous I/O**: Non-blocking file operations
- **Streaming**: Memory-efficient processing for large files
- **Buffer management**: Optimized Base64 encoding/decoding
- **Incremental batch processing**: Real-time progress without blocking

## Building

### Build for Distribution

```bash
# Build for Windows
npm run build:win

# Build for Windows (full installer)
npm run build:win-full

# Build for macOS
npm run build:mac

# Build for Linux
npm run build:linux

# Create portable version
npm run package
```

### Build Configuration

The application uses `electron-builder` for packaging. Configuration is defined in `package.json`:

```json
{
  "build": {
    "appId": "com.matheusanbs.base64converter",
    "productName": "Base64 Converter",
    "directories": {
      "output": "dist"
    },
    "files": [
      "main.js",
      "preload.js",
      "renderer.js",
      "styles.css",
      "index.html",
      "assets/**/*",
      "core/**/*",
      "utils/**/*",
      "node_modules/**/*"
    ],
    "win": {
      "target": "nsis",
      "icon": "assets/icon.ico"
    }
  }
}
```

## Error Handling

All converters implement custom error classes:

- **`ImageConversionError`**: Image-specific errors
- **`PDFConversionError`**: PDF-specific errors
- **`ExcelConversionError`**: Excel/CSV-specific errors
- **`ConversionError`**: General conversion errors (legacy converter)

Each error includes:
- Descriptive error messages
- Error propagation from underlying libraries
- Success/failure indicators in return objects

## Security

- **Context isolation**: Renderer process is isolated from Node.js
- **Context bridge**: Only exposed APIs are accessible
- **Input validation**: All inputs are validated before processing
- **Path sanitization**: File paths are validated and sanitized
- **Magic number verification**: File type verification beyond extensions

## Contributing

Contributions are welcome. Please ensure:

1. Code follows existing patterns
2. Error handling is comprehensive
3. Documentation is updated
4. Testing is performed on all platforms

## License

MIT License

Copyright (c) 2025 MatheusANBS

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Author

**MatheusANBS**

- GitHub: [@MatheusANBS](https://github.com/MatheusANBS)
- Repository: [Base64-Node](https://github.com/MatheusANBS/Base64-Node)

## Acknowledgments

- **Sharp**: High-performance Node.js image processing library
- **SheetJS (XLSX)**: Excel and spreadsheet parsing library
- **Electron**: Framework for building cross-platform desktop applications