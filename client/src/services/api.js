import axios from 'axios';
import useAuthStore from '../store/authStore.js';
import { handleLocalRequest } from './localDataService.js';
import { notifyDataChange, extractEntityFromUrl } from './syncBus.js';

export function getEffectiveApiUrl() {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('portfolio_custom_api_url');
    if (custom && custom.trim()) return custom.trim().replace(/\/+$/, '');
  }
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim()) return envUrl.trim().replace(/\/+$/, '');
  return '/api';
}

export function isLiveBackendConfigured() {
  const url = getEffectiveApiUrl();
  return url !== '/api' && (url.startsWith('http://') || url.startsWith('https://'));
}

export function setCustomApiUrl(url) {
  if (typeof window === 'undefined') return;
  if (!url || !url.trim()) {
    localStorage.removeItem('portfolio_custom_api_url');
  } else {
    localStorage.setItem('portfolio_custom_api_url', url.trim().replace(/\/+$/, ''));
  }
  api.defaults.baseURL = getEffectiveApiUrl();
}

const isStaticHosted = 
  typeof window !== 'undefined' && 
  (window.location.hostname.includes('github.io') || window.location.protocol === 'file:');

const api = axios.create({
  baseURL: getEffectiveApiUrl(),
  timeout: isStaticHosted && !isLiveBackendConfigured() ? 1500 : 15000,
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    // Keep baseURL synchronized with latest setting
    config.baseURL = getEffectiveApiUrl();

    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // On GitHub Pages without a configured external backend, fulfill mock routes directly
    if (isStaticHosted && !isLiveBackendConfigured()) {
      try {
        const localRes = handleLocalRequest(config.method, config.url, config.data);
        if (localRes) {
          if (localRes.__errorStatus) {
            config.adapter = () =>
              Promise.reject({
                response: {
                  status: localRes.__errorStatus,
                  statusText: 'Unauthorized',
                  data: { success: false, message: localRes.message || 'Unauthorized' },
                  headers: {},
                  config,
                },
                message: localRes.message || 'Unauthorized',
                config,
              });
          } else {
            config.adapter = () =>
              Promise.resolve({
                data: localRes,
                status: 200,
                statusText: 'OK',
                headers: {},
                config,
              });
          }
        }
      } catch (err) {
        config.adapter = () => Promise.reject(err);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    // Automatically notify sync bus whenever a mutation completes successfully
    const method = response.config?.method?.toLowerCase();
    if (['post', 'put', 'patch', 'delete'].includes(method)) {
      const url = response.config?.url || '';
      if (!url.includes('/analytics/track') && !url.includes('/auth/refresh')) {
        const entity = extractEntityFromUrl(url);
        notifyDataChange(entity);
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Fallback ONLY when network call completely failed (e.g. offline / no response), NOT for actual server errors
    if (originalRequest && !error.response) {
      try {
        const localRes = handleLocalRequest(originalRequest.method, originalRequest.url, originalRequest.data);
        if (localRes) {
          if (localRes.__errorStatus) {
            return Promise.reject({
              response: {
                status: localRes.__errorStatus,
                statusText: 'Unauthorized',
                data: { success: false, message: localRes.message || 'Unauthorized' },
                headers: {},
                config: originalRequest,
              },
              message: localRes.message || 'Unauthorized',
              config: originalRequest,
            });
          }
          return {
            status: 200,
            statusText: 'OK',
            headers: {},
            config: originalRequest,
            data: localRes,
          };
        }
      } catch (e) {}
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post('/api/auth/refresh', {}, { withCredentials: true, timeout: 3000 });
        const token = data?.data?.accessToken || data?.accessToken;
        useAuthStore.getState().setAccessToken(token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const get = (url, config) => api.get(url, config);
export const post = (url, data, config) => api.post(url, data, config);
export const put = (url, data, config) => api.put(url, data, config);
export const patch = (url, data, config) => api.patch(url, data, config);
export const del = (url, config) => api.delete(url, config);

export default api;