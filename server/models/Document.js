class Document {
  constructor(documentData) {
    this.id = documentData.id || this.generateId();
    this.title = documentData.title?.trim();
    this.filename = documentData.filename;
    this.originalName = documentData.originalName;
    this.fileSize = documentData.fileSize;
    this.fileType = documentData.fileType;
    this.uploadedBy = documentData.uploadedBy;
    this.status = documentData.status || "uploaded";
    this.analysis = documentData.analysis || {
      summary: "",
      keyPoints: [],
      riskLevel: "medium",
      clauses: [],
    };
    this.tags = documentData.tags || [];
    this.isShared = documentData.isShared || false;
    this.sharedWith = documentData.sharedWith || [];
    this.createdAt = documentData.createdAt || new Date();
    this.updatedAt = documentData.updatedAt || new Date();
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Validate document data
  validate() {
    const errors = [];

    if (!this.title || this.title.trim().length === 0) {
      errors.push("Document title is required");
    }
    if (this.title && this.title.length > 200) {
      errors.push("Title cannot exceed 200 characters");
    }

    if (!this.filename) {
      errors.push("Filename is required");
    }

    if (!this.originalName) {
      errors.push("Original filename is required");
    }

    if (!this.fileSize || this.fileSize <= 0) {
      errors.push("File size is required");
    }

    if (
      !this.fileType ||
      !["pdf", "doc", "docx", "txt"].includes(this.fileType)
    ) {
      errors.push("File type must be one of: pdf, doc, docx, txt");
    }

    if (!this.uploadedBy) {
      errors.push("User ID is required");
    }

    if (
      !["uploaded", "processing", "analyzed", "failed"].includes(this.status)
    ) {
      errors.push(
        "Status must be one of: uploaded, processing, analyzed, failed"
      );
    }

    return errors;
  }

  // Update timestamp
  updateTimestamp() {
    this.updatedAt = new Date();
  }

  // Add tag
  addTag(tag) {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      this.updateTimestamp();
    }
  }

  // Remove tag
  removeTag(tag) {
    this.tags = this.tags.filter((t) => t !== tag);
    this.updateTimestamp();
  }

  // Share with user
  shareWith(userId, permissions = "read") {
    const existingShare = this.sharedWith.find(
      (share) => share.user === userId
    );
    if (existingShare) {
      existingShare.permissions = permissions;
    } else {
      this.sharedWith.push({ user: userId, permissions });
    }
    this.isShared = this.sharedWith.length > 0;
    this.updateTimestamp();
  }

  // Remove share
  removeShare(userId) {
    this.sharedWith = this.sharedWith.filter((share) => share.user !== userId);
    this.isShared = this.sharedWith.length > 0;
    this.updateTimestamp();
  }
}

// In-memory storage for demonstration (replace with actual database later)
class DocumentStorage {
  constructor() {
    this.documents = new Map();
  }

  async create(documentData) {
    const document = new Document(documentData);
    const errors = document.validate();

    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }

    this.documents.set(document.id, document);
    return document;
  }

  findById(id) {
    return this.documents.get(id);
  }

  findByUserId(userId) {
    return Array.from(this.documents.values()).filter(
      (doc) => doc.uploadedBy === userId
    );
  }

  findByTitle(title) {
    return Array.from(this.documents.values()).filter((doc) =>
      doc.title.toLowerCase().includes(title.toLowerCase())
    );
  }

  update(id, updateData) {
    const document = this.documents.get(id);
    if (!document) return null;

    Object.assign(document, updateData);
    document.updateTimestamp();
    return document;
  }

  delete(id) {
    return this.documents.delete(id);
  }

  getAll() {
    return Array.from(this.documents.values());
  }

  // Get documents shared with a user
  getSharedWith(userId) {
    return Array.from(this.documents.values()).filter((doc) =>
      doc.sharedWith.some((share) => share.user === userId)
    );
  }
}

// Export singleton instance
const documentStorage = new DocumentStorage();

module.exports = { Document, DocumentStorage: documentStorage };
