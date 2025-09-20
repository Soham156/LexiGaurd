const express = require("express");
const router = express.Router();
const GeminiService = require("../services/geminiService");

const geminiService = new GeminiService();

// @route   POST /api/chat/message
// @desc    Send message to AI chat
// @access  Public
router.post("/message", async (req, res) => {
  try {
    const { message, context, documentContent } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    console.log(`Processing chat message: ${message.substring(0, 50)}...`);

    // Create a chat-optimized prompt
    const chatPrompt = `
You are an expert AI assistant specializing in legal document analysis, compliance, and business guidance. 
You are helpful, professional, and provide detailed, actionable advice.

Context: ${context || "General legal and business assistance"}
${documentContent ? `Document Content: ${documentContent}` : ""}

User Question: ${message}

Please provide a comprehensive, well-structured response that:
1. Addresses the user's specific question
2. Provides practical, actionable advice
3. Uses clear formatting with headings, bullet points, or numbered lists when appropriate
4. Includes relevant legal or business insights
5. Is professional but conversational

Response:`;

    // Use the Gemini model directly for chat
    if (!geminiService.model) {
      throw new Error("Gemini AI not properly initialized");
    }

    const result = await geminiService.model.generateContent(chatPrompt);
    const response = await result.response;
    const aiResponse = response.text();

    res.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in chat message:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to process chat message",
    });
  }
});

// @route   POST /api/chat/analyze-document
// @desc    Analyze uploaded document in chat context
// @access  Public
router.post("/analyze-document", async (req, res) => {
  try {
    const { documentText, fileName, userPrompt } = req.body;

    if (!documentText) {
      return res.status(400).json({
        success: false,
        error: "Document text is required",
      });
    }

    console.log(`Analyzing document in chat: ${fileName || "Unknown"}`);

    // Use the existing analyzeDocument method but format for chat
    const analysis = await geminiService.analyzeDocument(
      documentText,
      userPrompt || "legal document"
    );

    // Format the analysis for chat display
    let chatResponse = `## Document Analysis: ${
      fileName || "Your Document"
    }\n\n`;

    chatResponse += `**Document Type**: ${
      analysis.documentType || "Unknown"
    }\n\n`;

    if (analysis.summary) {
      chatResponse += `### Summary\n${analysis.summary}\n\n`;
    }

    if (analysis.riskLevel) {
      const riskEmoji =
        analysis.riskLevel.toLowerCase() === "high"
          ? "🔴"
          : analysis.riskLevel.toLowerCase() === "medium"
          ? "🟡"
          : "🟢";
      chatResponse += `### Risk Level: ${riskEmoji} ${analysis.riskLevel.toUpperCase()}\n\n`;
    }

    if (analysis.keyPoints && analysis.keyPoints.length > 0) {
      chatResponse += `### Key Points\n`;
      analysis.keyPoints.forEach((point, index) => {
        chatResponse += `${index + 1}. ${point}\n`;
      });
      chatResponse += `\n`;
    }

    if (analysis.clauses && analysis.clauses.length > 0) {
      chatResponse += `### Key Clauses Analysis\n`;
      analysis.clauses.slice(0, 3).forEach((clause, index) => {
        chatResponse += `**Clause ${index + 1}**: ${clause.text.substring(
          0,
          100
        )}...\n`;
        chatResponse += `- **Risk**: ${clause.riskLevel || "Medium"}\n`;
        chatResponse += `- **Type**: ${clause.type || "General"}\n\n`;
      });
    }

    if (analysis.recommendations && analysis.recommendations.length > 0) {
      chatResponse += `### Recommendations\n`;
      analysis.recommendations.forEach((rec, index) => {
        chatResponse += `${index + 1}. ${rec}\n`;
      });
      chatResponse += `\n`;
    }

    chatResponse += `\n**Would you like me to dive deeper into any specific aspect of this analysis?**`;

    res.json({
      success: true,
      response: chatResponse,
      analysis: analysis,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error analyzing document in chat:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to analyze document",
    });
  }
});

module.exports = router;
