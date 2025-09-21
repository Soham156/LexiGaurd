const express = require("express");
const multer = require("multer");
const router = express.Router();
const cloudinary = require("../config/cloudinary");

// Import fetch for Node.js
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const {
  analyzeDocumentFromBase64,
  analyzeDocumentFromBuffer,
  analyzeDocumentFromCloudinaryUrl,
} = require("../services/documentAnalysisService");

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only certain file types
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PDF, Word documents, and text files are allowed."
        )
      );
    }
  },
});

// Upload and analyze document
router.post("/upload-and-analyze", upload.single("file"), async (req, res) => {
  try {
    const {
      selectedRole,
      userId,
      userEmail,
      jurisdiction = "India",
    } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: "No file provided",
      });
    }

    if (!selectedRole || !userId) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: selectedRole, userId",
      });
    }

    console.log(
      `Processing file upload: ${file.originalname} (${file.mimetype})`
    );

    // Upload to Cloudinary
    const cloudinaryResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "lexiguard-documents",
          public_id: `${userId}_${Date.now()}_${file.originalname.replace(
            /[^a-zA-Z0-9]/g,
            "_"
          )}`,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(file.buffer);
    });

    console.log("File uploaded to Cloudinary:", cloudinaryResult.secure_url);

    // Extract text and analyze
    const analysisResult = await analyzeDocumentFromBuffer(
      file.buffer,
      file.originalname,
      file.mimetype,
      selectedRole,
      jurisdiction
    );

    if (!analysisResult.success) {
      // Clean up Cloudinary file if analysis fails
      try {
        await cloudinary.uploader.destroy(cloudinaryResult.public_id);
      } catch (cleanupError) {
        console.warn("Failed to cleanup Cloudinary file:", cleanupError);
      }

      return res.status(500).json({
        success: false,
        error: analysisResult.error || "Analysis failed",
      });
    }

    // Return successful response
    res.json({
      success: true,
      analysis: analysisResult.analysis,
      fairnessBenchmark: analysisResult.fairnessBenchmark,
      fileUrl: cloudinaryResult.secure_url,
      publicId: cloudinaryResult.public_id,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      uploadedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in /upload-and-analyze route:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Upload and analysis failed",
    });
  }
});

// Re-analyze document from Cloudinary URL
router.post("/reanalyze", async (req, res) => {
  try {
    const {
      documentId,
      cloudinaryUrl,
      fileName,
      selectedRole,
      userId,
      jurisdiction = "India",
    } = req.body;

    if (!cloudinaryUrl || !fileName || !selectedRole || !userId) {
      return res.status(400).json({
        success: false,
        error:
          "Missing required fields: cloudinaryUrl, fileName, selectedRole, userId",
      });
    }

    console.log(`Re-analyzing document: ${fileName} from ${cloudinaryUrl}`);

    // Analyze document from Cloudinary URL
    const analysisResult = await analyzeDocumentFromCloudinaryUrl(
      cloudinaryUrl,
      fileName,
      selectedRole,
      jurisdiction
    );

    if (!analysisResult.success) {
      return res.status(500).json({
        success: false,
        error: analysisResult.error || "Re-analysis failed",
      });
    }

    res.json({
      success: true,
      analysis: analysisResult.analysis,
      fairnessBenchmark: analysisResult.fairnessBenchmark,
      reanalyzedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in /reanalyze route:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Re-analysis failed",
    });
  }
});

// Delete document from Cloudinary
router.delete("/delete", async (req, res) => {
  try {
    const { documentId, publicId, userId } = req.body;

    if (!publicId || !userId) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: publicId, userId",
      });
    }

    console.log(`Deleting document from Cloudinary: ${publicId}`);

    // Delete from Cloudinary with proper resource type handling
    let deletionResult;
    let successfulResourceType = null;

    // Try deleting as raw resource first (for documents like PDF, DOCX, TXT, etc.)
    try {
      deletionResult = await cloudinary.uploader.destroy(publicId, {
        resource_type: "raw",
      });

      if (deletionResult.result === "ok") {
        successfulResourceType = "raw";
      }
    } catch (rawError) {
      console.warn("Failed to delete as raw resource:", rawError);
    }

    // If not found as raw, try as image (for JPG, PNG, etc.)
    if (!successfulResourceType) {
      try {
        deletionResult = await cloudinary.uploader.destroy(publicId, {
          resource_type: "image",
        });

        if (deletionResult.result === "ok") {
          successfulResourceType = "image";
        }
      } catch (imageError) {
        console.warn("Failed to delete as image resource:", imageError);
      }
    }

    // If still not found, try as auto (default)
    if (!successfulResourceType) {
      try {
        deletionResult = await cloudinary.uploader.destroy(publicId);

        if (deletionResult.result === "ok") {
          successfulResourceType = "auto";
        }
      } catch (autoError) {
        console.warn("Failed to delete as auto resource:", autoError);
      }
    }

    console.log("Cloudinary deletion result:", deletionResult);

    if (successfulResourceType) {
      console.log(`Successfully deleted as ${successfulResourceType} resource`);
      res.json({
        success: true,
        message: `Document deleted from Cloudinary (${successfulResourceType} resource)`,
        deletedAt: new Date().toISOString(),
      });
    } else {
      console.warn("File not found in Cloudinary with any resource type");
      // Still return success since the file doesn't exist anyway
      res.json({
        success: true,
        message:
          "Document not found in Cloudinary (may have been deleted already)",
        details: deletionResult,
      });
    }
  } catch (error) {
    console.error("Error in /delete route:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Deletion failed",
    });
  }
});

// Route to analyze a document from a Base64 string (keeping for compatibility)
router.post("/analyze-base64", async (req, res) => {
  const {
    base64Content,
    fileName,
    mimeType,
    userRole,
    jurisdiction = "India",
  } = req.body;

  if (!base64Content || !fileName || !mimeType) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields: base64Content, fileName, mimeType",
    });
  }

  try {
    const result = await analyzeDocumentFromBase64(
      base64Content,
      fileName,
      mimeType,
      userRole,
      jurisdiction
    );
    res.json(result);
  } catch (error) {
    console.error("Error in /analyze-base64 route:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate temporary signed URL for Cloudinary files
router.get("/signed-url", async (req, res) => {
  try {
    const { publicId, userId } = req.query;

    if (!userId || !publicId) {
      return res.status(400).json({
        success: false,
        error: "Missing required parameters: userId, publicId",
      });
    }

    console.log(`Generating signed URL for: ${publicId} for user: ${userId}`);

    // Try to generate a signed URL for the resource
    try {
      // First try as raw resource
      let signedUrl = cloudinary.url(publicId, {
        resource_type: "raw",
        type: "upload",
        sign_url: true,
        secure: true,
      });

      // If the above doesn't work, we'll try as image
      if (!signedUrl) {
        signedUrl = cloudinary.url(publicId, {
          resource_type: "image",
          type: "upload",
          sign_url: true,
          secure: true,
        });
      }

      res.json({
        success: true,
        url: signedUrl,
        publicId: publicId,
      });
    } catch (cloudinaryError) {
      console.error("Error generating signed URL:", cloudinaryError);
      res.status(500).json({
        success: false,
        error: "Failed to generate signed URL",
        details: cloudinaryError.message,
      });
    }
  } catch (error) {
    console.error("Error in /signed-url route:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Signed URL generation failed",
    });
  }
});

module.exports = router;
