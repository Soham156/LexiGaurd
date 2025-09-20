// Main API service - simplified without Google Drive
export {
  authService,
  isAuthenticated,
  getCurrentUser,
  handleApiError,
} from "./firebaseApi.js";

// Import the new document service for direct uploads
export { default as documentService } from "./documentService.js";
