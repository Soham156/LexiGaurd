const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const {
  analyzeDocumentFromBuffer,
  analyzeDocumentFromCloudinaryUrl,
} = require("../services/documentAnalysisService");

const router = express.Router();

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// POST /upload-only - Simple document upload WITH text extraction (fixed for cached clients)
router.post("/upload-only", upload.single("file"), async (req, res) => {
  const requestStart = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);

  console.group(
    `📤 [${requestId}] FIXED Upload-Only (with text extraction) Started`
  );
  console.log(
    `⏰ [${requestId}] Request received at ${new Date().toISOString()}`
  );
  console.log(
    `🔧 [${requestId}] NOTE: This now extracts text even for 'upload-only' to fix cached clients`
  );

  try {
    const { file } = req;
    const { userRole = "user", jurisdiction = "India" } = req.body;

    console.log(
      `⏰ [${requestId}] Step 1: Validating request - ${
        Date.now() - requestStart
      }ms`
    );

    if (!file) {
      console.error(`❌ [${requestId}] No file provided`);
      console.groupEnd();
      return res.status(400).json({
        success: false,
        error: "No file provided",
      });
    }

    console.log(`📄 [${requestId}] File details:`, {
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      userRole,
      jurisdiction,
    });

    // Step 2: Upload to Cloudinary
    console.log(
      `⏰ [${requestId}] Step 2: Starting Cloudinary upload - ${
        Date.now() - requestStart
      }ms`
    );
    const cloudinaryStart = Date.now();

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "legal-documents",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(file.buffer);
    });

    const cloudinaryTime = Date.now() - cloudinaryStart;
    console.log(
      `✅ [${requestId}] Cloudinary upload completed in ${cloudinaryTime}ms`
    );
    console.log(`☁️ [${requestId}] Cloudinary result:`, {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
    });

    // Step 3: NEW - Extract text and analyze (this is the fix!)
    console.log(
      `⏰ [${requestId}] Step 3: Starting text extraction and analysis - ${
        Date.now() - requestStart
      }ms`
    );
    const analysisStart = Date.now();

    console.log(`🔍 [${requestId}] Calling analyzeDocumentFromBuffer with:`, {
      bufferSize: file.buffer.length,
      fileName: file.originalname,
      mimeType: file.mimetype,
      userRole,
      jurisdiction,
    });

    const analysis = await analyzeDocumentFromBuffer(
      file.buffer,
      file.originalname,
      file.mimetype,
      userRole,
      jurisdiction
    );

    const analysisTime = Date.now() - analysisStart;
    console.log(`✅ [${requestId}] Analysis completed in ${analysisTime}ms`);
    console.log(`� [${requestId}] Analysis success:`, analysis.success);
    console.log(
      `🔍 [${requestId}] Has extractedText:`,
      !!analysis.extractedText
    );
    console.log(
      `🔍 [${requestId}] ExtractedText length:`,
      analysis.extractedText?.length || 0
    );

    const totalTime = Date.now() - requestStart;
    console.log(
      `🎉 [${requestId}] FIXED Upload completed successfully in ${totalTime}ms`
    );
    console.log(`📊 [${requestId}] Timing summary:`, {
      validation: `${cloudinaryStart - requestStart}ms`,
      cloudinaryUpload: `${cloudinaryTime}ms`,
      textExtraction: `${analysisTime}ms`,
      totalTime: `${totalTime}ms`,
    });
    console.groupEnd();

    // Return both upload and analysis data
    res.json({
      success: true,
      data: {
        fileName: file.originalname,
        fileUrl: result.secure_url,
        publicId: result.public_id,
        // Include analysis data if successful
        analysis: analysis.success ? analysis.analysis : null,
        fairnessBenchmark: analysis.success ? analysis.fairnessBenchmark : null,
        extractedText: analysis.success ? analysis.extractedText : null,
        metadata: {
          processingMethod: "upload-only-with-analysis-fix",
          cloudinaryUploadTime: cloudinaryTime,
          textExtractionTime: analysisTime,
          totalRequestTime: totalTime,
          analysisSuccess: analysis.success,
          ...(analysis.success ? analysis.metadata : {}),
        },
      },
    });
  } catch (error) {
    const totalTime = Date.now() - requestStart;
    console.error(
      `❌ [${requestId}] FIXED Upload failed after ${totalTime}ms:`,
      error.message
    );
    console.groupEnd();

    res.status(500).json({
      success: false,
      error: error.message || "Document upload failed",
      details: {
        totalTime: totalTime,
      },
    });
  }
});

