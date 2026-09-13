import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api.js';

const useAuthStore = create(
  persist(
    (set, get) => ({
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
        } finally {
          get().clearAuth();
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const res = await api.get('/auth/me');
          const payload = res.data?.data || res.data;
          set({ 
            admin: payload.admin,
            isAuthenticated: true,
            isLoading: false
          });
          return payload;
        } catch (error) {
          get().clearAuth();
          throw error;
        }
      },

      clearAuth: () => set({ 
        admin: null, 
        accessToken: null, 
        isAuthenticated: false,
        isLoading: false
      })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;