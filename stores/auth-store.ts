import { create } from 'zustand';
import type { User } from '../types';
import { authService } from '../services/auth-service';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  
  checkLoginStatus: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,

  checkLoginStatus: async () => {
    try {
      const isLoggedIn = await authService.isLoggedIn();
      set({ isLoggedIn });
    } catch (error) {
      console.error('Check login status error:', error);
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await authService.login(email, password);
      set({ user, isLoggedIn: true, isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.message || '登录失败，请重试' 
      });
      throw error;
    }
  },

  register: async (email: string, password: string, name: string) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await authService.register(email, password, name);
      set({ user, isLoggedIn: true, isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.message || '注册失败，请重试' 
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
      set({ user: null, isLoggedIn: false });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  clearError: () => set({ error: null }),
}));
