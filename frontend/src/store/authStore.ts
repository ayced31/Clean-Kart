import { create } from 'zustand';
import { User, Vendor } from '../types';

interface AuthState {
  user: User | Vendor | null;
  token: string | null;
  isAuthenticated: boolean;
  isVendor: boolean;
  setAuth: (user: User | Vendor, token: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isVendor: false,

  setAuth: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    set({
      user,
      token,
      isAuthenticated: true,
      isVendor: 'servicesOffered' in user,
    });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isVendor: false,
    });
  },

  checkAuth: () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      const user = JSON.parse(userStr);
      set({
        user,
        token,
        isAuthenticated: true,
        isVendor: 'servicesOffered' in user,
      });
    }
  },
}));
