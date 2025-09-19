/**
 * Quick test to check if the API integration is working
 */

// Import fetch for Node.js
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const FormData = require("form-data");

// Test the API endpoints
async function testAPI() {
  const baseURL = "http://localhost:8080/api";

  console.log("🔍 Testing API endpoints...\n");

  // Test health endpoint
  try {
    const healthResponse = await fetch(`${baseURL}/health`);
    const healthData = await healthResponse.json();
    console.log("✅ Health check:", healthData);
  } catch (error) {
    console.log("❌ Health check failed:", error.message);
  }

  // Test registration
  try {
    console.log("\n📝 Testing user registration...");
    const registerResponse = await fetch(`${baseURL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      }),
    });

    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log("✅ Registration successful");

      // Test document upload
      console.log("\n📁 Testing document upload...");
      const FormDataClass = require("form-data");
      const formData = new FormDataClass();

      // Create a test text file
      const testContent = `
        TEST CONFIDENTIALITY AGREEMENT
        
        This is a test agreement between Party A and Party B.
        
        1. CONFIDENTIAL INFORMATION
        The Receiving Party shall keep all information confidential.
        
        2. TERM
        This agreement is valid for 1 year.
      `;

      const blob = Buffer.from(testContent);

      formData.append("document", blob, {
        filename: "test-agreement.txt",
        contentType: "text/plain",
      });
      formData.append("title", "Test Agreement");
      formData.append("tags", "test,confidentiality");

      const uploadResponse = await fetch(`${baseURL}/documents/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${registerData.token}`,
          ...formData.getHeaders(),
        },
        body: formData,
      });

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        console.log("✅ Document upload successful");
        const documentId = uploadData.document.id;

        // Test document analysis
        console.log("\n🤖 Testing document analysis...");
        const analysisResponse = await fetch(
          `${baseURL}/documents/${documentId}/analyze`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${registerData.token}`,
            },
          }
        );

        if (analysisResponse.ok) {
          const analysisData = await analysisResponse.json();
          console.log("✅ Document analysis successful");
          console.log("📊 Analysis summary:", {
            riskLevel: analysisData.analysis.riskLevel,
            overallScore: analysisData.analysis.overallScore,
            clausesCount: analysisData.analysis.clauses.length,
          });
        } else {
          const error = await analysisResponse.json();
          console.log("❌ Analysis failed:", error.message);
        }
      } else {
        const error = await uploadResponse.json();
        console.log("❌ Upload failed:", error.message);
      }
    } else {
      const error = await registerResponse.json();
      console.log("❌ Registration failed:", error.message);
    }
  } catch (error) {
    console.log("❌ Test failed:", error.message);
  }
}

// Run the test if this script is executed directly
if (typeof window === "undefined") {
  testAPI();
}
