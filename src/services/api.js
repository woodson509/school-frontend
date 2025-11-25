/**
 * API Service
 * Handles all HTTP requests to the backend with error handling
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Generic fetch wrapper with error handling
 */
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    // Check if offline
    if (!navigator.onLine) {
      throw new Error('You are offline. Please check your internet connection.');
    }
    throw error;
  }
};

/**
 * Authentication APIs
 */
export const authAPI = {
  login: async (email, password) => {
    return fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (userData) => {
    return fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getProfile: async () => {
    return fetchWithAuth('/auth/me');
  },
};

/**
 * Course APIs
 */
export const courseAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`/courses${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return fetchWithAuth(`/courses/${id}`);
  },

  create: async (courseData) => {
    return fetchWithAuth('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  },

  update: async (id, courseData) => {
    return fetchWithAuth(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  },

  delete: async (id) => {
    return fetchWithAuth(`/courses/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Exam APIs
 */
export const examAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`/exams${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return fetchWithAuth(`/exams/${id}`);
  },

  create: async (examData) => {
    return fetchWithAuth('/exams', {
      method: 'POST',
      body: JSON.stringify(examData),
    });
  },

  start: async (examId) => {
    return fetchWithAuth(`/exams/${examId}/start`, {
      method: 'POST',
    });
  },

  submit: async (examId, answers) => {
    return fetchWithAuth(`/exams/${examId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  },

  getAttempts: async (examId) => {
    return fetchWithAuth(`/exams/${examId}/attempts`);
  },
};

/**
 * Agent/Sales APIs
 */
export const agentAPI = {
  recordSale: async (saleData) => {
    return fetchWithAuth('/agents/sales', {
      method: 'POST',
      body: JSON.stringify(saleData),
    });
  },

  getSales: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`/agents/sales${queryString ? `?${queryString}` : ''}`);
  },

  getSaleById: async (id) => {
    return fetchWithAuth(`/agents/sales/${id}`);
  },

  updateSaleStatus: async (id, status) => {
    return fetchWithAuth(`/agents/sales/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ payment_status: status }),
    });
  },

  getDashboard: async () => {
    return fetchWithAuth('/agents/dashboard');
  },
};

/**
 * Offline Storage Helpers
 */
export const offlineStorage = {
  // Save exam attempt offline
  saveExamAttempt: (examId, data) => {
    try {
      const attempts = JSON.parse(localStorage.getItem('offline_exam_attempts') || '{}');
      attempts[examId] = {
        ...data,
        timestamp: new Date().toISOString(),
        synced: false,
      };
      localStorage.setItem('offline_exam_attempts', JSON.stringify(attempts));
      return true;
    } catch (error) {
      console.error('Error saving offline exam attempt:', error);
      return false;
    }
  },

  // Get offline exam attempt
  getExamAttempt: (examId) => {
    try {
      const attempts = JSON.parse(localStorage.getItem('offline_exam_attempts') || '{}');
      return attempts[examId] || null;
    } catch (error) {
      console.error('Error getting offline exam attempt:', error);
      return null;
    }
  },

  // Sync offline data when back online
  syncOfflineData: async () => {
    try {
      const attempts = JSON.parse(localStorage.getItem('offline_exam_attempts') || '{}');
      const syncPromises = [];

      for (const [examId, attempt] of Object.entries(attempts)) {
        if (!attempt.synced && attempt.answers) {
          syncPromises.push(
            examAPI.submit(examId, attempt.answers)
              .then(() => {
                attempt.synced = true;
                return { examId, success: true };
              })
              .catch(error => ({ examId, success: false, error }))
          );
        }
      }

      const results = await Promise.all(syncPromises);

      // Update localStorage with synced status
      localStorage.setItem('offline_exam_attempts', JSON.stringify(attempts));

      return results;
    } catch (error) {
      console.error('Error syncing offline data:', error);
      return [];
    }
  },

  // Clear synced offline data
  clearSyncedData: () => {
    try {
      const attempts = JSON.parse(localStorage.getItem('offline_exam_attempts') || '{}');
      const unsynced = {};

      for (const [examId, attempt] of Object.entries(attempts)) {
        if (!attempt.synced) {
          unsynced[examId] = attempt;
        }
      }

      localStorage.setItem('offline_exam_attempts', JSON.stringify(unsynced));
      return true;
    } catch (error) {
      console.error('Error clearing synced data:', error);
      return false;
    }
  },
};

export default {
  authAPI,
  courseAPI,
  examAPI,
  agentAPI,
  offlineStorage,
};
