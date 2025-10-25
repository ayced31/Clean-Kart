import { Router, Response } from 'express';
import { NotificationService } from '../services/notification/notificationService';
import { AuthRequest } from '../types';
import { authenticate, authorize } from '../middlewares/auth';
import { sendErrorResponse } from '../utils/errorHandler';

const router = Router();
const notificationService = new NotificationService();

// Get user notifications
router.get('/', authenticate, authorize('USER'), async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await notificationService.getUserNotifications(req.user!.id);
    res.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

// Send booking notification (internal use)
router.post('/booking/:bookingId', authenticate, async (req, res: Response) => {
  try {
    const { type } = req.body;
    const notification = await notificationService.sendBookingNotification(req.params.bookingId, type);
    res.json({
      success: true,
      message: 'Notification sent successfully',
      data: notification,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

export default router;
