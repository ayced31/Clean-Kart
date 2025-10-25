import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface RegisterVendorData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  description?: string;
  servicesOffered: string[];
}

export interface CreateBookingData {
  vendorId: string;
  serviceId: string;
  slotDate: Date;
  slotTime: string;
  address: string;
  notes?: string;
}

export interface PaymentVerificationData {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  bookingId: string;
}
