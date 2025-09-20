const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");
const mammoth = require("mammoth");

/**
 * Text extraction utility for different file types
 */
class TextExtractor {
  /**
   * Extract text from a file based on its type
   * @param {string} filePath - Path to the file
   * @param {string} fileType - File extension (pdf, txt, doc, docx)
   * @returns {Promise<string>} Extracted text content
   */
  static async extractText(filePath, fileType) {
    try {
      switch (fileType.toLowerCase()) {
        case "pdf":
          return await this.extractFromPDF(filePath);
        case "txt":
          return await this.extractFromTXT(filePath);
        case "doc":
        case "docx":
          return await this.extractFromWord(filePath);
        default:
          throw new Error(`Unsupported file type: ${fileType}`);
      }
    } catch (error) {
      console.error(`Error extracting text from ${fileType} file:`, error);
      throw new Error(
        `Failed to extract text from ${fileType} file: ${error.message}`
      );
    }
  }

  /**
   * Extract text from PDF file
   * @param {string} filePath - Path to PDF file
   * @returns {Promise<string>} Extracted text
   */
  static async extractFromPDF(filePath) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);

      // Clean up the extracted text
      let text = data.text;

      // Remove excessive whitespace and normalize line breaks
      text = text.replace(/\s+/g, " ").trim();
      text = text.replace(/\n\s*\n/g, "\n\n");

      if (!text || text.length < 10) {
        throw new Error("No readable text found in PDF file");
      }

      return text;
    } catch (error) {
      console.error("PDF extraction error:", error);
      throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
  }

  /**
   * Extract text from Word document (DOC/DOCX)
   * @param {string} filePath - Path to Word file
   * @returns {Promise<string>} Extracted text
   */
  static async extractFromWord(filePath) {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      let text = result.value;

      // Clean up the extracted text
      text = text.replace(/\s+/g, " ").trim();
      text = text.replace(/\n\s*\n/g, "\n\n");

      if (!text || text.length < 10) {
        throw new Error("No readable text found in Word document");
      }

      // Log any messages from mammoth (warnings about unsupported elements)
      if (result.messages && result.messages.length > 0) {
        console.log(
          "Word extraction messages:",
          result.messages.map((m) => m.message)
        );
      }

      return text;
    } catch (error) {
      console.error("Word extraction error:", error);
      throw new Error(
        `Failed to extract text from Word document: ${error.message}`
      );
    }
  }

  /**
   * Extract text from TXT file
   * @param {string} filePath - Path to TXT file
   * @returns {Promise<string>} File content
   */
  static async extractFromTXT(filePath) {
    try {
      const content = fs.readFileSync(filePath, "utf8");

      if (!content || content.trim().length === 0) {
        throw new Error("Text file is empty");
      }

      return content.trim();
    } catch (error) {
      console.error("TXT extraction error:", error);
      throw new Error(`Failed to read text file: ${error.message}`);
    }
  }

  /**
   * Validate if file exists and is readable
   * @param {string} filePath - Path to file
   * @returns {boolean} True if file is accessible
   */
  static validateFile(filePath) {
    try {
      return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
    } catch (error) {
      return false;
    }
  }

  /**
   * Get file size in bytes
   * @param {string} filePath - Path to file
   * @returns {number} File size in bytes
   */
  static getFileSize(filePath) {
    try {
      return fs.statSync(filePath).size;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Check if file type is supported
   * @param {string} fileType - File extension
   * @returns {boolean} True if supported
   */
  static isSupportedType(fileType) {
    const supportedTypes = ["pdf", "txt", "doc", "docx"];
    return supportedTypes.includes(fileType.toLowerCase());
  }
}

module.exports = TextExtractor;
