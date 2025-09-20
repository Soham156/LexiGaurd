const express = require("express");
const router = express.Router();
const GeminiService = require("../services/geminiService");
const {
  analyzeDocumentFromCloudinaryUrl,
  analyzeDocumentFromBuffer,
} = require("../services/documentAnalysisService");
const cloudinary = require("../config/cloudinary");

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
    const { message, documentUrl, fileName, userId } = req.body;

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
          "General"
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

    // Create enhanced prompt with document context
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

Please provide a comprehensive, well-structured response that:
1. Addresses the user's specific question
2. References the document content when relevant
3. Provides practical, actionable advice
4. Uses clear formatting with headings, bullet points, or numbered lists when appropriate
5. Includes relevant legal or business insights based on the document
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
      documentContext: documentAnalysis
        ? {
            fileName,
            documentType: documentAnalysis.documentType,
            riskLevel: documentAnalysis.riskLevel,
            hasDocumentContext: true,
          }
        : { hasDocumentContext: false },
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

module.exports = router;
