import { create } from 'zustand';
import api from '../services/api.js';

// Purge any residual storage tokens so the browser never auto-authenticates
try {
  localStorage.removeItem('auth-storage');
  localStorage.removeItem('portfolio_admin_auth');
  sessionStorage.removeItem('auth-storage');
  sessionStorage.removeItem('portfolio_admin_token');
  sessionStorage.removeItem('portfolio_admin_user');
} catch (e) {}

/**
 * Auth Store:
 * Strictly memory-only session state.
 * Never persists credentials across browser reloads, visits, or tabs.
 * Always prompts for ID and Password when accessing the Admin Panel.
 */
const useAuthStore = create((set, get) => ({
  admin: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,

  setAccessToken: (token) => set({ accessToken: token }),
  
  setAdmin: (admin) => set({ admin, isAuthenticated: !!admin }),

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/auth/login', { email, password });
      const payload = res.data?.data || res.data;
      if (payload.requires2FA) {
        set({ isLoading: false });
        return payload;
      }
      set({ 
        admin: payload.admin, 
        accessToken: payload.accessToken,
        isAuthenticated: true,
        isLoading: false 
      });
      return payload;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  sendOtp: async (identifier, method = 'mobile') => {
    set({ isLoading: true });
    try {
      const res = await api.post('/auth/send-otp', { identifier, method });
      const payload = res.data?.data || res.data;
      set({ isLoading: false });
      return payload;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  verifyOtp: async ({ identifier, otp, tempToken }) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/auth/verify-otp', { identifier, otp, tempToken });
      const payload = res.data?.data || res.data;
      set({ 
        admin: payload.admin, 
        accessToken: payload.accessToken,
        isAuthenticated: true,
        isLoading: false 
      });
      return payload;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore logout network errors
    } finally {
      get().clearAuth();
    }
  },

  checkAuth: async () => {
    const currentToken = get().accessToken;
    // Without an active session token, immediately clear and abort without auto-authenticating
    if (!currentToken) {
      get().clearAuth();
      throw new Error('Not authenticated');
    }

    set({ isLoading: true });
    try {
      const res = await api.get('/auth/me');
      const payload = res.data?.data || res.data;
      const adminObj = payload?.admin || payload?.data?.admin;
      if (!adminObj) {
        get().clearAuth();
        throw new Error('Session invalid');
      }
      set({ 
        admin: adminObj,
        isAuthenticated: true,
        isLoading: false
      });
      return payload;
    } catch (error) {
      get().clearAuth();
      throw error;
    }
  },

  clearAuth: () => {
    try {
      sessionStorage.removeItem('auth-storage');
      sessionStorage.removeItem('portfolio_admin_token');
      sessionStorage.removeItem('portfolio_admin_user');
      localStorage.removeItem('auth-storage');
      localStorage.removeItem('portfolio_admin_auth');
    } catch (e) {}
    set({ 
      admin: null, 
      accessToken: null, 
      isAuthenticated: false,
      isLoading: false
    });
  }
}));

export default useAuthStore;