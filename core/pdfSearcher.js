/**
 * PDF AI Search Module
 * Handles PDF text extraction and AI-powered question answering
 */

const fs = require('fs').promises;
const path = require('path');
const pdfParse = require('pdf-parse');
const OpenAI = require('openai');

class PDFSearchError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PDFSearchError';
    }
}

class PDFSearcher {
    static openaiClient = null;
    static pdfCache = new Map(); // Cache for PDF text content

    /**
     * Initialize OpenAI client with API key
     * @param {string} apiKey - OpenAI API key
     */
    static initializeOpenAI(apiKey) {
        if (!apiKey || apiKey.trim() === '') {
            throw new PDFSearchError('OpenAI API key is required');
        }
        
        this.openaiClient = new OpenAI({
            apiKey: apiKey.trim()
        });
    }

    /**
     * Check if OpenAI is initialized
     * @returns {boolean}
     */
    static isOpenAIInitialized() {
        return this.openaiClient !== null;
    }

    /**
     * Extract text from PDF file
     * @param {string} filePath - Path to PDF file
     * @returns {Promise<Object>} Object containing extracted text and metadata
     */
    static async extractTextFromPDF(filePath) {
        try {
            // Verify file exists
            const stats = await fs.stat(filePath);
            
            if (!stats.isFile()) {
                throw new PDFSearchError('Path is not a file');
            }

            // Check cache first
            const cacheKey = `${filePath}-${stats.mtime.getTime()}`;
            if (this.pdfCache.has(cacheKey)) {
                return this.pdfCache.get(cacheKey);
            }

            // Read file
            const dataBuffer = await fs.readFile(filePath);
            
            // Parse PDF
            const data = await pdfParse(dataBuffer);

            const result = {
                success: true,
                text: data.text,
                numPages: data.numpages,
                info: data.info,
                metadata: data.metadata,
                fileName: path.basename(filePath),
                textLength: data.text.length,
                wordCount: data.text.split(/\s+/).filter(word => word.length > 0).length
            };

            // Cache the result
            this.pdfCache.set(cacheKey, result);

            // Limit cache size to prevent memory issues
            if (this.pdfCache.size > 10) {
                const firstKey = this.pdfCache.keys().next().value;
                this.pdfCache.delete(firstKey);
            }

            return result;
        } catch (error) {
            if (error instanceof PDFSearchError) {
                throw error;
            }
            throw new PDFSearchError(`Failed to extract text from PDF: ${error.message}`);
        }
    }

    /**
     * Search PDF content using AI
     * @param {string} pdfText - Extracted PDF text
     * @param {string} question - User's question
     * @param {Object} options - Optional configuration
     * @returns {Promise<Object>} AI response with answer
     */
    static async searchWithAI(pdfText, question, options = {}) {
        try {
            if (!this.isOpenAIInitialized()) {
                throw new PDFSearchError('OpenAI client is not initialized. Please provide an API key.');
            }

            if (!pdfText || pdfText.trim() === '') {
                throw new PDFSearchError('PDF text is empty');
            }

            if (!question || question.trim() === '') {
                throw new PDFSearchError('Question is required');
            }

            const maxTokens = options.maxTokens || 500;
            const temperature = options.temperature || 0.7;
            const model = options.model || 'gpt-3.5-turbo';

            // Truncate PDF text if too long (to fit within token limits)
            const maxPdfLength = 8000; // Approximate characters for context
            const truncatedText = pdfText.length > maxPdfLength 
                ? pdfText.substring(0, maxPdfLength) + '...\n[Text truncated due to length]'
                : pdfText;

            const systemPrompt = `You are a helpful assistant that answers questions based on the provided PDF document content. 
Your answers should be accurate, concise, and based only on the information available in the document. 
If the answer is not found in the document, clearly state that the information is not available in the provided text.`;

            const userPrompt = `Based on the following PDF document content, please answer this question:

PDF Content:
"""
${truncatedText}
"""

Question: ${question}

Please provide a detailed answer based on the document content above.`;

            const completion = await this.openaiClient.chat.completions.create({
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                max_tokens: maxTokens,
                temperature: temperature
            });

            return {
                success: true,
                answer: completion.choices[0].message.content,
                model: model,
                usage: {
                    promptTokens: completion.usage.prompt_tokens,
                    completionTokens: completion.usage.completion_tokens,
                    totalTokens: completion.usage.total_tokens
                },
                textTruncated: pdfText.length > maxPdfLength
            };
        } catch (error) {
            if (error instanceof PDFSearchError) {
                throw error;
            }
            
            // Handle OpenAI specific errors
            if (error.status === 401) {
                throw new PDFSearchError('Invalid OpenAI API key');
            } else if (error.status === 429) {
                throw new PDFSearchError('Rate limit exceeded. Please try again later.');
            } else if (error.status === 500) {
                throw new PDFSearchError('OpenAI service error. Please try again later.');
            }
            
            throw new PDFSearchError(`AI search failed: ${error.message}`);
        }
    }

    /**
     * Combined method: Extract text and search with AI in one call
     * @param {string} filePath - Path to PDF file
     * @param {string} question - User's question
     * @param {Object} options - Optional configuration
     * @returns {Promise<Object>} Complete result with extraction and AI response
     */
    static async extractAndSearch(filePath, question, options = {}) {
        try {
            // Extract text from PDF
            const extractionResult = await this.extractTextFromPDF(filePath);
            
            if (!extractionResult.success) {
                throw new PDFSearchError('Failed to extract text from PDF');
            }

            // Search with AI
            const searchResult = await this.searchWithAI(extractionResult.text, question, options);

            return {
                success: true,
                pdfInfo: {
                    fileName: extractionResult.fileName,
                    numPages: extractionResult.numPages,
                    wordCount: extractionResult.wordCount,
                    textLength: extractionResult.textLength
                },
                question: question,
                answer: searchResult.answer,
                model: searchResult.model,
                usage: searchResult.usage,
                textTruncated: searchResult.textTruncated
            };
        } catch (error) {
            if (error instanceof PDFSearchError) {
                throw error;
            }
            throw new PDFSearchError(`Extract and search failed: ${error.message}`);
        }
    }

    /**
     * Clear the PDF cache
     */
    static clearCache() {
        this.pdfCache.clear();
    }

    /**
     * Get cache statistics
     * @returns {Object} Cache stats
     */
    static getCacheStats() {
        return {
            size: this.pdfCache.size,
            keys: Array.from(this.pdfCache.keys())
        };
    }
}

module.exports = PDFSearcher;
