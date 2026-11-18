import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// ─── Request Interceptor: attach JWT ─────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('framesafe_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: handle 401 ────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('framesafe_token');
      localStorage.removeItem('framesafe_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
