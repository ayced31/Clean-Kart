import prisma from '../../db';
import { AppError } from '../../utils/errorHandler';
import { CreateBookingData } from '../../types';

export class BookingService {
  // Create a new booking
  async createBooking(userId: string, data: CreateBookingData) {
    // Verify service exists
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
    });

    if (!service) {
      throw new AppError('Service not found', 404);
    }

    // Verify vendor exists and is approved
    const vendor = await prisma.vendor.findUnique({
      where: { id: data.vendorId },
    });

    if (!vendor) {
      throw new AppError('Vendor not found', 404);
    }

    if (!vendor.isApproved) {
      throw new AppError('Vendor is not approved', 400);
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        vendorId: data.vendorId,
        serviceId: data.serviceId,
        slotDate: data.slotDate,
        slotTime: data.slotTime,
        address: data.address,
        notes: data.notes,
        totalAmount: service.basePrice,
        status: 'PENDING',
      },
      include: {
        service: true,
        vendor: {
          select: {
            id: true,
            name: true,
            phone: true,
            address: true,
          },
        },
      },
    });

    return booking;
  }

  // Get user's bookings
  async getUserBookings(userId: string) {
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        service: true,
        vendor: {
          select: {
            id: true,
            name: true,
            phone: true,
            address: true,
            rating: true,
          },
        },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return bookings;
  }

  // Get vendor's bookings
  async getVendorBookings(vendorId: string) {
    const bookings = await prisma.booking.findMany({
      where: { vendorId },
      include: {
        service: true,
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return bookings;
  }

  // Get booking by ID
  async getBookingById(bookingId: string, userId?: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        service: true,
        vendor: {
          select: {
            id: true,
            name: true,
            phone: true,
            address: true,
            rating: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        payment: true,
      },
    });

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    // If userId is provided, verify ownership
    if (userId && booking.userId !== userId) {
      throw new AppError('Unauthorized access', 403);
    }

    return booking;
  }

  // Update booking status
  async updateBookingStatus(bookingId: string, status: string, vendorId?: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    // If vendorId is provided, verify ownership
    if (vendorId && booking.vendorId !== vendorId) {
      throw new AppError('Unauthorized access', 403);
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: status as any },
      include: {
        service: true,
        vendor: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    return updatedBooking;
  }

  // Cancel booking
  async cancelBooking(bookingId: string, userId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    if (booking.userId !== userId) {
      throw new AppError('Unauthorized access', 403);
    }

    if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED') {
      throw new AppError(`Cannot cancel a ${booking.status.toLowerCase()} booking`, 400);
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
    });

    return updatedBooking;
  }

  // Get all services
  async getAllServices() {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    return services;
  }

  // Get services by category
  async getServicesByCategory(category: string) {
    const services = await prisma.service.findMany({
      where: {
        category: category.toUpperCase(),
        isActive: true,
      },
      orderBy: { name: 'asc' },
    });

    return services;
  }
}
