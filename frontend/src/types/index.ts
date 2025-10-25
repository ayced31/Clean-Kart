export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'USER' | 'VENDOR' | 'ADMIN';
  address?: string;
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  description?: string;
  servicesOffered: string[];
  isApproved: boolean;
  rating: number;
  totalReviews: number;
  availableSlots?: any;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: 'LAUNDRY' | 'CLEANING' | 'CAR_WASH';
  basePrice: number;
  icon?: string;
  isActive: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  vendorId: string;
  serviceId: string;
  slotDate: string;
  slotTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';
  totalAmount: number;
  address: string;
  notes?: string;
  createdAt: string;
  service?: Service;
  vendor?: Partial<Vendor>;
  user?: Partial<User>;
  payment?: Payment;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  bookingId?: string;
  message: string;
  type: 'EMAIL' | 'SMS' | 'BOTH';
  isSent: boolean;
  sentAt?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user?: User;
    vendor?: Vendor;
    token: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
