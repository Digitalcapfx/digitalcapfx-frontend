import axios from 'axios';
import { toSnakeCase, toCamelCase } from './utils';

const api = axios.create({
  baseURL: '/api/proxy', // Route all requests through proxy
  timeout: 15500,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    let originalUrl = config.url || '';
    let method = config.method?.toUpperCase() || 'GET';

    // 1. Convert request parameters to snake_case
    if (config.params) {
      config.params = toSnakeCase(config.params);
    }

    // 2. Convert request body to snake_case
    if (config.data && !(config.data instanceof FormData)) {
      config.data = toSnakeCase(config.data);
    }

    // Append params to URL if they exist (for proxy compatibility)
    if (config.params) {
      const params = new URLSearchParams();
      Object.keys(config.params).forEach((key) => {
        if (config.params[key] !== undefined && config.params[key] !== null) {
          params.append(key, String(config.params[key]));
        }
      });
      const queryString = params.toString();
      if (queryString) {
        originalUrl += (originalUrl.includes('?') ? '&' : '?') + queryString;
      }
      config.params = undefined;
    }

    // Transform the request to proxy format
    config.method = 'POST';
    config.url = '';
    config.data = {
      endpoint: originalUrl,
      method: method,
      ...(method !== 'GET' && method !== 'HEAD' && config.data ? { body: config.data } : {}),
      headers: {},
    };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // 3. Convert response data recursively to camelCase
    if (response.data) {
      response.data = toCamelCase(response.data);
    }
    return response;
  },
  (error) => {
    // Convert error response payload keys to camelCase for client handling
    if (error.response?.data) {
      error.response.data = toCamelCase(error.response.data);
    }

    if (error.response?.status === 401) {
      console.warn('Session expired. Redirecting to login...');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('account_type');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
