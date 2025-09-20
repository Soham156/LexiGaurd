const express = require("express");
const multer = require("multer");
const router = express.Router();
const cloudinary = require("../config/cloudinary");
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
    const { selectedRole, userId, userEmail } = req.body;
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
      selectedRole
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
    const { documentId, cloudinaryUrl, fileName, selectedRole, userId } =
      req.body;

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
      selectedRole
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

    // Delete from Cloudinary
    const deletionResult = await cloudinary.uploader.destroy(publicId);

    if (deletionResult.result === "ok") {
      res.json({
        success: true,
        message: "Document deleted from Cloudinary",
        deletedAt: new Date().toISOString(),
      });
    } else {
      console.warn("Cloudinary deletion result:", deletionResult);
      res.json({
        success: false,
        error: "Failed to delete from Cloudinary",
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
  const { base64Content, fileName, mimeType, userRole } = req.body;

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
      userRole
    );
    res.json(result);
  } catch (error) {
    console.error("Error in /analyze-base64 route:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
