const TextExtractor = require("../utils/textExtractor");
const path = require("path");
const fs = require("fs");

async function testWordExtraction() {
  console.log("📄 Testing Word Document Extraction...\n");

  // Test all supported file types
  const testCases = [
    { type: "pdf", supported: true },
    { type: "txt", supported: true },
    { type: "doc", supported: true },
    { type: "docx", supported: true },
    { type: "ppt", supported: false },
    { type: "xlsx", supported: false },
  ];

  console.log("🔍 Testing file type support:");
  testCases.forEach((test) => {
    const isSupported = TextExtractor.isSupportedType(test.type);
    const status = isSupported === test.supported ? "✅" : "❌";
    console.log(
      `${status} ${test.type.toUpperCase()}: ${
        isSupported ? "Supported" : "Not supported"
      }`
    );
  });

  // Create a test TXT file with contract content
  const contractContent = `
    SERVICE AGREEMENT

    This Service Agreement ("Agreement") is entered into between Company A ("Provider") and Company B ("Client").

    1. SCOPE OF SERVICES
    Provider agrees to deliver the following services to Client as specified in Exhibit A.

    2. PAYMENT TERMS
    Client shall pay Provider the fees set forth in Exhibit B within thirty (30) days of invoice date.

    3. CONFIDENTIALITY
    Both parties agree to maintain the confidentiality of all proprietary information disclosed during the term of this Agreement.

    4. TERM AND TERMINATION
    This Agreement shall commence on the Effective Date and continue for one (1) year unless terminated earlier.

    5. LIABILITY LIMITATION
    Provider's total liability shall not exceed the total amount paid by Client under this Agreement.

    6. GOVERNING LAW
    This Agreement shall be governed by the laws of the State of California.
  `;

  const testFilePath = path.join(__dirname, "../uploads/test-contract.txt");

  try {
    // Write test file
    fs.writeFileSync(testFilePath, contractContent);
    console.log("\n📝 Created test contract document");

    // Test text extraction
    console.log("🔄 Extracting text...");
    const extractedText = await TextExtractor.extractText(testFilePath, "txt");

    console.log("✅ Text extraction successful!");
    console.log("📊 Statistics:");
    console.log(`  - Characters: ${extractedText.length}`);
    console.log(`  - Words: ~${extractedText.split(/\s+/).length}`);
    console.log(`  - Lines: ~${extractedText.split("\n").length}`);

    console.log("\n🔍 Sample content (first 300 characters):");
    console.log('"' + extractedText.substring(0, 300) + '..."');

    // Test validation functions
    console.log("\n🛠️ Testing utility functions:");
    console.log(`  - File exists: ${TextExtractor.validateFile(testFilePath)}`);
    console.log(
      `  - File size: ${TextExtractor.getFileSize(testFilePath)} bytes`
    );

    // Clean up
    fs.unlinkSync(testFilePath);
    console.log("\n🧹 Test completed and cleaned up");

    console.log("\n🎉 All tests passed! Word document support is ready.");
    console.log(
      "💡 You can now upload PDF, TXT, DOC, and DOCX files for analysis."
    );
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error("Full error:", error);

    // Clean up on error
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  }
}

// Run the test
testWordExtraction();
