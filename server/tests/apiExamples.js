/**
 * API Test Examples for Gemini Integration
 * These are example cURL commands and API usage
 */

// Example API endpoints for testing:

// 1. Upload a document first
// POST http://localhost:8080/api/documents/upload
// Content-Type: multipart/form-data
// Authorization: Bearer YOUR_JWT_TOKEN
// Body: file (document), title (optional), tags (optional)

// 2. Analyze uploaded document
// POST http://localhost:8080/api/documents/:documentId/analyze
// Authorization: Bearer YOUR_JWT_TOKEN

// 3. Get analysis results
// GET http://localhost:8080/api/documents/:documentId/analysis
// Authorization: Bearer YOUR_JWT_TOKEN

// 4. Get improvement suggestions
// POST http://localhost:8080/api/documents/:documentId/suggestions
// Authorization: Bearer YOUR_JWT_TOKEN
// Body: { "issues": ["issue1", "issue2"] }

// 5. Compare two documents
// POST http://localhost:8080/api/documents/compare
// Authorization: Bearer YOUR_JWT_TOKEN
// Body: { "document1Id": "id1", "document2Id": "id2" }

// 6. Extract key terms
// POST http://localhost:8080/api/documents/:documentId/extract-terms
// Authorization: Bearer YOUR_JWT_TOKEN

const testEndpoints = {
  register: {
    method: "POST",
    url: "http://localhost:8080/api/auth/register",
    body: {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    },
  },

  login: {
    method: "POST",
    url: "http://localhost:8080/api/auth/login",
    body: {
      email: "test@example.com",
      password: "password123",
    },
  },

  analyze: {
    method: "POST",
    url: "http://localhost:8080/api/documents/:id/analyze",
    headers: {
      Authorization: "Bearer YOUR_JWT_TOKEN",
    },
  },

  getAnalysis: {
    method: "GET",
    url: "http://localhost:8080/api/documents/:id/analysis",
    headers: {
      Authorization: "Bearer YOUR_JWT_TOKEN",
    },
  },
};

console.log("🔧 LexiGuard API Test Endpoints:");
console.log(JSON.stringify(testEndpoints, null, 2));

module.exports = testEndpoints;
