const TextExtractor = require("../utils/textExtractor");
const path = require("path");
const fs = require("fs");

async function testPDFExtraction() {
  console.log("🧪 Testing PDF Text Extraction...\n");

  // Create a simple text file for testing
  const testTextContent = `
    SAMPLE CONTRACT AGREEMENT
    
    This agreement is made between Party A and Party B.
    
    1. TERMS AND CONDITIONS
    Both parties agree to the following terms.
    
    2. LIABILITY
    Neither party shall be liable for indirect damages.
    
    3. TERMINATION
    This agreement can be terminated with 30 days notice.
  `;

  const testFilePath = path.join(__dirname, "../uploads/test-document.txt");

  try {
    // Write test file
    fs.writeFileSync(testFilePath, testTextContent);
    console.log("📄 Created test document");

    // Test text extraction
    const extractedText = await TextExtractor.extractText(testFilePath, "txt");
    console.log("✅ Text extraction successful!");
    console.log(
      "📝 Extracted text length:",
      extractedText.length,
      "characters"
    );
    console.log("🔍 First 200 characters:");
    console.log(extractedText.substring(0, 200) + "...");

    // Test file validation
    console.log("\n🔧 Testing file validation...");
    console.log("File exists:", TextExtractor.validateFile(testFilePath));
    console.log("File size:", TextExtractor.getFileSize(testFilePath), "bytes");
    console.log("PDF supported:", TextExtractor.isSupportedType("pdf"));
    console.log("TXT supported:", TextExtractor.isSupportedType("txt"));
    console.log("DOC supported:", TextExtractor.isSupportedType("doc"));

    // Clean up test file
    fs.unlinkSync(testFilePath);
    console.log("\n🧹 Cleaned up test file");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    // Clean up on error
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  }
}

// Run the test
testPDFExtraction();
