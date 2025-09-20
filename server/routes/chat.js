const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Chat endpoint
router.post('/message', async (req, res) => {
  try {
    const { message, context = '', documentContent = '' } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Get the gemini-1.5-flash model (updated model name)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create a comprehensive prompt for legal document analysis
    const prompt = `You are LexiGuard AI Assistant, a specialized legal document analysis expert. You help users with:
- Document analysis and summarization
- Compliance checking and regulatory analysis
- Risk assessment and identification
- Legal insights and recommendations

Context: ${context}
Document Content: ${documentContent ? `\n\nDocument being analyzed:\n${documentContent}` : ''}

User Query: ${message}

Please provide a helpful, accurate, and professional response using the following formatting guidelines:
- Use **bold text** for important terms and headings
- Structure your response with clear sections
- Use numbered lists for step-by-step guidance
- Highlight risks with clear warning language
- Provide actionable insights and recommendations
- Keep your response conversational but informative
- Use bullet points for lists of items
- If analyzing documents, focus on legal compliance, potential risks, and actionable insights

Format your response with proper markdown formatting for better readability.`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      response: text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Gemini AI Error:', error);
    
    // Handle specific API errors
    if (error.message?.includes('API key')) {
      return res.status(401).json({
        success: false,
        error: 'Invalid API key configuration'
      });
    }

    if (error.message?.includes('quota')) {
      return res.status(429).json({
        success: false,
        error: 'API quota exceeded, please try again later'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to generate response',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Chat service is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;