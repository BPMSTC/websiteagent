import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = {
  // Auth
  verifyPassword: async (password) => {
    const response = await axios.post(`${API_BASE}/auth/verify`, { password });
    return response.data;
  },

  // Generation
  generate: async (conversation, config, userMessage) => {
    const response = await axios.post(`${API_BASE}/generate`, {
      conversation,
      config,
      userMessage
    });
    return response.data;
  },

  // Images
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post(`${API_BASE}/images/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  generateImage: async (prompt, style) => {
    const response = await axios.post(`${API_BASE}/images/generate`, {
      prompt,
      style
    });
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await axios.get(`${API_BASE}/health`);
    return response.data;
  },

  // Log an error to the debug dashboard
  logError: async (action, error, details = {}) => {
    try {
      await axios.post(`${API_BASE}/debug/log-error`, {
        action,
        error: typeof error === 'string' ? error : error?.message || 'Unknown error',
        details: {
          ...details,
          // Include axios error details if available
          status: error?.response?.status,
          serverMessage: error?.response?.data?.error || error?.response?.data?.details
        }
      });
    } catch (e) {
      // Silently fail - if we can't log, the server might be down
      console.error('Failed to log error to server:', e.message);
    }
  }
};
