const { extractText } = require("../utils/textExtractor");
const GeminiService = require("./geminiService");

const geminiService = new GeminiService();

async function analyzeDocumentFromBase64(
  base64Content,
  fileName,
  mimeType,
  userRole = "Tenant"
) {
  try {
    console.log(`Analyzing document from Base64: ${fileName} (${mimeType})`);

    // Decode Base64 to a Buffer
    const fileBuffer = Buffer.from(base64Content, "base64");

    // Extract text from the buffer
    const extractedText = await extractText(fileBuffer, mimeType);

    if (!extractedText || extractedText.trim() === "") {
      return {
        success: false,
        error: "No text could be extracted from the document.",
        fileName,
      };
    }

    // Get AI analysis from Gemini
    const analysis = await geminiService.analyzeDocument(
      extractedText,
      userRole
    );

    return {
      success: true,
      fileName,
      extractedText,
      analysis,
      metadata: {
        processingMethod: "backend-base64",
        source: "base64-upload",
      },
    };
  } catch (error) {
    console.error(`Error analyzing document from Base64: ${error.message}`);
    throw new Error(`Failed to analyze document from Base64: ${error.message}`);
  }
}

async function analyzeDocumentFromBuffer(
  fileBuffer,
  fileName,
  mimeType,
  userRole = "Tenant"
) {
  try {
    console.log(`Analyzing document from Buffer: ${fileName} (${mimeType})`);

    // Extract text from the buffer
    const extractedText = await extractText(fileBuffer, mimeType);

    if (!extractedText || extractedText.trim() === "") {
      return {
        success: false,
        error: "No text could be extracted from the document.",
        fileName,
      };
    }

    // Get AI analysis from Gemini
    const analysis = await geminiService.analyzeDocument(
      extractedText,
      userRole
    );

    return {
      success: true,
      fileName,
      extractedText,
      analysis,
      metadata: {
        processingMethod: "backend-buffer",
        source: "direct-upload",
      },
    };
  } catch (error) {
    console.error(`Error analyzing document from Buffer: ${error.message}`);
    return {
      success: false,
      error: `Failed to analyze document: ${error.message}`,
      fileName,
    };
  }
}

async function analyzeDocumentFromCloudinaryUrl(
  cloudinaryUrl,
  fileName,
  userRole = "Tenant"
) {
  try {
    console.log(`Analyzing document from Cloudinary URL: ${fileName}`);

    // Fetch the file from Cloudinary
    const response = await fetch(cloudinaryUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch file from Cloudinary: ${response.statusText}`
      );
    }

    const fileBuffer = Buffer.from(await response.arrayBuffer());

    // Determine MIME type from URL or filename
    let mimeType = "application/octet-stream";
    const urlLower = cloudinaryUrl.toLowerCase();
    const fileNameLower = fileName.toLowerCase();

    if (urlLower.includes(".pdf") || fileNameLower.includes(".pdf")) {
      mimeType = "application/pdf";
    } else if (
      urlLower.includes(".docx") ||
      fileNameLower.includes(".docx") ||
      fileNameLower.includes("_docx")
    ) {
      mimeType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    } else if (
      urlLower.includes(".doc") ||
      fileNameLower.includes(".doc") ||
      fileNameLower.includes("_doc")
    ) {
      mimeType = "application/msword";
    } else if (urlLower.includes(".txt") || fileNameLower.includes(".txt")) {
      mimeType = "text/plain";
    }

    console.log(`Detected MIME type: ${mimeType} for file: ${fileName}`);

    // Extract text from the buffer
    const extractedText = await extractText(fileBuffer, mimeType);

    if (!extractedText || extractedText.trim() === "") {
      return {
        success: false,
        error: "No text could be extracted from the document.",
        fileName,
      };
    }

    // Get AI analysis from Gemini
    const analysis = await geminiService.analyzeDocument(
      extractedText,
      userRole
    );

    return {
      success: true,
      fileName,
      extractedText,
      analysis,
      metadata: {
        processingMethod: "backend-cloudinary",
        source: "cloudinary-url",
      },
    };
  } catch (error) {
    console.error(
      `Error analyzing document from Cloudinary URL: ${error.message}`
    );
    return {
      success: false,
      error: `Failed to analyze document: ${error.message}`,
      fileName,
    };
  }
}

module.exports = {
  analyzeDocumentFromBase64,
  analyzeDocumentFromBuffer,
  analyzeDocumentFromCloudinaryUrl,
};
