// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'https://vero.pythonanywhere.com';

// base axios instance for JSON endpoints (adds Authorization via interceptor)
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token for api instance
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper to get Authorization header for raw axios calls (multipart)
const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// NOTE: Do NOT set Content-Type for FormData requests. Browser/axios adds boundary.

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Dashboard APIs
export const dashboardAPI = {
  getStats: () => api.get('/api/dashboard/stats'),
  getChartData: () => api.get('/api/dashboard/chart-data'),
  getRecentDocuments: () => api.get('/api/dashboard/recent-documents'),
};

// Document APIs
export const documentAPI = {
  getAll: (status = 'All') => api.get('/api/documents', { params: { status } }),
  getById: (id) => api.get(`/api/documents/${id}`),

  // Use raw axios.post without setting Content-Type. Provide Authorization header.
  upload: (formData) => {
    return axios.post(`${API_BASE_URL}/api/documents/upload`, formData, {
      headers: {
        ...authHeader(),
      },
    });
  },

  update: (id, data) => api.put(`/api/documents/${id}`, data),
  delete: (id) => api.delete(`/api/documents/${id}`),
};

// Project APIs (extended)
export const projectAPI = {
  getAll: () => api.get('/api/projects'),

  // simple JSON create (no file)
  create: (payload) => api.post('/api/projects', payload),

  // create with multipart/form-data (with file)
  createWithForm: (formData) => {
    return axios.post(`${API_BASE_URL}/api/projects`, formData, {
      headers: {
        ...authHeader(),
      },
    });
  },

  // update (JSON)
  update: (id, payload) => api.put(`/api/projects/${id}`, payload),

  // update with form (multipart) - use POST fallback with _method=PUT
  updateWithForm: (id, formData) => {
    return axios.post(`${API_BASE_URL}/api/projects/${id}?_method=PUT`, formData, {
      headers: {
        ...authHeader(),
      },
    });
  },

  // delete
  delete: (id) => api.delete(`/api/projects/${id}`),
};

export default api;
