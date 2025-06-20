// src/store/authStore.ts
import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  emailAuth: string;
  setIsAuthenticated: (value: boolean) => void;
  setEmailAuth: (value: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  emailAuth:'',
  setEmailAuth: (value)=>set({ emailAuth: value }),
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  
}));