// POST /upload-and-analyze
router.post("/upload-and-analyze", upload.single("file"), async (req, res) => {
  const requestStart = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);

  console.log(
    `🔥 [${requestId}] UPLOAD-AND-ANALYZE ENDPOINT HIT!!! This should always appear`
  );
  console.group(`📤 [${requestId}] Document Upload Request Started`);
  console.log(
    `⏰ [${requestId}] Request received at ${new Date().toISOString()}`
  );

  try {
    const { file } = req;
    const { userRole = "Tenant", jurisdiction = "India" } = req.body;

    console.log(
      `⏰ [${requestId}] Step 1: Validating request - ${
        Date.now() - requestStart
      }ms`
    );

    if (!file) {
      console.error(`❌ [${requestId}] No file provided`);
      console.groupEnd();
      return res.status(400).json({
        success: false,
        error: "No file provided",
      });
    }

    console.log(`📄 [${requestId}] File details:`, {
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });

    // Step 2: Upload to Cloudinary
    console.log(
      `⏰ [${requestId}] Step 2: Starting Cloudinary upload - ${
        Date.now() - requestStart
      }ms`
    );
    const cloudinaryStart = Date.now();

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "legal-documents",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(file.buffer);
    });

    const cloudinaryTime = Date.now() - cloudinaryStart;
    console.log(
      `✅ [${requestId}] Cloudinary upload completed in ${cloudinaryTime}ms`
    );
    console.log(`☁️ [${requestId}] Cloudinary result:`, {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
    });

    // Step 3: Analyze document
    console.log(
      `⏰ [${requestId}] Step 3: Starting document analysis - ${
        Date.now() - requestStart
      }ms`
    );
    const analysisStart = Date.now();

    console.log(`🔍 [${requestId}] Calling analyzeDocumentFromBuffer with:`, {
      bufferSize: file.buffer.length,
      fileName: file.originalname,
      mimeType: file.mimetype,
      userRole,
      jurisdiction,
    });

    const analysis = await analyzeDocumentFromBuffer(
      file.buffer,
      file.originalname,
      file.mimetype,
      userRole,
      jurisdiction
    );

    const analysisTime = Date.now() - analysisStart;
    console.log(
      `✅ [${requestId}] Document analysis completed in ${analysisTime}ms`
    );
    console.log(`🔍 [${requestId}] Analysis success:`, analysis.success);
    console.log(
      `🔍 [${requestId}] Analysis result keys:`,
      Object.keys(analysis)
    );
    console.log(
      `🔍 [${requestId}] Has extractedText:`,
      !!analysis.extractedText
    );
    console.log(
      `🔍 [${requestId}] ExtractedText length:`,
      analysis.extractedText?.length || 0
    );

    if (!analysis.success) {
      console.error(`❌ [${requestId}] Analysis failed:`, analysis.error);
      console.error(`❌ [${requestId}] Analysis object:`, analysis);
      console.groupEnd();
      return res.status(500).json({
        success: false,
        error: analysis.error,
        details: {
          fileName: file.originalname,
          fileSize: file.size,
          mimeType: file.mimetype,
          cloudinaryUrl: result.secure_url,
          analysisTime: analysisTime,
        },
      });
    }

    const totalTime = Date.now() - requestStart;
    console.log(
      `🎉 [${requestId}] Request completed successfully in ${totalTime}ms`
    );
    console.log(`📊 [${requestId}] Request timing summary:`, {
      validation: `${cloudinaryStart - requestStart}ms`,
      cloudinaryUpload: `${cloudinaryTime}ms`,
      documentAnalysis: `${analysisTime}ms`,
      totalTime: `${totalTime}ms`,
    });
    console.groupEnd();

    res.json({
      success: true,
      data: {
        fileName: file.originalname,
        fileUrl: result.secure_url,
        publicId: result.public_id,
        analysis: analysis.analysis,
        fairnessBenchmark: analysis.fairnessBenchmark,
        extractedText: analysis.extractedText,
        metadata: {
          ...analysis.metadata,
          cloudinaryUploadTime: cloudinaryTime,
          totalRequestTime: totalTime,
        },
      },
    });
  } catch (error) {
    const totalTime = Date.now() - requestStart;
    console.error(
      `❌ [${requestId}] Request failed after ${totalTime}ms:`,
      error.message
    );
    console.groupEnd();

    res.status(500).json({
      success: false,
      error: error.message || "Document upload and analysis failed",
    });
  }
});

