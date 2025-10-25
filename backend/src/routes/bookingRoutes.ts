import { Router, Response } from 'express';
import { BookingService } from '../services/booking/bookingService';
import { AuthRequest } from '../types';
import { authenticate, authorize } from '../middlewares/auth';
import { sendErrorResponse } from '../utils/errorHandler';

const router = Router();
const bookingService = new BookingService();

// Get all services
router.get('/services', async (req, res: Response) => {
  try {
    const services = await bookingService.getAllServices();
    res.json({
      success: true,
      data: services,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

// Get services by category
router.get('/services/category/:category', async (req, res: Response) => {
  try {
    const services = await bookingService.getServicesByCategory(req.params.category);
    res.json({
      success: true,
      data: services,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

// Create a booking
router.post('/', authenticate, authorize('USER'), async (req: AuthRequest, res: Response) => {
  try {
    const booking = await bookingService.createBooking(req.user!.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

// Get user's bookings
router.get('/my-bookings', authenticate, authorize('USER'), async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await bookingService.getUserBookings(req.user!.id);
    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

// Get vendor's bookings
router.get('/vendor-bookings', authenticate, authorize('VENDOR'), async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await bookingService.getVendorBookings(req.user!.id);
    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

// Get booking by ID
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id, req.user!.id);
    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

// Update booking status (vendor)
router.patch('/:id/status', authenticate, authorize('VENDOR'), async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const booking = await bookingService.updateBookingStatus(req.params.id, status, req.user!.id);
    res.json({
      success: true,
      message: 'Booking status updated',
      data: booking,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

// Cancel booking (user)
router.patch('/:id/cancel', authenticate, authorize('USER'), async (req: AuthRequest, res: Response) => {
  try {
    const booking = await bookingService.cancelBooking(req.params.id, req.user!.id);
    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

export default router;
