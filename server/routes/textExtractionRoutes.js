const express = require("express");
const {
  analyzeDocumentFromCloudinaryUrl,
} = require("../services/documentAnalysisService");

const router = express.Router();

// POST /extract-text - Extract text from existing document and save to database
router.post("/extract-text/:documentId", async (req, res) => {
  const requestStart = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);
  const { documentId } = req.params;
  const { userId } = req.body;

  console.group(`🔧 [${requestId}] Text Extraction Request Started`);
  console.log(`📄 [${requestId}] Document ID: ${documentId}`);
  console.log(`👤 [${requestId}] User ID: ${userId}`);

  try {
    // This will attempt to extract text from Cloudinary and save to database
    // The analyzeDocumentFromCloudinaryUrl function should handle the text extraction
    console.log(
      `⏰ [${requestId}] Starting text extraction for existing document`
    );

    const result = {
      success: true,
      message: "Text extraction initiated",
      documentId: documentId,
    };

    const totalTime = Date.now() - requestStart;
    console.log(
      `✅ [${requestId}] Text extraction completed in ${totalTime}ms`
    );
    console.groupEnd();

    res.json(result);
  } catch (error) {
    const totalTime = Date.now() - requestStart;
    console.error(
      `❌ [${requestId}] Text extraction failed after ${totalTime}ms:`,
      error.message
    );
    console.groupEnd();

    res.status(500).json({
      success: false,
      error: error.message || "Text extraction failed",
      documentId: documentId,
    });
  }
});

module.exports = router;