// POST /reanalyze - Reanalyze document from Cloudinary URL
router.post("/reanalyze", async (req, res) => {
  const requestStart = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);

  console.group(`🔄 [${requestId}] Document Reanalysis Request Started`);
  console.log(
    `⏰ [${requestId}] Request received at ${new Date().toISOString()}`
  );

  try {
    const {
      cloudinaryUrl,
      fileName,
      userRole = "Tenant",
      jurisdiction = "India",
    } = req.body;

    console.log(
      `⏰ [${requestId}] Step 1: Validating reanalysis request - ${
        Date.now() - requestStart
      }ms`
    );

    if (!cloudinaryUrl || !fileName) {
      console.error(`❌ [${requestId}] Missing cloudinaryUrl or fileName`);
      console.groupEnd();
      return res.status(400).json({
        success: false,
        error: "Cloudinary URL and file name are required",
      });
    }

    console.log(`🔗 [${requestId}] Reanalyzing:`, {
      url: cloudinaryUrl,
      fileName,
      userRole,
      jurisdiction,
    });

    // Analyze document from Cloudinary URL
    console.log(
      `⏰ [${requestId}] Step 2: Starting document analysis - ${
        Date.now() - requestStart
      }ms`
    );
    const analysisStart = Date.now();

    const analysis = await analyzeDocumentFromCloudinaryUrl(
      cloudinaryUrl,
      fileName,
      userRole,
      jurisdiction
    );

    const analysisTime = Date.now() - analysisStart;
    console.log(
      `✅ [${requestId}] Document analysis completed in ${analysisTime}ms`
    );
    console.log(`🔍 [${requestId}] Analysis success:`, analysis.success);

    if (!analysis.success) {
      console.error(`❌ [${requestId}] Analysis failed:`, analysis.error);
      console.groupEnd();
      return res.status(500).json({
        success: false,
        error: analysis.error,
      });
    }

    const totalTime = Date.now() - requestStart;
    console.log(
      `🎉 [${requestId}] Reanalysis completed successfully in ${totalTime}ms`
    );
    console.log(`📊 [${requestId}] Reanalysis timing:`, {
      documentAnalysis: `${analysisTime}ms`,
      totalTime: `${totalTime}ms`,
    });
    console.groupEnd();

    res.json({
      success: true,
      data: {
        fileName,
        analysis: analysis.analysis,
        fairnessBenchmark: analysis.fairnessBenchmark,
        extractedText: analysis.extractedText,
        metadata: {
          ...analysis.metadata,
          totalRequestTime: totalTime,
        },
      },
    });
  } catch (error) {
    const totalTime = Date.now() - requestStart;
    console.error(
      `❌ [${requestId}] Reanalysis failed after ${totalTime}ms:`,
      error.message
    );
    console.groupEnd();

    res.status(500).json({
      success: false,
      error: error.message || "Document reanalysis failed",
    });
  }
});

