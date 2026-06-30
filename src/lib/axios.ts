import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // Inject auth token or other headers here if stored in localStorage/cookie
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('noe_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle standard global API responses, like authentication expiration
    if (error.response?.status === 401) {
      console.warn('Authentication token expired or invalid.');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('noe_token');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
