import bcrypt from 'bcryptjs';
import prisma from '../../db';
import { generateToken } from '../../utils/jwt';
import { AppError } from '../../utils/errorHandler';
import { LoginCredentials, RegisterUserData, RegisterVendorData } from '../../types';

export class AuthService {
  // User Registration
  async registerUser(data: RegisterUserData) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        address: true,
        createdAt: true,
      },
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  // Vendor Registration
  async registerVendor(data: RegisterVendorData) {
    const existingVendor = await prisma.vendor.findUnique({
      where: { email: data.email },
    });

    if (existingVendor) {
      throw new AppError('Email already registered', 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const vendor = await prisma.vendor.create({
      data: {
        ...data,
        password: hashedPassword,
        isApproved: true, // Auto-approve vendors
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
        createdAt: true,
      },
    });

    const token = generateToken({
      id: vendor.id,
      email: vendor.email,
      role: 'VENDOR',
    });

    return { vendor, token };
  }

  // User Login
  async loginUser(credentials: LoginCredentials) {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  // Vendor Login
  async loginVendor(credentials: LoginCredentials) {
    const vendor = await prisma.vendor.findUnique({
      where: { email: credentials.email },
    });

    if (!vendor) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, vendor.password);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken({
      id: vendor.id,
      email: vendor.email,
      role: 'VENDOR',
    });

    const { password, ...vendorWithoutPassword } = vendor;

    return { vendor: vendorWithoutPassword, token };
  }

  // Get User Profile
  async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        address: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  // Get Vendor Profile
  async getVendorProfile(vendorId: string) {
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
}