// POST /analyze-base64 - Analyze document from base64 data
router.post("/analyze-base64", async (req, res) => {
  const requestStart = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);

  console.group(`📄 [${requestId}] Base64 Document Analysis Request Started`);
  console.log(
    `⏰ [${requestId}] Request received at ${new Date().toISOString()}`
  );

  try {
    const {
      base64Data,
      fileName,
      mimeType,
      userRole = "Tenant",
      jurisdiction = "India",
    } = req.body;

    console.log(
      `⏰ [${requestId}] Step 1: Validating base64 request - ${
        Date.now() - requestStart
      }ms`
    );

    if (!base64Data || !fileName) {
      console.error(`❌ [${requestId}] Missing base64Data or fileName`);
      console.groupEnd();
      return res.status(400).json({
        success: false,
        error: "Base64 data and file name are required",
      });
    }

    console.log(`📄 [${requestId}] Base64 analysis details:`, {
      fileName,
      mimeType,
      userRole,
      jurisdiction,
      dataLength: base64Data.length,
    });

    // Convert base64 to buffer
    console.log(
      `⏰ [${requestId}] Step 2: Converting base64 to buffer - ${
        Date.now() - requestStart
      }ms`
    );
    const conversionStart = Date.now();

    const fileBuffer = Buffer.from(base64Data, "base64");

    const conversionTime = Date.now() - conversionStart;
    console.log(
      `✅ [${requestId}] Base64 conversion completed in ${conversionTime}ms`
    );
    console.log(`📦 [${requestId}] Buffer size: ${fileBuffer.length} bytes`);

    // Analyze document from buffer
    console.log(
      `⏰ [${requestId}] Step 3: Starting document analysis - ${
        Date.now() - requestStart
      }ms`
    );
    const analysisStart = Date.now();

    const analysis = await analyzeDocumentFromBuffer(
      fileBuffer,
      fileName,
      mimeType,
      userRole,
      jurisdiction
    );

    const analysisTime = Date.now() - analysisStart;
    console.log(
      `✅ [${requestId}] Document analysis completed in ${analysisTime}ms`
    );
    console.log(`🔍 [${requestId}] Analysis success:`, analysis.success);

    if (!analysis.success) {
      console.error(`❌ [${requestId}] Analysis failed:`, analysis.error);
      console.groupEnd();
      return res.status(500).json({
        success: false,
        error: analysis.error,
      });
    }

    const totalTime = Date.now() - requestStart;
    console.log(
      `🎉 [${requestId}] Base64 analysis completed successfully in ${totalTime}ms`
    );
    console.log(`📊 [${requestId}] Base64 analysis timing:`, {
      base64Conversion: `${conversionTime}ms`,
      documentAnalysis: `${analysisTime}ms`,
      totalTime: `${totalTime}ms`,
    });
    console.groupEnd();

    res.json({
      success: true,
      data: {
        fileName,
        analysis: analysis.analysis,
        fairnessBenchmark: analysis.fairnessBenchmark,
        extractedText: analysis.extractedText,
        metadata: {
          ...analysis.metadata,
          base64ConversionTime: conversionTime,
          totalRequestTime: totalTime,
        },
      },
    });
  } catch (error) {
    const totalTime = Date.now() - requestStart;
    console.error(
      `❌ [${requestId}] Base64 analysis failed after ${totalTime}ms:`,
      error.message
    );
    console.groupEnd();

    res.status(500).json({
      success: false,
      error: error.message || "Base64 document analysis failed",
    });
  }
});

// GET /signed-url - Generate signed URL for Cloudinary
router.get("/signed-url", async (req, res) => {
  const requestStart = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);

  console.group(`🔐 [${requestId}] Signed URL Request Started`);
  console.log(
    `⏰ [${requestId}] Request received at ${new Date().toISOString()}`
  );

  try {
    const { publicId } = req.query;

    console.log(
      `⏰ [${requestId}] Step 1: Validating signed URL request - ${
        Date.now() - requestStart
      }ms`
    );

    if (!publicId) {
      console.error(`❌ [${requestId}] Missing publicId`);
      console.groupEnd();
      return res.status(400).json({
        success: false,
        error: "Public ID is required",
      });
    }

    console.log(
      `🔑 [${requestId}] Generating signed URL for publicId: ${publicId}`
    );

    // Generate signed URL
    console.log(
      `⏰ [${requestId}] Step 2: Generating Cloudinary signed URL - ${
        Date.now() - requestStart
      }ms`
    );
    const signedUrlStart = Date.now();

    const signedUrl = cloudinary.url(publicId, {
      sign_url: true,
      resource_type: "auto",
    });

    const signedUrlTime = Date.now() - signedUrlStart;
    const totalTime = Date.now() - requestStart;

    console.log(`✅ [${requestId}] Signed URL generated in ${signedUrlTime}ms`);
    console.log(
      `🎉 [${requestId}] Signed URL request completed in ${totalTime}ms`
    );
    console.groupEnd();

    res.json({
      success: true,
      url: signedUrl,
      publicId: publicId,
    });
  } catch (error) {
    const totalTime = Date.now() - requestStart;
    console.error(
      `❌ [${requestId}] Signed URL generation failed after ${totalTime}ms:`,
      error.message
    );
    console.groupEnd();

    res.status(500).json({
      success: false,
      error: error.message || "Signed URL generation failed",
    });
  }
});

module.exports = router;
