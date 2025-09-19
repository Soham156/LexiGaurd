const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { DocumentStorage } = require("../models/Document");
const { authenticateToken } = require("../middleware/auth");
const geminiService = require("../services/geminiService");
const TextExtractor = require("../utils/textExtractor");
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["pdf", "doc", "docx", "txt"];
  const fileExtension = path
    .extname(file.originalname)
    .toLowerCase()
    .substring(1);

  if (allowedTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `File type .${fileExtension} is not allowed. Allowed types: ${allowedTypes.join(
          ", "
        )}`
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB default
  },
});

// @route   GET /api/documents/test
// @desc    Test documents route
// @access  Public
router.get("/test", (req, res) => {
  res.json({ message: "Documents routes working" });
});

// @route   POST /api/documents/upload
// @desc    Upload document
// @access  Private
router.post(
  "/upload",
  authenticateToken,
  upload.single("document"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      const { title, tags } = req.body;

      // Create document record
      const document = await DocumentStorage.create({
        title: title || req.file.originalname,
        filename: req.file.filename,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        fileType: path
          .extname(req.file.originalname)
          .toLowerCase()
          .substring(1),
        uploadedBy: req.user.userId,
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      });

      res.status(201).json({
        message: "Document uploaded successfully",
        document,
      });
    } catch (error) {
      // Clean up uploaded file if document creation failed
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      }

      res.status(400).json({
        message: "Upload failed",
        error: error.message,
      });
    }
  }
);

// @route   GET /api/documents
// @desc    Get user documents
// @access  Private
router.get("/", authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const userDocuments = DocumentStorage.findByUserId(userId);
    const sharedDocuments = DocumentStorage.getSharedWith(userId);

    res.json({
      message: "Documents retrieved successfully",
      documents: {
        owned: userDocuments,
        shared: sharedDocuments,
      },
      count: {
        owned: userDocuments.length,
        shared: sharedDocuments.length,
        total: userDocuments.length + sharedDocuments.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve documents",
      error: error.message,
    });
  }
});

// @route   GET /api/documents/:id
// @desc    Get specific document
// @access  Private
router.get("/:id", authenticateToken, (req, res) => {
  try {
    const document = DocumentStorage.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    // Check if user has access to this document
    const userId = req.user.userId;
    const hasAccess =
      document.uploadedBy === userId ||
      document.sharedWith.some((share) => share.user === userId);

    if (!hasAccess) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    res.json({
      message: "Document retrieved successfully",
      document,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve document",
      error: error.message,
    });
  }
});

// @route   PUT /api/documents/:id
// @desc    Update document
// @access  Private
router.put("/:id", authenticateToken, (req, res) => {
  try {
    const document = DocumentStorage.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    // Check if user owns this document or has write access
    const userId = req.user.userId;
    const hasWriteAccess =
      document.uploadedBy === userId ||
      document.sharedWith.some(
        (share) => share.user === userId && share.permissions === "write"
      );

    if (!hasWriteAccess) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const { title, tags, status } = req.body;
    const updateData = {};

    if (title) updateData.title = title;
    if (tags)
      updateData.tags = Array.isArray(tags)
        ? tags
        : tags.split(",").map((tag) => tag.trim());
    if (status) updateData.status = status;

    const updatedDocument = DocumentStorage.update(req.params.id, updateData);

    res.json({
      message: "Document updated successfully",
      document: updatedDocument,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update document",
      error: error.message,
    });
  }
});

