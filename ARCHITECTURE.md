# AI PDF Search - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Electron Application                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐         ┌──────────────────┐          │
│  │  Renderer Process│◄───────►│   Main Process   │          │
│  │   (renderer.js) │   IPC   │    (main.js)     │          │
│  └─────────────────┘         └──────────────────┘          │
│         │                             │                      │
│         │                             │                      │
│         ▼                             ▼                      │
│  ┌─────────────────┐         ┌──────────────────┐          │
│  │   index.html    │         │  Core Modules    │          │
│  │   (UI Layer)    │         │                  │          │
│  │                 │         │  ┌────────────┐  │          │
│  │  • API Key Input│         │  │pdfSearcher │  │          │
│  │  • PDF Upload   │         │  │  .js       │  │          │
│  │  • Question Box │         │  └────────────┘  │          │
│  │  • Results      │         │  ┌────────────┐  │          │
│  │  • History      │         │  │pdfConverter│  │          │
│  └─────────────────┘         │  │  .js       │  │          │
│         │                     │  └────────────┘  │          │
│         │                     └──────────────────┘          │
│         ▼                             │                      │
│  ┌─────────────────┐                 │                      │
│  │   styles.css    │                 │                      │
│  │ (Styling Layer) │                 │                      │
│  └─────────────────┘                 │                      │
│                                       │                      │
└───────────────────────────────────────┼──────────────────────┘
                                        │
                        ┌───────────────┴───────────────┐
                        │                               │
                        ▼                               ▼
                ┌──────────────┐            ┌─────────────────┐
                │   pdf-parse  │            │   OpenAI API    │
                │   Library    │            │  (GPT Models)   │
                └──────────────┘            └─────────────────┘
```

## Component Breakdown

### 1. Renderer Process (Frontend)

**File**: `renderer.js`

**Responsibilities**:
- Handle user interactions
- Manage UI state
- Display PDF information
- Show AI responses
- Maintain search history
- Call IPC methods to communicate with main process

**Key Functions**:
- `updateSearchButtonState()`: Enable/disable search button
- `addToSearchHistory()`: Track searches
- `renderSearchHistory()`: Display history
- Event handlers for buttons and inputs

### 2. Main Process (Backend)

**File**: `main.js`

**Responsibilities**:
- Create Electron window
- Handle IPC communication
- Route requests to core modules
- Manage file dialogs
- Control application lifecycle

**IPC Handlers**:
- `init-openai`: Initialize OpenAI client
- `is-openai-initialized`: Check OpenAI status
- `extract-pdf-text`: Extract text from PDF
- `search-pdf-ai`: Perform AI search
- `extract-and-search-pdf`: Combined operation
- `clear-pdf-cache`: Clear cache

### 3. Preload Script

**File**: `preload.js`

**Responsibilities**:
- Bridge between renderer and main process
- Expose safe APIs via context bridge
- Maintain security isolation

**Exposed APIs**:
```javascript
{
  initOpenAI,
  isOpenAIInitialized,
  extractPDFText,
  searchPDFWithAI,
  extractAndSearchPDF,
  clearPDFCache,
  selectPDFFile,
  showMessage
}
```

### 4. Core Module - PDFSearcher

**File**: `core/pdfSearcher.js`

**Responsibilities**:
- Manage OpenAI client initialization
- Extract text from PDF files
- Send requests to OpenAI API
- Cache PDF content
- Handle errors

**Key Methods**:
- `initializeOpenAI(apiKey)`: Set up OpenAI client
- `extractTextFromPDF(filePath)`: Parse PDF and extract text
- `searchWithAI(text, question, options)`: Query OpenAI
- `extractAndSearch(filePath, question, options)`: Combined operation

**Caching Strategy**:
- LRU cache with max 10 entries
- Cache key: `${filePath}-${modificationTime}`
- Automatic cleanup on size limit

### 5. UI Layer

**File**: `index.html`

**Structure**:
```
AI PDF Search Tab
├── OpenAI Configuration
│   ├── API Key Input
│   ├── Initialize Button
│   └── Status Indicator
├── PDF Upload & Search
│   ├── File Selection
│   ├── PDF Information Display
│   ├── Question Input
│   ├── Model & Options Selection
│   ├── Search Button
│   └── Results Display
└── Search History
    ├── History List
    └── Clear Button
