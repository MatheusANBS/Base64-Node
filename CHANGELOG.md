# Changelog

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

