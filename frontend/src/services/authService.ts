import api from './api';
import { AuthResponse } from '../types';

export const authService = {
  // User Registration
  registerUser: async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register/user', data);
    return response.data;
  },

  // Vendor Registration
  registerVendor: async (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    description?: string;
    servicesOffered: string[];
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register/vendor', data);
    return response.data;
  },

  // User Login
  loginUser: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/login/user', data);
    return response.data;
  },

  // Vendor Login
  loginVendor: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/login/vendor', data);
    return response.data;
  },

  // Get User Profile
  getUserProfile: async () => {
    const response = await api.get('/auth/profile/user');
    return response.data;
  },

  // Get Vendor Profile
  getVendorProfile: async () => {
    const response = await api.get('/auth/profile/vendor');
    return response.data;
  },
};
