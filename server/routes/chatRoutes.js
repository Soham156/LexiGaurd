const express = require("express");
const router = express.Router();
const GeminiService = require("../services/geminiService");
const WhatIfSimulatorService = require("../services/whatIfSimulatorService");
const {
  analyzeDocumentFromCloudinaryUrl,
  analyzeDocumentFromBuffer,
} = require("../services/documentAnalysisService");
const cloudinary = require("../config/cloudinary");

const geminiService = new GeminiService();
const whatIfSimulator = new WhatIfSimulatorService();

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

// @route   GET /api/chat/documents/:userId
// @desc    Get user's uploaded documents from Cloudinary
// @access  Public
router.get("/documents/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { max_results = 50 } = req.query;

    console.log(`Fetching documents for user: ${userId}`);

    try {
      // Search for documents in Cloudinary by user ID
      // Documents are stored as: lexiguard-documents/{userId}_{timestamp}_{filename}

      let allDocuments = [];

      // Try search API first - use broader search
      try {
        const searchResult = await cloudinary.search
          .expression(`folder:lexiguard-documents`)
          .max_results(parseInt(max_results))
          .execute();

        console.log(
          "Cloudinary search result (all documents):",
          JSON.stringify(searchResult, null, 2)
        );

        // Filter by userId from the results
        const userDocuments = searchResult.resources.filter((resource) => {
          const publicIdParts = resource.public_id.split("/").pop();
          return publicIdParts.startsWith(`${userId}_`);
        });

        console.log(
          `Filtered documents for user ${userId}:`,
          userDocuments.length
        );
        allDocuments = [...allDocuments, ...userDocuments];
      } catch (searchError) {
        console.log(
          "Search API failed, trying resources API...",
          searchError.message
        );
      }

      // Also try resources API with raw type (for PDFs)
      try {
        const rawResources = await cloudinary.api.resources({
          type: "upload",
          prefix: `lexiguard-documents/${userId}_`,
          max_results: parseInt(max_results),
          resource_type: "raw",
        });

        console.log("Raw resources found:", rawResources.resources.length);
        allDocuments = [...allDocuments, ...(rawResources.resources || [])];
      } catch (rawError) {
        console.log("Raw resources API failed:", rawError.message);
      }

      // Try with image resources too
      try {
        const imageResources = await cloudinary.api.resources({
          type: "upload",
          prefix: `lexiguard-documents/${userId}_`,
          max_results: parseInt(max_results),
          resource_type: "image",
        });

        console.log("Image resources found:", imageResources.resources.length);
        allDocuments = [...allDocuments, ...(imageResources.resources || [])];
      } catch (imageError) {
        console.log("Image resources API failed:", imageError.message);
      }

      // Remove duplicates based on public_id
      const uniqueDocuments = allDocuments.filter(
        (doc, index, array) =>
          array.findIndex((d) => d.public_id === doc.public_id) === index
      );

      const documents = uniqueDocuments.map((resource) => {
        // Extract filename from public_id format: userId_timestamp_filename
        const publicIdParts = resource.public_id.split("/").pop(); // Remove folder prefix
        const filenameParts = publicIdParts.split("_");
        const filename = filenameParts.slice(2).join("_"); // Skip userId and timestamp

        return {
          public_id: resource.public_id,
          fileName: filename || resource.display_name || resource.public_id,
          originalName: resource.display_name || filename,
          url: resource.secure_url,
          uploadedAt: resource.created_at,
          fileSize: resource.bytes,
          format: resource.format,
          resourceType: resource.resource_type,
          userId: userId,
        };
      });

      res.json({
        success: true,
        documents,
        total: documents.length,
      });
    } catch (searchError) {
      console.log(
        "Search API failed, trying resources API...",
        searchError.message
      );

      // Fallback to resources API if search fails
      const searchResult = await cloudinary.api.resources({
        type: "upload",
        prefix: `lexiguard-documents/${userId}_`,
        max_results: parseInt(max_results),
        resource_type: "auto",
      });

      console.log(
        "Resources API result:",
        JSON.stringify(searchResult, null, 2)
      );

      const documents = searchResult.resources.map((resource) => {
        // Extract filename from public_id format: lexiguard-documents/userId_timestamp_filename
        const publicIdParts = resource.public_id.split("/").pop(); // Remove folder prefix
        const filenameParts = publicIdParts.split("_");
        const filename = filenameParts.slice(2).join("_"); // Skip userId and timestamp

        return {
          public_id: resource.public_id,
          fileName: filename || resource.display_name || resource.public_id,
          originalName: resource.display_name || filename,
          url: resource.secure_url,
          uploadedAt: resource.created_at,
          fileSize: resource.bytes,
          format: resource.format,
          resourceType: resource.resource_type,
          userId: userId,
        };
      });

      res.json({
        success: true,
        documents,
        total: documents.length,
      });
    }
  } catch (error) {
    console.error("Error fetching user documents:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch documents",
    });
  }
});

