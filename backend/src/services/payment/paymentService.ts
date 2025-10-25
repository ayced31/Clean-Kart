import prisma from '../../db';
import { AppError } from '../../utils/errorHandler';
import { PaymentVerificationData } from '../../types';

// Payment gateway is currently under maintenance
const PAYMENT_MAINTENANCE_MODE = true;

export class PaymentService {
  // Create payment order (currently in maintenance mode)
  async createOrder(bookingId: string, userId: string) {
    // Check if payment gateway is under maintenance
    if (PAYMENT_MAINTENANCE_MODE) {
      throw new AppError('Payment gateway is currently under maintenance. Please try again later.', 503);
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payment: true },
    });

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    if (booking.userId !== userId) {
      throw new AppError('Unauthorized access', 403);
    }

    if (booking.payment && booking.payment.status === 'COMPLETED') {
      throw new AppError('Payment already completed for this booking', 400);
    }

    // Payment gateway integration would go here
    throw new AppError('Payment gateway is currently unavailable', 503);
  }

  // Verify payment (currently in maintenance mode)
  async verifyPayment(data: PaymentVerificationData) {
    // Check if payment gateway is under maintenance
    if (PAYMENT_MAINTENANCE_MODE) {
      throw new AppError('Payment gateway is currently under maintenance. Please try again later.', 503);
    }

    // Payment verification would go here
    throw new AppError('Payment gateway is currently unavailable', 503);
  }

  // Get payment by booking ID
  async getPaymentByBookingId(bookingId: string) {
    const payment = await prisma.payment.findUnique({
      where: { bookingId },
      include: {
        booking: {
          include: {
            service: true,
            vendor: {
              select: {
                name: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!payment) {
      throw new AppError('Payment not found', 404);
    }

    return payment;
  }

  // Get all payments (admin)
  async getAllPayments() {
    const payments = await prisma.payment.findMany({
      include: {
        booking: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            vendor: {
              select: {
                name: true,
              },
            },
            service: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return payments;
  }
}