```

**Styling**: `styles.css`
- Loading indicators with spinner
- Answer display boxes
- Status indicators (connected/disconnected)
- History cards with metadata
- Responsive layout

## Data Flow

### Initialize OpenAI Flow

```
User Input (API Key)
    │
    ▼
renderer.js (init-openai-btn click)
    │
    ▼
IPC: init-openai
    │
    ▼
main.js (ipcMain.handle)
    │
    ▼
pdfSearcher.js (initializeOpenAI)
    │
    ├─► Create OpenAI client
    └─► Return success/error
        │
        ▼
    Update UI status indicator
```

### PDF Search Flow

```
User Actions
    │
    ├─► Select PDF File
    │       │
    │       ▼
    │   Extract text automatically
    │       │
    │       ▼
    │   Display PDF info
    │
    ├─► Type Question
    │
    └─► Click Search
            │
            ▼
    renderer.js (search-pdf-btn click)
            │
            ▼
    IPC: extract-and-search-pdf
            │
            ▼
    main.js (ipcMain.handle)
            │
            ▼
    pdfSearcher.js (extractAndSearch)
            │
            ├─► Read PDF file
            ├─► Extract text (pdf-parse)
            ├─► Check cache
            ├─► Truncate if needed
            ├─► Build prompt
            ├─► Call OpenAI API
            └─► Return result
                    │
                    ▼
            Display answer in UI
                    │
                    ▼
            Add to search history
```

## Security Considerations

### API Key Storage
- ✅ Stored only in memory (PDFSearcher.openaiClient)
- ✅ Never written to disk
- ✅ Cleared when app closes
- ✅ User must re-enter each session

### Context Isolation
- ✅ Renderer process isolated from Node.js
- ✅ Only exposed APIs accessible via context bridge
- ✅ No direct file system access from renderer

### Input Validation
- ✅ API key format validation
- ✅ PDF file type verification
- ✅ Question length limits
- ✅ Parameter sanitization

### Error Handling
- ✅ Custom error classes (PDFSearchError)
- ✅ Graceful degradation
- ✅ User-friendly error messages
- ✅ No sensitive data in error logs

## Performance Optimizations

### Caching
- PDF text cached after extraction
- Cache key includes file modification time
- LRU eviction policy (max 10 entries)
- Automatic cleanup

### Async Operations
- All file I/O is asynchronous
- Non-blocking UI updates
- Loading indicators during processing
- Promise-based API

### Token Management
- Text truncation for long documents
- Configurable response length
- Token usage tracking and display
- Model selection for cost control

## Dependencies

```
Dependencies:
├── openai (^6.3.0)
│   └── AI model access
├── pdf-parse (^2.3.0)
│   └── PDF text extraction
├── sharp (^0.33.0)
│   └── Image processing (existing)
└── xlsx (^0.18.5)
    └── Excel processing (existing)

DevDependencies:
├── electron (^38.2.2)
│   └── Desktop framework
├── electron-builder (^24.13.3)
│   └── Build tool
└── electron-packager (^17.1.2)
    └── Package tool
```

## Error Flow

```
Error Occurs
    │
    ├─► PDFSearchError
    │   ├─► "Invalid API key"
    │   ├─► "PDF extraction failed"
    │   ├─► "AI search failed"
    │   └─► "Rate limit exceeded"
    │
    ├─► Return { success: false, error: message }
    │
    └─► Display error in UI
        └─► showMessage() dialog
```

## Future Enhancements

Possible improvements:
- [ ] Persistent API key storage (encrypted)
- [ ] Offline caching of answers
- [ ] Multi-language support
- [ ] Export search results
- [ ] Advanced search filters
- [ ] PDF highlighting of relevant sections
- [ ] Batch PDF processing
- [ ] Custom prompt templates
- [ ] Alternative AI providers
- [ ] Voice input for questions

## Testing Strategy

### Manual Testing Checklist
- [ ] API key initialization
- [ ] PDF text extraction
- [ ] AI search functionality
- [ ] Error handling
- [ ] Search history
- [ ] Cache management
- [ ] UI responsiveness
- [ ] Token usage display

### Edge Cases
- [ ] Very large PDFs (>100 pages)
- [ ] Corrupted PDFs
- [ ] Invalid API keys
- [ ] Network failures
- [ ] Rate limiting
- [ ] Empty PDFs
- [ ] Non-text PDFs (scanned)
- [ ] Special characters in questions

---

**Last Updated**: 2025-10-16
**Version**: 1.5.0