// @route   DELETE /api/documents/:id
// @desc    Delete document
// @access  Private
router.delete("/:id", authenticateToken, (req, res) => {
  try {
    const document = DocumentStorage.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    // Check if user owns this document
    if (document.uploadedBy !== req.user.userId) {
      return res.status(403).json({
        message: "Access denied. Only document owner can delete.",
      });
    }

    // Delete the physical file
    const filePath = path.join(__dirname, "../uploads", document.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete document record
    const deleted = DocumentStorage.delete(req.params.id);

    if (deleted) {
      res.json({
        message: "Document deleted successfully",
      });
    } else {
      res.status(500).json({
        message: "Failed to delete document",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete document",
      error: error.message,
    });
  }
});

// @route   POST /api/documents/:id/share
// @desc    Share document with another user
// @access  Private
router.post("/:id/share", authenticateToken, (req, res) => {
  try {
    const document = DocumentStorage.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    // Check if user owns this document
    if (document.uploadedBy !== req.user.userId) {
      return res.status(403).json({
        message: "Access denied. Only document owner can share.",
      });
    }

    const { userId, permissions } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    document.shareWith(userId, permissions || "read");

    res.json({
      message: "Document shared successfully",
      document,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to share document",
      error: error.message,
    });
  }
});

// @route   POST /api/documents/:id/analyze
// @desc    Analyze document with AI
// @access  Private
router.post("/:id/analyze", authenticateToken, async (req, res) => {
  try {
    const document = DocumentStorage.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    // Check if user has access to this document
    const userId = req.user.userId;
    const hasAccess =
      document.uploadedBy === userId ||
      document.sharedWith.some((share) => share.user === userId);

    if (!hasAccess) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    // Read document content for analysis
    let documentText = "";

    try {
      const filePath = path.join(__dirname, "../uploads", document.filename);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          message: "Document file not found",
        });
      }

      // Check if file type is supported
      if (!TextExtractor.isSupportedType(document.fileType)) {
        return res.status(400).json({
          message: `Unsupported file type: ${document.fileType}. Supported types: PDF, TXT`,
        });
      }

      // Extract text using the TextExtractor utility
      documentText = await TextExtractor.extractText(
        filePath,
        document.fileType
      );

      if (!documentText || documentText.trim().length === 0) {
        return res.status(400).json({
          message: "No readable text content found in the document",
        });
      }

      console.log(
        `Extracted ${documentText.length} characters from ${document.fileType} file`
      );
    } catch (extractionError) {
      console.error("Text extraction failed:", extractionError);
      return res.status(400).json({
        message: `Failed to extract text from document: ${extractionError.message}`,
      });
    }

    // Update document status to processing
    DocumentStorage.update(req.params.id, { status: "processing" });

    try {
      // Analyze document with Gemini AI
      const analysis = await geminiService.analyzeDocument(
        documentText,
        document.title
      );

      // Update document with analysis results
      const updatedDocument = DocumentStorage.update(req.params.id, {
        status: "analyzed",
        analysis: analysis,
      });

      res.json({
        message: "Document analyzed successfully",
        document: updatedDocument,
        analysis: analysis,
      });
    } catch (aiError) {
      // Update document status to failed
      DocumentStorage.update(req.params.id, { status: "failed" });

      res.status(500).json({
        message: "AI analysis failed",
        error: aiError.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to analyze document",
      error: error.message,
    });
  }
});

// @route   GET /api/documents/:id/analysis
// @desc    Get document analysis results
// @access  Private
router.get("/:id/analysis", authenticateToken, (req, res) => {
  try {
    const document = DocumentStorage.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    // Check if user has access to this document
    const userId = req.user.userId;
    const hasAccess =
      document.uploadedBy === userId ||
      document.sharedWith.some((share) => share.user === userId);

    if (!hasAccess) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    if (!document.analysis || document.status !== "analyzed") {
      return res.status(404).json({
        message: "No analysis available for this document",
      });
    }

    res.json({
      message: "Analysis retrieved successfully",
      documentId: document.id,
      documentTitle: document.title,
      analysis: document.analysis,
      analyzedAt: document.updatedAt,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve analysis",
      error: error.message,
    });
  }
});