// @route   GET /api/chat/debug/all-documents
// @desc    Debug endpoint to see all documents in Cloudinary
// @access  Public
router.get("/debug/all-documents", async (req, res) => {
  try {
    console.log("Fetching all documents from Cloudinary...");
    console.log("Cloudinary config:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? "***configured***" : "missing",
      api_secret: process.env.CLOUDINARY_API_SECRET
        ? "***configured***"
        : "missing",
    });

    // Try to get basic cloud info first
    try {
      const cloudInfo = await cloudinary.api.usage();
      console.log("Cloudinary usage info:", cloudInfo);
    } catch (usageError) {
      console.log("Could not get usage info:", usageError.message);
    }

    // Get all resources without prefix first to see if API works
    try {
      const allResources = await cloudinary.api.resources({
        type: "upload",
        max_results: 10,
        resource_type: "image", // Try with specific resource type first
      });

      console.log(
        "Basic API test - resources count:",
        allResources.resources.length
      );

      // Now try with all resource types
      const allResourcesAuto = await cloudinary.api.resources({
        type: "upload",
        max_results: 10,
        resource_type: "auto",
      });

      console.log(
        "Auto resource type test - resources count:",
        allResourcesAuto.resources.length
      );

      // Now try with prefix
      const filteredResources = await cloudinary.api.resources({
        type: "upload",
        prefix: "lexiguard-documents/",
        max_results: 100,
        resource_type: "image", // Start with image type
      });

      // Also try with raw resource type for documents
      const rawResources = await cloudinary.api.resources({
        type: "upload",
        prefix: "lexiguard-documents/",
        max_results: 100,
        resource_type: "raw",
      });

      console.log(
        "Image resources with prefix:",
        filteredResources.resources.length
      );
      console.log("Raw resources with prefix:", rawResources.resources.length);

      // Combine both resource types
      const allDocuments = [
        ...filteredResources.resources,
        ...rawResources.resources,
      ];

      const formattedResources = allDocuments.map((resource) => {
        // Parse the public_id to extract user info
        const publicIdParts = resource.public_id.split("/").pop(); // Remove folder prefix
        const filenameParts = publicIdParts.split("_");
        const userId = filenameParts[0];
        const timestamp = filenameParts[1];
        const filename = filenameParts.slice(2).join("_");

        return {
          public_id: resource.public_id,
          secure_url: resource.secure_url,
          format: resource.format,
          resource_type: resource.resource_type,
          created_at: resource.created_at,
          bytes: resource.bytes,
          parsed: {
            userId: userId,
            timestamp: timestamp,
            filename: filename,
          },
        };
      });

      res.json({
        success: true,
        total: allDocuments.length,
        totalAllResources: allResources.resources.length,
        totalAutoResources: allResourcesAuto.resources.length,
        resources: formattedResources,
        debug: {
          cloudName: process.env.CLOUDINARY_CLOUD_NAME,
          apiWorking: true,
          imageResources: filteredResources.resources.length,
          rawResources: rawResources.resources.length,
        },
      });
    } catch (apiError) {
      console.error("API Resources error:", apiError);
      res.status(500).json({
        success: false,
        error: apiError.message,
        details: apiError.toString(),
        debug: {
          cloudName: process.env.CLOUDINARY_CLOUD_NAME,
          errorType: "API_RESOURCES_ERROR",
        },
      });
    }
  } catch (error) {
    console.error("Debug endpoint error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.toString(),
      debug: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        errorType: "GENERAL_ERROR",
      },
    });
  }
});

