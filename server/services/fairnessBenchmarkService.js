const { GoogleGenerativeAI } = require("@google/generative-ai");

class FairnessBenchmarkService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    if (!this.apiKey) {
      console.warn("GEMINI_API_KEY not found in environment variables");
      return;
    }

    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  /**
   * Analyze contract fairness using Gemini AI
   * @param {string} contractText - The full contract text
   * @param {string} contractType - Type of contract (rental, employment, service, etc.)
   * @param {string} jurisdiction - Location/jurisdiction (e.g., "Maharashtra, India")
   * @param {string} userRole - User's role (Tenant, Employee, etc.)
   * @returns {Object} Fairness benchmark analysis
   */
  async analyzeFairness(
    contractText,
    contractType = "contract",
    jurisdiction = "India",
    userRole = "Consumer"
  ) {
    const fairnessStart = Date.now();
    const fairnessId = Math.random().toString(36).substr(2, 9);

    console.group(`⚖️ [${fairnessId}] Market Benchmark Analysis Started`);
    console.log(`📄 [${fairnessId}] Contract type: ${contractType}`);
    console.log(`🌍 [${fairnessId}] Jurisdiction: ${jurisdiction}`);
    console.log(`👤 [${fairnessId}] User role: ${userRole}`);
    console.log(
      `📝 [${fairnessId}] Contract text length: ${contractText.length} characters`
    );

    if (!this.model) {
      console.error(`❌ [${fairnessId}] Gemini AI not properly initialized`);
      console.groupEnd();
      throw new Error("Gemini AI not properly initialized");
    }

    console.log(
      `⏰ [${fairnessId}] Step 1: Creating fairness prompt - ${
        Date.now() - fairnessStart
      }ms`
    );
    const promptStart = Date.now();

    const prompt = this.createFairnessPrompt(
      contractText,
      contractType,
      jurisdiction,
      userRole
    );

    const promptTime = Date.now() - promptStart;
    console.log(`✅ [${fairnessId}] Prompt created in ${promptTime}ms`);
    console.log(
      `📐 [${fairnessId}] Prompt length: ${prompt.length} characters`
    );

    try {
      console.log(
        `⏰ [${fairnessId}] Step 2: Sending request to Gemini API - ${
          Date.now() - fairnessStart
        }ms`
      );
      const geminiApiStart = Date.now();

      const result = await this.model.generateContent(prompt);

      const geminiApiTime = Date.now() - geminiApiStart;
      console.log(
        `✅ [${fairnessId}] Gemini API response received in ${geminiApiTime}ms`
      );

      console.log(
        `⏰ [${fairnessId}] Step 3: Processing Gemini response - ${
          Date.now() - fairnessStart
        }ms`
      );
      const responseProcessStart = Date.now();

      const response = await result.response;
      const analysisText = response.text();

      const responseProcessTime = Date.now() - responseProcessStart;
      console.log(
        `✅ [${fairnessId}] Response processed in ${responseProcessTime}ms`
      );
      console.log(
        `📊 [${fairnessId}] Response length: ${analysisText.length} characters`
      );

      console.log(
        `⏰ [${fairnessId}] Step 4: Parsing fairness analysis - ${
          Date.now() - fairnessStart
        }ms`
      );
      const parseStart = Date.now();

      const parsedResult = this.parseFairnessResponse(analysisText);

      const parseTime = Date.now() - parseStart;
      const totalTime = Date.now() - fairnessStart;

      console.log(`✅ [${fairnessId}] Analysis parsed in ${parseTime}ms`);
      console.log(
        `🎉 [${fairnessId}] Market benchmark analysis completed in ${totalTime}ms`
      );
      console.log(`📊 [${fairnessId}] Timing breakdown:`, {
        promptCreation: `${promptTime}ms`,
        geminiApiCall: `${geminiApiTime}ms`,
        responseProcessing: `${responseProcessTime}ms`,
        resultParsing: `${parseTime}ms`,
        totalTime: `${totalTime}ms`,
      });
      console.log(`⚖️ [${fairnessId}] Analysis result:`, {
        overallScore: parsedResult.overallFairnessScore,
        marketPosition: parsedResult.marketPosition,
        keyFindingsCount: parsedResult.keyFindings?.length || 0,
        redFlagsCount: parsedResult.redFlags?.length || 0,
      });
      console.groupEnd();

      return parsedResult;
    } catch (error) {
      const totalTime = Date.now() - fairnessStart;
      console.error(
        `❌ [${fairnessId}] Market benchmark analysis failed after ${totalTime}ms:`,
        error.message
      );
      console.groupEnd();
      throw new Error("Failed to analyze contract fairness: " + error.message);
    }
  }

  /**
   * Create a comprehensive fairness analysis prompt
   * @param {string} contractText - Contract content
   * @param {string} contractType - Type of contract
   * @param {string} jurisdiction - Location/jurisdiction
   * @param {string} userRole - User's role
   * @returns {string} Formatted prompt
   */
  createFairnessPrompt(contractText, contractType, jurisdiction, userRole) {
    return `
You are an expert legal analyst specializing in contract fairness and market benchmarking. Analyze this ${contractType} contract from ${jurisdiction} from the perspective of a ${userRole}.

CONTRACT TEXT:
"${contractText}"

ANALYSIS INSTRUCTIONS:
1. Compare each key clause against typical market standards for ${jurisdiction}
2. Identify clauses that are unusually favorable or unfavorable to the ${userRole}
3. Provide specific market data and percentile rankings where possible
4. Focus on financial terms, obligations, rights, and risk allocation
5. Consider local laws and regulations for ${jurisdiction}

Please provide your analysis in the following JSON structure:
{
  "overallFairnessScore": 75,
  "overallAssessment": "Brief summary of contract fairness",
  "marketPosition": "above_average|average|below_average|concerning",
  "keyFindings": [
    {
      "clause": "Full text of the specific clause",
      "category": "security_deposit|rent_increase|notice_period|maintenance|penalties|termination|payment_terms|liability|other",
      "riskLevel": "STANDARD|CAUTION|HIGH_RISK",
      "marketComparison": "This term appears in X% of similar contracts in ${jurisdiction}",
      "percentile": "95th percentile - much higher than typical",
      "explanation": "Detailed explanation of why this clause is fair/unfair and its implications",
      "recommendation": "Specific actionable advice for negotiation or acceptance",
      "financialImpact": "Potential cost/benefit in monetary terms if applicable"
    }
  ],
  "benchmarkMetrics": {
    "securityDeposit": {
      "contractValue": "3 months",
      "marketMedian": "2 months", 
      "marketRange": "1-3 months",
      "percentile": "90th percentile",
      "assessment": "CAUTION - Higher than 85% of similar agreements"
    },
    "rentIncrease": {
      "contractValue": "8% annually",
      "marketMedian": "5% annually",
      "marketRange": "3-7% annually", 
      "percentile": "95th percentile",
      "assessment": "HIGH_RISK - Higher than 95% of similar agreements"
    },
    "noticePeriod": {
      "contractValue": "30 days",
      "marketMedian": "30 days",
      "marketRange": "15-60 days",
      "percentile": "50th percentile", 
      "assessment": "STANDARD - Typical market rate"
    }
  },
  "jurisdictionCompliance": {
    "compliant": true,
    "violations": [],
    "legalConcerns": ["Any potential legal issues"],
    "regulatoryNotes": ["Relevant local laws or regulations"]
  },
  "negotiationOpportunities": [
    {
      "clause": "Specific clause to negotiate",
      "currentTerm": "Current unfavorable term",
      "suggestedTerm": "Market-standard alternative",
      "justification": "Market data supporting the change",
      "priority": "high|medium|low",
      "likelihood": "high|medium|low - likelihood of successful negotiation"
    }
  ],
  "redFlags": [
    {
      "issue": "Specific concerning clause or term",
      "severity": "critical|high|medium|low",
      "explanation": "Why this is problematic",
      "advice": "What the user should do about it"
    }
  ],
  "positiveAspects": [
    {
      "feature": "Favorable clause or term",
      "benefit": "How this benefits the ${userRole}",
      "rarity": "How common/rare this favorable term is"
    }
  ],
  "marketInsights": [
    "Recent trends in ${contractType} contracts in ${jurisdiction}",
    "Common negotiation points in similar contracts",
    "Typical market ranges for key terms"
  ]
}

IMPORTANT GUIDELINES:
- Base percentiles and market comparisons on realistic data for ${jurisdiction}
- Consider local market conditions, economic factors, and legal framework
- Provide specific monetary impacts where possible
- Focus on actionable insights the ${userRole} can use for negotiation
- Be objective but advocate for fairness to the ${userRole}
- Include recent market trends and changes if relevant

Provide only the JSON response without any additional text or formatting.
    `;
  }

  /**
   * Parse and validate the Gemini fairness analysis response
   * @param {string} responseText - Raw response from Gemini
   * @returns {Object} Parsed fairness analysis object
   */
  parseFairnessResponse(responseText) {
    const parseStart = Date.now();
    const parseId = Math.random().toString(36).substr(2, 6);

    console.log(`🔍 [${parseId}] Starting response parsing...`);
    console.log(
      `📏 [${parseId}] Response text length: ${responseText.length} characters`
    );

    try {
      // Clean the response text to extract JSON
      console.log(
        `⏰ [${parseId}] Step 1: Cleaning response text - ${
          Date.now() - parseStart
        }ms`
      );
      const cleanStart = Date.now();

      let cleanedResponse = responseText.trim();

      // Remove any markdown formatting
      cleanedResponse = cleanedResponse
        .replace(/```json\n?/, "")
        .replace(/```\n?$/, "");

      const cleanTime = Date.now() - cleanStart;
      console.log(`✅ [${parseId}] Text cleaned in ${cleanTime}ms`);
      console.log(
        `📝 [${parseId}] Cleaned response length: ${cleanedResponse.length} characters`
      );

      console.log(
        `⏰ [${parseId}] Step 2: JSON parsing - ${Date.now() - parseStart}ms`
      );
      const jsonParseStart = Date.now();

      const analysis = JSON.parse(cleanedResponse);

      const jsonParseTime = Date.now() - jsonParseStart;
      console.log(`✅ [${parseId}] JSON parsed in ${jsonParseTime}ms`);

      console.log(
        `⏰ [${parseId}] Step 3: Validating and setting defaults - ${
          Date.now() - parseStart
        }ms`
      );
      const validationStart = Date.now();

      // Validate and set defaults for required fields
      analysis.overallFairnessScore = analysis.overallFairnessScore || 70;
      analysis.overallAssessment =
        analysis.overallAssessment || "Contract analysis completed";
      analysis.marketPosition = analysis.marketPosition || "average";
      analysis.keyFindings = analysis.keyFindings || [];
      analysis.benchmarkMetrics = analysis.benchmarkMetrics || {};
      analysis.jurisdictionCompliance = analysis.jurisdictionCompliance || {
        compliant: true,
        violations: [],
        legalConcerns: [],
        regulatoryNotes: [],
      };
      analysis.negotiationOpportunities =
        analysis.negotiationOpportunities || [];
      analysis.redFlags = analysis.redFlags || [];
      analysis.positiveAspects = analysis.positiveAspects || [];
      analysis.marketInsights = analysis.marketInsights || [];

      // Ensure each key finding has the required structure
      analysis.keyFindings = analysis.keyFindings.map((finding, index) => ({
        id: `finding-${index + 1}`,
        clause: finding.clause || "",
        category: finding.category || "other",
        riskLevel: finding.riskLevel || "STANDARD",
        marketComparison:
          finding.marketComparison || "Market comparison not available",
        percentile: finding.percentile || "50th percentile",
        explanation: finding.explanation || "Analysis not available",
        recommendation: finding.recommendation || "Review carefully",
        financialImpact:
          finding.financialImpact || "Impact assessment not available",
      }));

      const validationTime = Date.now() - validationStart;
      const totalParseTime = Date.now() - parseStart;

      console.log(
        `✅ [${parseId}] Validation completed in ${validationTime}ms`
      );
      console.log(
        `🎉 [${parseId}] Response parsing completed in ${totalParseTime}ms`
      );
      console.log(`📊 [${parseId}] Parse timing breakdown:`, {
        textCleaning: `${cleanTime}ms`,
        jsonParsing: `${jsonParseTime}ms`,
        validation: `${validationTime}ms`,
        totalTime: `${totalParseTime}ms`,
      });
      console.log(`📋 [${parseId}] Parsed analysis structure:`, {
        overallScore: analysis.overallFairnessScore,
        keyFindings: analysis.keyFindings.length,
        benchmarkMetrics: Object.keys(analysis.benchmarkMetrics).length,
        redFlags: analysis.redFlags.length,
        negotiationOpps: analysis.negotiationOpportunities.length,
      });

      return analysis;
    } catch (error) {
      const totalParseTime = Date.now() - parseStart;
      console.error(
        `❌ [${parseId}] Response parsing failed after ${totalParseTime}ms:`,
        error.message
      );
      console.log(
        `🔍 [${parseId}] Raw response sample:`,
        responseText.substring(0, 500) + "..."
      );

      // Return a fallback analysis

      // Return a fallback analysis
      return {
        overallFairnessScore: 70,
        overallAssessment:
          "Fairness analysis completed but detailed parsing failed",
        marketPosition: "average",
        keyFindings: [],
        benchmarkMetrics: {},
        jurisdictionCompliance: {
          compliant: true,
          violations: [],
          legalConcerns: [],
          regulatoryNotes: [],
        },
        negotiationOpportunities: [],
        redFlags: [],
        positiveAspects: [],
        marketInsights: [],
        error: "Failed to parse AI response",
      };
    }
  }

  /**
   * Quick fairness check for specific clause
   * @param {string} clauseText - Specific clause to analyze
   * @param {string} contractType - Type of contract
   * @param {string} jurisdiction - Location/jurisdiction
   * @returns {Object} Quick fairness assessment
   */
  async analyzeClause(clauseText, contractType, jurisdiction) {
    const clauseStart = Date.now();
    const clauseId = Math.random().toString(36).substr(2, 6);

    console.group(`🔍 [${clauseId}] Quick Clause Analysis Started`);
    console.log(
      `📝 [${clauseId}] Clause text length: ${clauseText.length} characters`
    );
    console.log(`📄 [${clauseId}] Contract type: ${contractType}`);
    console.log(`🌍 [${clauseId}] Jurisdiction: ${jurisdiction}`);

    if (!this.model) {
      console.error(`❌ [${clauseId}] Gemini AI not properly initialized`);
      console.groupEnd();
      throw new Error("Gemini AI not properly initialized");
    }

    console.log(
      `⏰ [${clauseId}] Creating clause analysis prompt - ${
        Date.now() - clauseStart
      }ms`
    );
    const promptStart = Date.now();

    const prompt = `
Analyze this specific clause from a ${contractType} contract in ${jurisdiction}:

"${clauseText}"

Provide a quick fairness assessment in JSON format:
{
  "riskLevel": "STANDARD|CAUTION|HIGH_RISK",
  "marketComparison": "percentage comparison to market standard",
  "explanation": "brief explanation of fairness",
  "recommendation": "quick advice"
}
    `;

    const promptTime = Date.now() - promptStart;
    console.log(`✅ [${clauseId}] Clause prompt created in ${promptTime}ms`);

    try {
      console.log(
        `⏰ [${clauseId}] Sending clause analysis to Gemini API - ${
          Date.now() - clauseStart
        }ms`
      );
      const apiStart = Date.now();

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const analysisText = response.text();

      const apiTime = Date.now() - apiStart;
      const totalTime = Date.now() - clauseStart;

      console.log(
        `✅ [${clauseId}] Clause API response received in ${apiTime}ms`
      );
      console.log(
        `🎉 [${clauseId}] Clause analysis completed in ${totalTime}ms`
      );

      let cleanedResponse = analysisText
        .trim()
        .replace(/```json\n?/, "")
        .replace(/```\n?$/, "");

      const parsedResult = JSON.parse(cleanedResponse);

      console.log(`📊 [${clauseId}] Clause result:`, {
        riskLevel: parsedResult.riskLevel,
        hasMarketComparison: !!parsedResult.marketComparison,
      });
      console.groupEnd();

      return parsedResult;
    } catch (error) {
      const totalTime = Date.now() - clauseStart;
      console.error(
        `❌ [${clauseId}] Clause analysis failed after ${totalTime}ms:`,
        error.message
      );
      console.groupEnd();

      return {
        riskLevel: "STANDARD",
        marketComparison: "Unable to determine market comparison",
        explanation: "Analysis failed",
        recommendation: "Manual review recommended",
      };
    }
  }

  /**
   * Generate market insights for a specific contract type and jurisdiction
   * @param {string} contractType - Type of contract
   * @param {string} jurisdiction - Location/jurisdiction
   * @returns {Object} Market insights and trends
   */
  async getMarketInsights(contractType, jurisdiction) {
    if (!this.model) {
      throw new Error("Gemini AI not properly initialized");
    }

    const prompt = `
Provide current market insights for ${contractType} contracts in ${jurisdiction}.

Include information about:
- Typical terms and conditions
- Recent market trends
- Common negotiation points
- Fair market ranges for key terms

Respond in JSON format:
{
  "marketTrends": ["trend 1", "trend 2"],
  "typicalTerms": {
    "securityDeposit": "typical range",
    "paymentTerms": "typical terms",
    "terminationNotice": "typical notice period"
  },
  "negotiationPoints": ["common negotiation item 1", "item 2"],
  "insights": ["insight 1", "insight 2"]
}
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const analysisText = response.text();

      let cleanedResponse = analysisText
        .trim()
        .replace(/```json\n?/, "")
        .replace(/```\n?$/, "");

      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error("Error getting market insights:", error);
      return {
        marketTrends: [],
        typicalTerms: {},
        negotiationPoints: [],
        insights: [],
        error: "Failed to generate market insights",
      };
    }
  }
}

module.exports = FairnessBenchmarkService;
