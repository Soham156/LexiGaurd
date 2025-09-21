const { extractText } = require("../utils/textExtractor");
const GeminiService = require("./geminiService");
const FairnessBenchmarkService = require("./fairnessBenchmarkService");

const geminiService = new GeminiService();
const fairnessBenchmarkService = new FairnessBenchmarkService();

async function analyzeDocumentFromBase64(
  base64Content,
  fileName,
  mimeType,
  userRole = "Tenant",
  jurisdiction = "India"
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

    // Get fairness benchmark analysis
    let fairnessBenchmark = null;
    try {
      const contractType = determineContractType(fileName, extractedText);
      fairnessBenchmark = await fairnessBenchmarkService.analyzeFairness(
        extractedText,
        contractType,
        jurisdiction,
        userRole
      );
    } catch (fairnessError) {
      console.warn(
        "Fairness benchmark analysis failed:",
        fairnessError.message
      );
    }

    return {
      success: true,
      fileName,
      extractedText,
      analysis,
      fairnessBenchmark,
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
  userRole = "Tenant",
  jurisdiction = "India"
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

    // Get fairness benchmark analysis
    let fairnessBenchmark = null;
    try {
      const contractType = determineContractType(fileName, extractedText);
      fairnessBenchmark = await fairnessBenchmarkService.analyzeFairness(
        extractedText,
        contractType,
        jurisdiction,
        userRole
      );
    } catch (fairnessError) {
      console.warn(
        "Fairness benchmark analysis failed:",
        fairnessError.message
      );
    }

    return {
      success: true,
      fileName,
      extractedText,
      analysis,
      fairnessBenchmark,
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
  userRole = "Tenant",
  jurisdiction = "India"
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

    // Get fairness benchmark analysis
    let fairnessBenchmark = null;
    try {
      const contractType = determineContractType(fileName, extractedText);
      fairnessBenchmark = await fairnessBenchmarkService.analyzeFairness(
        extractedText,
        contractType,
        jurisdiction,
        userRole
      );
    } catch (fairnessError) {
      console.warn(
        "Fairness benchmark analysis failed:",
        fairnessError.message
      );
    }

    return {
      success: true,
      fileName,
      extractedText,
      analysis,
      fairnessBenchmark,
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

/**
 * Helper function to determine contract type from filename and content
 * @param {string} fileName - The name of the file
 * @param {string} extractedText - The extracted text content
 * @returns {string} Contract type
 */
function determineContractType(fileName, extractedText) {
  const fileNameLower = fileName.toLowerCase();
  const textLower = extractedText.toLowerCase();

  // Check filename for keywords
  if (
    fileNameLower.includes("rent") ||
    fileNameLower.includes("lease") ||
    fileNameLower.includes("tenancy")
  ) {
    return "rental agreement";
  }
  if (
    fileNameLower.includes("employ") ||
    fileNameLower.includes("job") ||
    fileNameLower.includes("work")
  ) {
    return "employment contract";
  }
  if (fileNameLower.includes("service") || fileNameLower.includes("vendor")) {
    return "service agreement";
  }

  // Check content for keywords
  if (
    textLower.includes("tenant") ||
    textLower.includes("landlord") ||
    textLower.includes("rent") ||
    textLower.includes("lease")
  ) {
    return "rental agreement";
  }
  if (
    textLower.includes("employee") ||
    textLower.includes("employer") ||
    textLower.includes("salary") ||
    textLower.includes("employment")
  ) {
    return "employment contract";
  }
  if (
    textLower.includes("service provider") ||
    textLower.includes("client") ||
    textLower.includes("vendor")
  ) {
    return "service agreement";
  }
  if (
    textLower.includes("purchase") ||
    textLower.includes("buyer") ||
    textLower.includes("seller")
  ) {
    return "purchase agreement";
  }
  if (
    textLower.includes("license") ||
    textLower.includes("software") ||
    textLower.includes("intellectual property")
  ) {
    return "license agreement";
  }

  // Default fallback
  return "contract";
}

module.exports = {
  analyzeDocumentFromBase64,
  analyzeDocumentFromBuffer,
  analyzeDocumentFromCloudinaryUrl,
};