// @route   GET /api/chat/test/all-docs
// @desc    Simple test to see all documents (for debugging)
// @access  Public
router.get("/test/all-docs", async (req, res) => {
  try {
    console.log(
      "Testing: Fetching all documents from lexiguard-documents folder..."
    );

    const searchResult = await cloudinary.search
      .expression("folder:lexiguard-documents")
      .max_results(20)
      .execute();

    console.log(`Found ${searchResult.total_count} documents total`);

    const documents = searchResult.resources.map((resource) => ({
      public_id: resource.public_id,
      url: resource.secure_url,
      format: resource.format,
      created_at: resource.created_at,
      resource_type: resource.resource_type,
      // Parse user ID from public_id
      parsedUserId: resource.public_id.split("/").pop().split("_")[0],
    }));

    res.json({
      success: true,
      total: searchResult.total_count,
      documents: documents,
    });
  } catch (error) {
    console.error("Test endpoint error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/chat/test-cloudinary
// @desc    Simple test to verify Cloudinary connection
// @access  Public
router.get("/test-cloudinary", async (req, res) => {
  try {
    console.log("Testing Cloudinary connection...");

    // Simple ping test
    const result = await cloudinary.api.ping();

    res.json({
      success: true,
      message: "Cloudinary connection successful",
      result: result,
    });
  } catch (error) {
    console.error("Cloudinary test error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: {
        name: error.name,
        message: error.message,
        http_code: error.http_code,
      },
    });
  }
});

// @route   POST /api/chat/analyze-cloudinary-document
// @desc    Analyze specific document from Cloudinary in chat
// @access  Public
router.post("/analyze-cloudinary-document", async (req, res) => {
  try {
    const { documentUrl, fileName, userId, userMessage } = req.body;

    if (!documentUrl || !fileName) {
      return res.status(400).json({
        success: false,
        error: "Document URL and file name are required",
      });
    }

    console.log(
      `Analyzing Cloudinary document: ${fileName} for user ${userId}`
    );

    // Use the existing service to analyze document from Cloudinary URL
    const analysisResult = await analyzeDocumentFromCloudinaryUrl(
      documentUrl,
      fileName,
      "General" // Default role
    );

    if (!analysisResult.success) {
      throw new Error(analysisResult.error);
    }

    const analysis = analysisResult.analysis;

    // Format the analysis for chat display
    let chatResponse = `## 📄 Analysis Complete: ${fileName}\n\n`;

    if (analysis.summary) {
      chatResponse += `### 📋 Summary\n${analysis.summary}\n\n`;
    }

    if (analysis.documentType) {
      chatResponse += `**📑 Document Type**: ${analysis.documentType}\n\n`;
    }

    if (analysis.riskLevel) {
      const riskEmoji =
        analysis.riskLevel.toLowerCase() === "high"
          ? "🔴"
          : analysis.riskLevel.toLowerCase() === "medium"
          ? "🟡"
          : "🟢";
      chatResponse += `### ⚠️ Risk Assessment: ${riskEmoji} ${analysis.riskLevel.toUpperCase()}\n\n`;
    }

    if (analysis.keyPoints && analysis.keyPoints.length > 0) {
      chatResponse += `### 🔍 Key Points\n`;
      analysis.keyPoints.forEach((point, index) => {
        chatResponse += `${index + 1}. ${point}\n`;
      });
      chatResponse += `\n`;
    }

    if (analysis.clauses && analysis.clauses.length > 0) {
      chatResponse += `### 📜 Key Clauses Analysis (${analysis.clauses.length} total)\n`;
      analysis.clauses.slice(0, 5).forEach((clause, index) => {
        const riskColor =
          clause.riskLevel?.toLowerCase() === "high"
            ? "🔴"
            : clause.riskLevel?.toLowerCase() === "medium"
            ? "🟡"
            : "🟢";
        chatResponse += `**${index + 1}. ${
          clause.type?.replace("_", " ").toUpperCase() || "GENERAL"
        } CLAUSE** ${riskColor}\n`;
        chatResponse += `"${
          clause.text.length > 120
            ? clause.text.substring(0, 120) + "..."
            : clause.text
        }"\n`;
        if (clause.explanation) {
          chatResponse += `💡 *${clause.explanation}*\n`;
        }
        chatResponse += `\n`;
      });

      if (analysis.clauses.length > 5) {
        chatResponse += `*...and ${
          analysis.clauses.length - 5
        } more clauses analyzed*\n\n`;
      }
    }

    if (analysis.recommendations && analysis.recommendations.length > 0) {
      chatResponse += `### 💡 Recommendations\n`;
      analysis.recommendations.forEach((rec, index) => {
        chatResponse += `${index + 1}. ${rec}\n`;
      });
      chatResponse += `\n`;
    }

    if (analysis.riskFactors && analysis.riskFactors.length > 0) {
      chatResponse += `### ⚠️ Risk Factors\n`;
      analysis.riskFactors.forEach((risk, index) => {
        chatResponse += `• ${risk}\n`;
      });
      chatResponse += `\n`;
    }

    if (analysis.overallScore) {
      const scoreEmoji =
        analysis.overallScore >= 80
          ? "🟢"
          : analysis.overallScore >= 60
          ? "🟡"
          : "🔴";
      chatResponse += `### 📊 Overall Score: ${scoreEmoji} ${analysis.overallScore}/100\n\n`;
    }

    // Add contextual response based on user message
    if (userMessage) {
      chatResponse += `---\n\n**Regarding your question**: "${userMessage}"\n\n`;

      // Use Gemini to provide contextual response
      const contextualPrompt = `
Based on this document analysis, please answer the user's specific question: "${userMessage}"

Document: ${fileName}
Summary: ${analysis.summary || "Not available"}
Risk Level: ${analysis.riskLevel || "Not available"}
Key Points: ${analysis.keyPoints?.join(", ") || "Not available"}

Provide a specific, actionable response to their question based on this document's content.
`;

      try {
        const result = await geminiService.model.generateContent(
          contextualPrompt
        );
        const response = await result.response;
        const contextualResponse = response.text();
        chatResponse += contextualResponse + "\n\n";
      } catch (error) {
        console.error("Error generating contextual response:", error);
      }
    }

    chatResponse += `\n**💬 Feel free to ask me specific questions about any aspect of this document!**`;

    res.json({
      success: true,
      response: chatResponse,
      analysis: analysis,
      document: {
        fileName,
        url: documentUrl,
        analyzedAt: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error analyzing Cloudinary document:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to analyze document",
    });
  }
});

// @route   POST /api/chat/message-with-document
// @desc    Send message with specific document context
// @access  Public
router.post("/message-with-document", async (req, res) => {
  try {
    const {
      message,
      documentUrl,
      fileName,
      userId,
      jurisdiction = "India",
      userRole = "Consumer",
    } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    console.log(`Processing chat message with document context: ${fileName}`);
    console.log(`Document URL: ${documentUrl}`);
    console.log(`User ID: ${userId}`);

    let documentContent = "";
    let documentAnalysis = null;

    // If document URL is provided, fetch and analyze it
    if (documentUrl && fileName) {
      try {
        console.log(`Fetching document from: ${documentUrl}`);

        const analysisResult = await analyzeDocumentFromCloudinaryUrl(
          documentUrl,
          fileName,
          userRole || "General"
        );

        if (analysisResult.success) {
          documentAnalysis = analysisResult.analysis;
          documentContent = analysisResult.extractedText || "";

          console.log(
            `Document text extracted: ${documentContent.length} characters`
          );
          console.log(
            `Document analysis summary: ${
              documentAnalysis?.summary || "No summary"
            }`
          );
        } else {
          console.error("Failed to analyze document:", analysisResult.error);
          documentContent = `[Error extracting document content: ${analysisResult.error}]`;
        }
      } catch (error) {
        console.error("Error fetching document for context:", error);
        documentContent = `[Error accessing document: ${error.message}]`;
      }
    } else {
      console.log("No document URL provided - using regular chat mode");
    }

    // Check if this is a "What If" scenario question
    const isScenarioQuestion = whatIfSimulator.isScenarioQuestion(message);

    if (isScenarioQuestion && documentContent && documentAnalysis) {
      console.log(
        "Detected What-If scenario question - using scenario simulator"
      );

      try {
        // Use the What-If Scenario Simulator
        const scenarioAnalysis = await whatIfSimulator.analyzeScenario(
          message,
          documentContent,
          documentAnalysis,
          jurisdiction,
          userRole
        );

        // Format the response for chat
        const formattedResponse =
          whatIfSimulator.formatScenarioForChat(scenarioAnalysis);

        res.json({
          success: true,
          response: formattedResponse,
          responseType: "scenario_analysis",
          scenarioAnalysis: scenarioAnalysis,
          documentContext: {
            fileName,
            documentType: documentAnalysis.documentType,
            riskLevel: documentAnalysis.riskLevel,
            hasDocumentContext: true,
            isScenarioQuestion: true,
          },
          timestamp: new Date().toISOString(),
        });

        return; // Exit early since we handled the scenario
      } catch (scenarioError) {
        console.error(
          "Scenario analysis failed, falling back to regular chat:",
          scenarioError
        );
        // Fall through to regular chat handling
      }
    }

    // Regular chat handling (non-scenario or fallback)
    const chatPrompt = `
You are an expert AI assistant specializing in legal document analysis, compliance, and business guidance.
You are helpful, professional, and provide detailed, actionable advice.

${
  documentAnalysis
    ? `
DOCUMENT CONTEXT:
- Document: ${fileName}
- Type: ${documentAnalysis.documentType || "Unknown"}
- Risk Level: ${documentAnalysis.riskLevel || "Unknown"}
- Summary: ${documentAnalysis.summary || "Not available"}
- Key Points: ${documentAnalysis.keyPoints?.join("; ") || "Not available"}

EXTRACTED DOCUMENT TEXT:
${documentContent.substring(0, 4000)}${
        documentContent.length > 4000
          ? "\n\n[Document continues beyond this excerpt...]"
          : ""
      }

TOTAL DOCUMENT LENGTH: ${documentContent.length} characters
`
    : "Context: General legal and business assistance"
}

User Question: ${message}

${
  isScenarioQuestion
    ? `
IMPORTANT: The user is asking a "What If" scenario question. Please provide a CONCISE response (max 300 words):
1. Direct answer to their scenario (1-2 sentences)
2. Key clauses that apply (if document available)
3. 2-3 main consequences or steps
4. 2-3 practical actions they should take
5. Overall risk level (low/medium/high)

Keep it short and focused - no lengthy explanations.
`
    : ""
}

Please provide a ${
      isScenarioQuestion ? "concise, focused" : "comprehensive, well-structured"
    } response that:
1. Addresses the user's specific question
2. ${
      isScenarioQuestion
        ? "Stays under 300 words"
        : "References the document content when relevant"
    }
3. Provides practical, actionable advice
4. ${
      isScenarioQuestion
        ? "Uses brief bullet points"
        : "Uses clear formatting with headings, bullet points, or numbered lists when appropriate"
    }
5. ${
      isScenarioQuestion
        ? "Focuses on key risks and actions"
        : "Includes relevant legal or business insights based on the document"
    }
6. Is professional but conversational

Response:`;

    // Use the Gemini model for enhanced response
    if (!geminiService.model) {
      throw new Error("Gemini AI not properly initialized");
    }

    const result = await geminiService.model.generateContent(chatPrompt);
    const response = await result.response;
    const aiResponse = response.text();

    res.json({
      success: true,
      response: aiResponse,
      responseType: isScenarioQuestion ? "scenario_fallback" : "regular_chat",
      documentContext: documentAnalysis
        ? {
            fileName,
            documentType: documentAnalysis.documentType,
            riskLevel: documentAnalysis.riskLevel,
            hasDocumentContext: true,
            isScenarioQuestion: isScenarioQuestion,
          }
        : { hasDocumentContext: false, isScenarioQuestion: isScenarioQuestion },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in chat message with document:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to process chat message",
    });
  }
});

// @route   POST /api/chat/extract-text
// @desc    Extract text from a document for testing
// @access  Public
router.post("/extract-text", async (req, res) => {
  try {
    const { documentUrl, fileName } = req.body;

    if (!documentUrl || !fileName) {
      return res.status(400).json({
        success: false,
        error: "Document URL and file name are required",
      });
    }

    console.log(`Extracting text from: ${fileName}`);

    const analysisResult = await analyzeDocumentFromCloudinaryUrl(
      documentUrl,
      fileName,
      "General"
    );

    if (analysisResult.success) {
      res.json({
        success: true,
        fileName: fileName,
        textLength: analysisResult.extractedText.length,
        extractedText: analysisResult.extractedText,
        preview: analysisResult.extractedText.substring(0, 500),
        analysis: analysisResult.analysis,
      });
    } else {
      res.status(500).json({
        success: false,
        error: analysisResult.error,
        fileName: fileName,
      });
    }
  } catch (error) {
    console.error("Error extracting text:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   POST /api/chat/what-if-scenario
// @desc    Analyze a specific What-If scenario against a document
// @access  Public
router.post("/what-if-scenario", async (req, res) => {
  try {
    const {
      scenarioQuestion,
      documentUrl,
      fileName,
      userId,
      jurisdiction = "India",
      userRole = "Consumer",
    } = req.body;

    if (!scenarioQuestion) {
      return res.status(400).json({
        success: false,
        error: "Scenario question is required",
      });
    }

    if (!documentUrl || !fileName) {
      return res.status(400).json({
        success: false,
        error: "Document URL and file name are required for scenario analysis",
      });
    }

    console.log(`Analyzing What-If scenario for document: ${fileName}`);
    console.log(`Scenario: ${scenarioQuestion}`);

    // First, extract document content and get analysis
    const analysisResult = await analyzeDocumentFromCloudinaryUrl(
      documentUrl,
      fileName,
      userRole
    );

    if (!analysisResult.success) {
      return res.status(400).json({
        success: false,
        error: `Failed to analyze document: ${analysisResult.error}`,
      });
    }

    const documentContent = analysisResult.extractedText;
    const documentAnalysis = analysisResult.analysis;

    // Perform scenario analysis
    const scenarioAnalysis = await whatIfSimulator.analyzeScenario(
      scenarioQuestion,
      documentContent,
      documentAnalysis,
      jurisdiction,
      userRole
    );

    // Format response for chat
    const formattedResponse =
      whatIfSimulator.formatScenarioForChat(scenarioAnalysis);

    res.json({
      success: true,
      response: formattedResponse,
      scenarioAnalysis: scenarioAnalysis,
      documentContext: {
        fileName,
        documentType: documentAnalysis.documentType,
        riskLevel: documentAnalysis.riskLevel,
        jurisdiction,
        userRole,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in What-If scenario analysis:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to analyze What-If scenario",
    });
  }
});

// @route   GET /api/chat/what-if-examples
// @desc    Get example What-If scenario questions based on document type
// @access  Public
router.get("/what-if-examples", async (req, res) => {
  try {
    const { documentType = "contract", jurisdiction = "India" } = req.query;

    console.log(
      `Getting What-If examples for ${documentType} in ${jurisdiction}`
    );

    const examples = whatIfSimulator.generateExampleScenarios(
      documentType,
      jurisdiction
    );

    res.json({
      success: true,
      documentType,
      jurisdiction,
      examples,
      helpText: {
        title: "What-If Scenario Simulator",
        description:
          "Ask hypothetical questions to understand the real-world consequences of your contract",
        instructions: [
          "Start your question with 'What if...' or 'What happens if...'",
          "Be specific about the situation you're concerned about",
          "Include relevant details like timeframes or amounts",
          "Ask about both best-case and worst-case scenarios",
        ],
        benefits: [
          "Predict consequences before they happen",
          "Identify hidden risks in your contract",
          "Understand your rights and obligations",
          "Get strategic advice for negotiation",
          "Find ambiguous language that needs clarification",
        ],
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error getting What-If examples:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to get What-If examples",
    });
  }
});

// @route   POST /api/chat/multilingual-summary
// @desc    Generate multilingual document summary
// @access  Public
router.post("/multilingual-summary", async (req, res) => {
  try {
    const { documentContent, fileName, language, summaryType } = req.body;

    if (!documentContent) {
      return res.status(400).json({
        success: false,
        error: "Document content is required",
      });
    }

    if (!language) {
      return res.status(400).json({
        success: false,
        error: "Language selection is required",
      });
    }

    console.log(`Generating ${language} summary for: ${fileName || 'document'}`);

    // Language-specific instructions
    const languageInstructions = {
      english: "Provide the summary in clear, professional English",
      spanish: "Proporciona el resumen en español claro y profesional",
      french: "Fournissez le résumé en français clair et professionnel", 
      german: "Erstellen Sie die Zusammenfassung auf klarem, professionellem Deutsch",
      hindi: "स्पष्ट और व्यावसायिक हिंदी में सारांश प्रदान करें",
      marathi: "स्पष्ट आणि व्यावसायिक मराठीत सारांश द्या",
      gujarati: "સ્પષ્ટ અને વ્યાવસાયિક ગુજરાતીમાં સારાંશ આપો",
      tamil: "தெளிவான மற்றும் தொழில்முறை தமிழில் சுருக்கம் வழங்கவும்",
      telugu: "స్పష్టమైన మరియు వృత్తిపరమైన తెలుగులో సారాంశం అందించండి",
      kannada: "ಸ್ಪಷ್ಟ ಮತ್ತು ವೃತ್ತಿಪರ ಕನ್ನಡದಲ್ಲಿ ಸಾರಾಂಶವನ್ನು ಒದಗಿಸಿ",
      bengali: "স্পষ্ট এবং পেশাদার বাংলায় সারসংক্ষেপ প্রদান করুন",
      punjabi: "ਸਪਸ਼ਟ ਅਤੇ ਪੇਸ਼ੇਵਰ ਪੰਜਾਬੀ ਵਿੱਚ ਸਾਰ ਪ੍ਰਦਾਨ ਕਰੋ",
      urdu: "واضح اور پیشہ ورانہ اردو میں خلاصہ فراہم کریں",
      chinese: "请用清晰专业的中文提供摘要",
      japanese: "明確で専門的な日本語で要約を提供してください",
      korean: "명확하고 전문적인 한국어로 요약을 제공해주세요",
      arabic: "قدم الملخص باللغة العربية الواضحة والمهنية",
      portuguese: "Forneça o resumo em português claro e profissional",
      italian: "Fornisci il riassunto in italiano chiaro e professionale",
      dutch: "Geef de samenvatting in duidelijk, professioneel Nederlands",
      russian: "Предоставьте краткое изложение на ясном профессиональном русском языке"
    };

    // Summary type templates
    const summaryTemplates = {
      comprehensive: "Provide a comprehensive analysis covering all key aspects",
      executive: "Create an executive summary focusing on high-level insights and strategic implications",
      legal: "Focus on legal implications, risks, and compliance requirements",
      financial: "Emphasize financial aspects, costs, and monetary implications",
      risks: "Concentrate on identifying and analyzing potential risks and mitigation strategies"
    };

    const selectedLanguageInstruction = languageInstructions[language] || languageInstructions.english;
    const selectedTemplate = summaryTemplates[summaryType] || summaryTemplates.comprehensive;

    const multilingualPrompt = `
You are an expert document analyst specializing in multilingual summaries. ${selectedTemplate}.

Document Content:
${documentContent}

Instructions:
1. ${selectedLanguageInstruction}
2. Structure your response with clear headings and subheadings
3. Use bullet points and numbered lists for clarity
4. Include actionable insights and recommendations
5. Highlight key risks, opportunities, and important clauses
6. Maintain professional tone throughout
7. Provide cultural context if relevant for the selected language

Please provide a detailed ${summaryType} summary in ${language}. Use markdown formatting for better readability.

Required Structure:
# Document Summary - ${fileName || 'Document'}

## Overview
[Brief overview in selected language]

## Key Points
[Main findings and insights]

## Important Details
[Detailed analysis]

## Recommendations
[Actionable recommendations]

## Risk Assessment
[Potential risks and concerns]

Summary:`;

    if (!geminiService.model) {
      await geminiService.initializeModel();
    }

    const result = await geminiService.model.generateContent(multilingualPrompt);
    const summary = result.response.text();

    res.json({
      success: true,
      summary: summary,
      language: language,
      summaryType: summaryType,
      fileName: fileName,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Error generating multilingual summary:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate multilingual summary",
    });
  }
});

module.exports = router;
