[![Licença MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Plataforma](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue)]()
[![Linguagens](https://img.shields.io/badge/languages-JavaScript%2C%20HTML%2C%20CSS-brightgreen)]()
[![Versão](https://img.shields.io/badge/versão-1.4.0-blue)]()

> Leia em: [English](README.md) | [Português Brasileiro](README.pt-BR.md)

> ⚠️ Este README está em português. Para inglês, veja [README.md](https://github.com/MatheusANBS/Base64-Node/blob/main/README.md).

# Base64 Converter

Aplicativo desktop de alta performance para codificação e decodificação Base64, feito com Electron e Node.js. O aplicativo oferece conversão abrangente para imagens, PDFs e arquivos Excel/CSV, com recursos para processamento individual e em lote.

## Demo

*Screenshots em breve! Execute os passos de instalação acima para testar o aplicativo.*

## Índice

- [Visão Geral](#visão-geral)
- [Recursos](#recursos)
  - [Funcionalidades Principais](#funcionalidades-principais)
  - [Recursos de Lote](#recursos-de-lote)
- [Instalação](#instalação)
  - [Pré-requisitos](#pré-requisitos)
  - [Passos](#passos)
  - [Modo Desenvolvimento](#modo-desenvolvimento)
- [Uso](#uso)
  - [Conversor de Imagens](#conversor-de-imagens)
    - [Codificar (Imagem para Base64)](#codificar-imagem-para-base64)
    - [Decodificar (Base64 para Imagem)](#decodificar-base64-para-imagem)
  - [Conversor de PDF](#conversor-de-pdf)
    - [Codificar (PDF para Base64)](#codificar-pdf-para-base64)
    - [Decodificar (Base64 para PDF)](#decodificar-base64-para-pdf)
  - [Conversor de Excel/CSV](#conversor-de-excelcsv)
    - [Codificar (Excel/CSV para JSON)](#codificar-excelcsv-para-json)
    - [Decodificar (JSON para Excel/CSV)](#decodificar-json-para-excelcsv)
  - [Processamento em Lote](#processamento-em-lote)
    - [Conversão em Lote para JSON](#conversão-em-lote-para-json)
    - [Conversão Reversa em Lote (JSON para arquivos)](#conversão-reversa-em-lote-json-para-arquivos)
- [Referência de API](#referência-de-api)
  - [ImageConverter](#imageconverter)
    - [Métodos](#métodos-imageconverter)
  - [PDFConverter](#pdfconverter)
    - [Métodos](#métodos-pdfconverter)
  - [ExcelConverter](#excelconverter)
    - [Métodos](#métodos-excelconverter)
  - [ImageProcessor](#imageprocessor)
    - [Métodos](#métodos-imageprocessor)
  - [FileHandler](#filehandler)
    - [Métodos](#métodos-filehandler)
- [Formatos Suportados](#formatos-suportados)
  - [Imagens](#imagens)
  - [Documentos](#documentos)
  - [Planilhas](#planilhas)
  - [Formatos de Exportação](#formatos-de-exportação)
- [Arquitetura](#arquitetura)
  - [Estrutura do Projeto](#estrutura-do-projeto)
  - [Stack Tecnológico](#stack-tecnológico)
  - [Padrões de Projeto](#padrões-de-projeto)
- [Performance](#performance)
  - [Comparativo de Benchmark](#comparativo-de-benchmark)
  - [Recursos de Otimização](#recursos-de-otimização)
- [Build](#build)
  - [Compilar para Distribuição](#compilar-para-distribuição)
  - [Configuração de Build](#configuração-de-build)
- [Tratamento de Erros](#tratamento-de-erros)
- [Segurança](#segurança)
- [FAQ / Solução de Problemas](#faq--solução-de-problemas)
- [Downloads](#downloads)
- [Contribuindo](#contribuindo)
- [Licença](#licença)
- [Autor](#autor)
- [Agradecimentos](#agradecimentos)

## Visão Geral

Base64 Converter é um aplicativo desktop multiplataforma que permite conversão eficiente entre diversos formatos de arquivos e suas representações Base64. O aplicativo oferece interface unificada para conversões individuais, processamento em lote e reversão a partir de arquivos JSON estruturados.

### Destaques

- **Suporte a múltiplos formatos**: Imagens (PNG, JPEG, GIF, BMP, WebP, TIFF, ICO, AVIF), PDFs, Excel (.xlsx, .xls, .csv, .xlsb, .ods)
- **Conversão bidirecional**: Codifique para Base64 e recupere o arquivo original
- **Processamento em lote**: Converta múltiplos arquivos simultaneamente, com barra de progresso
- **Conversão reversa**: Restaure arquivos a partir de dados estruturados em JSON
- **Alta performance**: Implementação otimizada em Node.js (~35x mais rápido que Python)
- **UI profissional**: Interface moderna com abas unificadas para cada conversor
- **Arquitetura modular**: Conversores separados para cada tipo de arquivo, com tratamento de erros detalhado

## Recursos

### Funcionalidades Principais

#### Conversor de Imagens
- Converte imagens para Base64 com opção de prefixo MIME
- Decodifica Base64 de volta para arquivos de imagem
- Suporte a 9 formatos: PNG, JPEG, GIF, BMP, WebP, TIFF, ICO, AVIF
- Extração de metadados (dimensões, canais, formato, tamanho)
- Opções de redimensionamento e qualidade
- Preview em tempo real
- Conversão em lote com exportação para JSON
- Conversão reversa (JSON para imagens)
- Exportação para TXT, CSV, XML, JSON

#### Conversor de PDF
- Converte PDFs para Base64
- Decodifica Base64 de volta para PDF
- Validação via magic number
- Relatório de tamanho (bytes, KB, MB)
- Preview de PDFs decodificados
- Processamento em lote
- Conversão reversa (JSON para PDFs)

#### Conversor de Excel/CSV
- Converte Excel/CSV para JSON
- Decodifica JSON para Excel/CSV
- Suporte a múltiplas planilhas
- Detecção automática do formato
- Relatório de linhas/colunas
- Extração de informações do workbook
- Conversão em lote para JSON estruturado
- Conversão reversa com seleção de formato

### Recursos de Lote

- **Barra de progresso em tempo real**
- **Exportação JSON estruturada**: Com timestamp, metadados e erros
- **Conversão reversa em lote**
- **Tratamento de erros individual**
- **Flexibilidade de formato**: JSON, TXT, CSV, XML
- **Feedback visual detalhado**

## Instalação

### Pré-requisitos

- Node.js (v14 ou superior)
- npm ou yarn

### Passos

```bash
# Clone o repositório
git clone https://github.com/MatheusANBS/Base64-Node.git

# Entre na pasta do projeto
cd Base64-Node

# Instale as dependências
npm install

# Execute o aplicativo
npm start
```

### Modo Desenvolvimento

```bash
# Execute com DevTools aberto
npm run dev
```

## Uso

### Conversor de Imagens

A aba "Conversor de Imagens" permite codificação e decodificação em uma única interface.

#### Codificar (Imagem para Base64)

1. Clique em "Selecionar Imagem"
2. Veja o preview
3. Habilite "Incluir MIME type" se quiser formato data URL
4. Clique em "Converter para Base64"
5. Copie ou salve o resultado

#### Decodificar (Base64 para Imagem)

1. Clique em "Selecionar arquivo JSON" ou cole manualmente o Base64
2. Ajuste a qualidade e otimização se desejar
3. Clique em "Converter & Salvar Imagem"
4. Escolha a pasta/formato de saída

### Conversor de PDF

A aba "Conversor de PDF" permite conversão bidirecional entre PDF e Base64.

#### Codificar (PDF para Base64)

1. Clique em "Selecionar Arquivo PDF"
2. Opcionalmente, habilite "Incluir MIME type"
3. Clique em "Converter para Base64"
4. Visualize as informações do arquivo (tamanho, nome)
5. Copie ou salve o resultado Base64

#### Decodificar (Base64 para PDF)

1. Cole a string Base64 na área de texto
2. Clique em "Visualizar PDF" para verificar o conteúdo (opcional)
3. Clique em "Converter & Salvar PDF"
4. Selecione o local de destino

### Conversor de Excel/CSV

A aba "Conversor de Excel/CSV" oferece suporte a arquivos Excel multi-planilha e conversão de CSV.

#### Codificar (Excel/CSV para JSON)

1. Clique em "Selecionar Arquivo Excel/CSV"
2. Selecione a planilha desejada no menu dropdown (se houver múltiplas)
3. Visualize informações da planilha (número de linhas, colunas)
4. Clique em "Converter para JSON"
5. Veja o resultado JSON na área de texto
6. Copie ou salve os dados JSON

#### Decodificar (JSON para Excel/CSV)

1. Clique em "Selecionar Arquivo JSON" para carregar dados JSON estruturados
2. Especifique o nome da planilha (padrão: "Sheet1")
3. Clique em "Converter para Excel/CSV"
4. Escolha o local de destino e o formato (.xlsx, .csv, etc.)

### Processamento em Lote

Todos os conversores suportam processamento em lote com recursos avançados.

#### Conversão em Lote para JSON

1. Navegue até a aba "Lote" correspondente
2. Clique em "Selecionar Múltiplos Arquivos" (Imagens/PDFs/Excel)
3. Veja a lista de arquivos selecionados
4. Configure as opções:
   - Incluir prefixo MIME (Imagens/PDFs)
   - Selecionar planilha ou "Todas as Planilhas" (Excel)
   - Escolha o formato de exportação: JSON (recomendado para conversão reversa)
5. Selecione o diretório de destino
6. Clique em "Iniciar Conversão em Lote"
7. Acompanhe o progresso em tempo real
8. Veja o resumo da conclusão

#### Conversão Reversa em Lote (JSON para arquivos)

1. Na aba "Lote", role até a seção "Conversão Reversa"
2. Clique em "Selecionar Arquivo JSON" (deve ser um arquivo JSON gerado pela conversão em lote)
3. Visualize os arquivos que serão gerados
4. Selecione o diretório de destino
5. Para Excel: Escolha o formato de saída (.xlsx, .csv, etc.)
6. Clique em "Converter para Arquivos"
7. Acompanhe o progresso e veja os resultados

## Referência de API

### ImageConverter

Módulo principal para operações de Base64 com imagens.

#### Métodos

**`imageToBase64(filePath, includeMime, resize, quality)`**

Converte um arquivo de imagem para Base64.

- **Parâmetros:**
  - `filePath` (string): Caminho para o arquivo de imagem
  - `includeMime` (boolean): Incluir prefixo MIME type (padrão: `true`)
  - `resize` (Array|null): Opcional `[width, height]` para redimensionamento
  - `quality` (number): Qualidade da compressão 1-100 (padrão: `95`)

- **Retorna:** `Promise<Object>`
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

Converte uma string Base64 para um arquivo de imagem.

- **Parâmetros:**
  - `base64String` (string): Dados da imagem codificados em Base64 ou data URL
  - `outputPath` (string): Caminho para o arquivo de destino
  - `quality` (number): Qualidade para compressão (padrão: `95`)
  - `optimize` (boolean): Habilitar otimização (padrão: `false`)

- **Retorna:** `Promise<Object>`

**`batchImagesToJson(imagePaths, outputPath, includeMime)`**

Converte em lote múltiplas imagens para um arquivo JSON estruturado.

- **Retorna:** Arquivo JSON com a estrutura:
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

Restaura imagens a partir de um arquivo JSON em lote.

**`exportImagesTo(imagePaths, outputPath, format, includeMime)`**

Exporta imagens para os formatos TXT, CSV ou XML.

- **Formatos:** `'txt'`, `'csv'`, `'xml'`

### PDFConverter

Módulo principal para operações de Base64 com PDFs.

#### Métodos

**`pdfToBase64(filePath, includeMime)`**

Converte um arquivo PDF para Base64.

- **Parâmetros:**
  - `filePath` (string): Caminho para o arquivo PDF
  - `includeMime` (boolean): Incluir prefixo MIME type (padrão: `true`)

- **Retorna:** `Promise<Object>`
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

Converte uma string Base64 para um arquivo PDF.

**`isPDF(buffer)`**

Valida se um buffer é um PDF válido (verifica o magic number `%PDF-`).

- **Retorna:** `boolean`

**`isValidBase64(str)`**

Valida o formato de uma string Base64.

- **Retorna:** `boolean`

**`getPDFInfo(buffer)`**

Extrai metadados do PDF (versão, tamanho).

### ExcelConverter

Módulo principal para conversão de Excel/CSV para JSON.

#### Métodos

**`excelToJson(filePath, sheetName)`**

Converte um arquivo Excel/CSV para JSON.

- **Parâmetros:**
  - `filePath` (string): Caminho para o arquivo Excel/CSV
  - `sheetName` (string|null): Nome da planilha ou `null` para a primeira planilha

- **Retorna:** `Promise<Object>`
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

Converte um array JSON para um arquivo Excel/CSV.

- **Parâmetros:**
  - `jsonData` (Array): Array de objetos
  - `outputPath` (string): Caminho para o arquivo de destino (.xlsx, .csv, etc.)
  - `sheetName` (string): Nome para a planilha (padrão: `'Sheet1'`)

**`getWorkbookInfo(filePath)`**

Recupera informações do workbook (planilhas, número de linhas, colunas).

**`batchExcelToJson(filePaths, outputPath)`**

Converte em lote arquivos Excel/CSV para JSON estruturado.

- **Retorna:** Arquivo JSON com a estrutura:
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

Restaura arquivos Excel/CSV a partir de um JSON em lote.

- **Parâmetros:**
  - `format` (string): Formato de destino (`'xlsx'`, `'csv'`, `'xls'`, etc.)

**`isValidExcel(buffer)`**

Valida se um buffer é um arquivo Excel/CSV válido.

**`getSupportedFormats()`**

Retorna um array com os formatos suportados.

- **Retorna:** `['xlsx', 'xls', 'csv', 'xlsb', 'ods']`

### ImageProcessor

Módulo utilitário para manipulação avançada de imagens.

#### Métodos

- `createThumbnail(imagePath, size)` - Cria uma miniatura a partir de um arquivo
- `createThumbnailFromBytes(data, size)` - Cria uma miniatura a partir de um buffer
- `optimizeImage(imagePath, maxSize, quality)` - Otimiza uma imagem
- `applyFilter(imageBuffer, filterName)` - Aplica filtros (blur, sharpen, grayscale, negate)
- `adjustBrightness(imageBuffer, factor)` - Ajusta o brilho
- `adjustContrast(imageBuffer, factor)` - Ajusta o contraste
- `getDominantColor(imageBuffer)` - Extrai a cor dominante
- `rotateImage(imageBuffer, angle)` - Rotaciona a imagem
- `flipImage(imageBuffer, horizontal, vertical)` - Inverte a imagem

### FileHandler

Módulo utilitário para operações no sistema de arquivos.

#### Métodos

- `isImageFile(filePath)` - Verifica se um arquivo é uma imagem suportada
- `isTextFile(filePath)` - Verifica se um arquivo é um arquivo de texto
- `getImageFiles(directory)` - Recupera todas as imagens de um diretório
- `validateOutputPath(filePath)` - Valida e prepara o caminho de destino
- `saveHistory(historyFile, entries)` - Salva o histórico de conversões
- `loadHistory(historyFile)` - Carrega o histórico de conversões

## Formatos Suportados

### Imagens
- **PNG** - Portable Network Graphics
- **JPEG/JPG** - Joint Photographic Experts Group
- **GIF** - Graphics Interchange Format
- **BMP** - Bitmap Image File
- **WebP** - Web Picture Format
- **TIFF** - Tagged Image File Format
- **ICO** - Icon Format
- **AVIF** - AV1 Image File Format

### Documentos
- **PDF** - Portable Document Format

### Planilhas
- **XLSX** - Excel Workbook (2007+)
- **XLS** - Excel Workbook (97-2003)
- **CSV** - Comma-Separated Values
- **XLSB** - Excel Binary Workbook
- **ODS** - OpenDocument Spreadsheet

### Formatos de Exportação
- **JSON** - JavaScript Object Notation (estruturado, suporta conversão reversa)
- **TXT** - Texto puro
- **CSV** - Comma-Separated Values
- **XML** - Extensible Markup Language

## Arquitetura

### Estrutura do Projeto

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

### Stack Tecnológico

- **Electron**: Framework para aplicativos desktop multiplataforma
- **Node.js**: Ambiente de execução JavaScript
- **Sharp**: Biblioteca de processamento de imagens de alta performance
- **XLSX (SheetJS)**: Biblioteca para parsing e geração de arquivos Excel/CSV
- **IPC (Inter-Process Communication)**: Comunicação entre o processo principal e o processo de renderização do Electron

### Padrões de Projeto

- **Arquitetura modular**: Conversores separados para cada tipo de arquivo
- **Tratamento de erros**: Classes de erro customizadas com mensagens descritivas
- **Isolamento de contexto**: Processo de renderização seguro com context bridge
- **APIs baseadas em Promises**: Async/await para todas as operações de I/O
- **Camadas de validação**: Validação de entrada em múltiplos níveis
- **Processamento em lote**: Processamento incremental com rastreamento de progresso

## Performance

### Comparativo de Benchmark

A implementação em Node.js oferece melhorias significativas de performance em relação a implementações equivalentes em Python:

- **Python**: ~7 segundos para 100M iterações
- **Node.js**: ~0.2 segundos para 100M iterações
- **Aceleração**: ~35x mais rápido

### Recursos de Otimização

- **Biblioteca Sharp**: Processamento de imagem acelerado por hardware
- **I/O Assíncrono**: Operações de arquivo não bloqueantes
- **Streaming**: Processamento eficiente de memória para arquivos grandes
- **Gerenciamento de Buffer**: Codificação/decodificação Base64 otimizada
- **Processamento em lote incremental**: Progresso em tempo real sem bloqueio

## Building

### Compilar para Distribuição

```bash
# Compilar para Windows
npm run build:win

# Compilar para Windows (instalador completo)
npm run build:win-full

# Compilar para macOS
npm run build:mac

# Compilar para Linux
npm run build:linux

# Criar versão portátil
npm run package
```

### Configuração de Build

O aplicativo usa `electron-builder` para empacotamento. A configuração é definida em `package.json`:

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
      "icon": "assets/icon.ico",
      "sign": null,
      "verifyUpdateCodeSignature": false
    }
  }
}
```

## Tratamento de Erros

Todos os conversores implementam classes de erro personalizadas:

- **`ImageConversionError`**: Erros específicos de imagem
- **`PDFConversionError`**: Erros específicos de PDF
- **`ExcelConversionError`**: Erros específicos de Excel/CSV
- **`ConversionError`**: Erros gerais de conversão (conversor legado)

Cada erro inclui:
- Mensagens de erro descritivas
- Propagação de erros das bibliotecas subjacentes
- Indicadores de sucesso/falha nos objetos de retorno

## Segurança

- **Isolamento de contexto**: O processo de renderização é isolado do Node.js
- **Context bridge**: Apenas APIs expostas são acessíveis
- **Validação de entrada**: Todas as entradas são validadas antes do processamento
- **Sanitização de caminho**: Os caminhos de arquivo são validados e sanitizados
- **Verificação de magic number**: Verificação do tipo de arquivo além das extensões

## FAQ / Solução de Problemas

**P:** O aplicativo não inicia no Linux.  
**R:** Certifique-se de que as dependências do Electron estão instaladas. Tente executar `npm install` novamente e use o Node.js v14 ou superior.

**P:** Erro ao instalar as dependências.  
**R:** Use o Node.js v14 ou mais recente. Exclua a pasta `node_modules` e execute `npm install` na raiz do projeto.

**P:** Não consigo abrir arquivos PDF/imagem/Excel.  
**R:** Certifique-se de que os arquivos não estão corrompidos e são formatos suportados (veja [Formatos Suportados](#formatos-suportados)).

**P:** Arrastar e soltar não funciona.  
**R:** Atualmente, a seleção de arquivos é feita por meio de botões. O suporte a arrastar e soltar está planejado para atualizações futuras.

**P:** Onde posso encontrar os arquivos gerados?  
**R:** No diretório ou caminho de arquivo escolhido durante a caixa de diálogo de conversão.

**P:** Existe uma versão portátil disponível?  
**R:** Sim, você pode criar uma usando `npm run package` para Windows ou baixar versões pré-compiladas em [Releases](https://github.com/MatheusANBS/Base64-Node/releases).

## Downloads

Você pode baixar as versões mais recentes (Windows, macOS, Linux) na página de [Releases](https://github.com/MatheusANBS/Base64-Node/releases).

## Contribuindo

Contribuições são bem-vindas. Por favor, garanta que:

1. O código segue os padrões existentes
2. O tratamento de erros é abrangente
3. A documentação é atualizada
4. Os testes são realizados em todas as plataformas

## Licença

MIT License

Copyright (c) 2025 MatheusANBS

É concedida permissão, livre de encargos, a qualquer pessoa que obtenha uma cópia
deste software e dos arquivos de documentação associados (o "Software"), para negociar
o Software sem restrições, incluindo, sem limitação, os direitos de
usar, copiar, modificar, fundir, publicar, distribuir, sublicenciar e/ou vender
cópias do Software, e permitir que as pessoas a quem o Software é
fornecido a fazê-lo, sujeitos às seguintes condições:

O aviso de direitos autorais acima e este aviso de permissão devem ser incluídos em todas as
cópias ou partes substanciais do Software.

O SOFTWARE É FORNECIDO "COMO ESTÁ", SEM GARANTIA DE QUALQUER TIPO, EXPRESSA
OU IMPLÍCITA, INCLUINDO, MAS NÃO SE LIMITANDO ÀS GARANTIAS DE COMERCIALIZAÇÃO,
ADEQUAÇÃO A UM DETERMINADO FIM E NÃO INFRAÇÃO. EM NENHUM EVENTO O
AUTORES OU TITULARES DOS DIREITOS AUTORAIS SERÃO RESPONSÁVEIS POR QUALQUER REIVINDICAÇÃO, DANOS OU OUTROS
RESPONSABILIDADE, SEJA EM UMA AÇÃO DE CONTRATO, ATO ILÍCITO OU DE OUTRA FORMA, DECORRENTE DE,
FORA DE OU EM CONEXÃO COM O SOFTWARE OU O USO OU OUTRAS NEGOCIAÇÕES NO
SOFTWARE.

## Autor

**MatheusANBS**

- GitHub: [@MatheusANBS](https://github.com/MatheusANBS)
- Repositório: [Base64-Node](https://github.com/MatheusANBS/Base64-Node)

## Agradecimentos

- **Sharp**: Biblioteca Node.js de alta performance para processamento de imagens
- **SheetJS (XLSX)**: Biblioteca para parsing de Excel e planilhas
- **Electron**: Framework para construir aplicativos desktop multiplataforma