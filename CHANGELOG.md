# Changelog

## [1.5.0] - 2025-10-16

### 🤖 AI-Powered PDF Search

#### New AI Search Module
- ✅ **AI PDF Search Tab**: New dedicated interface for intelligent PDF querying
- ✅ **PDF Text Extraction**: Automatic text extraction using pdf-parse library
- ✅ **OpenAI Integration**: Support for GPT-3.5-turbo, GPT-4, and GPT-4-turbo models
- ✅ **Intelligent Q&A**: Ask questions about PDF content and get AI-powered answers
- ✅ **Context-Aware Responses**: AI answers based only on document content
- ✅ **Smart Truncation**: Automatic text truncation for long documents
- ✅ **Configurable Parameters**: 
  - Model selection (GPT-3.5, GPT-4, GPT-4-turbo)
  - Response length (300-2000 tokens)
  - Temperature control
- ✅ **Search History**: Track all questions and answers with metadata
- ✅ **PDF Caching**: Intelligent caching for improved performance
- ✅ **Token Usage Tracking**: Real-time monitoring of API usage

#### New Backend Module
- ✅ Created `core/pdfSearcher.js` with:
  - `initializeOpenAI()`: API key initialization
  - `extractTextFromPDF()`: Text extraction with metadata
  - `searchWithAI()`: AI-powered search
  - `extractAndSearch()`: Combined extraction and search
  - `clearCache()`: Cache management
  - `getCacheStats()`: Cache statistics
- ✅ Error handling with custom `PDFSearchError` class
- ✅ PDF text caching with automatic cleanup
- ✅ Support for multi-page documents

#### New IPC Handlers
- ✅ `init-openai`: Initialize OpenAI client
- ✅ `is-openai-initialized`: Check initialization status
- ✅ `extract-pdf-text`: Extract text from PDF
- ✅ `search-pdf-ai`: Perform AI search
- ✅ `extract-and-search-pdf`: Combined operation
- ✅ `clear-pdf-cache`: Clear PDF cache

#### User Interface
- ✅ OpenAI API key configuration section
- ✅ PDF upload with automatic text extraction
- ✅ PDF information display (pages, words, characters)
- ✅ Question input with real-time validation
- ✅ Model and parameter selection
- ✅ Loading indicator during AI processing
- ✅ Answer display with formatting
- ✅ Metadata display (tokens used, model, PDF info)
- ✅ Search history with timestamps
- ✅ Copy answer functionality
- ✅ Status indicators for connection state

#### Dependencies
- ✅ `pdf-parse`: ^2.3.12 for PDF text extraction
- ✅ `openai`: ^6.3.0 for AI integration
- ✅ `dotenv`: ^17.2.3 for environment configuration

#### Documentation
- ✅ README.md updated with AI Search feature
- ✅ Usage guide with examples
- ✅ API reference for PDFSearcher module
- ✅ Configuration instructions
- ✅ Limitations and tips section
- ✅ `.env.example` file for API key setup

#### Technical Improvements
- ✅ Modular architecture following existing patterns
- ✅ Error handling with specific error messages
- ✅ Memory-efficient caching with size limits
- ✅ Secure API key handling (session-only storage)
- ✅ Real-time UI updates and feedback
- ✅ Token usage optimization
- ✅ Support for various OpenAI models

---

## [1.4.0] - 2025-10-16

### 📊 Conversor de Excel e CSV

#### Excel Converter Unificado 📑
- ✅ **Interface unificada**: Encode e Decode na mesma aba
- ✅ Seção "📤 Excel/CSV to JSON" (encode)
  - Seleção de arquivos Excel/CSV
  - Seletor de planilhas (sheets) com informações de linhas
  - Preview das informações da planilha
  - Conversão com validação automática
- ✅ Seção "📥 JSON to Excel/CSV" (decode)
  - Seleção de arquivo JSON via file picker
  - Conversão de JSON estruturado para Excel
  - Validação de estrutura JSON
  - Geração automática de arquivo Excel
- ✅ Suporte a múltiplos formatos: .xlsx, .xls, .csv, .xlsb, .ods
- ✅ Informações detalhadas: nome da planilha, total de linhas
- ✅ Feedback visual em tempo real

