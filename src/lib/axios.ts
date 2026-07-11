import axios from 'axios';

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
    const method = config.method?.toUpperCase() || 'GET';

    // Append params to URL if they exist
    if (config.params) {
      const params = new URLSearchParams();
      Object.keys(config.params).forEach((key) => {
        if (config.params[key] !== undefined && config.params[key] !== null) {
          params.append(key, config.params[key]);
        }
      });
      const queryString = params.toString();
      if (queryString) {
        originalUrl += (originalUrl.includes('?') ? '&' : '?') + queryString;
      }
      // Remove params from axios config so they aren't appended again on proxy POST URL
      config.params = undefined;
    }

    // Transform the request to proxy format.
    // Bearer token will be appended server-side inside /api/proxy from cookies.
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
    return response;
  },
  (error) => {
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
