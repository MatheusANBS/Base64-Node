# Base64 Converter - Node.js Version

Versão de alta performance do Base64 Converter em Node.js, com todas as funcionalidades da versão Python e otimizações para máxima velocidade.

## 🚀 Performance

Esta versão em Node.js oferece performance superior ao Python:
- **Python**: ~7 segundos para 100M iterações
- **Node.js**: ~0.2 segundos para 100M iterações
- **Speedup**: ~35x mais rápido

## 📦 Instalação

```bash
npm install
```

## 🎯 Funcionalidades

### Core Converter
- ✅ Decode Base64 para Buffer
- ✅ Encode Buffer para Base64
- ✅ Detecção automática de formato de imagem
- ✅ Informações detalhadas de imagem
- ✅ Conversão Base64 → Imagem
- ✅ Conversão Imagem → Base64
- ✅ Conversão em lote (batch)
- ✅ Exportação para JSON, CSV, XML

### PDF Converter (NOVO! 🎉)
- ✅ Conversão PDF → Base64
- ✅ Conversão Base64 → PDF
- ✅ **Preview de PDF antes de salvar**
- ✅ **Conversão em lote (batch) de PDFs**
- ✅ **Conversão reversa em lote (JSON → PDFs)** 🔄
- ✅ Validação de arquivos PDF
- ✅ Suporte a Data URLs
- ✅ Informações de tamanho e metadata
- ✅ Exportação batch em JSON, CSV, XML ou TXT
- ✅ Interface gráfica intuitiva

### Image Processor
- ✅ Criação de thumbnails
- ✅ Otimização de imagens
- ✅ Aplicação de filtros (blur, sharpen, grayscale, etc.)
- ✅ Ajuste de brilho e contraste
- ✅ Detecção de cor dominante
- ✅ Rotação e espelhamento

### File Handler
- ✅ Validação de tipos de arquivo
- ✅ Busca de imagens em diretórios
- ✅ Gerenciamento de caminhos de saída
- ✅ Histórico de conversões

## 📖 Uso

### Exemplo 1: PDF para Base64

```javascript
const PDFConverter = require('./core/pdfConverter');

// Converter PDF para Base64
const result = await PDFConverter.pdfToBase64('./document.pdf', true);
console.log('Base64:', result.data);
console.log('Size:', result.sizeMB, 'MB');
```

### Exemplo 2: Base64 para PDF

```javascript
const PDFConverter = require('./core/pdfConverter');

// Converter Base64 para PDF
const base64String = 'JVBERi0xLjQKJeLjz9MK...'; // Seu Base64 aqui
const result = await PDFConverter.base64ToPDF(base64String, './output.pdf');
console.log('PDF salvo:', result.path);
```

### Exemplo 2.1: Conversão em Lote de PDFs (Interface Gráfica)

A aplicação Electron oferece uma interface gráfica completa para:

**PDFs → Base64:**
- Selecionar múltiplos arquivos PDF
- Converter todos para Base64
- Exportar em formatos: JSON, CSV, XML ou TXT (arquivos separados)
- Visualizar preview de PDFs antes de salvar
- Acompanhar progresso da conversão em tempo real

**Base64 → PDFs (Conversão Reversa):**
- Carregar arquivo JSON gerado anteriormente
- Preview dos PDFs que serão gerados
- Conversão automática de todos os PDFs do JSON
- Relatório de erros e sucessos
- ⚠️ **Importante**: Use apenas formato JSON para conversão reversa

### Exemplo 2.2: Workflow Completo

```javascript
// 1. Converter múltiplos PDFs para JSON
// Interface: Selecione PDFs → Escolha "JSON" → Converta
// Resultado: pdf_batch_2025-10-15.json

// 2. JSON gerado contém:
[
  {
    "filename": "documento1.pdf",
    "base64": "JVBERi0x...",
    "size": 102400,
    "sizeKB": "100.00",
    "sizeMB": "0.10"
  },
  {
    "filename": "documento2.pdf",
    "base64": "JVBERi0x...",
    "size": 204800,
    "sizeKB": "200.00",
    "sizeMB": "0.20"
  }
]

// 3. Converter de volta para PDFs
// Interface: Carregue o JSON → Selecione pasta de saída → Converta
// Resultado: documento1.pdf, documento2.pdf restaurados
```

### Exemplo 3: Imagem para Base64

```javascript
import { Base64Converter } from './core/converter.js';

const b64 = await Base64Converter.imageToBase64('./image.png', true);
console.log(b64);
```

### Exemplo 4: Base64 para Imagem

```javascript
import { Base64Converter } from './core/converter.js';

await Base64Converter.base64ToImage(base64String, './output.png');
```

### Exemplo 5: Conversão em Lote

```javascript
import { Base64Converter } from './core/converter.js';
import { FileHandler } from './utils/fileHandler.js';

const images = await FileHandler.getImageFiles('./images');
await Base64Converter.batchImagesToBase64(images, './output', false, false);
```

### Exemplo 6: Exportar para JSON

```javascript
import { Base64Converter } from './core/converter.js';

const images = ['./image1.png', './image2.jpg'];
await Base64Converter.exportToJson(images, './output.json', true);
```

### Exemplo 7: Processar Imagem

```javascript
import { ImageProcessor } from './utils/imageProcessor.js';
import fs from 'fs/promises';

const buffer = await fs.readFile('./image.png');
const thumbnail = await ImageProcessor.createThumbnailFromBytes(buffer, [150, 150]);
const dominantColor = await ImageProcessor.getDominantColor(buffer);
console.log('Dominant color:', dominantColor);
```

