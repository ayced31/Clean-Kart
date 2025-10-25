import { Router, Response } from 'express';
import { AuthService } from '../services/auth/authService';
import { AuthRequest } from '../types';
import { authenticate } from '../middlewares/auth';
import { sendErrorResponse } from '../utils/errorHandler';

const router = Router();
const authService = new AuthService();

// User Registration
router.post('/register/user', async (req, res: Response) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

// Vendor Registration
router.post('/register/vendor', async (req, res: Response) => {
  try {
    const result = await authService.registerVendor(req.body);
    res.status(201).json({
      success: true,
      message: 'Vendor registered successfully',
      data: result,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

// User Login
router.post('/login/user', async (req, res: Response) => {
  try {
    const result = await authService.loginUser(req.body);
    res.json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

// Vendor Login
router.post('/login/vendor', async (req, res: Response) => {
  try {
    const result = await authService.loginVendor(req.body);
    res.json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

// Get User Profile
router.get('/profile/user', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const profile = await authService.getUserProfile(req.user!.id);
    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

// Get Vendor Profile
router.get('/profile/vendor', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const profile = await authService.getVendorProfile(req.user!.id);
    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

export default router;
