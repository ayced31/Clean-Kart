import api from './api';
import { ApiResponse, Booking, Service } from '../types';

export const bookingService = {
  // Get all services
  getAllServices: async (): Promise<ApiResponse<Service[]>> => {
    const response = await api.get('/bookings/services');
    return response.data;
  },

  // Get services by category
  getServicesByCategory: async (category: string): Promise<ApiResponse<Service[]>> => {
    const response = await api.get(`/bookings/services/category/${category}`);
    return response.data;
  },

  // Create booking
  createBooking: async (data: {
    vendorId: string;
    serviceId: string;
    slotDate: Date;
    slotTime: string;
    address: string;
    notes?: string;
  }): Promise<ApiResponse<Booking>> => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  // Get user's bookings
  getMyBookings: async (): Promise<ApiResponse<Booking[]>> => {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  },

  // Get vendor's bookings
  getVendorBookings: async (): Promise<ApiResponse<Booking[]>> => {
    const response = await api.get('/bookings/vendor-bookings');
    return response.data;
  },

  // Get booking by ID
  getBookingById: async (id: string): Promise<ApiResponse<Booking>> => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  // Update booking status (vendor)
  updateBookingStatus: async (id: string, status: string): Promise<ApiResponse<Booking>> => {
    const response = await api.patch(`/bookings/${id}/status`, { status });
    return response.data;
  },

  // Cancel booking (user)
  cancelBooking: async (id: string): Promise<ApiResponse<Booking>> => {
    const response = await api.patch(`/bookings/${id}/cancel`);
    return response.data;
  },
};
