// API Configuration and Services
const API_BASE_URL = "http://localhost:8080/api";

// Storage for JWT token
const getToken = () => localStorage.getItem("lexiguard_token");
const setToken = (token) => localStorage.setItem("lexiguard_token", token);
const removeToken = () => localStorage.removeItem("lexiguard_token");

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    // Basic check - decode JWT to see if it's expired
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Date.now() / 1000;
    return payload.exp > now;
  } catch {
    return false;
  }
};

// API client with authentication
const apiClient = async (endpoint, options = {}) => {
  const token = getToken();

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // Add auth header if token exists
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Remove content-type for FormData (file uploads)
  if (options.body instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Authentication Services
export const authService = {
  register: async (userData) => {
    const response = await apiClient("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (response.token) {
      setToken(response.token);
    }

    return response;
  },

  login: async (credentials) => {
    const response = await apiClient("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.token) {
      setToken(response.token);
    }

    return response;
  },

  logout: () => {
    removeToken();
  },

  getCurrentUser: async () => {
    return await apiClient("/users/profile");
  },
};

// Document Services
export const documentService = {
  upload: async (file, title, tags = []) => {
    const formData = new FormData();
    formData.append("document", file);
    formData.append("title", title);
    formData.append("tags", tags.join(","));

    return await apiClient("/documents/upload", {
      method: "POST",
      body: formData,
    });
  },

  getAll: async () => {
    return await apiClient("/documents");
  },

  getById: async (id) => {
    return await apiClient(`/documents/${id}`);
  },

  analyze: async (id) => {
    return await apiClient(`/documents/${id}/analyze`, {
      method: "POST",
    });
  },

  getAnalysis: async (id) => {
    return await apiClient(`/documents/${id}/analysis`);
  },

  getSuggestions: async (id, issues = []) => {
    return await apiClient(`/documents/${id}/suggestions`, {
      method: "POST",
      body: JSON.stringify({ issues }),
    });
  },

  compare: async (document1Id, document2Id) => {
    return await apiClient("/documents/compare", {
      method: "POST",
      body: JSON.stringify({ document1Id, document2Id }),
    });
  },

  extractTerms: async (id) => {
    return await apiClient(`/documents/${id}/extract-terms`, {
      method: "POST",
    });
  },

  delete: async (id) => {
    return await apiClient(`/documents/${id}`, {
      method: "DELETE",
    });
  },

  share: async (id, userId, permissions = "read") => {
    return await apiClient(`/documents/${id}/share`, {
      method: "POST",
      body: JSON.stringify({ userId, permissions }),
    });
  },
};

// Utility functions
export const handleApiError = (error, navigate) => {
  if (error.message.includes("403") || error.message.includes("401")) {
    removeToken();
    navigate("/signin");
  }
  return error.message;
};