## 🔧 API

### PDFConverter

#### Métodos Estáticos

- `pdfToBase64(filePath, includeMime)` - Converte PDF para Base64
  - **Parâmetros**:
    - `filePath` (string): Caminho do arquivo PDF
    - `includeMime` (boolean): Incluir prefixo data URL (default: true)
  - **Retorna**: Promise<Object> com { success, data, size, sizeKB, sizeMB, fileName }

- `base64ToPDF(base64String, outputPath)` - Converte Base64 para PDF
  - **Parâmetros**:
    - `base64String` (string): String Base64 ou Data URL
    - `outputPath` (string): Caminho de saída do PDF
  - **Retorna**: Promise<Object> com { success, path, size, sizeKB, sizeMB, fileName }

- `isPDF(buffer)` - Verifica se buffer é um PDF válido
- `isValidBase64(str)` - Valida string Base64
- `getPDFInfo(buffer)` - Obtém informações básicas do PDF

### Base64Converter

#### Métodos Estáticos

- `decodeBase64(b64Text)` - Decodifica string Base64 para Buffer
- `encodeToBase64(data, includeMime, mimeType)` - Codifica Buffer para Base64
- `detectImageFormat(data)` - Detecta formato de imagem
- `getImageInfo(data)` - Obtém informações da imagem
- `base64ToImage(b64Text, outputPath, quality, optimize)` - Converte Base64 para imagem
- `imageToBase64(imagePath, includeMime, resize, quality)` - Converte imagem para Base64
- `batchImagesToBase64(imagePaths, outputDir, includeMime, singleFile)` - Conversão em lote
- `batchBase64ToImages(base64Texts, outputDir, prefix, formatExt)` - Conversão em lote reversa
- `exportToJson(imagePaths, outputPath, includeMime)` - Exporta para JSON
- `exportToCsv(imagePaths, outputPath, includeMime)` - Exporta para CSV
- `exportToXml(imagePaths, outputPath, includeMime)` - Exporta para XML
- `exportImages(imagePaths, outputPath, formatType, includeMime, singleFile)` - Exporta para formato especificado

### ImageProcessor

#### Métodos Estáticos

- `createThumbnail(imagePath, size)` - Cria thumbnail de arquivo
- `createThumbnailFromBytes(data, size)` - Cria thumbnail de buffer
- `optimizeImage(imagePath, maxSize, quality)` - Otimiza imagem
- `applyFilter(imageBuffer, filterName)` - Aplica filtro
- `adjustBrightness(imageBuffer, factor)` - Ajusta brilho
- `adjustContrast(imageBuffer, factor)` - Ajusta contraste
- `getDominantColor(imageBuffer)` - Obtém cor dominante
- `rotateImage(imageBuffer, angle)` - Rotaciona imagem
- `flipImage(imageBuffer, horizontal, vertical)` - Espelha imagem

### FileHandler

#### Métodos Estáticos

- `isImageFile(filePath)` - Verifica se é imagem
- `isTextFile(filePath)` - Verifica se é texto
- `getImageFiles(directory)` - Obtém imagens de diretório
- `validateOutputPath(filePath)` - Valida caminho de saída
- `saveHistory(historyFile, entries)` - Salva histórico
- `loadHistory(historyFile)` - Carrega histórico

## 🎨 Formatos Suportados

### Documentos
- PDF (Leitura e Escrita)

### Imagens
- PNG
- JPEG/JPG
- GIF
- BMP
- WEBP
- TIFF
- ICO
- AVIF

### Exportação
- TXT
- JSON
- CSV
- XML

## 🖥️ Interface Gráfica - Guia Rápido

### Aba "PDF Converter"
1. **PDF → Base64**: Selecione um PDF e converta para Base64
2. **Base64 → PDF**: 
   - Cole a string Base64
   - Clique em "Preview PDF" para visualizar antes de salvar
   - Clique em "Convert & Save PDF" para salvar o arquivo

### Aba "PDF Batch"

#### PDFs → Base64 (Conversão Normal)
1. Clique em "Select Multiple PDFs"
2. Escolha o formato de exportação (recomendado: **JSON** para conversão reversa)
3. Marque/desmarque "Include MIME type"
4. Selecione o diretório de saída
5. Clique em "Start PDF Batch Conversion"
6. Acompanhe o progresso em tempo real

#### Base64 → PDFs (Conversão Reversa) 🔄
1. Clique em "Select JSON File" (use o JSON gerado na conversão normal)
2. Visualize o preview dos PDFs que serão gerados
3. Selecione o diretório de saída
4. Clique em "Convert Base64 to PDFs"
5. Todos os PDFs serão restaurados automaticamente!

**⚠️ Importante:** 
- Apenas arquivos JSON são aceitos para conversão reversa
- O JSON deve ter a estrutura: `[{ "filename": "...", "base64": "..." }]`
- PDFs inválidos ou corrompidos serão reportados no final

### Aba "Image Batch"
- Conversão em lote de imagens para Base64
- Suporte para diversos formatos de imagem
- Exportação em múltiplos formatos

## ⚡ Performance Tips

1. Use Sharp para processamento de imagem (já incluído)
2. Processe em lote quando possível
3. Use async/await para operações I/O
4. Otimize imagens antes de converter para Base64

## 📝 Licença

MIT

## 👨‍💻 Autor

MatheusANBS

---

**Nota**: Esta é uma versão de alta performance do conversor Base64 original em Python, reescrita em Node.js para máxima velocidade de processamento.
