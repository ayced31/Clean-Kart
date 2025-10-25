import prisma from '../../db';
import { AppError } from '../../utils/errorHandler';

export class VendorService {
  // Get all vendors (with optional filters)
  async getAllVendors(filters?: { isApproved?: boolean; serviceId?: string }) {
    const where: any = {};

    if (filters?.isApproved !== undefined) {
      where.isApproved = filters.isApproved;
    }

    if (filters?.serviceId) {
      where.servicesOffered = {
        has: filters.serviceId,
      };
    }

    const vendors = await prisma.vendor.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        description: true,
        servicesOffered: true,
        isApproved: true,
        rating: true,
        totalReviews: true,
        createdAt: true,
      },
      orderBy: { rating: 'desc' },
    });

    return vendors;
  }

  // Get vendor by ID
  async getVendorById(vendorId: string) {
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        description: true,
        servicesOffered: true,
        isApproved: true,
        rating: true,
        totalReviews: true,
        availableSlots: true,
        createdAt: true,
      },
    });

    if (!vendor) {
      throw new AppError('Vendor not found', 404);
    }

    return vendor;
  }

  // Update vendor profile
  async updateVendorProfile(vendorId: string, data: any) {
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) {
      throw new AppError('Vendor not found', 404);
    }

    const updatedVendor = await prisma.vendor.update({
      where: { id: vendorId },
      data: {
        name: data.name,
        phone: data.phone,
        address: data.address,
        description: data.description,
        servicesOffered: data.servicesOffered,
        availableSlots: data.availableSlots,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        description: true,
        servicesOffered: true,
        isApproved: true,
        rating: true,
        totalReviews: true,
        availableSlots: true,
      },
    });

    return updatedVendor;
  }

  // Admin: Approve vendor
  async approveVendor(vendorId: string) {
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) {
      throw new AppError('Vendor not found', 404);
    }

    if (vendor.isApproved) {
      throw new AppError('Vendor is already approved', 400);
    }

    const updatedVendor = await prisma.vendor.update({
      where: { id: vendorId },
      data: { isApproved: true },
    });

    return updatedVendor;
  }

  // Admin: Reject vendor
  async rejectVendor(vendorId: string) {
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) {
      throw new AppError('Vendor not found', 404);
    }

    await prisma.vendor.delete({
      where: { id: vendorId },
    });

    return { message: 'Vendor rejected and removed' };
  }

  // Get vendors by service
  async getVendorsByService(serviceId: string) {
    const vendors = await prisma.vendor.findMany({
      where: {
        isApproved: true,
        servicesOffered: {
          has: serviceId,
        },
      },
      select: {
        id: true,
        name: true,
        phone: true,
        address: true,
        description: true,
        rating: true,
        totalReviews: true,
        availableSlots: true,
      },
      orderBy: { rating: 'desc' },
    });

    return vendors;
  }
}
