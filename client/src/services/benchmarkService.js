// Fairness benchmark service for analyzing document fairness
import { auth } from "../firebase/firebase.js";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!auth.currentUser;
};

// Analyze fairness of an existing document
export const analyzeFairnessById = async (
  documentId,
  jurisdiction = "India"
) => {
  if (!auth.currentUser) {
    throw new Error("Authentication required");
  }

  try {
    console.log(`🔍 Starting fairness analysis for document ${documentId}`);
    console.log(
      `🌐 API URL: ${API_BASE_URL}/benchmark/analyze-document/${documentId}`
    );

    // First, get the document details from Firebase
    const documentService = await import("./documentService.js");
    const docResult = await documentService.default.getById(documentId);

    if (!docResult.success) {
      throw new Error("Document not found or access denied");
    }

    const document = docResult.document;
    console.log(`📄 Document details:`, {
      fileName: document.fileName,
      hasCloudinaryUrl: !!document.cloudinaryUrl,
      selectedRole: document.selectedRole,
    });

    // Check if document has a Cloudinary URL for text extraction
    if (!document.cloudinaryUrl) {
      throw new Error("Document file not found for analysis");
    }

    const url = `${API_BASE_URL}/benchmark/analyze-document/${documentId}`;

    const requestBody = {
      userId: auth.currentUser.uid,
      jurisdiction,
      userRole: document.selectedRole || "Consumer",
      documentDetails: {
        fileName: document.fileName,
        cloudinaryUrl: document.cloudinaryUrl,
        fileSize: document.fileSize,
        mimeType: document.fileType,
        extractedText: document.extractedText, // CRITICAL: Include extracted text for fallback
      },
    };

    console.log(`📤 Sending request to:`, url);
    console.log(`📋 Request body:`, {
      userId: requestBody.userId,
      jurisdiction: requestBody.jurisdiction,
      userRole: requestBody.userRole,
      hasDocumentDetails: !!requestBody.documentDetails,
      hasExtractedText: !!requestBody.documentDetails?.extractedText,
      extractedTextLength:
        requestBody.documentDetails?.extractedText?.length || 0,
    });

    console.log(`⏰ Starting fetch request at ${new Date().toISOString()}`);
    const fetchStart = Date.now();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const fetchTime = Date.now() - fetchStart;
    console.log(
      `✅ Fetch completed in ${fetchTime}ms with status: ${response.status}`
    );

    if (!response.ok) {
      // For 400 errors, try to parse JSON response first to get detailed error info
      if (response.status === 400) {
        try {
          const errorResult = await response.json();
          console.error(`❌ Server returned 400 with details:`, errorResult);

          if (errorResult.needsReupload) {
            console.log(`📋 Document needs re-upload:`, errorResult.error);
            return {
              success: false,
              error: errorResult.error,
              needsReupload: true,
              documentId: errorResult.documentId,
              hasFairnessAnalysis: false,
              suggestion: errorResult.suggestion,
              cloudinaryError: errorResult.cloudinaryError,
            };
          }

          throw new Error(errorResult.error || "Analysis failed");
        } catch (jsonParseError) {
          // If JSON parsing fails, fall back to text response
          console.error(
            `❌ Failed to parse JSON error response:`,
            jsonParseError.message
          );
          const errorText = await response.text();
          console.error(`❌ Server error response:`, errorText);
          throw new Error(`Analysis failed: ${response.status} - ${errorText}`);
        }
      } else {
        const errorText = await response.text();
        console.error(`❌ Server error response:`, errorText);
        throw new Error(`Analysis failed: ${response.status} - ${errorText}`);
      }
    }

    console.log(`⏰ Parsing response...`);
    const result = await response.json();
    console.log(`📊 Response received:`, {
      success: result.success,
      hasFairnessAnalysis: !!result.fairnessAnalysis,
      documentId: result.documentId,
      fullResult: result,
    });
    console.log(`📋 Full response data:`, result);

    if (result.success) {
      const returnData = {
        success: true,
        fairnessAnalysis: result.fairnessAnalysis,
        analyzedAt: result.analyzedAt,
        documentId: result.documentId,
        contractType: result.contractType,
        analysisSource: result.analysisSource,
        hasFairnessAnalysis: !!result.fairnessAnalysis,
        analysisType: result.fairnessAnalysis?.analysisType,
      };

      console.log(`✅ Returning analysis data:`, {
        success: returnData.success,
        hasFairnessAnalysis: returnData.hasFairnessAnalysis,
        documentId: returnData.documentId,
        analysisType: returnData.analysisType,
      });

      return returnData;
    } else {
      // Handle server-side errors (like missing extracted text)
      console.error(`❌ Server returned error:`, result);

      if (result.needsReupload) {
        console.log(`📋 Document needs re-upload:`, result.error);
        return {
          success: false,
          error: result.error,
          needsReupload: true,
          documentId: result.documentId,
          hasFairnessAnalysis: false,
          suggestion: result.suggestion,
        };
      }

      throw new Error(result.error || "Analysis failed");
    }
  } catch (error) {
    console.error("Fairness analysis error:", error);
    throw new Error(`Fairness analysis failed: ${error.message}`);
  }
};

