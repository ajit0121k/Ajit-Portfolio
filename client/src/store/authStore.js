import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../services/api.js';

// Clean up any legacy persistent localStorage auth tokens so the user is always asked for login
try {
  localStorage.removeItem('auth-storage');
  localStorage.removeItem('portfolio_admin_auth');
} catch (e) {}

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
        } catch (e) {
          // ignore logout network errors
        } finally {
          get().clearAuth();
        }
      },

      checkAuth: async () => {
        const currentToken = get().accessToken;
        // If there's no active session token, immediately clear and abort without auto-authenticating
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
    }),
    {
      name: 'auth-storage',
      // Use sessionStorage so the session is never persisted permanently across browser restarts or new windows
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        admin: state.admin
      }),
    }
  )
);

export default useAuthStore;