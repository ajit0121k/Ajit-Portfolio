import axios from 'axios';
import useAuthStore from '../store/authStore.js';
import { handleLocalRequest } from './localDataService.js';

const isStaticHosted = 
  typeof window !== 'undefined' && 
  (window.location.hostname.includes('github.io') || window.location.protocol === 'file:');

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: isStaticHosted && !import.meta.env.VITE_API_URL ? 1500 : 10000,
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // On GitHub Pages without a configured external backend, fulfill mock routes directly
    if (isStaticHosted && !import.meta.env.VITE_API_URL) {
      const localRes = handleLocalRequest(config.method, config.url, config.data);
      if (localRes) {
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

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Fallback ONLY when network call completely failed (e.g. offline / no response), NOT for actual server errors
    if (originalRequest && !error.response) {
      try {
        const localRes = handleLocalRequest(originalRequest.method, originalRequest.url, originalRequest.data);
        if (localRes) {
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