#### Novo Backend ExcelConverter
- ✅ Criado `core/excelConverter.js` usando biblioteca xlsx (SheetJS)
- ✅ Método `excelToJson()`: Conversão completa de Excel/CSV para JSON
- ✅ Método `jsonToExcel()`: Decodificação de JSON para Excel
- ✅ Método `getWorkbookInfo()`: Extração de informações das planilhas
- ✅ Método `batchExcelToJson()`: Batch para JSON estruturado
- ✅ Método `batchJsonToExcel()`: Conversão reversa de JSON
- ✅ Validação automática de formatos Excel
- ✅ Suporte a múltiplas planilhas (sheets)
- ✅ Tratamento robusto de erros

#### Excel Batch Converter 📦
- ✅ **Barra de progresso arquivo por arquivo**
- ✅ Progresso em tempo real: "Processing X/Y (Z%)"
- ✅ Exportação para JSON estruturado (tipo: `excel-base64-batch`)
- ✅ Seleção de planilha específica ou todas
- ✅ Metadados completos por arquivo: nome da planilha, linhas, caminho original
- ✅ Contador de arquivos selecionados
- ✅ Lista visual de arquivos com ícones
- ✅ Relatório de sucessos e falhas

#### Excel Batch Reverse Converter 🔄
- ✅ **Conversão reversa em lote**: JSON → Excel
- ✅ Carregamento e validação de arquivos JSON
- ✅ Validação de estrutura JSON (tipo: `excel-base64-batch`)
- ✅ Preview dos arquivos que serão gerados
- ✅ Contador de planilhas encontradas no JSON
- ✅ **Barra de progresso arquivo por arquivo**
- ✅ Progresso em tempo real: "Converting X/Y (Z%) - Y successful"
- ✅ Conversão automática de todos os arquivos Excel
- ✅ Geração de arquivos .xlsx
- ✅ Relatório detalhado de sucessos e erros
- ✅ Tratamento de erros individualizado por arquivo
- ✅ Lista visual com informações de linhas

#### Novos IPC Handlers
- ✅ `select-excel-file`: Seleção de arquivo Excel/CSV único
- ✅ `select-excel-files`: Seleção múltipla de arquivos Excel/CSV
- ✅ `excel-to-json`: Conversão de Excel para JSON
- ✅ `json-to-excel`: Conversão de JSON para Excel
- ✅ `get-workbook-info`: Extração de informações das planilhas
- ✅ `batch-excel-to-json`: Batch para JSON
- ✅ `batch-json-to-excel`: Conversão reversa de JSON

#### Interface Consistente
- ✅ **Mesma estrutura** dos conversores de PDF e Imagens
- ✅ Conversão unificada na mesma página
- ✅ Batch com conversão reversa via JSON
- ✅ Barras de progresso idênticas
- ✅ Mensagens de feedback padronizadas
- ✅ Validações e tratamento de erros consistentes

### 🛠️ Melhorias Técnicas
- ✅ Biblioteca xlsx (SheetJS) v0.18.x integrada
- ✅ Código modular e reutilizável
- ✅ Validação de JSON estruturado aprimorada
- ✅ Processamento assíncrono otimizado
- ✅ Gerenciamento de estado aprimorado no renderer
- ✅ Feedback visual em tempo real
- ✅ Suporte a múltiplas planilhas por arquivo

### 📝 Estrutura JSON Excel
```json
{
  "type": "excel-base64-batch",
  "created": "2025-10-16T...",
  "totalFiles": 5,
  "successful": 5,
  "failed": 0,
  "files": [
    {
      "filename": "data.xlsx",
      "originalPath": "C:\\path\\to\\data.xlsx",
      "sheetName": "Sheet1",
      "data": [
        {"column1": "value1", "column2": "value2"},
        {"column1": "value3", "column2": "value4"}
      ],
      "rowCount": 2,
      "index": 0
    }
  ],
  "errors": []
}
```

---

## [1.3.0] - 2025-10-15

### 🎨 Unificação da Interface de Conversão de Imagens

#### Image Converter Unificado 🖼️
- ✅ **Interface unificada**: Encode e Decode na mesma aba (igual ao PDF Converter)
- ✅ Substituição das abas separadas por uma única aba "Image Converter"
- ✅ Seção "📤 Image to Base64" (encode)
- ✅ Seção "📥 Base64 to Image" (decode)
- ✅ Preview de imagens em ambas as seções
- ✅ Informações detalhadas: formato, dimensões, tamanho, canais
- ✅ Suporte a todos os formatos: PNG, JPEG, GIF, BMP, WebP, TIFF, ICO, AVIF