// Analyze fairness of contract text directly
export const analyzeFairnessText = async (
  contractText,
  contractType = "contract",
  jurisdiction = "India",
  userRole = "Consumer"
) => {
  if (!auth.currentUser) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/benchmark/analyze-fairness`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contractText,
        contractType,
        jurisdiction,
        userRole,
        userId: auth.currentUser.uid,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Analysis failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        fairnessAnalysis: result.fairnessAnalysis,
        analyzedAt: result.analyzedAt,
      };
    } else {
      throw new Error(result.error || "Fairness analysis failed");
    }
  } catch (error) {
    console.error("Fairness analysis error:", error);
    throw new Error(`Fairness analysis failed: ${error.message}`);
  }
};

// Upload new document and analyze fairness
export const uploadAndAnalyzeFairness = async (
  file,
  selectedRole = "Consumer",
  jurisdiction = "India"
) => {
  if (!auth.currentUser) {
    throw new Error("Authentication required");
  }

  try {
    console.log("Starting file upload and fairness analysis...");

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("selectedRole", selectedRole);
    formData.append("userId", auth.currentUser.uid);
    formData.append("userEmail", auth.currentUser.email);
    formData.append("jurisdiction", jurisdiction);

    // Upload file to backend for processing
    const response = await fetch(
      `${API_BASE_URL}/document/upload-and-analyze`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log("Backend analysis completed:", result);

    if (result.success) {
      return {
        success: true,
        documentId: result.documentId,
        fileName: file.name,
        analysis: result.analysis,
        fairnessBenchmark: result.fairnessBenchmark,
        fileUrl: result.fileUrl,
      };
    } else {
      throw new Error(result.error || "Analysis failed");
    }
  } catch (error) {
    console.error("Upload and analyze fairness error:", error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

// Get benchmark statistics
export const getBenchmarkStats = async (
  jurisdiction = "India",
  contractType = "all"
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/benchmark/benchmark-stats?jurisdiction=${encodeURIComponent(
        jurisdiction
      )}&contractType=${encodeURIComponent(contractType)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch stats: ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        stats: result.stats,
      };
    } else {
      throw new Error(result.error || "Failed to get benchmark statistics");
    }
  } catch (error) {
    console.error("Benchmark stats error:", error);
    throw new Error(`Failed to get benchmark statistics: ${error.message}`);
  }
};

// Get market insights
export const getMarketInsights = async (
  contractType = "rental agreement",
  jurisdiction = "India"
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/benchmark/market-insights?contractType=${encodeURIComponent(
        contractType
      )}&jurisdiction=${encodeURIComponent(jurisdiction)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch insights: ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        insights: result.marketInsights,
      };
    } else {
      throw new Error(result.error || "Failed to get market insights");
    }
  } catch (error) {
    console.error("Market insights error:", error);
    throw new Error(`Failed to get market insights: ${error.message}`);
  }
};

// Analyze specific clause fairness
export const analyzeClauseFairness = async (
  clauseText,
  contractType = "contract",
  jurisdiction = "India"
) => {
  if (!auth.currentUser) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/benchmark/analyze-clause`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clauseText,
        contractType,
        jurisdiction,
        userId: auth.currentUser.uid,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Analysis failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        clauseAnalysis: result.clauseAnalysis,
        analyzedAt: result.analyzedAt,
      };
    } else {
      throw new Error(result.error || "Clause analysis failed");
    }
  } catch (error) {
    console.error("Clause analysis error:", error);
    throw new Error(`Clause analysis failed: ${error.message}`);
  }
};

export default {
  analyzeFairnessById,
  analyzeFairnessText,
  uploadAndAnalyzeFairness,
  getBenchmarkStats,
  getMarketInsights,
  analyzeClauseFairness,
  isAuthenticated,
};