// @route   POST /api/documents/:id/suggestions
// @desc    Get improvement suggestions for document
// @access  Private
router.post("/:id/suggestions", authenticateToken, async (req, res) => {
  try {
    const document = DocumentStorage.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    // Check if user has access to this document
    const userId = req.user.userId;
    const hasAccess =
      document.uploadedBy === userId ||
      document.sharedWith.some((share) => share.user === userId);

    if (!hasAccess) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    // Read document content
    let documentText = "";
    if (document.fileType === "txt") {
      const filePath = path.join(__dirname, "../uploads", document.filename);
      if (fs.existsSync(filePath)) {
        documentText = fs.readFileSync(filePath, "utf8");
      }
    }

    const currentIssues = req.body.issues || [];

    try {
      const suggestions = await geminiService.generateImprovementSuggestions(
        documentText,
        currentIssues
      );

      res.json({
        message: "Suggestions generated successfully",
        documentId: document.id,
        suggestions: suggestions,
      });
    } catch (aiError) {
      res.status(500).json({
        message: "Failed to generate suggestions",
        error: aiError.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to process request",
      error: error.message,
    });
  }
});

// @route   POST /api/documents/compare
// @desc    Compare two documents
// @access  Private
router.post("/compare", authenticateToken, async (req, res) => {
  try {
    const { document1Id, document2Id } = req.body;

    if (!document1Id || !document2Id) {
      return res.status(400).json({
        message: "Both document IDs are required",
      });
    }

    const document1 = DocumentStorage.findById(document1Id);
    const document2 = DocumentStorage.findById(document2Id);

    if (!document1 || !document2) {
      return res.status(404).json({
        message: "One or both documents not found",
      });
    }

    // Check access to both documents
    const userId = req.user.userId;
    const hasAccess1 =
      document1.uploadedBy === userId ||
      document1.sharedWith.some((share) => share.user === userId);
    const hasAccess2 =
      document2.uploadedBy === userId ||
      document2.sharedWith.some((share) => share.user === userId);

    if (!hasAccess1 || !hasAccess2) {
      return res.status(403).json({
        message: "Access denied to one or both documents",
      });
    }

    // Read both document contents (simplified for text files)
    let text1 = "",
      text2 = "";

    if (document1.fileType === "txt") {
      const filePath1 = path.join(__dirname, "../uploads", document1.filename);
      if (fs.existsSync(filePath1)) {
        text1 = fs.readFileSync(filePath1, "utf8");
      }
    }

    if (document2.fileType === "txt") {
      const filePath2 = path.join(__dirname, "../uploads", document2.filename);
      if (fs.existsSync(filePath2)) {
        text2 = fs.readFileSync(filePath2, "utf8");
      }
    }

    try {
      const comparison = await geminiService.compareDocuments(text1, text2);

      res.json({
        message: "Documents compared successfully",
        document1: { id: document1.id, title: document1.title },
        document2: { id: document2.id, title: document2.title },
        comparison: comparison,
      });
    } catch (aiError) {
      res.status(500).json({
        message: "Failed to compare documents",
        error: aiError.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to process comparison",
      error: error.message,
    });
  }
});

// @route   POST /api/documents/:id/extract-terms
// @desc    Extract key terms from document
// @access  Private
router.post("/:id/extract-terms", authenticateToken, async (req, res) => {
  try {
    const document = DocumentStorage.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    // Check if user has access to this document
    const userId = req.user.userId;
    const hasAccess =
      document.uploadedBy === userId ||
      document.sharedWith.some((share) => share.user === userId);

    if (!hasAccess) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    // Read document content
    let documentText = "";
    if (document.fileType === "txt") {
      const filePath = path.join(__dirname, "../uploads", document.filename);
      if (fs.existsSync(filePath)) {
        documentText = fs.readFileSync(filePath, "utf8");
      }
    }

    try {
      const keyTerms = await geminiService.extractKeyTerms(documentText);

      res.json({
        message: "Key terms extracted successfully",
        documentId: document.id,
        documentTitle: document.title,
        keyTerms: keyTerms,
      });
    } catch (aiError) {
      res.status(500).json({
        message: "Failed to extract key terms",
        error: aiError.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to process request",
      error: error.message,
    });
  }
});

module.exports = router;