#### Novo Backend ImageConverter
- ✅ Criado `core/imageConverter.js` seguindo padrão do `pdfConverter.js`
- ✅ Método `imageToBase64()`: Conversão completa com metadados
- ✅ Método `base64ToImage()`: Decodificação com validação
- ✅ Método `batchImagesToJson()`: Batch para JSON estruturado
- ✅ Método `batchJsonToImages()`: Conversão reversa de JSON
- ✅ Método `exportImagesTo()`: Exportação para TXT, CSV, XML
- ✅ Validação de formatos de imagem com Sharp
- ✅ Detecção automática de formato
- ✅ Tratamento robusto de erros

#### Image Batch Converter 📦
- ✅ **Barra de progresso arquivo por arquivo** (igual ao PDF Batch)
- ✅ Progresso em tempo real: "Processing X/Y (Z%)"
- ✅ Exportação para JSON estruturado (tipo: `image-base64-batch`)
- ✅ Exportação para TXT, CSV, XML
- ✅ Metadados completos por imagem: formato, dimensões, canais, tamanho
- ✅ Contador de arquivos selecionados
- ✅ Lista visual de arquivos com ícones
- ✅ Relatório de sucessos e falhas

#### Image Batch Reverse Converter 🔄
- ✅ **Conversão reversa em lote**: JSON → Imagens
- ✅ Carregamento e validação de arquivos JSON
- ✅ Validação de estrutura JSON (tipo: `image-base64-batch`)
- ✅ Preview dos arquivos que serão gerados
- ✅ Contador de imagens encontradas no JSON
- ✅ **Barra de progresso arquivo por arquivo** (igual ao PDF Batch Reverse)
- ✅ Progresso em tempo real: "Converting X/Y (Z%) - Y successful"
- ✅ Conversão automática de todas as imagens
- ✅ Detecção automática de formato da imagem
- ✅ Extensão automática baseada no formato
- ✅ Relatório detalhado de sucessos e erros
- ✅ Tratamento de erros individualizado por arquivo
- ✅ Lista visual com dimensões e tamanhos

#### Novos IPC Handlers
- ✅ `image-to-base64`: Conversão de imagem para Base64
- ✅ `base64-to-image`: Conversão de Base64 para imagem
- ✅ `batch-images-to-json`: Batch para JSON
- ✅ `batch-json-to-images`: Conversão reversa de JSON
- ✅ `export-images-to`: Exportação para múltiplos formatos

#### Interface Consistente
- ✅ **Mesma estrutura** para imagens e PDFs
- ✅ Conversão unificada na mesma página
- ✅ Batch com conversão reversa via JSON em ambos
- ✅ Barras de progresso idênticas
- ✅ Mensagens de feedback padronizadas
- ✅ Validações e tratamento de erros consistentes

### 🛠️ Melhorias Técnicas
- ✅ Código modular e reutilizável
- ✅ Validação de Base64 aprimorada
- ✅ Detecção de formato de imagem com Sharp
- ✅ Processamento assíncrono otimizado
- ✅ Gerenciamento de estado aprimorado no renderer
- ✅ Feedback visual em tempo real

### 📝 Estrutura JSON
```json
{
  "type": "image-base64-batch",
  "created": "2025-10-15T...",
  "totalFiles": 10,
  "successful": 10,
  "failed": 0,
  "includeMimeType": true,
  "images": [
    {
      "filename": "image.png",
      "originalPath": "C:\\path\\to\\image.png",
      "base64": "data:image/png;base64,...",
      "format": "PNG",
      "width": 1920,
      "height": 1080,
      "channels": 4,
      "size": 524288,
      "sizeKB": "512.00",
      "sizeMB": "0.50",
      "index": 0
    }
  ],
  "errors": []
}
```

---

## [1.2.0] - 2025-10-15

### ✨ Nova Funcionalidade - Conversão Reversa em Lote

#### PDF Batch Reverse Converter 🔄
- ✅ **Conversão reversa em lote**: JSON → PDFs
- ✅ Carregamento e validação de arquivos JSON
- ✅ Preview dos PDFs que serão gerados
- ✅ Contador de PDFs encontrados no JSON
- ✅ Conversão automática de todos os PDFs
- ✅ Relatório detalhado de sucessos e erros
- ✅ Validação da estrutura JSON
- ✅ Tratamento de erros individualizado por arquivo
- ✅ **Restrição**: Apenas formato JSON é aceito para garantir qualidade

