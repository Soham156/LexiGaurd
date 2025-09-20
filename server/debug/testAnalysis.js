require("dotenv").config();
const geminiService = require("../services/geminiService");

async function testAnalysis() {
  console.log("🔬 Testing Gemini Analysis...\n");

  // Test document - a simple contract with multiple clauses
  const testDocument = `
    CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT

    This Confidentiality and Non-Disclosure Agreement ("Agreement") is made between Company A and Company B.

    1. CONFIDENTIAL INFORMATION
    The Receiving Party acknowledges that it may have access to confidential information of the Disclosing Party.

    2. OBLIGATIONS OF RECEIVING PARTY
    The Receiving Party agrees to hold and maintain all confidential information in strict confidence.

    3. TERM
    This Agreement shall remain in effect for a period of two (2) years from the date of execution.

    4. REMEDIES
    The Receiving Party acknowledges that any breach of this Agreement may cause irreparable harm to the Disclosing Party.

    5. GOVERNING LAW
    This Agreement shall be governed by and construed in accordance with the laws of the State of California.

    6. LIABILITY LIMITATION
    In no event shall either party be liable for any indirect, incidental, or consequential damages.
  `;

  try {
    console.log("📄 Analyzing test document...");
    const analysis = await geminiService.analyzeDocument(
      testDocument,
      "confidentiality agreement"
    );

    console.log("✅ Analysis completed!\n");

    console.log("📊 Summary:", analysis.summary);
    console.log("🎯 Document Type:", analysis.documentType);
    console.log("⚠️ Risk Level:", analysis.riskLevel);
    console.log("📋 Key Points:", analysis.keyPoints?.length || 0);
    console.log("⚖️ Clauses Found:", analysis.clauses?.length || 0);
    console.log("💡 Recommendations:", analysis.recommendations?.length || 0);

    if (analysis.clauses && analysis.clauses.length > 0) {
      console.log("\n📝 CLAUSES DETAIL:");
      analysis.clauses.forEach((clause, index) => {
        console.log(`\n--- Clause ${index + 1} ---`);
        console.log("Text:", clause.text?.substring(0, 100) + "...");
        console.log("Type:", clause.type);
        console.log("Risk Level:", clause.riskLevel);
        console.log(
          "Explanation:",
          clause.explanation?.substring(0, 100) + "..."
        );
        console.log("Suggestions:", clause.suggestions?.length || 0);
      });
    } else {
      console.log("\n❌ NO CLAUSES FOUND!");
      console.log("Raw analysis object:");
      console.log(JSON.stringify(analysis, null, 2));
    }
  } catch (error) {
    console.error("❌ Analysis failed:", error.message);
    console.error("Full error:", error);
  }
}

// Run the test
testAnalysis();
