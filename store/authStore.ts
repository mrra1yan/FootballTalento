// store/authStore.ts
import { create } from 'zustand';
import type { User } from '@/types/auth';
import * as authApi from '@/lib/api/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  logout: () => Promise<void>;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  setUser: (user) => set({ user }),
  
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  
  setIsLoading: (value) => set({ isLoading: value }),
  
  logout: async () => {
    try {
      await authApi.logout();
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
  
  checkAuth: () => {
    const user = authApi.getCurrentUser();
    const isAuth = authApi.isAuthenticated();
    
    set({ 
      user, 
      isAuthenticated: isAuth,
      isLoading: false 
    });
  },
}));