#### Interface Aprimorada
- ✅ Seção dedicada "Base64 to PDFs (Batch Reverse)"
- ✅ Mensagem de ajuda destacando uso exclusivo de JSON
- ✅ Preview visual do conteúdo do JSON
- ✅ Badge informativo com contagem de PDFs
- ✅ Lista de arquivos que serão gerados
- ✅ Barra de progresso independente para conversão reversa
- ✅ Feedback detalhado com lista de erros (se houver)

#### Validações e Segurança
- ✅ Validação de estrutura do JSON (deve ser array)
- ✅ Verificação de campos obrigatórios (filename, base64)
- ✅ Filtro automático de itens inválidos
- ✅ Adição automática de extensão .pdf se ausente
- ✅ Validação de Base64 antes da conversão
- ✅ Relatório de erros sem interromper o processo

#### Backend
- Novo IPC handler: `select-json-file`
- Novo IPC handler: `read-json-file`
- Parsing e validação de JSON no main process

#### Frontend
- Lógica completa de batch reverse em renderer.js
- Gerenciamento de estado para JSON carregado
- Sistema de preview com lista de arquivos
- Progresso em tempo real com contador de sucessos

### 🛠️ Melhorias
- Recomendação explícita de uso de JSON na aba PDF Batch
- Texto de ajuda com ícone de aviso para orientar usuários
- Estilos CSS para elementos de ajuda e preview de JSON
- Documentação expandida com exemplo de workflow completo

---

## [1.1.0] - 2025-10-15

### ✨ Novas Funcionalidades

#### PDF Converter
- ✅ Conversão de PDF para Base64
- ✅ Conversão de Base64 para PDF
- ✅ **Preview de PDF em tempo real** - Visualize o PDF antes de salvar
- ✅ Validação automática de arquivos PDF (magic numbers)
- ✅ Suporte a Data URLs (data:application/pdf;base64,...)
- ✅ Informações detalhadas de tamanho (bytes, KB, MB)

#### PDF Batch Converter
- ✅ Conversão em lote de múltiplos PDFs para Base64
- ✅ Seleção múltipla de arquivos PDF
- ✅ Exportação em múltiplos formatos:
  - **TXT**: Arquivo separado para cada PDF
  - **JSON**: Estrutura organizada com metadados
  - **CSV**: Formato tabular para análise
  - **XML**: Formato estruturado
- ✅ Barra de progresso em tempo real
- ✅ Lista visual de arquivos selecionados com tamanhos
- ✅ Opção de incluir ou remover MIME type

#### Interface Gráfica
- ✅ Nova aba "PDF Converter" com design intuitivo
- ✅ Nova aba "PDF Batch" para conversões em lote
- ✅ Preview embed de PDF usando tag `<embed>`
- ✅ Mensagens de status e feedback visual
- ✅ Botões de copy/save para Base64 gerado

### 🛠️ Melhorias Técnicas

#### Core
- Novo módulo `core/pdfConverter.js` com:
  - Classe `PDFConverter` para operações de PDF
  - Validação de arquivos PDF via magic numbers (%PDF-)
  - Validação robusta de strings Base64
  - Tratamento de erros personalizado
  - Suporte a Data URLs

#### Backend (Electron)
- Novos IPC handlers:
  - `select-pdf-file`: Seleção de arquivo PDF único
  - `select-pdf-files`: Seleção múltipla de PDFs
  - `pdf-to-base64`: Conversão de PDF para Base64
  - `base64-to-pdf`: Conversão de Base64 para PDF
- Integração do módulo PDFConverter no main process

#### Frontend
- Preview de PDF usando embed HTML5
- Lógica de batch processing com feedback visual
- Gerenciamento de estado para arquivos selecionados
- Validação de input antes da conversão

### 📚 Documentação
- README.md atualizado com:
  - Exemplos de uso das novas funcionalidades
  - Guia rápido da interface gráfica
  - Documentação da API PDFConverter
- CHANGELOG.md criado para rastreamento de versões

### 🎨 UI/UX
- Estilos CSS para preview de PDF
- Seções organizadas com subsections
- Divisores visuais entre funcionalidades
- Design consistente com o resto da aplicação

---

## [1.0.0] - 2025-10-14

### 🚀 Lançamento Inicial
- Conversão de imagens para Base64
- Conversão de Base64 para imagens
- Conversão em lote de imagens
- Processamento de imagens com Sharp
- Interface Electron moderna
- Exportação em múltiplos formatos (JSON, CSV, XML)
- Suporte para diversos formatos de imagem

