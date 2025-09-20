/**
 * Quick test to check if the API integration is working
 */

// Import fetch for Node.js
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

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
    return;
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
      console.log("📊 Basic functionality is working!");
    } else {
      const error = await registerResponse.json();
      console.log("❌ Registration failed:", error.message);
    }
  } catch (error) {
    console.log("❌ Test failed:", error.message);
  }
}

// Run the test
testAPI();
