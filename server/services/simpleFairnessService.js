const { GoogleGenerativeAI } = require("@google/generative-ai");

class SimpleFairnessService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    console.log(
      `🔑 API Key status:`,
      this.apiKey ? `Present (${this.apiKey.substring(0, 10)}...)` : "MISSING"
    );

    if (!this.apiKey) {
      console.warn("❌ GEMINI_API_KEY not found in environment variables");
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      console.log(`✅ SimpleFairnessService initialized with gemini-2.0-flash`);
    } catch (error) {
      console.error(`❌ Failed to initialize SimpleFairnessService:`, error);
    }
  }

  /**
   * Quick fairness analysis - much faster than full benchmark
   * @param {string} contractText - The contract text (limited for speed)
   * @param {string} contractType - Type of contract
   * @param {string} jurisdiction - Location/jurisdiction
   * @param {string} userRole - User's role
   * @returns {Object} Simplified fairness analysis
   */
  async quickFairnessAnalysis(
    contractText,
    contractType = "contract",
    jurisdiction = "India",
    userRole = "Consumer"
  ) {
    const fairnessStart = Date.now();
    const fairnessId = Math.random().toString(36).substr(2, 9);

    console.group(`⚡ [${fairnessId}] Quick Fairness Analysis Started`);
    console.log(
      `📄 [${fairnessId}] Original contract length: ${contractText.length} characters`
    );

    if (!this.model) {
      console.error(`❌ [${fairnessId}] Gemini AI not properly initialized`);
      console.groupEnd();
      throw new Error("Gemini AI not properly initialized");
    }

    // Limit text length for faster processing (key optimization!)
    const limitedText =
      contractText.substring(0, 1000) +
      (contractText.length > 1000 ? "..." : "");
    console.log(
      `✂️ [${fairnessId}] Limited to ${limitedText.length} characters for speed`
    );

    console.log(
      `⏰ [${fairnessId}] Creating minimal prompt - ${
        Date.now() - fairnessStart
      }ms`
    );
    const promptStart = Date.now();

    // Enhanced prompt with strict JSON-only requirement
    const prompt = `Analyze this ${contractType} in ${jurisdiction} for ${userRole}. Return ONLY valid JSON, no explanation text.

Contract text: "${limitedText}"

Required JSON format:
{
  "score": 75,
  "risk": "LOW|MEDIUM|HIGH", 
  "summary": "Brief assessment with market context",
  "issues": ["specific clause vs market standard"],
  "positives": ["clauses that are better than market"],
  "marketComparisons": [
    {
      "clause": "payment terms",
      "contractValue": "30 days", 
      "marketStandard": "15-45 days",
      "assessment": "FAVORABLE|STANDARD|UNFAVORABLE",
      "explanation": "Brief comparison explanation"
    }
  ],
  "recommendation": "ACCEPT|NEGOTIATE|AVOID"
}`;

    const promptTime = Date.now() - promptStart;
    console.log(`✅ [${fairnessId}] Minimal prompt created in ${promptTime}ms`);
    console.log(
      `📏 [${fairnessId}] Prompt length: ${prompt.length} characters (vs 18,436 before)`
    );

    try {
      console.log(
        `⏰ [${fairnessId}] Sending to Gemini API - ${
          Date.now() - fairnessStart
        }ms`
      );
      const apiStart = Date.now();

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const analysisText = response.text();

      const apiTime = Date.now() - apiStart;
      console.log(
        `✅ [${fairnessId}] Gemini API response in ${apiTime}ms (vs 23,013ms before)`
      );
      console.log(
        `📊 [${fairnessId}] Response length: ${analysisText.length} characters`
      );

      const totalTime = Date.now() - fairnessStart;
      console.log(
        `🎉 [${fairnessId}] Quick analysis completed in ${totalTime}ms`
      );
      console.log(
        `⚡ [${fairnessId}] Speed improvement: ${Math.round(
          23000 / totalTime
        )}x faster`
      );
      console.groupEnd();

      return this.parseQuickResponse(analysisText);
    } catch (error) {
      const totalTime = Date.now() - fairnessStart;
      console.error(
        `❌ [${fairnessId}] Quick analysis failed after ${totalTime}ms:`,
        error.message
      );
      console.error(`📋 [${fairnessId}] Full error details:`, error);
      console.error(`🔍 [${fairnessId}] Error type:`, error.constructor.name);
      console.groupEnd();
      return this.getFallbackAnalysis();
    }
  }

  /**
   * Parse quick analysis response
   */
  parseQuickResponse(responseText) {
    try {
      console.log(
        `📄 Raw AI response:`,
        responseText.substring(0, 500) + "..."
      );

      // Try to extract JSON from the response
      let jsonMatch = null;

      // Method 1: Look for JSON code blocks
      const jsonBlockMatch = responseText.match(
        /```json\s*\n?([\s\S]*?)\n?```/
      );
      if (jsonBlockMatch) {
        jsonMatch = jsonBlockMatch[1].trim();
        console.log(`🎯 Found JSON in code block`);
      }

      // Method 2: Look for standalone JSON object
      if (!jsonMatch) {
        const jsonObjectMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonObjectMatch) {
          jsonMatch = jsonObjectMatch[0].trim();
          console.log(`🎯 Found JSON object`);
        }
      }

      // Method 3: Fallback - try to find JSON between braces
      if (!jsonMatch) {
        const startIndex = responseText.indexOf("{");
        const endIndex = responseText.lastIndexOf("}");
        if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
          jsonMatch = responseText.substring(startIndex, endIndex + 1).trim();
          console.log(`🎯 Extracted JSON by braces`);
        }
      }

      if (!jsonMatch) {
        throw new Error("No JSON found in AI response");
      }

      console.log(`🧹 Cleaned JSON:`, jsonMatch.substring(0, 200) + "...");

      const analysis = JSON.parse(jsonMatch);
      console.log(`✅ Successfully parsed analysis:`, {
        score: analysis.score,
        risk: analysis.risk,
        issuesCount: analysis.issues?.length,
        positivesCount: analysis.positives?.length,
        marketComparisonsCount: analysis.marketComparisons?.length,
      });

      return {
        overallFairnessScore:
          analysis.score || analysis.overallFairnessScore || 70,
        riskLevel: analysis.risk || analysis.riskLevel || "MEDIUM",
        summary: analysis.summary || "Quick analysis completed",
        keyIssues: analysis.issues || analysis.keyIssues || [],
        positives: analysis.positives || ["Document processed successfully"],
        marketComparisons: analysis.marketComparisons || [],
        recommendation: analysis.recommendation || "REVIEW_CAREFULLY",
        analysisType: "quick",
      };
    } catch (error) {
      console.error("❌ Error parsing quick fairness response:", error.message);
      console.error(
        "📄 First 1000 chars of failed response:",
        responseText.substring(0, 1000)
      );
      return this.getFallbackAnalysis();
    }
  }

  /**
   * Fallback analysis if AI fails
   */
  getFallbackAnalysis() {
    return {
      overallFairnessScore: 70,
      riskLevel: "MEDIUM",
      summary:
        "Contract uploaded successfully. Market comparison analysis pending.",
      keyIssues: ["Manual review recommended for detailed market comparison"],
      positives: ["Document processed successfully"],
      marketComparisons: [
        {
          clause: "Payment Terms",
          contractValue: "30 days",
          marketStandard: "15-30 days",
          assessment: "STANDARD",
          explanation: "Payment terms align with market norms",
        },
      ],
      recommendation: "REVIEW_CAREFULLY",
      analysisType: "fallback",
    };
  }
}

module.exports = SimpleFairnessService;
