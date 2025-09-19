/**
 * Test script for Gemini AI integration
 * Run with: node tests/geminiTest.js
 */

require("dotenv").config();
const geminiService = require("../services/geminiService");

async function testGeminiIntegration() {
  console.log("🧪 Testing Gemini AI Integration...\n");

  // Sample legal document text
  const sampleDocument = `
    CONFIDENTIALITY AGREEMENT

    This Confidentiality Agreement ("Agreement") is entered into on [DATE] between:
    
    Company A ("Disclosing Party")
    Company B ("Receiving Party")
    
    1. CONFIDENTIAL INFORMATION
    The Receiving Party acknowledges that it may have access to confidential information including but not limited to trade secrets, business plans, financial information, and technical data.
    
    2. OBLIGATIONS
    The Receiving Party agrees to:
    - Keep all confidential information strictly confidential
    - Use the information solely for evaluation purposes
    - Not disclose information to third parties
    
    3. TERM
    This agreement shall remain in effect for a period of 2 years from the date of execution.
    
    4. RETURN OF MATERIALS
    Upon termination, all confidential materials must be returned or destroyed.
  `;

  try {
    console.log("📄 Sample Document:");
    console.log(sampleDocument.trim());
    console.log("\n" + "=".repeat(80) + "\n");

    console.log("🔍 Analyzing document with Gemini AI...");
    const analysis = await geminiService.analyzeDocument(
      sampleDocument,
      "Confidentiality Agreement"
    );

    console.log("✅ Analysis completed successfully!");
    console.log("\n📊 Analysis Results:");
    console.log(JSON.stringify(analysis, null, 2));

    console.log("\n" + "=".repeat(80) + "\n");

    console.log("💡 Testing improvement suggestions...");
    const suggestions = await geminiService.generateImprovementSuggestions(
      sampleDocument,
      ["Missing termination clause", "No penalty for breach"]
    );

    console.log("✅ Suggestions generated successfully!");
    console.log("\n🚀 Improvement Suggestions:");
    suggestions.forEach((suggestion, index) => {
      console.log(`${index + 1}. ${suggestion}`);
    });

    console.log("\n" + "=".repeat(80) + "\n");

    console.log("🔑 Testing key terms extraction...");
    const keyTerms = await geminiService.extractKeyTerms(sampleDocument);

    console.log("✅ Key terms extracted successfully!");
    console.log("\n📝 Key Terms:");
    keyTerms.forEach((term, index) => {
      console.log(`${index + 1}. ${term.term}: ${term.definition}`);
      console.log(`   Importance: ${term.importance}`);
      console.log("");
    });

    console.log("🎉 All tests completed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error("Stack trace:", error.stack);
  }
}

// Run the test
if (require.main === module) {
  testGeminiIntegration();
}

module.exports = testGeminiIntegration;
