import { Router, Response } from 'express';
import { VendorService } from '../services/vendor/vendorService';
import { AuthRequest } from '../types';
import { authenticate, authorize } from '../middlewares/auth';
import { sendErrorResponse } from '../utils/errorHandler';

const router = Router();
const vendorService = new VendorService();

// Get all vendors (public - with filters)
router.get('/', async (req, res: Response) => {
  try {
    const { isApproved, serviceId } = req.query;
    const filters: any = {};

    if (isApproved !== undefined) {
      filters.isApproved = isApproved === 'true';
    } else {
      filters.isApproved = true; // Default to approved vendors for public
    }

    if (serviceId) {
      filters.serviceId = serviceId as string;
    }

    const vendors = await vendorService.getAllVendors(filters);
    res.json({
      success: true,
      data: vendors,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

// Get vendors by service
router.get('/by-service/:serviceId', async (req, res: Response) => {
  try {
    const vendors = await vendorService.getVendorsByService(req.params.serviceId);
    res.json({
      success: true,
      data: vendors,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

// Get vendor by ID
router.get('/:id', async (req, res: Response) => {
  try {
    const vendor = await vendorService.getVendorById(req.params.id);
    res.json({
      success: true,
      data: vendor,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

// Update vendor profile
router.put('/profile', authenticate, authorize('VENDOR'), async (req: AuthRequest, res: Response) => {
  try {
    const vendor = await vendorService.updateVendorProfile(req.user!.id, req.body);
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: vendor,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

// Admin: Approve vendor
router.patch('/:id/approve', authenticate, authorize('ADMIN'), async (req, res: Response) => {
  try {
    const vendor = await vendorService.approveVendor(req.params.id);
    res.json({
      success: true,
      message: 'Vendor approved successfully',
      data: vendor,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

// Admin: Reject vendor
router.delete('/:id/reject', authenticate, authorize('ADMIN'), async (req, res: Response) => {
  try {
    const result = await vendorService.rejectVendor(req.params.id);
    res.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

export default router;
