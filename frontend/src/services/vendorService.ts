import api from './api';
import { ApiResponse, Vendor } from '../types';

export const vendorService = {
  // Get all vendors
  getAllVendors: async (filters?: { isApproved?: boolean; serviceId?: string }): Promise<ApiResponse<Vendor[]>> => {
    const params = new URLSearchParams();
    if (filters?.isApproved !== undefined) {
      params.append('isApproved', filters.isApproved.toString());
    }
    if (filters?.serviceId) {
      params.append('serviceId', filters.serviceId);
    }
    const response = await api.get(`/vendors?${params.toString()}`);
    return response.data;
  },

  // Get vendors by service
  getVendorsByService: async (serviceId: string): Promise<ApiResponse<Vendor[]>> => {
    const response = await api.get(`/vendors/by-service/${serviceId}`);
    return response.data;
  },

  // Get vendor by ID
  getVendorById: async (id: string): Promise<ApiResponse<Vendor>> => {
    const response = await api.get(`/vendors/${id}`);
    return response.data;
  },

  // Update vendor profile
  updateVendorProfile: async (data: any): Promise<ApiResponse<Vendor>> => {
    const response = await api.put('/vendors/profile', data);
    return response.data;
  },

  // Admin: Approve vendor
  approveVendor: async (id: string): Promise<ApiResponse<Vendor>> => {
    const response = await api.patch(`/vendors/${id}/approve`);
    return response.data;
  },

  // Admin: Reject vendor
  rejectVendor: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/vendors/${id}/reject`);
    return response.data;
  },
};
