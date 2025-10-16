# AI PDF Search - Quick Start Guide

## Overview

The AI PDF Search feature allows you to ask questions about PDF documents and receive intelligent answers based on the document's content. It uses OpenAI's GPT models to understand and answer your questions.

## Getting Started

### Step 1: Get an OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (it starts with `sk-`)

### Step 2: Configure the Application

1. Open the Base64 Converter application
2. Click on the "🤖 AI PDF Search" tab
3. In the "OpenAI Configuration" section:
   - Paste your API key in the text field
   - Click the "🔑 Initialize" button
   - Wait for the "✓ Connected" status

### Step 3: Upload a PDF

1. Click "📂 Select PDF File"
2. Choose a PDF from your computer
3. The application will automatically:
   - Extract text from the PDF
   - Display document information (pages, words, characters)

### Step 4: Ask Questions

1. Type your question in the "Your Question" text area
2. Examples of good questions:
   - "What is the main topic of this document?"
   - "Summarize the key findings"
   - "Who are the authors mentioned?"
   - "What are the conclusions?"
   - "List the main recommendations"

### Step 5: Configure Options (Optional)

- **Model**: Choose between:
  - **GPT-3.5 Turbo**: Fast and cost-effective
  - **GPT-4**: Better quality and understanding
  - **GPT-4 Turbo**: Latest model with improved capabilities

- **Max Response Length**: Choose how detailed you want the answer:
  - Short (300 tokens): Quick answers
  - Medium (500 tokens): Balanced
  - Long (1000 tokens): Detailed responses
  - Very Long (2000 tokens): Comprehensive answers

### Step 6: Search

1. Click "🔍 Search with AI"
2. Wait while the AI processes your question
3. View the answer in the result box
4. Use "📋 Copy" to copy the answer

### Step 7: Review History

All your searches are saved in the "Search History" section below. You can:
- Review previous questions and answers
- See which PDF was used
- Check token usage for each search
- Clear history when needed

## Tips for Best Results

### Writing Good Questions

✅ **Do:**
- Be specific about what you want to know
- Ask one question at a time
- Use clear, simple language
- Ask about facts present in the document

❌ **Don't:**
- Ask multiple unrelated questions at once
- Request information not in the document
- Use overly complex or ambiguous phrasing

### Example Questions by Document Type

**Research Papers:**
- "What methodology was used in this study?"
- "What are the main findings?"
- "What are the limitations mentioned?"

**Reports:**
- "What are the key recommendations?"
- "Summarize the executive summary"
- "What trends are identified?"

**Manuals:**
- "How do I configure [feature]?"
- "What are the system requirements?"
- "What troubleshooting steps are provided?"

**Contracts/Legal:**
- "What are the payment terms?"
- "What are the termination conditions?"
- "What obligations does each party have?"

## Understanding Token Usage

- Tokens are units of text that the AI processes
- Both your question and the AI's answer use tokens
- Approximate conversion: 1 token ≈ 4 characters
- Token usage affects API costs
- The application shows you how many tokens each search uses

### Typical Token Usage:

- Short question + short answer: ~200-400 tokens
- Medium question + medium answer: ~500-800 tokens
- Complex question + long answer: ~1000-2000 tokens

## Cost Management

- Start with GPT-3.5 Turbo (most cost-effective)
- Use GPT-4 only when you need better quality
- Choose shorter response lengths when possible
- Review search history to avoid duplicate questions

## Limitations

### Document Length
- Very long PDFs may be truncated to fit context limits
- The app will warn you if text was truncated
- GPT-3.5: ~8,000 character limit
- GPT-4: ~16,000 character limit

### PDF Types
- Works best with text-based PDFs
- Scanned PDFs (images) may not work well
- Handwritten notes cannot be read
- Tables and complex formatting may be simplified

### AI Capabilities
- AI answers based only on document content
- Cannot answer questions about external information
- May occasionally misinterpret complex content
- Responses are generated, not extracted verbatim

## Privacy & Security

- Your API key is stored only in memory during the session
- API keys are never saved to disk
- You need to re-enter the key each time you start the app
- PDF content is sent to OpenAI for processing
- Search history is stored locally only

## Troubleshooting

### "API Key Required" Error
- Ensure you've entered a valid OpenAI API key
- Check that the key starts with `sk-`
- Re-initialize if you see connection issues

### "Failed to extract text from PDF"
- Verify the file is a valid PDF
- Try opening the PDF in a PDF reader to confirm it's not corrupted
- Some password-protected PDFs may not work

### "Rate limit exceeded"
- You've made too many requests too quickly
- Wait a few minutes before trying again
- Consider upgrading your OpenAI plan for higher limits

### "Invalid OpenAI API key"
- Double-check your API key is correct
- Ensure there are no extra spaces
- Verify your API key is active on the OpenAI platform

### Poor Quality Answers
- Try using GPT-4 instead of GPT-3.5
- Increase the response length
- Rephrase your question to be more specific
- Ensure your question is about content in the PDF

## Example Workflow

1. **Start the App**: Open Base64 Converter
2. **Go to AI Tab**: Click "🤖 AI PDF Search"
3. **Enter API Key**: Paste your OpenAI key and initialize
4. **Upload PDF**: Select "research_paper.pdf"
5. **See Info**: Document has 15 pages, 8,500 words
6. **Ask Question**: "What are the main findings of this research?"
7. **Configure**: Select GPT-4, Medium length (500 tokens)
8. **Search**: Click "🔍 Search with AI"
9. **Read Answer**: Review the AI's response
10. **Follow Up**: Ask more specific questions if needed
11. **Save Results**: Copy answers you want to keep
12. **Review History**: Check all questions asked about this PDF

## Support

For issues or questions:
- Check this guide first
- Review the main README.md
- Check OpenAI documentation for API-related issues
- Open an issue on GitHub

## Advanced Usage

### Chaining Questions

Ask follow-up questions to dive deeper:
1. "What is this document about?" (overview)
2. "What methodology was used?" (specific detail)
3. "What were the results?" (specific section)
4. "What are the limitations?" (critical analysis)

### Comparing Answers

Ask the same question with different models:
- GPT-3.5: Fast, general answer
- GPT-4: More nuanced, detailed answer
- Compare to see which works better for your use case

### Summarization Strategy

For long documents:
1. Ask for a general summary first
2. Then ask about specific sections
3. Request key points or bullet lists
4. Verify important details with targeted questions

## Best Practices

1. **Clear Cache Regularly**: If working with many PDFs
2. **Monitor Token Usage**: Keep track of API costs
3. **Save Important Answers**: Copy responses you need
4. **Start Broad, Then Specific**: General questions first
5. **Verify Critical Info**: Cross-check important facts
6. **Use Appropriate Model**: Balance cost vs. quality
7. **Keep Questions Focused**: One topic at a time
8. **Review History**: Learn from previous searches

---

**Happy Searching! 🔍🤖**
