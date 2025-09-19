const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { DocumentStorage } = require("../models/Document");
const { authenticateToken } = require("../middleware/auth");
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

module.exports = router;
