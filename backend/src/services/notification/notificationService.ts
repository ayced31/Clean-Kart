import { Resend } from 'resend';
import twilio from 'twilio';
import prisma from '../../db';
import { AppError } from '../../utils/errorHandler';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY || '');

// Initialize Twilio (only if credentials are provided)
let twilioClient: any = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

export class NotificationService {
  // Send email notification
  async sendEmail(to: string, subject: string, html: string) {
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'CleanKart <onboarding@resend.dev>',
        to: [to],
        subject,
        html,
      });
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  // Send SMS notification
  async sendSMS(to: string, message: string) {
    // Skip SMS if Twilio is not configured
    if (!twilioClient) {
      console.log('SMS skipped: Twilio not configured');
      return false;
    }

    try {
      await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to,
      });
      return true;
    } catch (error) {
      console.error('SMS sending failed:', error);
      return false;
    }
  }

  // Create and send booking notification
  async sendBookingNotification(bookingId: string, type: 'CREATED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED') {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: true,
        vendor: true,
        service: true,
      },
    });

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    let subject = '';
    let message = '';

    switch (type) {
      case 'CREATED':
        subject = 'Booking Created - CleanKart';
        message = `Hi ${booking.user.name}, your booking for ${booking.service.name} has been created. Booking ID: ${bookingId}`;
        break;
      case 'CONFIRMED':
        subject = 'Booking Confirmed - CleanKart';
        message = `Hi ${booking.user.name}, your booking for ${booking.service.name} has been confirmed by ${booking.vendor.name}. Date: ${booking.slotDate.toDateString()}, Time: ${booking.slotTime}`;
        break;
      case 'COMPLETED':
        subject = 'Booking Completed - CleanKart';
        message = `Hi ${booking.user.name}, your booking for ${booking.service.name} has been completed. Thank you for using CleanKart!`;
        break;
      case 'CANCELLED':
        subject = 'Booking Cancelled - CleanKart';
        message = `Hi ${booking.user.name}, your booking for ${booking.service.name} has been cancelled.`;
        break;
    }

    // Create notification record
    const notification = await prisma.notification.create({
      data: {
        userId: booking.userId,
        bookingId,
        message,
        type: 'BOTH',
      },
    });

    // Send email
    const emailHtml = `
      <h2>${subject}</h2>
      <p>${message}</p>
      <hr />
      <p><strong>Service:</strong> ${booking.service.name}</p>
      <p><strong>Vendor:</strong> ${booking.vendor.name}</p>
      <p><strong>Date:</strong> ${booking.slotDate.toDateString()}</p>
      <p><strong>Time:</strong> ${booking.slotTime}</p>
      <p><strong>Address:</strong> ${booking.address}</p>
    `;

    await this.sendEmail(booking.user.email, subject, emailHtml);

    // Send SMS if phone number exists
    if (booking.user.phone) {
      await this.sendSMS(booking.user.phone, message);
    }

    // Update notification as sent
    await prisma.notification.update({
      where: { id: notification.id },
      data: {
        isSent: true,
        sentAt: new Date(),
      },
    });

    return notification;
  }

  // Get user notifications
  async getUserNotifications(userId: string) {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return notifications;
  }
}
