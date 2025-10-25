import { Router, Response } from 'express';
import { PaymentService } from '../services/payment/paymentService';
import { AuthRequest } from '../types';
import { authenticate, authorize } from '../middlewares/auth';
import { sendErrorResponse } from '../utils/errorHandler';

const router = Router();
const paymentService = new PaymentService();

// Create Razorpay order
router.post('/create-order/:bookingId', authenticate, authorize('USER'), async (req: AuthRequest, res: Response) => {
  try {
    const order = await paymentService.createOrder(req.params.bookingId, req.user!.id);
    res.json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

// Verify payment
router.post('/verify', authenticate, authorize('USER'), async (req, res: Response) => {
  try {
    const payment = await paymentService.verifyPayment(req.body);
    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: payment,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

// Get payment by booking ID
router.get('/booking/:bookingId', authenticate, async (req, res: Response) => {
  try {
    const payment = await paymentService.getPaymentByBookingId(req.params.bookingId);
    res.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

// Get all payments (admin)
router.get('/', authenticate, authorize('ADMIN'), async (req, res: Response) => {
  try {
    const payments = await paymentService.getAllPayments();
    res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

export default router;
